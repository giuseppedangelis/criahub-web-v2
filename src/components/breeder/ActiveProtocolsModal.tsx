import { X, CheckCircle2, Clock, Calendar, AlertCircle, ChevronRight, Plus, Bell } from 'lucide-react';
import { useState } from 'react';

interface ActiveProtocolsModalProps {
  onClose: () => void;
}

interface ActiveProtocol {
  id: number;
  protocolName: string;
  animalName: string;
  startDate: string;
  currentDay: number;
  totalDays: number;
  progress: number;
  nextStep: {
    name: string;
    dayOffset: number;
    daysUntil: number;
  };
  completedSteps: number;
  totalSteps: number;
  status: 'on-track' | 'delayed' | 'attention';
  steps: ProtocolStep[];
}

interface ProtocolStep {
  id: number;
  name: string;
  dayOffset: number;
  type: 'Exame' | 'Aplicação' | 'Procedimento' | 'Coleta';
  description: string;
  completed: boolean;
  completedDate?: string;
  scheduled: boolean;
  scheduledDate?: string;
}

export function ActiveProtocolsModal({ onClose }: ActiveProtocolsModalProps) {
  const [selectedProtocol, setSelectedProtocol] = useState<number | null>(null);

  // Dados mockados de protocolos ativos
  const activeProtocols: ActiveProtocol[] = [
    {
      id: 1,
      protocolName: 'Protocolo TE Completo',
      animalName: 'Estrela da Manhã',
      startDate: '2024-12-05',
      currentDay: 5,
      totalDays: 30,
      progress: 17,
      nextStep: {
        name: 'Aplicação de eCG',
        dayOffset: 8,
        daysUntil: 3,
      },
      completedSteps: 2,
      totalSteps: 7,
      status: 'on-track',
      steps: [
        {
          id: 1,
          name: 'Aplicação de Progesterona',
          dayOffset: 0,
          type: 'Aplicação',
          description: 'Inserção de dispositivo intravaginal',
          completed: true,
          completedDate: '2024-12-05',
          scheduled: true,
          scheduledDate: '2024-12-05',
        },
        {
          id: 2,
          name: 'Aplicação de Benzoato de Estradiol',
          dayOffset: 0,
          type: 'Aplicação',
          description: '2mg IM',
          completed: true,
          completedDate: '2024-12-05',
          scheduled: true,
          scheduledDate: '2024-12-05',
        },
        {
          id: 3,
          name: 'Aplicação de eCG',
          dayOffset: 8,
          type: 'Aplicação',
          description: '300-400 UI IM',
          completed: false,
          scheduled: true,
          scheduledDate: '2024-12-13',
        },
        {
          id: 4,
          name: 'Aplicação de Prostaglandina',
          dayOffset: 8,
          type: 'Aplicação',
          description: 'Retirada do dispositivo',
          completed: false,
          scheduled: true,
          scheduledDate: '2024-12-13',
        },
        {
          id: 5,
          name: 'Aplicação de Cipionato de Estradiol',
          dayOffset: 9,
          type: 'Aplicação',
          description: '1mg IM',
          completed: false,
          scheduled: true,
          scheduledDate: '2024-12-14',
        },
        {
          id: 6,
          name: 'Transferência de Embrião',
          dayOffset: 16,
          type: 'Procedimento',
          description: 'Inovulação do embrião',
          completed: false,
          scheduled: true,
          scheduledDate: '2024-12-21',
        },
        {
          id: 7,
          name: 'Diagnóstico de Gestação',
          dayOffset: 30,
          type: 'Exame',
          description: 'Ultrassom',
          completed: false,
          scheduled: true,
          scheduledDate: '2025-01-04',
        },
      ],
    },
    {
      id: 2,
      protocolName: 'IATF - Inseminação em Tempo Fixo',
      animalName: 'Flor do Campo',
      startDate: '2024-12-08',
      currentDay: 2,
      totalDays: 18,
      progress: 11,
      nextStep: {
        name: 'Exame Ultrassonográfico',
        dayOffset: 7,
        daysUntil: 5,
      },
      completedSteps: 1,
      totalSteps: 6,
      status: 'on-track',
      steps: [
        {
          id: 1,
          name: 'Aplicação de GnRH',
          dayOffset: 0,
          type: 'Aplicação',
          description: '100mcg IM',
          completed: true,
          completedDate: '2024-12-08',
          scheduled: true,
          scheduledDate: '2024-12-08',
        },
        {
          id: 2,
          name: 'Exame Ultrassonográfico',
          dayOffset: 7,
          type: 'Exame',
          description: 'Avaliar desenvolvimento folicular',
          completed: false,
          scheduled: true,
          scheduledDate: '2024-12-15',
        },
        {
          id: 3,
          name: 'Aplicação de Prostaglandina',
          dayOffset: 7,
          type: 'Aplicação',
          description: 'Indução de luteólise',
          completed: false,
          scheduled: true,
          scheduledDate: '2024-12-15',
        },
        {
          id: 4,
          name: 'Aplicação de GnRH',
          dayOffset: 9,
          type: 'Aplicação',
          description: 'Indução de ovulação',
          completed: false,
          scheduled: true,
          scheduledDate: '2024-12-17',
        },
        {
          id: 5,
          name: 'Inseminação Artificial',
          dayOffset: 10,
          type: 'Procedimento',
          description: 'IA em tempo fixo',
          completed: false,
          scheduled: true,
          scheduledDate: '2024-12-18',
        },
        {
          id: 6,
          name: 'Coleta de Embrião',
          dayOffset: 18,
          type: 'Coleta',
          description: '8 dias pós-IA',
          completed: false,
          scheduled: true,
          scheduledDate: '2024-12-26',
        },
      ],
    },
    {
      id: 3,
      protocolName: 'Aspiração Folicular OPU',
      animalName: 'Lua Nova',
      startDate: '2024-12-09',
      currentDay: 1,
      totalDays: 3,
      progress: 33,
      nextStep: {
        name: 'Aplicação de FSH',
        dayOffset: 1,
        daysUntil: 0,
      },
      completedSteps: 2,
      totalSteps: 6,
      status: 'attention',
      steps: [
        {
          id: 1,
          name: 'Exame Ultrassonográfico',
          dayOffset: 0,
          type: 'Exame',
          description: 'Mapeamento folicular',
          completed: true,
          completedDate: '2024-12-09',
          scheduled: true,
          scheduledDate: '2024-12-09',
        },
        {
          id: 2,
          name: 'Aplicação de FSH',
          dayOffset: 0,
          type: 'Aplicação',
          description: 'Estimulação ovariana',
          completed: true,
          completedDate: '2024-12-09',
          scheduled: true,
          scheduledDate: '2024-12-09',
        },
        {
          id: 3,
          name: 'Aplicação de FSH',
          dayOffset: 1,
          type: 'Aplicação',
          description: 'Dose de manutenção',
          completed: false,
          scheduled: true,
          scheduledDate: '2024-12-10',
        },
        {
          id: 4,
          name: 'Aplicação de hCG',
          dayOffset: 2,
          type: 'Aplicação',
          description: 'Maturação final',
          completed: false,
          scheduled: true,
          scheduledDate: '2024-12-11',
        },
        {
          id: 5,
          name: 'Aspiração Folicular (OPU)',
          dayOffset: 3,
          type: 'Coleta',
          description: 'Coleta de oócitos',
          completed: false,
          scheduled: true,
          scheduledDate: '2024-12-12',
        },
        {
          id: 6,
          name: 'Fecundação in vitro',
          dayOffset: 3,
          type: 'Procedimento',
          description: 'FIV dos oócitos',
          completed: false,
          scheduled: true,
          scheduledDate: '2024-12-12',
        },
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-100 dark:bg-gray-800/50 text-green-700 dark:text-gray-300 border-green-200 dark:border-gray-700';
      case 'delayed':
        return 'bg-red-100 dark:bg-gray-800/50 text-red-700 dark:text-gray-300 border-red-200 dark:border-gray-700';
      case 'attention':
        return 'bg-yellow-100 dark:bg-gray-800/50 text-yellow-700 dark:text-gray-300 border-yellow-200 dark:border-gray-700';
      default:
        return 'bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'No Prazo';
      case 'delayed':
        return 'Atrasado';
      case 'attention':
        return 'Atenção';
      default:
        return status;
    }
  };

  const getStepIcon = (type: string) => {
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

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const selected = activeProtocols.find((p) => p.id === selectedProtocol);

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-[#1a1f2e] rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-[#2a3441] sticky top-0 bg-white dark:bg-[#1a1f2e] z-10">
          <div>
            <h3 className="text-xl text-foreground dark:text-white mb-1">Protocolos Ativos</h3>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
              {activeProtocols.length} protocolos em andamento
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a3441] rounded-lg transition-colors">
            <X className="w-5 h-5 text-foreground dark:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* Lista de Protocolos */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground dark:text-white mb-3">Protocolos em Andamento</h4>
            {activeProtocols.map((protocol) => (
              <button
                key={protocol.id}
                onClick={() => setSelectedProtocol(protocol.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  selectedProtocol === protocol.id
                    ? 'border-primary dark:border-white bg-primary/5 dark:bg-white/5'
                    : 'border-gray-200 dark:border-[#2a3441] hover:border-gray-300 dark:hover:border-[#3a4451]'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h5 className="text-foreground dark:text-white font-medium mb-1">{protocol.protocolName}</h5>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Animal: {protocol.animalName}</p>
                  </div>
                  {selectedProtocol === protocol.id && <ChevronRight className="w-5 h-5 text-primary dark:text-white flex-shrink-0" />}
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs border ${getStatusColor(protocol.status)}`}>
                    {getStatusLabel(protocol.status)}
                  </span>
                  <span className="text-xs text-muted-foreground dark:text-[#99a1af]">
                    Dia {protocol.currentDay}/{protocol.totalDays}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground dark:text-[#99a1af] mb-1">
                    <span>
                      {protocol.completedSteps}/{protocol.totalSteps} etapas
                    </span>
                    <span>{protocol.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-[#2a3441] rounded-full h-2">
                    <div
                      className="bg-primary dark:bg-white h-2 rounded-full transition-all"
                      style={{ width: `${protocol.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground dark:text-[#99a1af]">
                  <Clock className="w-3 h-3" />
                  <span>
                    Próximo: {protocol.nextStep.name} (
                    {protocol.nextStep.daysUntil === 0
                      ? 'Hoje'
                      : `em ${protocol.nextStep.daysUntil} ${protocol.nextStep.daysUntil === 1 ? 'dia' : 'dias'}`}
                    )
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Timeline Detalhada */}
          {selected ? (
            <div className="bg-gray-50 dark:bg-[#151a26] rounded-xl p-6 border border-gray-200 dark:border-[#2a3441]">
              <div className="mb-6">
                <h4 className="text-lg text-foreground dark:text-white font-medium mb-1">{selected.protocolName}</h4>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Timeline de Execução</p>
              </div>

              <div className="space-y-4">
                {selected.steps.map((step, idx) => {
                  const isNext = idx === selected.completedSteps;
                  const isPast = idx < selected.completedSteps;
                  const isFuture = idx > selected.completedSteps;

                  return (
                    <div key={step.id} className="relative">
                      {/* Linha de Conexão */}
                      {idx < selected.steps.length - 1 && (
                        <div
                          className={`absolute left-5 top-12 w-0.5 h-full ${\
                            isPast ? 'bg-gray-400 dark:bg-gray-600' : 'bg-gray-300 dark:bg-[#2a3441]'
                          }`}
                        />
                      )}

                      <div className="flex items-start gap-4 relative">
                        {/* Ícone de Status */}
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${\
                            step.completed
                              ? 'bg-gray-500 dark:bg-gray-600'
                              : isNext
                              ? 'bg-primary dark:bg-white border-4 border-primary/20 dark:border-white/20'
                              : 'bg-gray-300 dark:bg-[#2a3441]'
                          }`}
                        >
                          {step.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          ) : isNext ? (
                            <Clock className="w-5 h-5 text-white dark:text-black" />
                          ) : (
                            <span className="text-white dark:text-white text-xs font-medium">{idx + 1}</span>
                          )}
                        </div>

                        {/* Conteúdo */}
                        <div className="flex-1 pb-4">
                          <div
                            className={`p-4 rounded-lg border ${
                              isNext
                                ? 'bg-amber-50 dark:bg-[#151a26] border-amber-200 dark:border-[#2a3441]'
                                : step.completed
                                ? 'bg-green-50 dark:bg-[#151a26] border-green-200 dark:border-[#2a3441]'
                                : 'bg-gray-50 dark:bg-[#151a26] border-gray-200 dark:border-[#2a3441]'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="text-foreground dark:text-white">
                                  {getStepIcon(step.type)}
                                </div>
                                <div>
                                  <h5
                                    className={`text-sm font-medium ${\
                                      isNext
                                        ? 'text-amber-900 dark:text-white'
                                        : step.completed
                                        ? 'text-green-900 dark:text-white'
                                        : 'text-foreground dark:text-white'
                                    }`}
                                  >
                                    {step.name}
                                  </h5>
                                  <p
                                    className={`text-xs ${\
                                      isNext
                                        ? 'text-amber-700 dark:text-[#99a1af]'
                                        : step.completed
                                        ? 'text-green-700 dark:text-[#99a1af]'
                                        : 'text-muted-foreground dark:text-[#99a1af]'
                                    }`}
                                  >
                                    {step.description}
                                  </p>
                                </div>
                              </div>
                              {step.completed && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-gray-800/50 text-green-700 dark:text-gray-300 rounded text-xs whitespace-nowrap">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Concluído
                                </span>
                              )}
                              {isNext && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-gray-800/50 text-amber-700 dark:text-gray-300 rounded text-xs whitespace-nowrap">
                                  <AlertCircle className="w-3 h-3" />
                                  Próximo
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-3 text-xs">
                              {step.scheduledDate && (
                                <span
                                  className={`flex items-center gap-1 ${
                                    isNext
                                      ? 'text-amber-700 dark:text-[#99a1af]'
                                      : step.completed
                                      ? 'text-green-700 dark:text-[#99a1af]'
                                      : 'text-muted-foreground dark:text-[#99a1af]'
                                  }`}
                                >
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(step.scheduledDate)}
                                </span>
                              )}
                              <span
                                className={`flex items-center gap-1 ${
                                  isNext
                                    ? 'text-amber-700 dark:text-[#99a1af]'
                                    : step.completed
                                    ? 'text-green-700 dark:text-[#99a1af]'
                                    : 'text-muted-foreground dark:text-[#99a1af]'
                                }`}
                              >
                                Dia {step.dayOffset}
                              </span>
                            </div>

                            {isNext && (
                              <button className="mt-3 px-3 py-1.5 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity text-xs font-medium">
                                Marcar como Concluído
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-[#151a26] rounded-xl p-12 border border-gray-200 dark:border-[#2a3441] flex items-center justify-center">
              <div className="text-center">
                <Calendar className="w-16 h-16 text-muted-foreground dark:text-[#99a1af] mx-auto mb-4" />
                <p className="text-foreground dark:text-white mb-2">Selecione um protocolo</p>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                  Escolha um protocolo na lista para ver a timeline detalhada
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}