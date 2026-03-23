import { useState, useRef } from 'react';
import { WebMapContainer } from '@/components/home/MapContainer';
import { VoiceButton } from '@/components/home/VoiceButton';
import { useLocation } from '@/hooks/useLocation';
import { useVisibility } from '@/hooks/useVisibility';
import { useVoicePins } from '@/hooks/useVoicePins';
import { Navigation, User, Settings, Users, Globe, Search, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VoicePinTurntable } from '@/components/home/VoicePinTurntable';
import type { VoicePin } from '@/types';
import type { BoundingBox } from '@/hooks/useVoicePins';

const DEFAULT_LOCATION = {
    coords: {
        latitude: 10.7769,
        longitude: 106.7009,
    },
    timestamp: Date.now(),
};

export default function Home() {
    const { location: sensorLocation } = useLocation();
    const location = sensorLocation || DEFAULT_LOCATION;
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const { visibility, setVisibility } = useVisibility("PUBLIC");
    const [bbox, setBbox] = useState<BoundingBox | undefined>(undefined);
    const { data: pins = [] } = useVoicePins(visibility, bbox);
    const [isRecording, setIsRecording] = useState(false);
    const [selectedPin, setSelectedPin] = useState<VoicePin | null>(null);
    const mapRef = useRef<{ animateToRegion: (region: { latitude: number; longitude: number }) => void } | null>(null);

    const visibilityOptions = [
        { id: 'PRIVATE', icon: Lock, label: 'Private', color: 'bg-pink-500' },
        { id: 'FRIENDS', icon: Users, label: 'Friends', color: 'bg-purple-500' },
        { id: 'PUBLIC', icon: Globe, label: 'Public', color: 'bg-cyan-500' },
    ] as const;

    const handleRegionChangeComplete = (region: { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number }) => {
        setBbox({
            minLat: region.latitude - region.latitudeDelta / 2,
            maxLat: region.latitude + region.latitudeDelta / 2,
            minLng: region.longitude - region.longitudeDelta / 2,
            maxLng: region.longitude + region.longitudeDelta / 2,
        });
    };

    const recenterMap = () => {
        if (location && mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            });
        }
    };

    const toggleRecording = () => {
        setIsRecording(!isRecording);
    };

    return (
        <div className="relative flex-1 flex flex-col w-full h-full overflow-hidden bg-white">
            <WebMapContainer
                ref={mapRef}
                location={location}
                pins={pins}
                onRegionChangeComplete={handleRegionChangeComplete}
                onSelectPin={setSelectedPin}
            />

            {/* Blur Overlay */}
            {isFilterOpen && (
                <div 
                    className="fixed inset-0 z-[2000] bg-black/10 backdrop-blur-sm transition-all duration-300 animate-in fade-in"
                    onClick={() => setIsFilterOpen(false)}
                />
            )}

            {/* Top Branding */}
            <div className="fixed top-8 left-8 z-[1000] drop-shadow-sm">
                <h1 className="text-3xl font-black text-gray-900 font-outfit tracking-tighter">
                    Whispery
                </h1>
            </div>

            {/* Top Right Actions */}
            <div className={`fixed top-8 right-8 flex flex-col gap-4 transition-all duration-300 ${isFilterOpen ? 'z-[2100]' : 'z-[1000]'}`}>
                <button className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                    <User className="w-6 h-6 text-gray-800" />
                </button>
                <button className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                    <Settings className="w-6 h-6 text-gray-800" />
                </button>
                
                {/* Visibility Menu Arc (Top Right) */}
                <div className="relative">
                    {isFilterOpen && visibilityOptions.map((opt, i) => {
                        // Calculate positions to radiate evenly to the left
                        // 145 (Top-Left), 180 (Left), 215 (Bottom-Left)
                        const angle = 145 + (i * 35); 
                        const radian = (angle * Math.PI) / 180;
                        const radius = 80;
                        const x = Math.cos(radian) * radius;
                        const y = Math.sin(radian) * radius;

                        const IconComponent = opt.icon;

                        return (
                            <button
                                key={opt.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setVisibility(opt.id);
                                    setIsFilterOpen(false);
                                }}
                                className={`absolute w-10 h-10 rounded-xl ${opt.color} flex items-center justify-center shadow-xl z-[2100] transition-all duration-300 hover:scale-110 active:scale-95 animate-in zoom-in slide-in-from-top-5`}
                                style={{
                                    left: `calc(50% + ${x}px)`,
                                    top: `calc(50% + ${y}px - 12px)`,
                                    transform: 'translate(-50%, -50%)',
                                    transitionDelay: `${i * 50}ms`
                                }}
                            >
                                <IconComponent className="w-5 h-5 text-white" />
                            </button>
                        );
                    })}

                    <button 
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`w-12 h-12 rounded-2xl ${isFilterOpen ? 'bg-white text-black' : 'glass-card text-gray-800'} flex items-center justify-center shadow-lg hover:scale-105 transition-all duration-300 z-[2100] relative`}
                    >
                        {(() => {
                            const activeOpt = visibilityOptions.find(o => o.id === visibility);
                            const ActiveIcon = activeOpt?.icon || Globe;
                            return <ActiveIcon className="w-6 h-6" />;
                        })()}
                    </button>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="fixed bottom-8 left-0 right-0 z-[1000] px-8 flex justify-between items-end pointer-events-none">
                <div className="flex gap-4 pointer-events-auto">
                    <button className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center shadow-xl hover:scale-105 transition-transform">
                        <Search className="w-6 h-6 text-white" />
                    </button>
                </div>

                <div className="flex gap-4 pointer-events-auto">
                    <div className="h-14 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center justify-center shadow-xl text-white font-bold text-xl">
                        32
                    </div>
                </div>
            </div>

            <VoiceButton 
                isRecording={isRecording} 
                onPress={toggleRecording} 
            />

            <Button
                variant="outline"
                size="icon"
                onClick={recenterMap}
                className={`fixed bottom-32 right-8 w-12 h-12 rounded-full glass-card shadow-lg z-[1000] border-none transition-opacity duration-300 ${isFilterOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
                <Navigation className="w-5 h-5 text-gray-800" />
            </Button>
            
            {selectedPin && (
                <VoicePinTurntable pin={selectedPin} onClose={() => setSelectedPin(null)} />
            )}
        </div>
    );
}
