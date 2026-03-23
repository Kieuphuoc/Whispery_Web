import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/admin-service';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@/components/admin/AnalyticsDashboard.css';

const EMOTION_COLORS: Record<string, string> = {
  Happy: '#22c55e',
  Sad: '#3b82f6',
  Angry: '#ef4444',
  Neutral: '#64748b',
  Excited: '#eab308',
  Fearful: '#a855f7',
  Disgusted: '#f97316',
};

const DEFAULT_COLOR = '#94a3b8';

interface StatCardProps {
  icon: string;
  label: string;
  value: number;
  color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <div className="admin-stat-card fade-in" style={{ '--accent': color } as React.CSSProperties}>
      <div className="admin-stat-icon" style={{ background: color + '22' }}>
        {icon}
      </div>
      <div className="admin-stat-info">
        <span className="admin-stat-value">{value.toLocaleString()}</span>
        <span className="admin-stat-label">{label}</span>
      </div>
    </div>
  );
}

const AnalyticsDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [heatmapPins, setHeatmapPins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminService.fetchPlatformStats(),
      adminService.fetchHeatmap()
    ]).then(([statsRes, heatmapRes]) => {
      setStats(statsRes.data);
      setHeatmapPins(heatmapRes.data.pins || []);
    }).catch(err => {
      console.error('Failed to fetch analytics:', err);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="admin-analytics-loading">
        <span className="spin" style={{ fontSize: 32 }}>⟳</span>
        <p>Đang xử lý dữ liệu...</p>
      </div>
    );
  }

  const emotionData = stats?.emotions?.map((e: any) => ({
    name: e.label || 'Khác',
    value: e.count
  })) || [];

  return (
    <div className="admin-analytics fade-in">
      <div className="admin-stat-summary-grid">
        <StatCard icon="👥" label="Tổng người dùng" value={stats?.users || 0} color="#6366f1" />
        <StatCard icon="🎙️" label="Tổng Voice Pins" value={stats?.pins || 0} color="#ec4899" />
      </div>

      <div className="admin-analytics-grid">
        {/* Emotion Chart */}
        <div className="admin-chart-card">
          <h3 className="admin-chart-title">Phân tích cảm xúc</h3>
          <div className="admin-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={emotionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {emotionData.map((entry: any, index: number) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={EMOTION_COLORS[entry.name] || DEFAULT_COLOR} 
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Info or another Stat */}
        <div className="admin-chart-card">
          <h3 className="admin-chart-title">Xu hướng cộng đồng</h3>
          <div className="p-4 bg-slate-50 rounded-xl flex-1 flex flex-col justify-center">
            <p className="text-sm text-slate-500 mb-2">Cảm xúc thịnh hành nhất:</p>
            <div className="text-2xl font-black text-slate-900">
              {emotionData.sort((a: any, b: any) => b.value - a.value)[0]?.name || '—'}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {emotionData.slice(0, 5).map((e: any) => (
                <div key={e.name} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-100 text-xs shadow-sm">
                  <span className="w-2 h-2 rounded-full" style={{ background: EMOTION_COLORS[e.name] || DEFAULT_COLOR }}></span>
                  {e.name}: {e.value}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Section */}
      <div className="admin-heatmap-card">
        <h3 className="admin-chart-title">Bản đồ hoạt động toàn cầu</h3>
        <div className="admin-heatmap-container">
          <MapContainer
            center={[15, 105]}
            zoom={4}
            className="w-full h-full"
            scrollWheelZoom={true}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <MarkerClusterGroup chunkedLoading>
              {heatmapPins
                .filter(p => p.latitude && p.longitude)
                .map(pin => (
                  <Marker
                    key={pin.id}
                    position={[pin.latitude, pin.longitude]}
                    icon={L.divIcon({
                      className: 'heatmap-marker',
                      html: `<div style="width: 12px; height: 12px; border-radius: 50%; background: ${EMOTION_COLORS[pin.emotionLabel] || DEFAULT_COLOR}; border: 2px solid white; box-shadow: 0 0 8px ${EMOTION_COLORS[pin.emotionLabel] || DEFAULT_COLOR}88;"></div>`,
                      iconSize: [12, 12],
                      iconAnchor: [6, 6],
                    })}
                  >
                    <Popup>
                      <div className="text-xs">
                        <strong>ID: #{pin.id}</strong><br/>
                        Cảm xúc: {pin.emotionLabel || 'Không rõ'}
                      </div>
                    </Popup>
                  </Marker>
                ))}
            </MarkerClusterGroup>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
