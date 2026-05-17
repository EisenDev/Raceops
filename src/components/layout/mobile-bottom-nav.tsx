'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Gamepad2, 
  Trophy, 
  History 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Games', href: '/games', icon: Gamepad2 },
  { label: 'Standings', href: '/scores', icon: Trophy },
  { label: 'Requests', href: '/edit-requests', icon: History },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0D0D0D]/90 backdrop-blur-xl border-t border-white/5 pb-safe shadow-2xl">
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1.5 px-3 py-1 transition-all duration-300",
                isActive ? "text-accent scale-110" : "text-muted-foreground opacity-70 hover:opacity-100"
              )}
            >
              <item.icon 
                size={20} 
                className={cn(
                  "transition-all",
                  isActive ? "text-accent drop-shadow-gold" : ""
                )} 
              />
              <span className={cn(
                "text-[9px] font-black uppercase tracking-widest leading-none",
                isActive ? "opacity-100" : "opacity-0"
              )}>
               {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      {/* Safe area inset for mobile browsers */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
