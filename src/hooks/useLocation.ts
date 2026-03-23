import { useEffect, useState } from "react";

export interface WebLocation {
    coords: {
        latitude: number;
        longitude: number;
        accuracy?: number;
    };
    timestamp: number;
}

export function useLocation() {
    const [location, setLocation] = useState<WebLocation | null>(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            console.warn("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    coords: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                    },
                    timestamp: position.timestamp,
                });
            },
            (error) => {
                console.warn("Error getting current position:", error.message);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    }, []);

    return { location };
}
