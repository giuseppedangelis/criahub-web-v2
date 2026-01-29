import { DollarSign, TrendingUp, TrendingDown, AlertCircle, Plus, FileText } from 'lucide-react';
import { useState } from 'react';
import { BreederRevenueContent } from './BreederRevenueContent';
import { BreederExpenseContent } from './BreederExpenseContent';
import { BreederReportsContent } from './BreederReportsContent';
import { BreederTransactionModal } from './BreederTransactionModal';

type FinancialView = 'dashboard' | 'receitas' | 'despesas' | 'relatorios';

interface Transaction {
  id: number;
  tipo: 'entrada' | 'saida';
  categoria: string;
  data: string;
  descricao: string;
  valor: string;
  status: string;
  animal?: string;
}

export function BreederFinancialContent() {
  const [currentView, setCurrentView] = useState<FinancialView>('dashboard');
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionType, setTransactionType] = useState<'entrada' | 'saida'>('entrada');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleOpenModal = (type: 'entrada' | 'saida') => {
    setTransactionType(type);
    setShowTransactionModal(true);
  };

  const handleSaveTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      id: transactions.length + 1,
      ...transaction,
    };
    setTransactions([newTransaction, ...transactions]);
  };

  // Se não estiver no dashboard, mostrar a view correspondente
  if (currentView === 'receitas') {
    return <BreederRevenueContent onBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'despesas') {
    return <BreederExpenseContent onBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'relatorios') {
    return <BreederReportsContent onBack={() => setCurrentView('dashboard')} />;
  }

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <MetricCard title="Receita Total" value="R$ 742.500" trend="+12%" trendUp />
        <MetricCard title="Despesa Total" value="R$ 546.000" trend="+8%" trendUp={false} />
        <MetricCard title="Saldo Atual" value="R$ 196.500" subtitle="Positivo" />
        <MetricCard title="Receita Pendente" value="R$ 85.200" />
        <MetricCard title="Despesa Prevista" value="R$ 52.800" subtitle="Próx. mês" />
      </div>

      {/* Actions */}
      <div className="flex flex-col lg:flex-row gap-3">
        <button 
          onClick={() => handleOpenModal('entrada')}
          className="px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Registrar Receita
        </button>
        <button 
          onClick={() => handleOpenModal('saida')}
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
            {[
              { month: 'Jul', revenue: 65, expense: 45 },
              { month: 'Ago', revenue: 70, expense: 50 },
              { month: 'Set', revenue: 60, expense: 48 },
              { month: 'Out', revenue: 75, expense: 52 },
              { month: 'Nov', revenue: 80, expense: 55 },
              { month: 'Dez', revenue: 85, expense: 60 },
            ].map((data, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex gap-1 items-end h-48">
                  <div 
                    className="flex-1 bg-green-500 rounded-t"
                    style={{ height: `${data.revenue}%` }}
                  />
                  <div 
                    className="flex-1 bg-red-500 rounded-t"
                    style={{ height: `${data.expense}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground dark:text-[#99a1af]">{data.month}</span>
              </div>
            ))}
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
                <circle cx="96" cy="96" r="80" fill="none" stroke="currentColor" strokeWidth="32" className="text-blue-500" strokeDasharray="150 314" />
                <circle cx="96" cy="96" r="80" fill="none" stroke="currentColor" strokeWidth="32" className="text-green-500" strokeDasharray="100 314" strokeDashoffset="-150" />
                <circle cx="96" cy="96" r="80" fill="none" stroke="currentColor" strokeWidth="32" className="text-yellow-500" strokeDasharray="64 314" strokeDashoffset="-250" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl text-foreground dark:text-white">100%</p>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Total</p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-foreground dark:text-white">Alimentação</span>
              </div>
              <span className="text-sm text-muted-foreground dark:text-[#99a1af]">48%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-foreground dark:text-white">Veterinário</span>
              </div>
              <span className="text-sm text-muted-foreground dark:text-[#99a1af]">32%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-foreground dark:text-white">Outros</span>
              </div>
              <span className="text-sm text-muted-foreground dark:text-[#99a1af]">20%</span>
            </div>
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
              <TransactionRow
                date="15/11/2024"
                description="Venda de Potro"
                animal="Vento Sul"
                type="Receita"
                value="R$ 15.000"
                isRevenue
              />
              <TransactionRow
                date="14/11/2024"
                description="Consulta Veterinária"
                animal="Estrela Mangalarga"
                type="Despesa"
                value="R$ 500"
                isRevenue={false}
              />
              <TransactionRow
                date="12/11/2024"
                description="Cobertura"
                animal="Bella Vista"
                type="Receita"
                value="R$ 3.500"
                isRevenue
              />
              <TransactionRow
                date="10/11/2024"
                description="Ração e Suplementos"
                animal="Plantel"
                type="Despesa"
                value="R$ 2.800"
                isRevenue={false}
              />
              <TransactionRow
                date="08/11/2024"
                description="Venda de Óvulos"
                animal="Lua Dourada"
                type="Receita"
                value="R$ 8.000"
                isRevenue
              />
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Modal */}
      <BreederTransactionModal
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        initialType={transactionType}
        onSave={handleSaveTransaction}
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