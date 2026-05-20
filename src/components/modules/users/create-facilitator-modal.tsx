'use client';

import { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatusMessage } from '@/components/ui/StatusMessage';
import { createFacilitator } from '@/lib/actions/users';
import { UserPlus, X, Loader2 } from 'lucide-react';

export function CreateFacilitatorModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, action] = useFormState(createFacilitator, undefined);

  useEffect(() => {
    if (state?.success) {
      setIsOpen(false);
    }
  }, [state?.success]);

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)}>
        <UserPlus size={18} className="mr-2" />
        Create Facilitator
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md shadow-2xl relative">
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-[#999999] hover:text-[#1A1A1A] transition-colors"
        >
          <X size={20} />
        </button>

        <CardHeader>
          <CardTitle>Create Facilitator</CardTitle>
          <p className="text-sm text-[#666666]">Add a new account for event staff.</p>
        </CardHeader>

        <CardContent>
          <form action={action} className="space-y-4">
            {state?.error && (
              <StatusMessage 
                variant="error"
                title="Failed to create"
                message={state.error}
              />
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]">Full Name</label>
              <Input name="name" placeholder="e.g. John Doe" required />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]">Username or Email</label>
              <Input name="username" placeholder="e.g. john@admin.com" required />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]">Password</label>
              <Input type="password" name="password" placeholder="Min. 6 characters" required />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]">Confirm Password</label>
              <Input type="password" name="confirmPassword" placeholder="Repeat password" required />
            </div>

            <SubmitButton onCancel={() => setIsOpen(false)} />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function SubmitButton({ onCancel }: { onCancel: () => void }) {
  const { pending } = useFormStatus();
  
  return (
    <div className="flex gap-3 pt-4">
      <Button 
        type="button" 
        variant="secondary" 
        className="flex-1" 
        onClick={onCancel}
        disabled={pending}
      >
        Cancel
      </Button>
      <Button type="submit" className="flex-1" disabled={pending}>
        {pending ? (
          <div className="flex items-center gap-2">
            <Loader2 size={18} className="animate-spin" />
            <span>Creating...</span>
          </div>
        ) : (
          <span>Create Account</span>
        )}
      </Button>
    </div>
  );
}
