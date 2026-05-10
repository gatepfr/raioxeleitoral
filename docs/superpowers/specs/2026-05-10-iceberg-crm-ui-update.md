# Design Doc: Iceberg CRM - Executive Command UI Update
**Data:** 2026-05-10
**Status:** Aguardando Aprovação
**Aesthetic Direction:** Executive Command (Sério, Institucional, Profissional)

## 1. Visão Geral
O design do Iceberg CRM será atualizado para refletir uma identidade visual mais robusta e institucional, adequada para o manegamento de dados de inteligência política. O design focará em estrutura, contraste e clareza de dados, integrando a identidade da logomarca "Iceberg" (Tons de azul gelo e ciano vibrante).

## 2. Tipografia
- **Família de Fontes Principal:** `Inter` (Sans-Serif).
- **Justificativa:** Escolhida pela sua precisão cirúrgica, excelente legibilidade em dashboards densos de dados e visual limpo e institucional. Substituirá a fonte `Geist`.

## 3. Paleta de Cores (Theme)
- **Sidebar (Menu Lateral):** Fundo Azul Marinho Profundo / Dark Slate (quase preto, ex: `bg-slate-950`). Isso criará um contraste forte para destacar a logomarca azul-clara.
- **Logo:** `logo.png` será integrada no topo da sidebar e configurada como o favicon oficial do sistema (`app/favicon.ico`).
- **Acentos / Primary Color:** Tons de Azul Gelo / Ciano (inspirados na logomarca) para botões de ação principal, estados "active" no menu e destaques gráficos.
- **Background Principal (Main Content):** Cinza muito claro (`bg-zinc-50` ou `bg-slate-50`) para manter o conforto visual nas tabelas e cartões de dados.
- **Tabelas & Cards:** Fundo branco puro (`bg-white`), estilo minimalista/institucional com bordas finas (`border-slate-200`) e estilo "zebra" sutil nas linhas das tabelas.

## 4. Componentes Chave
- **Sidebar (Navegação):** Menu lateral fixo, escuro. Ícones sóbrios. Identidade da marca forte no topo.
- **Tabelas (DataTables):** Otimizadas para leitura densa. Cabeçalhos em negrito (`font-semibold`), dados alinhados e espaçamento consistente.
- **Filtros e Controles:** Apresentação clara, com inputs e selects bem delineados para facilitar o trabalho do usuário.

## 5. Próximos Passos de Implementação (Plano)
1. **Ativos Visuais:**
   - Otimizar `logo.png` para uso como logo na Sidebar.
   - Converter e definir `logo.png` como `app/favicon.ico`.
2. **Tipografia (Next.js):**
   - Atualizar `app/layout.tsx` para importar e usar a fonte `Inter` (do `next/font/google`).
3. **Tematização (CSS & Tailwind):**
   - Atualizar `app/globals.css` definindo os novos tokens de cor (`--primary`, `--sidebar`, etc.) refletindo o tema "Executive Command" e os tons de gelo.
4. **Refatoração de Layout:**
   - Criar um componente de Layout Global (ex: `SidebarLayout`) que inclua a nova barra lateral escura com a logomarca no topo e área de conteúdo principal.
   - Adaptar as páginas existentes (`app/page.tsx`, `app/my-candidates/page.tsx`, `app/crm/page.tsx`, `app/dashboard/page.tsx`) para usar este novo layout.
5. **Ajuste de Tabelas:**
   - Refinar os estilos dos componentes de tabela (`components/ui/table.tsx`, `components/candidates/candidate-table.tsx`) para adequar ao estilo "zebra sutil" e institucional.