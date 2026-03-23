import { Plus, Star, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { AnimalOwnershipShare } from '@/types';

interface OwnershipSharesModalProps {
  initialShares: AnimalOwnershipShare[];
  defaultOwnerName?: string;
  onClose: () => void;
  onSave: (
    shares: Array<{
      id?: string;
      owner_name: string;
      percentage: number;
      is_primary: boolean;
    }>
  ) => Promise<void> | void;
  isSaving?: boolean;
}

interface OwnershipShareDraft {
  tempId: string;
  id?: string;
  owner_name: string;
  percentage: string;
  is_primary: boolean;
}

function createDraft(
  share?: Partial<AnimalOwnershipShare>,
  overrides?: Partial<OwnershipShareDraft>
): OwnershipShareDraft {
  return {
    tempId: `share-${Math.random().toString(36).slice(2, 10)}`,
    id: share?.id,
    owner_name: share?.owner_name || '',
    percentage: share?.percentage !== undefined ? String(share.percentage) : '0',
    is_primary: Boolean(share?.is_primary),
    ...overrides,
  };
}

function buildInitialDrafts(initialShares: AnimalOwnershipShare[], defaultOwnerName?: string): OwnershipShareDraft[] {
  if (initialShares.length > 0) {
    return initialShares.map((share) => createDraft(share));
  }

  if (defaultOwnerName) {
    return [
      createDraft(undefined, {
        owner_name: defaultOwnerName,
        percentage: '100',
        is_primary: true,
      }),
    ];
  }

  return [createDraft(undefined, { percentage: '100', is_primary: true })];
}

export function OwnershipSharesModal({
  initialShares,
  defaultOwnerName,
  onClose,
  onSave,
  isSaving = false,
}: OwnershipSharesModalProps) {
  const [drafts, setDrafts] = useState<OwnershipShareDraft[]>(
    () => buildInitialDrafts(initialShares, defaultOwnerName)
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  const totalPercentage = useMemo(
    () =>
      drafts.reduce((sum, draft) => {
        const parsed = Number.parseFloat(draft.percentage.replace(',', '.'));
        return sum + (Number.isFinite(parsed) ? parsed : 0);
      }, 0),
    [drafts]
  );

  const hasPrimary = useMemo(() => drafts.some((draft) => draft.is_primary), [drafts]);

  const updateDraft = (tempId: string, patch: Partial<OwnershipShareDraft>) => {
    setDrafts((current) =>
      current.map((draft) => {
        if (draft.tempId !== tempId) return draft;
        return { ...draft, ...patch };
      })
    );
  };

  const handleSetPrimary = (tempId: string) => {
    setDrafts((current) =>
      current.map((draft) => ({
        ...draft,
        is_primary: draft.tempId === tempId,
      }))
    );
  };

  const handleAddShare = () => {
    setDrafts((current) => [
      ...current,
      createDraft(undefined, {
        percentage: '0',
        is_primary: current.length === 0,
      }),
    ]);
  };

  const handleRemoveShare = (tempId: string) => {
    setDrafts((current) => {
      const next = current.filter((draft) => draft.tempId !== tempId);
      if (next.length === 0) {
        return [createDraft(undefined, { percentage: '100', is_primary: true })];
      }

      if (!next.some((draft) => draft.is_primary)) {
        next[0] = { ...next[0], is_primary: true };
      }

      return next;
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setValidationError(null);

    const normalizedShares = drafts.map((draft) => ({
      id: draft.id,
      owner_name: draft.owner_name.trim(),
      percentage: Number.parseFloat(draft.percentage.replace(',', '.')),
      is_primary: draft.is_primary,
    }));

    if (normalizedShares.some((share) => !share.owner_name)) {
      setValidationError('Preencha o nome de todos os cotistas.');
      return;
    }

    if (normalizedShares.some((share) => !Number.isFinite(share.percentage) || share.percentage <= 0)) {
      setValidationError('Toda cota precisa ter um percentual maior que zero.');
      return;
    }

    if (!hasPrimary) {
      setValidationError('Defina um dono principal.');
      return;
    }

    const duplicatedOwners = new Set<string>();
    for (const share of normalizedShares) {
      const key = share.owner_name.toUpperCase();
      if (duplicatedOwners.has(key)) {
        setValidationError('Não repita o mesmo cotista nas cotas ativas.');
        return;
      }
      duplicatedOwners.add(key);
    }

    const roundedTotal = Number(totalPercentage.toFixed(2));
    if (Math.abs(roundedTotal - 100) > 0.01) {
      setValidationError('A soma das cotas ativas precisa fechar em 100%.');
      return;
    }

    try {
      await onSave(normalizedShares);
      onClose();
    } catch {
      // O erro visual fica no chamador via toast.
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
              Edite os cotistas ativos, o percentual de participação e o dono principal.
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
            {drafts.map((draft, index) => (
              <div
                key={draft.tempId}
                className="rounded-xl border border-gray-200 dark:border-[rgba(255,255,255,0.1)] p-4 bg-gray-50 dark:bg-[#0d0d0d]"
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="text-sm text-foreground dark:text-white">
                    Cotista {index + 1}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveShare(draft.tempId)}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    {draft.id ? 'Encerrar participação' : 'Remover'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_180px_180px] gap-4">
                  <div>
                    <label className="block text-sm text-foreground dark:text-white mb-2">
                      Nome do cotista *
                    </label>
                    <input
                      type="text"
                      value={draft.owner_name}
                      onChange={(e) => updateDraft(draft.tempId, { owner_name: e.target.value })}
                      placeholder="Nome completo"
                      className="w-full px-4 py-3 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-foreground dark:text-white mb-2">
                      Participação *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={draft.percentage}
                        onChange={(e) => updateDraft(draft.tempId, { percentage: e.target.value })}
                        className="w-full px-4 py-3 pr-8 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground dark:text-[#99a1af]">
                        %
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-foreground dark:text-white mb-2">
                      Dono principal
                    </label>
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(draft.tempId)}
                      className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                        draft.is_primary
                          ? 'border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300'
                          : 'border-gray-300 dark:border-[rgba(255,255,255,0.1)] text-muted-foreground dark:text-[#99a1af] hover:bg-gray-100 dark:hover:bg-[#1a1a1a]'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${draft.is_primary ? 'fill-current' : ''}`} />
                      {draft.is_primary ? 'Principal' : 'Definir principal'}
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
