"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface FilterBarProps {
  onSearch: (filters: { uf: string; municipio: string }) => void;
}

export function FilterBar({ onSearch }: FilterBarProps) {
  const [uf, setUf] = useState("");
  const [municipio, setMunicipio] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ 
      uf: uf.trim(), 
      municipio: municipio.trim() 
    });
  };

  const handleUfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, "");
    setUf(value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end bg-card p-4 rounded-lg border shadow-sm">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <label htmlFor="uf" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          UF
        </label>
        <Input
          type="text"
          id="uf"
          placeholder="Ex: SP"
          value={uf}
          onChange={handleUfChange}
          maxLength={2}
          className="w-20"
        />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5 flex-1">
        <label htmlFor="municipio" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Município
        </label>
        <Input
          type="text"
          id="municipio"
          placeholder="Ex: São Paulo"
          value={municipio}
          onChange={(e) => setMunicipio(e.target.value)}
        />
      </div>
      <Button type="submit" className="flex items-center gap-2">
        <Search className="h-4 w-4" />
        Filtrar
      </Button>
    </form>
  );
}
