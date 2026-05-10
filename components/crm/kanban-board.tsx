'use client';

import React from 'react';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';

const COLUMNS = [
  { id: 'PROSPECT', title: 'Prospect' },
  { id: 'CONTATADO', title: 'Contatado' },
  { id: 'REUNIAO', title: 'Reunião' },
  { id: 'PROPOSTA', title: 'Proposta' },
  { id: 'FECHADO', title: 'Fechado' },
  { id: 'PERDIDO', title: 'Perdido' },
];

export function KanbanBoard() {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    console.log('Drag ended:', { activeId: active.id, overId: over.id });
    // TODO: Implement lead movement logic
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 p-4 overflow-x-auto min-h-[calc(100vh-200px)]">
        {COLUMNS.map((column) => (
          <div
            key={column.id}
            className="flex flex-col w-80 bg-slate-100 rounded-lg p-4 shrink-0"
          >
            <h3 className="font-semibold mb-4 text-slate-700 uppercase text-sm tracking-wider">
              {column.title}
            </h3>
            <div className="flex-1 space-y-3">
              {/* Leads will be rendered here */}
              <div className="text-xs text-slate-400 text-center py-8 border-2 border-dashed border-slate-200 rounded-md">
                Nenhum lead
              </div>
            </div>
          </div>
        ))}
      </div>
    </DndContext>
  );
}
