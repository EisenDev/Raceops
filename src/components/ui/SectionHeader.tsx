import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
  variant?: 'default' | 'ivory';
}

export function SectionHeader({ title, description, className, variant = 'default' }: SectionHeaderProps) {
  return (
    <div className={cn('space-y-1 pb-8', className)}>
      <h2 className={cn(
        "text-3xl font-semibold tracking-tight",
        variant === 'default' ? "text-white" : "text-ivory-foreground"
      )}>
        {title}
      </h2>
      {description && (
        <p className={cn(
          "text-base font-medium opacity-60 max-w-lg",
          variant === 'default' ? "text-foreground" : "text-ivory-foreground"
        )}>
          {description}
        </p>
      )}
    </div>
  );
}
