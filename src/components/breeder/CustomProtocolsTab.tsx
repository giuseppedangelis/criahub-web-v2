import { Plus, Search, Calendar, CheckCircle2, AlertCircle, Edit, Trash2, Copy, PlayCircle, FileText, Bell } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CreateProtocolModal, ProtocolFormData } from './CreateProtocolModal';
import { ApplyProtocolModal } from './ApplyProtocolModal';
import { NativeSelect } from '../ui/native-select';
import type { Animal, ReproductionProtocol, ReproductionProtocolApplication } from '@/types';

interface Protocol {
  id: string;
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
  id: string;
  name: string;
  dayOffset: number;
  description: string;
  type: 'Exame' | 'Aplicação' | 'Procedimento' | 'Coleta';
}

interface CustomProtocolsTabProps {
  protocols?: ReproductionProtocol[];
  applications?: ReproductionProtocolApplication[];
  animals?: Animal[];
  isLoading?: boolean;
  onCreateProtocol?: (data: ProtocolFormData) => Promise<void> | void;
  onUpdateProtocol?: (id: string, data: ProtocolFormData) => Promise<void> | void;
  onDeleteProtocol?: (id: string) => Promise<void> | void;
  onApplyProtocol?: (protocolId: string, data: any) => Promise<void> | void;
}

export function CustomProtocolsTab({
  protocols,
  applications,
  animals,
  isLoading,
  onCreateProtocol,
  onUpdateProtocol,
  onDeleteProtocol,
  onApplyProtocol,
}: CustomProtocolsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'TE' | 'IATF' | 'Aspiração Folicular' | 'Personalizado'>('all');
  
  // Estados dos modais
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [protocolToDelete, setProtocolToDelete] = useState<string | null>(null);

  const usageCountByProtocol = useMemo(() => {
    const map = new Map<string, number>();
    (applications || []).forEach((app) => {
      map.set(app.protocol_id, (map.get(app.protocol_id) || 0) + 1);
    });
    return map;
  }, [applications]);

  const protocolsFromBackend: Protocol[] = useMemo(() => {
    if (!protocols || protocols.length === 0) return [];
    return protocols.map((protocol) => {
      const steps = (protocol.steps || []).map((step) => ({
        id: step.id,
        name: step.name,
        dayOffset: step.day_offset,
        description: step.description || '',
        type: step.step_type as ProtocolStep['type'],
      }));

      const totalDays = protocol.total_days ?? (steps.length > 0 ? Math.max(...steps.map((step) => step.dayOffset)) : 0);

      return {
        id: protocol.id,
        name: protocol.name,
        type: protocol.type as Protocol['type'],
        description: protocol.description || '',
        steps,
        totalDays,
        isActive: protocol.is_active ?? true,
        usageCount: usageCountByProtocol.get(protocol.id) || 0,
        createdAt: protocol.created_at,
      };
    });
  }, [protocols, usageCountByProtocol]);

  const protocolList = protocolsFromBackend;

  // Filtrar protocolos
  const filteredProtocols = protocolList.filter((protocol) => {
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

  const handleDeleteProtocol = (protocolId: string) => {
    setProtocolToDelete(protocolId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (protocolToDelete !== null) {
      onDeleteProtocol?.(protocolToDelete);
      setShowDeleteConfirm(false);
      setProtocolToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setProtocolToDelete(null);
  };

  const handleSaveProtocol = async (data: ProtocolFormData) => {
    if (selectedProtocol) {
      await onUpdateProtocol?.(selectedProtocol.id, data);
    } else {
      await onCreateProtocol?.(data);
    }
    setShowCreateModal(false);
    setSelectedProtocol(null);
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
            <p className="text-2xl text-foreground dark:text-white font-semibold">{protocolList.length}</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-[#0d0d0d] rounded-lg p-4 border border-gray-200 dark:border-[rgba(255,255,255,0.1)]">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-gray-400" />
              <span className="text-sm text-muted-foreground dark:text-[#99a1af]">Ativos</span>
            </div>
            <p className="text-2xl text-foreground dark:text-white font-semibold">
              {protocolList.filter(p => p.isActive).length}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-[#0d0d0d] rounded-lg p-4 border border-gray-200 dark:border-[rgba(255,255,255,0.1)]">
            <div className="flex items-center gap-2 mb-2">
              <PlayCircle className="w-4 h-4 text-purple-600 dark:text-gray-400" />
              <span className="text-sm text-muted-foreground dark:text-[#99a1af]">Em Uso</span>
            </div>
            <p className="text-2xl text-foreground dark:text-white font-semibold">
              {protocolList.reduce((sum, p) => sum + p.usageCount, 0)}
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

      {isLoading ? (
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-[rgba(255,255,255,0.1)] p-12 text-center">
          <FileText className="w-16 h-16 text-muted-foreground dark:text-[#99a1af] mx-auto mb-4" />
          <h3 className="text-lg text-foreground dark:text-white mb-2">Carregando protocolos...</h3>
          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
            Buscando dados do banco.
          </p>
        </div>
      ) : (
        <>
          {/* Lista de Protocolos */}
          {filteredProtocols.length > 0 && (
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
                      {protocol.steps.map((step) => (
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
          )}

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
        </>
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
          animals={animals}
          onClose={() => {
            setShowApplyModal(false);
            setSelectedProtocol(null);
          }}
          onApply={(data) => {
            onApplyProtocol?.(selectedProtocol.id, data);
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
