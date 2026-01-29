import { X, Download, Upload, Trophy, Medal, Award as AwardIcon, Calendar, MapPin, Plus } from 'lucide-react';
import { useState } from 'react';
import { RegisterAwardModal } from './RegisterAwardModal';

interface Award {
  id: number;
  eventName: string;
  date: string;
  location: string;
  category: string;
  placement: string;
  placementType: '1º Lugar' | '2º Lugar' | '3º Lugar' | 'Campeão' | 'Reservado' | 'Menção Honrosa';
  points?: number;
  description?: string;
  photos: string[];
  certificate?: string;
}

interface AwardsDetailModalProps {
  awards: Award[];
  animalName: string;
  onClose: () => void;
}

export function AwardsDetailModal({ awards, animalName, onClose }: AwardsDetailModalProps) {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  
  // Calcular estatísticas
  const totalAwards = awards.length;
  const totalPoints = awards.reduce((sum, award) => sum + (award.points || 0), 0);
  const averagePoints = totalPoints > 0 ? (totalPoints / totalAwards).toFixed(1) : '0';
  
  // Contar por tipo de colocação
  const placementCounts = awards.reduce((acc, award) => {
    acc[award.placementType] = (acc[award.placementType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Função para obter cor da badge de colocação
  const getPlacementColor = (type: string) => {
    switch (type) {
      case '1º Lugar': return 'bg-yellow-500 text-white';
      case '2º Lugar': return 'bg-gray-400 text-white';
      case '3º Lugar': return 'bg-orange-600 text-white';
      case 'Reservado': return 'bg-purple-500 text-white';
      case 'Menção Honrosa': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // Função para obter ícone da colocação
  const getPlacementIcon = (type: string) => {
    switch (type) {
      case 'Campeão':
      case '1º Lugar':
        return <Trophy className="w-4 h-4" />;
      case '2º Lugar':
      case '3º Lugar':
        return <Medal className="w-4 h-4" />;
      default:
        return <AwardIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-[rgba(255,255,255,0.1)]">
          <div>
            <h3 className="text-xl text-foreground dark:text-white mb-1">
              Premiações Detalhadas - {animalName}
            </h3>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
              Histórico completo de premiações e pontuações
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-foreground dark:text-white" />
          </button>
        </div>

        {/* Estatísticas */}
        <div className="p-6 border-b border-gray-200 dark:border-[rgba(255,255,255,0.1)] bg-gray-50 dark:bg-[#0d0d0d]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-lg border border-gray-200 dark:border-[rgba(255,255,255,0.1)]">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Total</p>
              </div>
              <p className="text-2xl text-foreground dark:text-white">{totalAwards}</p>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
                {totalAwards === 1 ? 'Premiação' : 'Premiações'}
              </p>
            </div>

            <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-lg border border-gray-200 dark:border-[rgba(255,255,255,0.1)]">
              <div className="flex items-center gap-2 mb-2">
                <AwardIcon className="w-5 h-5 text-purple-500" />
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Pontos</p>
              </div>
              <p className="text-2xl text-foreground dark:text-white">{totalPoints}</p>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Total acumulado</p>
            </div>

            <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-lg border border-gray-200 dark:border-[rgba(255,255,255,0.1)]">
              <div className="flex items-center gap-2 mb-2">
                <Medal className="w-5 h-5 text-purple-500" />
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Média</p>
              </div>
              <p className="text-2xl text-foreground dark:text-white">{averagePoints}</p>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Pontos/premiação</p>
            </div>

            <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-lg border border-gray-200 dark:border-[rgba(255,255,255,0.1)]">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Campeão</p>
              </div>
              <p className="text-2xl text-foreground dark:text-white">
                {placementCounts['Campeão'] || 0}
              </p>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
                {(placementCounts['Campeão'] || 0) === 1 ? 'vez' : 'vezes'}
              </p>
            </div>
          </div>

          {/* Resumo de Colocações */}
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(placementCounts).map(([type, count]) => (
              <div
                key={type}
                className={`${getPlacementColor(type)} px-3 py-1.5 rounded-full flex items-center gap-2 text-sm`}
              >
                {getPlacementIcon(type)}
                <span>{type}: {count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tabela de Premiações */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-[rgba(255,255,255,0.1)]">
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground dark:text-[#99a1af]">
                    Data
                  </th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground dark:text-[#99a1af]">
                    Evento
                  </th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground dark:text-[#99a1af]">
                    Local
                  </th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground dark:text-[#99a1af]">
                    Categoria
                  </th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground dark:text-[#99a1af]">
                    Colocação
                  </th>
                  <th className="text-right py-3 px-4 text-sm text-muted-foreground dark:text-[#99a1af]">
                    Pontos
                  </th>
                </tr>
              </thead>
              <tbody>
                {awards.map((award) => {
                  const [year, month, day] = award.date.split('-');
                  const formattedDate = `${day}/${month}/${year}`;
                  
                  return (
                    <tr
                      key={award.id}
                      className="border-b border-gray-100 dark:border-[rgba(255,255,255,0.05)] hover:bg-gray-50 dark:hover:bg-[#0d0d0d] transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-sm text-foreground dark:text-white">
                          <Calendar className="w-4 h-4 text-muted-foreground dark:text-[#99a1af]" />
                          {formattedDate}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-foreground dark:text-white">
                          {award.eventName}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-[#99a1af]">
                          <MapPin className="w-4 h-4" />
                          {award.location}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-foreground dark:text-white">
                          {award.category}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${getPlacementColor(award.placementType)}`}>
                          {getPlacementIcon(award.placementType)}
                          {award.placement}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="text-sm text-foreground dark:text-white font-medium">
                          {award.points || '-'}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer com Ações */}
        <div className="p-6 border-t border-gray-200 dark:border-[rgba(255,255,255,0.1)] bg-gray-50 dark:bg-[#0d0d0d] flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-[#2a2a2a] text-foreground dark:text-white border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg hover:bg-gray-50 dark:hover:bg-[#3a3a3a] transition-colors flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Exportar Relatório (PDF)
          </button>
        </div>
      </div>
      
      {/* Modal de Registro */}
      {showRegisterModal && (
        <RegisterAwardModal
          animalName={animalName}
          onClose={() => setShowRegisterModal(false)}
          onSave={(data) => {
            console.log('Nova premiação:', data);
            // Em produção, salvar no backend
            setShowRegisterModal(false);
          }}
        />
      )}
    </div>
  );
}