import { Building2, Users, Smartphone, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useTheme } from '../../contexts/ThemeContext';

export function PlatformUsage() {
  const { theme } = useTheme();

  const metrics = [
    {
      title: 'Total de Haras',
      value: '145',
      subtitle: '+12 no mês',
      icon: Building2,
      color: 'text-gray-900',
    },
    {
      title: 'Usuários Ativos',
      value: '580',
      subtitle: '92% de engajamento',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Total de Animais',
      value: '5.200',
      subtitle: 'Cadastrados na plataforma',
      icon: Smartphone,
      color: 'text-purple-600',
    },
    {
      title: 'Atividades Realizadas',
      value: '1.8 TB',
      subtitle: '70% fotos / 30% docs',
      icon: Activity,
      color: 'text-gray-900',
    },
  ];

  return (
    <div className={`p-8 min-h-full transition-colors ${
      theme === 'dark' ? 'bg-[#0d0d0d]' : 'bg-gray-50'
    }`}>
      <div className="mb-8">
        <h1 className={theme === 'dark' ? 'text-white mb-2' : 'text-gray-900 mb-2'}>
          Métricas de Uso da Plataforma
        </h1>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
          Acompanhe indicadores de utilização e engajamento
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-gray-600">{metric.title}</CardTitle>
                <Icon className={`w-5 h-5 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-gray-900 mb-1">{metric.value}</div>
                <p className="text-gray-500">{metric.subtitle}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}