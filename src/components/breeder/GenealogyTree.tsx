import { X, ZoomIn, ZoomOut, RefreshCw, Maximize2 } from 'lucide-react';
import { useState } from 'react';

interface Animal {
  id: number;
  name: string;
  registry: string;
  image: string;
}

interface GenealogyTreeProps {
  animal: Animal;
  onClose: () => void;
  onViewAnimal?: (animalId: number) => void;
}

export function GenealogyTree({ animal, onClose, onViewAnimal }: GenealogyTreeProps) {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showTataravos, setShowTataravos] = useState(true);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl w-full h-full max-w-[95vw] max-h-[95vh] flex flex-col border border-border dark:border-[#3a3a3a]">
        {/* Header */}
        <div className="p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)] flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="text-2xl text-foreground dark:text-white mb-1">Árvore Genealógica Completa</h3>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
              {animal.name} - 4 Gerações
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

            {/* Toggle Tataravós */}
            <label className="flex items-center gap-2 cursor-pointer px-3 py-2 border border-border dark:border-[#333333] rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors">
              <input
                type="checkbox"
                checked={showTataravos}
                onChange={(e) => setShowTataravos(e.target.checked)}
                className="w-4 h-4 rounded border-border dark:border-[#333333]"
              />
              <span className="text-sm text-foreground dark:text-white">Tataravós</span>
            </label>

            {/* Reset */}
            <button
              onClick={() => {
                setZoomLevel(100);
                setShowTataravos(true);
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
            {/* Nível 1 - Animal Principal */}
            <div className="flex justify-center">
              <GenealogyCard
                name={animal.name}
                registry={animal.registry}
                image={animal.image}
                isMain={true}
              />
            </div>

            {/* Título Pais */}
            <div className="text-center">
              <h5 className="text-lg text-foreground dark:text-white">Pais</h5>
            </div>

            {/* Nível 2 - Pais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <GenealogyCard
                name="Ouro"
                registry="ABCCMM 123456-78"
                image="https://images.unsplash.com/photo-1656964353220-99aa5acc47e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHN0YWxsaW9uJTIwaG9yc2V8ZW58MXx8fHwxNzYzNTAwMTEzfDA&ixlib=rb-4.1.0&q=80&w=1080"
                onViewDetails={() => onViewAnimal?.(101)}
              />
              <GenealogyCard
                name="Aurora"
                registry="ABCCMM 654321-89"
                image="https://images.unsplash.com/photo-1610137856583-e71966c4351d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMGhvcnNlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYzNDA4Njk3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                onViewDetails={() => onViewAnimal?.(102)}
              />
            </div>

            {/* Título Avós */}
            <div className="text-center">
              <h5 className="text-lg text-foreground dark:text-white">Avós</h5>
            </div>

            {/* Nível 3 - Avós */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <GenealogyCard
                name="Hércules"
                registry="ABCCMM 111111-11"
                image="https://images.unsplash.com/photo-1724783483178-79f7ef970c6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGhvcnNlJTIwbWFyZXxlbnwxfHx8fDE3NjM1MDAxMTN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                isSmall={true}
                onViewDetails={() => onViewAnimal?.(201)}
              />
              <GenealogyCard
                name="Safira"
                registry="ABCCMM 222222-22"
                image="https://images.unsplash.com/photo-1667992711873-4bd87cbfbb65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVzdG51dCUyMGhvcnNlfGVufDF8fHx8MTc2MzUwMDExNHww&ixlib=rb-4.1.0&q=80&w=1080"
                isSmall={true}
                onViewDetails={() => onViewAnimal?.(202)}
              />
              <GenealogyCard
                name="Trovão"
                registry="ABCCMM 333333-33"
                image="https://images.unsplash.com/photo-1751715773655-2140695a3a9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmV5JTIwaG9yc2UlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjM1MDAxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                isSmall={true}
                onViewDetails={() => onViewAnimal?.(203)}
              />
              <GenealogyCard
                name="Serena"
                registry="ABCCMM 444444-44"
                image="https://images.unsplash.com/photo-1657150946362-3aee0bbc8163?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWxvbWlubyUyMGhvcnNlfGVufDF8fHx8MTc2MzUwMDExNHww&ixlib=rb-4.1.0&q=80&w=1080"
                isSmall={true}
                onViewDetails={() => onViewAnimal?.(204)}
              />
            </div>

            {/* Título Bisavós */}
            <div className="text-center">
              <h5 className="text-lg text-foreground dark:text-white">Bisavós</h5>
            </div>

            {/* Nível 4 - Bisavós */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              <GenealogyCard
                name="Casarão"
                registry="ABCCMM 11-11"
                image="https://images.unsplash.com/photo-1648242977013-6f21e5a695f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGhvcnNlJTIwZm9hbHxlbnwxfHx8fDE3NjM1MDAxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                isTiny={true}
              />
              <GenealogyCard
                name="Iris"
                registry="ABCCMM 22-22"
                image="https://images.unsplash.com/photo-1748212550010-74453d20e3ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXklMjBob3JzZSUyMHJ1bm5pbmd8ZW58MXx8fHwxNzYzNTAwMTE0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                isTiny={true}
              />
              <GenealogyCard
                name="Atlas"
                registry="ABCCMM 33-33"
                image="https://images.unsplash.com/photo-1610137856583-e71966c4351d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMGhvcnNlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYzNDA4Njk3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                isTiny={true}
              />
              <GenealogyCard
                name="Lua"
                registry="ABCCMM 44-44"
                image="https://images.unsplash.com/photo-1656964353220-99aa5acc47e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHN0YWxsaW9uJTIwaG9yc2V8ZW58MXx8fHwxNzYzNTAwMTEzfDA&ixlib=rb-4.1.0&q=80&w=1080"
                isTiny={true}
              />
              <GenealogyCard
                name="Valente"
                registry="ABCCMM 55-55"
                image="https://images.unsplash.com/photo-1724783483178-79f7ef970c6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGhvcnNlJTIwbWFyZXxlbnwxfHx8fDE3NjM1MDAxMTN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                isTiny={true}
              />
              <GenealogyCard
                name="Jasmin"
                registry="ABCCMM 66-66"
                image="https://images.unsplash.com/photo-1667992711873-4bd87cbfbb65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVzdG51dCUyMGhvcnNlfGVufDF8fHx8MTc2MzUwMDExNHww&ixlib=rb-4.1.0&q=80&w=1080"
                isTiny={true}
              />
              <GenealogyCard
                name="Imperador"
                registry="ABCCMM 77-77"
                image="https://images.unsplash.com/photo-1751715773655-2140695a3a9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmV5JTIwaG9yc2UlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjM1MDAxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                isTiny={true}
              />
              <GenealogyCard
                name="Alice"
                registry="ABCCMM 88-88"
                image="https://images.unsplash.com/photo-1657150946362-3aee0bbc8163?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWxvbWlubyUyMGhvcnNlfGVufDF8fHx8MTc2MzUwMDExNHww&ixlib=rb-4.1.0&q=80&w=1080"
                isTiny={true}
              />
            </div>

            {/* FASE 24: Nível 5 - Tataravós */}
            {showTataravos && (
              <>
                <div className="text-center">
                  <h5 className="text-lg text-foreground dark:text-white">Tataravós</h5>
                </div>

                <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-16 gap-2 overflow-x-auto">
                  {/* 16 Tataravós - 2 para cada bisavô */}
                  <GenealogyCard name="Dom Pedro" registry="MM 01" image="https://images.unsplash.com/photo-1656964353220-99aa5acc47e5?w=400" isTiny={true} />
                  <GenealogyCard name="Estrela" registry="MM 02" image="https://images.unsplash.com/photo-1610137856583-e71966c4351d?w=400" isTiny={true} />
                  <GenealogyCard name="Raio" registry="MM 03" image="https://images.unsplash.com/photo-1724783483178-79f7ef970c6e?w=400" isTiny={true} />
                  <GenealogyCard name="Flora" registry="MM 04" image="https://images.unsplash.com/photo-1667992711873-4bd87cbfbb65?w=400" isTiny={true} />
                  <GenealogyCard name="Tornado" registry="MM 05" image="https://images.unsplash.com/photo-1751715773655-2140695a3a9b?w=400" isTiny={true} />
                  <GenealogyCard name="Luna" registry="MM 06" image="https://images.unsplash.com/photo-1657150946362-3aee0bbc8163?w=400" isTiny={true} />
                  <GenealogyCard name="Brilhante" registry="MM 07" image="https://images.unsplash.com/photo-1648242977013-6f21e5a695f4?w=400" isTiny={true} />
                  <GenealogyCard name="Coral" registry="MM 08" image="https://images.unsplash.com/photo-1748212550010-74453d20e3ab?w=400" isTiny={true} />
                  <GenealogyCard name="Gigante" registry="MM 09" image="https://images.unsplash.com/photo-1656964353220-99aa5acc47e5?w=400" isTiny={true} />
                  <GenealogyCard name="Diamante" registry="MM 10" image="https://images.unsplash.com/photo-1610137856583-e71966c4351d?w=400" isTiny={true} />
                  <GenealogyCard name="Rei" registry="MM 11" image="https://images.unsplash.com/photo-1724783483178-79f7ef970c6e?w=400" isTiny={true} />
                  <GenealogyCard name="Violeta" registry="MM 12" image="https://images.unsplash.com/photo-1667992711873-4bd87cbfbb65?w=400" isTiny={true} />
                  <GenealogyCard name="Magno" registry="MM 13" image="https://images.unsplash.com/photo-1751715773655-2140695a3a9b?w=400" isTiny={true} />
                  <GenealogyCard name="Pérola" registry="MM 14" image="https://images.unsplash.com/photo-1657150946362-3aee0bbc8163?w=400" isTiny={true} />
                  <GenealogyCard name="Zeus" registry="MM 15" image="https://images.unsplash.com/photo-1648242977013-6f21e5a695f4?w=400" isTiny={true} />
                  <GenealogyCard name="Safira II" registry="MM 16" image="https://images.unsplash.com/photo-1748212550010-74453d20e3ab?w=400" isTiny={true} />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border dark:border-[rgba(255,255,255,0.1)] flex justify-between items-center flex-shrink-0">
          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
            {showTataravos ? '4 gerações completas' : '3 gerações'} • {showTataravos ? '31 ancestrais' : '15 ancestrais'}
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
  onViewDetails?: () => void;
}

function GenealogyCard({ name, registry, image, isMain, isSmall, isTiny, onViewDetails }: GenealogyCardProps) {
  const cardClasses = isTiny
    ? 'w-20 h-24'
    : isSmall
    ? 'w-32 h-40'
    : isMain
    ? 'w-48 h-56'
    : 'w-40 h-48';

  return (
    <div
      className={`${cardClasses} bg-card dark:bg-[#0d0d0d] rounded-xl border-2 ${
        isMain ? 'border-primary dark:border-white' : 'border-border dark:border-[rgba(255,255,255,0.1)]'
      } overflow-hidden flex flex-col hover:shadow-lg transition-shadow ${onViewDetails ? 'cursor-pointer' : ''}`}
      onClick={onViewDetails}
    >
      <div className={`${isTiny ? 'h-12' : isSmall ? 'h-24' : isMain ? 'h-32' : 'h-28'} overflow-hidden flex-shrink-0`}>
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-2 flex-1 flex flex-col justify-center">
        <p className={`${isTiny ? 'text-xs' : 'text-sm'} text-foreground dark:text-white truncate`}>
          {name}
        </p>
        <p className="text-xs text-muted-foreground dark:text-[#99a1af] truncate">
          {registry}
        </p>
        {onViewDetails && !isTiny && (
          <button
            className="mt-2 text-xs text-primary dark:text-white hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
          >
            Ver Detalhes
          </button>
        )}
      </div>
    </div>
  );
}
