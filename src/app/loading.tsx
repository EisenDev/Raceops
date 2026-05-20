import { Loader2 } from 'lucide-react';

export default function GlobalLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="relative flex items-center justify-center">
        <Loader2 size={48} className="text-accent animate-spin opacity-20" />
        <Loader2 size={32} className="text-accent animate-spin absolute" style={{ animationDirection: 'reverse', animationDuration: '3s' }} />
      </div>
      <div className="space-y-1 text-center">
         <p className="text-xs font-black uppercase tracking-[0.3em] text-accent animate-pulse">Loading Mission</p>
         <p className="text-[10px] font-bold text-muted-foreground opacity-40 uppercase">Synchronizing with Command Center</p>
      </div>
    </div>
  );
}
