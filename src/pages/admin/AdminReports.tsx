import { useEffect, useState } from 'react';
import { adminService } from '@/services/admin-service';
import { X } from 'lucide-react';
import '@/pages/admin/AdminReports.css';

const REASON_LABELS: Record<string, string> = {
  SPAM: 'Spam',
  HARASSMENT: 'Quấy rối',
  HATE_SPEECH: 'Ngôn từ thù hận',
  VIOLENCE: 'Bạo lực',
  NUDITY: 'Nội dung nhạy cảm',
  MISINFORMATION: 'Thông tin sai lệch',
  COPYRIGHT: 'Vi phạm bản quyền',
  OTHER: 'Lý do khác'
};

const VIOLATION_TAGS = ['SPAM', 'HATE_SPEECH', 'VIOLENCE', 'NUDITY', 'MISINFORMATION', 'HARASSMENT', 'COPYRIGHT'];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: 'Chờ duyệt', color: '#eab308', bg: 'rgba(234,179,8,0.12)' },
  UNDER_REVIEW: { label: 'Đang xem xét', color: '#38bdf8', bg: 'rgba(56,189,248,0.12)' },
  RESOLVED: { label: 'Xác nhận VP', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  DISMISSED: { label: 'Bỏ qua', color: '#64748b', bg: 'rgba(100,116,139,0.12)' },
};

function ViolationBadge({ count }: { count: number }) {
  const cls = count >= 3 ? 'vc-3' : count === 2 ? 'vc-2' : count === 1 ? 'vc-1' : 'vc-0';
  return <span className={`violation-counter ${cls}`}>⚠ {count} / 3</span>;
}

interface ReviewModalProps {
  report: any;
  onClose: () => void;
  onSuccess: () => void;
}

function ReviewModal({ report, onClose, onSuccess }: ReviewModalProps) {
  const [status, setStatus] = useState(report.status);
  const [note, setNote] = useState(report.moderatorNote || '');
  const [score, setScore] = useState(report.violationScore ?? 5);
  const [tags, setTags] = useState<string[]>(report.violationTags || [report.reason]);
  const [saving, setSaving] = useState(false);

  const toggleTag = (tag: string) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminService.reviewReport(report.id, {
        status,
        moderatorNote: note,
        violationTags: tags,
        violationScore: score
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Lỗi khi lưu.');
    } finally {
      setSaving(false);
    }
  };

  const handleUnban = async () => {
    if (!window.confirm(`Xác nhận bỏ lệnh cấm đăng bài cho ${report.voicePin?.user?.username}?`)) return;
    try {
      await adminService.unbanUser(report.voicePin?.user?.id);
      alert('Đã bỏ lệnh cấm thành công!');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Lỗi.');
    }
  };

  const vp = report.voicePin;
  const author = vp?.user;

  return (
    <div className="admin-modal-backdrop" onClick={e => e.currentTarget === e.target && onClose()}>
      <div className="admin-modal fade-in">
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">🔍 Xem xét Report #{report.id}</h2>
          <button className="admin-modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="admin-modal-body">
          {/* VoicePin Info */}
          <div className="admin-modal-section">
            <span className="admin-info-label">Thông tin bài đăng</span>
            {vp && (
              <div className="admin-voicepin-info">
                <div className="admin-info-row">
                  <span className="label">Tác giả:</span>
                  <span>{author?.username || 'N/A'}</span>
                </div>
                <div className="admin-info-row">
                  <span className="label">Nội dung:</span>
                  <span>{vp.content || 'N/A'}</span>
                </div>
                <div className="admin-info-row">
                  <span className="label">Thời gian:</span>
                  <span>{new Date(vp.createdAt).toLocaleString('vi-VN')}</span>
                </div>
              </div>
            )}
          </div>

          {/* Report Details */}
          <div className="admin-modal-section">
            <span className="admin-info-label">Chi tiết báo cáo</span>
            <div className="admin-report-details">
              <div className="admin-info-row">
                <span className="label">Người báo cáo:</span>
                <span>{report.reporter?.username || 'Ẩn danh'}</span>
              </div>
              <div className="admin-info-row">
                <span className="label">Lý do:</span>
                <span>{REASON_LABELS[report.reason] || report.reason}</span>
              </div>
              <div className="admin-info-row">
                <span className="label">Mô tả:</span>
                <span>{report.description || 'N/A'}</span>
              </div>
              <div className="admin-info-row">
                <span className="label">Lần vi phạm:</span>
                <ViolationBadge count={author?.violationCount || 0} />
              </div>
            </div>
          </div>

          {/* Review Section */}
          <div className="admin-modal-section">
            <span className="admin-info-label">Xem xét</span>
            <div className="admin-review-form">
              <div className="admin-form-group">
                <label>Trạng thái</label>
                <select value={status} onChange={e => setStatus(e.target.value)}>
                  {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label>Điểm vi phạm (0-10)</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={score}
                  onChange={e => setScore(parseInt(e.target.value))}
                  className="admin-slider"
                />
                <span>{score}/10</span>
              </div>

              <div className="admin-form-group">
                <label>Tags vi phạm</label>
                <div className="admin-tags">
                  {VIOLATION_TAGS.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      className={`admin-tag ${tags.includes(tag) ? 'active' : ''}`}
                      onClick={() => toggleTag(tag)}
                    >
                      {REASON_LABELS[tag] || tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="admin-form-group">
                <label>Ghi chú (không bắt buộc)</label>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Nhập ghi chú của bạn..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="admin-modal-actions">
            <button
              onClick={handleSave}
              disabled={saving}
              className="admin-btn admin-btn-primary"
            >
              {saving ? '⟳ Đang lưu...' : '💾 Lưu'}
            </button>
            <button
              onClick={handleUnban}
              className="admin-btn admin-btn-warning"
            >
              🔓 Bỏ cấm
            </button>
            <button
              onClick={onClose}
              className="admin-btn admin-btn-secondary"
            >
              ✕ Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const AdminReports = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadReports = (pageNum: number) => {
    setLoading(true);
    adminService.fetchReports({ page: pageNum, limit: 10 })
      .then(res => {
        setReports(res.data.reports || []);
        setTotalPages(res.data.totalPages || 1);
        setPage(pageNum);
      })
      .catch(err => console.error('Failed to fetch reports:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReports(1);
  }, []);

  const handleReviewSuccess = () => {
    loadReports(page);
  };

  if (loading) {
    return (
      <div className="admin-page-loading">
        <span className="spin">⟳</span>
        <p>Đang tải báo cáo...</p>
      </div>
    );
  }

  return (
    <div className="admin-page fade-in">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Báo cáo vi phạm</h1>
          <p className="admin-page-subtitle">Danh sách báo cáo chờ xem xét</p>
        </div>
      </div>

      <div className="admin-reports-container">
        <div className="admin-reports-list">
          {reports.length > 0 ? (
            reports.map(report => (
              <div
                key={report.id}
                className="admin-report-card"
                onClick={() => setSelectedReport(report)}
              >
                <div className="admin-report-header">
                  <span className="admin-badge" style={{ color: STATUS_CONFIG[report.status]?.color }}>
                    {STATUS_CONFIG[report.status]?.label || report.status}
                  </span>
                  <span className="admin-reason">{REASON_LABELS[report.reason] || report.reason}</span>
                </div>
                <div className="admin-report-content">
                  <div className="admin-author">
                    <strong>{report.voicePin?.user?.username || 'N/A'}</strong>
                  </div>
                  <p className="admin-title">{report.voicePin?.content || 'Không có nội dung'}</p>
                  <div className="admin-report-meta">
                    <span>ID: #{report.id}</span>
                    <span>👤 {report.reporter?.username || 'Ẩn danh'}</span>
                    <span>{new Date(report.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
                <div className="admin-report-action">→</div>
              </div>
            ))
          ) : (
            <div className="admin-empty-state">
              <p>✅ Không có báo cáo nào chờ xem xét</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="admin-pagination">
            <button
              disabled={page === 1}
              onClick={() => loadReports(page - 1)}
              className="admin-pagination-btn"
            >
              ← Trước
            </button>
            <span className="admin-pagination-info">
              Trang {page} / {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => loadReports(page + 1)}
              className="admin-pagination-btn"
            >
              Sau →
            </button>
          </div>
        )}
      </div>

      {selectedReport && (
        <ReviewModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onSuccess={handleReviewSuccess}
        />
      )}
    </div>
  );
};

export default AdminReports;
