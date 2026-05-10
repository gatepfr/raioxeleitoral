'use client';

import { useState, useEffect, useCallback } from "react";
import { MyCandidateTable } from "@/components/my-candidates/my-candidate-table";
import { FilterBar } from "@/components/candidates/filter-bar";
import { AddCandidateDialog } from "@/components/my-candidates/add-candidate-dialog";
import { Loader2 } from "lucide-react";
import { MyCandidate } from "@/types";
import { MainLayout } from "@/components/layout/main-layout";

export default function MyCandidatesPage() {
  const [candidates, setCandidates] = useState<MyCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ uf: "", municipio: "" });

  const fetchCandidates = useCallback(async (currentFilters: { uf: string; municipio: string }) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (currentFilters.uf) params.append("uf", currentFilters.uf);
      if (currentFilters.municipio) params.append("municipio", currentFilters.municipio);

      const response = await fetch(`/api/my-candidates?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch candidates");
      const data = await response.json();
      setCandidates(data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCandidates(filters);
  }, [fetchCandidates, filters]);

  const handleSearch = (newFilters: { uf: string; municipio: string }) => {
    setFilters(newFilters);
  };

  const handleAddSuccess = () => {
    fetchCandidates(filters);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Meus Candidatos
            </h1>
            <p className="text-base text-zinc-500 dark:text-zinc-400">
              Gerencie os candidatos que você capturou ou adicionou manualmente.
            </p>
          </div>
          
          <div className="flex gap-2">
            <AddCandidateDialog onSuccess={handleAddSuccess} />
          </div>
        </div>

        <FilterBar onSearch={handleSearch} />

        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-zinc-500 text-sm font-medium">
                Carregando seus candidatos...
              </p>
            </div>
          ) : (
            <MyCandidateTable candidates={candidates} />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
