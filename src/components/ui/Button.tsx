import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'error' | 'ivory';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export function Button({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md', 
  disabled,
  ...props 
}: ButtonProps) {
  const variants = {
    primary: "bg-accent text-accent-foreground hover:bg-accent/90",
    secondary: "bg-muted text-foreground hover:bg-muted/80 border border-border",
    outline: "bg-transparent border border-white/10 text-white hover:bg-white/5",
    ghost: "bg-transparent hover:bg-white/5 text-muted-foreground hover:text-white",
    error: "bg-red-950/20 text-red-500 border border-red-500/20 hover:bg-red-500/10",
    ivory: "bg-ivory text-ivory-foreground hover:bg-ivory/90",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs font-medium",
    md: "px-5 py-2.5 text-sm font-medium",
    lg: "px-6 py-3 text-base font-semibold",
    icon: "p-2",
  };

  return (
    <button 
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
