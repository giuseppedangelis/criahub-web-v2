'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Users, Activity, Database, AlertTriangle, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  getPlatformMetrics,
  getTopHarasUsage,
  formatNumber,
  formatStorageSize,
  type PlatformMetrics,
  type TopHarasUsage
} from '@/services/admin/metrics';

export function AdminPlatformUsageContent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [topHaras, setTopHaras] = useState<TopHarasUsage[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [metricsData, topHarasData] = await Promise.all([
        getPlatformMetrics(),
        getTopHarasUsage(5)
      ]);

      setMetrics(metricsData);
      setTopHaras(topHarasData);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar métricas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-destructive">
        {error}
      </div>
    );
  }

  // Prepare chart data from growth_data
  const chartData = (metrics?.growth_data || []).map(item => ({
    month: item.month.replace('. de ', '/').replace(' de ', '/'),
    haras: item.haras,
    usuarios: item.users,
    animais: item.animals,
  }));

  // Calculate derived metrics
  const totalHaras = metrics?.total_haras || 0;
  const totalUsers = metrics?.total_users || 0;
  const totalAnimals = metrics?.total_animals || 0;
  const activeToday = metrics?.active_users_today || 0;
  const storageGB = metrics?.storage_used_gb || 0;
  const avgAnimalsPerHaras = totalHaras > 0 ? Math.round(totalAnimals / totalHaras) : 0;

  // Calculate new haras this month from growth data
  const lastMonthData = chartData[chartData.length - 1];
  const newHarasThisMonth = lastMonthData?.haras || 0;

  // Get low usage haras for alerts
  const lowUsageHaras = topHaras
    .filter(h => h.animals_count === 0 && h.transactions_count === 0)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card: Total de Haras */}
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] p-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Total de Haras</p>
            <p className="text-4xl text-foreground dark:text-white">{formatNumber(totalHaras)}</p>
            <p className="text-sm text-green-600 dark:text-green-400">
              +{newHarasThisMonth} Novos no Mês
            </p>
          </div>
        </div>

        {/* Card: Usuários Ativos */}
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] p-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Usuários Cadastrados</p>
            <p className="text-4xl text-foreground dark:text-white">{formatNumber(totalUsers)}</p>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              {activeToday} Ativos Hoje
            </p>
          </div>
        </div>

        {/* Card: Total de Animais */}
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] p-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Total de Animais</p>
            <p className="text-4xl text-foreground dark:text-white">{formatNumber(totalAnimals)}</p>
            <p className="text-sm text-purple-600 dark:text-purple-400">
              Média de {avgAnimalsPerHaras} por Haras
            </p>
          </div>
        </div>

        {/* Card: Volume de Mídias */}
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] p-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <Database className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Armazenamento</p>
            <p className="text-4xl text-foreground dark:text-white">{formatStorageSize(storageGB)}</p>
            <p className="text-sm text-red-600 dark:text-red-400">
              Utilizado em Arquivos
            </p>
          </div>
        </div>
      </div>

      {/* Gráfico de Crescimento */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] p-6">
        <h2 className="text-xl text-foreground dark:text-white mb-6">
          Crescimento de Novos Haras (Últimos 6 Meses)
        </h2>
        {chartData.length > 0 ? (
          <div className="h-64 -mx-4 md:mx-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="month"
                  stroke="#99a1af"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="#99a1af"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(26, 26, 26, 0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="haras"
                  name="Haras"
                  stroke="#2472BC"
                  strokeWidth={3}
                  dot={{ fill: '#2472BC', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Sem dados de crescimento disponíveis
          </div>
        )}
      </div>

      {/* Distribuição de Planos */}
      {metrics?.plan_distribution && metrics.plan_distribution.length > 0 && (
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] p-6">
          <h2 className="text-xl text-foreground dark:text-white mb-6">
            Distribuição de Planos
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.plan_distribution.map((plan, index) => {
              const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-amber-500'];
              return (
                <div key={plan.plan} className="text-center p-4 bg-muted dark:bg-[#0d0d0d] rounded-xl">
                  <div className={`w-4 h-4 mx-auto mb-2 rounded-full ${colors[index % colors.length]}`} />
                  <p className="text-2xl font-bold text-foreground dark:text-white">{plan.count}</p>
                  <p className="text-sm text-muted-foreground capitalize">{plan.plan}</p>
                  <p className="text-xs text-muted-foreground">
                    {Math.round(plan.percentage * 100)}%
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Uso por Funcionalidade */}
      {metrics?.feature_usage && metrics.feature_usage.length > 0 && (
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] p-6">
          <h2 className="text-xl text-foreground dark:text-white mb-6">
            Uso por Funcionalidade
          </h2>
          <div className="space-y-4">
            {metrics.feature_usage.map((feature) => (
              <div key={feature.feature} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{feature.feature}</span>
                  <span className="text-foreground font-medium">
                    {feature.usage_count} haras ({Math.round(feature.percentage * 100)}%)
                  </span>
                </div>
                <div className="h-2 bg-muted dark:bg-[#0d0d0d] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${feature.percentage * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alertas de Risco */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] overflow-hidden">
        <div className="p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h2 className="text-xl text-foreground dark:text-white">
              Haras com Baixo Uso (Risco de Cancelamento)
            </h2>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted dark:bg-[#0d0d0d] border-b border-border dark:border-[rgba(255,255,255,0.1)]">
              <tr>
                <th className="px-6 py-4 text-left text-foreground dark:text-white">Haras</th>
                <th className="px-6 py-4 text-left text-foreground dark:text-white">Animais</th>
                <th className="px-6 py-4 text-left text-foreground dark:text-white">Usuários</th>
                <th className="px-6 py-4 text-left text-foreground dark:text-white">Transações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-[rgba(255,255,255,0.1)]">
              {lowUsageHaras.length > 0 ? (
                lowUsageHaras.map((haras) => (
                  <tr key={haras.haras_id} className="hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors">
                    <td className="px-6 py-4 text-foreground dark:text-white">{haras.haras_name}</td>
                    <td className="px-6 py-4 text-muted-foreground dark:text-[#99a1af]">{haras.animals_count}</td>
                    <td className="px-6 py-4 text-muted-foreground dark:text-[#99a1af]">{haras.users_count}</td>
                    <td className="px-6 py-4 text-muted-foreground dark:text-[#99a1af]">{haras.transactions_count}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    Nenhum haras com baixo uso identificado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden p-4 space-y-4">
          {lowUsageHaras.length > 0 ? (
            lowUsageHaras.map((haras) => (
              <div
                key={haras.haras_id}
                className="bg-muted dark:bg-[#0d0d0d] rounded-xl p-4 space-y-3"
              >
                <p className="text-foreground dark:text-white font-medium">{haras.haras_name}</p>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Animais</p>
                    <p className="text-foreground dark:text-white">{haras.animals_count}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Usuários</p>
                    <p className="text-foreground dark:text-white">{haras.users_count}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Transações</p>
                    <p className="text-foreground dark:text-white">{haras.transactions_count}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum haras com baixo uso identificado
            </div>
          )}
        </div>
      </div>
    </div>
  );
}