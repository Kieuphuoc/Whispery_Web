import { useMemo } from 'react';
import type { VoicePin } from '@/types';
import { Plus, Music } from 'lucide-react';

interface HistoryCalendarProps {
    pins: VoicePin[];
    onSelectPin: (pin: VoicePin) => void;
    startDate?: string;
    onPressAddToday?: () => void;
}

const fmtKey = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const HistoryCalendar = ({ pins, onSelectPin, startDate, onPressAddToday }: HistoryCalendarProps) => {
    const today = useMemo(() => startOfDay(new Date()), []);

    const pinsByDateKey = useMemo(() => {
        const map: Record<string, VoicePin[]> = {};
        for (const pin of pins) {
            const d = startOfDay(new Date(pin.createdAt));
            const key = fmtKey(d);
            (map[key] = map[key] ?? []).push(pin);
        }
        return map;
    }, [pins]);

    const monthRange = useMemo(() => {
        const now = new Date();
        const start = startDate ? new Date(startDate) : (pins.length ? new Date(Math.min(...pins.map(p => new Date(p.createdAt).getTime()))) : now);
        const startMonth = new Date(start.getFullYear(), start.getMonth(), 1);
        const endMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const months = [];
        for (let d = new Date(startMonth); d <= endMonth; d = new Date(d.getFullYear(), d.getMonth() + 1, 1)) {
            const year = d.getFullYear();
            const month = d.getMonth();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            months.push({
                monthKey: `${year}-${month}`,
                label: `tháng ${month + 1} ${year}`,
                year,
                month,
                daysInMonth,
            });
        }
        return months.reverse(); // Show newest first
    }, [startDate, pins]);

    return (
        <div className="space-y-10 px-6">
            {monthRange.map((monthData: { monthKey: string; label: string; year: number; month: number; daysInMonth: number }, index: number) => (
                <div key={monthData.monthKey} className="relative">
                    <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-gray-100/80">
                        <h3 className="text-lg font-bold text-gray-900 mb-8 lowercase font-outfit px-2">
                            {monthData.label}
                        </h3>

                        <div className="grid grid-cols-6 gap-4">
                            {Array.from({ length: monthData.daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const cellDate = new Date(monthData.year, monthData.month, day);
                                const cellDateStart = startOfDay(cellDate);
                                const key = fmtKey(cellDateStart);
                                const dayPins = pinsByDateKey[key];
                                const firstPin = dayPins?.[0];
                                
                                const isToday = cellDateStart.getTime() === today.getTime();
                                const isFuture = cellDateStart.getTime() > today.getTime();

                                if (firstPin) {
                                    return (
                                        <button
                                            key={day}
                                            onClick={() => onSelectPin(firstPin)}
                                            className="relative aspect-square rounded-2xl overflow-hidden shadow-sm group active:scale-90 transition-all border-2 border-white"
                                        >
                                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                                            {firstPin.imageUrl ? (
                                                <img src={firstPin.imageUrl} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                                                    <Music className="w-5 h-5 text-primary/30" />
                                                </div>
                                            )}
                                            {dayPins.length > 1 && (
                                                <div className="absolute -top-1 -right-1 bg-gray-900 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white z-20">
                                                    {dayPins.length}
                                                </div>
                                            )}
                                        </button>
                                    );
                                }

                                if (isToday && onPressAddToday) {
                                    return (
                                        <button
                                            key={day}
                                            onClick={onPressAddToday}
                                            className="aspect-square rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5 flex items-center justify-center text-primary group active:scale-90 transition-all"
                                        >
                                            <Plus className="w-6 h-6 animate-pulse" />
                                        </button>
                                    );
                                }

                                if (isFuture) {
                                    return (
                                        <div key={day} className="aspect-square rounded-2xl border border-gray-50 bg-gray-50/30" />
                                    );
                                }

                                return (
                                    <div key={day} className="aspect-square flex items-center justify-center opacity-40">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {index < monthRange.length - 1 && (
                        <div className="flex justify-center h-12">
                            <div className="w-[1.5px] bg-gradient-to-b from-gray-100 to-transparent h-full" />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
