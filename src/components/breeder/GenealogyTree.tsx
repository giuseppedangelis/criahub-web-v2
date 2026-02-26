import { X, ZoomIn, ZoomOut, RefreshCw, User } from 'lucide-react';
import { useState } from 'react';
import type { GenealogyView } from '@/lib/genealogy';

interface GenealogyTreeProps {
  genealogy: GenealogyView;
  onClose: () => void;
  onViewAnimal?: (animalId: string) => void;
  isLoading?: boolean;
}

function isHistoricalNodeId(id?: string): boolean {
  return Boolean(id && id.startsWith('historical:'));
}

function isNodeNavigable(id: string | undefined, isHistorical: boolean | undefined): id is string {
  return Boolean(id && !isHistorical && !isHistoricalNodeId(id));
}

export function GenealogyTree({ genealogy, onClose, onViewAnimal, isLoading }: GenealogyTreeProps) {
  const [zoomLevel, setZoomLevel] = useState(100);
  const { root, parents, grandparents, greatGrandparents } = genealogy;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl w-full h-full max-w-[95vw] max-h-[95vh] flex flex-col border border-border dark:border-[#3a3a3a]">
        {/* Header */}
        <div className="p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)] flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="text-2xl text-foreground dark:text-white mb-1">Árvore Genealógica Completa</h3>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
              {root.name} {root.registry !== '-' ? `- ${root.registry}` : ''} · até bisavós
            </p>
          </div>
          
          {/* Controles */}
          <div className="flex items-center gap-3">
            {/* Zoom Out */}
            <button
              onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
              className="p-2 border border-border dark:border-[#333333] rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
              aria-label="Diminuir zoom"
              title="Diminuir zoom"
            >
              <ZoomOut className="w-5 h-5 text-muted-foreground dark:text-[#BCC1CA]" />
            </button>

            {/* Zoom Level */}
            <span className="text-sm text-muted-foreground dark:text-[#99a1af] min-w-[60px] text-center">
              {zoomLevel}%
            </span>

            {/* Zoom In */}
            <button
              onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}
              className="p-2 border border-border dark:border-[#333333] rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
              aria-label="Aumentar zoom"
              title="Aumentar zoom"
            >
              <ZoomIn className="w-5 h-5 text-muted-foreground dark:text-[#BCC1CA]" />
            </button>

            {/* Reset */}
            <button
              onClick={() => {
                setZoomLevel(100);
              }}
              className="p-2 border border-border dark:border-[#333333] rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
              aria-label="Resetar visualização"
              title="Resetar"
            >
              <RefreshCw className="w-5 h-5 text-muted-foreground dark:text-[#BCC1CA]" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white"
              aria-label="Fechar"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-auto p-6">
          <div 
            style={{ 
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease-out'
            }}
            className="space-y-6 min-w-max"
          >
            {isLoading && (
              <div className="text-center text-sm text-muted-foreground dark:text-[#99a1af]">
                Carregando genealogia...
              </div>
            )}

            {/* Nível 1 - Animal Principal */}
            <div className="flex justify-center">
              <GenealogyCard
                name={root.name}
                registry={root.registry}
                image={root.imageUrl}
                isMain={true}
                isPlaceholder={root.isPlaceholder}
                isHistorical={root.isHistorical}
              />
            </div>

            {/* Título Pais */}
            <div className="text-center">
              <h5 className="text-lg text-foreground dark:text-white">Pais</h5>
            </div>

            {/* Nível 2 - Pais */}
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-fit">
                {parents.map((parent, index) => (
                  <GenealogyCard
                    key={`parent-${index}`}
                    name={parent.name}
                    registry={parent.registry}
                    image={parent.imageUrl}
                    isPlaceholder={parent.isPlaceholder}
                    isHistorical={parent.isHistorical}
                    onViewDetails={isNodeNavigable(parent.id, parent.isHistorical) ? () => onViewAnimal?.(parent.id!) : undefined}
                  />
                ))}
              </div>
            </div>

            {/* Título Avós */}
            <div className="text-center">
              <h5 className="text-lg text-foreground dark:text-white">Avós</h5>
            </div>

            {/* Nível 3 - Avós */}
            <div className="flex justify-center">
              <div className="grid grid-cols-4 gap-5 w-fit">
                {grandparents.map((grandparent, index) => (
                  <GenealogyCard
                    key={`grandparent-${index}`}
                    name={grandparent.name}
                    registry={grandparent.registry}
                    image={grandparent.imageUrl}
                    isSmall={true}
                    isPlaceholder={grandparent.isPlaceholder}
                    isHistorical={grandparent.isHistorical}
                    onViewDetails={isNodeNavigable(grandparent.id, grandparent.isHistorical) ? () => onViewAnimal?.(grandparent.id!) : undefined}
                  />
                ))}
              </div>
            </div>

            {/* Título Bisavós */}
            <div className="text-center">
              <h5 className="text-lg text-foreground dark:text-white">Bisavós</h5>
            </div>

            {/* Nível 4 - Bisavós */}
            <div className="flex justify-center">
              <div className="grid grid-cols-8 gap-4 w-fit">
                {greatGrandparents.map((greatGrandparent, index) => (
                  <GenealogyCard
                    key={`great-grandparent-${index}`}
                    name={greatGrandparent.name}
                    registry={greatGrandparent.registry}
                    image={greatGrandparent.imageUrl}
                    isTiny={true}
                    isPlaceholder={greatGrandparent.isPlaceholder}
                    isHistorical={greatGrandparent.isHistorical}
                    onViewDetails={isNodeNavigable(greatGrandparent.id, greatGrandparent.isHistorical) ? () => onViewAnimal?.(greatGrandparent.id!) : undefined}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border dark:border-[rgba(255,255,255,0.1)] flex justify-between items-center flex-shrink-0">
          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
            4 gerações • até bisavós
          </p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente de Card de Genealogia (reutilizado)
interface GenealogyCardProps {
  name: string;
  registry: string;
  image: string;
  isMain?: boolean;
  isSmall?: boolean;
  isTiny?: boolean;
  isPlaceholder?: boolean;
  isHistorical?: boolean;
  onViewDetails?: () => void;
}

function GenealogyCard({ name, registry, image, isMain, isSmall, isTiny, isPlaceholder, isHistorical, onViewDetails }: GenealogyCardProps) {
  const canOpenDetails = Boolean(onViewDetails) && !isHistorical;
  const cardClasses = isTiny
    ? 'w-28 h-36'
    : isSmall
    ? 'w-40 h-48'
    : isMain
    ? 'w-48 h-56'
    : 'w-40 h-48';

  return (
    <div
      className={`${cardClasses} bg-card dark:bg-[#0d0d0d] rounded-xl border-2 ${
        isMain
          ? 'border-primary dark:border-white'
          : isHistorical
            ? 'border-dashed border-zinc-400 dark:border-zinc-500 bg-zinc-100/60 dark:bg-zinc-900/70'
            : 'border-border dark:border-[rgba(255,255,255,0.1)]'
      } overflow-hidden flex flex-col transition-shadow ${canOpenDetails ? 'cursor-pointer hover:shadow-lg' : ''} ${isPlaceholder ? 'opacity-70' : ''} ${isHistorical ? 'opacity-90' : ''}`}
      onClick={canOpenDetails ? onViewDetails : undefined}
    >
      {isHistorical ? (
        <div className={`${isTiny ? 'h-20' : isSmall ? 'h-28' : isMain ? 'h-32' : 'h-28'} flex-shrink-0 flex items-center justify-center bg-zinc-200/70 dark:bg-zinc-800/70`}>
          <User className={`${isTiny ? 'w-7 h-7' : isSmall ? 'w-8 h-8' : 'w-6 h-6'} text-zinc-500 dark:text-zinc-400`} />
        </div>
      ) : (
        <div className={`${isTiny ? 'h-20' : isSmall ? 'h-28' : isMain ? 'h-32' : 'h-28'} overflow-hidden flex-shrink-0`}>
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-2 flex-1 flex flex-col justify-center">
        <p className={`${isTiny || isSmall ? 'text-sm' : 'text-sm'} text-foreground dark:text-white truncate`}>
          {name}
        </p>
        <p className="text-xs text-muted-foreground dark:text-[#99a1af] truncate">
          {registry}
        </p>
        {isHistorical && !isTiny && (
          <span className="mt-1 inline-flex items-center rounded border border-zinc-300 dark:border-zinc-600 bg-zinc-200/70 dark:bg-zinc-800/60 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-zinc-700 dark:text-zinc-300">
            Registro historico
          </span>
        )}
        {canOpenDetails && !isTiny && (
          <button
            className="mt-2 text-xs text-primary dark:text-white hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails?.();
            }}
          >
            Ver Detalhes
          </button>
        )}
      </div>
    </div>
  );
}
