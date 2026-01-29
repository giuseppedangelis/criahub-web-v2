import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, Heart, Activity, Calendar, Filter } from 'lucide-react';
import { useState } from 'react';

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('6months');
  const [activeTab, setActiveTab] = useState<'plantel' | 'reproducao' | 'saude' | 'financeiro'>('plantel');

  // Dados de crescimento do plantel
  const plantelGrowthData = [
    { month: 'Jul/24', total: 145, machos: 72, femeas: 73 },
    { month: 'Ago/24', total: 148, machos: 73, femeas: 75 },
    { month: 'Set/24', total: 152, machos: 75, femeas: 77 },
    { month: 'Out/24', total: 156, machos: 77, femeas: 79 },
    { month: 'Nov/24', total: 158, machos: 78, femeas: 80 },
    { month: 'Dez/24', total: 162, machos: 80, femeas: 82 },
  ];

  // Distribuição por categoria
  const categoryData = [
    { name: 'Potros', value: 35, color: '#10b981' },
    { name: 'Reprodutores', value: 42, color: '#3b82f6' },
    { name: 'Reprodutoras', value: 48, color: '#8b5cf6' },
    { name: 'Aposentados', value: 12, color: '#6b7280' },
    { name: 'Em Treinamento', value: 25, color: '#f59e0b' },
  ];

  // Distribuição por pelagem
  const pelagemData = [
    { name: 'Castanha', value: 45, color: '#92400e' },
    { name: 'Alazã', value: 38, color: '#dc2626' },
    { name: 'Tordilha', value: 28, color: '#6b7280' },
    { name: 'Pampa', value: 22, color: '#f97316' },
    { name: 'Outros', value: 29, color: '#4b5563' },
  ];

  // KPIs principais
  const kpis = [
    {
      id: 'total',
      label: 'Total de Animais',
      value: '162',
      change: '+3.2%',
      trend: 'up',
      icon: Users,
      color: 'text-primary dark:text-white',
      bgColor: 'bg-primary/10 dark:bg-white/10',
    },
    {
      id: 'value',
      label: 'Valor Estimado',
      value: 'R$ 8.2M',
      change: '+5.1%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      id: 'health',
      label: 'Taxa de Saúde',
      value: '96.3%',
      change: '+0.8%',
      trend: 'up',
      icon: Activity,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      id: 'breeding',
      label: 'Taxa de Concepção',
      value: '78%',
      change: '-2.1%',
      trend: 'down',
      icon: Heart,
      color: 'text-pink-600 dark:text-pink-400',
      bgColor: 'bg-pink-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl text-foreground dark:text-white mb-2">
            Dashboard Analítico
          </h2>
          <p className="text-muted-foreground dark:text-[#99a1af]">
            Análise completa do desempenho do haras
          </p>
        </div>

        {/* Filtro de Período */}
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
          >
            <option value="3months">Últimos 3 meses</option>
            <option value="6months">Últimos 6 meses</option>
            <option value="12months">Último ano</option>
            <option value="all">Todo período</option>
          </select>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          const TrendIcon = kpi.trend === 'up' ? TrendingUp : TrendingDown;
          return (
            <div
              key={kpi.id}
              className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                  <Icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                  kpi.trend === 'up'
                    ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                    : 'bg-red-500/10 text-red-600 dark:text-red-400'
                }`}>
                  <TrendIcon className="w-3 h-3" />
                  {kpi.change}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                  {kpi.label}
                </p>
                <p className="text-2xl text-foreground dark:text-white">
                  {kpi.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crescimento do Plantel */}
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] p-6">
          <div className="mb-6">
            <h3 className="text-lg text-foreground dark:text-white mb-1">
              Crescimento do Plantel
            </h3>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
              Evolução mensal dos últimos 6 meses
            </p>
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
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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

        {/* Métricas de Idade */}
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
              data={[
                { age: '0-2 anos', count: 35 },
                { age: '3-5 anos', count: 42 },
                { age: '6-10 anos', count: 48 },
                { age: '11-15 anos', count: 25 },
                { age: '16+ anos', count: 12 },
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

      {/* Insights */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-white/5 dark:to-white/10 rounded-2xl border border-primary/20 dark:border-white/20 p-6">
        <h3 className="text-lg text-foreground dark:text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Insights e Recomendações
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-card/50 dark:bg-[#1a1a1a]/50 rounded-lg">
            <p className="text-sm text-foreground dark:text-white mb-2">
              <strong>Crescimento Saudável:</strong> O plantel cresceu 3.2% nos últimos 6 meses, indicando boa gestão reprodutiva.
            </p>
          </div>
          <div className="p-4 bg-card/50 dark:bg-[#1a1a1a]/50 rounded-lg">
            <p className="text-sm text-foreground dark:text-white mb-2">
              <strong>Equilíbrio de Gênero:</strong> Proporção ideal de machos (49%) e fêmeas (51%) para reprodução.
            </p>
          </div>
          <div className="p-4 bg-card/50 dark:bg-[#1a1a1a]/50 rounded-lg">
            <p className="text-sm text-foreground dark:text-white mb-2">
              <strong>Valorização:</strong> Valor estimado aumentou 5.1%, acima da média do mercado (3.8%).
            </p>
          </div>
          <div className="p-4 bg-card/50 dark:bg-[#1a1a1a]/50 rounded-lg">
            <p className="text-sm text-foreground dark:text-white mb-2">
              <strong>Atenção:</strong> Taxa de concepção caiu 2.1%. Recomenda-se revisar protocolos reprodutivos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}