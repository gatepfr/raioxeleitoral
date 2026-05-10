'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
import { LeadDetailsSheet } from './lead-details-sheet';

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
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const fetchLeads = useCallback(async () => {
    try {
      const response = await fetch('/api/leads');
      const data = await response.json();
      setLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

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

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveLead(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // If dropped over a column
    const isColumn = COLUMNS.some((col) => col.id === overId);
    const newStatus = isColumn ? (overId as LeadStatus) : null;

    if (newStatus && activeLead && activeLead.status !== newStatus) {
      // Optimistic update
      setLeads((prev) =>
        prev.map((l) => (l.id === activeId ? { ...l, status: newStatus } : l))
      );

      try {
        await fetch(`/api/leads/${activeId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });
      } catch (error) {
        console.error('Error updating lead status:', error);
        fetchLeads(); // Revert on error
      }
    }
  };

  const handleCardClick = useCallback((lead: Lead) => {
    setSelectedLead(lead);
    setIsSheetOpen(true);
  }, []);

  return (
    <>
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
              onCardClick={handleCardClick}
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

      <LeadDetailsSheet
        lead={selectedLead}
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onInteractionAdded={fetchLeads}
      />
    </>
  );
}
