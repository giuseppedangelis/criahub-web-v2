# Plano de Execução - Importação Condomínio + Premiações (Web + Mobile)

## Decisões Confirmadas

- Referência de vínculo das planilhas: **RowId** (`rowid` / `_rowid`).
- Quando o RowId não existir no banco: **ignorar com warning** (não criar pendência).
- Todas as mudanças devem refletir no mobile: `D:\Dev\criahub-mobile`.

## Escopo

1. Importação de **Animais em Condomínio**.
2. Importação de **Premiações** (associado e condomínio).
3. Aba dedicada de premiações na ficha do animal (web com dados reais).
4. Paridade funcional no mobile.

## Fontes de Dados (Planilhas)

### 1) Animais em condomínio

Arquivo: `planilhas/ABCCMM_Dados___Animais em condominio__02_07_2025 14_24_05.xls`

- Chave: `_rowid`
- Campos principais:
  - `_nomeAnimal`, `_sexo`, `_datanascto`, `_registro`, `_pelagem`, `_chip`, `_Criador`, `_proprietario`
  - Campos genealógicos (pai/mãe/avós/bisavós)

### 2) Premiação de associado

Arquivo: `planilhas/ABCCMM_Dados___Premiacao de associado__02_07_2025 14_24_35.xls`

- Chave: `rowid`
- Campos principais:
  - `nome`, `NomeExposicao`, `CidadeEstado`, `Periodo`, `Premiacao`, `CodigoEvento`

### 3) Premiações de animais em condomínio

Arquivo: `planilhas/ABCCMM_Dados___Premiacoes de animais em condominio__02_07_2025 14_24_29.xls`

- Chave: `_rowid`
- Campos principais:
  - `_nome`, `_evento`, `_cidadeUF`, `_periodo`, `_premiacao`, `_julgados`

## Estratégia Técnica

### A) Banco de dados

- Evoluir tabela `awards` para suportar importação idempotente:
  - `source` (`associado` | `condominio`)
  - `source_rowid`
  - `source_event_code`
  - `source_hash`
- Criar índice único para evitar duplicatas em reimportação.

### B) Importação de animais de condomínio

- Novo método no `animalsService` para importar planilha de condomínio.
- Matching por prioridade:
  1. `abccmm_rowid`
  2. `registro`
  3. `nome + data_nascimento + sexo` (apenas fallback seguro)
- Atualizar/inserir dados oficiais do animal.
- Refletir ambiente condomínio pelo modelo de cotas já criado (`animal_ownership_shares`).

### C) Importação de premiações

- Novo importador único com suporte a dois layouts (associado e condomínio).
- Resolver `animal_id` por `animals.abccmm_rowid`.
- Se não achar RowId no banco: ignorar linha e adicionar warning.
- Converter `Periodo` (`m/yyyy`) para data de evento normalizada (ex.: primeiro dia do mês).
- Upsert idempotente por hash/chave técnica.

### D) Web - UI e ficha do animal

- Plantel (`BreederPlantelContent`): ações de import separadas:
  - Importar Animais Condomínio
  - Importar Premiações Associado
  - Importar Premiações Condomínio
- Ficha do animal (`BreederAnimalDetails`):
  - Remover premiações mockadas
  - Carregar da tabela `awards`
  - Manter filtros/ordenação por ano e colocação
  - Exibir contagem real

### E) Mobile (alinhamento obrigatório)

- Ajustar serviços para refletir novos campos de premiações, se necessário.
- Garantir leitura consistente da tabela `awards`.
- Alinhar apresentação de premiações com web (ordenação/filtros básicos).

## Checklist de Implementação

### Fase 1 - Estrutura

- [x] Migration de `awards` com campos de origem/idempotência.
- [x] Índice único para deduplicação de premiações.

### Fase 2 - Importadores

- [x] Importador de animais em condomínio por `_rowid`.
- [x] Importador de premiação de associado por `rowid`.
- [x] Importador de premiações de condomínio por `_rowid`.
- [x] Warnings para RowId não encontrado (sem bloquear import).
- [x] Upsert idempotente para evitar duplicatas.

### Fase 3 - Web

- [x] Botões/fluxos de importação separados no plantel.
- [x] Resultado de import em toast (novos/atualizados).
- [x] Aba de premiações com dados reais na ficha do animal.

### Fase 4 - Mobile

- [x] Ajustar tipos/serviços para manter compatibilidade com importação.
- [x] Garantir listagem de premiações alinhada com web (fonte `awards`).
- [ ] Validar consistência de dados por animal via RowId vinculado (teste com import real).

### Fase 5 - Validação

- [ ] Reimportar planilhas de condomínio e premições sem duplicidade.
- [ ] Confirmar warnings para RowId inexistente.
- [ ] Web: `npm run build`.
- [ ] Mobile: `npm run typecheck`.

## Critérios de Pronto

- Importações executam de ponta a ponta com RowId como referência.
- Linhas sem vínculo válido são ignoradas com warning registrado.
- Aba de premiações da ficha web usa dados reais de `awards`.
- Mobile alinhado com a versão web para premiações.
- Build e typecheck passando.
