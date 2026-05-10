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
import { MyCandidate } from "@/types";
import Link from "next/link";

interface MyCandidateTableProps {
  candidates: MyCandidate[];
}

export function MyCandidateTable({ candidates }: MyCandidateTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Localidade</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead>Origem</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Nenhum candidato encontrado em sua lista.
              </TableCell>
            </TableRow>
          ) : (
            candidates.map((candidate) => (
              <TableRow key={candidate.id}>
                <TableCell className="font-medium">{candidate.nome}</TableCell>
                <TableCell>
                  <div className="flex flex-col text-sm">
                    <span>{candidate.telefone}</span>
                    <span className="text-muted-foreground">{candidate.email || 'Sem email'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {candidate.municipio} - {candidate.uf}
                </TableCell>
                <TableCell>{candidate.cargo}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    candidate.tipo_origem === 'TSE' 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' 
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                  }`}>
                    {candidate.tipo_origem}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="secondary" size="sm" asChild>
                    <Link href="/crm">Ver no CRM</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
