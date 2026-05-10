# Design Doc: Iceberg CRM - Meus Candidatos (Lista Quente)
**Data:** 2026-05-09
**Status:** Aprovado
**Foco:** Cadastro manual de leads e cópia de dados do TSE para repositório privado.

## 1. Visão Geral
Criação de uma camada de dados proprietária da agência ("Meus Candidatos"). Esta lista é separada dos dados públicos do TSE e permite o gerenciamento de contatos quentes, indicação e cadastros manuais, mantendo integração total com o Kanban de vendas.

## 2. Modelo de Dados (Prisma)
Novo modelo `MyCandidate`:
- `id`: UUID (Primary Key)
- `nome`: String
- `cpf`: String (Opcional)
- `email`: String (Opcional)
- `telefone`: String (Crítico)
- `uf`: String
- `municipio`: String
- `cargo`: String
- `origem_indicacao`: String (Opcional)
- `rede_social`: String (Opcional)
- `tipo_origem`: Enum (TSE, MANUAL)
- `tse_id`: String (FK para Candidate.sq_candidato - Opcional)
- `createdAt`: DateTime
- `updatedAt`: DateTime

A tabela `Lead` será atualizada para referenciar `MyCandidate` em vez de `Candidate` diretamente.

## 3. Funcionalidades Principais

### A. Cópia do TSE (Captura Inteligente)
- Na listagem geral (TSE), o botão "Capturar" realizará:
  1. Leitura dos dados do `Candidate` (TSE).
  2. Criação de um novo `MyCandidate` copiando Nome, UF, Município, Cargo e CPF.
  3. Criação automática de um `Lead` (status PROSPECT) vinculado a este novo `MyCandidate`.

### B. Cadastro Manual (Novo Lead Quente)
- Interface com formulário contendo: Nome, Telefone, Email, UF, Município, Cargo, CPF, Origem da Indicação e Rede Social.
- Ao salvar, cria o `MyCandidate` e o `Lead` correspondente.

### C. Dashboard "Meus Candidatos"
- Página dedicada (`/my-candidates`) com DataTable.
- Foco em informações de contato (Telefone/Email).
- Filtros por UF e Município.

## 4. Integração com Kanban
- O Kanban passará a listar registros da tabela `Lead` que agora apontam para `MyCandidate`.
- Os cards mostrarão os dados consolidados da sua lista quente.

## 5. Próximos Passos
1. Atualizar o `schema.prisma` e rodar migrações.
2. Implementar API para `MyCandidate` (CRUD).
3. Criar formulário de cadastro manual com shadcn/ui.
4. Ajustar fluxo de captura na página inicial.
5. Criar a página de listagem `/my-candidates`.
