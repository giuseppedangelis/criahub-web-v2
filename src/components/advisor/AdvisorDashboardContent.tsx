import { AlertTriangle, FileText, TrendingUp, TrendingDown, Upload, Plus, Users, CheckCircle, Clock, DollarSign, Eye, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface DashboardStats {
  pendingBirths: number;
  pendingOccurrences: number;
  activeAnimals: number;
  soldAnimals: number;
  deceasedAnimals: number;
  categoryPista: number;
  categoryPasto: number;
  categoryReproduction: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
}

interface AdvisorDashboardContentProps {
  onNavigateToPendencies?: () => void;
  onNavigateToImport?: () => void;
  onNavigateToFinancial?: () => void;
  onNavigateToDocuments?: () => void;
}

export function AdvisorDashboardContent({
  onNavigateToPendencies,
  onNavigateToImport,
  onNavigateToFinancial,
  onNavigateToDocuments,
}: AdvisorDashboardContentProps) {
  const [stats] = useState<DashboardStats>({
    pendingBirths: 3,
    pendingOccurrences: 2,
    activeAnimals: 45,
    soldAnimals: 12,
    deceasedAnimals: 3,
    categoryPista: 15,
    categoryPasto: 20,
    categoryReproduction: 10,
    monthlyRevenue: 45000,
    monthlyExpenses: 28500,
  });

  // Dados para gráfico de Status
  const statusData = [
    { name: 'Ativo', value: stats.activeAnimals, color: '#10b981' },
    { name: 'Vendido', value: stats.soldAnimals, color: '#6b7280' },
    { name: 'Falecido', value: stats.deceasedAnimals, color: '#ef4444' },
  ];

  // Dados para gráfico de Categoria
  const categoryData = [
    { name: 'Pista', value: stats.categoryPista, color: '#3b82f6' },
    { name: 'Pasto', value: stats.categoryPasto, color: '#10b981' },
    { name: 'Reprodução', value: stats.categoryReproduction, color: '#f59e0b' },
  ];

  // Dados para gráfico de barras do Financeiro
  const financialData = [
    { name: 'Receitas', value: stats.monthlyRevenue, color: '#10b981' },
    { name: 'Despesas', value: stats.monthlyExpenses, color: '#ef4444' },
  ];

  const balance = stats.monthlyRevenue - stats.monthlyExpenses;
  const totalPendencies = stats.pendingBirths + stats.pendingOccurrences;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
        <h1 className="text-2xl text-foreground dark:text-white mb-2">Painel de Controle Administrativo</h1>
        <p className="text-muted-foreground dark:text-[#99a1af]">
          Visão geral do escritório - {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Alertas de Pendências - DESTAQUE MÁXIMO */}
      {totalPendencies > 0 && (
        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 dark:from-orange-500/5 dark:to-red-500/5 border-2 border-orange-500 dark:border-orange-600 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg text-foreground dark:text-white mb-2">Pendências de Campo Aguardando Validação</h3>
              <p className="text-muted-foreground dark:text-[#99a1af] mb-4">
                Existem registros vindos do aplicativo móvel que precisam ser validados e oficializados no sistema.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-card dark:bg-[#1a1a1a] rounded-xl p-4 border border-border dark:border-[rgba(255,255,255,0.1)]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-500/10 dark:bg-pink-500/20 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                    </div>
                    <div>
                      <p className="text-2xl text-foreground dark:text-white">{stats.pendingBirths}</p>
                      <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Nascimentos para validar</p>
                    </div>
                  </div>
                </div>
                <div className="bg-card dark:bg-[#1a1a1a] rounded-xl p-4 border border-border dark:border-[rgba(255,255,255,0.1)]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500/10 dark:bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="text-2xl text-foreground dark:text-white">{stats.pendingOccurrences}</p>
                      <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Ocorrências sem tratativa</p>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={onNavigateToPendencies}
                className="w-full md:w-auto px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Eye className="w-5 h-5" />
                Validar Pendências Agora
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Atalhos Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={onNavigateToImport}
          className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)] hover:border-primary dark:hover:border-white/50 transition-all group text-left"
        >
          <div className="w-12 h-12 bg-primary/10 dark:bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6 text-primary dark:text-white" />
          </div>
          <h3 className="text-foreground dark:text-white mb-2">Importar Planilha</h3>
          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
            Importar dados da ABCCMM
          </p>
        </button>

        <button
          onClick={onNavigateToFinancial}
          className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)] hover:border-primary dark:hover:border-white/50 transition-all group text-left"
        >
          <div className="w-12 h-12 bg-green-500/10 dark:bg-green-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Plus className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-foreground dark:text-white mb-2">Nova OS</h3>
          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
            Criar ordem de serviço
          </p>
        </button>

        <button
          onClick={onNavigateToDocuments}
          className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)] hover:border-primary dark:hover:border-white/50 transition-all group text-left"
        >
          <div className="w-12 h-12 bg-blue-500/10 dark:bg-gray-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <FileText className="w-6 h-6 text-blue-600 dark:text-gray-400" />
          </div>
          <h3 className="text-foreground dark:text-white mb-2">Novo Contrato</h3>
          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
            Adicionar documento
          </p>
        </button>

        <button
          className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)] hover:border-primary dark:hover:border-white/50 transition-all group text-left"
        >
          <div className="w-12 h-12 bg-purple-500/10 dark:bg-gray-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6 text-purple-600 dark:text-gray-400" />
          </div>
          <h3 className="text-foreground dark:text-white mb-2">Gerenciar Equipe</h3>
          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
            Usuários e permissões
          </p>
        </button>
      </div>

      {/* Resumo do Plantel e Financeiro */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resumo do Plantel */}
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <h3 className="text-lg text-foreground dark:text-white mb-6">Resumo do Plantel</h3>
          
          {/* Status do Plantel */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-3">Status dos Animais</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Categoria */}
          <div>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-3">Distribuição por Categoria</p>
            <div className="space-y-2">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-foreground dark:text-white">{item.name}</span>
                  </div>
                  <span className="text-sm text-foreground dark:text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resumo Financeiro */}
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <h3 className="text-lg text-foreground dark:text-white mb-6">Financeiro do Mês</h3>
          
          {/* Cards de Resumo */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-green-500/10 dark:bg-green-500/5 rounded-xl p-4 border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Receitas</p>
              </div>
              <p className="text-lg text-foreground dark:text-white">
                R$ {(stats.monthlyRevenue / 1000).toFixed(1)}k
              </p>
            </div>

            <div className="bg-red-500/10 dark:bg-red-500/5 rounded-xl p-4 border border-red-500/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Despesas</p>
              </div>
              <p className="text-lg text-foreground dark:text-white">
                R$ {(stats.monthlyExpenses / 1000).toFixed(1)}k
              </p>
            </div>

            <div className={`${balance >= 0 ? 'bg-green-500/10 dark:bg-green-500/5 border-green-500/20' : 'bg-red-500/10 dark:bg-red-500/5 border-red-500/20'} rounded-xl p-4 border`}>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className={`w-4 h-4 ${balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
                <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Saldo</p>
              </div>
              <p className="text-lg text-foreground dark:text-white">
                R$ {(Math.abs(balance) / 1000).toFixed(1)}k
              </p>
            </div>
          </div>

          {/* Gráfico de Barras */}
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={financialData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="name" 
                stroke="rgba(255,255,255,0.5)" 
                tick={{ fill: 'rgba(255,255,255,0.7)' }}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.5)" 
                tick={{ fill: 'rgba(255,255,255,0.7)' }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {financialData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Estado Vazio - se não houver pendências */}
      {totalPendencies === 0 && (
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-12 border border-border dark:border-[rgba(255,255,255,0.1)] text-center">
          <div className="w-16 h-16 bg-green-500/10 dark:bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg text-foreground dark:text-white mb-2">Tudo em dia!</h3>
          <p className="text-muted-foreground dark:text-[#99a1af]">
            Não há pendências aguardando validação no momento.
          </p>
        </div>
      )}
    </div>
  );
}
