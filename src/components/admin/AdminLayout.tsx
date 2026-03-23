import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { AdminUserContext } from '@/shared/AdminAuthContext';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const adminUser = useContext(AdminUserContext);

  if (!adminUser) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <main style={{ 
        flex: 1, 
        marginLeft: 240, 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        overflowY: 'auto'
      }}>
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default AdminLayout;
