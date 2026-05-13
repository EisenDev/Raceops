import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeader({ title, description, className }: SectionHeaderProps) {
  return (
    <div className={cn('space-y-3 pb-8', className)}>
      <h2 className="text-4xl font-black tracking-tight text-[#1A1A1A] leading-[1.1]">
        {title}
      </h2>
      {description && (
        <p className="text-lg text-[#666666] font-medium leading-relaxed max-w-lg">
          {description}
        </p>
      )}
    </div>
  );
}
