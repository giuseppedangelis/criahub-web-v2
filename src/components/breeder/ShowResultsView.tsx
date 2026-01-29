import { ArrowLeft, Calendar, MapPin, Trophy, Award, Medal, TrendingUp, Upload, Star, X } from 'lucide-react';
import { useState } from 'react';
import { UpdateResultModal } from './UpdateResultModal';

interface AnimalResult {
  id: string;
  name: string;
  registry: string;
  category: string;
  placement?: number;
  points?: number;
  award?: string;
  judge?: string;
  notes?: string;
  photo?: string;
}

interface ShowResultsViewProps {
  showId: string;
  showName: string;
  showDate: string;
  showLocation: string;
  onBack: () => void;
}

export function ShowResultsView({ showId, showName, showDate, showLocation, onBack }: ShowResultsViewProps) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalResult | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);

  const results: AnimalResult[] = [
    {
      id: '1',
      name: 'Estrela da Manhã',
      registry: '123456',
      category: 'Adulto Fêmea',
      placement: 1,
      points: 95,
      award: 'Campeã da Categoria',
      judge: 'Dr. Carlos Mendes',
      notes: 'Excelente marcha e conformação',
    },
    {
      id: '2',
      name: 'Trovão Negro',
      registry: '123457',
      category: 'Adulto Macho',
      placement: 2,
      points: 92,
      award: 'Reservado Campeão',
      judge: 'Dr. Carlos Mendes',
    },
    {
      id: '3',
      name: 'Lua Cheia',
      registry: '123458',
      category: 'Adulto Fêmea',
      placement: 3,
      points: 89,
      judge: 'Dr. Carlos Mendes',
    },
    {
      id: '4',
      name: 'Sol Nascente',
      registry: '123459',
      category: 'Júnior Macho',
      placement: 1,
      points: 93,
      award: 'Campeão da Categoria',
      judge: 'Dra. Ana Paula Silva',
      notes: 'Destaque em marcha',
    },
  ];

  const placementConfig = {
    1: { color: 'bg-yellow-500', Icon: Award, label: '1º Lugar' },
    2: { color: 'bg-gray-400', Icon: Medal, label: '2º Lugar' },
    3: { color: 'bg-amber-600', Icon: Medal, label: '3º Lugar' },
  };

  const champions = results.filter(r => r.placement === 1);
  const totalPoints = results.reduce((sum, r) => sum + (r.points || 0), 0);
  const avgPoints = totalPoints / results.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-muted dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground dark:text-white" />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl text-foreground dark:text-white mb-1">{showName}</h2>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground dark:text-[#99a1af]">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {showDate.split('-').reverse().join('/')}
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {showLocation}
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowImportModal(true)}
          className="px-4 py-2 border border-border dark:border-[#333333] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Importar Resultados
        </button>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card dark:bg-[#1a1a1a] rounded-xl p-4 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground dark:text-white">{champions.length}</p>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Campeões</p>
            </div>
          </div>
        </div>

        <div className="bg-card dark:bg-[#1a1a1a] rounded-xl p-4 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <Medal className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground dark:text-white">{results.filter(r => r.placement && r.placement <= 3).length}</p>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Premiações</p>
            </div>
          </div>
        </div>

        <div className="bg-card dark:bg-[#1a1a1a] rounded-xl p-4 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground dark:text-white">{avgPoints.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Média de Pontos</p>
            </div>
          </div>
        </div>

        <div className="bg-card dark:bg-[#1a1a1a] rounded-xl p-4 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground dark:text-white">{results.length}</p>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Animais Participantes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Resultados por Animal */}
      <div>
        <h3 className="text-lg text-foreground dark:text-white font-medium mb-4">
          Resultados Detalhados
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {results.map((result) => (
            <AnimalResultCard
              key={result.id}
              result={result}
              placementConfig={placementConfig}
              onUpdate={() => {
                setSelectedAnimal(result);
                setShowUpdateModal(true);
              }}
            />
          ))}
        </div>
      </div>

      {/* Modal de Atualização */}
      {showUpdateModal && selectedAnimal && (
        <UpdateResultModal
          animal={selectedAnimal}
          onClose={() => {
            setShowUpdateModal(false);
            setSelectedAnimal(null);
          }}
          onSave={(updatedData) => {
            console.log('Resultado atualizado:', updatedData);
            setShowUpdateModal(false);
            setSelectedAnimal(null);
          }}
        />
      )}

      {/* Modal de Importação */}
      {showImportModal && (
        <ImportResultsModal onClose={() => setShowImportModal(false)} />
      )}
    </div>
  );
}

interface AnimalResultCardProps {
  result: AnimalResult;
  placementConfig: any;
  onUpdate: () => void;
}

function AnimalResultCard({ result, placementConfig, onUpdate }: AnimalResultCardProps) {
  const placement = result.placement ? placementConfig[result.placement] : null;

  return (
    <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)] hover:border-[#3a3a3a] transition-all space-y-4">
      {/* Header com Nome e Colocação */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h4 className="text-lg text-foreground dark:text-white font-medium mb-1">
            {result.name}
          </h4>
          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
            Reg: {result.registry} • {result.category}
          </p>
        </div>
        {placement && (
          <div className={`${placement.color} text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2`}>
            <placement.Icon className="w-5 h-5" />
            {placement.label}
          </div>
        )}
      </div>

      {/* Pontuação e Premiação */}
      <div className="grid grid-cols-2 gap-4">
        {result.points && (
          <div className="bg-muted dark:bg-[#0d0d0d] rounded-lg p-3">
            <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Pontuação</p>
            <p className="text-2xl font-bold text-foreground dark:text-white">{result.points}</p>
          </div>
        )}
        {result.award && (
          <div className="bg-muted dark:bg-[#0d0d0d] rounded-lg p-3">
            <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Premiação</p>
            <p className="text-sm text-foreground dark:text-white font-medium">{result.award}</p>
          </div>
        )}
      </div>

      {/* Juiz e Observações */}
      {(result.judge || result.notes) && (
        <div className="space-y-2 pt-2 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
          {result.judge && (
            <div>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Juiz:</p>
              <p className="text-sm text-foreground dark:text-white">{result.judge}</p>
            </div>
          )}
          {result.notes && (
            <div>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Observações:</p>
              <p className="text-sm text-foreground dark:text-white">{result.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Botão de Edição */}
      <button
        onClick={onUpdate}
        className="w-full px-4 py-2 border border-border dark:border-[#333333] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors text-sm"
      >
        Editar Resultado
      </button>
    </div>
  );
}

// Modal de Importação de Resultados
function ImportResultsModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl w-full max-w-lg border border-border dark:border-[rgba(255,255,255,0.1)]">
        <div className="p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl text-foreground dark:text-white">Importar Resultados</h3>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-1">
                Sincronize resultados da ABCCMM
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              A importação automática de resultados da ABCCMM estará disponível em breve. Por enquanto, registre os resultados manualmente.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
              Código do Evento ABCCMM
            </label>
            <input
              type="text"
              placeholder="EXPO-MG-2024-012"
              className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af]"
            />
          </div>
        </div>

        <div className="p-6 border-t border-border dark:border-[rgba(255,255,255,0.1)] flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-border dark:border-[#333333] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
          >
            Cancelar
          </button>
          <button
            disabled
            className="flex-1 px-6 py-3 bg-muted dark:bg-[#3a3a3a] text-muted-foreground dark:text-[#99a1af] rounded-lg cursor-not-allowed opacity-60"
          >
            Importar (Em breve)
          </button>
        </div>
      </div>
    </div>
  );
}