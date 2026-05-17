'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { StatusMessage } from '@/components/ui/StatusMessage';
import { login } from '@/lib/actions/auth';
import { Zap } from 'lucide-react';

export default function LoginPage() {
  const [state, action, isPending] = useActionState(login, undefined);

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background overflow-hidden selection:bg-accent/30">
      {/* Introduction Panel */}
      <div className="hidden lg:flex flex-col justify-between p-20 bg-[#0D0D0D] border-r border-white/5 relative overflow-hidden">
        <div className="space-y-10 relative z-10">
          <div className="space-y-4">
            <h1 className="text-5xl font-semibold tracking-tight text-white leading-tight">
              RaceOps
            </h1>
            <p className="text-lg font-medium text-muted-foreground/80">
              Internal operations system for Infosoft Amazing Race 2026.
            </p>
          </div>
        </div>

        <div className="space-y-10 relative z-10">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md font-medium">
              Manage teams, record scores, and monitor event progress in real-time.
            </p>
          </div>
        </div>
      </div>

      {/* Login Card */}
      <div className="flex items-center justify-center p-8 sm:p-12 lg:p-24 relative bg-background">
        <div className="w-full max-w-sm space-y-10">
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold tracking-tight text-white">Login</h3>
            <p className="text-sm text-muted-foreground font-medium">Enter your credentials to continue.</p>
          </div>

          <form action={action} className="space-y-6">
            <Card className="p-8 space-y-6 bg-card border-white/5 shadow-2xl">
              {state?.error && (
                <StatusMessage 
                  variant="error"
                  title="Login error"
                  message={state.error}
                />
              )}
              
              <div className="space-y-2">
                <label htmlFor="username" className="text-xs font-medium text-muted-foreground block pl-1">Email / Username</label>
                <Input 
                  name="username" 
                  id="username" 
                  placeholder="admin@admin.com" 
                  required 
                  className="h-12 bg-white/[0.02] border-white/10 text-white placeholder:text-white/20" 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password"  className="text-xs font-medium text-muted-foreground block pl-1">Password</label>
                <Input 
                  type="password" 
                  name="password" 
                  id="password" 
                  placeholder="••••••••" 
                  required 
                  className="h-12 bg-white/[0.02] border-white/10 text-white placeholder:text-white/20" 
                />
              </div>
              <Button type="submit" className="w-full h-12 text-sm" disabled={isPending}>
                {isPending ? 'Logging in...' : 'Sign in'}
              </Button>
            </Card>
          </form>

          <p className="text-center text-[11px] font-medium text-muted-foreground/40 pt-4">
             Infosoft Internal Operations 2026
          </p>
        </div>
      </div>
    </div>
  );
}
