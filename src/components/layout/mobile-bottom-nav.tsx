'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Gamepad2, 
  QrCode, 
  Trophy, 
  History 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Games', href: '/games', icon: Gamepad2 },
  { label: 'TechOps', href: '/techops', icon: QrCode },
  { label: 'Scores', href: '/scores', icon: Trophy },
  { label: 'Edits', href: '/edit-requests', icon: History },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  // Hide on auth pages
  if (pathname === '/login') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#1A1A1A]/5 bg-white/95 backdrop-blur-xl md:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center space-y-1 px-3 py-1 transition-all active:scale-90',
                isActive ? 'text-[#1A1A1A]' : 'text-[#999999]'
              )}
            >
              <div className={cn(
                'p-1 rounded-lg transition-colors',
                isActive ? 'bg-[#1A1A1A]/5' : ''
              )}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={cn(
                "text-[9px] font-black uppercase tracking-widest transition-opacity",
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
