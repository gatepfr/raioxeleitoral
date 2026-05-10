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

interface CandidateTableProps {
  candidates: Candidate[];
  onViewDossier: (candidate: Candidate) => void;
  onCaptureLead: (candidateId: string) => void;
}

export function CandidateTable({ candidates, onViewDossier, onCaptureLead }: CandidateTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome de Urna</TableHead>
            <TableHead>Partido</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead>Localidade</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
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
