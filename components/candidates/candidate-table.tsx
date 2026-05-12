'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Candidate } from "@/types";
import Link from "next/link";

import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import Image from "next/image";

interface CandidateTableProps {
  candidates: Candidate[];
  onViewDossier: (candidate: Candidate) => void;
  onCaptureLead: (candidateId: string) => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
}

export function CandidateTable({ 
  candidates, 
  onViewDossier, 
  onCaptureLead,
  sortBy,
  sortOrder,
  onSort
}: CandidateTableProps) {
  const getPhotoUrl = (cand: Candidate) => {
    let electionId = "2045202024"; // Default 2024
    if (cand.ano_ultima_eleicao === 2022) electionId = "20220001";
    if (cand.ano_ultima_eleicao === 2020) electionId = "2030402020";
    if (cand.ano_ultima_eleicao === 2018) electionId = "20180001";
    
    return `https://divulgacandcontas.tse.jus.br/divulga/rest/v1/candidatura/buscar/foto/${electionId}/${cand.sq_candidato}/${electionId}`;
  };

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4 text-primary" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4 text-primary" />
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer hover:bg-zinc-50 transition-colors"
              onClick={() => onSort("nome_urna")}
            >
              <div className="flex items-center">
                Candidato / Info Financeira
                {renderSortIcon("nome_urna")}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-zinc-50 transition-colors"
              onClick={() => onSort("cargo")}
            >
              <div className="flex items-center">
                Atuação / Localidade
                {renderSortIcon("cargo")}
              </div>
            </TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                Nenhum candidato encontrado.
              </TableCell>
            </TableRow>
          ) : (
            candidates.map((candidate) => (
              <TableRow key={candidate.id} className="group hover:bg-zinc-50/50">
                <TableCell className="py-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 relative rounded-full overflow-hidden border-2 border-muted bg-muted flex-shrink-0 mt-0.5 shadow-sm">
                      <Image 
                        src={getPhotoUrl(candidate)} 
                        alt={candidate.nome_urna}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <div className="font-bold text-zinc-900 dark:text-zinc-100 truncate">
                        {candidate.nome_urna}
                      </div>
                      <div className="text-xs text-zinc-500 uppercase tracking-tight font-medium truncate">
                        {candidate.partido}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
                        Bens: {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                          maximumFractionDigits: 0,
                        }).format(candidate.patrimonio_total)}
                      </span>
                      {candidate.total_votos > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
                          🗳️ {candidate.total_votos.toLocaleString()} votos
                        </span>
                      )}
                      {candidate.total_despesas > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-pink-50 text-pink-700 border border-pink-100 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-800">
                          💸 Gasto: {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                            maximumFractionDigits: 0,
                          }).format(candidate.total_despesas)}
                        </span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {candidate.cargo}
                    </div>
                    <div className="text-xs text-zinc-500">
                      {candidate.municipio} - {candidate.uf}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onViewDossier(candidate)}
                    >
                      Dossiê
                    </Button>
                    {candidate.lead ? (
                      <Button variant="secondary" size="sm" asChild>
                        <Link href="/crm">Ver no CRM</Link>
                      </Button>
                    ) : (
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => onCaptureLead(candidate.id)}
                      >
                        Capturar Lead
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
