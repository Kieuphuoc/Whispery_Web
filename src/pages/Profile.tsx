import { useContext, useState, useEffect } from 'react';
import { MyUserContext } from '@/shared/AuthContext';
import { CheckCircle2, Users, Mic, Grid, List, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { userService } from '@/services/user-service';
import { voiceService } from '@/services/voice-service';
import type { VoicePin } from '@/shared/types';
import { cn } from '@/shared/utils';
import { getMeta } from '@/components/memory/MemoryCard';

interface ProfileGridItemProps {
    pin: VoicePin;
    onPress?: () => void;
}

const ProfileGridItem = ({ pin, onPress }: ProfileGridItemProps) => {
    const meta = getMeta(pin.emotionLabel);
    return (
        <div 
            onClick={onPress}
            className="aspect-square relative overflow-hidden bg-gray-100 cursor-pointer group"
        >
            {pin.imageUrl ? (
                <img src={pin.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            ) : (
                <div className={cn("w-full h-full flex flex-col items-center justify-center p-2", meta.bg)}>
                    <div style={{ color: meta.color }}>{meta.icon}</div>
                    <div className="w-full h-1 bg-current opacity-20 rounded-full mt-2 self-center max-w-[50%]" />
                </div>
            )}
            {/* Hover overlay with stats */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4 text-white font-bold text-sm">
                <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> {pin.reactionsCount || 0}
                </div>
            </div>
        </div>
    );
};

const Profile = () => {
    const userContext = useContext(MyUserContext);
    const [profile, setProfile] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [publicPins, setPublicPins] = useState<VoicePin[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [pRes, sRes, vRes] = await Promise.all([
                    userService.fetchMe(),
                    userService.fetchMeStats().catch(() => ({ data: {} })),
                    voiceService.fetchPublicByUser(userContext?.id?.toString() || '').catch(() => ({ data: [] })),
                ]);

                setProfile(pRes.data);
                setStats(sRes.data);
                setPublicPins(Array.isArray(vRes.data) ? vRes.data : vRes.data?.data || []);
            } catch (e) {
                console.error('Profile fetch error:', e);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, [userContext?.id]);

    const displayName = profile?.displayName || userContext?.displayName || userContext?.username || 'User';
    const avatarUri = profile?.avatar || 'https://jbagy.me/wp-content/uploads/2025/03/anh-avatar-vo-tri-meo-1.jpg';
    const bio = profile?.bio || 'Hành trình âm thanh của tôi 🎙️✨';
    const level = profile?.level || 1;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="min-h-full bg-white pb-24">
            {/* Instagram Header Structure */}
            <div className="px-5 pt-8 pb-6">
                <div className="flex items-center gap-8 mb-6">
                    {/* Avatar with Story Ring Effect */}
                    <div className="relative">
                        <div className="absolute -inset-1.5 bg-gradient-to-tr from-purple-600 via-pink-500 to-yellow-400 rounded-full p-[2px] animate-pulse">
                            <div className="bg-white rounded-full p-[2px] h-full w-full" />
                        </div>
                        <img 
                            src={avatarUri} 
                            alt="" 
                            className="relative w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm" 
                        />
                        <button className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full border-2 border-white shadow-md">
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="flex-1 flex justify-around">
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-bold text-gray-900">{stats?.voicePinCount || 0}</span>
                            <span className="text-xs text-gray-500 font-medium">Pins</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-bold text-gray-900">{stats?.friendCount || 0}</span>
                            <span className="text-xs text-gray-500 font-medium">Bạn bè</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-bold text-gray-900">{level}</span>
                            <span className="text-xs text-gray-500 font-medium">Cấp độ</span>
                        </div>
                    </div>
                </div>

                {/* Bio Section */}
                <div className="mb-6">
                    <div className="flex items-center gap-1.5 mb-0.5">
                        <h1 className="text-base font-bold text-gray-900 font-outfit">{displayName}</h1>
                        <CheckCircle2 className="w-4 h-4 text-primary fill-primary/10" />
                    </div>
                    <span className="text-xs font-semibold text-gray-400 mb-2 block tracking-wide uppercase">Duyệt âm • Lãng du</span>
                    <p className="text-[14px] text-gray-600 leading-relaxed font-medium">
                        {bio}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 rounded-lg h-9 text-xs font-bold border-gray-200 hover:bg-gray-50">
                        Chỉnh sửa
                    </Button>
                    <Button variant="outline" className="flex-1 rounded-lg h-9 text-xs font-bold border-gray-200 hover:bg-gray-50">
                        Chia sẻ
                    </Button>
                    <Button variant="outline" className="w-9 h-9 rounded-lg p-0 flex items-center justify-center border-gray-200 hover:bg-gray-50">
                        <Users className="w-4 h-4 text-gray-600" />
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-t border-gray-100">
                <button 
                    onClick={() => setActiveTab('grid')}
                    className={cn(
                        "flex-1 h-12 flex items-center justify-center transition-all duration-300 relative",
                        activeTab === 'grid' ? "text-primary" : "text-gray-400"
                    )}
                >
                    <Grid className="w-5 h-5" />
                    {activeTab === 'grid' && <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-primary animate-in fade-in slide-in-from-top-1" />}
                </button>
                <button 
                    onClick={() => setActiveTab('list')}
                    className={cn(
                        "flex-1 h-12 flex items-center justify-center transition-all duration-300 relative",
                        activeTab === 'list' ? "text-primary" : "text-gray-400"
                    )}
                >
                    <List className="w-5 h-5" />
                    {activeTab === 'list' && <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-primary animate-in fade-in slide-in-from-top-1" />}
                </button>
            </div>

            {/* Grid Content */}
            {activeTab === 'grid' ? (
                <div className="grid grid-cols-3 gap-[1px]">
                    {publicPins.length > 0 ? (
                        publicPins.map((pin) => (
                            <ProfileGridItem key={pin.id} pin={pin} />
                        ))
                    ) : (
                        <div className="col-span-3 py-20 flex flex-col items-center justify-center text-gray-300 gap-4">
                            <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center">
                                <Mic className="w-8 h-8 opacity-40" />
                            </div>
                            <span className="text-sm font-bold">Chưa có ký ức nào</span>
                        </div>
                    )}
                </div>
            ) : (
                <div className="p-4 space-y-4">
                    {/* List view placeholder or reuse MemoryCard */}
                    {publicPins.map((pin) => (
                        <div key={pin.id} className="flex gap-4 items-center p-3 rounded-2xl bg-gray-50/50 border border-gray-100">
                             <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200">
                                {pin.imageUrl && <img src={pin.imageUrl} className="w-full h-full object-cover" />}
                             </div>
                             <div className="flex-1">
                                <h4 className="text-sm font-bold text-gray-900">{pin.content || 'Ký ức giọng nói'}</h4>
                                <p className="text-[11px] text-gray-400 mt-1">{new Date(pin.createdAt).toLocaleDateString()}</p>
                             </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Profile;
