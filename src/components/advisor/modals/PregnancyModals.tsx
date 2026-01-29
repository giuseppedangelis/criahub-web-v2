import { X } from 'lucide-react';
import { useState } from 'react';

interface Pregnancy {
  id: string;
  nomeAnimal: string;
  registro: string;
  dataCobertura: string;
  tipoCobertura: string;
  garanhaoEmbriao: string;
  diagnostico: string;
  observacoes: string;
  status: string;
}

interface AddPregnancyModalProps {
  onClose: () => void;
  onSave: (data: Partial<Pregnancy>) => void;
}

export function AddPregnancyModal({ onClose, onSave }: AddPregnancyModalProps) {
  const [formData, setFormData] = useState<Partial<Pregnancy>>({
    nomeAnimal: '',
    registro: '',
    dataCobertura: '',
    tipoCobertura: '',
    garanhaoEmbriao: '',
    diagnostico: '',
    observacoes: '',
    status: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[#3a3a3a] w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card dark:bg-[#1a1a1a] border-b border-border dark:border-[#3a3a3a] p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl text-foreground dark:text-white">Cadastrar Nova Gestação</h2>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-1">Preencha os dados abaixo</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-foreground dark:text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField 
                label="Nome do Animal" 
                value={formData.nomeAnimal || ''}
                onChange={(value) => setFormData({ ...formData, nomeAnimal: value })}
                placeholder="Ex: Bella"
                required
              />
              <FormField 
                label="Registro" 
                value={formData.registro || ''}
                onChange={(value) => setFormData({ ...formData, registro: value })}
                placeholder="Ex: BRH-2023-054"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField 
                label="Data da Cobertura" 
                value={formData.dataCobertura || ''}
                onChange={(value) => setFormData({ ...formData, dataCobertura: value })}
                placeholder="DD/MM/AAAA"
                required
              />
              <FormField 
                label="Tipo de Cobertura" 
                value={formData.tipoCobertura || ''}
                onChange={(value) => setFormData({ ...formData, tipoCobertura: value })}
                placeholder="Ex: Transferência embrionária"
                required
              />
            </div>

            <FormField 
              label="Garanhão/Embrião" 
              value={formData.garanhaoEmbriao || ''}
              onChange={(value) => setFormData({ ...formData, garanhaoEmbriao: value })}
              placeholder="Ex: Relâmpago x Estrela"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField 
                label="Diagnóstico" 
                value={formData.diagnostico || ''}
                onChange={(value) => setFormData({ ...formData, diagnostico: value })}
                placeholder="Ex: Palpação aos 14 dias"
                required
              />
              <FormField 
                label="Observações" 
                value={formData.observacoes || ''}
                onChange={(value) => setFormData({ ...formData, observacoes: value })}
                placeholder="Ex: Gestação única, sem complicações"
              />
            </div>

            <FormField 
              label="Status" 
              value={formData.status || ''}
              onChange={(value) => setFormData({ ...formData, status: value })}
              placeholder="Ex: Gestação confirmada"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col lg:flex-row gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-transparent border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white rounded-xl hover:bg-muted dark:hover:bg-[#2a2a2a] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
            >
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface EditPregnancyModalProps {
  pregnancy: Pregnancy;
  onClose: () => void;
  onSave: (data: Partial<Pregnancy>) => void;
}

export function EditPregnancyModal({ pregnancy, onClose, onSave }: EditPregnancyModalProps) {
  const [formData, setFormData] = useState<Partial<Pregnancy>>(pregnancy);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[#3a3a3a] w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card dark:bg-[#1a1a1a] border-b border-border dark:border-[#3a3a3a] p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl text-foreground dark:text-white">Editar Gestação</h2>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-1">{pregnancy.nomeAnimal}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-foreground dark:text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField 
                label="Nome do Animal" 
                value={formData.nomeAnimal || ''}
                onChange={(value) => setFormData({ ...formData, nomeAnimal: value })}
                placeholder="Ex: Bella"
                required
              />
              <FormField 
                label="Registro" 
                value={formData.registro || ''}
                onChange={(value) => setFormData({ ...formData, registro: value })}
                placeholder="Ex: BRH-2023-054"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField 
                label="Data da Cobertura" 
                value={formData.dataCobertura || ''}
                onChange={(value) => setFormData({ ...formData, dataCobertura: value })}
                placeholder="DD/MM/AAAA"
                required
              />
              <FormField 
                label="Tipo de Cobertura" 
                value={formData.tipoCobertura || ''}
                onChange={(value) => setFormData({ ...formData, tipoCobertura: value })}
                placeholder="Ex: Transferência embrionária"
                required
              />
            </div>

            <FormField 
              label="Garanhão/Embrião" 
              value={formData.garanhaoEmbriao || ''}
              onChange={(value) => setFormData({ ...formData, garanhaoEmbriao: value })}
              placeholder="Ex: Relâmpago x Estrela"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField 
                label="Diagnóstico" 
                value={formData.diagnostico || ''}
                onChange={(value) => setFormData({ ...formData, diagnostico: value })}
                placeholder="Ex: Palpação aos 14 dias"
                required
              />
              <FormField 
                label="Observações" 
                value={formData.observacoes || ''}
                onChange={(value) => setFormData({ ...formData, observacoes: value })}
                placeholder="Ex: Gestação única, sem complicações"
              />
            </div>

            <FormField 
              label="Status" 
              value={formData.status || ''}
              onChange={(value) => setFormData({ ...formData, status: value })}
              placeholder="Ex: Gestação confirmada"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col lg:flex-row gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-transparent border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white rounded-xl hover:bg-muted dark:hover:bg-[#2a2a2a] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormField({ 
  label, 
  value, 
  onChange, 
  placeholder,
  required = false
}: { 
  label: string, 
  value: string, 
  onChange: (value: string) => void,
  placeholder?: string,
  required?: boolean
}) {
  return (
    <div>
      <label className="block text-sm text-foreground dark:text-white mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full h-10 px-3 bg-input dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-lg text-foreground dark:text-white text-sm placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
      />
    </div>
  );
}