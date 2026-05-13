import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { User, Wallet, Share2, Globe, FileText } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PrintButton } from "@/components/candidates/print-button";
import Image from "next/image";
import { Candidate } from "@/types";

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
  const candidate = await getCandidateData(id) as unknown as Candidate;

  if (!candidate) {
    notFound();
  }

  const getPhotoUrl = (cand: Candidate) => {
    let electionId = "2045202024"; // Default 2024
    if (cand.ano_ultima_eleicao === 2022) electionId = "20220001";
    if (cand.ano_ultima_eleicao === 2020) electionId = "2030402020";
    if (cand.ano_ultima_eleicao === 2018) electionId = "20180001";
    
    // Using the correct TSE architecture format provided by the user
    // Format: .../img/{electionId}/{sq_candidato}/{ue_id}
    return `https://divulgacandcontas.tse.jus.br/divulga/rest/arquivo/img/${electionId}/${cand.sq_candidato}/${cand.ue_id}`;
  };

  const totalAssets = candidate.assets?.reduce((acc, asset) => acc + asset.valor, 0) ?? 0;
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="bg-white min-h-screen p-8 text-black print:p-0 print:bg-white font-sans">
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

        {/* Basic Info with Photo */}
        <div className="flex gap-8 mb-10 items-start">
          <div className="w-48 h-64 relative rounded-xl overflow-hidden border-4 border-zinc-100 shadow-lg flex-shrink-0">
            <img 
              src={getPhotoUrl(candidate)} 
              alt={candidate.nome_urna}
              className="object-cover w-full h-full"
            />
          </div>
          
          <div className="flex-1 space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2 border-b pb-2 text-zinc-800">
                <User className="h-5 w-5 text-primary" />
                Identificação
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-bold text-zinc-400 uppercase block">Nome Completo</span>
                  <span className="text-lg font-bold text-zinc-900">{candidate.nome_completo}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-zinc-400 uppercase block">Nome de Urna</span>
                  <span className="text-lg font-black text-primary uppercase">{candidate.nome_urna}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-zinc-400 uppercase block">ID TSE</span>
                  <span className="text-lg font-semibold text-zinc-700">{candidate.sq_candidato}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2 border-b pb-2 text-zinc-800">
                <Globe className="h-5 w-5 text-primary" />
                Dados Políticos
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-bold text-zinc-400 uppercase block">Partido</span>
                  <span className="text-lg font-bold text-zinc-900">{candidate.partido}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-zinc-400 uppercase block">Cargo</span>
                  <span className="text-lg font-semibold text-zinc-700">{candidate.cargo}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs font-bold text-zinc-400 uppercase block">Localidade</span>
                  <span className="text-lg font-semibold text-zinc-700">{candidate.municipio} - {candidate.uf}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        {candidate.socials && candidate.socials.length > 0 && (
          <div className="space-y-4 mb-10 bg-zinc-50 p-6 rounded-xl border">
            <h2 className="text-xl font-bold flex items-center gap-2 border-b pb-2 text-zinc-800">
              <Share2 className="h-5 w-5 text-primary" />
              Canais Digitais Oficiais
            </h2>
            <div className="flex flex-wrap gap-4 pt-2">
              {candidate.socials.map((social) => (
                <div key={social.id} className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border shadow-sm">
                  <span className="text-sm font-bold text-zinc-800">{social.tipo_rede}:</span>
                  <span className="text-sm text-primary font-medium">{social.url}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Electoral Performance */}
        <div className="space-y-4 mb-10">
          <h2 className="text-xl font-bold flex items-center gap-2 border-b pb-2 text-zinc-800">
            <FileText className="h-5 w-5 text-primary" />
            Desempenho Eleitoral ({candidate.ano_ultima_eleicao})
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-xs font-bold uppercase text-blue-600 mb-1">Votos</p>
              <p className="text-2xl font-bold text-blue-900">{candidate.total_votos?.toLocaleString() ?? 0}</p>
            </div>
            <div className="bg-pink-50 p-4 rounded-lg border border-pink-100">
              <p className="text-xs font-bold uppercase text-pink-600 mb-1">Investimento</p>
              <p className="text-2xl font-bold text-pink-900">{formatCurrency(candidate.total_despesas ?? 0)}</p>
            </div>
            <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
              <p className="text-xs font-bold uppercase text-zinc-500 mb-1">Custo/Voto</p>
              <p className="text-2xl font-bold text-zinc-900">
                {candidate.total_votos > 0 
                  ? formatCurrency((candidate.total_despesas ?? 0) / candidate.total_votos)
                  : "R$ 0,00"}
              </p>
            </div>
          </div>
        </div>

        {/* Financial Data */}
        <div className="space-y-4 mb-10 bg-zinc-50 p-6 rounded-xl border">
          <h2 className="text-xl font-bold flex items-center gap-2 border-b pb-2 text-zinc-800">
            <Wallet className="h-5 w-5 text-primary" />
            Patrimônio Detalhado
          </h2>
          <div className="flex justify-between items-center py-4">
            <span className="text-zinc-600 font-medium">Total Declarado:</span>
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

        {/* Footer for Print */}
        <div className="mt-12 pt-8 border-t text-center text-[10px] text-zinc-400 uppercase font-bold tracking-widest">
          Documento Confidencial - Propriedade de Raio X Eleitoral
        </div>
      </div>
    </div>
  );
}
