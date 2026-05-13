'use client';

import { usePathname } from 'next/navigation';
import { MobileBottomNav } from './mobile-bottom-nav';
import { DesktopSidebar } from './desktop-sidebar';
import { MobilePageHeader } from './mobile-page-header';

interface AppShellProps {
  children: React.ReactNode;
  user?: {
    role: 'ADMIN' | 'FACILITATOR';
    displayName: string;
  } | null;
}

export function AppShell({ children, user }: AppShellProps) {
  const pathname = usePathname();
  
  // Public pages that don't need the full shell
  const isPublicPage = pathname === '/login' || pathname === '/' || pathname === '/scoreboard';

  if (isPublicPage) {
    return <main className="min-h-screen bg-white">{children}</main>;
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Desktop Navigation */}
      <DesktopSidebar user={user} />

      <div className="flex flex-1 flex-col md:pl-64">
        {/* Mobile Navigation Header */}
        <MobilePageHeader />

        <main className="flex-1 pb-20 md:pb-8">
          <div className="mx-auto max-w-6xl px-6 py-8">
            {children}
          </div>
        </main>

        {/* Mobile Navigation Bottom Bar for Facilitators */}
        <MobileBottomNav />
      </div>
    </div>
  );
}
