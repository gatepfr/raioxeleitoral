'use client';

import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import { Lead, LeadStatus } from '@/types';
import { KanbanColumn } from './kanban-column';
import { KanbanCard } from './kanban-card';

const COLUMNS: { id: LeadStatus; title: string }[] = [
  { id: 'PROSPECT', title: 'Prospect' },
  { id: 'CONTATADO', title: 'Contatado' },
  { id: 'REUNIAO', title: 'Reunião' },
  { id: 'PROPOSTA', title: 'Proposta' },
  { id: 'FECHADO', title: 'Fechado' },
  { id: 'PERDIDO', title: 'Perdido' },
];

export function KanbanBoard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeLead, setActiveLead] = useState<Lead | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Lead') {
      setActiveLead(event.active.data.current.lead);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveLead(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    console.log('Drag ended:', { activeId, overId });
    // TODO: Implement lead movement logic in Task 4
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 p-4 overflow-x-auto min-h-[calc(100vh-200px)]">
        {COLUMNS.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            leads={leads.filter((lead) => lead.status === column.id)}
          />
        ))}
      </div>
      <DragOverlay>
        {activeLead ? (
          <div className="w-80 opacity-90">
            <KanbanCard lead={activeLead} isOverlay={true} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
