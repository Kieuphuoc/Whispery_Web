import type { VoicePin } from '@/types';
import { cn } from '@/shared/utils';
import { MapPin, Headset, Heart, Mic, Sun, CloudRain, Leaf, Hourglass, Heart as HeartIcon, Telescope, Flame } from 'lucide-react';

export const EMOTION_META: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
    Happy: { color: '#facc15', bg: 'bg-yellow-400/10', icon: <Sun className="w-4 h-4" />, label: 'Vui vế' },
    Sad: { color: '#60a5fa', bg: 'bg-blue-400/10', icon: <CloudRain className="w-4 h-4" />, label: 'Buồn bã' },
    Calm: { color: '#34d399', bg: 'bg-emerald-400/10', icon: <Leaf className="w-4 h-4" />, label: 'Bình yên' },
    Nostalgic: { color: '#f472b6', bg: 'bg-pink-400/10', icon: <Hourglass className="w-4 h-4" />, label: 'Nhớ nhung' },
    Romantic: { color: '#fb7185', bg: 'bg-rose-400/10', icon: <HeartIcon className="w-4 h-4" />, label: 'Lãng mạn' },
    Curious: { color: '#a78bfa', bg: 'bg-violet-400/10', icon: <Telescope className="w-4 h-4" />, label: 'Tò mò' },
    Angry: { color: '#f87171', bg: 'bg-red-400/10', icon: <Flame className="w-4 h-4" />, label: 'Bực bội' },
};

const DEFAULT_META = { color: '#8b5cf6', bg: 'bg-primary/10', icon: <Mic className="w-4 h-4" />, label: 'Khác' };

export const getMeta = (label?: string) => label ? (EMOTION_META[label] ?? DEFAULT_META) : DEFAULT_META;

export const Waveform = ({ color, barCount = 20 }: { color: string; barCount?: number }) => {
    const bars = Array.from({ length: barCount }).map((_, i) => {
        const norm = i / (barCount - 1);
        const base = Math.sin(norm * Math.PI) * 0.7 + 0.3;
        const random = 0.85 + Math.random() * 0.3;
        return Math.min(1, base * random);
    });

    return (
        <div className="flex items-end gap-[1.5px] h-6 mt-2">
            {bars.map((h, i) => (
                <div
                    key={i}
                    className="w-[2.5px] rounded-full"
                    style={{ 
                        height: `${4 + h * 18}px`, 
                        backgroundColor: color,
                        opacity: 0.4 + h * 0.5
                    }}
                />
            ))}
        </div>
    );
};

interface MemoryCardProps {
    pin: VoicePin;
    onPress?: () => void;
    className?: string;
}

export const MemoryCard = ({ pin, onPress, className }: MemoryCardProps) => {
    const meta = getMeta(pin.emotionLabel);
    const dateStr = new Date(pin.createdAt).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: 'short',
    });

    return (
        <div 
            onClick={onPress}
            className={cn(
                "group relative bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm active:scale-[0.98] transition-all cursor-pointer",
                className
            )}
        >
            {/* Mood Badge */}
            <div className={cn("absolute top-3 left-3 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md", meta.bg)}>
                <span style={{ color: meta.color }}>{meta.icon}</span>
            </div>

            {/* Image Placeholder/Image */}
            <div className="w-full aspect-[4/3] bg-gray-50 flex items-center justify-center overflow-hidden">
                {pin.imageUrl ? (
                    <img src={pin.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <Mic className="w-10 h-10 opacity-10" style={{ color: meta.color }} />
                )}
            </div>

            {/* Content */}
            <div className="p-4 pt-3">
                <h3 className="text-[15px] font-bold text-gray-900 line-clamp-2 leading-tight mb-1 font-outfit">
                    {pin.content || 'Ký ức giọng nói'}
                </h3>
                
                <div className="flex items-center gap-1 text-[12px] text-gray-400 mb-2">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{pin.address || 'Không rõ vị trí'}</span>
                </div>

                <Waveform color={meta.color} />

                <div className="flex items-center justify-between mt-3">
                    <span className="text-[12px] font-medium text-gray-300">{dateStr}</span>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-[12px] text-gray-400">
                            <Headset className="w-3 h-3" />
                            <span>{pin.listensCount ?? 0}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[12px] text-primary font-bold">
                            <Heart className="w-3 h-3 fill-current" />
                            <span>{pin.reactionsCount ?? 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
