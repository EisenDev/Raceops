'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Trash2, Calendar, Database, Eye, Terminal } from 'lucide-react';
import { voidTechOpsCard } from '@/lib/actions/techops';
import { cn } from '@/lib/utils';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface CardInventoryProps {
  cards: {
    id: string;
    code: string;
    label: string;
    type: string;
    points: number;
    status: string;
    createdAt: Date;
    usedByTeam: { name: string } | null;
  }[];
  isAdmin: boolean;
}

const typeColors: Record<string, string> = {
  FRONTEND: 'bg-blue-50 text-blue-600 border-blue-100',
  BACKEND: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  DATABASE: 'bg-amber-50 text-amber-600 border-amber-100',
  DEVOPS: 'bg-purple-50 text-purple-600 border-purple-100',
  CLOUD: 'bg-sky-50 text-sky-600 border-sky-100',
  SECURITY: 'bg-red-50 text-red-600 border-red-100',
  BONUS: 'bg-pink-50 text-pink-600 border-pink-100',
  RARE: 'bg-yellow-50 text-yellow-600 border-yellow-100',
  BUGGED: 'bg-slate-900 text-white border-slate-800',
};

export function CardInventory({ cards, isAdmin }: CardInventoryProps) {
  const [searchTerm, setSearch] = useState('');
  const [voidCardId, setVoidCardId] = useState<string | null>(null);
  const [isVoiding, setIsVoiding] = useState(false);
  const [viewingCard, setViewingCard] = useState<CardInventoryProps['cards'][0] | null>(null);

  const filteredCards = cards.filter(card => 
    card.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVoid = async () => {
    if (!voidCardId) return;
    setIsVoiding(true);
    const result = await voidTechOpsCard(voidCardId);
    if (result.error) alert(result.error);
    setVoidCardId(null);
    setIsVoiding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#999999] px-2 flex items-center gap-2">
          <Database size={14} />
          Card Inventory ({cards.length})
        </h3>
        <div className="relative w-full sm:w-64">
           <Input 
             placeholder="Search codes or labels..." 
             className="pl-10 h-10 text-sm border-none bg-white shadow-sm"
             value={searchTerm}
             onChange={(e) => setSearch(e.target.value)}
           />
           <Search size={16} className="absolute left-3 top-3 text-[#999999]" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredCards.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-[#F9F9F9]/50 rounded-2xl border border-dashed border-[#1A1A1A]/5">
             <p className="text-xs font-bold text-[#999999] uppercase tracking-widest">No cards found matching your search</p>
          </div>
        ) : (
          filteredCards.map((card) => (
            <Card 
              key={card.id} 
              onClick={() => setViewingCard(card)}
              className="border-none shadow-sm group hover:border-[#1A1A1A]/5 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
            >
              {/* Type Stripe */}
              <div className={cn("absolute top-0 left-0 bottom-0 w-1", typeColors[card.type] || 'bg-slate-200')} />
              
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                   <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black tracking-widest">{card.code}</span>
                        <Badge variant={
                          card.status === 'ACTIVE' ? 'default' : 
                          card.status === 'USED' ? 'success' : 'error'
                        } className="text-[7px]">
                          {card.status}
                        </Badge>
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-xs font-bold text-[#1A1A1A] uppercase tracking-tighter truncate max-w-[150px]">{card.label}</p>
                        <span className={cn(
                          "inline-block px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest w-fit border",
                          typeColors[card.type] || 'bg-slate-100'
                        )}>
                          {card.type}
                        </span>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black uppercase text-[#999999]">Points</p>
                      <p className={cn(
                        "font-black text-sm",
                        card.points > 0 ? "text-[#1A1A1A]" : "text-red-500"
                      )}>
                        {card.points > 0 ? `+${card.points}` : card.points}
                      </p>
                   </div>
                </div>

                <div className="pt-3 border-t border-[#1A1A1A]/5 flex items-center justify-between">
                   <div className="flex items-center gap-2 text-[#999999]">
                      <Calendar size={12} />
                      <span className="text-[10px] font-bold">{new Date(card.createdAt).toLocaleDateString()}</span>
                   </div>
                   
                   <div className="flex items-center gap-2">
                     {card.status === 'USED' && card.usedByTeam && (
                       <Badge variant="muted" className="bg-[#1A1A1A]/5 text-[#1A1A1A] text-[7px] uppercase font-black tracking-tighter">
                         {card.usedByTeam.name}
                       </Badge>
                     )}
                     {isAdmin && card.status === 'ACTIVE' && (
                       <Button 
                         variant="ghost" 
                         size="sm" 
                         className="h-8 w-8 p-0 text-red-400 hover:text-red-600 hover:bg-red-50 transition-all"
                         onClick={(e) => {
                           e.stopPropagation();
                           setVoidCardId(card.id);
                         }}
                       >
                         <Trash2 size={14} />
                       </Button>
                     )}
                     <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-[#F9F9F9] text-[#1A1A1A] opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye size={14} />
                     </div>
                   </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Card Detail Modal */}
      {viewingCard && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setViewingCard(null)}>
          <Card className="w-full max-w-sm shadow-2xl border-none overflow-hidden text-center" onClick={(e) => e.stopPropagation()}>
            <div className={cn("h-2 w-full", typeColors[viewingCard.type] || 'bg-slate-200')} />
            <div className="p-10 space-y-8">
               <div className="space-y-2">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border",
                    typeColors[viewingCard.type]
                  )}>
                    {viewingCard.type}
                  </span>
                  <h2 className="text-xl font-black uppercase tracking-tight text-[#1A1A1A] pt-2">{viewingCard.label}</h2>
               </div>

               <div className="bg-[#F9F9F9] rounded-3xl p-8 border border-[#1A1A1A]/5 space-y-2 relative overflow-hidden">
                  <Terminal size={48} className="absolute -top-4 -right-4 opacity-5" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#999999]">Access Code</p>
                  <p className="text-4xl font-black tracking-[0.2em] text-[#1A1A1A] font-mono">{viewingCard.code}</p>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black uppercase tracking-widest text-[#999999]">Value</p>
                     <p className={cn("text-xl font-black", viewingCard.points > 0 ? "text-[#1A1A1A]" : "text-red-500")}>
                        {viewingCard.points > 0 ? `+${viewingCard.points}` : viewingCard.points} PTS
                     </p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black uppercase tracking-widest text-[#999999]">Status</p>
                     <Badge variant={viewingCard.status === 'ACTIVE' ? 'default' : 'success'}>{viewingCard.status}</Badge>
                  </div>
               </div>

               <Button className="w-full h-14 rounded-2xl text-lg font-bold" onClick={() => setViewingCard(null)}>
                  Close Preview
               </Button>
            </div>
          </Card>
        </div>
      )}

      <ConfirmModal 
        isOpen={!!voidCardId}
        onClose={() => setVoidCardId(null)}
        onConfirm={handleVoid}
        title="Void Card"
        description="Are you sure you want to void this card? It will no longer be scannable during the event."
        confirmText="Void Card"
        isPending={isVoiding}
      />
    </div>
  );
}
