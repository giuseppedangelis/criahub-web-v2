import { X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

// Lista de animais sugeridos (mesma do CoverageModals)
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

interface Ovule {
  id: string;
  nomeAnimal: string;
  registro: string;
  dataColeta: string;
  metodoColeta: string;
  meioUtilizado: string;
  condicoesMaturacao: string;
  quantidade: string;
  estagioMaturacao: string;
  indicadoresQualidade: string;
  status: string[];
  imageUrl?: string;
}

export function AddOvuleModal({ onClose, onSave }: { onClose: () => void, onSave: (data: Partial<Ovule>) => void }) {
  const [formData, setFormData] = useState<Partial<Ovule>>({
    nomeAnimal: '',
    registro: '',
    dataColeta: '',
    metodoColeta: '',
    meioUtilizado: '',
    condicoesMaturacao: '',
    quantidade: '',
    estagioMaturacao: '',
    indicadoresQualidade: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    toast.success('Óvulo cadastrado com sucesso!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div 
        className="bg-card dark:bg-[#1a1a1a] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-border dark:border-[rgba(255,255,255,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
          <div>
            <h2 className="text-xl text-foreground dark:text-white mb-1">Cadastrar Óvulo</h2>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Preencha os dados abaixo</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Left Column */}
            <div className="space-y-4">
              <FormField 
                label="Nome do Animal" 
                value={formData.nomeAnimal || ''}
                onChange={(value) => setFormData({ ...formData, nomeAnimal: value })}
                placeholder="Ex: Estrela"
                required
                suggestions={suggestedAnimals}
              />
              <FormField 
                label="Data da Coleta" 
                value={formData.dataColeta || ''}
                onChange={(value) => setFormData({ ...formData, dataColeta: value })}
                placeholder="DD/MM/AAAA"
                required
              />
              <FormField 
                label="Meio Utilizado" 
                value={formData.meioUtilizado || ''}
                onChange={(value) => setFormData({ ...formData, meioUtilizado: value })}
                placeholder="Ex: TCM-199 + FSH"
                required
              />
              <FormField 
                label="Condições de Maturação" 
                value={formData.condicoesMaturacao || ''}
                onChange={(value) => setFormData({ ...formData, condicoesMaturacao: value })}
                placeholder="Ex: 38.5°C, 24h incubadora"
                required
              />
              <FormField 
                label="Indicadores de Qualidade" 
                value={formData.indicadoresQualidade || ''}
                onChange={(value) => setFormData({ ...formData, indicadoresQualidade: value })}
                placeholder="Ex: 75% em MII, qualidade A e B"
                required
              />
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <FormField 
                label="Registro" 
                value={formData.registro || ''}
                onChange={(value) => setFormData({ ...formData, registro: value })}
                placeholder="Ex: BRH-2023-054"
                required
              />
              <FormField 
                label="Método de Coleta" 
                value={formData.metodoColeta || ''}
                onChange={(value) => setFormData({ ...formData, metodoColeta: value })}
                placeholder="Ex: OPU guiado por ultrassom"
                required
              />
              <FormField 
                label="Quantidade" 
                value={formData.quantidade || ''}
                onChange={(value) => setFormData({ ...formData, quantidade: value })}
                placeholder="Ex: 12 oócitos"
                required
              />
              <FormField 
                label="Estágio de Maturação" 
                value={formData.estagioMaturacao || ''}
                onChange={(value) => setFormData({ ...formData, estagioMaturacao: value })}
                placeholder="Ex: 9 em MII, 3 em GV"
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col lg:flex-row gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-transparent border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white rounded-xl hover:bg-muted dark:hover:bg-[#2a2a2a] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
            >
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function EditOvuleModal({ ovule, onClose, onSave }: { ovule: Ovule, onClose: () => void, onSave: (data: Ovule) => void }) {
  const [formData, setFormData] = useState(ovule);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    toast.success('Óvulo atualizado com sucesso!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div 
        className="bg-card dark:bg-[#1a1a1a] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-border dark:border-[rgba(255,255,255,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
          <div>
            <h2 className="text-xl text-foreground dark:text-white mb-1">Editar Óvulo</h2>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">{ovule.nomeAnimal}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Left Column */}
            <div className="space-y-4">
              <FormField 
                label="Nome do Animal" 
                value={formData.nomeAnimal}
                onChange={(value) => setFormData({ ...formData, nomeAnimal: value })}
                required
                suggestions={suggestedAnimals}
              />
              <FormField 
                label="Data da Coleta" 
                value={formData.dataColeta}
                onChange={(value) => setFormData({ ...formData, dataColeta: value })}
                required
              />
              <FormField 
                label="Meio Utilizado" 
                value={formData.meioUtilizado}
                onChange={(value) => setFormData({ ...formData, meioUtilizado: value })}
                required
              />
              <FormField 
                label="Condições de Maturação" 
                value={formData.condicoesMaturacao}
                onChange={(value) => setFormData({ ...formData, condicoesMaturacao: value })}
                required
              />
              <FormField 
                label="Indicadores de Qualidade" 
                value={formData.indicadoresQualidade}
                onChange={(value) => setFormData({ ...formData, indicadoresQualidade: value })}
                required
              />
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <FormField 
                label="Registro" 
                value={formData.registro}
                onChange={(value) => setFormData({ ...formData, registro: value })}
                required
              />
              <FormField 
                label="Método de Coleta" 
                value={formData.metodoColeta}
                onChange={(value) => setFormData({ ...formData, metodoColeta: value })}
                required
              />
              <FormField 
                label="Quantidade" 
                value={formData.quantidade}
                onChange={(value) => setFormData({ ...formData, quantidade: value })}
                required
              />
              <FormField 
                label="Estágio de Maturação" 
                value={formData.estagioMaturacao}
                onChange={(value) => setFormData({ ...formData, estagioMaturacao: value })}
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col lg:flex-row gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-transparent border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white rounded-xl hover:bg-muted dark:hover:bg-[#2a2a2a] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
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