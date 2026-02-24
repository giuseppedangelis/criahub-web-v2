import { Edit, ArrowLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { NativeSelect } from '../ui/native-select';
import { useCreateTransaction, useTransactions } from '@/hooks/useFinancial';
import type { Animal, TransactionCategory, TransactionType } from '@/types';
import { formatCurrency, formatCurrencyInput, formatDate, getCategoryLabel, parseCurrencyToNumber, transactionCategoryOptions } from './financialUtils';
import { toast } from 'sonner';

interface BreederExpenseContentProps {
  onBack: () => void;
  harasId: string;
  animals: Animal[];
}

export function BreederExpenseContent({ onBack, harasId, animals }: BreederExpenseContentProps) {
  const [formData, setFormData] = useState({
    valor: '',
    data: '',
    animalId: '',
    tipoDespesa: '',
    descricao: '',
  });

  const { data: transactionsResponse } = useTransactions(
    { haras_id: harasId, type: 'despesa' as TransactionType },
    { page: 1, limit: 100 },
    !!harasId
  );
  const { mutateAsync: createTransaction, isPending: isCreating } = useCreateTransaction();

  const expenses = useMemo(() => transactionsResponse?.data || [], [transactionsResponse]);

  const handleCreate = async () => {
    if (!harasId) {
      toast.error('Haras não identificado');
      return;
    }

    if (!formData.valor || !formData.data || !formData.tipoDespesa || !formData.descricao) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const amount = parseCurrencyToNumber(formData.valor);
    if (!amount || amount <= 0) {
      toast.error('Informe um valor válido');
      return;
    }

    try {
      await createTransaction({
        haras_id: harasId,
        type: 'despesa',
        category: formData.tipoDespesa as TransactionCategory,
        amount,
        description: formData.descricao,
        date: formData.data,
        animal_id: formData.animalId || undefined,
      });

      toast.success('Despesa adicionada com sucesso!');
      setFormData({
        valor: '',
        data: '',
        animalId: '',
        tipoDespesa: '',
        descricao: '',
      });
    } catch (error) {
      console.error('Erro ao adicionar despesa:', error);
      toast.error('Erro ao adicionar despesa');
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs e Botão Voltar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground dark:text-[#99a1af]">Financeiro</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground dark:text-[#99a1af]" />
          <span className="text-foreground dark:text-white">Despesas</span>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-foreground dark:text-white hover:bg-muted dark:hover:bg-[#1a1a1a] rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>
      </div>

      {/* Header */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
        <h1 className="text-2xl text-foreground dark:text-white">Gerenciamento de Despesas</h1>
        <p className="text-muted-foreground dark:text-[#99a1af] mt-2">
          Controle todas as despesas do seu haras
        </p>
      </div>

      {/* Formulário de Adicionar Despesa */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
        <h2 className="text-xl text-foreground dark:text-white mb-6">Adicionar Despesa</h2>

        <div className="space-y-4">
          {/* Valor e Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">Valor</label>
              <input
                type="text"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: formatCurrencyInput(e.target.value) })}
                placeholder="0,00"
                className="w-full h-10 px-4 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
              />
            </div>

            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">Data</label>
              <input
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                className="w-full h-10 px-4 bg-[#3a3a3a] border-0 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
          </div>

          {/* Animal Vinculado e Tipo de Despesa */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex-1">
              <label className="block text-sm text-foreground dark:text-white mb-2">Animal Vinculado</label>
              <NativeSelect
                value={formData.animalId}
                onChange={(e) => setFormData({ ...formData, animalId: e.target.value })}
                className="w-full h-10 bg-[#3a3a3a] border-0 text-white rounded-lg"
              >
                <option value="">Selecione</option>
                {animals.map((animal) => (
                  <option key={animal.id} value={animal.id}>
                    {animal.name}
                  </option>
                ))}
              </NativeSelect>
            </div>

            <div className="flex-1">
              <label className="block text-sm text-foreground dark:text-white mb-2">Tipo de Despesa</label>
              <NativeSelect
                value={formData.tipoDespesa}
                onChange={(e) => setFormData({ ...formData, tipoDespesa: e.target.value })}
                className="w-full h-10 bg-[#3a3a3a] border-0 text-white rounded-lg"
              >
                <option value="">Selecione</option>
                {transactionCategoryOptions.despesa.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </NativeSelect>
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">Descrição</label>
            <input
              type="text"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Descrição da Despesa..."
              className="w-full h-10 px-4 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
            />
          </div>
        </div>

        {/* Botões */}
        <div className="flex items-center justify-end gap-4 mt-6 pt-4">
          <button
            className="px-12 py-2 bg-transparent border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
            onClick={() => setFormData({ valor: '', data: '', animalId: '', tipoDespesa: '', descricao: '' })}
          >
            Cancelar
          </button>
          <button
            onClick={handleCreate}
            disabled={isCreating}
            className="px-12 py-2 bg-white text-[#1a1a1a] rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isCreating ? 'Salvando...' : 'Adicionar Despesa'}
          </button>
        </div>
      </div>

      {/* Lista de Despesas Cadastradas */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
        <h2 className="text-2xl text-foreground dark:text-white mb-6">Despesas Cadastradas</h2>

        {/* Header da Tabela */}
        <div className="grid grid-cols-[200px_200px_250px_200px_200px_76px] gap-4 px-4 mb-4">
          <p className="text-foreground dark:text-white">Data</p>
          <p className="text-foreground dark:text-white">Descrição</p>
          <p className="text-foreground dark:text-white">Animal Vinculado</p>
          <p className="text-foreground dark:text-white">Tipo</p>
          <p className="text-foreground dark:text-white">Valor</p>
          <p className="text-foreground dark:text-white text-center">Ações</p>
        </div>

        {/* Linhas da Tabela */}
        <div className="space-y-4">
          {expenses.length > 0 ? (
            expenses.map((expense) => (
            <div
              key={expense.id}
              className="grid grid-cols-[200px_200px_250px_200px_200px_76px] gap-4 items-center bg-muted dark:bg-[#3a3a3a] rounded-lg px-4 py-2"
            >
              <p className="text-sm text-foreground dark:text-white">{formatDate(expense.date)}</p>
              <p className="text-sm text-foreground dark:text-white">{expense.description}</p>
              <p className="text-sm text-foreground dark:text-white">{expense.animal?.name || '-'}</p>
              <p className="text-sm text-foreground dark:text-white">{getCategoryLabel(expense.category)}</p>
              <p className="text-sm text-foreground dark:text-white">{formatCurrency(expense.amount)}</p>
              <div className="flex justify-center">
                <button className="text-foreground dark:text-white hover:opacity-70 transition-opacity">
                  <Edit className="w-6 h-6" />
                </button>
              </div>
            </div>
          ))
          ) : (
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
              Nenhuma despesa cadastrada.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
