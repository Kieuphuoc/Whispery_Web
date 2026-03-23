import { useEffect, useState } from 'react';

export type GeoCoords = {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
};

export type GeoLocation = {
  coords: GeoCoords;
  timestamp: number;
};

export function useGeolocation() {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [permission, setPermission] = useState<'prompt' | 'granted' | 'denied'>(() => {
    return 'geolocation' in navigator ? 'prompt' : 'denied';
  });

  useEffect(() => {
    if (!('geolocation' in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPermission('granted');
        setLocation({
          coords: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          },
          timestamp: pos.timestamp,
        });
      },
      () => {
        setPermission('denied');
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 30_000 }
    );
  }, []);

  return { location, permission };
}

