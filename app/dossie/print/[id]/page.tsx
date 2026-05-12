import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { User, Wallet, Share2, Globe } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PrintButton } from "@/components/candidates/print-button";

async function getCandidateData(id: string) {
  const candidate = await db.candidate.findUnique({
    where: { id },
    include: {
      assets: true,
      socials: true,
    },
  });
  return candidate;
}

export default async function DossiePrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const candidate = await getCandidateData(id);

  if (!candidate) {
    notFound();
  }

  const totalAssets = candidate.assets.reduce((acc, asset) => acc + asset.valor, 0);
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="bg-white min-h-screen p-8 text-black print:p-0 print:bg-white">
      {/* Print button - hidden during actual print */}
      <div className="flex justify-end mb-8 print:hidden">
        <PrintButton />
      </div>

      {/* Dossier Content */}
      <div className="max-w-4xl mx-auto border-2 border-zinc-200 p-10 rounded-xl shadow-sm bg-white">
        {/* Header */}
        <div className="flex justify-between items-start border-b-4 border-primary pb-6 mb-8">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight text-zinc-900">
              Dossiê de Inteligência
            </h1>
            <p className="text-zinc-500 font-medium text-lg mt-1">
              Raio X Eleitoral - Munição Comercial
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-zinc-400 uppercase">Gerado em</div>
            <div className="text-zinc-700 font-semibold">
              {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </div>
          </div>
        </div>

        {/* Basic Info Grid */}
        <div className="grid grid-cols-2 gap-8 mb-10">
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2 border-b pb-2 text-zinc-800">
              <User className="h-5 w-5 text-primary" />
              Identificação
            </h2>
            <div className="grid grid-cols-1 gap-2">
              <div>
                <span className="text-xs font-bold text-zinc-400 uppercase block">Nome Completo</span>
                <span className="text-lg font-bold text-zinc-900">{candidate.nome_completo}</span>
              </div>
              <div>
                <span className="text-xs font-bold text-zinc-400 uppercase block">Nome de Urna</span>
                <span className="text-lg font-semibold text-zinc-700">{candidate.nome_urna}</span>
              </div>
              <div>
                <span className="text-xs font-bold text-zinc-400 uppercase block">CPF</span>
                <span className="text-lg font-semibold text-zinc-700">{candidate.cpf}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2 border-b pb-2 text-zinc-800">
              <Globe className="h-5 w-5 text-primary" />
              Dados Políticos
            </h2>
            <div className="grid grid-cols-1 gap-2">
              <div>
                <span className="text-xs font-bold text-zinc-400 uppercase block">Partido</span>
                <span className="text-lg font-bold text-zinc-900">{candidate.partido}</span>
              </div>
              <div>
                <span className="text-xs font-bold text-zinc-400 uppercase block">Cargo Pleiteado</span>
                <span className="text-lg font-semibold text-zinc-700">{candidate.cargo}</span>
              </div>
              <div>
                <span className="text-xs font-bold text-zinc-400 uppercase block">Localidade</span>
                <span className="text-lg font-semibold text-zinc-700">{candidate.municipio} - {candidate.uf}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Data */}
        <div className="space-y-4 mb-10 bg-zinc-50 p-6 rounded-xl border">
          <h2 className="text-xl font-bold flex items-center gap-2 border-b pb-2 text-zinc-800">
            <Wallet className="h-5 w-5 text-primary" />
            Patrimônio Declarado
          </h2>
          <div className="flex justify-between items-center py-4">
            <span className="text-zinc-600 font-medium">Patrimônio Total Estimado:</span>
            <span className="text-3xl font-black text-primary">
              {formatCurrency(totalAssets)}
            </span>
          </div>
          
          {candidate.assets.length > 0 ? (
            <table className="w-full text-sm">
              <thead className="bg-zinc-200">
                <tr>
                  <th className="text-left p-2">Tipo de Bem</th>
                  <th className="text-left p-2">Descrição</th>
                  <th className="text-right p-2">Valor</th>
                </tr>
              </thead>
              <tbody>
                {candidate.assets.map((asset, i) => (
                  <tr key={asset.id} className={i % 2 === 0 ? "bg-white" : "bg-zinc-50"}>
                    <td className="p-2 border-t">{asset.tipo_bem}</td>
                    <td className="p-2 border-t max-w-xs truncate">{asset.descricao}</td>
                    <td className="p-2 border-t text-right">{formatCurrency(asset.valor)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-zinc-500 italic text-center py-4">Nenhum bem declarado nesta eleição.</p>
          )}
        </div>

        {/* Digital Presence */}
        <div className="space-y-4 mb-10">
          <h2 className="text-xl font-bold flex items-center gap-2 border-b pb-2 text-zinc-800">
            <Share2 className="h-5 w-5 text-primary" />
            Presença Digital
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {candidate.socials.length > 0 ? (
              candidate.socials.map((social) => (
                <div key={social.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-xs">
                    {social.tipo_rede.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-zinc-400 uppercase">{social.tipo_rede}</div>
                    <div className="text-xs text-blue-600 font-medium truncate max-w-[200px]">{social.url}</div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-zinc-500 italic col-span-2 text-center py-4">Nenhuma rede social informada oficialmente.</p>
            )}
          </div>
        </div>

        {/* Footer for Print */}
        <div className="mt-12 pt-8 border-t text-center text-[10px] text-zinc-400 uppercase font-bold tracking-widest">
          Documento Confidencial - Propriedade de Raio X Eleitoral
        </div>
      </div>
    </div>
  );
}
