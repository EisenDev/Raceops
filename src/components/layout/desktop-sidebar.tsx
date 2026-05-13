'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Gamepad2, 
  QrCode, 
  Target, 
  Users, 
  Trophy, 
  History, 
  UserCog, 
  Settings,
  LogOut,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { logout } from '@/lib/actions/auth';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Games', href: '/games', icon: Gamepad2 },
  { label: 'TechOps Cache Run', href: '/techops', icon: QrCode },
  { label: 'Bounty', href: '/bounty', icon: Target },
  { label: 'Teams & Members', href: '/teams', icon: Users },
  { label: 'Scores', href: '/scores', icon: Trophy },
  { label: 'Edit Requests', href: '/edit-requests', icon: History },
];

const adminItems = [
  { label: 'Users / Facilitators', href: '/users', icon: UserCog },
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
    <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-[#1A1A1A]/5 bg-[#F9F9F9] md:flex">
      <div className="flex h-20 items-center px-8 border-b border-[#1A1A1A]/5">
        <h1 className="text-sm font-black uppercase tracking-[0.4em] text-[#1A1A1A]">
          RaceOps
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
        <nav className="space-y-1">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#999999] mb-4">Operations</p>
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-bold transition-all',
                  isActive 
                    ? 'bg-white text-[#1A1A1A] shadow-sm ring-1 ring-[#1A1A1A]/5' 
                    : 'text-[#666666] hover:bg-white/50 hover:text-[#1A1A1A]'
                )}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {user?.role === 'ADMIN' && (
          <nav className="space-y-1">
            <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#999999] mb-4">System</p>
            {adminItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-bold transition-all',
                    isActive 
                      ? 'bg-[#1A1A1A] text-white shadow-md' 
                      : 'text-[#666666] hover:bg-[#1A1A1A]/5 hover:text-[#1A1A1A]'
                  )}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        )}

        <div className="px-4 pt-4">
           <Link 
             href="/scoreboard" 
             target="_blank"
             className="flex items-center justify-between p-4 rounded-xl bg-white border border-[#1A1A1A]/5 shadow-sm group hover:border-[#1A1A1A]/10 transition-all"
           >
              <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-[#999999]">Public View</p>
                 <p className="text-xs font-bold text-[#1A1A1A]">Scoreboard</p>
              </div>
              <ExternalLink size={14} className="text-[#999999] group-hover:text-[#1A1A1A] transition-colors" />
           </Link>
        </div>
      </div>

      <div className="p-4 border-t border-[#1A1A1A]/5 space-y-4">
        {user && (
          <div className="px-4 py-2 bg-white/50 rounded-xl border border-[#1A1A1A]/5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999] mb-1">User</p>
            <p className="text-sm font-black text-[#1A1A1A] truncate">{user.displayName}</p>
            <p className="text-[9px] font-bold text-[#666666] uppercase tracking-widest">{user.role}</p>
          </div>
        )}
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut size={18} strokeWidth={2.5} />
            <span>Logout</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
