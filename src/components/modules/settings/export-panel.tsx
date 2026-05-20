'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Download, Calendar, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExportPanelProps {
  years: number[];
  currentYear: number;
}

export function ExportPanel({ years, currentYear }: ExportPanelProps) {
  const [selectedYear, setSelectedYear] = useState(currentYear);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-40">Select Event Year</label>
        <div className="grid grid-cols-3 gap-2">
          {years.map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={cn(
                "h-10 rounded-lg text-xs font-bold transition-all border",
                selectedYear === year 
                  ? "bg-black text-white border-black" 
                  : "bg-black/5 text-black/40 border-transparent hover:bg-black/10"
              )}
            >
              {year === currentYear ? `${year} (Active)` : year}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-4 border-t border-black/5">
        <a href={`/api/export/scores?year=${selectedYear}`} download>
          <Button className="w-full h-14 text-sm bg-black text-white hover:bg-black/90">
            <Download size={16} className="mr-2 opacity-60" /> Export Excel ({selectedYear})
          </Button>
        </a>
        
        <a href="/api/export/details" download>
          <Button variant="secondary" className="w-full h-14 text-sm bg-black/5 text-black border-black/10">
            <Terminal size={16} className="mr-2 opacity-60" /> Full Audit Log
          </Button>
        </a>
      </div>
      
      <p className="text-[10px] text-center text-black/30 font-medium italic">
        Report includes individual game scores and total aggregate time.
      </p>
    </div>
  );
}
