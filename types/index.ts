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
}
