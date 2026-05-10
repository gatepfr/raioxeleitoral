'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Lead } from '@/types';
import { KanbanCard } from './kanban-card';

interface KanbanColumnProps {
  id: string;
  title: string;
  leads: Lead[];
  onCardClick?: (lead: Lead) => void;
}

export function KanbanColumn({ id, title, leads, onCardClick }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
    data: {
      type: 'Column',
      columnId: id,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col w-80 bg-slate-100 rounded-lg p-4 shrink-0"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-slate-700 uppercase text-sm tracking-wider">
          {title}
        </h3>
        <span className="bg-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
          {leads.length}
        </span>
      </div>
      
      <div className="flex-1 space-y-3">
        <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
          {leads.length > 0 ? (
            leads.map((lead) => (
              <KanbanCard key={lead.id} lead={lead} onClick={onCardClick} />
            ))
          ) : (
            <div className="text-xs text-slate-400 text-center py-8 border-2 border-dashed border-slate-200 rounded-md">
              Nenhum lead
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}
