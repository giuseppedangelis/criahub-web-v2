import { X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

// Lista de animais sugeridos (pode ser importada de um arquivo de dados)
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

const suggestedStallions = [
  'Rei da Serra',
  'Relâmpago Negro',
  'Trovão Branco',
  'Vento Sul',
  'Diamante Negro',
  'Vale Verde',
  'Estância dos Ventos'
];

interface Coverage {
  id: string;
  nomeAnimal: string;
  registro: string;
  dataCobertura: string;
  tipoCobertura: string;
  garanhao: string;
  situacaoGestacional: string;
  dataConfirmacao: string;
  nascimento: string;
  geneticaUtilizada: string;
  observacoes: string;
  imageUrl?: string;
}

export function AddCoverageModal({ onClose, onSave }: { onClose: () => void, onSave: (data: Partial<Coverage>) => void }) {
  const [formData, setFormData] = useState<Partial<Coverage>>({
    nomeAnimal: '',
    registro: '',
    dataCobertura: '',
    tipoCobertura: '',
    garanhao: '',
    situacaoGestacional: '',
    dataConfirmacao: '',
    nascimento: '',
    geneticaUtilizada: '',
    observacoes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    toast.success('Cobertura cadastrada com sucesso!');
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
            <h2 className="text-xl text-foreground dark:text-white mb-1">Cadastrar Cobertura</h2>
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
                placeholder="Ex: Dama da Pavibra"
                required
                suggestions={suggestedAnimals}
              />
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
                placeholder="Ex: Inseminação Artificial"
                required
              />
              <FormField 
                label="Situação Gestacional" 
                value={formData.situacaoGestacional || ''}
                onChange={(value) => setFormData({ ...formData, situacaoGestacional: value })}
                placeholder="Ex: Confirmada"
                required
              />
              <FormField 
                label="Genética Utilizada" 
                value={formData.geneticaUtilizada || ''}
                onChange={(value) => setFormData({ ...formData, geneticaUtilizada: value })}
                placeholder="Ex: Sêmen Refrigerado"
                required
              />
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <FormField 
                label="Registro" 
                value={formData.registro || ''}
                onChange={(value) => setFormData({ ...formData, registro: value })}
                placeholder="Ex: BRH-2020-001"
                required
              />
              <FormField 
                label="Garanhão" 
                value={formData.garanhao || ''}
                onChange={(value) => setFormData({ ...formData, garanhao: value })}
                placeholder="Ex: Rei da Serra"
                required
                suggestions={suggestedStallions}
              />
              <FormField 
                label="Data Confirmação" 
                value={formData.dataConfirmacao || ''}
                onChange={(value) => setFormData({ ...formData, dataConfirmacao: value })}
                placeholder="DD/MM/AAAA"
                required
              />
              <FormField 
                label="Nascimento" 
                value={formData.nascimento || ''}
                onChange={(value) => setFormData({ ...formData, nascimento: value })}
                placeholder="DD/MM/AAAA"
              />
              <FormField 
                label="Observações" 
                value={formData.observacoes || ''}
                onChange={(value) => setFormData({ ...formData, observacoes: value })}
                placeholder="Adicione observações relevantes"
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

export function EditCoverageModal({ coverage, onClose, onSave }: { coverage: Coverage, onClose: () => void, onSave: (data: Coverage) => void }) {
  const [formData, setFormData] = useState(coverage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    toast.success('Cobertura atualizada com sucesso!');
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
            <h2 className="text-xl text-foreground dark:text-white mb-1">Editar Cobertura</h2>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">{coverage.nomeAnimal}</p>
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
                label="Data da Cobertura" 
                value={formData.dataCobertura}
                onChange={(value) => setFormData({ ...formData, dataCobertura: value })}
                required
              />
              <FormField 
                label="Tipo de Cobertura" 
                value={formData.tipoCobertura}
                onChange={(value) => setFormData({ ...formData, tipoCobertura: value })}
                required
              />
              <FormField 
                label="Situação Gestacional" 
                value={formData.situacaoGestacional}
                onChange={(value) => setFormData({ ...formData, situacaoGestacional: value })}
                required
              />
              <FormField 
                label="Genética Utilizada" 
                value={formData.geneticaUtilizada}
                onChange={(value) => setFormData({ ...formData, geneticaUtilizada: value })}
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
                label="Garanhão" 
                value={formData.garanhao}
                onChange={(value) => setFormData({ ...formData, garanhao: value })}
                required
                suggestions={suggestedStallions}
              />
              <FormField 
                label="Data Confirmação" 
                value={formData.dataConfirmacao}
                onChange={(value) => setFormData({ ...formData, dataConfirmacao: value })}
                required
              />
              <FormField 
                label="Nascimento" 
                value={formData.nascimento}
                onChange={(value) => setFormData({ ...formData, nascimento: value })}
              />
              <FormField 
                label="Observações" 
                value={formData.observacoes}
                onChange={(value) => setFormData({ ...formData, observacoes: value })}
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