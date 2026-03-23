import { useEffect, useState } from 'react';
import { adminService } from '@/services/admin-service';
import '@/pages/admin/AdminAuditLogs.css';

interface AuditLog {
  id: string | number;
  action: string;
  administrator?: { username: string };
  targetUser?: { username: string };
  targetReport?: { id: string | number };
  details?: string;
  createdAt: string;
}

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadLogs = (pageNum: number) => {
    setLoading(true);
    adminService.fetchAuditLogs({ page: pageNum, limit: 15 })
      .then(res => {
        setLogs(res.data.logs || []);
        setTotalPages(res.data.totalPages || 1);
        setPage(pageNum);
      })
      .catch(err => console.error('Failed to fetch audit logs:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLogs(1);
  }, []);

  const getActionIcon = (action: string) => {
    const icons: Record<string, string> = {
      'REVIEW': '🔍',
      'APPROVE': '✅',
      'REJECT': '❌',
      'BAN': '🚫',
      'UNBAN': '🔓',
      'UPDATE': '🔄',
      'DELETE': '🗑️',
    };
    return icons[action] || '📝';
  };

  if (loading) return (
    <div className="admin-page-loading">
      <span className="spin">⟳</span>
      <p>Đang tải nhật ký...</p>
    </div>
  );

  return (
    <div className="admin-page fade-in">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Nhật ký hoạt động</h1>
          <p className="admin-page-subtitle">Lịch sử các hành động quản trị</p>
        </div>
      </div>

      <div className="admin-audit-logs-container">
        <div className="admin-audit-logs-list">
          {logs.length > 0 ? (
            logs.map(log => (
              <div key={log.id} className="admin-audit-log-card">
                <div className="admin-audit-log-header">
                  <span className="admin-audit-icon">{getActionIcon(log.action)}</span>
                  <span className="admin-audit-action">{log.action}</span>
                  <span className="admin-audit-time">
                    {new Date(log.createdAt).toLocaleString('vi-VN')}
                  </span>
                </div>
                <div className="admin-audit-log-content">
                  {log.administrator && (
                    <div className="admin-audit-info">
                      <span className="label">Admin:</span>
                      <span>{log.administrator.username}</span>
                    </div>
                  )}
                  {log.targetUser && (
                    <div className="admin-audit-info">
                      <span className="label">Người dùng:</span>
                      <span>{log.targetUser.username}</span>
                    </div>
                  )}
                  {log.targetReport && (
                    <div className="admin-audit-info">
                      <span className="label">Report:</span>
                      <span>#{log.targetReport.id}</span>
                    </div>
                  )}
                  {log.details && (
                    <div className="admin-audit-details">
                      {log.details}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="admin-empty-state">
              <p>📭 Không có nhật ký nào</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="admin-pagination">
            <button
              disabled={page === 1}
              onClick={() => loadLogs(page - 1)}
              className="admin-pagination-btn"
            >
              ← Trước
            </button>
            <span className="admin-pagination-info">
              Trang {page} / {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => loadLogs(page + 1)}
              className="admin-pagination-btn"
            >
              Sau →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAuditLogs;
