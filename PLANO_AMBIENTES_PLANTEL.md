# Plano de Execução - Ambientes do Plantel (Web + Mobile)

## Decisão Confirmada

- Estratégia de condomínio: **Opção 1**
  - Importação ABCCMM para animais oficiais.
  - Importação de condomínio em **arquivo separado de cotas/compartilhamento**.

## Repositórios e Branches

- Web: `D:\Dev\criahub-v2\criahub-web-v2` - branch `develop`
- Mobile: `D:\Dev\criahub-mobile` - branch `develop`

## Objetivo Funcional (100%)

Implementar 4 ambientes funcionais no plantel:

1. **Plantel Oficial** - animais com vínculo ABCCMM (`abccmm_rowid`).
2. **Avulsos** - animais sem vínculo oficial (nascimentos e cadastros manuais).
3. **Vinculação** - fila para vincular avulsos ao oficial após atualização da planilha.
4. **Condomínio** - animais compartilhados com cotas de propriedade.

## Arquitetura Alvo

- Base de animais continua em `animals`.
- Condomínio passa a ser modelado por cotas em tabela dedicada.
- Vinculação passa a ser modelada por fila dedicada.
- Importador ABCCMM evolui para evitar duplicidade e suportar vínculo de avulsos.

## Backlog por Fase

### Fase 1 - Banco de dados

- [x] Criar tabela `animal_ownership_shares` (cotas de propriedade).
- [x] Criar tabela `animal_link_queue` (fila de vinculação).
- [x] Criar índices e constraints para performance e integridade.
- [x] Gerar migration em `supabase/migrations`.

### Fase 2 - Tipos e serviços (Web)

- [x] Expandir `AnimalFilters` com filtro de ambiente.
- [x] Atualizar mapeamentos de `animalsService.list` para ambiente.
- [x] Criar operações de cotas em `animalsService` (importação de condomínio).
- [x] Criar operações de vinculação em `animalsService` (listar, vincular, dispensar).

### Fase 3 - Importação ABCCMM v2

- [x] Manter ABCCMM como fonte oficial do ambiente Plantel Oficial.
- [x] Match por ordem: `abccmm_rowid` -> `registro` -> `chip`.
- [x] Match secundário por `nome + data_nascimento + sexo` com confiança.
- [x] Abrir item na `animal_link_queue` para casos de vínculo por similaridade.
- [x] Evitar criação de duplicata ao importar animal já existente como avulso.

### Fase 4 - Importação Condomínio (arquivo separado)

- [x] Definir layout do arquivo de cotas (colunas obrigatórias e opcionais).
- [x] Implementar parser/importador de cotas.
- [x] Regras de validação (percentual, vigência, dono principal).
- [x] Upsert de cotas por animal sem apagar histórico.

### Fase 5 - UI Plantel (Web)

- [x] Adicionar tabs/ambientes: Oficial, Avulsos, Vinculação, Condomínio.
- [ ] Mostrar contadores por ambiente.
- [x] Reaproveitar grid/lista/filtros por ambiente.
- [x] Adicionar importações separadas: ABCCMM e Condomínio.

### Fase 6 - Fluxo de Vinculação

- [x] Tela de fila de vinculação com candidatos e score/confiança.
- [x] Ação "Vincular e mesclar" (preservar mídia/documentos/histórico).
- [ ] Atualização segura de referências pai/mãe e relacionamentos.
- [x] Ações "Dispensar" e "Manter avulso".

### Fase 7 - Condomínio funcional

- [ ] Tela de cotas por animal.
- [ ] Edição de participação e dono principal.
- [x] Badge/indicadores de condomínio no card e detalhes.
- [x] Filtro por ambiente de condomínio.

### Fase 8 - Paridade Mobile

- [x] Expor ambientes no plantel mobile.
- [x] Filtro oficial/avulso/condomínio/vinculação.
- [x] Visualização de retorno de hospedagem e vínculo oficial.
- [ ] Tela mínima de fila de vinculação (listar + acionar vínculo).

### Fase 9 - Validação e fechamento

- [ ] Teste de importação ABCCMM sem duplicar avulso (necessário teste com arquivo real).
- [ ] Teste de vinculação manual e atualização de status oficial (necessário teste com dados reais).
- [ ] Teste de importação de cotas condomínio (arquivo separado, necessário arquivo real).
- [x] Build web: `npm run build`.
- [x] Typecheck mobile: `npm run typecheck`.

## Layout do Arquivo de Cotas (Condomínio)

Formato inicial proposto:

- `identificador_animal` (registro ou abccmm_rowid)
- `nome_cotista`
- `percentual`
- `cotista_principal` (`sim`/`nao`)
- `data_inicio` (opcional)
- `data_fim` (opcional)
- `observacoes` (opcional)

## Critérios de Pronto

- Ambientes Oficial, Avulsos, Vinculação e Condomínio operando em produção.
- Duplicidade controlada no fluxo de importação.
- Vinculação de nascidos/avulsos ao oficial concluindo o ciclo.
- Condomínio com lógica real por cotas (não apenas texto em proprietário).
- Web e Mobile alinhados no essencial.
