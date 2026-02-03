import { TrendingUp, TrendingDown, DollarSign, Plus, Search, Filter, AlertCircle, Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AdvisorTransactionModal } from './AdvisorTransactionModal';
import { NativeSelect } from '../ui/native-select';
import { useCurrentHaras } from '@/hooks/useHaras';
import { useAnimals } from '@/hooks/useAnimals';
import { useCreateTransaction, useFinancialSummary, useTransactions } from '@/hooks/useFinancial';
import type { CreateTransactionInput, Transaction } from '@/types';
import {
  formatCurrency,
  formatDate,
  getCategoryLabel,
  transactionCategoryOptions,
  transactionTypeLabels,
} from '../breeder/financialUtils';

export function AdvisorFinanceContent() {
  const { data: currentHaras } = useCurrentHaras();
  const harasId = currentHaras?.id || '';

  const [showNewTransaction, setShowNewTransaction] = useState(false);
  const [filterCategory, setFilterCategory] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterType, setFilterType] = useState('todos');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: animalsResponse } = useAnimals(
    { haras_id: harasId },
    { page: 1, limit: 200 },
    !!harasId
  );
  const animals = animalsResponse?.data || [];

  const { data: transactionsResponse, isLoading: isLoadingTransactions } = useTransactions(
    { haras_id: harasId },
    { page: 1, limit: 50 },
    !!harasId
  );
  const transactions = transactionsResponse?.data || [];

  const { data: totalSummary } = useFinancialSummary(harasId);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
  const { data: monthSummary } = useFinancialSummary(harasId, monthStart, monthEnd);

  const { mutateAsync: createTransaction, isPending: isCreating } = useCreateTransaction();

  const handleSaveTransaction = async (input: CreateTransactionInput) => {
    await createTransaction(input);
  };

  const allCategories = useMemo(() => {
    const combined = transactionCategoryOptions.receita.concat(transactionCategoryOptions.despesa);
    const unique = new Map<string, string>();
    combined.forEach((item) => {
      unique.set(item.value, item.label);
    });
    return Array.from(unique.entries()).map(([value, label]) => ({ value, label }));
  }, []);

  const todayIso = new Date().toISOString().split('T')[0];
  const getStatusLabel = (transaction: Transaction) => {
    const dateValue = (transaction.date || '').split('T')[0];
    if (dateValue && dateValue > todayIso) return 'Pendente';
    return 'Pago';
  };

  const filteredTransactions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return transactions.filter((transaction) => {
      const matchesCategory = filterCategory === 'todos' || transaction.category === filterCategory;
      const matchesType = filterType === 'todos' || transaction.type === filterType;
      const matchesStatus = filterStatus === 'todos' || getStatusLabel(transaction) === filterStatus;
      const matchesSearch =
        !query ||
        transaction.description.toLowerCase().includes(query) ||
        transaction.animal?.name?.toLowerCase().includes(query) ||
        getCategoryLabel(transaction.category).toLowerCase().includes(query);

      return matchesCategory && matchesType && matchesStatus && matchesSearch;
    });
  }, [transactions, filterCategory, filterType, filterStatus, searchTerm]);

  const totalBalance = totalSummary?.balance ?? 0;
  const monthRevenue = monthSummary?.totalRevenue ?? 0;
  const monthExpenses = monthSummary?.totalExpenses ?? 0;

  return (
    <div className="space-y-6">
      <div className="bg-blue-500/10 dark:bg-gray-500/10 border border-blue-500/20 dark:border-gray-500/20 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-500/10 dark:bg-gray-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-gray-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-foreground dark:text-white mb-2">Gestao Financeira Operacional</h3>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-2">
              Este modulo permite registrar receitas e despesas vinculando valores a animais especificos quando necessario.
            </p>
            <ul className="text-sm text-muted-foreground dark:text-[#99a1af] space-y-1 ml-4">
              <li>• Rastrear quanto cada animal custou ao haras (RN-003)</li>
              <li>• Gerar relatorios de rentabilidade por animal</li>
              <li>• Diferenciar despesas gerais de despesas especificas</li>
            </ul>
          </div>
        </div>
      </div>

      {!harasId && (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6">
          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
            Seu usuario ainda nao esta vinculado a nenhum Haras.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500 p-3 rounded-xl">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-3xl text-foreground dark:text-white mb-2">{formatCurrency(totalBalance)}</p>
          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Saldo Total</p>
        </div>

        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-500 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-3xl text-foreground dark:text-white mb-2">{formatCurrency(monthRevenue)}</p>
          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Entradas (Mes)</p>
        </div>

        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-500 p-3 rounded-xl">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-3xl text-foreground dark:text-white mb-2">{formatCurrency(monthExpenses)}</p>
          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Saidas (Mes)</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
          <input
            type="text"
            placeholder="Buscar transacao..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="w-full sm:w-auto px-4 py-3 bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white rounded-lg hover:bg-accent dark:hover:bg-[#2a2a2a] transition-colors flex items-center justify-center gap-2"
          >
            <Filter className="w-5 h-5" />
            Filtros
          </button>
          <button
            onClick={() => setShowNewTransaction(true)}
            className="w-full sm:w-auto px-4 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nova Transacao
          </button>
        </div>
      </div>

      {showAdvancedFilters && (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <NativeSelect
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full lg:w-auto px-4 py-3 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
          >
            <option value="todos">Todas Categorias</option>
            {allCategories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </NativeSelect>
          <NativeSelect
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full lg:w-auto px-4 py-3 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
          >
            <option value="todos">Todos Status</option>
            <option value="Pago">Pago</option>
            <option value="Pendente">Pendente</option>
          </NativeSelect>
          <NativeSelect
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full lg:w-auto px-4 py-3 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
          >
            <option value="todos">Todos Tipos</option>
            <option value="receita">{transactionTypeLabels.receita}</option>
            <option value="despesa">{transactionTypeLabels.despesa}</option>
          </NativeSelect>
        </div>
      )}

      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted dark:bg-[#0d0d0d]">
              <tr>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Tipo</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Descricao</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Data</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Valor</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Status</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Animal</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Categoria</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-[rgba(255,255,255,0.1)]">
              {isLoadingTransactions && (
                <tr>
                  <td colSpan={7} className="px-6 py-6 text-center text-sm text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Carregando transacoes...
                    </div>
                  </td>
                </tr>
              )}

              {!isLoadingTransactions && filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-6 text-center text-sm text-muted-foreground">
                    Nenhuma transacao encontrada.
                  </td>
                </tr>
              )}

              {filteredTransactions.map((transaction) => {
                const statusLabel = getStatusLabel(transaction);
                return (
                  <tr key={transaction.id} className="hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors">
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          transaction.type === 'receita'
                            ? 'bg-green-500/20 text-green-500'
                            : 'bg-red-500/20 text-red-500'
                        }`}
                      >
                        {transaction.type === 'receita' ? transactionTypeLabels.receita : transactionTypeLabels.despesa}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-foreground dark:text-white">{transaction.description}</td>
                    <td className="px-6 py-4 text-foreground dark:text-white">{formatDate(transaction.date)}</td>
                    <td className="px-6 py-4 text-foreground dark:text-white">{formatCurrency(transaction.amount)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          statusLabel === 'Pago'
                            ? 'bg-green-500/20 text-green-500'
                            : 'bg-yellow-500/20 text-yellow-500'
                        }`}
                      >
                        {statusLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground dark:text-[#99a1af]">
                      {transaction.animal?.name || '-'}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground dark:text-[#99a1af]">
                      {getCategoryLabel(transaction.category)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AdvisorTransactionModal
        isOpen={showNewTransaction}
        onClose={() => setShowNewTransaction(false)}
        onCreate={handleSaveTransaction}
        harasId={harasId}
        animals={animals}
        isSaving={isCreating}
      />
    </div>
  );
}
