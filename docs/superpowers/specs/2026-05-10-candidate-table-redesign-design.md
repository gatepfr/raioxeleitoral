# Design Doc: Redesign da Tabela de Candidatos

Otimização da visualização de candidatos para facilitar a identificação de potencial financeiro e melhorar a experiência de leitura em dispositivos variados.

## 1. Objetivos
- Reduzir o número de colunas horizontais para evitar poluição visual.
- Agrupar informações relacionadas (ex: Cargo e Localidade).
- Dar destaque visual aos bens declarados, movendo-os para uma segunda linha informativa dentro da célula principal.
- Utilizar elementos visuais (tags) para categorizar e destacar valores.

## 2. Nova Estrutura da Tabela

### 2.1 Colunas Remodeladas
1. **Candidato e Finanças**:
   - Linha 1: Nome de Urna (Bold).
   - Linha 2: Partido (Muted).
   - Linha 3 (Nova): Tag "Bens Declarados" com o valor formatado em destaque.
2. **Atuação**:
   - Linha 1: Cargo.
   - Linha 2: Município - UF (Muted).
3. **Ações**:
   - Botões de Dossiê e Captura/CRM alinhados à direita.

## 3. Elementos Visuais (Tailwind)
- **Tag de Bens**: `bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400` para valores positivos.
- **Hierarquia**: Uso de `text-sm` para dados secundários e `font-semibold` para nomes e valores.

## 4. Testes e Validação
- Verificar se a ordenação por patrimônio continua funcionando corretamente no cabeçalho consolidado.
- Validar se o layout se mantém responsivo e legível em diferentes tamanhos de tela.
