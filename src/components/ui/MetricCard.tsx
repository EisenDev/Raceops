import { cn } from '@/lib/utils';
import { Card } from './Card';

interface MetricCardProps {
  label: string;
  value: string | number;
  description?: string;
  className?: string;
}

export function MetricCard({ label, value, description, className }: MetricCardProps) {
  return (
    <Card className={cn('p-5', className)}>
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-[#666666] uppercase tracking-[0.1em]">{label}</span>
        <div className="text-3xl font-black text-[#1A1A1A]">{value}</div>
        {description && (
          <p className="text-xs text-[#999999] font-medium">{description}</p>
        )}
      </div>
    </Card>
  );
}
