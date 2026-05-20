'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RealtimeRefreshProps {
  interval?: number;
  showIndicator?: boolean;
  className?: string;
}

/**
 * A component that triggers a router refresh on an interval
 * to provide a "live" feel for the dashboard and scoreboards.
 */
export function RealtimeRefresh({ 
  interval = 15000, 
  showIndicator = true,
  className 
}: RealtimeRefreshProps) {
  const router = useRouter();
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      router.refresh();
      setLastUpdate(new Date());
    }, interval);

    return () => clearInterval(timer);
  }, [interval, router]);

  if (!showIndicator) return null;

  return (
    <div className={cn("flex items-center gap-2 px-3 py-1 bg-success/5 rounded-full border border-success/10", className)}>
      <div className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
      </div>
      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-success leading-none">
        Live Feed
      </span>
      <span className="text-[8px] font-bold text-[#999999] uppercase leading-none ml-1">
        {lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </span>
    </div>
  );
}
