import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'muted' | 'ivory';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: "bg-accent/10 text-accent border-accent/10",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/10",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/10",
    error: "bg-red-500/10 text-red-400 border-red-500/10",
    muted: "bg-white/5 text-muted-foreground border-white/5",
    ivory: "bg-ivory text-ivory-foreground border-ivory/20",
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
