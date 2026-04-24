import { Navigate } from 'react-router-dom';

/**
 * Account creation by email is no longer used; admin access is via Google on /login.
 * Keep /signup as a stable URL that sends users to the admin portal login.
 */
export default function SignUp() {
  return <Navigate to='/login' replace />;
}
