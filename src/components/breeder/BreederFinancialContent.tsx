import { TrendingUp, TrendingDown, AlertCircle, Plus, FileText } from 'lucide-react';
import { useMemo, useState } from 'react';
import { BreederRevenueContent } from './BreederRevenueContent';
import { BreederExpenseContent } from './BreederExpenseContent';
import { BreederReportsContent } from './BreederReportsContent';
import { BreederTransactionModal } from './BreederTransactionModal';
import { useUser } from '@/contexts/UserContext';
import { useAnimals } from '@/hooks/useAnimals';
import { useCreateTransaction, useFinancialSummary, useMonthlyFinancialData, useRecentTransactions } from '@/hooks/useFinancial';
import type { CreateTransactionInput, TransactionType } from '@/types';
import { formatCurrency, formatDate, getCategoryLabel } from './financialUtils';
import { toast } from 'sonner';

type FinancialView = 'dashboard' | 'receitas' | 'despesas' | 'relatorios';

export function BreederFinancialContent() {
  const { profile } = useUser();
  const harasId = profile?.haras_id || '';
  const [currentView, setCurrentView] = useState<FinancialView>('dashboard');
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionType, setTransactionType] = useState<TransactionType>('receita');

  const { data: animalsResponse } = useAnimals(
    { haras_id: harasId },
    { page: 1, limit: 200 },
    !!harasId
  );
  const animals = animalsResponse?.data || [];

  const { data: summary } = useFinancialSummary(harasId);
  const currentYear = new Date().getFullYear();
  const { data: monthlyData } = useMonthlyFinancialData(harasId, currentYear);
  const { data: recentTransactions } = useRecentTransactions(harasId, 5);
  const { mutateAsync: createTransaction, isPending: isCreating } = useCreateTransaction();

  const handleOpenModal = (type: TransactionType) => {
    setTransactionType(type);
    setShowTransactionModal(true);
  };

  const handleCreateTransaction = async (input: CreateTransactionInput) => {
    try {
      await createTransaction(input);
      toast.success('Transação registrada com sucesso!');
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      toast.error('Erro ao registrar transação.');
    }
  };

  const monthlySeries = useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return months.map((label, index) => {
      const entry = monthlyData?.find((item) => item.month === index + 1);
      return {
        month: label,
        revenue: entry?.revenue || 0,
        expense: entry?.expenses || 0,
      };
    });
  }, [monthlyData]);

  const maxMonthlyValue = useMemo(() => {
    return monthlySeries.reduce((max, item) => {
      return Math.max(max, item.revenue, item.expense);
    }, 0);
  }, [monthlySeries]);

  const expenseDistribution = useMemo(() => {
    const expenses = summary?.expensesByCategory || {};
    const entries = Object.entries(expenses)
      .map(([category, amount]) => ({
        category,
        amount: Number(amount) || 0,
      }))
      .filter((entry) => entry.amount > 0)
      .sort((a, b) => b.amount - a.amount);

    const total = entries.reduce((sum, entry) => sum + entry.amount, 0);
    if (!total) return { total: 0, items: [] as { category: string; amount: number; percent: number }[] };

    const items = entries.slice(0, 3).map((entry) => ({
      ...entry,
      percent: (entry.amount / total) * 100,
    }));

    return { total, items };
  }, [summary]);

  // Se não estiver no dashboard, mostrar a view correspondente
  if (currentView === 'receitas') {
    return (
      <BreederRevenueContent
        onBack={() => setCurrentView('dashboard')}
        harasId={harasId}
        animals={animals}
      />
    );
  }

  if (currentView === 'despesas') {
    return (
      <BreederExpenseContent
        onBack={() => setCurrentView('dashboard')}
        harasId={harasId}
        animals={animals}
      />
    );
  }

  if (currentView === 'relatorios') {
    return (
      <BreederReportsContent
        onBack={() => setCurrentView('dashboard')}
        harasId={harasId}
      />
    );
  }

  const totalRevenue = summary?.totalRevenue || 0;
  const totalExpenses = summary?.totalExpenses || 0;
  const balance = summary?.balance ?? totalRevenue - totalExpenses;

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <MetricCard title="Receita Total" value={formatCurrency(totalRevenue)} />
        <MetricCard title="Despesa Total" value={formatCurrency(totalExpenses)} />
        <MetricCard
          title="Saldo Atual"
          value={formatCurrency(balance)}
          subtitle={balance >= 0 ? 'Positivo' : 'Negativo'}
        />
        <MetricCard title="Receita Pendente" value={formatCurrency(0)} />
        <MetricCard title="Despesa Prevista" value={formatCurrency(0)} subtitle="Próx. mês" />
      </div>

      {/* Actions */}
      <div className="flex flex-col lg:flex-row gap-3">
        <button 
          onClick={() => handleOpenModal('receita')}
          className="px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Registrar Receita
        </button>
        <button 
          onClick={() => handleOpenModal('despesa')}
          className="px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Registrar Despesa
        </button>
        <button 
          onClick={() => setCurrentView('relatorios')}
          className="px-6 py-3 bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white rounded-lg hover:bg-accent dark:hover:bg-[#2a2a2a] transition-colors flex items-center justify-center gap-2"
        >
          <FileText className="w-5 h-5" />
          Relatório
        </button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Flow */}
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <h3 className="text-xl text-foreground dark:text-white mb-6">Fluxo de Caixa Mensal</h3>
          <div className="h-64 flex items-end justify-around gap-2">
            {monthlySeries.map((data, idx) => {
              const revenueHeight = maxMonthlyValue > 0 ? Math.max((data.revenue / maxMonthlyValue) * 100, 4) : 0;
              const expenseHeight = maxMonthlyValue > 0 ? Math.max((data.expense / maxMonthlyValue) * 100, 4) : 0;
              return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex gap-1 items-end h-48">
                  <div 
                    className="flex-1 bg-green-500 rounded-t"
                    style={{ height: `${revenueHeight}%` }}
                  />
                  <div 
                    className="flex-1 bg-red-500 rounded-t"
                    style={{ height: `${expenseHeight}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground dark:text-[#99a1af]">{data.month}</span>
              </div>
            )})}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-foreground dark:text-white">Receitas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm text-foreground dark:text-white">Despesas</span>
            </div>
          </div>
        </div>

        {/* Expense Distribution */}
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <h3 className="text-xl text-foreground dark:text-white mb-6">Distribuição de Despesas</h3>
          <div className="flex items-center justify-center h-64">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90">
                {expenseDistribution.items.length > 0 ? (
                  (() => {
                    const circumference = 314;
                    let offset = 0;
                    const colors = ['text-blue-500', 'text-green-500', 'text-yellow-500'];
                    return expenseDistribution.items.map((item, index) => {
                      const length = Math.round((item.percent / 100) * circumference);
                      const circle = (
                        <circle
                          key={item.category}
                          cx="96"
                          cy="96"
                          r="80"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="32"
                          className={colors[index] || 'text-gray-500'}
                          strokeDasharray={`${length} ${circumference}`}
                          strokeDashoffset={-offset}
                        />
                      );
                      offset += length;
                      return circle;
                    });
                  })()
                ) : (
                  <circle cx="96" cy="96" r="80" fill="none" stroke="currentColor" strokeWidth="32" className="text-muted" strokeDasharray="314 314" />
                )}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl text-foreground dark:text-white">
                    {expenseDistribution.total ? '100%' : '0%'}
                  </p>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Total</p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2 mt-4">
            {expenseDistribution.items.length > 0 ? (
              expenseDistribution.items.map((item, index) => {
                const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500'];
                return (
                  <div key={item.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${colors[index] || 'bg-gray-500'}`}></div>
                      <span className="text-sm text-foreground dark:text-white">
                        {getCategoryLabel(item.category)}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground dark:text-[#99a1af]">
                      {item.percent.toFixed(0)}%
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                Sem despesas registradas.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Additional Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center justify-between mb-4">
            <p className="text-muted-foreground dark:text-[#99a1af]">Pagamentos em Dia</p>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl text-foreground dark:text-white mb-2">94%</p>
          <div className="w-full bg-muted dark:bg-[#0d0d0d] rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
          </div>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            <p className="text-foreground dark:text-white">Atenção</p>
          </div>
          <p className="text-3xl text-foreground dark:text-white mb-1">3</p>
          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">contas vencendo em 7 dias</p>
        </div>

        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center justify-between mb-4">
            <p className="text-muted-foreground dark:text-[#99a1af]">Meta Mensal</p>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl text-foreground dark:text-white mb-2">78%</p>
          <div className="w-full bg-muted dark:bg-[#0d0d0d] rounded-full h-2">
            <div className="bg-primary dark:bg-white h-2 rounded-full" style={{ width: '78%' }}></div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
        <h3 className="text-xl text-foreground dark:text-white mb-6">Transações Recentes</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border dark:border-[rgba(255,255,255,0.1)]">
              <tr>
                <th className="text-left py-3 text-muted-foreground dark:text-[#99a1af]">Data</th>
                <th className="text-left py-3 text-muted-foreground dark:text-[#99a1af]">Descrição</th>
                <th className="text-left py-3 text-muted-foreground dark:text-[#99a1af]">Animal</th>
                <th className="text-left py-3 text-muted-foreground dark:text-[#99a1af]">Tipo</th>
                <th className="text-right py-3 text-muted-foreground dark:text-[#99a1af]">Valor</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions && recentTransactions.length > 0 ? (
                recentTransactions.map((transaction) => (
                  <TransactionRow
                    key={transaction.id}
                    date={formatDate(transaction.date)}
                    description={transaction.description}
                    animal={transaction.animal?.name || '-'}
                    type={transaction.type === 'receita' ? 'Receita' : 'Despesa'}
                    value={formatCurrency(transaction.amount)}
                    isRevenue={transaction.type === 'receita'}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted-foreground dark:text-[#99a1af]">
                    Nenhuma transação registrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Modal */}
      <BreederTransactionModal
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        initialType={transactionType}
        onCreate={handleCreateTransaction}
        harasId={harasId}
        animals={animals}
        isSaving={isCreating}
      />
    </div>
  );
}

function MetricCard({ title, value, trend, trendUp, subtitle }: any) {
  return (
    <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
      <p className="text-muted-foreground dark:text-[#99a1af] mb-2">{title}</p>
      <p className="text-3xl text-foreground dark:text-white mb-2">{value}</p>
      {trend && (
        <p className={`text-sm ${trendUp ? 'text-green-500' : 'text-red-500'}`}>{trend}</p>
      )}
      {subtitle && (
        <p className="text-sm text-muted-foreground dark:text-[#99a1af]">{subtitle}</p>
      )}
    </div>
  );
}

function TransactionRow({ date, description, animal, type, value, isRevenue }: any) {
  return (
    <tr className="border-b border-border dark:border-[rgba(255,255,255,0.1)] last:border-0">
      <td className="py-3 text-foreground dark:text-white">{date}</td>
      <td className="py-3 text-foreground dark:text-white">{description}</td>
      <td className="py-3 text-foreground dark:text-white">{animal}</td>
      <td className="py-3">
        <span className={`px-3 py-1 ${isRevenue ? 'bg-green-500' : 'bg-red-500'} text-white text-xs rounded-full`}>
          {type}
        </span>
      </td>
      <td className={`py-3 text-right ${isRevenue ? 'text-green-500' : 'text-red-500'}`}>
        {value}
      </td>
    </tr>
  );
}
