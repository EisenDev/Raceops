import { cn } from '@/lib/utils';
import { Ghost } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-20 px-8 text-center space-y-6 bg-white/[0.01] border border-white/5 rounded-[40px]', className)}>
      <div className="bg-white/5 p-6 rounded-[24px] text-muted-foreground/40 border border-white/5 shadow-inner">
        {icon || <Ghost size={40} strokeWidth={1} />}
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-black text-white/90 uppercase tracking-tighter">{title}</h3>
        <p className="text-sm text-muted-foreground/60 max-w-sm mx-auto leading-relaxed font-medium">{description}</p>
      </div>
    </div>
  );
}
