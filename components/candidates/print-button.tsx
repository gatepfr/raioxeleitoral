"use client";

import { FileText } from "lucide-react";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="bg-primary text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:opacity-90"
    >
      <FileText className="h-5 w-5" />
      Imprimir Dossiê / Salvar PDF
    </button>
  );
}
