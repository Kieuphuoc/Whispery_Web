import type { ReactNode } from 'react';
import { MobileBottomNav } from './MobileBottomNav';
import { TopBar } from './TopBar';
import { useLocation, Outlet } from 'react-router-dom';
import { cn } from '@/shared/utils';

interface AppShellProps {
    children?: ReactNode;
    showNav?: boolean;
}

export const AppShell = ({ children, showNav = true }: AppShellProps) => {
    const location = useLocation();
    const isAuthPage = location.pathname.startsWith('/login') || location.pathname.startsWith('/register');
    const isHome = location.pathname === '/home';

    return (
        <div className="mobile-app-shell h-screen flex flex-col overflow-hidden bg-gray-50/50">
            {!isAuthPage && !isHome && <TopBar />}
            <main className={cn(
                "flex-1 flex flex-col overflow-y-auto relative",
                !isAuthPage && !isHome && "pb-20"
            )}>
                {children || <Outlet />}
            </main>
            {!isAuthPage && !isHome && showNav && <MobileBottomNav />}
        </div>
    );
};
