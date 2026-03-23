import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import type { BoundingBox } from '@/hooks/useVoicePins';
import type { VoicePin } from '@/shared/types';
import { VoiceType } from '@/shared/types';
import { ensureLeafletMarkerIcons } from '@/components/map/LeafletSetup';
import L from 'leaflet';

const FALLBACK_LAT = 10.7769;
const FALLBACK_LNG = 106.7009;

function quantizeBounds(b: BoundingBox): BoundingBox {
  return {
    minLat: Number(b.minLat.toFixed(5)),
    maxLat: Number(b.maxLat.toFixed(5)),
    minLng: Number(b.minLng.toFixed(5)),
    maxLng: Number(b.maxLng.toFixed(5)),
  };
}

function BBoxListener({ onBBoxChange }: { onBBoxChange: (bbox: BoundingBox) => void }) {
  const timerRef = useRef<number | null>(null);

  useMapEvents({
    moveend: (e: L.LeafletEvent) => {
      const map = e.target as L.Map;
      const bounds = map.getBounds();
      const bbox = quantizeBounds({
        minLat: bounds.getSouth(),
        maxLat: bounds.getNorth(),
        minLng: bounds.getWest(),
        maxLng: bounds.getEast(),
      });

      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => onBBoxChange(bbox), 500);
    },
  });

  return null;
}

export function MapContainerWeb({
  location,
  pins,
  onBBoxChange,
  onSelectPin,
  selectedPin,
}: {
  location: { coords: { latitude: number; longitude: number } } | null;
  pins: VoicePin[];
  onBBoxChange: (bbox: BoundingBox) => void;
  selectedPin: VoicePin | null;
  onSelectPin: (pin: VoicePin | null) => void;
}) {
  useEffect(() => {
    ensureLeafletMarkerIcons();
  }, []);

  const center = useMemo(() => {
    return [location?.coords.latitude ?? FALLBACK_LAT, location?.coords.longitude ?? FALLBACK_LNG] as [number, number];
  }, [location?.coords.latitude, location?.coords.longitude]);

  const arIcon = useMemo(
    () =>
      L.divIcon({
        className: '',
        html: `<div style="
          width:36px;height:36px;border-radius:18px;
          background:#8b5cf6;border:2.5px solid #fff;
          box-shadow:0 6px 14px rgba(0,0,0,0.25);
          display:flex;align-items:center;justify-content:center;
          color:#fff;font-weight:800;">✦</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
      }),
    []
  );

  const voiceIcon = useMemo(
    () =>
      L.divIcon({
        className: '',
        html: `<div style="
          width:36px;height:36px;border-radius:18px;
          background:#ef4444;border:2.5px solid #fff;
          box-shadow:0 6px 14px rgba(0,0,0,0.25);
          display:flex;align-items:center;justify-content:center;
          color:#fff;font-weight:800;">🎤</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
      }),
    []
  );

  return (
    <div className="relative h-[calc(100svh-140px)] w-full">
      <MapContainer center={center} zoom={16} className="h-full w-full rounded-3xl overflow-hidden">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <BBoxListener onBBoxChange={onBBoxChange} />

        {pins.map((pin) => {
          const isAR = pin.type === VoiceType.HIDDEN_AR;
          return (
            <Marker
              key={pin.id}
              position={[pin.latitude, pin.longitude]}
              icon={isAR ? arIcon : voiceIcon}
              eventHandlers={{
                click: () => onSelectPin(pin),
              }}
            >
              <Popup>
                <div className="w-[220px]">
                  <div className="flex items-center gap-2">
                    <div className={isAR ? 'text-violet-500' : 'text-red-500'}>{isAR ? '✦' : '🎤'}</div>
                    <div className="font-bold text-sm text-gray-900 line-clamp-1">
                      {isAR ? 'Giọng nói AR ẩn' : pin.content ?? 'Ghim giọng nói'}
                    </div>
                  </div>
                  {!!pin.address && <div className="mt-1 text-xs text-gray-500 line-clamp-1">📍 {pin.address}</div>}
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                    <span>🎧 {pin.listensCount ?? 0}</span>
                    <span>♡ {pin.reactionsCount ?? 0}</span>
                  </div>
                  <button
                    type="button"
                    className="mt-2 w-full rounded-xl bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700 active:scale-[0.99]"
                    onClick={() => onSelectPin(pin)}
                  >
                    Xem chi tiết
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Minimal full-screen selected pin overlay (matches mobile behavior shape) */}
      {selectedPin && (
        <div className="absolute inset-x-0 bottom-0 z-40 px-5 pb-[calc(92px+var(--safe-bottom))]">
          <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-lg">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-bold text-gray-900 line-clamp-1">
                  {selectedPin.content ?? 'Ghim giọng nói'}
                </div>
                <div className="mt-1 text-xs text-gray-500 line-clamp-1">{selectedPin.address ?? 'Không rõ vị trí'}</div>
              </div>
              <button
                type="button"
                className="rounded-xl bg-gray-100 px-3 py-2 text-xs font-semibold active:scale-[0.99]"
                onClick={() => onSelectPin(null)}
              >
                Đóng
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <div>🎧 {selectedPin.listensCount ?? 0}</div>
              <div>♡ {selectedPin.reactionsCount ?? 0}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

