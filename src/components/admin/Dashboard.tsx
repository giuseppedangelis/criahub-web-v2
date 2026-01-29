import { TrendingUp, TrendingDown, Users, BarChart3, AlertTriangle, Repeat } from 'lucide-react';
import { PageType } from '@/types';
import svgPaths from '../../imports/svg-x3gg5gf77d';

interface DashboardProps {
  onNavigate: (page: PageType) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const metrics = [
    {
      title: 'Receita Total',
      value: '728',
      change: '+12.5%',
      trend: 'up' as const,
      color: 'emerald',
      icon: TrendingUp,
    },
    {
      title: 'Assinaturas Ativas',
      value: '1,245',
      change: '+5%',
      trend: 'up' as const,
      color: 'blue',
      icon: Users,
    },
    {
      title: 'Taxa de Cancelamentos',
      value: '1.8%',
      change: '+0.3%',
      trend: 'down' as const,
      color: 'red',
      icon: TrendingDown,
    },
    {
      title: 'Conversão de Planos',
      value: '65%',
      change: '+2.1%',
      trend: 'up' as const,
      color: 'violet',
      icon: Repeat,
    },
  ];

  const conversionData = [
    { label: 'Leads', percentage: 100, color: 'bg-red-500' },
    { label: 'Trial', percentage: 73, color: 'bg-violet-500' },
    { label: 'Pago', percentage: 53, color: 'bg-emerald-500' },
  ];

  return (
    <div className="p-6 md:p-12 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-foreground dark:text-white">Dashboard</h1>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const isPositive = metric.trend === 'up';
          
          const colorClasses = {
            emerald: {
              bg: 'bg-emerald-500',
              text: 'text-emerald-500',
            },
            blue: {
              bg: 'bg-[#2472bc]',
              text: 'text-[#2472bc]',
            },
            red: {
              bg: 'bg-red-500',
              text: 'text-red-500',
            },
            violet: {
              bg: 'bg-violet-500',
              text: 'text-violet-500',
            },
          };

          const colors = colorClasses[metric.color as keyof typeof colorClasses];

          return (
            <div
              key={metric.title}
              className="bg-[#1a1a1a] border border-[#333333] rounded-2xl p-6 space-y-3 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.3)]"
            >
              {/* Badge and Change */}
              <div className="flex items-center gap-6">
                <div className={`${colors.bg} p-3 rounded-xl`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-2xl ${colors.text}`}>
                  {metric.change}
                </span>
              </div>

              {/* Title */}
              <p className="text-sm text-gray-400">{metric.title}</p>

              {/* Value */}
              <p className="text-3xl text-white">{metric.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-[#1a1a1a] border border-[#333333] rounded-2xl p-6 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.3)]">
          <h3 className="text-white mb-8">Evolução da Receita Mensal</h3>
          
          {/* Chart Area */}
          <div className="relative h-[140px] mb-4">
            {/* SVG Line Chart */}
            <svg className="w-full h-full" viewBox="0 0 463 91" fill="none" preserveAspectRatio="none">
              <path 
                d={svgPaths.p3c324108} 
                stroke="#2472BC" 
                strokeWidth="3"
                fill="none"
              />
            </svg>
          </div>

          {/* X-axis labels */}
          <div className="flex justify-between text-[10px] text-[#b7c3d1]">
            <span>S1</span>
            <span>S2</span>
            <span>S3</span>
            <span>S4</span>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-[#1a1a1a] border border-[#333333] rounded-2xl p-6 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.3)]">
          <h3 className="text-white mb-8">Conversão de Assinaturas</h3>
          
          <div className="space-y-6">
            {conversionData.map((item) => (
              <div key={item.label} className="flex items-center gap-4">
                {/* Label */}
                <div className="w-16">
                  <p className="text-sm text-gray-400">{item.label}</p>
                </div>

                {/* Bar */}
                <div className="flex-1 bg-[#0d0d0d] rounded-md h-9 overflow-hidden">
                  <div 
                    className={`${item.color} h-full rounded-md transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shortcuts */}
      <div className="space-y-6">
        <h2 className="text-2xl text-white">Atalhos</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Platform Usage Metrics */}
          <button
            onClick={() => onNavigate('usage')}
            className="bg-[#1a1a1a] border border-[#333333] rounded-2xl p-6 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.3)] hover:border-[#4a4a4a] transition-colors text-left"
          >
            <div className="flex items-center gap-6">
              <div className="bg-cyan-500 p-3 rounded-xl shrink-0">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg text-white">Métricas de Uso da Plataforma</h3>
                <p className="text-sm text-gray-400">Acompanhe o desempenho e a atividade dos usuários na plataforma.</p>
              </div>
            </div>
          </button>

          {/* Critical Alerts */}
          <button
            onClick={() => onNavigate('alerts')}
            className="bg-[#1a1a1a] border border-[#333333] rounded-2xl p-6 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.3)] hover:border-[#4a4a4a] transition-colors text-left"
          >
            <div className="flex items-center gap-6">
              <div className="bg-amber-500 p-3 rounded-xl shrink-0">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg text-white">Alertas Críticos do Sistema</h3>
                <p className="text-sm text-gray-400">Log de erros, falhas de sincronização e problemas de integração.</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
