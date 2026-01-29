import { X, Calendar, CheckCircle2, AlertCircle, Plus, Bell } from 'lucide-react';

interface ProtocolCalendarModalProps {
  protocol: {
    id: number;
    name: string;
    animalName: string;
    startDate: string;
    steps: {
      id: number;
      name: string;
      dayOffset: number;
      type: string;
      description: string;
    }[];
  };
  onClose: () => void;
}

export function ProtocolCalendarModal({ protocol, onClose }: ProtocolCalendarModalProps) {
  const calculateEventDate = (startDate: string, dayOffset: number): string => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + dayOffset);
    return date.toISOString().split('T')[0];
  };

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const getDayOfWeek = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return days[date.getDay()];
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

  const scheduledEvents = protocol.steps
    .map((step) => ({
      ...step,
      date: calculateEventDate(protocol.startDate, step.dayOffset),
    }))
    .sort((a, b) => a.dayOffset - b.dayOffset);

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-[rgba(255,255,255,0.1)] sticky top-0 bg-white dark:bg-[#1a1a1a] z-10">
          <div>
            <h3 className="text-xl text-foreground dark:text-white mb-1">
              Calendário do Protocolo
            </h3>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
              {protocol.name} - {protocol.animalName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-foreground dark:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Info Card */}
          <div className="bg-gray-50 dark:bg-[#0d0d0d] border border-gray-200 dark:border-[rgba(255,255,255,0.1)] rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-xs text-muted-foreground dark:text-[#99a1af]">Data de Início</span>
                <p className="text-sm text-foreground dark:text-white font-medium">
                  {formatDate(protocol.startDate)}
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground dark:text-[#99a1af]">Total de Etapas</span>
                <p className="text-sm text-foreground dark:text-white font-medium">
                  {protocol.steps.length}
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground dark:text-[#99a1af]">Duração</span>
                <p className="text-sm text-foreground dark:text-white font-medium">
                  {Math.max(...protocol.steps.map((s) => s.dayOffset))} dias
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground dark:text-[#99a1af]">Animal</span>
                <p className="text-sm text-foreground dark:text-white font-medium">
                  {protocol.animalName}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline de Eventos */}
          <h4 className="text-sm text-foreground dark:text-white font-medium mb-4">
            Eventos Agendados
          </h4>

          <div className="space-y-3">
            {scheduledEvents.map((event, idx) => {
              const isFirstOfDay = idx === 0 || event.date !== scheduledEvents[idx - 1].date;
              
              return (
                <div key={event.id}>
                  {/* Separador de Data */}
                  {isFirstOfDay && (
                    <div className="flex items-center gap-3 mb-3 mt-6 first:mt-0">
                      <div className="flex-shrink-0 w-20 text-right">
                        <p className="text-sm text-foreground dark:text-white font-medium">
                          {formatDate(event.date)}
                        </p>
                        <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
                          {getDayOfWeek(event.date)}
                        </p>
                      </div>
                      <div className="flex-1 h-px bg-gray-200 dark:bg-[rgba(255,255,255,0.1)]"></div>
                    </div>
                  )}

                  {/* Card do Evento */}
                  <div className="flex items-start gap-3 ml-24">
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-100 dark:bg-[#2a2a2a] rounded-full flex items-center justify-center text-foreground dark:text-white">
                      {getStepIcon(event.type)}
                    </div>
                    <div className="flex-1 bg-gray-50 dark:bg-[#0d0d0d] border border-gray-200 dark:border-[rgba(255,255,255,0.1)] rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h5 className="text-sm text-foreground dark:text-white font-medium mb-1">
                            {event.name}
                          </h5>
                          <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
                            {event.description}
                          </p>
                        </div>
                        <span className="inline-flex items-center px-2 py-1 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[rgba(255,255,255,0.1)] rounded text-xs text-muted-foreground dark:text-[#99a1af]">
                          Dia {event.dayOffset}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground dark:text-[#99a1af]">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(event.date)}</span>
                        <span>•</span>
                        <span className="capitalize">{event.type}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-[rgba(255,255,255,0.1)] sticky bottom-0 bg-white dark:bg-[#1a1a1a]">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
