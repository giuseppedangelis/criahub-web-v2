import { X } from 'lucide-react';
import { useState } from 'react';
import { NativeSelect } from '../ui/native-select';

export interface EmbriaoData {
  doadora: string;
  garanhao: string;
  quantidade: number;
  data: string;
  grau: 'A' | 'B' | 'C';
  tipo: 'Fresco' | 'Congelado';
  metodo: 'FIV' | 'Coleta Natural' | 'Transferência';
  veterinario: string;
  observacoes?: string;
}

interface RegisterEmbriaoModalProps {
  onClose: () => void;
  onSubmit: (data: EmbriaoData) => void;
}

export function RegisterEmbriaoModal({ onClose, onSubmit }: RegisterEmbriaoModalProps) {
  const [formData, setFormData] = useState<EmbriaoData>({
    doadora: '',
    garanhao: '',
    quantidade: 1,
    data: new Date().toISOString().split('T')[0],
    grau: 'A',
    tipo: 'Fresco',
    metodo: 'FIV',
    veterinario: '',
    observacoes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof EmbriaoData, string>>>({});

  const validate = () => {
    const newErrors: Partial<Record<keyof EmbriaoData, string>> = {};

    if (!formData.doadora.trim()) {
      newErrors.doadora = 'Selecione a égua doadora';
    }
    if (!formData.garanhao.trim()) {
      newErrors.garanhao = 'Selecione o garanhão';
    }
    if (formData.quantidade < 1) {
      newErrors.quantidade = 'Quantidade deve ser maior que zero';
    }
    if (!formData.data) {
      newErrors.data = 'Informe a data de produção';
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
          <h2 className="text-xl text-foreground dark:text-white">Registrar Produção de Embriões</h2>
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

          {/* Garanhão */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Garanhão *
            </label>
            <NativeSelect
              value={formData.garanhao}
              onChange={(e) => setFormData({ ...formData, garanhao: e.target.value })}
              className="w-full"
            >
              <option value="">Selecione o garanhão</option>
              <option value="Trovão Negro">Trovão Negro</option>
              <option value="Imperador">Imperador</option>
              <option value="Sol Nascente">Sol Nascente</option>
              <option value="Relâmpago">Relâmpago</option>
              <option value="Diamante">Diamante</option>
            </NativeSelect>
            {errors.garanhao && <p className="text-red-500 text-xs mt-1">{errors.garanhao}</p>}
          </div>

          {/* Quantidade */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Quantidade de Embriões Produzidos *
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
              Data de Produção *
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
              Método de Produção *
            </label>
            <NativeSelect
              value={formData.metodo}
              onChange={(e) => setFormData({ ...formData, metodo: e.target.value as EmbriaoData['metodo'] })}
              className="w-full"
            >
              <option value="FIV">FIV (Fertilização In Vitro)</option>
              <option value="Coleta Natural">Coleta Natural</option>
              <option value="Transferência">Transferência de Embrião</option>
            </NativeSelect>
          </div>

          {/* Grau de Qualidade */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Grau de Qualidade *
            </label>
            <NativeSelect
              value={formData.grau}
              onChange={(e) => setFormData({ ...formData, grau: e.target.value as EmbriaoData['grau'] })}
              className="w-full"
            >
              <option value="A">Grau A (Excelente)</option>
              <option value="B">Grau B (Bom)</option>
              <option value="C">Grau C (Regular)</option>
            </NativeSelect>
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Tipo de Armazenamento *
            </label>
            <NativeSelect
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value as EmbriaoData['tipo'] })}
              className="w-full"
            >
              <option value="Fresco">Fresco</option>
              <option value="Congelado">Congelado</option>
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
              placeholder="Informações adicionais sobre a produção..."
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
              Registrar Embriões
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
