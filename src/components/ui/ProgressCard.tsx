import { cn } from '@/lib/utils';
import { Card } from './Card';

interface ProgressCardProps {
  label: string;
  value: number;
  max: number;
  suffix?: string;
  className?: string;
}

export function ProgressCard({ label, value, max, suffix, className }: ProgressCardProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <Card className={cn('p-5', className)}>
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <span className="text-sm font-bold text-[#666666] uppercase tracking-wider">{label}</span>
          <span className="text-2xl font-black text-[#1A1A1A]">
            {value}<span className="text-sm font-medium text-[#999999] ml-1">/ {max}{suffix}</span>
          </span>
        </div>
        <div className="h-2 w-full bg-[#F9F9F9] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#1A1A1A] transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </Card>
  );
}
