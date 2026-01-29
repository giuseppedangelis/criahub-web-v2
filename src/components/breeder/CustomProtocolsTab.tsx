import { Plus, Search, Calendar, Clock, CheckCircle2, AlertCircle, Edit, Trash2, Copy, PlayCircle, FileText, Bell } from 'lucide-react';
import { useState } from 'react';
import { CreateProtocolModal, ProtocolFormData } from './CreateProtocolModal';
import { ProtocolTemplatesModal } from './ProtocolTemplatesModal';
import { ApplyProtocolModal } from './ApplyProtocolModal';
import { ActiveProtocolsModal } from './ActiveProtocolsModal';
import { NativeSelect } from '../ui/native-select';

interface Protocol {
  id: number;
  name: string;
  type: 'TE' | 'IATF' | 'Aspiração Folicular' | 'Personalizado';
  description: string;
  steps: ProtocolStep[];
  totalDays: number;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
}

interface ProtocolStep {
  id: number;
  name: string;
  dayOffset: number;
  description: string;
  type: 'Exame' | 'Aplicação' | 'Procedimento' | 'Coleta';
}

interface CustomProtocolsTabProps {
  onCreateProtocol?: () => void;
}

export function CustomProtocolsTab({ onCreateProtocol }: CustomProtocolsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'TE' | 'IATF' | 'Aspiração Folicular' | 'Personalizado'>('all');
  
  // Estados dos modais
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [protocolToDelete, setProtocolToDelete] = useState<number | null>(null);
  const [protocols, setProtocols] = useState<Protocol[]>([]);

  // Dados mockados de protocolos
  const mockProtocols: Protocol[] = [
    {
      id: 1,
      name: 'Protocolo TE Completo',
      type: 'TE',
      description: 'Protocolo padrão de transferência de embrião com sincronização completa',
      steps: [
        { id: 1, name: 'Aplicação de Progesterona', dayOffset: 0, description: 'Inserção de dispositivo intravaginal', type: 'Aplicação' },
        { id: 2, name: 'Aplicação de Benzoato de Estradiol', dayOffset: 0, description: '2mg IM', type: 'Aplicação' },
        { id: 3, name: 'Aplicação de eCG', dayOffset: 8, description: '300-400 UI IM', type: 'Aplicação' },
        { id: 4, name: 'Aplicação de Prostaglandina', dayOffset: 8, description: 'Retirada do dispositivo', type: 'Aplicação' },
        { id: 5, name: 'Aplicação de Cipionato de Estradiol', dayOffset: 9, description: '1mg IM', type: 'Aplicação' },
        { id: 6, name: 'Transferência de Embrião', dayOffset: 16, description: 'Inovulação do embrião', type: 'Procedimento' },
        { id: 7, name: 'Diagnóstico de Gestação', dayOffset: 30, description: 'Ultrassom para confirmar gestação', type: 'Exame' },
      ],
      totalDays: 30,
      isActive: true,
      usageCount: 24,
      createdAt: '2024-10-15',
    },
    {
      id: 2,
      name: 'IATF - Inseminação Artificial em Tempo Fixo',
      type: 'IATF',
      description: 'Protocolo de sincronização para inseminação em horário pré-determinado',
      steps: [
        { id: 1, name: 'Aplicação de GnRH', dayOffset: 0, description: '100mcg IM', type: 'Aplicação' },
        { id: 2, name: 'Exame Ultrassonográfico', dayOffset: 7, description: 'Avaliar desenvolvimento folicular', type: 'Exame' },
        { id: 3, name: 'Aplicação de Prostaglandina', dayOffset: 7, description: 'Indução de luteólise', type: 'Aplicação' },
        { id: 4, name: 'Aplicação de GnRH', dayOffset: 9, description: 'Indução de ovulação', type: 'Aplicação' },
        { id: 5, name: 'Inseminação Artificial', dayOffset: 10, description: 'IA em tempo fixo', type: 'Procedimento' },
        { id: 6, name: 'Coleta de Embrião', dayOffset: 18, description: '8 dias pós-IA', type: 'Coleta' },
      ],
      totalDays: 18,
      isActive: true,
      usageCount: 18,
      createdAt: '2024-09-20',
    },
    {
      id: 3,
      name: 'Aspiração Folicular OPU',
      type: 'Aspiração Folicular',
      description: 'Protocolo de aspiração folicular guiada por ultrassom (OPU)',
      steps: [
        { id: 1, name: 'Exame Ultrassonográfico', dayOffset: 0, description: 'Mapeamento folicular inicial', type: 'Exame' },
        { id: 2, name: 'Aplicação de FSH', dayOffset: 0, description: 'Estimulação ovariana', type: 'Aplicação' },
        { id: 3, name: 'Aplicação de FSH', dayOffset: 1, description: 'Dose de manutenção', type: 'Aplicação' },
        { id: 4, name: 'Aplicação de hCG', dayOffset: 2, description: 'Maturação final', type: 'Aplicação' },
        { id: 5, name: 'Aspiração Folicular (OPU)', dayOffset: 3, description: 'Coleta de oócitos via OPU', type: 'Coleta' },
        { id: 6, name: 'Fecundação in vitro', dayOffset: 3, description: 'FIV dos oócitos coletados', type: 'Procedimento' },
      ],
      totalDays: 3,
      isActive: true,
      usageCount: 12,
      createdAt: '2024-11-01',
    },
    {
      id: 4,
      name: 'Protocolo P4 Gestacional',
      type: 'Personalizado',
      description: 'Série de aplicações de progesterona durante gestação inicial',
      steps: [
        { id: 1, name: 'Aplicação P4 - 1ª', dayOffset: 0, description: 'Início do suporte gestacional', type: 'Aplicação' },
        { id: 2, name: 'Aplicação P4 - 2ª', dayOffset: 10, description: 'Manutenção gestacional', type: 'Aplicação' },
        { id: 3, name: 'Aplicação P4 - 3ª', dayOffset: 20, description: 'Manutenção gestacional', type: 'Aplicação' },
        { id: 4, name: 'Aplicação P4 - 4ª', dayOffset: 30, description: 'Manutenção gestacional', type: 'Aplicação' },
      ],
      totalDays: 30,
      isActive: false,
      usageCount: 8,
      createdAt: '2024-08-10',
    },
  ];

  // Filtrar protocolos
  const filteredProtocols = mockProtocols.filter((protocol) => {
    const matchesSearch = protocol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         protocol.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || protocol.type === filterType;
    return matchesSearch && matchesType;
  });

  // Handlers
  const handleCreateProtocol = () => {
    setShowCreateModal(true);
  };

  const handleApplyProtocol = (protocol: Protocol) => {
    setSelectedProtocol(protocol);
    setShowApplyModal(true);
  };

  const handleEditProtocol = (protocol: Protocol) => {
    setSelectedProtocol(protocol);
    setShowCreateModal(true);
  };

  const handleCopyProtocol = (protocol: Protocol) => {
    console.log('Copiar protocolo:', protocol.name);
    // TODO: Implementar lógica de cópia
  };

  const handleDeleteProtocol = (protocolId: number) => {
    setProtocolToDelete(protocolId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (protocolToDelete !== null) {
      console.log('Excluir protocolo:', protocolToDelete);
      // TODO: Implementar lógica de exclusão
      setShowDeleteConfirm(false);
      setProtocolToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setProtocolToDelete(null);
  };

  const handleSaveProtocol = (data: ProtocolFormData) => {
    console.log('Salvar protocolo:', data);
    setShowCreateModal(false);
    setSelectedProtocol(null);
    // TODO: Implementar lógica de salvamento
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'TE':
        return 'bg-purple-100 dark:bg-gray-800/50 text-purple-700 dark:text-gray-300 border-purple-200 dark:border-gray-700';
      case 'IATF':
        return 'bg-purple-100 dark:bg-gray-800/50 text-purple-700 dark:text-gray-300 border-purple-200 dark:border-gray-700';
      case 'Aspiração Folicular':
        return 'bg-green-100 dark:bg-gray-800/50 text-green-700 dark:text-gray-300 border-green-200 dark:border-gray-700';
      default:
        return 'bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  const getStepTypeIcon = (type: string) => {
    switch (type) {
      case 'Exame':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'Aplicação':
        return <AlertCircle className="w-5 h-5" />;
      case 'Procedimento':
        return <Plus className="w-5 h-5" />;
      case 'Coleta':
        return <Bell className="w-5 h-5" />;
      default:
        return <Calendar className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header com Estatísticas */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-[rgba(255,255,255,0.1)] p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
          <div>
            <h3 className="text-xl text-foreground dark:text-white mb-2">Protocolos Personalizados</h3>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
              Crie e gerencie protocolos reprodutivos customizados para seu haras
            </p>
          </div>
          <button 
            onClick={handleCreateProtocol}
            className="w-full sm:w-auto px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Novo Protocolo
          </button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-[#0d0d0d] rounded-lg p-4 border border-gray-200 dark:border-[rgba(255,255,255,0.1)]">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-muted-foreground dark:text-[#99a1af]" />
              <span className="text-sm text-muted-foreground dark:text-[#99a1af]">Total</span>
            </div>
            <p className="text-2xl text-foreground dark:text-white font-semibold">{mockProtocols.length}</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-[#0d0d0d] rounded-lg p-4 border border-gray-200 dark:border-[rgba(255,255,255,0.1)]">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-gray-400" />
              <span className="text-sm text-muted-foreground dark:text-[#99a1af]">Ativos</span>
            </div>
            <p className="text-2xl text-foreground dark:text-white font-semibold">
              {mockProtocols.filter(p => p.isActive).length}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-[#0d0d0d] rounded-lg p-4 border border-gray-200 dark:border-[rgba(255,255,255,0.1)]">
            <div className="flex items-center gap-2 mb-2">
              <PlayCircle className="w-4 h-4 text-purple-600 dark:text-gray-400" />
              <span className="text-sm text-muted-foreground dark:text-[#99a1af]">Em Uso</span>
            </div>
            <p className="text-2xl text-foreground dark:text-white font-semibold">
              {mockProtocols.reduce((sum, p) => sum + p.usageCount, 0)}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-[#0d0d0d] rounded-lg p-4 border border-gray-200 dark:border-[rgba(255,255,255,0.1)]">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-purple-600 dark:text-gray-400" />
              <span className="text-sm text-muted-foreground dark:text-[#99a1af]">Templates</span>
            </div>
            <p className="text-2xl text-foreground dark:text-white font-semibold">3</p>
          </div>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-[rgba(255,255,255,0.1)] p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Busca */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground dark:text-[#99a1af]" />
            <input
              type="text"
              placeholder="Buscar protocolos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#0d0d0d] border border-gray-200 dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
            />
          </div>

          {/* Filtro de Tipo */}
          <div className="lg:w-64">
            <NativeSelect
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
            >
              <option value="all">Todos os Tipos</option>
              <option value="TE">TE - Transferência de Embrião</option>
              <option value="IATF">IATF - Inseminação Artificial</option>
              <option value="Aspiração Folicular">Aspiração Folicular</option>
              <option value="Personalizado">Personalizado</option>
            </NativeSelect>
          </div>
        </div>
      </div>

      {/* Lista de Protocolos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProtocols.map((protocol) => (
          <div
            key={protocol.id}
            className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-[rgba(255,255,255,0.1)] hover:border-primary dark:hover:border-white/40 transition-all overflow-hidden"
          >
            {/* Header do Card */}
            <div className="p-6 border-b border-gray-200 dark:border-[rgba(255,255,255,0.1)]">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-lg text-foreground dark:text-white font-medium">
                      {protocol.name}
                    </h4>
                    {protocol.isActive && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-gray-800/50 text-green-700 dark:text-gray-300 rounded text-xs">
                        <CheckCircle2 className="w-3 h-3" />
                        Ativo
                      </span>
                    )}
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs border ${getTypeColor(protocol.type)}`}>
                    {protocol.type}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-3">
                {protocol.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground dark:text-[#99a1af]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {protocol.totalDays} dias
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {protocol.steps.length} etapas
                </span>
                <span className="flex items-center gap-1">
                  <PlayCircle className="w-3 h-3" />
                  {protocol.usageCount} usos
                </span>
              </div>
            </div>

            {/* Etapas do Protocolo */}
            <div className="p-6">
              <h5 className="text-sm text-foreground dark:text-white font-medium mb-3">
                Etapas do Protocolo
              </h5>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {protocol.steps.map((step, idx) => (
                  <div
                    key={step.id}
                    className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-[#0d0d0d] rounded-lg border border-gray-200 dark:border-[rgba(255,255,255,0.1)]"
                  >
                    <div className="w-8 h-8 bg-gray-100 dark:bg-[#2a2a2a] rounded-full flex items-center justify-center flex-shrink-0 text-foreground dark:text-white">
                      {getStepTypeIcon(step.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm text-foreground dark:text-white font-medium truncate">
                          {step.name}
                        </p>
                        <span className="text-xs text-muted-foreground dark:text-[#99a1af] whitespace-nowrap">
                          Dia {step.dayOffset}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ações */}
            <div className="p-4 bg-gray-50 dark:bg-[#0d0d0d] border-t border-gray-200 dark:border-[rgba(255,255,255,0.1)]">
              <button 
                onClick={() => handleApplyProtocol(protocol)}
                className="w-full mb-3 px-3 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm"
              >
                <PlayCircle className="w-4 h-4" />
                Aplicar Protocolo
              </button>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleEditProtocol(protocol)}
                  className="flex-1 px-3 py-2 bg-white dark:bg-[#2a2a2a] text-foreground dark:text-white border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg hover:bg-gray-50 dark:hover:bg-[#3a3a3a] transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
                <button 
                  onClick={() => handleCopyProtocol(protocol)}
                  className="px-3 py-2 bg-white dark:bg-[#2a2a2a] text-foreground dark:text-white border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg hover:bg-gray-50 dark:hover:bg-[#3a3a3a] transition-colors"
                  title="Copiar"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteProtocol(protocol.id)}
                  className="px-3 py-2 bg-white dark:bg-[#2a2a2a] text-red-600 dark:text-red-400 border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg hover:bg-gray-50 dark:hover:bg-[#3a3a3a] transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProtocols.length === 0 && (
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-[rgba(255,255,255,0.1)] p-12 text-center">
          <FileText className="w-16 h-16 text-muted-foreground dark:text-[#99a1af] mx-auto mb-4" />
          <h3 className="text-lg text-foreground dark:text-white mb-2">Nenhum protocolo encontrado</h3>
          <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-6">
            {searchTerm || filterType !== 'all'
              ? 'Tente ajustar os filtros de busca'
              : 'Crie seu primeiro protocolo personalizado'}
          </p>
          {!searchTerm && filterType === 'all' && (
            <button 
              onClick={handleCreateProtocol}
              className="px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Criar Primeiro Protocolo
            </button>
          )}
        </div>
      )}

      {/* Modais */}
      {showCreateModal && (
        <CreateProtocolModal
          protocol={selectedProtocol}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedProtocol(null);
          }}
          onSave={handleSaveProtocol}
        />
      )}

      {showApplyModal && selectedProtocol && (
        <ApplyProtocolModal
          protocol={selectedProtocol}
          onClose={() => {
            setShowApplyModal(false);
            setSelectedProtocol(null);
          }}
          onApply={(data) => {
            console.log('Aplicar protocolo:', data);
            setShowApplyModal(false);
            setSelectedProtocol(null);
          }}
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-[rgba(255,255,255,0.1)] p-6 text-center">
            <h3 className="text-lg text-foreground dark:text-white mb-4">Confirmar Exclusão</h3>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-6">
              Tem certeza que deseja excluir este protocolo?
            </p>
            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 dark:bg-red-400 text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity"
              >
                Excluir
              </button>
              <button 
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-50 dark:bg-[#0d0d0d] text-foreground dark:text-white border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg hover:bg-gray-50 dark:hover:bg-[#3a3a3a] transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}