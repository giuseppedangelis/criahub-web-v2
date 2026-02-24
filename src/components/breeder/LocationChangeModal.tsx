import { X } from 'lucide-react';
import { useState } from 'react';
import type { AnimalLocationType, AnimalServiceType } from '@/types';

interface LocationChangeModalProps {
  currentLocation?: string;
  onClose: () => void;
  onSave: (data: LocationChangeData) => Promise<void> | void;
  isSaving?: boolean;
}

export interface LocationChangeData {
  locationType: AnimalLocationType;
  locationName: string;
  serviceType?: AnimalServiceType;
  reason?: string;
  date: string;
  time: string;
  notes?: string;
}

const LOCATION_TYPES: AnimalLocationType[] = ['Baia', 'Pasto', 'Servico'];
const SERVICE_TYPES: AnimalServiceType[] = ['Reproducao', 'Trabalho', 'Repouso', 'Outro'];

export function LocationChangeModal({ currentLocation, onClose, onSave, isSaving }: LocationChangeModalProps) {
  const [formData, setFormData] = useState<LocationChangeData>({
    locationType: 'Baia',
    locationName: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave(formData);
      onClose();
    } catch {
      // Erro tratado pelo chamador
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-[rgba(255,255,255,0.1)]">
          <div>
            <h3 className="text-xl text-foreground dark:text-white mb-1">
              Registrar Mudanca de Localizacao
            </h3>
            {currentLocation && (
              <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                Localizacao atual: <span className="font-medium">{currentLocation}</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-foreground dark:text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Tipo de Localizacao *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {LOCATION_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, locationType: type, serviceType: undefined })}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.locationType === type
                      ? 'border-primary dark:border-white bg-primary/10 dark:bg-white/10 text-foreground dark:text-white'
                      : 'border-gray-200 dark:border-[rgba(255,255,255,0.1)] text-muted-foreground dark:text-[#99a1af] hover:border-gray-300 dark:hover:border-[rgba(255,255,255,0.2)]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              {formData.locationType === 'Baia'
                ? 'Numero da Baia'
                : formData.locationType === 'Pasto'
                  ? 'Nome do Pasto'
                  : 'Nome do Servico'} *
            </label>
            <input
              type="text"
              required
              value={formData.locationName}
              onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
              placeholder={
                formData.locationType === 'Baia'
                  ? 'Ex: Baia 12'
                  : formData.locationType === 'Pasto'
                    ? 'Ex: Pasto Norte'
                    : 'Ex: Fazenda Vizinha'
              }
              className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
            />
          </div>

          {formData.locationType === 'Servico' && (
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Tipo de Servico *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {SERVICE_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, serviceType: type })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.serviceType === type
                        ? 'border-primary dark:border-white bg-primary/10 dark:bg-white/10 text-foreground dark:text-white'
                        : 'border-gray-200 dark:border-[rgba(255,255,255,0.1)] text-muted-foreground dark:text-[#99a1af] hover:border-gray-300 dark:hover:border-[rgba(255,255,255,0.2)]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Data *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
            </div>
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Hora *
              </label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Motivo da Mudanca (Opcional)
            </label>
            <input
              type="text"
              value={formData.reason || ''}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Ex: Cobertura programada, Descanso pos-competicao"
              className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
            />
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Observacoes (Opcional)
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Informacoes adicionais sobre a mudanca"
              rows={3}
              className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 dark:bg-[#2a2a2a] text-foreground dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-[#3a3a3a] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Salvando...' : 'Registrar Mudanca'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
