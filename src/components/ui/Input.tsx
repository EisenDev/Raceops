import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-12 w-full rounded-lg border border-[#1A1A1A]/10 bg-white px-4 py-2 text-base transition-colors placeholder:text-[#666666] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]/20 focus-visible:border-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
