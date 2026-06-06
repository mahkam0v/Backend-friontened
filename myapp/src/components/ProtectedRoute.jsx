import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { token, isAdmin } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  // Bug 4 fix: /dashboard -> /dashboard/todos
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard/todos" replace />;
  return children;
}
