import { X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

// Lista de animais sugeridos e receptoras
const suggestedAnimals = [
  'Estrela Mangalarga',
  'Relâmpago Negro',
  'Lua Dourada',
  'Trovão Branco',
  'Bella Vista',
  'Vento Sul',
  'Aurora',
  'Diamante Negro',
  'Serena',
  'Jade'
];

interface Embryo {
  id: string;
  linhaGenetica: string;
  data: string;
  metodoObtencao: string;
  estagio: string;
  meioCultura: string;
  receptora: string;
  destinoStatus: string;
  notas: string;
}

interface AddEmbryoModalProps {
  onClose: () => void;
  onSave: (data: Partial<Embryo>) => void;
}

export function AddEmbryoModal({ onClose, onSave }: AddEmbryoModalProps) {
  const [formData, setFormData] = useState<Partial<Embryo>>({
    id: '',
    linhaGenetica: '',
    data: '',
    metodoObtencao: '',
    estagio: '',
    meioCultura: '',
    receptora: '',
    destinoStatus: '',
    notas: '',
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
            <h2 className="text-xl text-foreground dark:text-white">Cadastrar Novo Embrião</h2>
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
                label="ID" 
                value={formData.id || ''}
                onChange={(value) => setFormData({ ...formData, id: value })}
                placeholder="Ex: EMBR-2025-001"
                required
              />
              <FormField 
                label="Data" 
                value={formData.data || ''}
                onChange={(value) => setFormData({ ...formData, data: value })}
                placeholder="DD/MM/AAAA"
                required
              />
            </div>

            <FormField 
              label="Linha Genética" 
              value={formData.linhaGenetica || ''}
              onChange={(value) => setFormData({ ...formData, linhaGenetica: value })}
              placeholder="Ex: Relâmpago x Estrela"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField 
                label="Método de Obtenção" 
                value={formData.metodoObtencao || ''}
                onChange={(value) => setFormData({ ...formData, metodoObtencao: value })}
                placeholder="Ex: ICSI"
                required
              />
              <FormField 
                label="Estágio" 
                value={formData.estagio || ''}
                onChange={(value) => setFormData({ ...formData, estagio: value })}
                placeholder="Ex: Blastocisto, qualidade A"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField 
                label="Meio de Cultura" 
                value={formData.meioCultura || ''}
                onChange={(value) => setFormData({ ...formData, meioCultura: value })}
                placeholder="Ex: SOF modificado"
                required
              />
              <FormField 
                label="Receptora" 
                value={formData.receptora || ''}
                onChange={(value) => setFormData({ ...formData, receptora: value })}
                placeholder="Ex: Bella – BRM-2018-099"
                required
                suggestions={suggestedAnimals}
              />
            </div>

            <FormField 
              label="Destino/Status" 
              value={formData.destinoStatus || ''}
              onChange={(value) => setFormData({ ...formData, destinoStatus: value })}
              placeholder="Ex: Transferido para receptora"
              required
            />

            <FormField 
              label="Notas" 
              value={formData.notas || ''}
              onChange={(value) => setFormData({ ...formData, notas: value })}
              placeholder="Observações adicionais"
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

interface EditEmbryoModalProps {
  embryo: Embryo;
  onClose: () => void;
  onSave: (data: Partial<Embryo>) => void;
}

export function EditEmbryoModal({ embryo, onClose, onSave }: EditEmbryoModalProps) {
  const [formData, setFormData] = useState<Partial<Embryo>>(embryo);

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
            <h2 className="text-xl text-foreground dark:text-white">Editar Embrião</h2>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-1">{embryo.id}</p>
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
                label="ID" 
                value={formData.id || ''}
                onChange={(value) => setFormData({ ...formData, id: value })}
                placeholder="Ex: EMBR-2025-001"
                required
              />
              <FormField 
                label="Data" 
                value={formData.data || ''}
                onChange={(value) => setFormData({ ...formData, data: value })}
                placeholder="DD/MM/AAAA"
                required
              />
            </div>

            <FormField 
              label="Linha Genética" 
              value={formData.linhaGenetica || ''}
              onChange={(value) => setFormData({ ...formData, linhaGenetica: value })}
              placeholder="Ex: Relâmpago x Estrela"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField 
                label="Método de Obtenção" 
                value={formData.metodoObtencao || ''}
                onChange={(value) => setFormData({ ...formData, metodoObtencao: value })}
                placeholder="Ex: ICSI"
                required
              />
              <FormField 
                label="Estágio" 
                value={formData.estagio || ''}
                onChange={(value) => setFormData({ ...formData, estagio: value })}
                placeholder="Ex: Blastocisto, qualidade A"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField 
                label="Meio de Cultura" 
                value={formData.meioCultura || ''}
                onChange={(value) => setFormData({ ...formData, meioCultura: value })}
                placeholder="Ex: SOF modificado"
                required
              />
              <FormField 
                label="Receptora" 
                value={formData.receptora || ''}
                onChange={(value) => setFormData({ ...formData, receptora: value })}
                placeholder="Ex: Bella – BRM-2018-099"
                required
                suggestions={suggestedAnimals}
              />
            </div>

            <FormField 
              label="Destino/Status" 
              value={formData.destinoStatus || ''}
              onChange={(value) => setFormData({ ...formData, destinoStatus: value })}
              placeholder="Ex: Transferido para receptora"
              required
            />

            <FormField 
              label="Notas" 
              value={formData.notas || ''}
              onChange={(value) => setFormData({ ...formData, notas: value })}
              placeholder="Observações adicionais"
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
  required = false,
  suggestions = []
}: { 
  label: string, 
  value: string, 
  onChange: (value: string) => void,
  placeholder?: string,
  required?: boolean,
  suggestions?: string[]
}) {
  const listId = `suggestions-${label.replace(/\s/g, '-').toLowerCase()}`;
  
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
        list={suggestions.length > 0 ? listId : undefined}
        className="w-full h-10 px-3 bg-input dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-lg text-foreground dark:text-white text-sm placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
      />
      {suggestions.length > 0 && (
        <datalist id={listId}>
          {suggestions.map((suggestion, index) => (
            <option key={index} value={suggestion} />
          ))}
        </datalist>
      )}
    </div>
  );
}