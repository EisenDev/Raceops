'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { StatusMessage } from '@/components/ui/StatusMessage';
import { login } from '@/lib/actions/auth';
import { ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [state, action, isPending] = useActionState(login, undefined);

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white overflow-hidden">
      {/* Introduction Panel (Editorial) */}
      <div className="hidden lg:flex flex-col justify-between p-16 bg-[#F9F9F9] border-r border-[#1A1A1A]/5">
        <div className="space-y-6">
          <div className="bg-[#1A1A1A] w-12 h-12 flex items-center justify-center rounded-2xl shadow-lg">
            <ShieldCheck size={24} className="text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tight text-[#1A1A1A]">RaceOps</h1>
            <p className="text-xl font-medium text-[#666666]">Official Scoring & Facilitation</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-black tracking-tight text-[#1A1A1A]">Infosoft Amazing Race 2026</h2>
            <p className="text-lg text-[#666666] leading-relaxed max-w-md">
              A professional real-time scoring system designed to manage teams, games, and TechOps scavenger hunts with precision.
            </p>
          </div>
          <div className="pt-8 border-t border-[#1A1A1A]/10 max-w-xs">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#999999]">Authorized Personnel Only</p>
          </div>
        </div>
      </div>

      {/* Action Panel (Login Card) */}
      <div className="flex items-center justify-center p-8 sm:p-12 lg:p-24 relative">
        {/* Mobile Header (Only visible on small screens) */}
        <div className="lg:hidden absolute top-12 left-0 right-0 flex flex-col items-center space-y-4 px-8 text-center">
          <div className="bg-[#1A1A1A] p-3 rounded-2xl shadow-lg">
             <ShieldCheck size={32} className="text-white" strokeWidth={2} />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight">RaceOps Login</h1>
            <p className="text-sm text-[#666666]">Infosoft Amazing Race 2026</p>
          </div>
        </div>

        <div className="w-full max-w-sm space-y-8">
          <div className="hidden lg:block space-y-2">
            <h3 className="text-2xl font-black tracking-tight">Sign In</h3>
            <p className="text-sm text-[#666666]">Sign in to manage games, teams, and scores.</p>
          </div>

          <form action={action} className="space-y-6">
            <Card className="border-[#1A1A1A]/10 shadow-2xl shadow-black/5 rounded-2xl">
              <CardContent className="space-y-6 pt-8 p-8">
                {state?.error && (
                  <StatusMessage 
                    variant="error"
                    title="Login Failed"
                    message={state.error}
                  />
                )}
                
                <div className="space-y-2">
                  <label htmlFor="username" className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A] block pl-1">Email or Username</label>
                  <Input name="username" id="username" placeholder="admin@admin.com" required className="h-14 rounded-xl border-[#1A1A1A]/10 focus:border-[#1A1A1A] focus:ring-[#1A1A1A]/5" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password"  className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A] block pl-1">Password</label>
                  <Input type="password" name="password" id="password" placeholder="••••••••" required className="h-14 rounded-xl border-[#1A1A1A]/10 focus:border-[#1A1A1A] focus:ring-[#1A1A1A]/5" />
                </div>
                <Button type="submit" className="w-full h-14 rounded-xl text-lg font-bold mt-4" disabled={isPending}>
                  {isPending ? 'Authenticating...' : 'Continue to Dashboard'}
                </Button>
              </CardContent>
            </Card>
          </form>

          <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-[#999999] pt-4">
             Infosoft Internal System • 2026
          </p>
        </div>
      </div>
    </div>
  );
}
