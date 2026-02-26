import { User, X } from 'lucide-react';
import { useAnimalGenealogy } from '@/hooks/useAnimals';
import { buildGenealogyView } from '@/lib/genealogy';

interface QuickGenealogyModalProps {
  animal: {
    id: number;
    name: string;
    registry: string;
  };
  onClose: () => void;
  onViewAnimal?: (animalId: string) => void;
}

function isHistoricalNodeId(id?: string): boolean {
  return Boolean(id && id.startsWith('historical:'));
}

function isNodeNavigable(id: string | undefined, isHistorical: boolean | undefined): id is string {
  return Boolean(id && !isHistorical && !isHistoricalNodeId(id));
}

export function QuickGenealogyModal({ animal, onClose, onViewAnimal }: QuickGenealogyModalProps) {
  const { data: genealogyData, isLoading } = useAnimalGenealogy(String(animal.id));
  const genealogyView = buildGenealogyView(genealogyData, {
    id: animal.id,
    name: animal.name,
    registry: animal.registry,
    imageUrl: null,
  });
  const [father, mother] = genealogyView.parents;
  const grandparents = genealogyView.grandparents;
  const missingLabels = new Set([
    'Pai nao registrado',
    'Mae nao registrada',
    'Avo (paterno) nao registrado',
    'Avo (paterna) nao registrada',
    'Avo (materno) nao registrado',
    'Avo (materna) nao registrada',
  ]);
  const hasParentsData = genealogyView.parents.some((parent) => !missingLabels.has(parent.name));
  const hasGrandparentsData = grandparents.some((grandparent) => !missingLabels.has(grandparent.name));
  const fatherCanOpenDetails = isNodeNavigable(father?.id, father?.isHistorical);
  const motherCanOpenDetails = isNodeNavigable(mother?.id, mother?.isHistorical);

  const handleAnimalClick = (animalId: string) => {
    if (onViewAnimal) {
      onViewAnimal(animalId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-card dark:bg-[#1a1a1a] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-border dark:border-[#3a3a3a]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl text-foreground dark:text-white mb-1">Genealogia Rápida</h3>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af]">{animal.name} - {animal.registry}</p>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {isLoading && (
              <div className="text-center text-sm text-muted-foreground dark:text-[#99a1af]">
                Carregando genealogia...
              </div>
            )}

            {/* Animal Principal */}
            <div className="text-center">
              <div className="inline-block bg-primary dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg">
                <p className="font-medium">{animal.name}</p>
                <p className="text-sm opacity-90">{animal.registry}</p>
              </div>
            </div>

            {/* Pais */}
            <div>
              <h4 className="text-sm text-muted-foreground dark:text-[#99a1af] mb-3 text-center">Pais</h4>
              <div className="grid grid-cols-2 gap-4">
                {/* Pai */}
                {father && !missingLabels.has(father.name) ? (
                  <div 
                    className={`${father.isHistorical ? 'bg-zinc-100 dark:bg-zinc-900 border border-dashed border-zinc-400 dark:border-zinc-500 text-zinc-800 dark:text-zinc-100' : 'bg-gray-500 dark:bg-gray-600 text-white'} px-4 py-3 rounded-lg ${fatherCanOpenDetails ? 'cursor-pointer hover:opacity-90' : 'opacity-90'} transition-opacity`}
                    onClick={fatherCanOpenDetails ? () => handleAnimalClick(father.id!) : undefined}
                  >
                    <div className="text-xs opacity-90 mb-1">Pai</div>
                    {father.isHistorical && (
                      <div className="mb-2 inline-flex items-center gap-1 rounded border border-zinc-300 dark:border-zinc-600 bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 text-[10px] uppercase tracking-wide">
                        <User className="w-3 h-3" /> Registro historico
                      </div>
                    )}
                    <div className="font-medium">{father.name}</div>
                    <div className="text-xs opacity-75 mt-1">{father.registry}</div>
                  </div>
                ) : (
                  <div className="bg-gray-100 dark:bg-[#2a3441] px-4 py-3 rounded-lg border border-dashed border-gray-300 dark:border-[#3a4451]">
                    <div className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Pai</div>
                    <div className="text-sm text-muted-foreground dark:text-[#99a1af]">Não informado</div>
                  </div>
                )}

                {/* Mãe */}
                {mother && !missingLabels.has(mother.name) ? (
                  <div 
                    className={`${mother.isHistorical ? 'bg-zinc-100 dark:bg-zinc-900 border border-dashed border-zinc-400 dark:border-zinc-500 text-zinc-800 dark:text-zinc-100' : 'bg-pink-500 dark:bg-pink-600 text-white'} px-4 py-3 rounded-lg ${motherCanOpenDetails ? 'cursor-pointer hover:opacity-90' : 'opacity-90'} transition-opacity`}
                    onClick={motherCanOpenDetails ? () => handleAnimalClick(mother.id!) : undefined}
                  >
                    <p className="text-xs opacity-80 mb-1">Mãe</p>
                    {mother.isHistorical && (
                      <div className="mb-2 inline-flex items-center gap-1 rounded border border-zinc-300 dark:border-zinc-600 bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 text-[10px] uppercase tracking-wide">
                        <User className="w-3 h-3" /> Registro historico
                      </div>
                    )}
                    <p className="font-medium text-sm">{mother.name}</p>
                    <p className="text-xs opacity-90">{mother.registry}</p>
                  </div>
                ) : (
                  <div className="bg-muted dark:bg-[#0d0d0d] px-4 py-3 rounded-lg">
                    <p className="text-xs text-muted-foreground dark:text-[#6b6b6b] mb-1">Mãe</p>
                    <p className="text-sm text-muted-foreground dark:text-[#6b6b6b]">Não informado</p>
                  </div>
                )}
              </div>
            </div>

            {/* Avós */}
            {hasGrandparentsData && (
              <div>
                <h4 className="text-sm text-muted-foreground dark:text-[#99a1af] mb-3 text-center">Avós</h4>
                <div className="grid grid-cols-2 gap-3">
                  {grandparents.map((avo, index) => {
                    const grandparentCanOpenDetails = isNodeNavigable(avo.id, avo.isHistorical);
                    return (
                        <div
                          key={`${avo.id || 'avo'}-${index}`}
                          className={`${avo.isHistorical ? 'bg-zinc-100 dark:bg-zinc-900 border-dashed border-zinc-400 dark:border-zinc-500' : 'bg-muted dark:bg-[#0d0d0d] border-border dark:border-[#3a3a3a]'} px-3 py-2 rounded-lg ${grandparentCanOpenDetails ? 'cursor-pointer hover:bg-accent dark:hover:bg-[#2a2a2a]' : 'opacity-90'} transition-colors border`}
                          onClick={grandparentCanOpenDetails ? () => handleAnimalClick(avo.id!) : undefined}
                        >
                          <p className="text-xs text-muted-foreground dark:text-[#6b6b6b] mb-1">
                            {index < 2 ? 'Avô' : 'Avó'} {index % 2 === 0 ? 'Paterno' : 'Materno'}
                          </p>
                          {avo.isHistorical && (
                            <div className="mb-1 inline-flex items-center gap-1 rounded border border-zinc-300 dark:border-zinc-600 bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 text-[10px] uppercase tracking-wide text-zinc-700 dark:text-zinc-300">
                              <User className="w-3 h-3" /> Registro historico
                            </div>
                          )}
                          <p className="text-sm text-foreground dark:text-white font-medium">{avo.name}</p>
                          <p className="text-xs text-muted-foreground dark:text-[#99a1af]">{avo.registry}</p>
                        </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mensagem se não houver genealogia */}
            {!isLoading && !hasParentsData && !hasGrandparentsData && (
              <div className="text-center py-8">
                <p className="text-muted-foreground dark:text-[#99a1af]">
                  Genealogia não cadastrada para este animal
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border dark:border-[rgba(255,255,255,0.1)] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white rounded-lg hover:bg-accent dark:hover:bg-[#2a2a2a] transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
