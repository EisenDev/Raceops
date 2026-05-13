'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { AlertTriangle } from 'lucide-react';

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
    danger: 'bg-red-50 text-red-600',
    warning: 'bg-amber-50 text-amber-600',
    primary: 'bg-blue-50 text-blue-600',
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-sm shadow-2xl border-none overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${variantStyles[variant]}`}>
              <AlertTriangle size={20} />
            </div>
            <CardTitle className="text-xl">{title}</CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-[#666666] leading-relaxed">
            {description}
          </p>
        </CardContent>

        <CardFooter className="flex gap-3 pt-2">
          <Button 
            variant="secondary" 
            className="flex-1 font-bold text-xs" 
            onClick={onClose}
            disabled={isPending}
          >
            {cancelText}
          </Button>
          <Button 
            variant={variant === 'danger' ? 'danger' : 'primary'} 
            className="flex-1 font-bold text-xs" 
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
