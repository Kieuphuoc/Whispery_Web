import { useState, useEffect, useRef } from 'react';
import type { VoicePin } from '@/types';
import { X, Play, Pause, Heart, MapPin, Clock, Globe, Users, Lock, Flag, Languages } from 'lucide-react';
import { cn } from '@/shared/utils';

interface VoicePinTurntableProps {
    pin: VoicePin;
    onClose: () => void;
}

const VISIBILITY_ICON: Record<string, any> = {
    PUBLIC: <Globe className="w-3 h-3" />,
    FRIENDS: <Users className="w-3 h-3" />,
    PRIVATE: <Lock className="w-3 h-3" />,
};

const EMOTION_COLORS: Record<string, string> = {
    Happy: '#facc15',
    Sad: '#60a5fa',
    Calm: '#34d399',
    Nostalgic: '#f472b6',
    Romantic: '#fb7185',
    Curious: '#a78bfa',
    Angry: '#f87171',
};

export const VoicePinTurntable = ({ pin, onClose }: VoicePinTurntableProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [showTranscription, setShowTranscription] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [reactionCount] = useState(pin.reactionsCount ?? 0);

    const emotionColor = EMOTION_COLORS[pin.emotionLabel || ''] || '#8b5cf6';

    useEffect(() => {
        if (pin.audioUrl) {
            audioRef.current = new Audio(pin.audioUrl);
            audioRef.current.onended = () => setIsPlaying(false);
        }
        return () => {
            audioRef.current?.pause();
            audioRef.current = null;
        };
    }, [pin.audioUrl]);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current?.pause();
        } else {
            audioRef.current?.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(onClose, 400); // Match animation duration in index.css
    };

    return (
        <div 
            className={cn(
                "fixed inset-0 z-[1000] flex items-end sm:items-center justify-center sm:p-6 bg-black/60 backdrop-blur-xl transition-opacity duration-500",
                isExiting ? "opacity-0" : "opacity-100"
            )}
            onClick={handleClose}
        >
            <div 
                className={cn(
                    "relative w-full sm:max-w-[420px] bg-white rounded-t-[32px] sm:rounded-[40px] p-5 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto no-scrollbar",
                    isExiting ? "animate-slide-down" : "animate-slide-up"
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Mobile Handle */}
                <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4 sm:hidden" />

                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <div>
                        {pin.emotionLabel && (
                            <div 
                                className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border flex items-center gap-1.5"
                                style={{ backgroundColor: `${emotionColor}15`, borderColor: `${emotionColor}30`, color: emotionColor }}
                            >
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: emotionColor }} />
                                {pin.emotionLabel}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors border border-gray-100">
                            <Flag className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={handleClose}
                            className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Vinyl Plate */}
                <div className="relative aspect-square w-full max-w-[200px] sm:max-w-none mx-auto bg-gray-50 rounded-[32px] flex items-center justify-center mb-4 shadow-inner overflow-hidden border border-gray-100">
                    <div 
                        className={cn(
                            "relative w-[85%] aspect-square rounded-full border-[12px] border-gray-100 shadow-2xl transition-transform duration-[6000ms] linear border-double",
                            isPlaying ? "animate-spin" : ""
                        )}
                        style={{ boxShadow: `0 0 50px ${emotionColor}25` }}
                    >
                        <img 
                            src={pin.imageUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80'} 
                            alt="" 
                            className="w-full h-full object-cover rounded-full opacity-90 ring-1 ring-black/5"
                        />
                        {/* Vinyl Center */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-12 h-12 rounded-full bg-black/80 flex items-center justify-center border-4 border-black/20">
                                <div className="w-3 h-3 rounded-full bg-white/30" />
                            </div>
                        </div>
                    </div>

                    {/* Play/Pause Overlay */}
                    <button 
                        onClick={togglePlay}
                        className="absolute inset-0 z-20 flex items-center justify-center group"
                    >
                        <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform border border-white/40 shadow-xl">
                            {isPlaying ? <Pause className="fill-current w-8 h-8" /> : <Play className="fill-current w-8 h-8 ml-1" />}
                        </div>
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                            {pin.user?.avatar ? <img src={pin.user.avatar} alt="" className="w-full h-full object-cover" /> : <Users className="w-5 h-5 text-gray-400" />}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-black text-gray-900">{pin.isAnonymous ? 'Ẩn danh' : (pin.user?.displayName || 'Người dùng')}</span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{pin.visibility?.toLowerCase()}</span>
                        </div>
                    </div>

                    <h2 className="text-xl sm:text-3xl font-black text-gray-900 leading-[1.1] tracking-tight">
                        {pin.content || 'Ký ức giọng nói'}
                    </h2>

                    {/* Transcription Area */}
                    <div className="space-y-3">
                        <button 
                            onClick={() => setShowTranscription(!showTranscription)}
                            className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest bg-primary/5 px-4 py-2 rounded-full border border-primary/10 hover:bg-primary/10 transition-colors"
                        >
                            <Languages className="w-3 h-3" />
                            {showTranscription ? 'Ẩn phiên âm' : 'Xem phiên âm'}
                        </button>
                        {showTranscription && (
                            <div className="p-5 bg-gray-50 rounded-[24px] border border-gray-100 text-[15px] text-gray-600 leading-relaxed font-medium animate-in slide-in-from-top-4 duration-500">
                                {pin.transcription || 'Chưa có bản phiên âm cho âm thanh này.'}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        <div className="flex items-center gap-1.5 hover:text-gray-600 transition-colors cursor-default">
                            <MapPin className="w-3.5 h-3.5" />
                            {pin.address || 'Không rõ vị trí'}
                        </div>
                        <div className="flex items-center gap-1.5 hover:text-gray-600 transition-colors cursor-default">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(pin.createdAt).toLocaleDateString('vi-VN', { 
                                day: '2-digit', 
                                month: 'short', 
                                year: 'numeric' 
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-gray-900 font-black text-xs uppercase tracking-widest">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                            {VISIBILITY_ICON[pin.visibility || 'PUBLIC']}
                        </div>
                        {pin.visibility === 'PUBLIC' ? 'Công khai' : pin.visibility === 'FRIENDS' ? 'Bạn bè' : 'Riêng tư'}
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="flex items-center gap-2 group">
                            <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-500 group-active:scale-90 transition-transform">
                                <Heart className="w-5 h-5 fill-current" />
                            </div>
                            <span className="text-xl font-black text-gray-900">{reactionCount}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
