import { cn } from '@/lib/utils';
import { Card } from './Card';

interface MetricCardProps {
  label: string;
  value: string | number;
  description?: string;
  className?: string;
  variant?: 'default' | 'ivory';
}

export function MetricCard({ label, value, description, className, variant = 'default' }: MetricCardProps) {
  return (
    <Card 
      variant={variant}
      className={cn('p-6 relative overflow-hidden group border-white/5', className)}
    >
      <div className="space-y-2 relative z-10">
        <span className={cn(
          "text-[11px] font-medium opacity-50",
          variant === 'default' ? "text-foreground" : "text-ivory-foreground"
        )}>{label}</span>
        <div className={cn(
          "text-3xl font-semibold tracking-tight",
          variant === 'default' ? "text-white" : "text-ivory-foreground"
        )}>{value}</div>
        {description && (
          <p className={cn(
            "text-xs font-medium opacity-40",
            variant === 'default' ? "text-foreground" : "text-ivory-foreground"
          )}>{description}</p>
        )}
      </div>
    </Card>
  );
}
