# Design Doc: Correção de Sincronização e Exibição de Candidatos

Ajustes estruturais no banco de dados e na interface para garantir a integridade dos dados históricos do TSE e melhorar a clareza das informações financeiras.

## 1. Objetivos
- Corrigir o vínculo entre eleições para candidatos com CPF mascarado no TSE 2024.
- Garantir que o valor total de bens seja exibido corretamente no dossiê, mesmo sem a lista detalhada.
- Simplificar o dossiê removendo informações redundantes.
- Adicionar transparência sobre a temporalidade dos dados na tabela principal.

## 2. Mudanças Estruturais

### 2.1 Banco de Dados (Prisma)
- Adicionar campo `titulo_eleitor` ao modelo `Candidate`.
- Tornar `titulo_eleitor` a chave única (Unique) em vez do `cpf`, pois o CPF está mascarado em arquivos de 2024.
- Manter o `cpf` como opcional ou não único para permitir registros mascarados.

### 2.2 ETL (`etl/sync_tse.py`)
- Atualizar o mapeamento para extrair `NR_TITULO_ELEITORAL_CANDIDATO`.
- Ajustar a lógica de UPSERT para usar o Título de Eleitor como critério de conflito.

## 3. Interface (Frontend)

### 3.1 Dossiê (`CandidateDossier`)
- Renomear todos os rótulos de "Patrimônio" para "Bens Declarados".
- Utilizar `candidate.patrimonio_total` diretamente no display, em vez de reduzir o array `assets`.
- Remover a tabela `Table` de detalhamento de bens.
- Exibir o ano da eleição (`ano_ultima_eleicao`) no cabeçalho do dossiê.

### 3.2 Tabela (`CandidateTable`)
- Adicionar o ano da última eleição ao lado do partido ou cargo para contextualizar os dados.

## 4. Testes e Validação
- Rodar o script de sincronização para verificar se o Rodolfo Mota (exemplo) é atualizado de 2022 para 2024.
- Abrir o dossiê de um candidato com bens e confirmar que o valor não aparece mais como zero.
