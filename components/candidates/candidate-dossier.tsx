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
import { User, Wallet, Share2, ExternalLink } from "lucide-react"

interface CandidateDossierProps {
  candidate: Candidate | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function CandidateDossier({
  candidate,
  isOpen,
  onOpenChange,
}: CandidateDossierProps) {
  if (!candidate) return null

  const totalAssets = candidate.assets.reduce((acc, asset) => acc + asset.valor, 0)

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

            {candidate.assets.length > 0 ? (
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

          {/* Social Media */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <Share2 className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Redes Sociais</h3>
            </div>
            {candidate.socials.length > 0 ? (
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
