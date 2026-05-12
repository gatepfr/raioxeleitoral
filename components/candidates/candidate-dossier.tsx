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
import Image from "next/image"

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

  const getPhotoUrl = (cand: Candidate) => {
    let electionId = "2045202024"; // Default 2024
    if (cand.ano_ultima_eleicao === 2022) electionId = "20220001";
    if (cand.ano_ultima_eleicao === 2020) electionId = "2030402020";
    if (cand.ano_ultima_eleicao === 2018) electionId = "20180001";
    
    // Using the correct TSE architecture format provided by the user
    // Format: .../img/{electionId}/{sq_candidato}/{ue_id}
    return `https://divulgacandcontas.tse.jus.br/divulga/rest/arquivo/img/${electionId}/${cand.sq_candidato}/${cand.ue_id}`;
  };

  const totalAssets = candidate.assets?.reduce((acc, asset) => acc + asset.valor, 0) ?? 0

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <User className="h-6 w-6 text-primary" />
            Dossiê do Candidato
          </DialogTitle>
          <DialogDescription>
            Informações detalhadas sobre {candidate.nome_completo}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-10 py-4">
          {/* Basic Info with Photo */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-56 h-72 relative rounded-xl overflow-hidden border-4 border-white shadow-xl bg-muted flex-shrink-0">
              <Image 
                src={getPhotoUrl(candidate)} 
                alt={candidate.nome_urna}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex-1 space-y-6 w-full">
              <div className="flex flex-wrap gap-x-12 gap-y-6">
                <div className="min-w-[240px] flex-1">
                  <p className="text-xs font-bold uppercase text-zinc-400 tracking-wider mb-1">Nome Completo</p>
                  <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                    {candidate.nome_completo}
                  </p>
                </div>
                <div className="min-w-[200px]">
                  <p className="text-xs font-bold uppercase text-zinc-400 tracking-wider mb-1">Nome de Urna</p>
                  <p className="text-2xl font-black text-primary uppercase leading-none">
                    {candidate.nome_urna}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-x-12 gap-y-6 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <div>
                  <p className="text-xs font-bold uppercase text-zinc-400 tracking-wider mb-1">TSE ID</p>
                  <p className="text-base font-semibold text-zinc-700 dark:text-zinc-300">
                    {candidate.sq_candidato}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-zinc-400 tracking-wider mb-1">Partido / Cargo</p>
                  <p className="text-base font-bold text-zinc-800 dark:text-zinc-200">
                    <span className="text-primary">{candidate.partido}</span> — {candidate.cargo}
                  </p>
                </div>
                <div>
                   <p className="text-xs font-bold uppercase text-zinc-400 mb-1">Localidade</p>
                   <p className="text-base font-medium">{candidate.municipio} - {candidate.uf}</p>
                </div>
              </div>
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
              <div className="border rounded-xl overflow-hidden shadow-sm">
                <Table>
                  <TableHeader className="bg-zinc-50 dark:bg-zinc-900">
                    <TableRow>
                      <TableHead className="font-bold w-[200px]">Tipo de Bem</TableHead>
                      <TableHead className="font-bold">Descrição</TableHead>
                      <TableHead className="text-right font-bold w-[140px]">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {candidate.assets.map((asset) => (
                      <TableRow key={asset.id} className="hover:bg-zinc-50/50">
                        <TableCell className="font-medium align-top">{asset.tipo_bem}</TableCell>
                        <TableCell className="whitespace-normal break-words py-3 leading-relaxed">
                          {asset.descricao}
                        </TableCell>
                        <TableCell className="text-right font-semibold align-top">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-100 dark:border-blue-800">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">Total de Votos</p>
                <p className="text-3xl font-black text-blue-800 dark:text-blue-300">
                  {candidate.total_votos?.toLocaleString() ?? 0}
                </p>
              </div>
              <div className="bg-pink-50 dark:bg-pink-900/20 p-5 rounded-xl border border-pink-100 dark:border-pink-800">
                <p className="text-[10px] font-black uppercase tracking-widest text-pink-600 dark:text-pink-400 mb-2">Total Gasto</p>
                <p className="text-3xl font-black text-pink-800 dark:text-pink-300">
                  {formatCurrency(candidate.total_despesas ?? 0)}
                </p>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-900/20 p-5 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 mb-2">Custo por Voto</p>
                <p className="text-3xl font-black text-zinc-800 dark:text-zinc-300">
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
          <div className="flex flex-wrap justify-end gap-3 pt-6 border-t mt-4">
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
