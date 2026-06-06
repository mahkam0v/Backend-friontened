import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import AdminUsersPage from './pages/AdminUsersPage';
import UserTodosPage from './pages/UserTodosPage';
import ProfilePage from './pages/ProfilePage';

const theme = extendTheme({
  fonts: {
    heading: `'Segoe UI', system-ui, sans-serif`,
    body: `'Segoe UI', system-ui, sans-serif`,
  },
  styles: {
    global: {
      body: { bg: 'gray.50' },
    },
  },
  components: {
    Button: {
      baseStyle: { borderRadius: 'lg', fontWeight: 500 },
    },
    Input: {
      defaultProps: { focusBorderColor: 'blue.500' },
    },
  },
});

function RootRedirect() {
  const { token, user } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return <Navigate to={user?.role === 'admin' ? '/admin/users' : '/dashboard/todos'} replace />;
}

export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            {/* Admin routes */}
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute adminOnly>
                  <AdminUsersPage />
                </ProtectedRoute>
              }
            />

            {/* User routes */}
            <Route
              path="/dashboard/todos"
              element={
                <ProtectedRoute>
                  <UserTodosPage />
                </ProtectedRoute>
              }
            />

            {/* Shared */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<RootRedirect />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ChakraProvider>
  );
}
