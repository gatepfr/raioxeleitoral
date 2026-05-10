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

  const handleSearch = () => {
    onSearch({ uf, municipio });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-end bg-card p-4 rounded-lg border shadow-sm">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <label htmlFor="uf" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          UF
        </label>
        <Input
          type="text"
          id="uf"
          placeholder="Ex: SP"
          value={uf}
          onChange={(e) => setUf(e.target.value.toUpperCase())}
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
      <Button onClick={handleSearch} className="flex items-center gap-2">
        <Search className="h-4 w-4" />
        Filtrar
      </Button>
    </div>
  );
}
