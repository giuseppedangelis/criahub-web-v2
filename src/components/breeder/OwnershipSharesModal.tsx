import { Plus, Star, Trash2, X, Info } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { AnimalOwnershipShare, OwnershipShareDraft, OwnershipTerminationType } from '@/types';

interface OwnershipSharesModalProps {
  initialShares: AnimalOwnershipShare[];
  defaultOwnerName?: string;
  animalBirthDate?: string | null;
  partnerLocationOptions?: string[];
  onClose: () => void;
  onSave: (shares: OwnershipShareDraft[]) => Promise<void> | void;
  isSaving?: boolean;
}

interface ShareRow {
  tempId: string;
  id?: string;
  owner_name: string;
  percentage: string;
  is_primary: boolean;
}

interface CondominioTerms {
  start_date: string;
  physical_location: string;
  is_external: boolean;
  termination_type: OwnershipTerminationType | '';
  termination_date: string;
  termination_age_years: string;
}

function createRow(
  share?: Partial<AnimalOwnershipShare>,
  overrides?: Partial<ShareRow>
): ShareRow {
  return {
    tempId: `share-${Math.random().toString(36).slice(2, 10)}`,
    id: share?.id,
    owner_name: share?.owner_name || '',
    percentage: share?.percentage !== undefined ? String(share.percentage) : '0',
    is_primary: Boolean(share?.is_primary),
    ...overrides,
  };
}

function buildInitialRows(initialShares: AnimalOwnershipShare[], defaultOwnerName?: string): ShareRow[] {
  if (initialShares.length > 0) return initialShares.map((s) => createRow(s));
  if (defaultOwnerName) {
    return [createRow(undefined, { owner_name: defaultOwnerName, percentage: '100', is_primary: true })];
  }
  return [createRow(undefined, { percentage: '100', is_primary: true })];
}

function buildInitialTerms(initialShares: AnimalOwnershipShare[]): CondominioTerms {
  // Usa o primeiro share ativo com termos definidos como fonte (todos devem ser iguais).
  const ref = initialShares.find((s) => s.termination_type) || initialShares[0];
  return {
    start_date: ref?.start_date || '',
    physical_location: ref?.physical_location || '',
    is_external: Boolean(ref?.is_external),
    termination_type: (ref?.termination_type as OwnershipTerminationType) || '',
    termination_date: ref?.termination_date || '',
    termination_age_years: ref?.termination_age_years != null ? String(ref.termination_age_years) : '',
  };
}

function calcRemainingLabel(terms: CondominioTerms, birthDate?: string | null): string | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let due: Date | null = null;
  if (terms.termination_type === 'date' && terms.termination_date) {
    due = new Date(terms.termination_date + 'T00:00:00');
  } else if (terms.termination_type === 'age' && terms.termination_age_years && birthDate) {
    const years = Number.parseInt(terms.termination_age_years, 10);
    if (!Number.isFinite(years) || years <= 0) return null;
    const b = new Date(birthDate + 'T00:00:00');
    due = new Date(b.setFullYear(b.getFullYear() + years));
  }
  if (!due) return null;
  const diffMs = due.getTime() - today.getTime();
  const days = Math.round(diffMs / 86400000);
  if (days < 0) {
    return `Vencido há ${Math.abs(days)} dia${Math.abs(days) === 1 ? '' : 's'} (animal ainda não retornou)`;
  }
  if (days === 0) return 'Vence hoje';
  if (days <= 45) return `Devolver em ${days} dia${days === 1 ? '' : 's'}`;
  const months = Math.round(days / 30);
  if (months <= 18) {
    if (terms.termination_type === 'age') {
      return `Faltam ${months} mês(es) para completar ${terms.termination_age_years} anos`;
    }
    return `Devolver em ${months} mês(es)`;
  }
  const yrs = (days / 365).toFixed(1);
  return `Devolver em ${yrs} anos`;
}

export function OwnershipSharesModal({
  initialShares,
  defaultOwnerName,
  animalBirthDate,
  partnerLocationOptions = [],
  onClose,
  onSave,
  isSaving = false,
}: OwnershipSharesModalProps) {
  const [rows, setRows] = useState<ShareRow[]>(() => buildInitialRows(initialShares, defaultOwnerName));
  const [terms, setTerms] = useState<CondominioTerms>(() => buildInitialTerms(initialShares));
  const [validationError, setValidationError] = useState<string | null>(null);

  const totalPercentage = useMemo(
    () =>
      rows.reduce((sum, row) => {
        const parsed = Number.parseFloat(row.percentage.replace(',', '.'));
        return sum + (Number.isFinite(parsed) ? parsed : 0);
      }, 0),
    [rows]
  );

  const hasPrimary = useMemo(() => rows.some((r) => r.is_primary), [rows]);
  const isCondominio = rows.length >= 2;
  const remainingLabel = useMemo(() => calcRemainingLabel(terms, animalBirthDate), [terms, animalBirthDate]);

  const updateRow = (tempId: string, patch: Partial<ShareRow>) => {
    setRows((cur) => cur.map((r) => (r.tempId === tempId ? { ...r, ...patch } : r)));
  };

  const handleSetPrimary = (tempId: string) => {
    setRows((cur) => cur.map((r) => ({ ...r, is_primary: r.tempId === tempId })));
  };

  const handleAddShare = () => {
    setRows((cur) => [...cur, createRow(undefined, { percentage: '0', is_primary: cur.length === 0 })]);
  };

  const handleRemoveShare = (tempId: string) => {
    setRows((cur) => {
      const next = cur.filter((r) => r.tempId !== tempId);
      if (next.length === 0) return [createRow(undefined, { percentage: '100', is_primary: true })];
      if (!next.some((r) => r.is_primary)) next[0] = { ...next[0], is_primary: true };
      return next;
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setValidationError(null);

    const parsedRows = rows.map((r) => ({
      id: r.id,
      owner_name: r.owner_name.trim(),
      percentage: Number.parseFloat(r.percentage.replace(',', '.')),
      is_primary: r.is_primary,
    }));

    if (parsedRows.some((s) => !s.owner_name)) {
      setValidationError('Preencha o nome de todos os cotistas.');
      return;
    }
    if (parsedRows.some((s) => !Number.isFinite(s.percentage) || s.percentage <= 0)) {
      setValidationError('Toda cota precisa ter um percentual maior que zero.');
      return;
    }
    if (!hasPrimary) {
      setValidationError('Defina um dono principal.');
      return;
    }
    const seen = new Set<string>();
    for (const s of parsedRows) {
      const key = s.owner_name.toUpperCase();
      if (seen.has(key)) {
        setValidationError('Não repita o mesmo cotista nas cotas ativas.');
        return;
      }
      seen.add(key);
    }
    const rounded = Number(totalPercentage.toFixed(2));
    if (Math.abs(rounded - 100) > 0.01) {
      setValidationError('A soma das cotas ativas precisa fechar em 100%.');
      return;
    }

    // Valida termos do condomínio (só se houver 2+ cotistas)
    const sharedTerms = {
      start_date: terms.start_date || null,
      termination_type: null as OwnershipTerminationType | null,
      termination_date: null as string | null,
      termination_age_years: null as number | null,
      physical_location: terms.physical_location.trim() || null,
      is_external: terms.is_external,
    };

    if (isCondominio && terms.termination_type) {
      if (terms.termination_type === 'date') {
        if (!terms.termination_date) {
          setValidationError('Informe a data de término do condomínio.');
          return;
        }
        sharedTerms.termination_type = 'date';
        sharedTerms.termination_date = terms.termination_date;
      } else if (terms.termination_type === 'age') {
        const yrs = Number.parseInt(terms.termination_age_years, 10);
        if (!Number.isFinite(yrs) || yrs <= 0) {
          setValidationError('Informe a idade de término do condomínio.');
          return;
        }
        if (!animalBirthDate) {
          setValidationError('O animal precisa ter data de nascimento cadastrada para usar critério por idade.');
          return;
        }
        sharedTerms.termination_type = 'age';
        sharedTerms.termination_age_years = yrs;
      }
    }

    const finalShares: OwnershipShareDraft[] = parsedRows.map((s) => ({
      id: s.id,
      owner_name: s.owner_name,
      percentage: s.percentage,
      is_primary: s.is_primary,
      ...sharedTerms,
    }));

    try {
      await onSave(finalShares);
      onClose();
    } catch {
      // Erro tratado via toast externo.
    }
  };

  const totalClassName =
    Math.abs(totalPercentage - 100) <= 0.01
      ? 'text-emerald-600 dark:text-emerald-400'
      : 'text-amber-600 dark:text-amber-400';

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-[rgba(255,255,255,0.1)]">
          <div>
            <h3 className="text-xl text-foreground dark:text-white mb-1">Gerenciar Propriedade</h3>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
              Edite os cotistas, percentuais, o dono principal e — quando aplicável — as condições do condomínio.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-foreground dark:text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-sm text-muted-foreground dark:text-[#99a1af]">
              A soma das cotas ativas deve totalizar 100%.
            </div>
            <div className={`text-sm font-medium ${totalClassName}`}>
              Total atual: {totalPercentage.toFixed(2)}%
            </div>
          </div>

          <div className="space-y-4">
            {rows.map((row, index) => (
              <div
                key={row.tempId}
                className="rounded-xl border border-gray-200 dark:border-[rgba(255,255,255,0.1)] p-4 bg-gray-50 dark:bg-[#0d0d0d]"
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="text-sm text-foreground dark:text-white">Cotista {index + 1}</div>
                  <button
                    type="button"
                    onClick={() => handleRemoveShare(row.tempId)}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    {row.id ? 'Encerrar participação' : 'Remover'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_180px_180px] gap-4">
                  <div>
                    <label className="block text-sm text-foreground dark:text-white mb-2">Nome do cotista *</label>
                    <input
                      type="text"
                      value={row.owner_name}
                      onChange={(e) => updateRow(row.tempId, { owner_name: e.target.value })}
                      placeholder="Nome completo"
                      className="w-full px-4 py-3 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-foreground dark:text-white mb-2">Participação *</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={row.percentage}
                        onChange={(e) => updateRow(row.tempId, { percentage: e.target.value })}
                        className="w-full px-4 py-3 pr-8 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground dark:text-[#99a1af]">
                        %
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-foreground dark:text-white mb-2">Dono principal</label>
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(row.tempId)}
                      className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                        row.is_primary
                          ? 'border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300'
                          : 'border-gray-300 dark:border-[rgba(255,255,255,0.1)] text-muted-foreground dark:text-[#99a1af] hover:bg-gray-100 dark:hover:bg-[#1a1a1a]'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${row.is_primary ? 'fill-current' : ''}`} />
                      {row.is_primary ? 'Principal' : 'Definir principal'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddShare}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-dashed border-gray-300 dark:border-[rgba(255,255,255,0.15)] text-foreground dark:text-white hover:bg-gray-50 dark:hover:bg-[#0d0d0d] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar cotista
          </button>

          {isCondominio && (
            <div className="rounded-xl border border-gray-200 dark:border-[rgba(255,255,255,0.1)] p-4 bg-white dark:bg-[#0d0d0d] space-y-4">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-foreground dark:text-white">Condições do condomínio</h4>
                <Info className="w-4 h-4 text-muted-foreground dark:text-[#99a1af]" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">Data de início</label>
                  <input
                    type="date"
                    value={terms.start_date}
                    onChange={(e) => setTerms((t) => ({ ...t, start_date: e.target.value }))}
                    className="w-full px-4 py-3 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                  />
                </div>

                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">Localização física (com quem/onde)</label>
                  {(() => {
                    const options = partnerLocationOptions;
                    const currentValue = terms.physical_location;
                    const isCustom = currentValue !== '' && !options.includes(currentValue);
                    const selectValue = currentValue === '' ? '' : isCustom ? '__other__' : currentValue;
                    return (
                      <>
                        <select
                          value={selectValue}
                          onChange={(e) => {
                            const v = e.target.value;
                            if (v === '__other__') {
                              setTerms((t) => ({ ...t, physical_location: t.physical_location && !options.includes(t.physical_location) ? t.physical_location : ' ' }));
                            } else {
                              setTerms((t) => ({ ...t, physical_location: v }));
                            }
                          }}
                          className="w-full px-4 py-3 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                        >
                          <option value="">Selecione...</option>
                          {options.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                          <option value="__other__">Outro (digitar)...</option>
                        </select>
                        {(isCustom || selectValue === '__other__') && (
                          <input
                            type="text"
                            value={currentValue.trim()}
                            onChange={(e) => setTerms((t) => ({ ...t, physical_location: e.target.value }))}
                            placeholder="Ex: Haras São João / Fazenda do sócio"
                            className="mt-2 w-full px-4 py-3 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                          />
                        )}
                        {options.length === 0 && (
                          <p className="mt-2 text-xs text-muted-foreground dark:text-[#99a1af]">
                            Cadastre sócios/haras externos em Configurações → Geral → &quot;Sócios / Haras externos&quot; para aparecerem aqui.
                          </p>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>

              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">Critério de término</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {(['', 'date', 'age'] as const).map((val) => (
                    <button
                      key={val || 'none'}
                      type="button"
                      onClick={() => setTerms((t) => ({ ...t, termination_type: val }))}
                      className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                        terms.termination_type === val
                          ? 'border-primary bg-primary text-white dark:border-white dark:bg-white dark:text-black'
                          : 'border-gray-300 dark:border-[rgba(255,255,255,0.1)] text-muted-foreground dark:text-[#99a1af] hover:bg-gray-100 dark:hover:bg-[#1a1a1a]'
                      }`}
                    >
                      {val === '' ? 'Sem prazo' : val === 'date' ? 'Por data' : 'Por idade'}
                    </button>
                  ))}
                </div>

                {terms.termination_type === 'date' && (
                  <input
                    type="date"
                    value={terms.termination_date}
                    onChange={(e) => setTerms((t) => ({ ...t, termination_date: e.target.value }))}
                    className="w-full md:w-60 px-4 py-3 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                  />
                )}

                {terms.termination_type === 'age' && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground dark:text-[#99a1af]">Até os</span>
                    <input
                      type="number"
                      min="1"
                      max="40"
                      value={terms.termination_age_years}
                      onChange={(e) => setTerms((t) => ({ ...t, termination_age_years: e.target.value }))}
                      className="w-24 px-4 py-3 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                    />
                    <span className="text-sm text-muted-foreground dark:text-[#99a1af]">anos de idade</span>
                  </div>
                )}

                {remainingLabel && (
                  <div className="mt-3 text-sm text-foreground dark:text-white bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 rounded-lg px-3 py-2">
                    {remainingLabel}
                  </div>
                )}
              </div>

              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={terms.is_external}
                  onChange={(e) => setTerms((t) => ({ ...t, is_external: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300 dark:border-[rgba(255,255,255,0.2)]"
                />
                <span className="text-sm text-foreground dark:text-white">
                  Animal está fora do haras enquanto em sociedade
                </span>
              </label>
            </div>
          )}

          <div className="text-xs text-muted-foreground dark:text-[#99a1af]">
            Ao encerrar um cotista já salvo, a participação sai das cotas ativas e passa a aparecer no histórico de propriedade.
          </div>

          {validationError && (
            <div className="rounded-lg border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 px-4 py-3 text-sm text-red-700 dark:text-red-300">
              {validationError}
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 rounded-lg border border-gray-300 dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white hover:bg-gray-50 dark:hover:bg-[#0d0d0d] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-3 rounded-lg bg-primary dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Salvando...' : 'Salvar propriedade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
