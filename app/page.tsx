"use client";

import { useState, useEffect } from "react";
import { FilterBar } from "@/components/candidates/filter-bar";
import { CandidateTable } from "@/components/candidates/candidate-table";
import { CandidateDossier } from "@/components/candidates/candidate-dossier";
import { Candidate } from "@/types";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/main-layout";

export default function Home() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [pagination, setPagination] = useState({ totalCount: 0, totalPages: 0, currentPage: 1 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [filters, setFilters] = useState({ 
    uf: "", 
    municipio: "", 
    partido: "", 
    minPatrimonio: "", 
    maxPatrimonio: "",
    sortBy: "nome_urna",
    sortOrder: "asc",
    page: 1
  });

  const fetchCandidates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.uf) params.append("uf", filters.uf);
      if (filters.municipio) params.append("municipio", filters.municipio);
      if (filters.partido) params.append("partido", filters.partido);
      if (filters.minPatrimonio) params.append("minPatrimonio", filters.minPatrimonio);
      if (filters.maxPatrimonio) params.append("maxPatrimonio", filters.maxPatrimonio);
      params.append("sortBy", filters.sortBy);
      params.append("sortOrder", filters.sortOrder);
      params.append("page", filters.page.toString());

      const response = await fetch(`/api/candidates?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || "Falha ao carregar candidatos.");
      }
      
      setCandidates(data.candidates);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setError(error instanceof Error ? error.message : "Ocorreu um erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [filters]);

  const handleSearch = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleSort = (field: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === "asc" ? "desc" : "asc",
      page: 1
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleViewDossier = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsDossierOpen(true);
  };

  const handleCaptureLead = async (candidateId: string) => {
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ candidate_id: candidateId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Falha ao capturar lead.");
      }

      alert("Lead capturado com sucesso!");
      fetchCandidates();
    } catch (error) {
      console.error("Error capturing lead:", error);
      alert(error instanceof Error ? error.message : "Erro ao capturar lead.");
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Prospecção de Candidatos
          </h1>
          <p className="text-base text-zinc-500 dark:text-zinc-400">
            Explore e analise candidatos das eleições municipais de 2024.
          </p>
        </div>

        <FilterBar onSearch={handleSearch} />

        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-zinc-500 text-sm font-medium">
                Carregando candidatos...
              </p>
            </div>
          ) : (
            <CandidateTable 
              candidates={candidates} 
              onViewDossier={handleViewDossier} 
              onCaptureLead={handleCaptureLead}
              sortBy={filters.sortBy}
              sortOrder={filters.sortOrder as "asc" | "desc"}
              onSort={handleSort}
            />
          )}
        </div>

        {/* Pagination Controls */}
        {!isLoading && candidates.length > 0 && (
          <div className="flex items-center justify-between py-2">
            <div className="text-sm text-zinc-500">
              Mostrando <span className="font-medium text-zinc-900 dark:text-zinc-100">{candidates.length}</span> de <span className="font-medium text-zinc-900 dark:text-zinc-100">{pagination.totalCount}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
              >
                Anterior
              </Button>
              <div className="text-sm text-zinc-500 font-medium px-2">
                {pagination.currentPage} / {pagination.totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
              >
                Próximo
              </Button>
            </div>
          </div>
        )}

        <CandidateDossier
          candidate={selectedCandidate}
          isOpen={isDossierOpen}
          onOpenChange={setIsDossierOpen}
          onCaptureLead={handleCaptureLead}
        />
      </div>
    </MainLayout>
  );
}
