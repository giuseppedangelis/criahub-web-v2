import { X, Calendar, Clock, AlertCircle, CheckCircle2, Zap } from 'lucide-react';
import { useState } from 'react';

interface RegisterOvulationModalProps {
  animalName: string;
  onClose: () => void;
  onRegister: (data: OvulationData) => void;
}

export interface OvulationData {
  animalName: string;
  date: string;
  time: string;
  observations: string;
  autoScheduleCollection: boolean;
  collectionDate?: string;
  collectionTime?: string;
}

export function RegisterOvulationModal({ animalName, onClose, onRegister }: RegisterOvulationModalProps) {
  const [formData, setFormData] = useState<OvulationData>({
    animalName,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    observations: '',
    autoScheduleCollection: true,
  });

  const [showConfirmation, setShowConfirmation] = useState(false);

  // Calcular data da coleta (+8 dias)
  const calculateCollectionDate = (ovulationDate: string): string => {
    const date = new Date(ovulationDate);
    date.setDate(date.getDate() + 8);
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.autoScheduleCollection) {
      const collectionDate = calculateCollectionDate(formData.date);
      formData.collectionDate = collectionDate;
      formData.collectionTime = formData.time; // Mesma hora
    }

    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    onRegister(formData);
    onClose();
  };

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  if (showConfirmation) {
    return (
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-xl w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-[rgba(255,255,255,0.1)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-gray-800/50 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-gray-400" />
              </div>
              <h3 className="text-xl text-foreground dark:text-white">
                Confirmar Registro
              </h3>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div>
              <p className="text-foreground dark:text-white mb-4">
                Você está prestes a registrar a ovulação de <strong>{animalName}</strong>:
              </p>
              
              <div className="bg-gray-50 dark:bg-[#0d0d0d] rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground dark:text-[#99a1af]" />
                  <span className="text-sm text-muted-foreground dark:text-[#99a1af]">Data da Ovulação:</span>
                  <span className="text-sm text-foreground dark:text-white font-medium">
                    {formatDate(formData.date)} às {formData.time}
                  </span>
                </div>

                {formData.observations && (
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-muted-foreground dark:text-[#99a1af] mt-0.5" />
                    <div>
                      <span className="text-sm text-muted-foreground dark:text-[#99a1af]">Observações:</span>
                      <p className="text-sm text-foreground dark:text-white mt-1">{formData.observations}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {formData.autoScheduleCollection && formData.collectionDate && (
              <div className="bg-gray-50 dark:bg-[#0d0d0d] border-2 border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary dark:bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Zap className="w-4 h-4 text-white dark:text-black" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground dark:text-white mb-2">
                      Evento Automático Será Criado
                    </p>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground dark:text-[#99a1af]">Tipo:</span>
                        <span className="text-xs text-foreground dark:text-white font-medium">
                          Coleta de Embrião
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-muted-foreground dark:text-[#99a1af]" />
                        <span className="text-xs text-muted-foreground dark:text-[#99a1af]">Data:</span>
                        <span className="text-xs text-foreground dark:text-white font-medium">
                          {formatDate(formData.collectionDate)} às {formData.collectionTime}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground dark:text-[#99a1af] mt-2">
                        (+8 dias após ovulação)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-[rgba(255,255,255,0.1)]">
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
              Confirmar Registro
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-[rgba(255,255,255,0.1)] sticky top-0 bg-white dark:bg-[#1a1a1a] z-10">
          <div>
            <h3 className="text-xl text-foreground dark:text-white mb-1">
              Registrar Ovulação
            </h3>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
              Animal: {animalName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-foreground dark:text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Data e Hora */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                Data da Ovulação *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-[#0d0d0d] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                Hora *
              </label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
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
              value={formData.observations}
              onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
              rows={4}
              placeholder="Anote detalhes sobre a ovulação, condições clínicas, etc."
              className="w-full px-4 py-2.5 bg-white dark:bg-[#0d0d0d] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20 resize-none"
            />
          </div>

          {/* Agendamento Automático */}
          <div className="bg-gray-50 dark:bg-[#0d0d0d] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg p-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="autoSchedule"
                checked={formData.autoScheduleCollection}
                onChange={(e) => setFormData({ ...formData, autoScheduleCollection: e.target.checked })}
                className="mt-1 w-4 h-4 text-primary dark:text-white rounded focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
              <div className="flex-1">
                <label htmlFor="autoSchedule" className="flex items-center gap-2 cursor-pointer">
                  <Zap className="w-4 h-4 text-foreground dark:text-white" />
                  <span className="text-sm font-medium text-foreground dark:text-white">
                    Agendar Coleta Automática
                  </span>
                </label>
                <p className="text-xs text-muted-foreground dark:text-[#99a1af] mt-1">
                  O sistema criará automaticamente um evento de "Coleta de Embrião" 8 dias após a ovulação registrada.
                </p>
                {formData.autoScheduleCollection && (
                  <div className="mt-3 p-3 bg-white dark:bg-[#1a1a1a] rounded border border-gray-300 dark:border-[rgba(255,255,255,0.1)]">
                    <div className="flex items-center gap-2 text-xs">
                      <Calendar className="w-3 h-3 text-muted-foreground dark:text-[#99a1af]" />
                      <span className="text-muted-foreground dark:text-[#99a1af]">Coleta agendada para:</span>
                      <span className="text-foreground dark:text-white font-medium">
                        {formatDate(calculateCollectionDate(formData.date))} às {formData.time}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
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
              className="flex-1 px-4 py-2.5 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              Continuar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
