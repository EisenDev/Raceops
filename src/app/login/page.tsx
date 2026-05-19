'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { StatusMessage } from '@/components/ui/StatusMessage';
import { login } from '@/lib/actions/auth';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [state, action, isPending] = useActionState(login, undefined);

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background overflow-hidden selection:bg-accent/30">
      {/* Playful & Beautiful Introduction Panel */}
      <div className="hidden lg:flex flex-col items-center justify-center p-20 bg-[#14A7A0] relative overflow-hidden">
        {/* Decorative Abstract Shapes (Inspired by Portfolio) */}
        <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#D4E24B] rounded-full opacity-90 transition-transform duration-1000 hover:scale-105" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[350px] h-[350px] bg-[#1EBCB4] rounded-full opacity-80" />
        <div className="absolute top-[40%] right-[10%] w-12 h-12 bg-pink-300 rounded-full opacity-60 animate-bounce" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-[20%] left-[15%] w-24 h-24 bg-white/10 rounded-full blur-xl" />
        
        {/* Character Illustration Placeholder (Simplified SVG) */}
        <div className="relative z-10 mb-16 transform transition-all duration-700 hover:translate-y-[-10px]">
           <div className="w-32 h-40 flex flex-col items-center">
              <div className="w-16 h-16 bg-pink-300 rounded-full mb-[-10px] z-10" />
              <div className="w-20 h-24 bg-[#5DCB99] rounded-xl flex items-center justify-center relative overflow-hidden">
                 <div className="w-12 h-8 bg-white/20 rounded-md mt-[-10px]" />
                 {/* Dark lower part */}
                 <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#334155]" />
              </div>
              <div className="flex gap-2 mt-1">
                 <div className="w-4 h-6 bg-[#334155] rounded-sm" />
                 <div className="w-4 h-6 bg-[#334155] rounded-sm" />
              </div>
           </div>
        </div>

        <div className="text-center relative z-10 space-y-6">
          <div className="space-y-2">
            <h1 className="text-6xl font-bold tracking-tight text-white drop-shadow-sm">
              Welcome to Infosoft <span className="text-white/90">RaceOps</span>
            </h1>
            <p className="text-2xl font-medium text-white/80 tracking-tight">
              Team building dashboard
            </p>
          </div>
          <div className="pt-8">
            <p className="text-sm font-medium text-[#0f766e] bg-white/20 backdrop-blur-md px-6 py-2 rounded-full inline-block">
               Empowering collaboration since 2026
            </p>
          </div>
        </div>

        {/* Footer subtle text */}
        <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end opacity-40">
           <p className="text-[10px] font-bold uppercase tracking-widest text-white">System Core v3.0</p>
           <p className="text-[10px] font-bold uppercase tracking-widest text-white italic">Continuous improvement • Sustained growth</p>
        </div>
      </div>

      {/* Login Card */}
      <div className="flex items-center justify-center p-8 sm:p-12 lg:p-24 relative bg-background">
        {/* Mobile Header (Mobile only) */}
        <div className="lg:hidden absolute top-12 left-0 right-0 text-center px-8">
           <h1 className="text-3xl font-bold text-white mb-2">RaceOps</h1>
           <p className="text-sm text-muted-foreground">Team building dashboard</p>
        </div>

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
              <Button type="submit" className="w-full h-12 text-sm font-semibold" disabled={isPending}>
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
