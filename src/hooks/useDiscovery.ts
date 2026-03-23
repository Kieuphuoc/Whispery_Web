import { useCallback, useState } from 'react';
import type { VoicePin } from '@/shared/types';
import { voiceService } from '@/services/voice-service';
import { storage } from '@/app/storage';
import type { AxiosError } from 'axios';

export function useDiscovery() {
  const [isScanning, setIsScanning] = useState(false);
  const [discoveredPin, setDiscoveredPin] = useState<VoicePin | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchRandomVoice = useCallback(async (lat: number, lng: number) => {
    try {
      setError(null);
      const token = storage.get('token');
      if (!token) {
        setError('Bạn cần đăng nhập để khám phá');
        return;
      }

      const res = await voiceService.fetchRandom(lat, lng, 5);
      if (res.data?.data) setDiscoveredPin(res.data.data as VoicePin);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      if (axiosErr?.response?.status === 404) setError('Không tìm thấy giọng nói nào quanh đây. Hãy thử lại sau!');
      else setError('Có lỗi xảy ra khi quét bản đồ');
    }
  }, []);

  const triggerScan = useCallback(
    async (lat: number, lng: number) => {
      setIsScanning(true);
      setDiscoveredPin(null);
      setError(null);
      await new Promise((r) => setTimeout(r, 2000));
      await fetchRandomVoice(lat, lng);
      setIsScanning(false);
    },
    [fetchRandomVoice]
  );

  const resetDiscovery = useCallback(() => {
    setDiscoveredPin(null);
    setError(null);
    setIsScanning(false);
  }, []);

  return { isScanning, discoveredPin, error, triggerScan, resetDiscovery };
}

