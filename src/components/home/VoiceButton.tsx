import { Mic, Square } from "lucide-react";
import { cn } from "@/shared/utils";

interface VoiceButtonProps {
    isRecording: boolean;
    onPress: () => void;
}

export const VoiceButton = ({ isRecording, onPress }: VoiceButtonProps) => {
    return (
        <div className="fixed bottom-24 left-0 right-0 flex justify-center items-center z-[1000] pointer-events-none">
            <div className="relative pointer-events-auto">
                {/* Advanced Pulse Rings */}
                {isRecording && (
                    <>
                        <div className="absolute inset-0 rounded-full bg-pink-500/30 animate-ping scale-150" />
                        <div className="absolute inset-0 rounded-full bg-pink-500/20 animate-ping delay-700 scale-[2]" />
                    </>
                )}

                {/* Main Button */}
                <button
                    onClick={onPress}
                    className={cn(
                        "relative w-24 h-24 rounded-full flex items-center justify-center border-8 border-white shadow-[0_15px_45px_rgba(0,0,0,0.15)] transition-all duration-500 group",
                        isRecording 
                            ? "bg-pink-500 scale-110" 
                            : "bg-gradient-to-tr from-purple-600 to-pink-500 animate-float shadow-primary/30 hover:shadow-primary/50"
                    )}
                >
                    <div className={cn(
                        "absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                        isRecording && "hidden"
                    )} />
                    
                    {isRecording ? (
                        <Square className="w-10 h-10 text-white fill-current" />
                    ) : (
                        <Mic className="w-10 h-10 text-white" strokeWidth={2.5} />
                    )}
                </button>
            </div>
        </div>
    );
};
