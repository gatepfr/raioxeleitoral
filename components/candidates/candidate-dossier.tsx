"use client"

import { Candidate } from "@/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { User, Wallet, Share2, ExternalLink, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface CandidateDossierProps {
  candidate: Candidate | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onCaptureLead: (candidateId: string) => void
}

export function CandidateDossier({
  candidate,
  isOpen,
  onOpenChange,
  onCaptureLead,
}: CandidateDossierProps) {
  if (!candidate) return null

  const totalAssets = candidate.assets?.reduce((acc, asset) => acc + asset.valor, 0) ?? 0

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <User className="h-6 w-6" />
            Dossiê do Candidato
          </DialogTitle>
          <DialogDescription>
            Informações detalhadas sobre {candidate.nome_completo}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Nome Completo</p>
              <p className="text-lg font-semibold">{candidate.nome_completo}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">CPF</p>
              <p className="text-lg font-semibold">{candidate.cpf}</p>
            </div>
          </div>

          {/* Assets Summary */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <Wallet className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Patrimônio Declarado</h3>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">Patrimônio Total</p>
              <p className="text-3xl font-bold text-primary">
                {formatCurrency(totalAssets)}
              </p>
            </div>

            {candidate.assets && candidate.assets.length > 0 ? (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo de Bem</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {candidate.assets.map((asset) => (
                      <TableRow key={asset.id}>
                        <TableCell className="font-medium">{asset.tipo_bem}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {asset.descricao}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(asset.valor)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Nenhum bem declarado.
              </p>
            )}
          </div>

          {/* Electoral Performance */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Desempenho Eleitoral ({candidate.ano_ultima_eleicao})</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">Total de Votos</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {candidate.total_votos?.toLocaleString() ?? 0}
                </p>
              </div>
              <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg border border-pink-100 dark:border-pink-800">
                <p className="text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400 mb-1">Total Gasto</p>
                <p className="text-2xl font-bold text-pink-700 dark:text-pink-300">
                  {formatCurrency(candidate.total_despesas ?? 0)}
                </p>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-900/20 p-4 rounded-lg border border-zinc-100 dark:border-zinc-800">
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">Custo por Voto</p>
                <p className="text-2xl font-bold text-zinc-700 dark:text-zinc-300">
                  {candidate.total_votos > 0 
                    ? formatCurrency((candidate.total_despesas ?? 0) / candidate.total_votos)
                    : "R$ 0,00"}
                </p>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <Share2 className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Redes Sociais</h3>
            </div>
            {candidate.socials && candidate.socials.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {candidate.socials.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
                  >
                    <ExternalLink className="h-3 w-3" />
                    {social.tipo_rede}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Nenhuma rede social informada.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
            <Button variant="outline" asChild>
              <a href={`/dossie/print/${candidate.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Gerar PDF
              </a>
            </Button>
            {candidate.lead ? (
              <Button variant="secondary" asChild>
                <Link href="/crm">Ver no CRM</Link>
              </Button>
            ) : (
              <Button onClick={() => onCaptureLead(candidate.id)}>
                Capturar Lead
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
