"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface FilterBarProps {
  onSearch: (filters: { 
    uf: string; 
    municipio: string;
    partido: string;
    minPatrimonio: string;
    maxPatrimonio: string;
  }) => void;
}

export function FilterBar({ onSearch }: FilterBarProps) {
  const [uf, setUf] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [partido, setPartido] = useState("");
  const [minPatrimonio, setMinPatrimonio] = useState("");
  const [maxPatrimonio, setMaxPatrimonio] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ 
      uf: uf.trim(), 
      municipio: municipio.trim(),
      partido: partido.trim(),
      minPatrimonio,
      maxPatrimonio
    });
  };

  const handleUfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, "");
    setUf(value);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card p-6 rounded-xl border shadow-sm space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">UF</label>
          <Input
            placeholder="Ex: SP"
            value={uf}
            onChange={handleUfChange}
            maxLength={2}
          />
        </div>
        <div className="space-y-2 lg:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Município</label>
          <Input
            placeholder="Ex: São Paulo"
            value={municipio}
            onChange={(e) => setMunicipio(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Partido</label>
          <Input
            placeholder="Ex: PT, PL, MDB"
            value={partido}
            onChange={(e) => setPartido(e.target.value.toUpperCase())}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Min. Patrimônio</label>
          <Input
            type="number"
            placeholder="Min R$"
            value={minPatrimonio}
            onChange={(e) => setMinPatrimonio(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Max. Patrimônio</label>
          <Input
            type="number"
            placeholder="Max R$"
            value={maxPatrimonio}
            onChange={(e) => setMaxPatrimonio(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <Button type="submit" size="lg" className="w-full md:w-auto flex items-center gap-2">
          <Search className="h-4 w-4" />
          Filtrar Candidatos
        </Button>
      </div>
    </form>
  );
}
