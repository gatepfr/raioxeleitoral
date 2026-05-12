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
      <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-y-auto overflow-x-hidden p-0 gap-0 border-none">
        {/* Header Black Section */}
        <div className="bg-zinc-950 text-white p-6 sm:p-10">
          <div className="flex justify-between items-start mb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-widest">
                <User className="h-4 w-4" />
                Dossiê de Inteligência
              </div>
              <h2 className="text-3xl sm:text-4xl font-black uppercase leading-none">
                {candidate.nome_urna}
              </h2>
              <p className="text-zinc-400 font-medium italic">
                Eleição de {candidate.ano_ultima_eleicao} — {candidate.cargo}
              </p>
            </div>
            <div className="text-right hidden sm:block">
               <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary text-primary-foreground uppercase tracking-tighter">
                 {candidate.partido}
               </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 sm:gap-12 items-center md:items-stretch">
            <div className="w-full max-w-[240px] aspect-[3/4] relative rounded-2xl overflow-hidden border-4 border-zinc-800 shadow-2xl bg-zinc-900 flex-shrink-0">
              <Image 
                src={getPhotoUrl(candidate)} 
                alt={candidate.nome_urna}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 self-center w-full">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Nome Completo</p>
                <p className="text-lg font-bold leading-tight break-words">{candidate.nome_completo}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Localidade</p>
                <p className="text-lg font-bold">{candidate.municipio} - {candidate.uf}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">ID TSE</p>
                <p className="text-lg font-mono text-zinc-300 font-bold">{candidate.sq_candidato}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Partido / Sigla</p>
                <p className="text-lg font-bold text-primary">{candidate.partido}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content White Section */}
        <div className="p-6 sm:p-10 space-y-12 bg-background">
          
          {/* Social Media - High Priority now */}
          {candidate.socials && candidate.socials.length > 0 && (
            <div className="space-y-4 bg-zinc-50 dark:bg-zinc-900/20 p-6 rounded-2xl border">
              <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold tracking-tight">Canais Digitais Oficiais</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {candidate.socials.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-zinc-950 border shadow-sm hover:border-primary hover:text-primary hover:shadow-md transition-all text-sm font-bold"
                  >
                    <ExternalLink className="h-3 w-3" />
                    {social.tipo_rede}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Assets Summary */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-bold tracking-tight">Patrimônio Declarado</h3>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-muted-foreground uppercase">Total</p>
                <p className="text-2xl font-black text-primary leading-none">
                  {formatCurrency(totalAssets)}
                </p>
              </div>
            </div>

            {candidate.assets && candidate.assets.length > 0 ? (
              <div className="border rounded-2xl overflow-hidden shadow-sm">
                <Table>
                  <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50">
                    <TableRow>
                      <TableHead className="font-black uppercase text-[10px] tracking-widest w-[30%]">Tipo</TableHead>
                      <TableHead className="font-black uppercase text-[10px] tracking-widest">Descrição</TableHead>
                      <TableHead className="text-right font-black uppercase text-[10px] tracking-widest w-[120px]">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {candidate.assets.map((asset) => (
                      <TableRow key={asset.id} className="hover:bg-zinc-50/50">
                        <TableCell className="font-bold text-xs align-top break-words">{asset.tipo_bem}</TableCell>
                        <TableCell className="text-xs whitespace-normal break-words py-4 leading-relaxed text-muted-foreground">
                          {asset.descricao}
                        </TableCell>
                        <TableCell className="text-right font-bold text-xs align-top whitespace-nowrap">
                          {formatCurrency(asset.valor)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10 bg-muted/20 rounded-2xl border-2 border-dashed">
                <p className="text-sm text-muted-foreground font-medium">Nenhum bem declarado nesta eleição.</p>
              </div>
            )}
          </div>

          {/* Electoral Performance */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b pb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-bold tracking-tight">Performance ({candidate.ano_ultima_eleicao})</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">Total de Votos</p>
                <p className="text-4xl font-black text-blue-900 dark:text-blue-200">
                  {candidate.total_votos?.toLocaleString() ?? 0}
                </p>
              </div>
              <div className="bg-pink-50/50 dark:bg-pink-900/10 p-6 rounded-2xl border border-pink-100 dark:border-pink-900/30">
                <p className="text-[10px] font-black uppercase tracking-widest text-pink-600 dark:text-pink-400 mb-2">Total Gasto</p>
                <p className="text-4xl font-black text-pink-900 dark:text-pink-200">
                  {formatCurrency(candidate.total_despesas ?? 0)}
                </p>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-900/30 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 mb-2">Custo por Voto</p>
                <p className="text-4xl font-black text-zinc-900 dark:text-zinc-100">
                  {candidate.total_votos > 0 
                    ? formatCurrency((candidate.total_despesas ?? 0) / candidate.total_votos)
                    : "R$ 0,00"}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap justify-end gap-4 pt-8 border-t">
            <Button variant="outline" size="lg" className="px-8 rounded-xl font-bold" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
            <Button variant="outline" size="lg" className="px-8 rounded-xl font-bold" asChild>
              <a href={`/dossie/print/${candidate.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Gerar PDF
              </a>
            </Button>
            {candidate.lead ? (
              <Button variant="secondary" size="lg" className="px-8 rounded-xl font-bold text-white bg-zinc-900 hover:bg-zinc-800" asChild>
                <Link href="/crm">Ver no CRM</Link>
              </Button>
            ) : (
              <Button size="lg" className="px-8 rounded-xl font-bold shadow-lg hover:shadow-primary/20 transition-all" onClick={() => onCaptureLead(candidate.id)}>
                Capturar Lead
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
