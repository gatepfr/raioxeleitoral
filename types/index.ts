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

export interface VoteByCity {
  id: string;
  municipio: string;
  votos: number;
}

export interface Candidate {
  id: string;
  sq_candidato: string;
  nome_completo: string;
  nome_urna: string;
  cpf: string | null;
  ue_id: string | null;
  email_tse: string | null;
  partido: string;
  cargo: string;
  uf: string;
  municipio: string;
  situacao_candidatura: string;
  situacao_totalizacao: string | null;
  ano_ultima_eleicao: number;
  patrimonio_total: number;
  total_votos: number;
  total_despesas: number;
  assets: Asset[];
  socials: Social[];
  votesByCity?: VoteByCity[];
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
  my_candidate_id: string;
  my_candidate?: MyCandidate;
  status: LeadStatus;
  vendedor_responsavel: string | null;
  valor_contrato: number | null;
  data_proxima_acao: string | Date | null;
  interactions?: Interaction[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface MyCandidate {
  id: string;
  nome: string;
  partido: string | null;
  cpf: string | null;
  email: string | null;
  telefone: string;
  uf: string;
  municipio: string;
  cargo: string;
  origem_indicacao: string | null;
  rede_social: string | null;
  tipo_origem: string;
  tse_id: string | null;
  lead?: Lead | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}
