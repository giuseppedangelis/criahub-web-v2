import { TrendingUp, TrendingDown, Users, XCircle, Target } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';

const revenueData = [
  { week: 'S1', value: 45000 },
  { week: 'S2', value: 52000 },
  { week: 'S3', value: 48000 },
  { week: 'S4', value: 61000 },
  { week: 'S5', value: 55000 },
  { week: 'S6', value: 67000 },
  { week: 'S7', value: 72800 },
];

const conversionData = [
  { stage: 'Leads', value: 2450, fill: '#ef4444' },
  { stage: 'Trial', value: 890, fill: '#8b5cf6' },
  { stage: 'Pago', value: 1245, fill: '#10b981' },
];

export function MobileDashboard() {
  const metrics = [
    {
      title: 'Receita Total',
      value: 'R$ 72.800',
      change: '+12.5%',
      trend: 'up' as const,
      icon: TrendingUp,
    },
    {
      title: 'Assinaturas Ativas',
      value: '1.245',
      change: '+5%',
      trend: 'up' as const,
      icon: Users,
    },
    {
      title: 'Taxa de Cancelamentos',
      value: '1.8%',
      change: '+0.3%',
      trend: 'down' as const,
      icon: XCircle,
    },
    {
      title: 'Conversão de Planos',
      value: '65%',
      change: '+2.1%',
      trend: 'up' as const,
      icon: Target,
    },
  ];

  return (
    <div className="p-4 space-y-4">
      <div>
        <h2 className="text-gray-900 mb-1">Dashboard</h2>
        <p className="text-gray-600">Performance em tempo real</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const isPositive = metric.trend === 'up';
          
          return (
            <Card key={metric.title}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">{metric.title}</span>
                  <Icon className={`w-4 h-4 ${isPositive ? 'text-gray-900' : 'text-red-600'}`} />
                </div>
                <div className="text-gray-900">{metric.value}</div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className={`flex items-center gap-1 ${isPositive ? 'text-gray-900' : 'text-red-600'}`}>
                  {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span>{metric.change}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução da Receita Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }}
                formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Conversion Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Conversão de Assinaturas</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={conversionData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis type="category" dataKey="stage" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}