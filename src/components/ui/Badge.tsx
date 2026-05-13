import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'muted';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-[#1A1A1A] text-white',
    success: 'bg-[#E8F5E9] text-[#2E7D32]',
    warning: 'bg-[#FFF3E0] text-[#EF6C00]',
    error: 'bg-[#FFEBEE] text-[#C62828]',
    muted: 'bg-[#F9F9F9] text-[#666666]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
