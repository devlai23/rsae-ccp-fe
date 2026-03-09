import React, { useEffect, useState } from 'react';

import { auth, googleProvider } from '@/firebase-config';
import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import PropTypes from 'prop-types';

const dashboardDevBypass = import.meta.env.VITE_DASHBOARD_DEV_BYPASS === 'true';

export const UserContext = React.createContext({
  user: null,
  isLoading: false,
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

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(!dashboardDevBypass);

  useEffect(() => {
    if (dashboardDevBypass) {
      setUser({
        uid: 'dev-admin-uid',
        email: 'admin@local.dev',
        role: 'admin',
        username: 'admin',
      });
      setIsLoading(false);
      return () => {};
    }

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
            setUser(firebaseUser);
          }
        } catch {
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    if (dashboardDevBypass) {
      setUser({
        uid: 'dev-admin-uid',
        email: email || 'admin@local.dev',
        role: 'admin',
        username: 'admin',
      });
      return true;
    }

    if (!auth?.app) {
      throw new Error('Firebase is not configured in frontend .env');
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    if (dashboardDevBypass) {
      setUser(null);
      return true;
    }

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
    if (dashboardDevBypass) {
      setUser({
        uid: 'dev-admin-uid',
        email: 'admin@local.dev',
        role: 'admin',
        username: 'admin',
      });
      return true;
    }

    if (!auth?.app || !googleProvider) {
      throw new Error(
        'Firebase Google auth is not configured in frontend .env'
      );
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      await fetch(buildUrl('/auth/token'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
    } catch (error) {
      console.error('Google auth error:', error);
      throw new Error('Failed to complete Google authentication');
    }
  };

  const requestPasswordReset = async (email) => {
    if (dashboardDevBypass) {
      return !!email;
    }

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
