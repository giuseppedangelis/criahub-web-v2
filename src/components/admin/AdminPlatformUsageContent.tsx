import { TrendingUp, Users, Activity, Database, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function AdminPlatformUsageContent() {
  // Dados do gráfico de crescimento
  const growthData = [
    { month: 'Jan', value: 120 },
    { month: 'Fev', value: 125 },
    { month: 'Mar', value: 122 },
    { month: 'Abr', value: 128 },
    { month: 'Mai', value: 130 },
    { month: 'Jun', value: 127 },
    { month: 'Jul', value: 132 },
    { month: 'Ago', value: 129 },
    { month: 'Set', value: 135 },
    { month: 'Out', value: 142 },
    { month: 'Nov', value: 140 },
    { month: 'Dez', value: 145 },
  ];

  // Dados de alertas de risco
  const alerts = [
    { id: 1, haras: 'Haras Falcão', reason: 'Baixo Uso (Risco de Cancelamento)', plan: 'Premium' },
    { id: 2, haras: 'Haras Vanguarda', reason: '95% do Limite de Mídia Atingido', plan: 'Premium' },
  ];

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
            <p className="text-4xl text-foreground dark:text-white">145</p>
            <p className="text-sm text-green-600 dark:text-green-400">+12 Novos no Mês</p>
          </div>
        </div>

        {/* Card: Usuários Ativos */}
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] p-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Usuários Ativos</p>
            <p className="text-4xl text-foreground dark:text-white">580</p>
            <p className="text-sm text-blue-600 dark:text-blue-400">92% de Adesão</p>
          </div>
        </div>

        {/* Card: Total de Animais */}
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] p-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Total de Animais</p>
            <p className="text-4xl text-foreground dark:text-white">5.200</p>
            <p className="text-sm text-purple-600 dark:text-purple-400">Média de 35 por Haras</p>
          </div>
        </div>

        {/* Card: Volume de Mídias */}
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] p-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <Database className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Volume de Mídias</p>
            <p className="text-4xl text-foreground dark:text-white">1.8 TB</p>
            <p className="text-sm text-red-600 dark:text-red-400">70% Fotos / 30% Docs</p>
          </div>
        </div>
      </div>

      {/* Gráfico de Crescimento */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] p-6">
        <h2 className="text-xl text-foreground dark:text-white mb-6">
          Crescimento de Novos Haras (Últimos 12 Meses)
        </h2>
        <div className="h-64 -mx-4 md:mx-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData}>
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
                dataKey="value" 
                stroke="#2472BC" 
                strokeWidth={3}
                dot={{ fill: '#2472BC', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alertas de Risco */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] overflow-hidden">
        <div className="p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h2 className="text-xl text-foreground dark:text-white">
              Alertas de Risco (Cancelamento Iminente / Uso de Limite)
            </h2>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted dark:bg-[#0d0d0d] border-b border-border dark:border-[rgba(255,255,255,0.1)]">
              <tr>
                <th className="px-6 py-4 text-left text-foreground dark:text-white">Haras</th>
                <th className="px-6 py-4 text-left text-foreground dark:text-white">Motivo do Alerta</th>
                <th className="px-6 py-4 text-left text-foreground dark:text-white">Plano</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-[rgba(255,255,255,0.1)]">
              {alerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors">
                  <td className="px-6 py-4 text-foreground dark:text-white">{alert.haras}</td>
                  <td className="px-6 py-4 text-muted-foreground dark:text-[#99a1af]">{alert.reason}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                      {alert.plan}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden p-4 space-y-4">
          {alerts.map((alert) => (
            <div 
              key={alert.id}
              className="bg-muted dark:bg-[#0d0d0d] rounded-xl p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Haras</p>
                  <p className="text-foreground dark:text-white">{alert.haras}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                  {alert.plan}
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Motivo do Alerta</p>
                <p className="text-foreground dark:text-white">{alert.reason}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {alerts.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-muted-foreground dark:text-[#99a1af]">
              Nenhum alerta de risco no momento
            </p>
          </div>
        )}
      </div>
    </div>
  );
}