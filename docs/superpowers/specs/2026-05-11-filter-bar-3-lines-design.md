# Design Doc: Barra de Filtros em 3 Linhas

Otimização da interface de busca de candidatos para organizar os filtros em grupos lógicos e melhorar a usabilidade.

## 1. Objetivos
- Organizar visualmente os campos de busca em 3 linhas horizontais.
- Facilitar o preenchimento de critérios de localização, identificação e financeiros.
- Manter a consistência visual com o "Executive Command" aesthetic.

## 2. Layout Proposto

### 2.1 Linha 1: Localização
- **Estado (UF)**: Dropdown (Select).
- **Município**: Dropdown (Select) - Col-span maior para acomodar nomes longos.

### 2.2 Linha 2: Identificação
- **Nome na Urna**: Input de texto.
- **Partido**: Input de texto.

### 2.3 Linha 3: Financeiro
- **Min. Bens Declarados**: Input numérico.
- **Max. Bens Declarados**: Input numérico.

## 3. Estrutura Técnica (Tailwind)
- Utilização de `flex flex-col gap-6` para separar as linhas.
- Cada linha será um `grid` independente para controle fino das proporções.
- Espaçamento interno (gap) entre campos mantido em 4 ou 6.

## 4. Testes e Validação
- Verificar se a funcionalidade de busca permanece intacta.
- Validar a responsividade em telas menores (stack vertical).
