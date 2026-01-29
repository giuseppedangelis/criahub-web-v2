import { X } from 'lucide-react';
import { useState } from 'react';
import { NativeSelect } from '../ui/native-select';

export interface OvulosData {
  doadora: string;
  quantidade: number;
  data: string;
  qualidade: 'excelente' | 'boa' | 'regular';
  veterinario: string;
  metodo: 'OPU' | 'Aspiração Folicular' | 'Coleta Natural';
  observacoes?: string;
}

interface RegisterOvulosModalProps {
  onClose: () => void;
  onSubmit: (data: OvulosData) => void;
}

export function RegisterOvulosModal({ onClose, onSubmit }: RegisterOvulosModalProps) {
  const [formData, setFormData] = useState<OvulosData>({
    doadora: '',
    quantidade: 1,
    data: new Date().toISOString().split('T')[0],
    qualidade: 'boa',
    veterinario: '',
    metodo: 'OPU',
    observacoes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof OvulosData, string>>>({});

  const validate = () => {
    const newErrors: Partial<Record<keyof OvulosData, string>> = {};

    if (!formData.doadora.trim()) {
      newErrors.doadora = 'Selecione a égua doadora';
    }
    if (formData.quantidade < 1) {
      newErrors.quantidade = 'Quantidade deve ser maior que zero';
    }
    if (!formData.data) {
      newErrors.data = 'Informe a data da coleta';
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
          <h2 className="text-xl text-foreground dark:text-white">Registrar Coleta de Óvulos</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Égua Doadora */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Égua Doadora *
            </label>
            <NativeSelect
              value={formData.doadora}
              onChange={(e) => setFormData({ ...formData, doadora: e.target.value })}
              className="w-full"
            >
              <option value="">Selecione a égua doadora</option>
              <option value="Estrela">Estrela</option>
              <option value="Bella Vista">Bella Vista</option>
              <option value="Íris">Íris</option>
              <option value="Lua">Lua</option>
              <option value="Serena">Serena</option>
              <option value="Aurora">Aurora</option>
              <option value="Diamante Rosa">Diamante Rosa</option>
            </NativeSelect>
            {errors.doadora && <p className="text-red-500 text-xs mt-1">{errors.doadora}</p>}
          </div>

          {/* Quantidade */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Quantidade de Óvulos Coletados *
            </label>
            <input
              type="number"
              min="1"
              value={formData.quantidade}
              onChange={(e) => setFormData({ ...formData, quantidade: parseInt(e.target.value) || 0 })}
              className="w-full h-10 px-4 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
            />
            {errors.quantidade && <p className="text-red-500 text-xs mt-1">{errors.quantidade}</p>}
          </div>

          {/* Data */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Data da Coleta *
            </label>
            <input
              type="date"
              value={formData.data}
              onChange={(e) => setFormData({ ...formData, data: e.target.value })}
              className="w-full h-10 px-4 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
            />
            {errors.data && <p className="text-red-500 text-xs mt-1">{errors.data}</p>}
          </div>

          {/* Método */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Método de Coleta *
            </label>
            <NativeSelect
              value={formData.metodo}
              onChange={(e) => setFormData({ ...formData, metodo: e.target.value as OvulosData['metodo'] })}
              className="w-full"
            >
              <option value="OPU">OPU (Ovum Pick-Up)</option>
              <option value="Aspiração Folicular">Aspiração Folicular</option>
              <option value="Coleta Natural">Coleta Natural</option>
            </NativeSelect>
          </div>

          {/* Qualidade */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Qualidade Geral *
            </label>
            <NativeSelect
              value={formData.qualidade}
              onChange={(e) => setFormData({ ...formData, qualidade: e.target.value as OvulosData['qualidade'] })}
              className="w-full"
            >
              <option value="excelente">Excelente</option>
              <option value="boa">Boa</option>
              <option value="regular">Regular</option>
            </NativeSelect>
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
              placeholder="Informações adicionais sobre a coleta..."
            />
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
              Registrar Coleta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
