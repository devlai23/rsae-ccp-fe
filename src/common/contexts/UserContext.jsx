import React, { useEffect, useState } from 'react';

import { auth, googleProvider } from '@/firebase-config';
import {
  deleteUser,
  getAdditionalUserInfo,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import PropTypes from 'prop-types';

export const UserContext = React.createContext({
  user: null,
  isLoading: false,
  isAuthorizing: false,
  logout: () => {},
  login: () => {},
  googleAuth: () => {},
  requestPasswordReset: () => {},
});

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const buildUrl = (endpoint) =>
  `${import.meta.env.VITE_BACKEND_URL.replace(/\/$/, '')}${endpoint}`;

const extractBackendError = async (response, fallbackMessage) => {
  const body = await response.json().catch(() => null);
  return body?.error || fallbackMessage;
};

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  useEffect(() => {
    if (!auth?.app) {
      setUser(null);
      setIsLoading(false);
      return () => {};
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();
          const response = await fetch(buildUrl('/auth/profile'), {
            headers: { Authorization: `Bearer ${idToken}` },
          });

          if (response.ok) {
            const backendUserData = await response.json();
            setUser({ ...firebaseUser, ...backendUserData });
          } else {
            setUser(null);
          }
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    if (!auth?.app) {
      throw new Error('Firebase is not configured in frontend .env');
    }

    setIsAuthorizing(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await credential.user.getIdToken();
      const response = await fetch(buildUrl('/auth/profile'), {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      if (!response.ok) {
        await signOut(auth);
        throw new Error(
          await extractBackendError(
            response,
            'This account is not authorized to access the application.'
          )
        );
      }

      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsAuthorizing(false);
    }
  };

  const logout = async () => {
    if (!auth?.app) {
      setUser(null);
      return true;
    }

    try {
      await signOut(auth);
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Signs in with Google popup and syncs the user to the MySQL backend.
  const googleAuth = async () => {
    if (!auth?.app || !googleProvider) {
      throw new Error(
        'Firebase Google auth is not configured in frontend .env'
      );
    }

    setIsAuthorizing(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const info = getAdditionalUserInfo(result);

      if (info?.isNewUser) {
        try {
          await deleteUser(result.user);
        } catch (deleteError) {
          console.warn('Failed to delete unauthorized new Google user:', deleteError);
        }

        await signOut(auth);
        throw new Error(
          'This Google account is not authorized. Ask an administrator to provision your account first.'
        );
      }

      const idToken = await result.user.getIdToken();

      const response = await fetch(buildUrl('/auth/token'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        await signOut(auth);
        throw new Error(
          await extractBackendError(
            response,
            'This Google account is not authorized to access the application.'
          )
        );
      }
    } catch (error) {
      console.error('Google auth error:', error);
      throw new Error(
        error?.message || 'Failed to complete Google authentication'
      );
    } finally {
      setIsAuthorizing(false);
    }
  };

  const requestPasswordReset = async (email) => {
    if (!auth?.app) {
      throw new Error('Firebase is not configured in frontend .env');
    }

    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
    }
  };

  const contextValue = {
    user,
    isLoading,
    isAuthorizing,
    login,
    logout,
    googleAuth,
    requestPasswordReset,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export const useUser = () => {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
