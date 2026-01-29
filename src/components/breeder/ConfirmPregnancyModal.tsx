import { X, Calendar, Clock, AlertCircle, CheckCircle2, Zap, Info, List } from 'lucide-react';
import { useState } from 'react';

interface ConfirmPregnancyModalProps {
  animalName: string;
  onClose: () => void;
  onConfirm: (data: PregnancyData) => void;
}

export interface PregnancyData {
  animalName: string;
  confirmationDate: string;
  confirmationTime: string;
  method: 'Ultrassom' | 'Palpação' | 'Exame Laboratorial';
  observations: string;
  autoScheduleP4: boolean;
  p4Schedule?: P4Application[];
}

export interface P4Application {
  applicationNumber: number;
  date: string;
  time: string;
  gestationDay: number;
}

export function ConfirmPregnancyModal({ animalName, onClose, onConfirm }: ConfirmPregnancyModalProps) {
  const [formData, setFormData] = useState<PregnancyData>({
    animalName,
    confirmationDate: new Date().toISOString().split('T')[0],
    confirmationTime: new Date().toTimeString().slice(0, 5),
    method: 'Ultrassom',
    observations: '',
    autoScheduleP4: true,
  });

  const [showSchedulePreview, setShowSchedulePreview] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Gerar cronograma de P4 (12 aplicações, uma a cada 10 dias, até dia 120)
  const generateP4Schedule = (startDate: string, startTime: string): P4Application[] => {
    const schedule: P4Application[] = [];
    const baseDate = new Date(startDate);
    
    for (let i = 0; i < 12; i++) {
      const applicationDate = new Date(baseDate);
      applicationDate.setDate(baseDate.getDate() + (i * 10)); // A cada 10 dias
      
      schedule.push({
        applicationNumber: i + 1,
        date: applicationDate.toISOString().split('T')[0],
        time: startTime,
        gestationDay: i * 10,
      });
    }
    
    return schedule;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.autoScheduleP4) {
      formData.p4Schedule = generateP4Schedule(formData.confirmationDate, formData.confirmationTime);
    }

    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    onConfirm(formData);
    onClose();
  };

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  if (showConfirmation) {
    return (
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-[rgba(255,255,255,0.1)] sticky top-0 bg-white dark:bg-[#1a1a1a] z-10">
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
                Você está prestes a confirmar a gestação de <strong>{animalName}</strong>:
              </p>
              
              <div className="bg-gray-50 dark:bg-[#0d0d0d] rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground dark:text-[#99a1af]" />
                  <span className="text-sm text-muted-foreground dark:text-[#99a1af]">Data da Confirmação:</span>
                  <span className="text-sm text-foreground dark:text-white font-medium">
                    {formatDate(formData.confirmationDate)} às {formData.confirmationTime}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground dark:text-[#99a1af]">Método:</span>
                  <span className="text-sm text-foreground dark:text-white font-medium">
                    {formData.method}
                  </span>
                </div>

                {formData.observations && (
                  <div className="flex items-start gap-2 pt-2 border-t border-gray-200 dark:border-[rgba(255,255,255,0.1)]">
                    <AlertCircle className="w-4 h-4 text-muted-foreground dark:text-[#99a1af] mt-0.5" />
                    <div>
                      <span className="text-sm text-muted-foreground dark:text-[#99a1af]">Observações:</span>
                      <p className="text-sm text-foreground dark:text-white mt-1">{formData.observations}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {formData.autoScheduleP4 && formData.p4Schedule && (
              <div className="bg-gray-50 dark:bg-[#0d0d0d] border-2 border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg p-4">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 bg-primary dark:bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Zap className="w-4 h-4 text-white dark:text-black" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground dark:text-white mb-1">
                      Série de 12 Aplicações P4 Será Criada
                    </p>
                    <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
                      Uma aplicação a cada 10 dias, do dia 0 ao dia 110 de gestação
                    </p>
                  </div>
                </div>

                {/* Tabela de Aplicações */}
                <div className="bg-white dark:bg-[#1a1a1a] rounded-lg overflow-hidden border border-gray-300 dark:border-[rgba(255,255,255,0.1)]">
                  <div className="max-h-64 overflow-y-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-100 dark:bg-[#0d0d0d] sticky top-0">
                        <tr>
                          <th className="px-3 py-2 text-left text-foreground dark:text-white font-medium">#</th>
                          <th className="px-3 py-2 text-left text-foreground dark:text-white font-medium">Data</th>
                          <th className="px-3 py-2 text-left text-foreground dark:text-white font-medium">Hora</th>
                          <th className="px-3 py-2 text-left text-foreground dark:text-white font-medium">Dia de Gestação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.p4Schedule.map((app, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50 dark:bg-[#0d0d0d]/50' : ''}>
                            <td className="px-3 py-2 text-foreground dark:text-white font-medium">{app.applicationNumber}ª</td>
                            <td className="px-3 py-2 text-muted-foreground dark:text-[#99a1af]">{formatDate(app.date)}</td>
                            <td className="px-3 py-2 text-muted-foreground dark:text-[#99a1af]">{app.time}</td>
                            <td className="px-3 py-2 text-muted-foreground dark:text-[#99a1af]">Dia {app.gestationDay}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
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
              Confirmar Gestação e Criar Eventos
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
              Confirmar Gestação
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
                Data da Confirmação *
              </label>
              <input
                type="date"
                required
                value={formData.confirmationDate}
                onChange={(e) => setFormData({ ...formData, confirmationDate: e.target.value })}
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
                value={formData.confirmationTime}
                onChange={(e) => setFormData({ ...formData, confirmationTime: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-[#0d0d0d] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
            </div>
          </div>

          {/* Método de Confirmação */}
          <div>
            <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
              Método de Confirmação *
            </label>
            <select
              required
              value={formData.method}
              onChange={(e) => setFormData({ ...formData, method: e.target.value as any })}
              className="w-full px-4 py-2.5 bg-white dark:bg-[#0d0d0d] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
            >
              <option value="Ultrassom">Ultrassom</option>
              <option value="Palpação">Palpação Retal</option>
              <option value="Exame Laboratorial">Exame Laboratorial</option>
            </select>
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
              placeholder="Anote detalhes sobre a confirmação, condições da égua, etc."
              className="w-full px-4 py-2.5 bg-white dark:bg-[#0d0d0d] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20 resize-none"
            />
          </div>

          {/* Agendamento Automático P4 */}
          <div className="bg-gray-50 dark:bg-[#0d0d0d] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg p-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="autoScheduleP4"
                checked={formData.autoScheduleP4}
                onChange={(e) => setFormData({ ...formData, autoScheduleP4: e.target.checked })}
                className="mt-1 w-4 h-4 text-primary dark:text-white rounded focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
              <div className="flex-1">
                <label htmlFor="autoScheduleP4" className="flex items-center gap-2 cursor-pointer">
                  <Zap className="w-4 h-4 text-foreground dark:text-white" />
                  <span className="text-sm font-medium text-foreground dark:text-white">
                    Criar Série de Aplicações P4 Automaticamente
                  </span>
                </label>
                <p className="text-xs text-muted-foreground dark:text-[#99a1af] mt-1">
                  O sistema criará automaticamente 12 eventos de "Aplicação P4", uma a cada 10 dias, do dia 0 ao dia 110 de gestação.
                </p>
                {formData.autoScheduleP4 && (
                  <button
                    type="button"
                    onClick={() => setShowSchedulePreview(!showSchedulePreview)}
                    className="mt-3 px-3 py-1.5 bg-primary dark:bg-white text-white dark:text-black text-xs rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    <List className="w-3 h-3" />
                    {showSchedulePreview ? 'Ocultar' : 'Ver'} Cronograma Completo
                  </button>
                )}
              </div>
            </div>

            {/* Preview do Cronograma */}
            {showSchedulePreview && formData.autoScheduleP4 && (
              <div className="mt-4 p-3 bg-white dark:bg-[#1a1a1a] rounded border border-gray-300 dark:border-[rgba(255,255,255,0.1)]">
                <p className="text-xs text-foreground dark:text-white font-medium mb-3">
                  Cronograma de Aplicações P4:
                </p>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {generateP4Schedule(formData.confirmationDate, formData.confirmationTime).map((app, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1.5 px-2 bg-gray-50 dark:bg-[#0d0d0d] rounded">
                      <span className="text-foreground dark:text-white font-medium">{app.applicationNumber}ª Aplicação</span>
                      <span className="text-muted-foreground dark:text-[#99a1af]">{formatDate(app.date)} às {app.time}</span>
                      <span className="text-muted-foreground dark:text-[#99a1af]">Dia {app.gestationDay}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
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