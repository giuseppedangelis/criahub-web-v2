import { Calendar, X, Plus, Users, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { NativeSelect } from '../ui/native-select';
import { toast } from 'sonner';

interface Transaction {
  id: number;
  type: 'Entrada' | 'Saída';
  description: string;
  date: string;
  value: string;
  status: string;
  animal: string;
  category: string;
  linkedAnimals?: { id: number; name: string }[];
  urgency?: 'Normal' | 'Alta';
}

interface AdvisorTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'>) => void;
}

// Mock de animais disponíveis
const availableAnimals = [
  { id: 1, name: 'Estrela Mangalarga' },
  { id: 2, name: 'Relâmpago Negro' },
  { id: 3, name: 'Bella Vista' },
  { id: 4, name: 'Sol Nascente' },
  { id: 5, name: 'Lua Prateada' },
  { id: 6, name: 'Vento Sul' },
  { id: 7, name: 'Cometa Dourado' },
  { id: 8, name: 'Flor da Manhã' },
  { id: 9, name: 'Rei da Marcha' },
  { id: 10, name: 'Trovão' },
];

export function AdvisorTransactionModal({
  isOpen,
  onClose,
  onSave,
}: AdvisorTransactionModalProps) {
  const [transactionType, setTransactionType] = useState<'Entrada' | 'Saída'>('Saída');
  const [linkedAnimals, setLinkedAnimals] = useState<{ id: number; name: string }[]>([]);
  const [showAnimalSelector, setShowAnimalSelector] = useState(false);
  
  const [formData, setFormData] = useState({
    category: '',
    date: '',
    description: '',
    value: '',
    status: 'Pendente',
    urgency: 'Normal' as 'Normal' | 'Alta',
  });

  const handleAddAnimal = (animal: { id: number; name: string }) => {
    if (!linkedAnimals.find(a => a.id === animal.id)) {
      setLinkedAnimals([...linkedAnimals, animal]);
    }
  };

  const handleRemoveAnimal = (animalId: number) => {
    setLinkedAnimals(linkedAnimals.filter(a => a.id !== animalId));
  };

  const handleSave = () => {
    // Validação
    if (!formData.category || !formData.date || !formData.value || !formData.status) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    // Formatar descrição de animal
    let animalDisplay = '-';
    if (linkedAnimals.length === 1) {
      animalDisplay = linkedAnimals[0].name;
    } else if (linkedAnimals.length > 1) {
      animalDisplay = `Múltiplos (${linkedAnimals.length})`;
    }

    // Criar transação/OS
    const newTransaction: Omit<Transaction, 'id'> = {
      type: transactionType,
      category: formData.category,
      date: new Date(formData.date).toLocaleDateString('pt-BR'),
      description: formData.description || `OS - ${formData.category}`,
      value: `R$ ${formData.value}`,
      status: formData.status,
      animal: animalDisplay,
      linkedAnimals: linkedAnimals,
      urgency: formData.urgency,
    };

    onSave(newTransaction);

    // Reset form
    setFormData({
      category: '',
      date: '',
      description: '',
      value: '',
      status: 'Pendente',
      urgency: 'Normal',
    });
    setLinkedAnimals([]);

    onClose();
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      category: '',
      date: '',
      description: '',
      value: '',
      status: 'Pendente',
      urgency: 'Normal',
    });
    setLinkedAnimals([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
          <h3 className="text-xl text-foreground dark:text-white">Nova Ordem de Serviço</h3>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-muted dark:hover:bg-[#0d0d0d] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-foreground dark:text-white" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {/* Tipo e Urgência */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">
                  Tipo *
                </label>
                <NativeSelect
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value as 'Entrada' | 'Saída')}
                >
                  <option value="Entrada">Receita</option>
                  <option value="Saída">Despesa</option>
                </NativeSelect>
              </div>

              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">
                  Urgência *
                </label>
                <NativeSelect
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value as 'Normal' | 'Alta' })}
                >
                  <option value="Normal">Normal</option>
                  <option value="Alta">Alta</option>
                </NativeSelect>
              </div>
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Categoria *
              </label>
              <NativeSelect
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">Selecione uma categoria</option>
                <option value="Veterinário">Veterinário</option>
                <option value="Farmácia">Farmácia</option>
                <option value="Ração">Ração</option>
                <option value="Medicamentos">Medicamentos</option>
                <option value="Transporte">Transporte</option>
                <option value="Venda de Cavalo">Venda de Cavalo</option>
                <option value="Venda de Sêmen">Venda de Sêmen</option>
                <option value="Nota Fiscal">Nota Fiscal</option>
                <option value="Outros">Outros</option>
              </NativeSelect>
            </div>

            {/* Data */}
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Data *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground dark:text-white" />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full h-10 pl-10 pr-4 bg-card dark:bg-[#3a3a3a] border border-border dark:border-0 rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                />
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Descrição
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ex: Atendimento Cólica, Vacina em Lote"
                className="w-full h-10 px-4 bg-card dark:bg-[#3a3a3a] border border-border dark:border-0 rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
            </div>

            {/* Valor */}
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Valor (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="0,00"
                className="w-full h-10 px-4 bg-card dark:bg-[#3a3a3a] border border-border dark:border-0 rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Status *
              </label>
              <NativeSelect
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Pendente">Pendente</option>
                <option value="Pago">Pago</option>
              </NativeSelect>
            </div>

            {/* Vincular a Animais */}
            <div className="border-t border-border dark:border-[rgba(255,255,255,0.1)] pt-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-foreground dark:text-white" />
                <label className="text-sm text-foreground dark:text-white">
                  Vincular a Animais <span className="text-muted-foreground dark:text-[#99a1af]">(Opcional)</span>
                </label>
              </div>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-3">
                Vincule esta despesa/receita a animais específicos para rastrear custos individuais (RN-003)
              </p>

              {/* Animais Selecionados */}
              {linkedAnimals.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {linkedAnimals.map((animal) => (
                    <div
                      key={animal.id}
                      className="flex items-center gap-2 px-3 py-1 bg-primary/10 dark:bg-white/10 rounded-lg"
                    >
                      <span className="text-sm text-foreground dark:text-white">{animal.name}</span>
                      <button
                        onClick={() => handleRemoveAnimal(animal.id)}
                        className="p-0.5 hover:bg-red-500/20 rounded transition-colors"
                      >
                        <X className="w-3 h-3 text-foreground dark:text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Seletor de Animais */}
              <button
                onClick={() => setShowAnimalSelector(!showAnimalSelector)}
                className="w-full px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] text-foreground dark:text-white rounded-xl hover:bg-muted dark:hover:bg-[#2a2a2a] transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Adicionar Animal
              </button>

              {showAnimalSelector && (
                <div className="mt-3 max-h-40 overflow-y-auto bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl">
                  {availableAnimals.map((animal) => (
                    <button
                      key={animal.id}
                      onClick={() => {
                        handleAddAnimal(animal);
                        setShowAnimalSelector(false);
                      }}
                      disabled={linkedAnimals.some(a => a.id === animal.id)}
                      className="w-full text-left px-4 py-2 hover:bg-muted dark:hover:bg-[#2a2a2a] transition-colors text-foreground dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {animal.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info RN-003 */}
            <div className="bg-blue-500/10 dark:bg-gray-500/10 border border-blue-500/20 dark:border-gray-500/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-foreground dark:text-white mb-1">Rastreamento de Custos por Animal</p>
                  <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
                    Despesas gerais (ex: luz do haras) não precisam ser vinculadas. Apenas vincule quando quiser rastrear o custo específico do animal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col lg:flex-row gap-3 p-6 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
          <button
            onClick={handleCancel}
            className="flex-1 py-3 px-4 bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white rounded-xl hover:opacity-90 transition-opacity"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 px-4 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
          >
            Criar OS
          </button>
        </div>
      </div>
    </div>
  );
}
