'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Gamepad2, 
  Users, 
  Trophy, 
  History, 
  UserCog, 
  Settings,
  LogOut,
  ExternalLink,
  Terminal,
  Target,
  Circle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { logout } from '@/lib/actions/auth';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Games', href: '/games', icon: Gamepad2 },
  { label: 'Teams', href: '/teams', icon: Users },
  { label: 'Standings', href: '/scores', icon: Trophy },
  { label: 'Code Runner', href: '/code-runner', icon: Terminal },
  { label: 'Edit Requests', href: '/edit-requests', icon: History },
];

const adminItems = [
  { label: 'Staff', href: '/users', icon: UserCog },
  { label: 'Settings', href: '/settings', icon: Settings },
];

interface DesktopSidebarProps {
  user?: {
    role: 'ADMIN' | 'FACILITATOR';
    displayName: string;
  } | null;
}

export function DesktopSidebar({ user }: DesktopSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-white/5 bg-[#0D0D0D] md:flex z-50">
      <div className="flex h-24 items-center px-8">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-xl font-semibold tracking-tight text-white">RaceOps</span>
        </Link>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-white/5 text-white" 
                    : "text-muted-foreground hover:bg-white/[0.02] hover:text-white"
                )}
              >
                <item.icon size={18} className={cn(
                  "transition-colors",
                  isActive ? "text-accent" : "group-hover:text-white/60"
                )} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {user?.role === 'ADMIN' && (
          <div className="mt-8 pt-8 border-t border-white/5 space-y-1">
            {adminItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-white/5 text-white" 
                      : "text-muted-foreground hover:bg-white/[0.02] hover:text-white"
                  )}
                >
                  <item.icon size={18} className={cn(
                    "transition-colors",
                    isActive ? "text-accent" : "group-hover:text-white/60"
                  )} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-auto pt-10 pb-6 space-y-4 px-2">
           <Link href="/scoreboard" target="_blank" className="flex items-center justify-between group p-4 rounded-xl ivory-card hover:opacity-90 transition-all shadow-lg">
              <div className="space-y-0.5">
                 <p className="text-[11px] font-semibold opacity-60">View Scoreboard</p>
                 <p className="text-sm font-bold">Public Results</p>
              </div>
              <ExternalLink size={16} className="opacity-40" />
           </Link>
        </div>
      </div>

      <div className="mt-auto border-t border-white/5 p-6 bg-black/20">
        <div className="mb-4 flex items-center gap-3 px-1">
          <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center font-bold text-black text-xs">
            {user?.displayName?.[0] || 'U'}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-white truncate max-w-[120px]">{user?.displayName}</span>
            <span className="text-[10px] font-medium text-muted-foreground">{user?.role === 'ADMIN' ? 'Administrator' : 'Facilitator'}</span>
          </div>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-lg px-1 py-2 text-xs font-medium text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut size={14} />
            <span>Sign out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
