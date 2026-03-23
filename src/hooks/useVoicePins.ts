import { useQuery } from "@tanstack/react-query";
import { api as defaultAxios } from "@/services/client";
import { endpoints } from "@/services/endpoints";
import type { Visibility, VoicePin } from "@/types";

export interface BoundingBox {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
}

export function useVoicePins(visibility: Visibility, bbox?: BoundingBox) {

    return useQuery<VoicePin[]>({
        queryKey: ["voicePins", visibility, bbox],
        queryFn: async () => {
            const api = defaultAxios;
            
            // Map visibility to match backend endpoints if necessary
            // For now, assuming the endpoints handles it or we call specific ones
            let url = endpoints.voice;
            if (visibility === 'PUBLIC') url = endpoints.voicePublic;
            else if (visibility === 'FRIENDS') url = endpoints.voiceFriends;

            const response = await api.get(url, {
                params: {
                    minLat: bbox?.minLat,
                    maxLat: bbox?.maxLat,
                    minLng: bbox?.minLng,
                    maxLng: bbox?.maxLng,
                }
            });
            // Ensure we return an array
            const data = response.data;
            if (Array.isArray(data)) return data;
            if (data && Array.isArray(data.data)) return data.data;
            return [];
        },
        enabled: !!visibility,
    });
}
