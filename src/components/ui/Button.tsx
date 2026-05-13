import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-[#1A1A1A] text-white hover:bg-black/90 shadow-sm',
      secondary: 'bg-[#F9F9F9] text-[#1A1A1A] border border-[#1A1A1A]/5 hover:bg-[#F0F0F0]',
      outline: 'bg-transparent border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A]/5',
      ghost: 'bg-transparent text-[#1A1A1A] hover:bg-[#1A1A1A]/5',
      danger: 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100',
    };

    const sizes = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-11 px-6 text-base',
      lg: 'h-14 px-8 text-lg font-semibold',
      icon: 'h-10 w-10',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
