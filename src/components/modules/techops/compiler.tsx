'use client';

import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Terminal, Play, XCircle, CheckCircle2, Loader2, Database, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompilerProps {
  cards: {
    code: string;
    label: string;
    type: string;
  }[];
}

export default function Compiler({ cards }: CompilerProps) {
  const [inputCode, setInputCode] = useState('');
  const [logs, setLogs] = useState<{ type: 'info' | 'success' | 'error' | 'system', message: string, time: string }[]>([
    { type: 'system', message: 'RACEOPS COMPILER V3.2.0 INITIALIZED', time: new Date().toLocaleTimeString() },
    { type: 'system', message: 'READY FOR PAYLOAD VALIDATION...', time: new Date().toLocaleTimeString() },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const addLog = (type: 'info' | 'success' | 'error' | 'system', message: string) => {
    setLogs(prev => [...prev, { type, message, time: new Date().toLocaleTimeString() }]);
  };

  const handleRun = async () => {
    if (!inputCode || isProcessing) return;

    setIsProcessing(true);
    addLog('info', `VALIDATING: ${inputCode.toUpperCase()}...`);

    // Simulate compilation delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const card = cards.find(c => c.code.toUpperCase() === inputCode.toUpperCase());

    if (card) {
      addLog('success', '200 OK: PAYLOAD SECURED');
      addLog('success', `DATA: [${card.type}] ${card.label}`);
    } else {
      addLog('error', '500 ERR: CHECKSUM MISMATCH');
      addLog('error', 'STATUS: ACCESS DENIED');
    }

    setIsProcessing(false);
    setInputCode('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-4 space-y-10">
        <Card className="p-8 bg-white/[0.02] border-white/5 space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-accent/10 transition-all" />
          
          <div className="flex items-center gap-4 relative z-10">
             <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                <Shield size={20} />
             </div>
             <h3 className="text-xl font-black text-white uppercase tracking-tighter">Auth Gateway</h3>
          </div>

          <div className="space-y-6 relative z-10">
             <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Symbol Entry</label>
                <div className="relative">
                  <Input 
                    placeholder="PAYLOAD ID..." 
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && handleRun()}
                    className="h-16 bg-black border-white/10 focus:border-accent/40 transition-all rounded-2xl font-mono text-lg tracking-widest text-accent"
                  />
                  <Terminal size={18} className="absolute right-4 top-5 text-muted-foreground/30" />
                </div>
             </div>

             <Button 
               className="w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl"
               disabled={!inputCode || isProcessing}
               onClick={handleRun}
             >
               {isProcessing ? (
                 <Loader2 size={18} className="animate-spin" />
               ) : (
                 <>
                   <Play size={16} className="mr-3 fill-current" />
                   Initiate Validation
                 </>
               )}
             </Button>
          </div>
        </Card>

        <Card className="p-8 bg-white/[0.02] border-white/5">
           <div className="flex items-center gap-3 mb-6 text-muted-foreground">
              <Database size={18} />
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Payload Registry</h4>
           </div>
           <div className="space-y-2 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
              {cards.map(card => (
                <div key={card.code} className="flex justify-between items-center p-4 bg-white/[0.03] rounded-xl border border-white/5 hover:bg-white/[0.06] transition-all group">
                   <span className="text-[11px] font-mono font-bold text-white/70 group-hover:text-accent">{card.code}</span>
                   <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 group-hover:text-muted-foreground">{card.type}</span>
                </div>
              ))}
              {cards.length === 0 && (
                <p className="text-center py-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-30">No payloads registered</p>
              )}
           </div>
        </Card>
      </div>

      <div className="lg:col-span-8">
        <div className="bg-[#050505] rounded-[40px] overflow-hidden shadow-[0_0_100px_-20px_rgba(0,0,0,1)] border border-white/5 relative group">
           {/* Terminal Header */}
           <div className="bg-white/[0.02] border-b border-white/5 px-10 py-6 flex items-center justify-between">
              <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-500/10 border border-red-500/20" />
                 <div className="w-3 h-3 rounded-full bg-amber-500/10 border border-amber-500/20" />
                 <div className="w-3 h-3 rounded-full bg-emerald-500/10 border border-emerald-500/20" />
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                 <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.4em]">system_core_v3.2.log</span>
              </div>
           </div>

           {/* Terminal Body */}
           <div className="p-10 h-[650px] overflow-y-auto font-mono text-sm space-y-4 custom-scrollbar bg-black/20 backdrop-blur-sm">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-6 group animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <span className="text-muted-foreground/20 shrink-0 select-none text-[10px] mt-1 font-mono tracking-tighter">{log.time}</span>
                  <div className={cn(
                    "flex gap-3 items-start",
                    log.type === 'success' ? "text-emerald-400" :
                    log.type === 'error' ? "text-red-400" :
                    log.type === 'system' ? "text-accent font-black" : "text-white/60"
                  )}>
                    {log.type === 'success' && <CheckCircle2 size={14} className="mt-1 shrink-0" />}
                    {log.type === 'error' && <XCircle size={14} className="mt-1 shrink-0" />}
                    <span className="leading-relaxed">
                      <span className="opacity-30 mr-3 text-[10px]">{log.type === 'system' ? 'ROOT@SYSTEM:' : 'USER@TERMINAL:'}</span>
                      {log.message}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={logEndRef} />
           </div>
        </div>
      </div>
    </div>
  );
}
