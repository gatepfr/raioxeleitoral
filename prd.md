PRD: CRM Político de Prospecção Inteligente
1. Visão Geral
Sistema interno para agência de marketing político que utiliza dados públicos do TSE para identificar, analisar e converter candidatos em clientes. O diferencial competitivo é o Dossiê Automático (dados cadastrais, patrimoniais e digitais) para munição comercial.

2. Stack Tecnológica
Orquestração: Docker & Docker Compose.

Banco de Dados: PostgreSQL 16 (com extensões para busca textual).

Engine de Dados (ETL): Python 3.11+ (Pandas para processamento, SQLAlchemy para carga).

Backend (API): Node.js + TypeScript + Prisma ORM.

Frontend: Next.js (Dashboard Administrativo).

3. Arquitetura de Dados (Data Schema)
O banco de dados será dividido em dados Frios (Sincronizados do TSE) e dados Quentes (Gestão da Agência).

A. Núcleo TSE (Cold Leads)
Candidate: Dados biográficos básicos.

id (UUID), sq_candidato (ID Único TSE), nome_completo, nome_urna, cpf, email_tse, partido, cargo, uf, municipio, situacao_candidatura.

CandidateAssets (1:N): Patrimônio declarado.

id, candidate_id (FK), tipo_bem, descricao, valor.

CandidateSocials (1:N): Presença digital.

id, candidate_id (FK), tipo_rede (Instagram, FB, etc), url.

B. Núcleo Comercial (Hot Leads)
LeadControl: Gestão do funil de vendas.

id, candidate_id (FK), status (Prospect, Contatado, Reunião, Proposta, Fechado, Perdido), vendedor_responsavel, valor_contrato, data_proxima_acao.

InteractionLog: Histórico de conversas.

id, lead_id (FK), anotacao, tipo_contato (WhatsApp, Ligação, Reunião), data_registro.

4. Requisitos Funcionais
RF01: Módulo ETL "Data Hunter" (Python)
Coleta Multi-Fonte: O script deve baixar e processar simultaneamente os arquivos de Candidatos, Bens e Redes Sociais.

Cruzamento de Chaves: Utilizar o campo SQ_CANDIDATO para unificar as informações de diferentes CSVs em um único perfil no banco.

Carga Inteligente (Upsert): Se o candidato mudar de status no TSE, o sistema atualiza sem duplicar o registro.

Cálculo de Patrimônio: Somar automaticamente o valor total dos bens para exibir no dashboard.

RF02: Dashboard de Prospecção (Node.js API)
Filtros de "Ouro": Busca por UF, Município, Cargo e Faixa Patrimonial (ex: buscar apenas candidatos com patrimônio > R$ 500k).

Dossiê Completo: Visualização em uma única tela de todos os dados básicos + lista de bens + links diretos para redes sociais.

Conversão em Lead: Botão "Capturar para CRM" que cria o registro na tabela de Leads Quentes.

RF03: Gestão de Vendas (CRM)
Funil Kanban: Visualização dos candidatos que estão em negociação.

Timeline de Notas: Registro de cada interação feita com o candidato ou seus assessores.

5. Requisitos Não Funcionais (RNF)
Escalabilidade de Dados: O sistema deve suportar a carga de todos os candidatos do Brasil (~500k a 1M de registros em anos de eleição municipal) sem lentidão nas buscas.

Segurança: Acesso restrito via login/senha para membros da agência.

Logs de Auditoria: Saber qual vendedor visualizou qual candidato.

6. Plano de Implementação (Passo a Passo)
Passo 1: Infraestrutura (Docker)
Configurar o docker-compose.yml para subir o PostgreSQL e preparar os volumes para os arquivos CSV que o Python irá ler.

Passo 2: O Coração dos Dados (Python ETL)
Desenvolver o script sync_tse.py:

Baixar ZIPs do repositório oficial.

Processar consulta_cand.csv -> Criar Candidate.

Processar rede_social_cand.csv -> Criar CandidateSocials.

Processar bem_candidato.csv -> Criar CandidateAssets.

Passo 3: API & Regras de Negócio (Node.js)
Configurar o Prisma para refletir o schema acima e criar os endpoints de listagem e transição de status (Cold -> Hot).

7. Próximo Passo Sugerido
Para começarmos a codificar, você quer que eu gere:

O arquivo docker-compose.yml e o schema.prisma (Estrutura do sistema)?

O Script Python (ETL) inicial para ler um dos arquivos do TSE?

A estrutura de Pastas e Boilerplate do projeto Node.js?

(Como você usa o Gemini CLI, recomendo começarmos pelo item 1 para ter o banco pronto!)