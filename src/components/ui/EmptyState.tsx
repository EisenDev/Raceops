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
    <div className={cn('flex flex-col items-center justify-center py-12 px-6 text-center space-y-4', className)}>
      <div className="bg-[#F9F9F9] p-4 rounded-full text-[#666666]">
        {icon || <Ghost size={32} strokeWidth={1.5} />}
      </div>
      <div className="space-y-1">
        <h3 className="font-bold text-[#1A1A1A]">{title}</h3>
        <p className="text-sm text-[#666666] max-w-xs mx-auto leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
