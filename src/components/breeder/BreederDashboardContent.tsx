import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, Calendar, Heart, Users, Activity, Plus, UserPlus, DollarSign, Filter, ChevronRight, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { AddEventForm } from './AddEventForm';
import { BreederCadastrarAnimal } from './BreederCadastrarAnimal';
import { NativeSelect } from '../ui/native-select';
import { useDashboard } from '@/hooks/useDashboard';

export function BreederDashboardContent({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [showCadastrarAnimal, setShowCadastrarAnimal] = useState(false);
  const [timeRange, setTimeRange] = useState('6months');

  const rangeMonths = timeRange === '3months'
    ? 3
    : timeRange === '12months'
      ? 12
      : timeRange === 'all'
        ? 24
        : 6;

  // Hook para buscar dados reais do dashboard
  const {
    stats,
    categoryDistribution,
    pelagemDistribution,
    growthData,
    ageDistribution,
    upcomingEvents,
    recentActivities,
    isLoading,
    hasNoHaras,
    refetch,
  } = useDashboard(undefined, { months: rangeMonths });

  // Dados de fallback para quando não há dados reais
  const defaultCategoryData = [
    { name: 'Potros', value: 0, color: '#10b981' },
    { name: 'Reprodutores', value: 0, color: '#3b82f6' },
    { name: 'Reprodutoras', value: 0, color: '#8b5cf6' },
    { name: 'Aposentados', value: 0, color: '#6b7280' },
    { name: 'Em Treinamento', value: 0, color: '#f59e0b' },
  ];

  const defaultPelagemData = [
    { name: 'Castanha', value: 0, color: '#92400e' },
    { name: 'Alazã', value: 0, color: '#dc2626' },
    { name: 'Tordilha', value: 0, color: '#6b7280' },
    { name: 'Pampa', value: 0, color: '#f97316' },
    { name: 'Outros', value: 0, color: '#4b5563' },
  ];

  // Usar dados reais ou fallback
  const categoryData = categoryDistribution.length > 0 ? categoryDistribution : defaultCategoryData;
  const pelagemData = pelagemDistribution.length > 0 ? pelagemDistribution : defaultPelagemData;
  const plantelGrowthData = growthData.length > 0 ? growthData : [
    { month: 'Jul/24', total: 0, machos: 0, femeas: 0 },
    { month: 'Ago/24', total: 0, machos: 0, femeas: 0 },
    { month: 'Set/24', total: 0, machos: 0, femeas: 0 },
    { month: 'Out/24', total: 0, machos: 0, femeas: 0 },
    { month: 'Nov/24', total: 0, machos: 0, femeas: 0 },
    { month: 'Dez/24', total: 0, machos: 0, femeas: 0 },
  ];

  const latestGrowth = plantelGrowthData[plantelGrowthData.length - 1]?.total ?? 0;
  const previousGrowth = plantelGrowthData[plantelGrowthData.length - 2]?.total ?? 0;
  const growthDelta = previousGrowth > 0 ? ((latestGrowth - previousGrowth) / previousGrowth) * 100 : 0;
  const animalChangeLabel = previousGrowth > 0
    ? `${growthDelta >= 0 ? '+' : ''}${growthDelta.toFixed(1)}%`
    : '0%';

  const hasFinancials = (stats?.monthlyRevenue ?? 0) > 0 || (stats?.monthlyExpenses ?? 0) > 0;
  const revenueTrend = hasFinancials && (stats?.monthlyRevenue ?? 0) < (stats?.monthlyExpenses ?? 0) ? 'down' : 'up';
  const revenueChangeLabel = hasFinancials
    ? (stats?.monthlyRevenue ?? 0) >= (stats?.monthlyExpenses ?? 0)
      ? 'Positivo'
      : 'Negativo'
    : '0%';

  if (showCadastrarAnimal) {
    return <BreederCadastrarAnimal onBack={() => setShowCadastrarAnimal(false)} />;
  }

  return (
    <div className="space-y-6">
      {/* Ações Rápidas com Filtro */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-col md:flex-row gap-3 flex-1">
          <button
            onClick={() => setShowCadastrarAnimal(true)}
            className="px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Cadastrar Animal
          </button>
          <button
            onClick={() => setShowNewEventModal(true)}
            className="px-6 py-3 border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors flex items-center justify-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            Agendar Evento
          </button>
          <button
            onClick={() => onNavigate?.('team')}
            className="px-6 py-3 border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Gerenciar Equipe
          </button>
        </div>

        {/* Filtro de Período */}
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
          <NativeSelect
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="3months">Últimos 3 meses</option>
            <option value="6months">Últimos 6 meses</option>
            <option value="12months">Último ano</option>
            <option value="all">Todo período</option>
          </NativeSelect>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Carregando dados...</span>
        </div>
      )}

      {/* Sem Haras vinculado */}
      {hasNoHaras && !isLoading && (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h3 className="text-lg text-foreground dark:text-white mb-2">
            Haras não vinculado
          </h3>
          <p className="text-muted-foreground dark:text-[#99a1af] mb-4">
            Seu usuário ainda não está vinculado a nenhum Haras. Entre em contato com o administrador para vincular sua conta.
          </p>
        </div>
      )}

      {/* KPIs Principais com Tendências */}
      {!isLoading && !hasNoHaras && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
              label="Total de Animais"
              value={stats?.totalAnimals?.toString() || '0'}
              change={animalChangeLabel}
              trend={growthDelta < 0 ? 'down' : 'up'}
              icon={Users}
              color="text-primary dark:text-white"
              bgColor="bg-primary/10 dark:bg-white/10"
              onClick={() => onNavigate?.('plantel')}
            />
            <KPICard
              label="Receita Mensal"
              value={`R$ ${(stats?.monthlyRevenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`}
              change={revenueChangeLabel}
              trend={revenueTrend}
              icon={DollarSign}
              color="text-green-600 dark:text-green-400"
              bgColor="bg-green-500/10"
              onClick={() => onNavigate?.('financial')}
            />
            <KPICard
              label="Machos / Fêmeas"
              value={`${stats?.totalMales || 0} / ${stats?.totalFemales || 0}`}
              change={stats?.totalAnimals && stats.totalAnimals > 0 ? 'Balanceado' : '-'}
              trend="up"
              icon={Activity}
              color="text-blue-600 dark:text-blue-400"
              bgColor="bg-blue-500/10"
            />
            <KPICard
              label="Gestações Ativas"
              value={stats?.activeGestations?.toString() || '0'}
              change={stats?.activeGestations && stats.activeGestations > 0 ? 'Ativo' : '-'}
              trend="up"
              icon={Heart}
              color="text-pink-600 dark:text-pink-400"
              bgColor="bg-pink-500/10"
              onClick={() => onNavigate?.('reproduction')}
            />
          </div>

          {/* Alertas Importantes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AlertCard
              type="warning"
              title="Atenção"
              value={stats?.animalsNeedingCare?.toString() || '0'}
              description="animais que precisam de cuidados"
              icon={AlertTriangle}
            />
            <AlertCard
              type="info"
              title="Serviços Hoje"
              value={stats?.scheduledEventsToday?.toString() || '0'}
              description="atividades agendadas"
              icon={Calendar}
              onClick={() => onNavigate?.('agenda')}
            />
            <AlertCard
              type="success"
              title="Éguas Gestantes"
              value={stats?.activeGestations?.toString() || '0'}
              description="gestações em andamento"
              icon={Heart}
              onClick={() => onNavigate?.('reproduction')}
            />
          </div>

          {/* Gráficos Analíticos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Crescimento do Plantel */}
            <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg text-foreground dark:text-white mb-1">
                    Crescimento do Plantel
                  </h3>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                    Evolução mensal dos últimos 6 meses
                  </p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={plantelGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.1)" />
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
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#ffffff',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="machos"
                    name="Machos"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="femeas"
                    name="Fêmeas"
                    stroke="#ec4899"
                    strokeWidth={2}
                    dot={{ fill: '#ec4899', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Distribuição por Categoria */}
            <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] p-6">
              <div className="mb-6">
                <h3 className="text-lg text-foreground dark:text-white mb-1">
                  Distribuição por Categoria
                </h3>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                  Classificação dos animais
                </p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(26, 26, 26, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#ffffff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {categoryData.map((cat) => (
                  <div key={cat.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-sm text-foreground dark:text-white">
                      {cat.name}: {cat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Distribuição por Pelagem */}
            <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] p-6">
              <div className="mb-6">
                <h3 className="text-lg text-foreground dark:text-white mb-1">
                  Distribuição por Pelagem
                </h3>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                  Variedade de pelagens do plantel
                </p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pelagemData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.1)" />
                  <XAxis
                    dataKey="name"
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
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#ffffff',
                    }}
                  />
                  <Bar dataKey="value" name="Quantidade">
                    {pelagemData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Distribuição de Idade */}
            <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] p-6">
              <div className="mb-6">
                <h3 className="text-lg text-foreground dark:text-white mb-1">
                  Distribuição de Idade
                </h3>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                  Faixas etárias do plantel
                </p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={ageDistribution.length > 0 ? ageDistribution : [
                    { age: '0-2 anos', count: 0 },
                    { age: '3-5 anos', count: 0 },
                    { age: '6-10 anos', count: 0 },
                    { age: '11-15 anos', count: 0 },
                    { age: '16+ anos', count: 0 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.1)" />
                  <XAxis
                    dataKey="age"
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
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#ffffff',
                    }}
                  />
                  <Bar dataKey="count" name="Animais" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Insights e Recomendações */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-white/5 dark:to-white/10 rounded-2xl border border-primary/20 dark:border-white/20 p-6">
            <h3 className="text-lg text-foreground dark:text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Insights e Recomendações
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-card/50 dark:bg-[#1a1a1a]/50 rounded-lg">
                <p className="text-sm text-foreground dark:text-white mb-2">
                  <strong>Plantel:</strong> {stats?.totalAnimals || 0} animais ativos ({stats?.totalMales || 0} machos, {stats?.totalFemales || 0} fêmeas)
                </p>
              </div>
              <div className="p-4 bg-card/50 dark:bg-[#1a1a1a]/50 rounded-lg">
                <p className="text-sm text-foreground dark:text-white mb-2">
                  <strong>Reprodução:</strong> {stats?.activeGestations || 0} gestações ativas no momento.
                </p>
              </div>
              <div className="p-4 bg-card/50 dark:bg-[#1a1a1a]/50 rounded-lg">
                <p className="text-sm text-foreground dark:text-white mb-2">
                  <strong>Financeiro:</strong> R$ {(stats?.monthlyRevenue || 0).toLocaleString('pt-BR')} em receitas este mês.
                </p>
              </div>
              <div className="p-4 bg-card/50 dark:bg-[#1a1a1a]/50 rounded-lg">
                <p className="text-sm text-foreground dark:text-white mb-2">
                  <strong>Agenda:</strong> {stats?.scheduledEventsToday || 0} eventos agendados para hoje.
                </p>
              </div>
            </div>
          </div>

          {/* Próximos Serviços */}
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg text-foreground dark:text-white">
                Próximos Serviços
              </h3>
              <button
                onClick={() => onNavigate?.('agenda')}
                className="text-sm text-primary dark:text-white hover:underline flex items-center gap-1"
              >
                Ver todos
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <ServiceItem
                    key={event.id}
                    title={event.title}
                    date={`${event.date}, ${event.time}`}
                    type={event.type}
                    priority={event.priority}
                  />
                ))
              ) : (
                <p className="text-muted-foreground dark:text-[#99a1af] text-center py-4">
                  Nenhum serviço agendado
                </p>
              )}
            </div>
          </div>

          {/* Atividades Recentes */}
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] p-6">
            <h3 className="text-lg text-foreground dark:text-white mb-6">
              Atividades Recentes
            </h3>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <ActivityItem
                    key={activity.id}
                    title={activity.title}
                    description={activity.description}
                    time={activity.time}
                    icon={activity.type === 'animal' ? Plus : activity.type === 'receita' ? DollarSign : Calendar}
                    iconColor={activity.type === 'animal' ? 'text-green-500' : activity.type === 'receita' ? 'text-green-600' : 'text-blue-500'}
                  />
                ))
              ) : (
                <p className="text-muted-foreground dark:text-[#99a1af] text-center py-4">
                  Nenhuma atividade recente
                </p>
              )}
            </div>
          </div>
        </>
      )}

      {/* Modals */}
      {showNewEventModal && (
        <AddEventForm
          onClose={() => setShowNewEventModal(false)}
          onSuccess={() => {
            setShowNewEventModal(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}

// Componente KPI Card com Tendência
interface KPICardProps {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  onClick?: () => void;
}

function KPICard({ label, value, change, trend, icon: Icon, color, bgColor, onClick }: KPICardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;

  return (
    <div
      onClick={onClick}
      className={`bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] p-6 transition-all ${onClick ? 'cursor-pointer hover:shadow-lg hover:scale-[1.02]' : ''
        }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${trend === 'up'
          ? 'bg-green-500/10 text-green-600 dark:text-green-400'
          : 'bg-red-500/10 text-red-600 dark:text-red-400'
          }`}>
          <TrendIcon className="w-3 h-3" />
          {change}
        </div>
      </div>
      <div>
        <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
          {label}
        </p>
        <p className="text-2xl text-foreground dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

// Componente Alert Card
interface AlertCardProps {
  type: 'warning' | 'info' | 'success';
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
}

function AlertCard({ type, title, value, description, icon: Icon, onClick }: AlertCardProps) {
  const colors = {
    warning: {
      bg: 'bg-orange-500/10',
      text: 'text-orange-600 dark:text-orange-400',
      border: 'border-orange-500/20',
    },
    info: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-500/20',
    },
    success: {
      bg: 'bg-green-500/10',
      text: 'text-green-600 dark:text-green-400',
      border: 'border-green-500/20',
    },
  };

  const style = colors[type];

  return (
    <div
      onClick={onClick}
      className={`${style.bg} border ${style.border} rounded-2xl p-6 transition-all ${onClick ? 'cursor-pointer hover:shadow-lg' : ''
        }`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${style.bg}`}>
          <Icon className={`w-6 h-6 ${style.text}`} />
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
            {title}
          </p>
          <p className={`text-2xl mb-1 ${style.text}`}>
            {value}
          </p>
          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

// Componente Service Item
interface ServiceItemProps {
  title: string;
  date: string;
  type: string;
  priority: 'high' | 'medium' | 'low';
}

function ServiceItem({ title, date, type, priority }: ServiceItemProps) {
  const priorityColors = {
    high: 'bg-red-500',
    medium: 'bg-orange-500',
    low: 'bg-green-500',
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg hover:bg-accent dark:hover:bg-[#2a2a2a] transition-colors cursor-pointer">
      <div className={`w-2 h-2 rounded-full ${priorityColors[priority]}`} />
      <div className="flex-1">
        <p className="text-foreground dark:text-white mb-1">{title}</p>
        <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
          {type} • {date}
        </p>
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
    </div>
  );
}

// Componente Activity Item
interface ActivityItemProps {
  title: string;
  description: string;
  time: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
}

function ActivityItem({ title, description, time, icon: Icon, iconColor }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-4 pb-4 border-b border-border dark:border-[rgba(255,255,255,0.1)] last:border-0 last:pb-0">
      <div className="p-2 rounded-lg bg-muted dark:bg-[#0d0d0d]">
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div className="flex-1">
        <p className="text-foreground dark:text-white mb-1">{title}</p>
        <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
          {description}
        </p>
        <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
          {time}
        </p>
      </div>
    </div>
  );
}
