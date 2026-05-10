"use client"

import { KanbanBoard } from "@/components/crm/kanban-board"
import { Button } from "@/components/ui/button"
import { ArrowLeft, LayoutDashboard } from "lucide-react"
import Link from "next/link"

export default function CRMPage() {
  return (
    <main className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950">
      <div className="container mx-auto py-10 px-4 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary mb-2">
              <LayoutDashboard className="h-5 w-5" />
              <span className="font-semibold uppercase tracking-wider text-xs">CRM de Vendas</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Quadro de Vendas
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Gerencie seus leads e acompanhe o progresso das negociações.
            </p>
          </div>
          
          <Button variant="outline" asChild className="w-fit">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar para Prospecção
            </Link>
          </Button>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border shadow-sm p-6 overflow-x-auto">
          <KanbanBoard />
        </div>
      </div>
    </main>
  )
}
