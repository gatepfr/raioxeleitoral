"use client";

import { useState, useEffect } from "react";
import { FilterBar } from "@/components/candidates/filter-bar";
import { CandidateTable } from "@/components/candidates/candidate-table";
import { CandidateDossier } from "@/components/candidates/candidate-dossier";
import { Candidate } from "@/types";
import { Loader2, LayoutDashboard, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [filters, setFilters] = useState({ uf: "", municipio: "" });

  const fetchCandidates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.uf) params.append("uf", filters.uf);
      if (filters.municipio) params.append("municipio", filters.municipio);

      const response = await fetch(`/api/candidates?${params.toString()}`);
      if (!response.ok) throw new Error("Falha ao carregar candidatos. Por favor, tente novamente.");
      
      const data = await response.json();
      setCandidates(data);
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

  const handleSearch = (newFilters: { uf: string; municipio: string }) => {
    setFilters(newFilters);
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
      // Refresh candidates to update the "Ver no CRM" button
      fetchCandidates();
    } catch (error) {
      console.error("Error capturing lead:", error);
      alert(error instanceof Error ? error.message : "Erro ao capturar lead.");
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950">
      <div className="container mx-auto py-10 px-4 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Prospecção de Candidatos
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Explore e analise candidatos das eleições municipais de 2024.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" className="w-fit">
              <Link href="/my-candidates" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Meus Candidatos
              </Link>
            </Button>

            <Button asChild className="w-fit">
              <Link href="/crm" className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Ver Quadro de Vendas
              </Link>
            </Button>
          </div>
        </div>

        <FilterBar onSearch={handleSearch} />

        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="bg-white dark:bg-zinc-900 rounded-xl border shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-zinc-600 dark:text-zinc-400 font-medium">
                Carregando candidatos...
              </p>
            </div>
          ) : (
            <CandidateTable 
              candidates={candidates} 
              onViewDossier={handleViewDossier} 
              onCaptureLead={handleCaptureLead}
            />
          )}
        </div>

        <CandidateDossier
          candidate={selectedCandidate}
          isOpen={isDossierOpen}
          onOpenChange={setIsDossierOpen}
          onCaptureLead={handleCaptureLead}
        />
      </div>
    </main>
  );
}
