import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';
import { useFinancialSummary, useMonthlyFinancialData, useTransactions } from '@/hooks/useFinancial';
import { formatCurrency, getCategoryLabel } from './financialUtils';

interface AnimalReport {
  animal: string;
  receita: string;
  custo: string;
  lucro: string;
}

interface BreederReportsContentProps {
  onBack: () => void;
  harasId: string;
}

export function BreederReportsContent({ onBack, harasId }: BreederReportsContentProps) {
  const { data: summary } = useFinancialSummary(harasId);
  const currentYear = new Date().getFullYear();
  const { data: monthlyData } = useMonthlyFinancialData(harasId, currentYear);
  const { data: transactionsResponse } = useTransactions(
    { haras_id: harasId },
    { page: 1, limit: 500 },
    !!harasId
  );

  const animalReports: AnimalReport[] = useMemo(() => {
    const transactions = transactionsResponse?.data || [];
    const grouped: Record<string, { revenue: number; expenses: number }> = {};

    transactions.forEach((transaction) => {
      const animalName = transaction.animal?.name;
      if (!animalName) return;
      if (!grouped[animalName]) grouped[animalName] = { revenue: 0, expenses: 0 };

      if (transaction.type === 'receita') {
        grouped[animalName].revenue += transaction.amount;
      } else {
        grouped[animalName].expenses += transaction.amount;
      }
    });

    return Object.entries(grouped)
      .map(([animal, values]) => ({
        animal,
        revenue: values.revenue,
        expenses: values.expenses,
        net: values.revenue - values.expenses,
      }))
      .sort((a, b) => b.net - a.net)
      .slice(0, 8)
      .map((entry) => ({
        animal: entry.animal,
        receita: formatCurrency(entry.revenue),
        custo: formatCurrency(entry.expenses),
        lucro: formatCurrency(entry.net),
      }));
  }, [transactionsResponse]);

  const categoryData = useMemo(() => {
    const expenses = summary?.expensesByCategory || {};
    return Object.entries(expenses)
      .map(([category, amount]) => ({
        name: getCategoryLabel(category),
        valor: Number(amount) || 0,
      }))
      .filter((item) => item.valor > 0);
  }, [summary]);

  const cashFlowData = useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return months.map((label, index) => {
      const entry = monthlyData?.find((item) => item.month === index + 1);
      const revenue = entry?.revenue || 0;
      const expenses = entry?.expenses || 0;
      return {
        name: label,
        valor: revenue - expenses,
      };
    });
  }, [monthlyData]);

  return (
    <div className="space-y-6">
      {/* Breadcrumbs e Botão Voltar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground dark:text-[#99a1af]">Financeiro</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground dark:text-[#99a1af]" />
          <span className="text-foreground dark:text-white">Relatórios</span>
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
        <h1 className="text-2xl text-foreground dark:text-white">Relatórios Financeiros</h1>
        <p className="text-muted-foreground dark:text-[#99a1af] mt-2">
          Visualize e analise os dados financeiros do seu haras
        </p>
      </div>

      {/* Relatório de Custo-Benefício por Animal */}
      <div className="space-y-4">
        <h2 className="text-xl text-foreground dark:text-white">Relatório de Custo-Benefício por Animal</h2>
        
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          {/* Header da Tabela */}
          <div className="grid grid-cols-4 gap-4 px-4 mb-4">
            <p className="text-foreground dark:text-white">Animal</p>
            <p className="text-foreground dark:text-white">Receita Total</p>
            <p className="text-foreground dark:text-white">Custo Total</p>
            <p className="text-foreground dark:text-white">Lucro/Prejuízo</p>
          </div>

          {/* Linhas da Tabela */}
          <div className="space-y-4">
            {animalReports.length > 0 ? (
              animalReports.map((report, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 gap-4 items-center bg-muted dark:bg-[#3a3a3a] rounded-lg px-4 py-2"
                >
                  <p className="text-sm text-foreground dark:text-white">{report.animal}</p>
                  <p className="text-sm text-foreground dark:text-white">{report.receita}</p>
                  <p className="text-sm text-foreground dark:text-white">{report.custo}</p>
                  <p className="text-sm text-foreground dark:text-white">{report.lucro}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                Nenhum dado financeiro por animal.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Relatório por Categoria */}
      <div className="space-y-4">
        <h2 className="text-xl text-foreground dark:text-white">Relatório por Categoria</h2>
        
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <h3 className="text-foreground dark:text-white mb-6">Total de Gastos por Categoria</h3>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
              <XAxis 
                dataKey="name" 
                stroke="#6b6b6b"
                tick={{ fill: '#6b6b6b', fontSize: 14 }}
              />
              <YAxis 
                stroke="#6b6b6b"
                tick={{ fill: '#6b6b6b', fontSize: 14 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a1a', 
                  border: '1px solid #3a3a3a',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="valor" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          {categoryData.length === 0 && (
            <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-4">
              Nenhuma despesa registrada.
            </p>
          )}
        </div>
      </div>

      {/* Relatório de Fluxo de Caixa */}
      <div className="space-y-4">
        <h2 className="text-xl text-foreground dark:text-white">Relatório de Fluxo de Caixa</h2>
        
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <h3 className="text-foreground dark:text-white mb-6">Evolução de Receitas e Despesas</h3>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cashFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
              <XAxis 
                dataKey="name" 
                stroke="#6b6b6b"
                tick={{ fill: '#9eb8a8', fontSize: 13 }}
              />
              <YAxis 
                stroke="#6b6b6b"
                tick={{ fill: '#6b6b6b', fontSize: 13 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a1a', 
                  border: '1px solid #3a3a3a',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="valor" 
                stroke="#2472bc" 
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
