import { useState } from 'react';
import { Plus, Eye, Calendar, AlertCircle } from 'lucide-react';
import { NativeSelect } from '../ui/native-select';
import { ConfirmPregnancyModal } from './ConfirmPregnancyModal';

interface Gestacao {
  id: number;
  receptora: string;
  maeBiologica: string;
  garanhao: string;
  dataCobertura: string;
  dataConfirmacao: string;
  diasGestacao: number;
  dataPrevistaParto: string;
  status: 'confirmada' | 'em-acompanhamento' | 'abortada' | 'parida';
  veterinario: string;
  isTransferencia: boolean;
  observacoes?: string;
}

export function GestationsTab() {
  const [selectedAnimal, setSelectedAnimal] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedGestacao, setSelectedGestacao] = useState<Gestacao | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAnimalForConfirmation, setSelectedAnimalForConfirmation] = useState('Selecione um animal');

  const gestacoes: Gestacao[] = [
    {
      id: 1,
      receptora: 'Estrela da Manhã',
      maeBiologica: 'Lua Cheia',
      garanhao: 'Trovão Negro',
      dataCobertura: '15/08/2024',
      dataConfirmacao: '10/09/2024',
      diasGestacao: 94,
      dataPrevistaParto: '20/06/2025',
      status: 'confirmada',
      veterinario: 'Dr. João Silva',
      isTransferencia: true,
      observacoes: 'Transferência de embrião realizada com sucesso',
    },
    {
      id: 2,
      receptora: 'Bella Vista',
      maeBiologica: 'Bella Vista',
      garanhao: 'Imperador',
      dataCobertura: '20/09/2024',
      dataConfirmacao: '15/10/2024',
      diasGestacao: 58,
      dataPrevistaParto: '25/07/2025',
      status: 'em-acompanhamento',
      veterinario: 'Dr. Maria Santos',
      isTransferencia: false,
    },
    {
      id: 3,
      receptora: 'Íris do Campo',
      maeBiologica: 'Íris do Campo',
      garanhao: 'Sol Nascente',
      dataCobertura: '10/10/2024',
      dataConfirmacao: '05/11/2024',
      diasGestacao: 38,
      dataPrevistaParto: '15/08/2025',
      status: 'em-acompanhamento',
      veterinario: 'Dr. Carlos Lima',
      isTransferencia: false,
    },
    {
      id: 4,
      receptora: 'Pérola',
      maeBiologica: 'Diamante Rosa',
      garanhao: 'Trovão Negro',
      dataCobertura: '05/07/2024',
      dataConfirmacao: '01/08/2024',
      diasGestacao: 134,
      dataPrevistaParto: '15/04/2025',
      status: 'parida',
      veterinario: 'Dr. João Silva',
      isTransferencia: true,
      observacoes: 'Parto realizado em 12/12/2024. Potra saudável.',
    },
    {
      id: 5,
      receptora: 'Flor da Serra',
      maeBiologica: 'Flor da Serra',
      garanhao: 'Imperador',
      dataCobertura: '15/06/2024',
      dataConfirmacao: '10/07/2024',
      diasGestacao: 75,
      dataPrevistaParto: '20/04/2025',
      status: 'abortada',
      veterinario: 'Dr. Maria Santos',
      isTransferencia: false,
      observacoes: 'Aborto ocorrido em 28/08/2024 (75 dias)',
    },
  ];

  const statusConfig = {
    'confirmada': { label: 'Confirmada', color: 'bg-emerald-500', textColor: 'text-white' },
    'em-acompanhamento': { label: 'Em Acompanhamento', color: 'bg-amber-500', textColor: 'text-white' },
    'abortada': { label: 'Abortada', color: 'bg-[#e74c3c]', textColor: 'text-white' },
    'parida': { label: 'Parida', color: 'bg-[#8b5cf6]', textColor: 'text-white' },
  };

  const filteredGestacoes = gestacoes.filter((gestacao) => {
    if (selectedAnimal && !gestacao.receptora.toLowerCase().includes(selectedAnimal.toLowerCase()) && 
        !gestacao.maeBiologica.toLowerCase().includes(selectedAnimal.toLowerCase())) {
      return false;
    }
    if (selectedStatus && gestacao.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header com botão de ação */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h3 className="text-xl text-foreground dark:text-white">Gestações Registradas</h3>
          <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-1">
            {filteredGestacoes.length} {filteredGestacoes.length === 1 ? 'gestação' : 'gestações'} registrada(s)
          </p>
        </div>
        <button
          onClick={() => setShowConfirmModal(true)}
          className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-white text-[#1a1a1a] rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Confirmar Gestação
        </button>
      </div>

      {/* Filtros específicos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-muted-foreground dark:text-[#99a1af] mb-2 block">Animal</label>
          <NativeSelect
            value={selectedAnimal}
            onChange={(e) => setSelectedAnimal(e.target.value)}
            className="w-full h-10 bg-muted dark:bg-[#3a3a3a] border-0 text-foreground dark:text-white rounded-lg"
          >
            <option value="">Todos os animais</option>
            <option value="estrela">Estrela da Manhã</option>
            <option value="bella">Bella Vista</option>
            <option value="iris">Íris do Campo</option>
            <option value="perola">Pérola</option>
            <option value="flor">Flor da Serra</option>
          </NativeSelect>
        </div>

        <div>
          <label className="text-sm text-muted-foreground dark:text-[#99a1af] mb-2 block">Status</label>
          <NativeSelect
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full h-10 bg-muted dark:bg-[#3a3a3a] border-0 text-foreground dark:text-white rounded-lg"
          >
            <option value="">Todos os status</option>
            <option value="confirmada">Confirmada</option>
            <option value="em-acompanhamento">Em Acompanhamento</option>
            <option value="abortada">Abortada</option>
            <option value="parida">Parida</option>
          </NativeSelect>
        </div>

        <div>
          <label className="text-sm text-muted-foreground dark:text-[#99a1af] mb-2 block">Período</label>
          <NativeSelect
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-full h-10 bg-muted dark:bg-[#3a3a3a] border-0 text-foreground dark:text-white rounded-lg"
          >
            <option value="">Todos os períodos</option>
            <option value="30">Últimos 30 dias</option>
            <option value="60">Últimos 60 dias</option>
            <option value="90">Últimos 90 dias</option>
            <option value="180">Últimos 6 meses</option>
            <option value="365">Último ano</option>
          </NativeSelect>
        </div>
      </div>

      {/* Lista de Gestações */}
      {filteredGestacoes.length === 0 ? (
        <div className="bg-muted dark:bg-[#0d0d0d] rounded-2xl p-12 text-center border border-border dark:border-[rgba(255,255,255,0.1)]">
          <AlertCircle className="w-12 h-12 text-muted-foreground dark:text-[#99a1af] mx-auto mb-4" />
          <p className="text-foreground dark:text-white mb-2">Nenhuma gestação encontrada</p>
          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
            Tente ajustar os filtros ou confirme uma nova gestação
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGestacoes.map((gestacao) => (
            <GestacaoCard
              key={gestacao.id}
              gestacao={gestacao}
              statusConfig={statusConfig}
              onViewDetails={() => {
                setSelectedGestacao(gestacao);
                setShowDetailsModal(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Modal Confirmar Gestação */}
      {showConfirmModal && (
        <ConfirmPregnancyModal 
          animalName="Nova Gestação" 
          onClose={() => setShowConfirmModal(false)}
          onConfirm={(data) => {
            console.log('Gestação confirmada:', data);
            setShowConfirmModal(false);
          }}
        />
      )}

      {/* Modal Detalhes da Gestação */}
      {showDetailsModal && selectedGestacao && (
        <GestacaoDetailsModal
          gestacao={selectedGestacao}
          statusConfig={statusConfig}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedGestacao(null);
          }}
        />
      )}
    </div>
  );
}

interface GestacaoCardProps {
  gestacao: Gestacao;
  statusConfig: any;
  onViewDetails: () => void;
}

function GestacaoCard({ gestacao, statusConfig, onViewDetails }: GestacaoCardProps) {
  const config = statusConfig[gestacao.status];

  return (
    <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)] space-y-4 hover:border-[#3a3a3a] transition-all">
      {/* Header com Status e Badge Transferência */}
      <div className="flex items-start justify-between gap-2">
        <span className={`${config.color} ${config.textColor} px-3 py-1 rounded-md text-xs font-medium`}>
          {config.label}
        </span>
        {gestacao.isTransferencia && (
          <span className="bg-[#3a3a3a] text-white px-3 py-1 rounded-md text-xs font-medium border border-[rgba(255,255,255,0.2)]">
            TRANSFERÊNCIA
          </span>
        )}
      </div>

      {/* Informações principais */}
      <div className="space-y-3">
        <div>
          <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Receptora</p>
          <p className="text-foreground dark:text-white">{gestacao.receptora}</p>
        </div>

        {gestacao.isTransferencia && (
          <div>
            <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Mãe Biológica</p>
            <p className="text-foreground dark:text-white">{gestacao.maeBiologica}</p>
          </div>
        )}

        <div>
          <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Garanhão</p>
          <p className="text-foreground dark:text-white">{gestacao.garanhao}</p>
        </div>

        {/* Linha divisória */}
        <div className="border-t border-border dark:border-[rgba(255,255,255,0.1)] pt-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground dark:text-[#99a1af]">Dias de gestação:</span>
            <span className="text-sm text-foreground dark:text-white font-medium">{gestacao.diasGestacao} dias</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground dark:text-[#99a1af]">Previsão de parto:</span>
            <span className="text-sm text-foreground dark:text-white">{gestacao.dataPrevistaParto}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground dark:text-[#99a1af]">Veterinário:</span>
            <span className="text-sm text-foreground dark:text-white">{gestacao.veterinario}</span>
          </div>
        </div>
      </div>

      {/* Botão Ver Detalhes */}
      <button
        onClick={onViewDetails}
        className="w-full px-4 py-2 border border-border dark:border-[#333333] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors flex items-center justify-center gap-2"
      >
        <Eye className="w-4 h-4" />
        Ver Detalhes
      </button>
    </div>
  );
}

interface GestacaoDetailsModalProps {
  gestacao: Gestacao;
  statusConfig: any;
  onClose: () => void;
}

function GestacaoDetailsModal({ gestacao, statusConfig, onClose }: GestacaoDetailsModalProps) {
  const config = statusConfig[gestacao.status];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border dark:border-[rgba(255,255,255,0.1)]">
        {/* Header */}
        <div className="sticky top-0 bg-card dark:bg-[#1a1a1a] border-b border-border dark:border-[rgba(255,255,255,0.1)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl text-foreground dark:text-white">Detalhes da Gestação</h2>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-1">ID: #{gestacao.id}</p>
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
        <div className="p-6 space-y-6">
          {/* Status e Badge */}
          <div className="flex gap-3">
            <span className={`${config.color} ${config.textColor} px-4 py-2 rounded-lg text-sm font-medium`}>
              {config.label}
            </span>
            {gestacao.isTransferencia && (
              <span className="bg-[#3a3a3a] text-white px-4 py-2 rounded-lg text-sm font-medium border border-[rgba(255,255,255,0.2)]">
                TRANSFERÊNCIA DE EMBRIÃO
              </span>
            )}
          </div>

          {/* Informações dos Animais */}
          <div className="bg-muted dark:bg-[#0d0d0d] rounded-xl p-4 space-y-4">
            <h3 className="text-foreground dark:text-white font-medium">Informações dos Animais</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground dark:text-[#99a1af] block mb-1">Receptora (Égua gestante)</label>
                <p className="text-foreground dark:text-white">{gestacao.receptora}</p>
              </div>

              <div>
                <label className="text-xs text-muted-foreground dark:text-[#99a1af] block mb-1">Mãe Biológica</label>
                <p className="text-foreground dark:text-white">{gestacao.maeBiologica}</p>
              </div>

              <div>
                <label className="text-xs text-muted-foreground dark:text-[#99a1af] block mb-1">Garanhão (Pai)</label>
                <p className="text-foreground dark:text-white">{gestacao.garanhao}</p>
              </div>

              <div>
                <label className="text-xs text-muted-foreground dark:text-[#99a1af] block mb-1">Veterinário Responsável</label>
                <p className="text-foreground dark:text-white">{gestacao.veterinario}</p>
              </div>
            </div>
          </div>

          {/* Datas e Prazos */}
          <div className="bg-muted dark:bg-[#0d0d0d] rounded-xl p-4 space-y-4">
            <h3 className="text-foreground dark:text-white font-medium flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Datas e Prazos
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground dark:text-[#99a1af] block mb-1">Data da Cobertura</label>
                <p className="text-foreground dark:text-white">{gestacao.dataCobertura}</p>
              </div>

              <div>
                <label className="text-xs text-muted-foreground dark:text-[#99a1af] block mb-1">Confirmação da Gestação</label>
                <p className="text-foreground dark:text-white">{gestacao.dataConfirmacao}</p>
              </div>

              <div>
                <label className="text-xs text-muted-foreground dark:text-[#99a1af] block mb-1">Dias de Gestação</label>
                <p className="text-foreground dark:text-white text-lg font-medium">{gestacao.diasGestacao} dias</p>
              </div>

              <div>
                <label className="text-xs text-muted-foreground dark:text-[#99a1af] block mb-1">Previsão de Parto</label>
                <p className="text-foreground dark:text-white text-lg font-medium">{gestacao.dataPrevistaParto}</p>
              </div>
            </div>

            {/* Barra de progresso */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-muted-foreground dark:text-[#99a1af] mb-2">
                <span>Progresso da gestação</span>
                <span>{Math.round((gestacao.diasGestacao / 335) * 100)}%</span>
              </div>
              <div className="w-full bg-muted dark:bg-[#3a3a3a] rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min((gestacao.diasGestacao / 335) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af] mt-1">
                Gestação normal: 320-350 dias (média 335 dias)
              </p>
            </div>
          </div>

          {/* Observações */}
          {gestacao.observacoes && (
            <div className="bg-muted dark:bg-[#0d0d0d] rounded-xl p-4">
              <h3 className="text-foreground dark:text-white font-medium mb-2">Observações</h3>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af]">{gestacao.observacoes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card dark:bg-[#1a1a1a] border-t border-border dark:border-[rgba(255,255,255,0.1)] p-6">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-border dark:border-[#333333] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
            >
              Fechar
            </button>
            <button
              className="flex-1 px-6 py-3 bg-white dark:bg-white text-[#1a1a1a] rounded-lg hover:opacity-90 transition-opacity"
            >
              Editar Informações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}