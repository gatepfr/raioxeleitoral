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
                  <div className="flex flex-col gap-1.5">
                    <div className="font-bold text-zinc-900 dark:text-zinc-100">
                      {candidate.nome_urna}
                    </div>
                    <div className="text-xs text-zinc-500 uppercase tracking-tight font-medium">
                      {candidate.partido}
                    </div>
                    <div className="mt-1 flex">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
                        Bens Declarados: {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(candidate.patrimonio_total)}
                      </span>
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
