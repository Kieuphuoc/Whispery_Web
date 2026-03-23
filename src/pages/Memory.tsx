import React, { useState, useMemo, useContext } from 'react';
import { useMyPins } from '@/hooks/useMyPins';
import { MemoryCard, getMeta } from '@/components/memory/MemoryCard';
import { HistoryCalendar } from '@/components/memory/HistoryCalendar';
import { VoicePinTurntable } from '@/components/home/VoicePinTurntable';
import { Search, X, Smile, Calendar, Lock, MapPin, BookOpen, ChevronRight, Music, Users, Globe } from 'lucide-react';
import { cn } from '@/shared/utils';
import { MyUserContext } from '@/shared/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { VoicePin } from '@/types';

const Memory = () => {
    type FilterType = 'mood' | 'time' | 'visibility' | 'location' | 'diary';

    const FILTERS: { key: FilterType; label: string; icon: React.ReactNode }[] = useMemo(() => [
        { key: 'mood', label: 'Tâm trạng', icon: <Smile size={16} /> },
        { key: 'diary', label: 'Nhật ký', icon: <BookOpen size={16} /> },
        { key: 'time', label: 'Thời gian', icon: <Calendar size={16} /> },
        { key: 'visibility', label: 'Quyền riêng tư', icon: <Lock size={16} /> },
        { key: 'location', label: 'Địa điểm', icon: <MapPin size={16} /> },
    ], []);

    const { pins, loading } = useMyPins();
    const user = useContext(MyUserContext);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<FilterType>('mood');
    const [selectedPin, setSelectedPin] = useState<VoicePin | null>(null);

    const filtered = useMemo(() => {
        if (!searchQuery.trim()) return pins;
        const q = searchQuery.toLowerCase();
        return pins.filter(p =>
            (p.content?.toLowerCase().includes(q)) ||
            (p.address?.toLowerCase().includes(q)) ||
            (p.emotionLabel?.toLowerCase().includes(q))
        );
    }, [pins, searchQuery]);

    const sections = useMemo(() => {
        const result: { key: string; title: string; icon: React.ReactNode; color: string; pins: VoicePin[] }[] = [];
        const now = new Date();

        if (activeFilter === 'time') {
            const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const recent = filtered.filter(p => new Date(p.createdAt) >= sevenDaysAgo);
            if (recent.length > 0) result.push({ key: 'recent', title: 'Mới thêm gần đây', icon: <Calendar />, color: '#8b5cf6', pins: recent });

            const thisMonth = filtered.filter(p => {
                const d = new Date(p.createdAt);
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            });
            if (thisMonth.length > 0) result.push({ key: 'month', title: 'Tháng này', icon: <Calendar />, color: '#3b82f6', pins: thisMonth });
        }

        if (activeFilter === 'mood') {
            const emotionMap: Record<string, VoicePin[]> = {};
            for (const p of filtered) {
                const key = p.emotionLabel ?? 'Khác';
                (emotionMap[key] = emotionMap[key] ?? []).push(p);
            }
            Object.entries(emotionMap).forEach(([emotion, epins]) => {
                const meta = getMeta(emotion);
                result.push({ key: `emo-${emotion}`, title: meta.label, icon: meta.icon, color: meta.color, pins: epins });
            });
        }

        if (activeFilter === 'visibility') {
            const visMap: Record<string, VoicePin[]> = {};
            for (const p of filtered) {
                const key = p.visibility ?? 'PRIVATE';
                (visMap[key] = visMap[key] ?? []).push(p);
            }
            const VIS_META: Record<string, { label: string, icon: any, color: string }> = {
                'PRIVATE': { label: 'Chỉ mình tôi', icon: <Lock size={16} />, color: '#64748b' },
                'FRIENDS': { label: 'Bạn bè', icon: <Users size={16} />, color: '#3b82f6' },
                'PUBLIC': { label: 'Công khai', icon: <Globe size={16} />, color: '#10b981' }
            };
            Object.entries(visMap).forEach(([vis, vpins]) => {
                const meta = VIS_META[vis] || VIS_META['PRIVATE'];
                result.push({ key: `vis-${vis}`, title: meta.label, icon: meta.icon, color: meta.color, pins: vpins });
            });
        }

        return result;
    }, [filtered, activeFilter]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-24 overflow-x-hidden">
            <header className="pt-8 px-6 pb-6">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-outfit">Ký ức của tôi</h1>
                <div className="flex items-center gap-2 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <p className="text-gray-400 font-semibold text-xs uppercase tracking-wider">
                        {pins.length > 0 ? `${pins.length} khoảnh khắc đã lưu` : 'Bắt đầu hành trình'}
                    </p>
                </div>
            </header>

            {/* Premium Search */}
            <div className="px-6 mb-8 mt-2">
                <div className="relative group">
                    <div className={cn(
                        "flex items-center gap-3 px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl transition-all duration-300 group-focus-within:bg-white group-focus-within:border-primary/20 group-focus-within:shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
                    )}>
                        <Search className="w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Tìm ký ức, địa điểm..."
                            className="flex-1 bg-transparent outline-none text-[15px] font-medium placeholder:text-gray-300 text-gray-700"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-4 h-4 text-gray-400" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Filter Tabs - Instagram Style Pills */}
            <div className="flex overflow-x-auto gap-3 px-6 mb-10 no-scrollbar">
                {FILTERS.map((f) => (
                    <button
                        key={f.key}
                        onClick={() => setActiveFilter(f.key)}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-all duration-300 border",
                            activeFilter === f.key 
                                ? "bg-gray-900 text-white border-gray-900 shadow-xl shadow-gray-200 scale-[1.05]" 
                                : "bg-white text-gray-400 border-gray-100 hover:border-gray-200 hover:text-gray-600"
                        )}
                    >
                        <span className={cn("transition-colors", activeFilter === f.key ? "text-white" : "text-gray-300")}>
                            {f.icon}
                        </span>
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            {activeFilter === 'diary' ? (
                <HistoryCalendar 
                    pins={filtered} 
                    onSelectPin={setSelectedPin} 
                    startDate={user?.createdAt}
                    onPressAddToday={() => navigate('/home')}
                />
            ) : (
                <div className="space-y-12">
                    {sections.length > 0 ? sections.map((s) => (
                        <div key={s.key} className="space-y-6">
                            <div className="flex items-center justify-between px-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gray-50 border border-gray-100 shadow-sm" style={{ color: s.color }}>
                                        {s.icon}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900 font-outfit">{s.title}</h2>
                                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tighter">{s.pins.length} ký ức</p>
                                    </div>
                                </div>
                                <button className="flex items-center gap-1 text-primary font-bold text-[13px] hover:translate-x-1 transition-transform">
                                    Tất cả <ChevronRight size={14} strokeWidth={2.5} />
                                </button>
                            </div>
                            <div className="flex overflow-x-auto gap-5 px-6 pb-6 no-scrollbar">
                                {s.pins.map((pin) => (
                                    <MemoryCard 
                                        key={pin.id} 
                                        pin={pin} 
                                        onPress={() => setSelectedPin(pin)}
                                        className="min-w-[280px] max-w-[280px]"
                                    />
                                ))}
                                {/* Add a "View More" card like Instagram */}
                                <div className="min-w-[120px] flex items-center justify-center">
                                    <button className="w-12 h-12 rounded-full border-2 border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="flex flex-col items-center justify-center pt-24 text-gray-300 gap-6">
                            <div className="w-24 h-24 rounded-full bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center animate-pulse">
                                <Music className="w-10 h-10 opacity-20 text-primary" />
                            </div>
                            <div className="text-center">
                                <span className="font-bold text-gray-900 block mb-1">Hư vô...</span>
                                <span className="text-sm font-medium">Không tìm thấy ký ức nào phù hợp</span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {selectedPin && (
                <VoicePinTurntable pin={selectedPin} onClose={() => setSelectedPin(null)} />
            )}
        </div>
    );
};

export default Memory;
