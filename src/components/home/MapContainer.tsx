import { useState, forwardRef, useImperativeHandle } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import type { VoicePin } from "@/types";
import { Mic, Sparkles, Navigation } from "lucide-react";
import { renderToString } from "react-dom/server";

// Fix Leaflet default icon issues in React
import "leaflet/dist/leaflet.css";

const createCustomIcon = (isAR: boolean, avatarUrl?: string) => {
    try {
        const iconHtml = renderToString(
            <div className="relative">
                <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '20px', 
                    backgroundColor: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    border: '3px solid white',
                    boxShadow: '0 8px 16px -4px rgb(0 0 0 / 0.2)',
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    <img 
                        src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${isAR ? 'ar' : 'mic'}`} 
                        alt="avatar" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    
                    {/* Status badge example */}
                    <div style={{
                        position: 'absolute',
                        top: -2,
                        left: -2,
                        backgroundColor: isAR ? '#a855f7' : '#ec4899',
                        color: 'white',
                        fontSize: '8px',
                        fontWeight: 'bold',
                        padding: '2px 4px',
                        borderRadius: '6px',
                        zIndex: 10
                    }}>
                        {isAR ? 'in APP' : 'LIVE'}
                    </div>
                </div>
                {/* Pointer */}
                <div style={{ 
                    width: 0, 
                    height: 0, 
                    borderLeft: '6px solid transparent', 
                    borderRight: '6px solid transparent', 
                    borderTop: '10px solid white', 
                    margin: '0 auto',
                    marginTop: '-2px'
                }}></div>
            </div>
        );

        return L.divIcon({
            html: `<div>${iconHtml}</div>`,
            className: 'custom-div-icon',
            iconSize: [48, 58],
            iconAnchor: [24, 58],
            popupAnchor: [0, -58],
        });
    } catch (e) {
        console.error("Error creating custom icon:", e);
        return new L.Icon.Default();
    }
};

interface MapEventsProps {
    onRegionChangeComplete?: (region: { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number }) => void;
}

const MapEvents = ({ onRegionChangeComplete }: MapEventsProps) => {
    const map = useMapEvents({
        moveend: () => {
            const bounds = map.getBounds();
            const center = map.getCenter();
            if (onRegionChangeComplete) {
                onRegionChangeComplete({
                    latitude: center.lat,
                    longitude: center.lng,
                    latitudeDelta: Math.abs(bounds.getNorth() - bounds.getSouth()),
                    longitudeDelta: Math.abs(bounds.getEast() - bounds.getWest()),
                });
            }
        },
    });
    return null;
};

interface MapContainerProps {
    location: { coords: { latitude: number; longitude: number } } | null;
    pins: VoicePin[];
    onSelectPin?: (pin: VoicePin | null) => void;
    onRegionChangeComplete?: (region: any) => void;
}

export const WebMapContainer = forwardRef((props: MapContainerProps, ref) => {
    const { location, pins, onSelectPin, onRegionChangeComplete } = props;
    const [map, setMap] = useState<L.Map | null>(null);

    useImperativeHandle(ref, () => ({
        animateToRegion: (region: any) => {
            if (map) {
                map.flyTo([region.latitude, region.longitude], 15);
            }
        }
    }));

    if (!location) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-gray-50 text-gray-400 gap-4">
                <Navigation className="w-8 h-8 animate-pulse" />
                <span className="text-sm font-medium">Đang lấy vị trí...</span>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full">
            <MapContainer
                center={[location.coords.latitude, location.coords.longitude]}
                zoom={15}
                className="w-full h-full z-0"
                scrollWheelZoom={true}
                zoomControl={false}
                ref={setMap}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                
                <MapEvents onRegionChangeComplete={onRegionChangeComplete} />

                {/* User Location Marker */}
                <Marker 
                    position={[location.coords.latitude, location.coords.longitude]}
                    icon={L.divIcon({
                        className: 'user-location-marker',
                        html: '<div style="width: 20px; height: 20px; border-radius: 50%; background-color: #3b82f6; border: 3px solid white; box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);"></div>',
                        iconSize: [20, 20],
                        iconAnchor: [10, 10],
                    })}
                />

                <MarkerClusterGroup
                    chunkedLoading
                    maxClusterRadius={60}
                >
                    {Array.isArray(pins) && pins
                        .filter(pin => 
                            pin && 
                            typeof pin.latitude === 'number' && 
                            typeof pin.longitude === 'number' &&
                            !isNaN(pin.latitude) && 
                            !isNaN(pin.longitude)
                        )
                        .map((pin) => (
                            <Marker
                                key={pin.id}
                                position={[pin.latitude, pin.longitude]}
                                icon={createCustomIcon(pin.type === 'HIDDEN_AR', pin.user?.avatar)}
                                eventHandlers={{
                                    click: () => onSelectPin?.(pin),
                                }}
                            >
                                <Popup className="custom-popup">
                                    <div className="p-1 min-w-[150px]">
                                        <div className="flex items-center gap-2 mb-1">
                                            {pin.type === 'HIDDEN_AR' ? <Sparkles className="w-4 h-4 text-purple-500" /> : <Mic className="w-4 h-4 text-red-500" />}
                                            <span className="font-bold text-xs truncate">
                                                {pin.type === 'HIDDEN_AR' ? "Giọng nói AR ẩn" : pin.content || "Ghim giọng nói"}
                                            </span>
                                        </div>
                                        {pin.address && <p className="text-[10px] text-gray-400 mb-2 truncate">{pin.address}</p>}
                                        <button 
                                            className="w-full py-1.5 bg-purple-50 text-purple-600 rounded-lg text-[11px] font-bold"
                                            onClick={() => onSelectPin?.(pin)}
                                        >
                                            Xem chi tiết
                                        </button>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                </MarkerClusterGroup>
            </MapContainer>
        </div>
    );
});

WebMapContainer.displayName = "WebMapContainer";
