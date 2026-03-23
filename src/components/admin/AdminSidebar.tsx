import { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, AlertCircle, FileText, Users, Mic, LogOut, Home } from 'lucide-react';
import { AdminUserContext, AdminDispatchContext } from '@/shared/AdminAuthContext';
import '@/components/admin/AdminSidebar.css';

const AdminSidebar = () => {
  const adminUser = useContext(AdminUserContext);
  const dispatch = useContext(AdminDispatchContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Bạn chắc chắn muốn đăng xuất?')) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      dispatch?.({ type: 'LOGOUT_ADMIN' });
      navigate('/admin/login');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/admin/dashboard', label: 'Tổng quan', icon: <BarChart3 size={20} /> },
    { path: '/admin/users', label: 'Người dùng', icon: <Users size={20} /> },
    {path: '/admin/pins', label: 'Nội dung', icon: <Mic size={20} />},
    { path: '/admin/reports', label: 'Báo cáo', icon: <AlertCircle size={20} /> },
    { path: '/admin/audit-logs', label: 'Nhật ký', icon: <FileText size={20} /> },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <Link to="/admin/dashboard" className="admin-sidebar-logo">
          <span className="admin-logo-icon">🎙</span>
          <span className="admin-logo-text">Whisper</span>
        </Link>
      </div>

      <nav className="admin-sidebar-nav">
        <div className="admin-nav-section">
          <h3 className="admin-nav-title">Menu</h3>
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="admin-nav-divider" />

        <div className="admin-nav-section">
          <h3 className="admin-nav-title">Khác</h3>
          <Link to="/" className="admin-nav-item">
            <Home size={20} />
            <span>Về trang chính</span>
          </Link>
        </div>
      </nav>

      <div className="admin-sidebar-footer">
        <div className="admin-user-info">
          <div className="admin-user-avatar">👤</div>
          <div className="admin-user-details">
            <div className="admin-user-name">{adminUser?.username || 'Admin'}</div>
            <div className="admin-user-role">{adminUser?.role || 'Quản trị viên'}</div>
          </div>
        </div>
        <button onClick={handleLogout} className="admin-logout-btn" title="Đăng xuất">
          <LogOut size={20} />
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
