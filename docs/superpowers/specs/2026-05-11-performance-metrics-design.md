# Design Doc: Métricas de Desempenho e Gastos Eleitorais

Integração de dados de resultados de votação e prestação de contas de campanha para fornecer uma visão 360º do potencial dos candidatos.

## 1. Objetivos
- Exibir o total de votos recebidos na última eleição.
- Exibir o valor total gasto (despesas contratadas) na campanha.
- Calcular e exibir a métrica de eficiência "Custo por Voto".
- Automatizar a agregação de dados do TSE que são fornecidos em níveis granulares (zona/município).

## 2. Estrutura de Dados (Prisma)

### 2.1 Modelo `Candidate`
Adição de novos campos:
- `total_votos`: `Int` (Soma dos votos nominais).
- `total_despesas`: `Float` (Soma das despesas contratadas).

## 3. Estratégia de ETL (`etl/sync_tse.py`)

### 3.1 Agregação de Votos
- Fonte: `votacao_candidato_munzona_YYYY.zip`
- Lógica: Agrupar por `SQ_CANDIDATO` e somar `QT_VOTOS_NOMINAIS`.
- Vínculo: Usar `sq_candidato` para mapear de volta ao registro principal.

### 3.2 Agregação de Despesas
- Fonte: `prestacao_contas_eleitorais_YYYY.zip` (Tabela de Despesas Contratadas).
- Lógica: Somar `VR_DESPESA_CONTRATADA` por candidato.
- Vínculo: Usar Título de Eleitor ou CPF (conforme disponível no arquivo de contas).

## 4. Interface (Frontend)

### 4.1 Tabela de Candidatos
- Adição de badges compactos para Votos e Gastos.
- Formatação simplificada (ex: 120k em vez de 120.000,00).

### 4.2 Dossiê do Candidato
- Nova seção "Desempenho Eleitoral".
- Exibição de cards destacados para Votos, Investimento e Custo por Voto (`total_despesas / total_votos`).

## 5. Testes e Validação
- Comparar totais agregados com o portal oficial de resultados do TSE.
- Verificar se a divisão por zero é tratada caso o candidato tenha 0 votos.
