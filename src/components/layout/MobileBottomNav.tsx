import { NavLink } from 'react-router-dom';
import { Heart, Map as MapIcon, User } from 'lucide-react';
import { cn } from '@/shared/utils';

export const MobileBottomNav = () => {
    return (
        <div className="fixed bottom-0 left-0 right-0 h-[72px] glass-nav flex items-center justify-around px-8 z-50 rounded-t-[20px]">
            <NavLink
                to="/memory"
                className={({ isActive }) =>
                    cn(
                        "flex flex-col items-center justify-center relative transition-all duration-300",
                        isActive ? "text-primary -translate-y-1" : "text-gray-400 hover:text-gray-600"
                    )
                }
            >
                {({ isActive }) => (
                    <>
                        <Heart className={cn("w-6 h-6", isActive && "fill-current")} strokeWidth={isActive ? 2.5 : 2} />
                        {isActive && <div className="absolute -bottom-2 w-1 h-1 bg-primary rounded-full" />}
                    </>
                )}
            </NavLink>

            <NavLink
                to="/home"
                className={({ isActive }) =>
                    cn(
                        "flex flex-col items-center justify-center relative transition-all duration-300",
                        isActive ? "text-primary -translate-y-1" : "text-gray-400 hover:text-gray-600"
                    )
                }
            >
                {({ isActive }) => (
                    <>
                        <MapIcon className={cn("w-6 h-6", isActive && "fill-current")} strokeWidth={isActive ? 2.5 : 2} />
                        {isActive && <div className="absolute -bottom-2 w-1 h-1 bg-primary rounded-full" />}
                    </>
                )}
            </NavLink>

            <NavLink
                to="/profile"
                className={({ isActive }) =>
                    cn(
                        "flex flex-col items-center justify-center relative transition-all duration-300",
                        isActive ? "text-primary -translate-y-1" : "text-gray-400 hover:text-gray-600"
                    )
                }
            >
                {({ isActive }) => (
                    <>
                        <User className={cn("w-6 h-6", isActive && "fill-current")} strokeWidth={isActive ? 2.5 : 2} />
                        {isActive && <div className="absolute -bottom-2 w-1 h-1 bg-primary rounded-full" />}
                    </>
                )}
            </NavLink>
        </div>
    );
};
