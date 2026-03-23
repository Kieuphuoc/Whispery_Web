import type { VoicePin } from '@/shared/types';

export function VoicePinModal({ pin, onClose }: { pin: VoicePin; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="absolute inset-x-0 bottom-0 px-5 pb-[calc(92px+var(--safe-bottom))]">
        <div className="mx-auto max-w-md rounded-3xl border border-gray-200 bg-white p-4 shadow-2xl">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-base font-extrabold text-gray-900 line-clamp-2">
                {pin.content ?? 'Ký ức giọng nói'}
              </div>
              <div className="mt-1 text-xs text-gray-500 line-clamp-1">{pin.address ?? 'Không rõ vị trí'}</div>
            </div>
            <button
              type="button"
              className="rounded-xl bg-gray-100 px-3 py-2 text-xs font-semibold active:scale-[0.99]"
              onClick={onClose}
            >
              Đóng
            </button>
          </div>

          <div className="mt-4">
            <audio className="w-full" controls preload="none" src={pin.audioUrl} />
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
            <div>🎧 {pin.listensCount ?? 0}</div>
            <div>♡ {pin.reactionsCount ?? 0}</div>
            <div>💬 {pin.commentsCount ?? 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

