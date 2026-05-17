import { cn } from '@/lib/utils';
import { InputHTMLAttributes } from 'react';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input 
      className={cn(
        "w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-white/20 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all",
        className
      )}
      {...props}
    />
  );
}
