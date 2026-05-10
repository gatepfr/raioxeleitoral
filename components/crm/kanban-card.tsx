'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lead } from '@/types';

interface KanbanCardProps {
  lead: Lead;
  isOverlay?: boolean;
  onClick?: (lead: Lead) => void;
}

export const KanbanCard = React.memo(function KanbanCard({ lead, isOverlay, onClick }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: lead.id,
    data: {
      type: 'Lead',
      lead,
    },
    disabled: isOverlay,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging && !isOverlay) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 bg-slate-200 h-[100px] rounded-lg border-2 border-dashed border-slate-400"
      />
    );
  }

  const candidate = lead.my_candidate;

  if (!candidate) return null;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick?.(lead)}
      className={`cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors ${
        isOverlay ? 'shadow-xl border-primary ring-2 ring-primary/20' : ''
      }`}
    >
      <CardHeader className="p-3 pb-0">
        <CardTitle className="text-sm font-bold truncate">
          {candidate.nome}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-1 space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{candidate.partido || 'Sem partido'}</span>
          <span className="font-medium text-slate-900">
            {candidate.cargo}
          </span>
        </div>
        <div className="text-[10px] text-muted-foreground truncate">
          {candidate.municipio} - {candidate.uf}
        </div>
      </CardContent>
    </Card>
  );
});
