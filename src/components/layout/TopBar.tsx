import { Bell, Settings, Search } from 'lucide-react';

export const TopBar = () => {
    return (
        <header className="sticky top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-lg border-b border-gray-100 flex items-center justify-between px-6 z-[100] safe-pt">
            <div className="flex items-center gap-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent font-outfit tracking-tighter">
                    Whisper
                </span>
            </div>
            
            <div className="flex items-center gap-4 text-gray-500">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                    <Search className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full border-2 border-white" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                    <Settings className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
};
