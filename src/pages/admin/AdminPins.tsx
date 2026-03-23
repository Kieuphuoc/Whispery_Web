import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/admin-service';
import { Search, Trash2, Filter } from 'lucide-react';
import '@/pages/admin/AdminManagement.css';

const EMOTIONS = ['Happy', 'Sad', 'Angry', 'Excited', 'Neutral', 'Fearful', 'Disgusted'];
const EMOTION_COLORS: Record<string, string> = {
  Happy: '#dcfce7',
  Sad: '#dbeafe',
  Angry: '#fee2e2',
  Excited: '#fef9c3',
  Neutral: '#f1f5f9',
  Fearful: '#f3e8ff',
  Disgusted: '#ffedd5',
};

const AdminPins = () => {
  const [pins, setPins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [emotion, setEmotion] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadPins = (pageNum: number) => {
    setLoading(true);
    adminService.fetchPins({ page: pageNum, search, emotion, limit: 12 })
      .then(res => {
        setPins(res.data.pins || []);
        setTotalPages(res.data.totalPages || 1);
        setPage(pageNum);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timer = setTimeout(() => loadPins(1), 300);
    return () => clearTimeout(timer);
  }, [search, emotion]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Xóa vĩnh viễn Voice Pin này?')) return;
    try {
      await adminService.deletePin(id);
      loadPins(page);
    } catch (err) {
      alert('Lỗi khi xóa');
    }
  };

  return (
    <div className="admin-page fade-in">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Quản lý nội dung</h1>
          <p className="admin-page-subtitle">Khám phá và kiểm duyệt Voice Pins theo cảm xúc</p>
        </div>
      </div>

      <div className="admin-filters-bar">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Tìm theo nội dung..."
            className="admin-search-input pl-12"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button 
            className={`admin-tag ${emotion === '' ? 'active' : ''}`}
            onClick={() => setEmotion('')}
          >
            Tất cả
          </button>
          {EMOTIONS.map(e => (
            <button
              key={e}
              className={`admin-tag ${emotion === e ? 'active' : ''}`}
              onClick={() => setEmotion(e)}
              style={emotion === e ? { background: '#6366f1', color: 'white' } : {}}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-pins-grid">
        {loading ? (
          <div className="p-12 text-center text-slate-400 col-span-full">Đang tải...</div>
        ) : pins.length > 0 ? (
          pins.map(pin => (
            <div key={pin.id} className="admin-pin-card">
              <div className="relative">
                <img 
                  src={pin.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1478737270239-2fccd2c7fd94?w=800&q=80'} 
                  className="admin-pin-image"
                  alt="pin"
                />
                <div 
                  className="absolute top-4 left-4 admin-pin-emotion"
                  style={{ background: EMOTION_COLORS[pin.emotionLabel] || '#f1f5f9' }}
                >
                  {pin.emotionLabel || 'None'}
                </div>
                <button 
                  onClick={() => handleDelete(pin.id)}
                  className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="admin-pin-body">
                <div className="admin-pin-author">
                  <img 
                    src={pin.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${pin.user?.username}`} 
                    className="w-8 h-8 rounded-full"
                    alt="avatar"
                  />
                  <span className="text-sm font-bold">{pin.user?.username}</span>
                  <span className="text-[10px] text-slate-400 ml-auto">
                    {new Date(pin.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <p className="text-sm text-slate-600 line-clamp-2">
                  {pin.content || 'Ghim giọng nói không có mô tả'}
                </p>
                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                  <audio src={pin.audioUrl} controls className="h-8 max-w-[150px]" />
                  <div className="text-xs text-slate-400">ID: #{pin.id}</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-slate-400 col-span-full">Không tìm thấy bài đăng nào</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="admin-pagination mt-8">
          <button disabled={page === 1} onClick={() => loadPins(page - 1)} className="admin-pagination-btn">←</button>
          <span className="admin-pagination-info">Trang {page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => loadPins(page + 1)} className="admin-pagination-btn">→</button>
        </div>
      )}
    </div>
  );
};

export default AdminPins;
