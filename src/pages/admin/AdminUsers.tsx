import { useEffect, useState } from 'react';
import { adminService } from '@/services/admin-service';
import { Search, UserX, UserCheck } from 'lucide-react';
import '@/pages/admin/AdminManagement.css';

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Hoạt động',
  SUSPENDED: 'Tạm khóa',
  BANNED: 'Bị cấm',
  DEACTIVATED: 'Vô hiệu'
};

const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadUsers = (pageNum: number) => {
    setLoading(true);
    adminService.fetchUsers({ page: pageNum, search, limit: 12 })
      .then(res => {
        setUsers(res.data.users || []);
        setTotalPages(res.data.totalPages || 1);
        setPage(pageNum);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timer = setTimeout(() => loadUsers(1), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleRoleChange = async (userId: number, role: string) => {
    if (!window.confirm(`Thay đổi quyền thành ${role}?`)) return;
    try {
      await adminService.updateUserStatus(userId, { role });
      loadUsers(page);
    } catch (err) {
      alert('Lỗi cập nhật quyền');
    }
  };

  const handleStatusChange = async (userId: number, status: string) => {
    try {
      await adminService.updateUserStatus(userId, { status });
      loadUsers(page);
    } catch (err) {
      alert('Lỗi cập nhật trạng thái');
    }
  };

  const getRepCls = (score: number) => {
    if (score >= 80) return 'rep-high';
    if (score >= 50) return 'rep-medium';
    return 'rep-low';
  };

  return (
    <div className="admin-page fade-in">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Quản lý người dùng</h1>
          <p className="admin-page-subtitle">Quản lý tài khoản, phân quyền và điểm uy tín</p>
        </div>
      </div>

      <div className="admin-filters-bar">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Tìm theo tên, email..."
            className="admin-search-input pl-12"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-users-table">
        <div className="admin-table-header">
          <div style={{ flex: 2 }}>Người dùng</div>
          <div>Vai trò</div>
          <div>Uy tín</div>
          <div>Trạng thái</div>
          <div style={{ width: 100 }}>Thao tác</div>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-slate-400">Đang tải...</div>
        ) : users.length > 0 ? (
          users.map(user => (
            <div key={user.id} className="admin-table-row">
              <div style={{ flex: 2 }} className="admin-user-cell-info">
                <img 
                  src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
                  className="admin-user-avatar-small" 
                  alt="avatar" 
                />
                <div>
                  <div className="font-bold text-slate-900">{user.displayName || user.username}</div>
                  <div className="text-xs text-slate-500">{user.email}</div>
                </div>
              </div>
              <div>
                <select 
                  className="role-select"
                  value={user.role}
                  onChange={e => handleRoleChange(user.id, e.target.value)}
                >
                  <option value="USER">User</option>
                  <option value="MODERATOR">Moderator</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div>
                <span className={`reputation-badge ${getRepCls(user.reputationScore)}`}>
                  ⭐ {user.reputationScore}
                </span>
              </div>
              <div>
                <span className={`admin-status-badge status-${user.status.toLowerCase()}`}>
                  {STATUS_LABELS[user.status]}
                </span>
              </div>
              <div className="flex gap-2">
                {user.status === 'BANNED' ? (
                  <button 
                    onClick={() => handleStatusChange(user.id, 'ACTIVE')}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <UserCheck size={18} />
                  </button>
                ) : (
                  <button 
                    onClick={() => handleStatusChange(user.id, 'BANNED')}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <UserX size={18} />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-slate-400">Không tìm thấy người dùng nào</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="admin-pagination mt-6">
          <button disabled={page === 1} onClick={() => loadUsers(page - 1)} className="admin-pagination-btn">←</button>
          <span className="admin-pagination-info">Trang {page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => loadUsers(page + 1)} className="admin-pagination-btn">→</button>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
