"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface FilterBarProps {
  onSearch: (filters: { 
    uf: string; 
    municipio: string;
    partido: string;
    nomeUrna: string;
    minPatrimonio: string;
    maxPatrimonio: string;
  }) => void;
}

export function FilterBar({ onSearch }: FilterBarProps) {
  const [states, setStates] = useState<{sigla: string, nome: string}[]>([]);
  const [uf, setUf] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [partido, setPartido] = useState("");
  const [nomeUrna, setNomeUrna] = useState("");
  const [minPatrimonio, setMinPatrimonio] = useState("");
  const [maxPatrimonio, setMaxPatrimonio] = useState("");

  useEffect(() => {
    fetch("/api/locations?type=states")
      .then(res => res.json())
      .then(data => setStates(data));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ 
      uf, 
      municipio: municipio.trim(),
      partido: partido.trim(),
      nomeUrna: nomeUrna.trim(),
      minPatrimonio,
      maxPatrimonio
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card p-6 rounded-xl border shadow-sm space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">UF</label>
          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={uf}
            onChange={(e) => {
              setUf(e.target.value);
              setMunicipio(""); // Reset city when UF changes
            }}
          >
            <option value="">Selecione...</option>
            {states.map(s => (
              <option key={s.sigla} value={s.sigla}>{s.sigla} - {s.nome}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Município</label>
          <Input
            placeholder="Ex: São Paulo"
            value={municipio}
            onChange={(e) => setMunicipio(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nome na Urna</label>
          <Input
            placeholder="Ex: Tiririca"
            value={nomeUrna}
            onChange={(e) => setNomeUrna(e.target.value)}
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
