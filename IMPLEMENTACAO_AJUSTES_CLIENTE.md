# Plano de Implementação - Ajustes Cliente (Web + Mobile)

Este documento guia a execução dos ajustes solicitados no CriaHub até a conclusão.

## Escopo e Branches

- Web: `D:\Dev\criahub-v2\criahub-web-v2` (branch `develop`)
- Mobile: `D:\Dev\criahub-mobile` (branch `develop`)

## Regras de Negócio Confirmadas

- Categoria automática por idade: corte em **24 meses**
  - 0 a 23 meses: `Potro`/`Potra`
  - 24 meses ou mais: categoria adulta por sexo

## Backlog de Ajustes

### 1) UX e consistência visual

- [x] Corrigir problema visual de hover no dropdown de filtros.
- [x] Ajustar rótulo de categoria para exibir `Potra` (UI), mantendo compatibilidade de banco com `Potranca`.
- [x] Ajustar placeholder de `Marca` para remover referência a chip.

### 2) Cadastro/Edição de animal

- [x] Permitir edição de tipos como `compra`, `nascimento`, `hospedagem`.
- [x] Impedir duplicidade por duplo clique em salvar (lock de submit + validação de duplicidade).
- [x] Reordenar campo de busca de pai/mãe para aparecer como primeira interação.

### 3) Mídia e capa do animal

- [x] Permitir adicionar foto/vídeo após cadastro sem quebrar mídia existente.
- [x] Garantir que capa padrão seja uma **foto** (não vídeo).
- [x] Permitir seleção explícita da foto de capa.
- [x] Remover dependência de imagem ilustrativa como mídia persistida.

### 4) Localização e serviço padronizados

- [x] Trocar campos livres por opções controladas de localização e tipo de serviço.
- [x] Padronizar lista para evitar duplicidade semântica (ex.: "Baia 1" vs "Baía 01").

### 5) Hospedagem (fluxo invertido)

- [x] Priorizar fluxo de "nosso animal hospedado fora".
- [x] Capturar data prevista de retorno.
- [x] Gerar lembrete/agenda para retorno.

### 6) Regras de categoria e parentesco

- [x] Aplicar categoria automática por idade (24 meses).
- [x] Restringir mães/pais elegíveis com base em categoria e idade.
- [x] Garantir evolução automática de categoria com o tempo.

### 7) Organização padrão do plantel

- [x] Exibir **ativos** por padrão.
- [x] Inativos apenas quando filtro explícito for selecionado.
- [x] Ordenação padrão: animais com foto/vídeo primeiro.

### 8) Paridade Mobile

- [x] Espelhar ajustes de nomenclatura (`Potra`) no mobile.
- [x] Espelhar regras de categoria automática e filtros padrão.
- [x] Espelhar ajustes de hospedagem/retorno quando aplicável.

## Estratégia de Execução

1. Executar correções rápidas de UX/rótulos.
2. Implementar travas de duplicidade e ajustes de formulário.
3. Implementar novo comportamento de mídia/capa.
4. Aplicar padronização de localização e hospedagem.
5. Aplicar regra de idade/categoria e restrições de parentesco.
6. Ajustar ordenação e filtros padrão do plantel.
7. Espelhar mudanças relevantes no mobile.
8. Rodar validações:
   - Web: `npm run build`
   - Mobile: `npm run typecheck`

## Critérios de Pronto

- Ajustes implementados em Web e Mobile (branch `develop`).
- Fluxos críticos validados sem regressões visíveis.
- Build web e typecheck mobile passando.
- Pendências e trade-offs documentados ao final.
