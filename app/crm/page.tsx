"use client"

import { KanbanBoard } from "@/components/crm/kanban-board"
import { LayoutDashboard } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"

export default function CRMPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary mb-2">
              <LayoutDashboard className="h-5 w-5" />
              <span className="font-semibold uppercase tracking-wider text-xs">CRM de Vendas</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Quadro de Vendas
            </h1>
            <p className="text-base text-zinc-500 dark:text-zinc-400">
              Gerencie seus leads e acompanhe o progresso das negociações.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm p-6 overflow-x-auto">
          <KanbanBoard />
        </div>
      </div>
    </MainLayout>
  )
}
