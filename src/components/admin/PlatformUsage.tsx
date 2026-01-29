'use client';

import { Building2, Users, Dog, Activity, TrendingUp, HardDrive, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useTheme } from '../../contexts/ThemeContext';
import { useState, useEffect } from 'react';
import {
  getPlatformMetrics,
  getTopHarasUsage,
  type PlatformMetrics,
  type TopHarasUsage,
  formatNumber,
  formatStorageSize
} from '@/services/admin/metrics';

// Simple Sparkline Chart
function Sparkline({ data, color = '#3b82f6' }: { data: number[]; color?: string }) {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 80 - 10;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 100 50" className="w-full h-12">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

// Donut Chart for Plan Distribution
function DonutChart({ data }: { data: { plan: string; count: number; percentage: number }[] }) {
  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
  const total = data.reduce((sum, item) => sum + item.count, 0);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        Sem dados
      </div>
    );
  }

  let cumulativePercentage = 0;

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 36 36" className="w-24 h-24">
        {data.map((item, index) => {
          const percentage = (item.count / total) * 100;
          const dashArray = `${percentage} ${100 - percentage}`;
          const dashOffset = 100 - cumulativePercentage + 25;
          cumulativePercentage += percentage;

          return (
            <circle
              key={item.plan}
              cx="18"
              cy="18"
              r="15.915"
              fill="none"
              stroke={colors[index % colors.length]}
              strokeWidth="3"
              strokeDasharray={dashArray}
              strokeDashoffset={dashOffset}
              className="transition-all duration-500"
            />
          );
        })}
        <text
          x="18"
          y="18"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-foreground text-[6px] font-semibold"
        >
          {total}
        </text>
      </svg>
      <div className="flex flex-col gap-1">
        {data.map((item, index) => (
          <div key={item.plan} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="text-muted-foreground">{item.plan}:</span>
            <span className="text-foreground font-medium">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Progress Bar for Feature Usage
function FeatureBar({ feature, percentage }: { feature: string; percentage: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{feature}</span>
        <span className="text-foreground font-medium">{Math.round(percentage * 100)}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${percentage * 100}%` }}
        />
      </div>
    </div>
  );
}

export function PlatformUsage() {
  const { theme } = useTheme();
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [topHaras, setTopHaras] = useState<TopHarasUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
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
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className={`p-8 min-h-full flex items-center justify-center ${theme === 'dark' ? 'bg-[#0d0d0d]' : 'bg-gray-50'
        }`}>
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-8 min-h-full ${theme === 'dark' ? 'bg-[#0d0d0d]' : 'bg-gray-50'}`}>
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-destructive">
          {error}
        </div>
      </div>
    );
  }

  const mainMetrics = [
    {
      title: 'Total de Haras',
      value: formatNumber(metrics?.total_haras || 0),
      subtitle: 'Cadastrados na plataforma',
      icon: Building2,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Usuários Ativos',
      value: formatNumber(metrics?.total_users || 0),
      subtitle: `${metrics?.active_users_today || 0} ativos hoje`,
      icon: Users,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
    {
      title: 'Total de Animais',
      value: formatNumber(metrics?.total_animals || 0),
      subtitle: 'Cadastrados no sistema',
      icon: Dog,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Armazenamento',
      value: formatStorageSize(metrics?.storage_used_gb || 0),
      subtitle: 'Utilizado em arquivos',
      icon: HardDrive,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
  ];

  // Prepare growth data for sparklines
  const growthData = metrics?.growth_data || [];
  const harasGrowth = growthData.map(d => d.haras);
  const usersGrowth = growthData.map(d => d.users);
  const animalsGrowth = growthData.map(d => d.animals);

  return (
    <div className={`p-8 min-h-full transition-colors ${theme === 'dark' ? 'bg-[#0d0d0d]' : 'bg-gray-50'
      }`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-2xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Métricas de Uso da Plataforma
        </h1>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
          Acompanhe indicadores de utilização e engajamento em tempo real
        </p>
      </div>

      {/* Main Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {mainMetrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <Card key={metric.title} className="border-border dark:border-[rgba(255,255,255,0.1)] bg-card dark:bg-[#1a1a1a]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`w-4 h-4 ${metric.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground mb-1">{metric.value}</div>
                <p className="text-xs text-muted-foreground">{metric.subtitle}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Second Row: Growth Charts and Plan Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Growth Chart */}
        <Card className="border-border dark:border-[rgba(255,255,255,0.1)] bg-card dark:bg-[#1a1a1a]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <TrendingUp className="w-5 h-5 text-primary" />
              Crescimento (últimos 6 meses)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Haras</span>
                <span className="text-foreground font-medium">
                  {harasGrowth.reduce((a, b) => a + b, 0)} novos
                </span>
              </div>
              <Sparkline data={harasGrowth} color="#3b82f6" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Usuários</span>
                <span className="text-foreground font-medium">
                  {usersGrowth.reduce((a, b) => a + b, 0)} novos
                </span>
              </div>
              <Sparkline data={usersGrowth} color="#10b981" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Animais</span>
                <span className="text-foreground font-medium">
                  {animalsGrowth.reduce((a, b) => a + b, 0)} novos
                </span>
              </div>
              <Sparkline data={animalsGrowth} color="#8b5cf6" />
            </div>
          </CardContent>
        </Card>

        {/* Plan Distribution */}
        <Card className="border-border dark:border-[rgba(255,255,255,0.1)] bg-card dark:bg-[#1a1a1a]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Activity className="w-5 h-5 text-primary" />
              Distribuição de Planos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart data={metrics?.plan_distribution || []} />
          </CardContent>
        </Card>
      </div>

      {/* Third Row: Feature Usage and Top Haras */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Usage */}
        <Card className="border-border dark:border-[rgba(255,255,255,0.1)] bg-card dark:bg-[#1a1a1a]">
          <CardHeader>
            <CardTitle className="text-foreground">Uso por Funcionalidade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(metrics?.feature_usage || []).map((feature) => (
              <FeatureBar
                key={feature.feature}
                feature={feature.feature}
                percentage={feature.percentage}
              />
            ))}
          </CardContent>
        </Card>

        {/* Top Haras */}
        <Card className="border-border dark:border-[rgba(255,255,255,0.1)] bg-card dark:bg-[#1a1a1a]">
          <CardHeader>
            <CardTitle className="text-foreground">Top Haras Mais Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            {topHaras.length === 0 ? (
              <p className="text-muted-foreground text-sm">Nenhum haras encontrado</p>
            ) : (
              <div className="space-y-3">
                {topHaras.map((haras, index) => (
                  <div
                    key={haras.haras_id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 dark:bg-[#0d0d0d]"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${index === 0 ? 'bg-amber-500 text-black' :
                        index === 1 ? 'bg-gray-400 text-black' :
                          index === 2 ? 'bg-amber-700 text-white' :
                            'bg-muted text-muted-foreground'
                      }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground font-medium truncate">
                        {haras.haras_name || 'Haras sem nome'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {haras.animals_count} animais • {haras.users_count} usuários • {haras.transactions_count} transações
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}