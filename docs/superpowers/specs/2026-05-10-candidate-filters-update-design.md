# Design Doc: Filtros Avançados de Prospecção (TSE)

Sistema de filtros otimizado para a busca de candidatos, integrando dados geográficos oficiais do IBGE e busca por nome de urna.

## 1. Objetivos
- Facilitar a seleção de localidade (Estado/Município) através de dropdowns.
- Garantir a precisão dos dados geográficos utilizando a API do IBGE.
- Permitir a busca direta por candidatos através do Nome de Urna.
- Otimizar a performance através de cache de localidades no backend.

## 2. Arquitetura

### 2.1 API de Localidades (`/api/locations`)
Uma nova rota será criada para servir como proxy para a API de Localidades do IBGE.
- **GET `/api/locations/states`**: Retorna a lista de todos os estados brasileiros.
- **GET `/api/locations/cities?uf={UF}`**: Retorna a lista de municípios para a UF selecionada.
- **Cache**: Os resultados serão cacheados em memória (ou via constante estática) para reduzir a latência e chamadas externas.

### 2.2 API de Candidatos (`/api/candidates`)
A rota existente será atualizada para suportar um novo parâmetro:
- **`nomeUrna`**: Busca parcial (case-insensitive) no campo `nome_urna` do modelo `Candidate`.

## 3. Interface (Frontend)

### 3.1 Componente `FilterBar`
- **Estado (UF)**: Dropdown populado via `/api/locations/states`.
- **Município**: Dropdown desabilitado até que uma UF seja selecionada. Populado via `/api/locations/cities?uf={UF}`.
- **Nome de Urna**: Input de texto para busca por nome.
- **Comportamento**: Ao trocar a UF, o campo de Município é resetado e recarregado.

## 4. Plano de Dados
- Não há mudanças no schema do Prisma.
- A integração com o IBGE será puramente via API Runtime.

## 5. Testes e Validação
- Verificar se a troca de UF carrega corretamente os municípios.
- Validar se a busca por "Nome de Urna" retorna candidatos correspondentes.
- Garantir que a busca por município em estados diferentes funciona conforme esperado.
