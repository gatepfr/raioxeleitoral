"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Target
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MainLayout } from "@/components/layout/main-layout";

interface DashboardData {
  summary: {
    totalLeads: number;
    closedDeals: number;
    totalNegotiationValue: number;
  };
  funnel: Array<{ status: string; count: number }>;
  recentActivity: Array<{
    id: string;
    candidateName: string;
    type: string;
    note: string;
    date: string;
  }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <MainLayout>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Dashboard Executivo</h1>
          <p className="text-base text-zinc-500 dark:text-zinc-400">Visão geral do desempenho da agência.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.summary?.totalLeads ?? 0}</div>
              <p className="text-xs text-muted-foreground">Capturados do TSE ou Manuais</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contratos Fechados</CardTitle>
              <Target className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.summary?.closedDeals ?? 0}</div>
              <p className="text-xs text-muted-foreground">Clientes convertidos</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor em Negociação</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(data?.summary?.totalNegotiationValue || 0)}
              </div>
              <p className="text-xs text-muted-foreground">Status: Reunião & Proposta</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversão</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.summary?.totalLeads ? ((data.summary.closedDeals / data.summary.totalLeads) * 100).toFixed(1) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">Leads vs Clientes</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
          {/* Funnel Distribution */}
          <Card className="lg:col-span-4 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader>
              <CardTitle>Distribuição do Funil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data?.funnel?.map(f => (
                <div key={f.status} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{f.status}</span>
                    <span className="text-muted-foreground">{f.count} leads</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all" 
                      style={{ width: `${(f.count / (data.summary?.totalLeads || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-3 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4" />
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {data?.recentActivity?.map(activity => (
                  <div key={activity.id} className="relative pl-4 border-l-2 border-zinc-100 dark:border-zinc-800 pb-2">
                    <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-white dark:bg-zinc-950 border-2 border-primary" />
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-sm">{activity.candidateName}</span>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">
                        {format(new Date(activity.date), "HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 italic">
                      "{activity.note}"
                    </p>
                    <div className="mt-1">
                      <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-medium">
                        {activity.type}
                      </span>
                    </div>
                  </div>
                ))}
                {(data?.recentActivity?.length === 0 || !data?.recentActivity) && (
                  <p className="text-center text-sm text-muted-foreground py-10">
                    Nenhuma atividade registrada hoje.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
