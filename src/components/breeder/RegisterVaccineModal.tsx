import { X } from 'lucide-react';
import { useState } from 'react';

interface RegisterVaccineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: VaccineData) => void;
  animalName?: string;
}

export interface VaccineData {
  nome: string;
  data: string;
  proximaDose: string;
  veterinario: string;
  lote: string;
  observacoes: string;
}

export function RegisterVaccineModal({ isOpen, onClose, onSave, animalName }: RegisterVaccineModalProps) {
  const [formData, setFormData] = useState<VaccineData>({
    nome: '',
    data: '',
    proximaDose: '',
    veterinario: '',
    lote: '',
    observacoes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSave = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome da vacina é obrigatório';
    }

    if (!formData.data) {
      newErrors.data = 'Data de aplicação é obrigatória';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
    setFormData({
      nome: '',
      data: '',
      proximaDose: '',
      veterinario: '',
      lote: '',
      observacoes: '',
    });
    setErrors({});
  };

  const handleClose = () => {
    setFormData({
      nome: '',
      data: '',
      proximaDose: '',
      veterinario: '',
      lote: '',
      observacoes: '',
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={handleClose}>
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border dark:border-[rgba(255,255,255,0.1)]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl text-foreground dark:text-white">Adicionar Nova Vacina</h2>
            {animalName && (
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-1">
                Animal: {animalName}
              </p>
            )}
          </div>
          <button onClick={handleClose} className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Nome da Vacina *
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => {
                setFormData({ ...formData, nome: e.target.value });
                if (errors.nome) setErrors({ ...errors, nome: '' });
              }}
              className={`w-full h-10 px-4 bg-muted dark:bg-[#0d0d0d] border ${
                errors.nome ? 'border-red-500' : 'border-border dark:border-[rgba(255,255,255,0.1)]'
              } rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white`}
              placeholder="Ex: Tétano, Raiva, Influenza Equina"
            />
            {errors.nome && (
              <p className="text-sm text-red-500 mt-1">{errors.nome}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Data de Aplicação *
              </label>
              <input
                type="date"
                value={formData.data}
                onChange={(e) => {
                  setFormData({ ...formData, data: e.target.value });
                  if (errors.data) setErrors({ ...errors, data: '' });
                }}
                className={`w-full h-10 px-4 bg-muted dark:bg-[#0d0d0d] border ${
                  errors.data ? 'border-red-500' : 'border-border dark:border-[rgba(255,255,255,0.1)]'
                } rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white`}
              />
              {errors.data && (
                <p className="text-sm text-red-500 mt-1">{errors.data}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Próxima Dose
              </label>
              <input
                type="date"
                value={formData.proximaDose}
                onChange={(e) => setFormData({ ...formData, proximaDose: e.target.value })}
                className="w-full h-10 px-4 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Veterinário Responsável
              </label>
              <input
                type="text"
                value={formData.veterinario}
                onChange={(e) => setFormData({ ...formData, veterinario: e.target.value })}
                className="w-full h-10 px-4 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                placeholder="Dr. Nome do veterinário"
              />
            </div>

            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Lote da Vacina
              </label>
              <input
                type="text"
                value={formData.lote}
                onChange={(e) => setFormData({ ...formData, lote: e.target.value })}
                className="w-full h-10 px-4 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                placeholder="Número do lote"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Observações
            </label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              className="w-full px-4 py-3 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white resize-none"
              rows={4}
              placeholder="Informações adicionais sobre a vacinação (reações, local de aplicação, etc.)"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={handleClose}
            className="flex-1 px-6 py-3 bg-transparent border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity"
          >
            Salvar Vacina
          </button>
        </div>
      </div>
    </div>
  );
}
