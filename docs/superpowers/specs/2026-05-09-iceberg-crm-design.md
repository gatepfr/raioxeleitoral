# Design Doc: Iceberg CRM - Prospecção Política Inteligente
**Data:** 2026-05-09
**Status:** Aprovado
**Stack:** Docker, PostgreSQL, Python (ETL), Node.js/Next.js (API/Dashboard), Prisma, shadcn/ui.

## 1. Visão Geral
Sistema para agências de marketing político para prospecção de candidatos baseada em dados públicos do TSE. O sistema automatiza a coleta, cruzamento de dados patrimoniais e gestão de funil de vendas (CRM).

## 2. Arquitetura de Sistema (Infraestrutura)
Utilizaremos Docker Compose para orquestrar três serviços principais:
- **db**: PostgreSQL 16 (Porta 5432).
- **etl-engine**: Python 3.11 Slim. Responsável por baixar, processar e carregar dados do TSE.
- **app**: Next.js 14+ (App Router). Backend (API) e Frontend (Dashboard) integrados.

## 3. Modelo de Dados (Schema)
O banco de dados é dividido em dois núcleos:

### A. Núcleo TSE (Cold Leads)
- **Candidate**: Dados básicos do TSE (ID Único: `sq_candidato`).
- **CandidateAssets**: Bens declarados (vinculados ao candidato).
- **CandidateSocials**: Redes sociais (vinculadas ao candidato).
- **SyncLog**: Controle de versão e status dos downloads do TSE.

### B. Núcleo Comercial (Hot Leads)
- **Lead**: Candidato "capturado" para o funil de vendas.
- **Interaction**: Histórico de contatos (Notas, chamadas, reuniões).

## 4. Fluxo de ETL (Data Hunter)
O script Python `sync_tse.py` realizará:
1. **Download**: Requisição ao repositório do TSE para obter ZIPs de Candidatos, Bens e Redes.
2. **Extração**: Descompactação seletiva para diretório temporário.
3. **Processamento (Pandas)**: Limpeza de tipos, cálculo de soma patrimonial e normalização de nomes.
4. **Carga (Upsert)**: Inserção no Postgres usando `sq_candidato` como chave de conflito para evitar duplicidade.
5. **Cleanup**: Deleção automática dos arquivos CSV após a carga.

## 5. Interface (Frontend)
Utilização de **shadcn/ui** e **Tailwind CSS** para um layout moderno e responsivo:
- **Dashboard de Filtros**: Filtros por UF, Município, Partido e Faixa de Patrimônio.
- **DataTable**: Listagem com paginação e ordenação.
- **Dossiê Modal**: Visualização consolidada de todos os dados de um candidato.
- **Kanban Vendas**: Gestão visual do status de prospecção (Lead -> Contatado -> Proposta -> Fechado).

## 6. Estratégia de Sincronização
- **Trigger**: Botão no painel administrativo que dispara uma chamada de API para o container de ETL.
- **Progress**: Feedback visual na UI sobre o status da sincronização.

## 7. Próximos Passos
1. Implementar `docker-compose.yml` e `schema.prisma`.
2. Desenvolver o script de ETL Python.
3. Criar o boilerplate Next.js com shadcn/ui.
