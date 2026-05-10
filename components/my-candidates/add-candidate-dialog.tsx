"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Loader2 } from "lucide-react";

interface AddCandidateDialogProps {
  onSuccess: () => void;
}

export function AddCandidateDialog({ onSuccess }: AddCandidateDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    uf: "",
    municipio: "",
    cargo: "",
    cpf: "",
    origem_indicacao: "",
    rede_social: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/my-candidates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add candidate");
      }

      setOpen(false);
      setFormData({
        nome: "",
        telefone: "",
        email: "",
        uf: "",
        municipio: "",
        cargo: "",
        cpf: "",
        origem_indicacao: "",
        rede_social: "",
      });
      onSuccess();
    } catch (error) {
      console.error("Error adding candidate:", error);
      alert(error instanceof Error ? error.message : "Erro ao adicionar candidato");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Novo Candidato
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Candidato</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <label htmlFor="nome" className="text-sm font-medium">
                Nome *
              </label>
              <Input
                id="nome"
                placeholder="Nome completo"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="telefone" className="text-sm font-medium">
                Telefone *
              </label>
              <Input
                id="telefone"
                placeholder="(00) 00000-0000"
                value={formData.telefone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="uf" className="text-sm font-medium">
                UF *
              </label>
              <Input
                id="uf"
                placeholder="Ex: SP"
                value={formData.uf}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, "");
                  setFormData(prev => ({ ...prev, uf: value }));
                }}
                maxLength={2}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="municipio" className="text-sm font-medium">
                Município *
              </label>
              <Input
                id="municipio"
                placeholder="Ex: São Paulo"
                value={formData.municipio}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="cargo" className="text-sm font-medium">
                Cargo *
              </label>
              <Input
                id="cargo"
                placeholder="Ex: Vereador"
                value={formData.cargo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="cpf" className="text-sm font-medium">
                CPF
              </label>
              <Input
                id="cpf"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="origem_indicacao" className="text-sm font-medium">
                Origem da Indicação
              </label>
              <Input
                id="origem_indicacao"
                placeholder="Ex: Amigo, Evento"
                value={formData.origem_indicacao}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="rede_social" className="text-sm font-medium">
                Rede Social
              </label>
              <Input
                id="rede_social"
                placeholder="Ex: @usuario"
                value={formData.rede_social}
                onChange={handleChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Candidato"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
