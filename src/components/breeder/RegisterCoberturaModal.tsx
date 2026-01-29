import { X, Calendar } from 'lucide-react';
import { useState } from 'react';
import { NativeSelect } from '../ui/native-select';

export interface CoberturaData {
  pai: string;
  mae: string;
  tipo: 'Monta Natural' | 'Inseminação Artificial' | 'Transferência de Embrião';
  data: string;
  veterinario: string;
  observacoes?: string;
}

interface RegisterCoberturaModalProps {
  onClose: () => void;
  onSubmit: (data: CoberturaData) => void;
}

export function RegisterCoberturaModal({ onClose, onSubmit }: RegisterCoberturaModalProps) {
  const [formData, setFormData] = useState<CoberturaData>({
    pai: '',
    mae: '',
    tipo: 'Monta Natural',
    data: new Date().toISOString().split('T')[0],
    veterinario: '',
    observacoes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CoberturaData, string>>>({});

  const validate = () => {
    const newErrors: Partial<Record<keyof CoberturaData, string>> = {};

    if (!formData.pai.trim()) {
      newErrors.pai = 'Selecione o garanhão (pai)';
    }
    if (!formData.mae.trim()) {
      newErrors.mae = 'Selecione a égua (mãe)';
    }
    if (!formData.data) {
      newErrors.data = 'Informe a data da cobertura';
    }
    if (!formData.veterinario.trim()) {
      newErrors.veterinario = 'Informe o veterinário responsável';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border dark:border-[rgba(255,255,255,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl text-foreground dark:text-white">Registrar Nova Cobertura</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Garanhão (Pai) */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Garanhão (Pai) *
            </label>
            <NativeSelect
              value={formData.pai}
              onChange={(e) => setFormData({ ...formData, pai: e.target.value })}
              className="w-full"
            >
              <option value="">Selecione o garanhão</option>
              <option value="Trovão Negro">Trovão Negro</option>
              <option value="Imperador">Imperador</option>
              <option value="Sol Nascente">Sol Nascente</option>
              <option value="Relâmpago">Relâmpago</option>
              <option value="Diamante">Diamante</option>
            </NativeSelect>
            {errors.pai && <p className="text-red-500 text-xs mt-1">{errors.pai}</p>}
          </div>

          {/* Égua (Mãe) */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Égua (Mãe) *
            </label>
            <NativeSelect
              value={formData.mae}
              onChange={(e) => setFormData({ ...formData, mae: e.target.value })}
              className="w-full"
            >
              <option value="">Selecione a égua</option>
              <option value="Estrela">Estrela</option>
              <option value="Bella Vista">Bella Vista</option>
              <option value="Íris">Íris</option>
              <option value="Lua">Lua</option>
              <option value="Serena">Serena</option>
              <option value="Aurora">Aurora</option>
            </NativeSelect>
            {errors.mae && <p className="text-red-500 text-xs mt-1">{errors.mae}</p>}
          </div>

          {/* Tipo de Cobertura */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Tipo de Cobertura *
            </label>
            <NativeSelect
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value as CoberturaData['tipo'] })}
              className="w-full"
            >
              <option value="Monta Natural">Monta Natural</option>
              <option value="Inseminação Artificial">Inseminação Artificial</option>
              <option value="Transferência de Embrião">Transferência de Embrião</option>
            </NativeSelect>
          </div>

          {/* Data */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Data da Cobertura *
            </label>
            <input
              type="date"
              value={formData.data}
              onChange={(e) => setFormData({ ...formData, data: e.target.value })}
              className="w-full h-10 px-4 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
            />
            {errors.data && <p className="text-red-500 text-xs mt-1">{errors.data}</p>}
          </div>

          {/* Veterinário */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Veterinário Responsável *
            </label>
            <input
              type="text"
              value={formData.veterinario}
              onChange={(e) => setFormData({ ...formData, veterinario: e.target.value })}
              className="w-full h-10 px-4 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
              placeholder="Ex: Dr. João Silva"
            />
            {errors.veterinario && <p className="text-red-500 text-xs mt-1">{errors.veterinario}</p>}
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Observações
            </label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              className="w-full px-4 py-3 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white resize-none"
              rows={3}
              placeholder="Informações adicionais sobre a cobertura..."
            />
          </div>

          {/* Nota Informativa */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-lg p-4 flex items-start gap-3">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Integração com Agenda:</strong> Esta cobertura será automaticamente adicionada como um serviço interno na sua Agenda.
              </p>
            </div>
          </div>

          {/* Botões */}
          <div className="flex flex-col lg:flex-row gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-transparent border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity"
            >
              Registrar Cobertura
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}