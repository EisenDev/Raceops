import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle, XCircle, Info } from 'lucide-react';

interface StatusMessageProps {
  title: string;
  message: string;
  variant?: 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export function StatusMessage({ title, message, variant = 'info', className }: StatusMessageProps) {
  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-[#2E7D32]" />,
    warning: <AlertCircle className="h-5 w-5 text-[#EF6C00]" />,
    error: <XCircle className="h-5 w-5 text-[#C62828]" />,
    info: <Info className="h-5 w-5 text-[#1A1A1A]" />,
  };

  const variants = {
    success: 'bg-[#E8F5E9]/50 border-[#E8F5E9]',
    warning: 'bg-[#FFF3E0]/50 border-[#FFF3E0]',
    error: 'bg-[#FFEBEE]/50 border-[#FFEBEE]',
    info: 'bg-[#F9F9F9] border-[#1A1A1A]/5',
  };

  return (
    <div
      className={cn(
        'flex items-start gap-4 rounded-xl border p-4 transition-all',
        variants[variant],
        className
      )}
    >
      <div className="shrink-0 pt-0.5">{icons[variant]}</div>
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-[#1A1A1A]">{title}</h4>
        <p className="text-sm text-[#666666] leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
