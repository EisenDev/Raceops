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
    success: <CheckCircle2 size={18} className="text-emerald-500" />,
    warning: <AlertCircle size={18} className="text-amber-500" />,
    error: <XCircle size={18} className="text-red-500" />,
    info: <Info size={18} className="text-accent" />,
  };

  const variants = {
    success: 'bg-emerald-500/5 border-emerald-500/10 text-emerald-200',
    warning: 'bg-amber-500/5 border-amber-500/10 text-amber-200',
    error: 'bg-red-500/5 border-red-500/10 text-red-200',
    info: 'bg-white/5 border-white/10 text-white/80',
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-2xl border p-5 transition-all animate-in fade-in slide-in-from-top-2 duration-300',
        variants[variant],
        className
      )}
    >
      <div className="shrink-0 pt-0.5">{icons[variant]}</div>
      <div className="space-y-1">
        <h4 className="text-xs font-semibold leading-none py-1">{title}</h4>
        <p className="text-sm opacity-70 leading-relaxed font-medium">{message}</p>
      </div>
    </div>
  );
}
