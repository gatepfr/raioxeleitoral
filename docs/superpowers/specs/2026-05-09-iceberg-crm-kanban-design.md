# Design Doc: Iceberg CRM - Módulo Kanban & Gestão de Leads
**Data:** 2026-05-09
**Status:** Aprovado
**Foco:** Conversão de Candidatos em Leads e Gestão Visual (Kanban).

## 1. Visão Geral
Este módulo transforma os dados "frios" do TSE em oportunidades de negócio. O usuário poderá capturar candidatos para o CRM e gerenciar o progresso da negociação através de um quadro Kanban interativo.

## 2. Fluxo de Conversão
- **Local:** Tabela de Candidatos (Página Inicial).
- **Ação:** Botão "Capturar para CRM".
- **Lógica:** Criação de um registro na tabela `Lead` vinculado ao `Candidate`, com status inicial `PROSPECT`.

## 3. Quadro Kanban (Quadro de Vendas)
- **Tecnologia:** `@dnd-kit/core` para Drag-and-Drop.
- **Colunas (Status):**
  1. Prospect
  2. Contatado
  3. Reunião Agendada
  4. Proposta Enviada
  5. Fechado
  6. Perdido
- **Cards:** Exibição de Nome, Partido, Cargo e Patrimônio Estimado.

## 4. Gestão de Interações (Side Drawer)
- Ao clicar em um card no Kanban, abre-se um componente `Sheet` (lateral) do shadcn/ui.
- **Conteúdo:** 
  - Detalhes do Lead.
  - Formulário para registrar nova interação (Tipo: WhatsApp, Ligação, Reunião + Nota).
  - Timeline cronológica de interações passadas.

## 5. API Endpoints
- `POST /api/leads`: Converte candidato em lead.
- `GET /api/leads`: Lista leads agrupados por status.
- `PATCH /api/leads/[id]`: Atualiza status (para o drag-and-drop).
- `POST /api/interactions`: Registra histórico.

## 6. Próximos Passos
1. Implementar endpoints de API para Leads.
2. Instalar e configurar `@dnd-kit`.
3. Criar componentes de Coluna e Card do Kanban.
4. Montar a página `/crm` com o quadro completo.
