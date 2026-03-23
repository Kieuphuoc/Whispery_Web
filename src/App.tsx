import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/shared/AuthContext';
import { AdminAuthProvider, AdminUserContext } from '@/shared/AdminAuthContext';
import { useContext } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Home from '@/pages/Home';
import Profile from '@/pages/Profile';
import Memory from '@/pages/Memory';

// Admin Pages
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminReports from '@/pages/admin/AdminReports';
import AdminAuditLogs from '@/pages/admin/AdminAuditLogs';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminPins from '@/pages/admin/AdminPins';
import AdminLayout from '@/components/admin/AdminLayout';
import ErrorBoundary from '@/components/shared/ErrorBoundary';

const queryClient = new QueryClient();

const AdminAuthGate = ({ children }: { children: React.ReactNode }) => {
  const adminUser = useContext(AdminUserContext);
  if (adminUser) return <Navigate to="/admin/dashboard" replace />;
  return <>{children}</>;
};

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const adminUser = useContext(AdminUserContext);
  if (!adminUser) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/login" element={<AdminAuthGate><AdminLogin /></AdminAuthGate>} />
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
            <Route path="/admin/reports" element={<AdminProtectedRoute><AdminReports /></AdminProtectedRoute>} />
            <Route path="/admin/users" element={<AdminProtectedRoute><AdminUsers /></AdminProtectedRoute>} />
            <Route path="/admin/pins" element={<AdminProtectedRoute><AdminPins /></AdminProtectedRoute>} />
            <Route path="/admin/audit-logs" element={<AdminProtectedRoute><AdminAuditLogs /></AdminProtectedRoute>} />
          </Route>

          {/* User Routes - Public Access */}
          <Route element={<AppShell />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/home" element={<Home />} />
            <Route path="/memory" element={<Memory />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* Default Redirection */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AdminAuthProvider>
          <AppRoutes />
        </AdminAuthProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
