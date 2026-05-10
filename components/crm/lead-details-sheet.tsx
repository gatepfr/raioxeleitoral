'use client';

import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Lead, InteractionType } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MessageSquare, Phone, Users, Mail, MoreHorizontal } from 'lucide-react';

interface LeadDetailsSheetProps {
  lead: Lead | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onInteractionAdded?: () => void;
}

const INTERACTION_ICONS: Record<InteractionType, React.ReactNode> = {
  WHATSAPP: <MessageSquare className="h-4 w-4 text-green-500" />,
  CALL: <Phone className="h-4 w-4 text-blue-500" />,
  MEETING: <Users className="h-4 w-4 text-purple-500" />,
  EMAIL: <Mail className="h-4 w-4 text-orange-500" />,
  OTHER: <MoreHorizontal className="h-4 w-4 text-gray-500" />,
};

export function LeadDetailsSheet({
  lead,
  isOpen,
  onOpenChange,
  onInteractionAdded,
}: LeadDetailsSheetProps) {
  const [anotacao, setAnotacao] = useState('');
  const [tipoContato, setTipoContato] = useState<InteractionType>('WHATSAPP');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!lead || !lead.my_candidate) return null;

  const candidate = lead.my_candidate;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!anotacao.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: lead.id,
          anotacao,
          tipo_contato: tipoContato,
        }),
      });

      if (response.ok) {
        setAnotacao('');
        onInteractionAdded?.();
      }
    } catch (error) {
      console.error('Error adding interaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{candidate.nome}</SheetTitle>
          <div className="text-sm text-muted-foreground">
            {candidate.partido || 'Sem partido'} - {candidate.cargo}
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Lead Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold block">Município</span>
              {candidate.municipio} - {candidate.uf}
            </div>
            <div>
              <span className="font-semibold block">Status</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                {lead.status}
              </span>
            </div>
          </div>

          {/* New Interaction Form */}
          <form onSubmit={handleSubmit} className="space-y-3 border-t pt-6">
            <h3 className="text-sm font-semibold">Nova Interação</h3>
            <div className="flex gap-2">
              <Select
                value={tipoContato}
                onValueChange={(value) => setTipoContato(value as InteractionType)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                  <SelectItem value="CALL">Ligação</SelectItem>
                  <SelectItem value="MEETING">Reunião</SelectItem>
                  <SelectItem value="EMAIL">E-mail</SelectItem>
                  <SelectItem value="OTHER">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Textarea
              placeholder="Descreva o que foi conversado..."
              value={anotacao}
              onChange={(e) => setAnotacao(e.target.value)}
              className="min-h-[100px]"
            />
            <Button type="submit" disabled={isSubmitting || !anotacao.trim()} className="w-full">
              {isSubmitting ? 'Salvando...' : 'Registrar Interação'}
            </Button>
          </form>

          {/* Timeline */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-sm font-semibold">Histórico</h3>
            <div className="space-y-4">
              {lead.interactions && lead.interactions.length > 0 ? (
                lead.interactions.map((interaction) => (
                  <div key={interaction.id} className="flex gap-3 text-sm">
                    <div className="mt-1">
                      {INTERACTION_ICONS[interaction.tipo_contato]}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{interaction.tipo_contato}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(interaction.data_registro), "dd 'de' MMM, HH:mm", {
                            locale: ptBR,
                          })}
                        </span>
                      </div>
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {interaction.anotacao}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma interação registrada ainda.
                </p>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
