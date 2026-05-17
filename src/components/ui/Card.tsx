import { cn } from '@/lib/utils';
import { ReactNode, MouseEvent } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  variant?: 'default' | 'ivory';
}

export function Card({ children, className, onClick, variant = 'default' }: CardProps) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "rounded-xl border border-white/5 shadow-premium transition-all duration-300",
        variant === 'default' ? "bg-card text-card-foreground" : "bg-ivory text-ivory-foreground",
        onClick ? "cursor-pointer hover:border-white/10" : "",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <div className={cn("p-6 pb-0", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <h3 className={cn("text-lg font-semibold tracking-tight", className)}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <div className={cn("p-6", className)}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <div className={cn("p-6 pt-0 flex items-center", className)}>
      {children}
    </div>
  );
}
