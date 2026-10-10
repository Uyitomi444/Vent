import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, currentUser } = useAuthStore();
  const location = useLocation();

  // Strict enforcement: User must be authenticated, have a valid user record, username, and email
  const isAuthorized = Boolean(
    isAuthenticated && 
    currentUser && 
    currentUser.username && 
    currentUser.email
  );

  if (!isAuthorized) {
    const redirectUrl = `/auth?redirect=${encodeURIComponent(location.pathname)}`;
    return <Navigate to={redirectUrl} replace />;
  }

  return <>{children}</>;
}
