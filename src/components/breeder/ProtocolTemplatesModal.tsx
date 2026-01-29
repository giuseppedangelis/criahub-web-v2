import { X, CheckCircle2, Calendar, FileText, ArrowRight, AlertCircle, Plus, Bell } from 'lucide-react';
import { useState } from 'react';
import { ProtocolFormData } from './CreateProtocolModal';

interface ProtocolTemplatesModalProps {
  onClose: () => void;
  onSelectTemplate: (template: ProtocolFormData) => void;
}

interface ProtocolTemplate {
  id: string;
  name: string;
  type: 'TE' | 'IATF' | 'Aspiração Folicular';
  description: string;
  icon: string;
  totalDays: number;
  stepsCount: number;
  data: ProtocolFormData;
}

export function ProtocolTemplatesModal({ onClose, onSelectTemplate }: ProtocolTemplatesModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const templates: ProtocolTemplate[] = [
    {
      id: 'te-standard',
      name: 'Protocolo TE Completo',
      type: 'TE',
      description: 'Protocolo padrão de transferência de embrião com sincronização hormonal completa. Ideal para receptoras com boas condições reprodutivas.',
      icon: '🧬',
      totalDays: 30,
      stepsCount: 7,
      data: {
        name: 'Protocolo TE Completo',
        type: 'TE',
        description: 'Protocolo padrão de transferência de embrião com sincronização completa',
        steps: [
          {
            id: crypto.randomUUID(),
            name: 'Aplicaç��o de Progesterona',
            dayOffset: 0,
            description: 'Inserção de dispositivo intravaginal de P4',
            type: 'Aplicação',
          },
          {
            id: crypto.randomUUID(),
            name: 'Aplicação de Benzoato de Estradiol',
            dayOffset: 0,
            description: '2mg IM',
            type: 'Aplicação',
          },
          {
            id: crypto.randomUUID(),
            name: 'Aplicação de eCG',
            dayOffset: 8,
            description: '300-400 UI IM - Estimulação folicular',
            type: 'Aplicação',
          },
          {
            id: crypto.randomUUID(),
            name: 'Aplicação de Prostaglandina + Retirada P4',
            dayOffset: 8,
            description: 'Retirada do dispositivo intravaginal',
            type: 'Aplicação',
          },
          {
            id: crypto.randomUUID(),
            name: 'Aplicação de Cipionato de Estradiol',
            dayOffset: 9,
            description: '1mg IM - Indução de ovulação',
            type: 'Aplicação',
          },
          {
            id: crypto.randomUUID(),
            name: 'Transferência de Embrião',
            dayOffset: 16,
            description: 'Inovulação do embrião na receptora',
            type: 'Procedimento',
          },
          {
            id: crypto.randomUUID(),
            name: 'Diagnóstico de Gestação',
            dayOffset: 30,
            description: 'Ultrassom para confirmar gestação',
            type: 'Exame',
          },
        ],
      },
    },
    {
      id: 'iatf-standard',
      name: 'IATF - Inseminação em Tempo Fixo',
      type: 'IATF',
      description: 'Protocolo de sincronização para inseminação artificial em horário pré-determinado. Permite programar a reprodução sem necessidade de detecção de cio.',
      icon: '⏰',
      totalDays: 18,
      stepsCount: 6,
      data: {
        name: 'IATF - Inseminação Artificial em Tempo Fixo',
        type: 'IATF',
        description: 'Protocolo de sincronização para inseminação em horário pré-determinado',
        steps: [
          {
            id: crypto.randomUUID(),
            name: 'Aplicação de GnRH',
            dayOffset: 0,
            description: '100mcg IM - Sincronização inicial',
            type: 'Aplicação',
          },
          {
            id: crypto.randomUUID(),
            name: 'Exame Ultrassonográfico',
            dayOffset: 7,
            description: 'Avaliar desenvolvimento folicular',
            type: 'Exame',
          },
          {
            id: crypto.randomUUID(),
            name: 'Aplicação de Prostaglandina',
            dayOffset: 7,
            description: 'Indução de luteólise',
            type: 'Aplicação',
          },
          {
            id: crypto.randomUUID(),
            name: 'Aplicação de GnRH',
            dayOffset: 9,
            description: 'Indução de ovulação',
            type: 'Aplicação',
          },
          {
            id: crypto.randomUUID(),
            name: 'Inseminação Artificial',
            dayOffset: 10,
            description: 'IA em tempo fixo - 16-18h após última GnRH',
            type: 'Procedimento',
          },
          {
            id: crypto.randomUUID(),
            name: 'Coleta de Embrião',
            dayOffset: 18,
            description: '8 dias após inseminação',
            type: 'Coleta',
          },
        ],
      },
    },
    {
      id: 'opu-standard',
      name: 'Aspiração Folicular (OPU)',
      type: 'Aspiração Folicular',
      description: 'Protocolo de aspiração folicular guiada por ultrassom para coleta de oócitos. Técnica minimamente invasiva para produção in vitro de embriões.',
      icon: '🔬',
      totalDays: 3,
      stepsCount: 6,
      data: {
        name: 'Aspiração Folicular OPU',
        type: 'Aspiração Folicular',
        description: 'Protocolo de aspiração folicular guiada por ultrassom (OPU)',
        steps: [
          {
            id: crypto.randomUUID(),
            name: 'Exame Ultrassonográfico',
            dayOffset: 0,
            description: 'Mapeamento folicular inicial',
            type: 'Exame',
          },
          {
            id: crypto.randomUUID(),
            name: 'Aplicação de FSH',
            dayOffset: 0,
            description: 'Estimulação ovariana - dose inicial',
            type: 'Aplicação',
          },
          {
            id: crypto.randomUUID(),
            name: 'Aplicação de FSH',
            dayOffset: 1,
            description: 'Dose de manutenção',
            type: 'Aplicação',
          },
          {
            id: crypto.randomUUID(),
            name: 'Aplicação de hCG',
            dayOffset: 2,
            description: 'Maturação final dos oócitos',
            type: 'Aplicação',
          },
          {
            id: crypto.randomUUID(),
            name: 'Aspiração Folicular (OPU)',
            dayOffset: 3,
            description: 'Coleta de oócitos via OPU guiada por US',
            type: 'Coleta',
          },
          {
            id: crypto.randomUUID(),
            name: 'Fecundação in vitro',
            dayOffset: 3,
            description: 'FIV dos oócitos coletados',
            type: 'Procedimento',
          },
        ],
      },
    },
  ];

  const handleSelectTemplate = () => {
    const template = templates.find((t) => t.id === selectedTemplate);
    if (template) {
      onSelectTemplate(template.data);
    }
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

  const getStepIcon = (stepType: string) => {
    switch (stepType) {
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

  const getTemplateIcon = (type: string) => {
    switch (type) {
      case 'TE':
        return <Plus className="w-8 h-8" />;
      case 'IATF':
        return <Calendar className="w-8 h-8" />;
      case 'Aspiração Folicular':
        return <CheckCircle2 className="w-8 h-8" />;
      default:
        return <FileText className="w-8 h-8" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-[#1a1f2e] rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-[#2a3441] sticky top-0 bg-white dark:bg-[#1a1f2e] z-10">
          <div>
            <h3 className="text-xl text-foreground dark:text-white mb-1">Templates de Protocolos</h3>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
              Escolha um template para começar rapidamente
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a3441] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-foreground dark:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => setSelectedTemplate(template.id)}
                className={`text-left p-5 rounded-xl border-2 transition-all ${
                  selectedTemplate === template.id
                    ? 'border-primary dark:border-white bg-primary/5 dark:bg-white/5'
                    : 'border-gray-200 dark:border-[#2a3441] hover:border-gray-300 dark:hover:border-[#3a4451]'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-4xl">{getTemplateIcon(template.type)}</span>
                  {selectedTemplate === template.id && (
                    <CheckCircle2 className="w-6 h-6 text-primary dark:text-white" />
                  )}
                </div>

                <h4 className="text-foreground dark:text-white font-medium mb-2">{template.name}</h4>

                <span className={`inline-flex items-center px-2 py-1 rounded text-xs border mb-3 ${getTypeColor(template.type)}`}>
                  {template.type}
                </span>

                <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-4 line-clamp-3">
                  {template.description}
                </p>

                <div className="flex items-center gap-3 text-xs text-muted-foreground dark:text-[#99a1af]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {template.totalDays} dias
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {template.stepsCount} etapas
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Detalhes do Template Selecionado */}
          {selectedTemplate && (
            <div className="bg-gray-50 dark:bg-[#151a26] border-2 border-gray-300 dark:border-[#2a3441] rounded-xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-foreground dark:text-white font-medium mb-1">
                    Preview das Etapas
                  </h4>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                    Você poderá editar todas as etapas na próxima tela
                  </p>
                </div>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {templates
                  .find((t) => t.id === selectedTemplate)
                  ?.data.steps.sort((a, b) => a.dayOffset - b.dayOffset)
                  .map((step, idx) => {
                    const stepType = step.type;
                    const icon = getStepIcon(stepType);

                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-white/50 dark:bg-[#1a1f2e]/50 rounded-lg border border-gray-300 dark:border-[#2a3441]"
                      >
                        <span className="text-xl">{icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm text-foreground dark:text-white font-medium">{step.name}</p>
                            <span className="text-xs text-muted-foreground dark:text-[#99a1af]">Dia {step.dayOffset}</span>
                          </div>
                          <p className="text-xs text-muted-foreground dark:text-[#99a1af]">{step.description}</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Opção de Criar do Zero */}
          <div className="border-t border-gray-200 dark:border-[#2a3441] pt-4">
            <button
              type="button"
              onClick={() => onSelectTemplate({
                name: '',
                type: 'Personalizado',
                description: '',
                steps: [{
                  id: crypto.randomUUID(),
                  name: '',
                  dayOffset: 0,
                  description: '',
                  type: 'Aplicação',
                }],
              })}
              className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-[#2a3441] rounded-xl hover:border-primary dark:hover:border-white transition-colors flex items-center justify-center gap-3 group"
            >
              <FileText className="w-5 h-5 text-muted-foreground dark:text-[#99a1af] group-hover:text-primary dark:group-hover:text-white" />
              <span className="text-foreground dark:text-white font-medium">Criar Protocolo do Zero</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-[#2a3441] sticky bottom-0 bg-white dark:bg-[#1a1f2e]">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-white dark:bg-[#2a3441] text-foreground dark:text-white border border-gray-300 dark:border-[#3a4451] rounded-lg hover:bg-gray-50 dark:hover:bg-[#3a4451] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSelectTemplate}
            disabled={!selectedTemplate}
            className="flex-1 px-4 py-2.5 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Usar Template
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}