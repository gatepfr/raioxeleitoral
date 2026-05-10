export interface Asset {
  id: string;
  tipo_bem: string;
  descricao: string;
  valor: number;
}

export interface Social {
  id: string;
  tipo_rede: string;
  url: string;
}

export interface Candidate {
  id: string;
  sq_candidato: string;
  nome_completo: string;
  nome_urna: string;
  cpf: string;
  email_tse: string | null;
  partido: string;
  cargo: string;
  uf: string;
  municipio: string;
  situacao_candidatura: string;
  assets: Asset[];
  socials: Social[];
  lead?: Lead | null;
}

export type LeadStatus = 'PROSPECT' | 'CONTATADO' | 'REUNIAO' | 'PROPOSTA' | 'FECHADO' | 'PERDIDO';

export type InteractionType = 'WHATSAPP' | 'CALL' | 'MEETING' | 'EMAIL' | 'OTHER';

export interface Interaction {
  id: string;
  lead_id: string;
  anotacao: string;
  tipo_contato: InteractionType;
  data_registro: string | Date;
}

export interface Lead {
  id: string;
  candidate_id: string;
  candidate: Candidate;
  status: LeadStatus;
  vendedor_responsavel: string | null;
  valor_contrato: number | null;
  data_proxima_acao: string | Date | null;
  interactions?: Interaction[];
  createdAt: string | Date;
  updatedAt: string | Date;
}
