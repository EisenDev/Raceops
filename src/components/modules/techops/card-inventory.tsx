'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Trash2, Calendar, Database } from 'lucide-react';
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

export function CardInventory({ cards, isAdmin }: CardInventoryProps) {
  const [searchTerm, setSearch] = useState('');
  const [voidCardId, setVoidCardId] = useState<string | null>(null);
  const [isVoiding, setIsVoiding] = useState(false);

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
            <Card key={card.id} className="border-none shadow-sm group hover:border-[#1A1A1A]/5 transition-all">
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
                      <p className="text-xs font-bold text-[#1A1A1A] uppercase tracking-tighter truncate max-w-[150px]">{card.label}</p>
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
                   <div className="flex items-center gap-2">
                      <Calendar size={12} className="text-[#999999]" />
                      <span className="text-[10px] font-bold text-[#999999]">{new Date(card.createdAt).toLocaleDateString()}</span>
                   </div>
                   {isAdmin && card.status === 'ACTIVE' && (
                     <Button 
                       variant="ghost" 
                       size="sm" 
                       className="h-8 w-8 p-0 text-[#999999] hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                       onClick={() => setVoidCardId(card.id)}
                     >
                       <Trash2 size={14} />
                     </Button>
                   )}
                   {card.status === 'USED' && card.usedByTeam && (
                     <Badge variant="muted" className="bg-[#1A1A1A]/5 text-[#1A1A1A] text-[7px] uppercase">
                       {card.usedByTeam.name}
                     </Badge>
                   )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

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
