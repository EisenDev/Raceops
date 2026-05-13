'use client';

import { usePathname } from 'next/navigation';

export function MobilePageHeader() {
  const pathname = usePathname();

  const getPageTitle = (path: string) => {
    if (path === '/') return 'TechOps';
    if (path.startsWith('/dashboard')) return 'Dashboard';
    if (path.startsWith('/games')) return 'Games';
    if (path.startsWith('/techops')) return 'TechOps Run';
    if (path.startsWith('/bounty')) return 'Bounty';
    if (path.startsWith('/teams')) return 'Teams';
    if (path.startsWith('/scores')) return 'Scores';
    if (path.startsWith('/scoreboard')) return 'Scoreboard';
    if (path.startsWith('/edit-requests')) return 'Edit Requests';
    if (path.startsWith('/users')) return 'Users';
    if (path.startsWith('/settings')) return 'Settings';
    if (path.startsWith('/login')) return 'Login';
    return 'TechOps';
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center border-b border-[#1A1A1A]/5 bg-white/95 backdrop-blur-xl px-6 md:hidden">
      <h1 className="text-xs font-black uppercase tracking-[0.3em] text-[#1A1A1A]">
        {getPageTitle(pathname)}
      </h1>
    </header>
  );
}
