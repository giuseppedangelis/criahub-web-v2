import { Calendar, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NativeSelect } from '../ui/native-select';
import { toast } from 'sonner';
import type { Animal, CreateTransactionInput, TransactionCategory, TransactionType } from '@/types';
import { formatCurrencyInput, parseCurrencyToNumber, transactionCategoryOptions, transactionTypeLabels } from './financialUtils';

interface BreederTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (input: CreateTransactionInput) => Promise<void> | void;
  harasId: string;
  animals?: Animal[];
  initialType?: TransactionType;
  isSaving?: boolean;
}

export function BreederTransactionModal({
  isOpen,
  onClose,
  onCreate,
  harasId,
  animals = [],
  initialType = 'receita',
  isSaving = false,
}: BreederTransactionModalProps) {
  const [transactionType, setTransactionType] = useState<TransactionType>(initialType);
  const [formData, setFormData] = useState({
    categoria: '',
    data: '',
    descricao: '',
    valor: '',
    animalId: '',
  });

  useEffect(() => {
    if (isOpen) {
      setTransactionType(initialType);
    }
  }, [initialType, isOpen]);

  const handleSave = () => {
    // Validação
    if (!harasId) {
      toast.error('Haras não identificado');
      return;
    }
    if (!formData.categoria || !formData.data || !formData.valor || !formData.descricao) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const amount = parseCurrencyToNumber(formData.valor);

    if (!amount || amount <= 0) {
      toast.error('Informe um valor válido');
      return;
    }

    // Criar transação
    const newTransaction: CreateTransactionInput = {
      haras_id: harasId,
      type: transactionType,
      category: formData.categoria as TransactionCategory,
      date: formData.data,
      description: formData.descricao,
      amount,
      animal_id: formData.animalId || undefined,
    };

    onCreate(newTransaction);

    // Reset form
    setFormData({
      categoria: '',
      data: '',
      descricao: '',
      valor: '',
      animalId: '',
    });

    toast.success('Transação criada com sucesso!');
    onClose();
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      categoria: '',
      data: '',
      descricao: '',
      valor: '',
      animalId: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
          <h3 className="text-xl text-foreground dark:text-white">Nova Transação</h3>
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
          {/* Tipo de Movimentação */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Tipo de Movimentação
            </label>
            <div className="h-10 relative rounded-xl border border-white dark:border-white">
              <div className="flex h-full p-1 gap-1">
                <button
                    onClick={() => setTransactionType('receita')}
                    className={`flex-1 rounded-lg transition-all ${
                      transactionType === 'receita'
                        ? 'bg-white text-[#1a1a1a]'
                        : 'bg-transparent text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="text-sm">{transactionTypeLabels.receita}</span>
                  </button>
                  <button
                    onClick={() => setTransactionType('despesa')}
                    className={`flex-1 rounded-lg transition-all ${
                      transactionType === 'despesa'
                        ? 'bg-white text-[#1a1a1a]'
                        : 'bg-transparent text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="text-sm">{transactionTypeLabels.despesa}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Tipo de Receita/Despesa */}
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                {transactionType === 'receita' ? 'Tipo de Receita' : 'Tipo de Despesa'}
              </label>
              <NativeSelect
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              >
                <option value="">Selecione a categoria</option>
                {transactionCategoryOptions[transactionType].map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </NativeSelect>
            </div>

            {/* Data de Recebimento/Vencimento */}
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                {transactionType === 'receita' ? 'Data de Recebimento' : 'Data de Vencimento'}
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground dark:text-white pointer-events-none" />
                <input
                  type="date"
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
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
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Ex: Venda de égua Estrela"
                className="w-full h-10 px-4 bg-card dark:bg-[#3a3a3a] border border-border dark:border-0 rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
            </div>

            {/* Valor */}
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Valor
              </label>
              <input
                type="text"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: formatCurrencyInput(e.target.value) })}
                placeholder="0,00"
                className="w-full h-10 px-4 bg-card dark:bg-[#3a3a3a] border border-border dark:border-0 rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
            </div>

            {/* Animal Vinculado (opcional) */}
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Animal Vinculado (opcional)
              </label>
              <NativeSelect
                value={formData.animalId}
                onChange={(e) => setFormData({ ...formData, animalId: e.target.value })}
                className="w-full h-10 bg-card dark:bg-[#3a3a3a] border border-border dark:border-0 text-foreground dark:text-white rounded-xl"
              >
                <option value="">Nenhum</option>
                {animals.map((animal) => (
                  <option key={animal.id} value={animal.id}>
                    {animal.name}
                  </option>
                ))}
              </NativeSelect>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col lg:flex-row gap-3 p-6 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
          <button
            onClick={handleCancel}
            className="flex-1 h-10 px-4 bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white rounded-xl hover:opacity-90 transition-opacity"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 h-10 px-4 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
          >
            {isSaving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}
