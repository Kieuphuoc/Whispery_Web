import { useCallback, useEffect, useState } from 'react';
import { voiceService } from '@/services/voice-service';
import type { VoicePin } from '@/shared/types';

export function useMyPins() {
    const [pins, setPins] = useState<VoicePin[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPins = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await voiceService.fetchAll();
            setPins(res.data?.data ?? res.data ?? []);
        } catch (err) {
            console.error('useMyPins error:', err);
            setError('Không thể tải ký ức của bạn');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchPins(); }, [fetchPins]);

    return { pins, loading, error, refetch: fetchPins };
}
