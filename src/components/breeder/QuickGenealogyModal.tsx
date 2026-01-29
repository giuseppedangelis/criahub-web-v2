import { X } from 'lucide-react';

interface GenealogyAnimal {
  id: number;
  name: string;
  registry: string;
}

interface QuickGenealogyModalProps {
  animal: {
    id: number;
    name: string;
    registry: string;
  };
  onClose: () => void;
  onViewAnimal?: (animalId: number) => void;
}

export function QuickGenealogyModal({ animal, onClose, onViewAnimal }: QuickGenealogyModalProps) {
  // Mock data - Em produção, isso viria do banco de dados
  const genealogyData = {
    // Ouro (id: 101)
    101: {
      pai: { id: 201, name: 'Hércules', registry: 'ABCCMM 111111-11' },
      mae: { id: 202, name: 'Safira', registry: 'ABCCMM 222222-22' },
      avos: [
        { id: 301, name: 'Titã', registry: 'ABCCMM 301301-01' },
        { id: 302, name: 'Estrela da Manhã', registry: 'ABCCMM 302302-02' },
        { id: 303, name: 'Diamante Negro', registry: 'ABCCMM 303303-03' },
        { id: 304, name: 'Safira Real', registry: 'ABCCMM 304304-04' },
      ]
    },
    // Aurora (id: 102)
    102: {
      pai: { id: 203, name: 'Trovão', registry: 'ABCCMM 333333-33' },
      mae: { id: 204, name: 'Serena', registry: 'ABCCMM 444444-44' },
      avos: [
        { id: 305, name: 'Raio', registry: 'ABCCMM 305305-05' },
        { id: 306, name: 'Tempestade', registry: 'ABCCMM 306306-06' },
        { id: 307, name: 'Sol Poente', registry: 'ABCCMM 307307-07' },
        { id: 308, name: 'Lua Cheia', registry: 'ABCCMM 308308-08' },
      ]
    },
    // Estrela Mangalarga (id: 1)
    1: {
      pai: { id: 101, name: 'Ouro', registry: 'ABCCMM 123456-78' },
      mae: { id: 102, name: 'Aurora', registry: 'ABCCMM 654321-89' },
      avos: [
        { id: 201, name: 'Hércules', registry: 'ABCCMM 111111-11' },
        { id: 202, name: 'Safira', registry: 'ABCCMM 222222-22' },
        { id: 203, name: 'Trovão', registry: 'ABCCMM 333333-33' },
        { id: 204, name: 'Serena', registry: 'ABCCMM 444444-44' },
      ]
    },
    // Relâmpago Negro (id: 2)
    2: {
      pai: { id: 101, name: 'Ouro', registry: 'ABCCMM 123456-78' },
      mae: { id: 204, name: 'Serena', registry: 'ABCCMM 444444-44' },
      avos: [
        { id: 201, name: 'Hércules', registry: 'ABCCMM 111111-11' },
        { id: 202, name: 'Safira', registry: 'ABCCMM 222222-22' },
        { id: 307, name: 'Sol Poente', registry: 'ABCCMM 307307-07' },
        { id: 308, name: 'Lua Cheia', registry: 'ABCCMM 308308-08' },
      ]
    },
    // Default para animais sem genealogia
    default: {
      pai: null,
      mae: null,
      avos: []
    }
  };

  const data = genealogyData[animal.id as keyof typeof genealogyData] || genealogyData.default;

  const handleAnimalClick = (animalId: number) => {
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
                {data.pai ? (
                  <div 
                    className="bg-gray-500 dark:bg-gray-600 text-white px-4 py-3 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => handleAnimalClick(data.pai!.id)}
                  >
                    <div className="text-xs opacity-90 mb-1">Pai</div>
                    <div className="font-medium">{data.pai.name}</div>
                    <div className="text-xs opacity-75 mt-1">{data.pai.registry}</div>
                  </div>
                ) : (
                  <div className="bg-gray-100 dark:bg-[#2a3441] px-4 py-3 rounded-lg border border-dashed border-gray-300 dark:border-[#3a4451]">
                    <div className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Pai</div>
                    <div className="text-sm text-muted-foreground dark:text-[#99a1af]">Não informado</div>
                  </div>
                )}

                {/* Mãe */}
                {data.mae ? (
                  <div 
                    className="bg-pink-500 dark:bg-pink-600 text-white px-4 py-3 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => handleAnimalClick(data.mae!.id)}
                  >
                    <p className="text-xs opacity-80 mb-1">Mãe</p>
                    <p className="font-medium text-sm">{data.mae.name}</p>
                    <p className="text-xs opacity-90">{data.mae.registry}</p>
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
            {data.avos.length > 0 && (
              <div>
                <h4 className="text-sm text-muted-foreground dark:text-[#99a1af] mb-3 text-center">Avós</h4>
                <div className="grid grid-cols-2 gap-3">
                  {data.avos.map((avo, index) => (
                    <div
                      key={avo.id}
                      className="bg-muted dark:bg-[#0d0d0d] px-3 py-2 rounded-lg cursor-pointer hover:bg-accent dark:hover:bg-[#2a2a2a] transition-colors border border-border dark:border-[#3a3a3a]"
                      onClick={() => handleAnimalClick(avo.id)}
                    >
                      <p className="text-xs text-muted-foreground dark:text-[#6b6b6b] mb-1">
                        {index < 2 ? 'Avô' : 'Avó'} {index % 2 === 0 ? 'Paterno' : 'Materno'}
                      </p>
                      <p className="text-sm text-foreground dark:text-white font-medium">{avo.name}</p>
                      <p className="text-xs text-muted-foreground dark:text-[#99a1af]">{avo.registry}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mensagem se não houver genealogia */}
            {!data.pai && !data.mae && data.avos.length === 0 && (
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