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
    cargo: string;
    minPatrimonio: string;
    maxPatrimonio: string;
    minDespesa: string;
    maxDespesa: string;
  }) => void;
}

export function FilterBar({ onSearch }: FilterBarProps) {
  const [states, setStates] = useState<{sigla: string, nome: string}[]>([]);
  const [cities, setCities] = useState<{nome: string}[]>([]);
  const [uf, setUf] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [partido, setPartido] = useState("");
  const [nomeUrna, setNomeUrna] = useState("");
  const [cargo, setCargo] = useState("");
  const [minPatrimonio, setMinPatrimonio] = useState("");
  const [maxPatrimonio, setMaxPatrimonio] = useState("");
  const [minDespesa, setMinDespesa] = useState("");
  const [maxDespesa, setMaxDespesa] = useState("");

  const CARGOS = [
    "VEREADOR",
    "PREFEITO",
    "DEPUTADO ESTADUAL",
    "DEPUTADO FEDERAL",
    "SENADOR",
    "GOVERNADOR",
    "PRESIDENTE"
  ];

  useEffect(() => {
    fetch("/api/locations?type=states")
      .then(res => res.json())
      .then(data => setStates(data));
  }, []);

  useEffect(() => {
    if (uf) {
      fetch(`/api/locations?type=cities&uf=${uf}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setCities(data);
          } else {
            setCities([]);
          }
        });
    } else {
      setCities([]);
    }
  }, [uf]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ 
      uf, 
      municipio: municipio.trim(),
      partido: partido.trim(),
      nomeUrna: nomeUrna.trim(),
      cargo,
      minPatrimonio,
      maxPatrimonio,
      minDespesa,
      maxDespesa
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card p-6 rounded-xl border shadow-sm space-y-8">
      <div className="flex flex-col gap-6">
        {/* Linha 1: Localização */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Estado (UF)</label>
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={uf}
              onChange={(e) => {
                setUf(e.target.value);
                setMunicipio("");
              }}
            >
              <option value="">Selecione...</option>
              {states.map(s => (
                <option key={s.sigla} value={s.sigla}>{s.sigla} - {s.nome}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Município</label>
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={municipio}
              onChange={(e) => setMunicipio(e.target.value)}
              disabled={!uf}
            >
              <option value="">{uf ? "Selecione o município..." : "Selecione uma UF primeiro"}</option>
              {cities.map(c => (
                <option key={c.nome} value={c.nome}>{c.nome}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Linha 2: Identificação e Cargo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cargo</label>
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
            >
              <option value="">Todos os Cargos</option>
              {CARGOS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Linha 3: Financeiro (Bens e Gastos) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Min. Bens</label>
            <Input
              type="number"
              placeholder="R$ 0"
              value={minPatrimonio}
              onChange={(e) => setMinPatrimonio(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Max. Bens</label>
            <Input
              type="number"
              placeholder="R$ +"
              value={maxPatrimonio}
              onChange={(e) => setMaxPatrimonio(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Min. Gasto</label>
            <Input
              type="number"
              placeholder="R$ 0"
              value={minDespesa}
              onChange={(e) => setMinDespesa(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Max. Gasto</label>
            <Input
              type="number"
              placeholder="R$ +"
              value={maxDespesa}
              onChange={(e) => setMaxDespesa(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-border/50">
        <Button type="submit" size="lg" className="w-full md:w-auto flex items-center gap-2 px-8">
          <Search className="h-4 w-4" />
          Filtrar Candidatos
        </Button>
      </div>
    </form>
  );
}
