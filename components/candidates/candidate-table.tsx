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
              <TableRow key={candidate.id}>
                <TableCell className="font-medium">{candidate.nome_urna}</TableCell>
                <TableCell>{candidate.partido}</TableCell>
                <TableCell>{candidate.cargo}</TableCell>
                <TableCell>
                  {candidate.municipio} - {candidate.uf}
                </TableCell>
                <TableCell className="text-right font-semibold text-zinc-700 dark:text-zinc-300">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(candidate.patrimonio_total)}
                </TableCell>
                <TableCell className="text-right space-x-2">
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
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
