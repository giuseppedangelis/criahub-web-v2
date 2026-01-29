import { X, Calendar, CheckCircle2, Zap, AlertCircle, Search, Plus, Bell } from 'lucide-react';
import { useState } from 'react';

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

interface ApplyProtocolModalProps {
  protocol: Protocol;
  onClose: () => void;
  onApply: (data: ApplyProtocolData) => void;
}

interface ProtocolStep {
  id?: number;
  name: string;
  dayOffset: number;
  type: 'Exame' | 'Aplicação' | 'Procedimento' | 'Coleta';
  description: string;
}

export interface ApplyProtocolData {
  animalName: string;
  startDate: string;
  startTime: string;
  notes: string;
  scheduledEvents: ScheduledEvent[];
}

interface ScheduledEvent {
  name: string;
  date: string;
  time: string;
  type: string;
  description: string;
}

export function ApplyProtocolModal({ protocol, onClose, onApply }: ApplyProtocolModalProps) {
  const [formData, setFormData] = useState<ApplyProtocolData>({
    animalName: '',
    startDate: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    notes: '',
    scheduledEvents: [],
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Animais mockados para seleção
  const animals = [
    'Estrela da Manhã',
    'Flor do Campo',
    'Lua Nova',
    'Rainha do Mar',
    'Vento Sul',
    'Diamante Negro',
  ];

  const filteredAnimals = animals.filter((animal) =>
    animal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateEventDate = (startDate: string, dayOffset: number): string => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + dayOffset);
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Gerar eventos agendados
    const scheduledEvents: ScheduledEvent[] = protocol.steps.map((step) => ({
      name: step.name,
      date: calculateEventDate(formData.startDate, step.dayOffset),
      time: formData.startTime,
      type: step.type,
      description: step.description,
    }));

    setFormData({ ...formData, scheduledEvents });
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    onApply(formData);
    onClose();
  };

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
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

  const getTotalDays = () => {
    if (protocol.steps.length === 0) return 0;
    return Math.max(...protocol.steps.map((s) => s.dayOffset));
  };

  if (showConfirmation) {
    return (
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-[rgba(255,255,255,0.1)] sticky top-0 bg-white dark:bg-[#1a1a1a] z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-gray-800/50 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-gray-400" />
              </div>
              <h3 className="text-xl text-foreground dark:text-white">Confirmar Aplicação</h3>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <p className="text-foreground dark:text-white mb-4">
              Você está prestes a aplicar o protocolo <strong>{protocol.name}</strong> para{' '}
              <strong>{formData.animalName}</strong>:
            </p>

            <div className="bg-gray-50 dark:bg-[#0d0d0d] rounded-lg p-4 space-y-3">
              <div>
                <span className="text-sm text-muted-foreground dark:text-[#99a1af]">Animal:</span>
                <p className="text-foreground dark:text-white font-medium">{formData.animalName}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground dark:text-[#99a1af]">Data de Início:</span>
                <p className="text-foreground dark:text-white">
                  {formatDate(formData.startDate)} às {formData.startTime}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground dark:text-[#99a1af]">Duração Total:</span>
                <p className="text-foreground dark:text-white">{getTotalDays()} dias</p>
              </div>
              {formData.notes && (
                <div>
                  <span className="text-sm text-muted-foreground dark:text-[#99a1af]">Observações:</span>
                  <p className="text-foreground dark:text-white">{formData.notes}</p>
                </div>
              )}
            </div>

            <div className="bg-amber-50 dark:bg-[#0d0d0d] border-2 border-amber-200 dark:border-[rgba(255,255,255,0.1)] rounded-lg p-4">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-amber-600 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Zap className="w-4 h-4 text-white dark:text-gray-200" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-900 dark:text-white mb-1">
                    {formData.scheduledEvents.length} Eventos Serão Criados Automaticamente
                  </p>
                  <p className="text-xs text-amber-700 dark:text-[#99a1af]">
                    Todos os eventos do protocolo serão agendados na Agenda
                  </p>
                </div>
              </div>

              {/* Lista de Eventos */}
              <div className="bg-white/50 dark:bg-[#1a1a1a]/50 rounded-lg overflow-hidden border border-amber-300 dark:border-[rgba(255,255,255,0.1)]">
                <div className="max-h-80 overflow-y-auto">
                  <div className="space-y-2 p-3">
                    {formData.scheduledEvents.map((event, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 bg-white dark:bg-[#1a1a1a] rounded-lg border border-amber-200 dark:border-[rgba(255,255,255,0.1)]"
                      >
                        <span className="text-xl flex-shrink-0">{getStepIcon(event.type)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm text-amber-900 dark:text-white font-medium truncate">
                              {event.name}
                            </p>
                          </div>
                          <p className="text-xs text-amber-700 dark:text-[#99a1af] mb-2">{event.description}</p>
                          <div className="flex items-center gap-3 text-xs text-amber-600 dark:text-[#99a1af]">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(event.date)}
                            </span>
                            <span>{event.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-[#0d0d0d] border border-yellow-200 dark:border-[rgba(255,255,255,0.1)] rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-900 dark:text-white font-medium mb-1">Atenção</p>
                <p className="text-xs text-yellow-700 dark:text-[#99a1af]">
                  Uma vez aplicado, o protocolo iniciará imediatamente e todos os eventos serão adicionados à agenda.
                  Você poderá acompanhar o progresso na aba de Protocolos Ativos.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-[rgba(255,255,255,0.1)] sticky bottom-0 bg-white dark:bg-[#1a1a1a]">
            <button
              onClick={() => setShowConfirmation(false)}
              className="flex-1 px-4 py-2.5 bg-white dark:bg-[#2a2a2a] text-foreground dark:text-white border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg hover:bg-gray-50 dark:hover:bg-[#3a3a3a] transition-colors"
            >
              Voltar
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-2.5 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              Confirmar e Aplicar Protocolo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-[rgba(255,255,255,0.1)] sticky top-0 bg-white dark:bg-[#1a1a1a] z-10">
          <div>
            <h3 className="text-xl text-foreground dark:text-white mb-1">Aplicar Protocolo</h3>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">{protocol.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg transition-colors">
            <X className="w-5 h-5 text-foreground dark:text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Resumo do Protocolo */}
          <div className="bg-gray-50 dark:bg-[#0d0d0d] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg p-4">
            <h4 className="text-sm font-medium text-foreground dark:text-white mb-2">Sobre este protocolo</h4>
            <div className="space-y-1 text-xs text-muted-foreground dark:text-[#99a1af]">
              <p>• {protocol.steps.length} etapas programadas</p>
              <p>• Duração total de {getTotalDays()} dias</p>
              <p>• Todos os eventos serão criados automaticamente na agenda</p>
            </div>
          </div>

          {/* Seleção de Animal */}
          <div>
            <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
              Selecionar Animal *
            </label>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground dark:text-[#99a1af]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar animal..."
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#0d0d0d] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {filteredAnimals.map((animal) => (
                <button
                  key={animal}
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, animalName: animal });
                    setSearchTerm('');
                  }}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    formData.animalName === animal
                      ? 'border-primary dark:border-white bg-primary/5 dark:bg-white/5'
                      : 'border-gray-200 dark:border-[rgba(255,255,255,0.1)] hover:border-gray-300 dark:hover:border-[rgba(255,255,255,0.2)]'
                  }`}
                >
                  <p className="text-sm text-foreground dark:text-white font-medium">{animal}</p>
                </button>
              ))}
            </div>
            {formData.animalName && (
              <p className="text-sm text-green-600 dark:text-gray-300 mt-2">
                ✓ Selecionado: {formData.animalName}
              </p>
            )}
          </div>

          {/* Data e Hora de Início */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                Data de Início *
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-[#0d0d0d] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                Hora de Início *
              </label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-[#0d0d0d] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
              Observações
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Anote informações relevantes sobre a aplicação deste protocolo..."
              className="w-full px-4 py-2.5 bg-white dark:bg-[#0d0d0d] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20 resize-none"
            />
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-[rgba(255,255,255,0.1)]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-white dark:bg-[#2a2a2a] text-foreground dark:text-white border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg hover:bg-gray-50 dark:hover:bg-[#3a3a3a] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!formData.animalName}
              className="flex-1 px-4 py-2.5 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}