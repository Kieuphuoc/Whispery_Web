import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/admin-service';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import '@/pages/admin/AdminDashboard.css';

const REASON_LABELS: Record<string, string> = {
  SPAM: 'Spam',
  HARASSMENT: 'Quấy rối',
  HATE_SPEECH: 'Thù hận',
  VIOLENCE: 'Bạo lực',
  NUDITY: 'Nhạy cảm',
  MISINFORMATION: 'Sai lệch',
  COPYRIGHT: 'Bản quyền',
  OTHER: 'Khác'
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: 'Chờ duyệt', color: '#eab308', bg: 'rgba(234,179,8,0.12)' },
  UNDER_REVIEW: { label: 'Đang xem xét', color: '#38bdf8', bg: 'rgba(56,189,248,0.12)' },
  RESOLVED: { label: 'Vi phạm', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  DISMISSED: { label: 'Bỏ qua', color: '#64748b', bg: 'rgba(100,116,139,0.12)' },
};

interface StatCardProps {
  icon: string;
  label: string;
  value: number | undefined;
  color: string;
  delta?: string;
}

function StatCard({ icon, label, value, color, delta }: StatCardProps) {
  return (
    <div className="admin-stat-card fade-in" style={{ '--accent': color } as React.CSSProperties}>
      <div className="admin-stat-icon" style={{ background: color + '22' }}>
        {icon}
      </div>
      <div className="admin-stat-info">
        <span className="admin-stat-value">{value ?? '—'}</span>
        <span className="admin-stat-label">{label}</span>
        {delta && <span className="admin-stat-delta" style={{ color }}>{delta}</span>}
      </div>
    </div>
  );
}

interface ReportStats {
  total?: number;
  pending?: number;
  underReview?: number;
  resolved?: number;
  dismissed?: number;
  byReason?: Array<{ reason: string; count: number }>;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [latestReports, setLatestReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminService.fetchReportStats(),
      adminService.fetchReports({ limit: 5, page: 1 })
    ]).then(([statsRes, reportsRes]) => {
      setStats(statsRes.data);
      setLatestReports(reportsRes.data.reports || []);
    }).catch(err => {
      console.error('Failed to fetch dashboard data:', err);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="admin-page-loading">
        <span className="spin" style={{ fontSize: 32 }}>⟳</span>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="admin-page fade-in">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Tổng quan</h1>
          <p className="admin-page-subtitle">Thống kê báo cáo vi phạm hệ thống Whisper</p>
        </div>
        <div className="admin-page-date">
          {new Date().toLocaleDateString('vi-VN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        <StatCard icon="📨" label="Tổng báo cáo" value={stats?.total} color="#a78bfa" />
        <StatCard icon="⏳" label="Chờ duyệt" value={stats?.pending} color="#eab308" />
        <StatCard icon="🔍" label="Đang xem xét" value={stats?.underReview} color="#38bdf8" />
        <StatCard icon="❌" label="Đã xác nhận VP" value={stats?.resolved} color="#ef4444" />
        <StatCard icon="✅" label="Đã bỏ qua" value={stats?.dismissed} color="#22c55e" />
      </div>

      {/* Analytics Insight */}
      <h3 className="admin-section-title">Thống kê nền tảng</h3>
      <AnalyticsDashboard />

      {/* Latest Reports */}
      <div className="admin-latest-reports">
        <h3 className="admin-section-title">Báo cáo mới nhất</h3>
        <div className="admin-reports-table">
          <div className="admin-table-header">
            <div>ID</div>
            <div>Loại</div>
            <div>Lý do</div>
            <div>Trạng thái</div>
            <div>Ngày tạo</div>
          </div>
          {latestReports.length > 0 ? (
            latestReports.map(report => (
              <div key={report.id} className="admin-table-row">
                <div>#{report.id}</div>
                <div>{report.reportType || 'Nội dung'}</div>
                <div>{REASON_LABELS[report.reason] || report.reason}</div>
                <div>
                  <span
                    className="admin-status-badge"
                    style={{
                      color: STATUS_CONFIG[report.status]?.color,
                      background: STATUS_CONFIG[report.status]?.bg,
                    }}
                  >
                    {STATUS_CONFIG[report.status]?.label || report.status}
                  </span>
                </div>
                <div>{new Date(report.createdAt).toLocaleDateString('vi-VN')}</div>
              </div>
            ))
          ) : (
            <div className="admin-table-empty">Không có báo cáo nào</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
