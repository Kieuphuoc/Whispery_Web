import type { Visibility } from "@/types";
import { cn } from "@/shared/utils";

interface FilterToggleProps {
    value: Visibility;
    onChange: (filter: Visibility) => void;
}

const OPTIONS: { value: Visibility; label: string }[] = [
    { value: 'PRIVATE', label: 'Cá nhân' },
    { value: 'FRIENDS', label: 'Bạn bè' },
    { value: 'PUBLIC', label: 'Khám phá' },
];

export const FilterToggle = ({ value, onChange }: FilterToggleProps) => {
    return (
        <div className="fixed top-20 left-6 right-6 z-[1000] flex justify-center">
            <div className="glass-card rounded-full p-1.5 flex gap-1 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                {OPTIONS.map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => onChange(opt.value)}
                        className={cn(
                            "py-2 px-6 rounded-full text-[13px] font-medium transition-all duration-300 whitespace-nowrap",
                            value === opt.value 
                                ? "bg-primary text-white shadow-lg shadow-primary/25 scale-[1.02]" 
                                : "text-gray-500 hover:text-gray-900 transition-colors"
                        )}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );
};
