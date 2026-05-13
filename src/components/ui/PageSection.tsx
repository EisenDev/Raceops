import { cn } from '@/lib/utils';

interface PageSectionProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'sm' | 'md' | 'lg';
}

export function PageSection({ children, className, spacing = 'md' }: PageSectionProps) {
  const spacings = {
    sm: 'space-y-4',
    md: 'space-y-8',
    lg: 'space-y-12',
  };

  return (
    <section className={cn(spacings[spacing], className)}>
      {children}
    </section>
  );
}
