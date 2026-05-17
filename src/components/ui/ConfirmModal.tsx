'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  isPending?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isPending = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: 'bg-red-500/10 text-red-500 border-red-500/20',
    warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    primary: 'bg-accent/10 text-accent border-accent/20',
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <Card className="w-full max-w-sm shadow-2xl border-white/10 bg-[#141414] overflow-hidden rounded-[32px]">
        <CardHeader className="p-8 pb-4">
          <div className="flex items-center gap-4">
            <div className={cn("p-3 rounded-2xl border", variantStyles[variant])}>
              <AlertTriangle size={24} />
            </div>
            <CardTitle className="text-xl font-black uppercase tracking-tight">{title}</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="px-8 py-4">
          <p className="text-sm text-muted-foreground font-medium leading-relaxed">
            {description}
          </p>
        </CardContent>

        <CardFooter className="p-8 flex gap-4">
          <Button 
            variant="secondary" 
            className="flex-1 h-12 text-[10px] shadow-none" 
            onClick={onClose}
            disabled={isPending}
          >
            {cancelText}
          </Button>
          <Button 
            variant={variant === 'danger' ? 'error' : 'primary'} 
            className="flex-1 h-12 text-[10px]" 
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? 'Processing...' : confirmText}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
