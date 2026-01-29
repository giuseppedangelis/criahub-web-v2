import { Stethoscope, Syringe, FileText, Activity, AlertTriangle, CheckCircle, Calendar, DollarSign, Download, Printer, TrendingUp } from 'lucide-react';

interface HealthDashboardProps {
  animalId: number;
  animalName: string;
}

interface Alert {
  id: string;
  type: 'urgent' | 'warning' | 'info';
  title: string;
  description: string;
  date: string;
}

interface RecentProcedure {
  id: string;
  type: string;
  date: string;
  veterinarian: string;
  status: string;
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  endDate: string;
}

export function HealthDashboard({ animalId, animalName }: HealthDashboardProps) {
  // Dados mock de alertas
  const alerts: Alert[] = [
    {
      id: '1',
      type: 'urgent',
      title: 'Vacina Atrasada',
      description: 'Encefalomielite - Atrasada há 3 meses',
      date: '2024-12-12'
    },
    {
      id: '2',
      type: 'warning',
      title: 'Consulta Agendada',
      description: 'Retorno marcado para 23/12/2024',
      date: '2024-12-23'
    },
    {
      id: '3',
      type: 'warning',
      title: 'Medicação em Andamento',
      description: 'Fenilbutazona - Finaliza em 3 dias',
      date: '2024-12-15'
    }
  ];

  // Procedimentos recentes
  const recentProcedures: RecentProcedure[] = [
    {
      id: '1',
      type: 'Consulta de Rotina',
      date: '2024-12-08',
      veterinarian: 'Dr. Carlos Mendes',
      status: 'concluído'
    },
    {
      id: '2',
      type: 'Hemograma Completo',
      date: '2024-12-05',
      veterinarian: 'Dra. Ana Paula Santos',
      status: 'concluído'
    },
    {
      id: '3',
      type: 'Raio-X Membros',
      date: '2024-11-20',
      veterinarian: 'Dr. Carlos Mendes',
      status: 'concluído'
    }
  ];

  // Vacinas pendentes
  const pendingVaccines = [
    { name: 'Encefalomielite', dueDate: '2024-09-15', status: 'overdue' },
    { name: 'Influenza Equina', dueDate: '2024-12-10', status: 'upcoming' }
  ];

  // Medicações em andamento
  const currentMedications: Medication[] = [
    {
      name: 'Fenilbutazona',
      dosage: '2g',
      frequency: 'A cada 12 horas',
      endDate: '2024-12-15'
    }
  ];

  // Dados de gastos
  const monthlyExpenses = [
    { month: 'Jul', amount: 850 },
    { month: 'Ago', amount: 2800 },
    { month: 'Set', amount: 450 },
    { month: 'Out', amount: 1930 },
    { month: 'Nov', amount: 1130 },
    { month: 'Dez', amount: 1130 }
  ];

  const totalAnnualCost = monthlyExpenses.reduce((sum, m) => sum + m.amount, 0);
  const avgMonthlyCost = totalAnnualCost / monthlyExpenses.length;
  const maxExpense = Math.max(...monthlyExpenses.map(m => m.amount));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const alertConfig = {
    'urgent': {
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      icon: AlertTriangle,
      iconColor: 'text-red-500',
      textColor: 'text-red-600 dark:text-red-400'
    },
    'warning': {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      icon: AlertTriangle,
      iconColor: 'text-amber-500',
      textColor: 'text-amber-600 dark:text-amber-400'
    },
    'info': {
      bg: 'bg-gray-500/10',
      border: 'border-gray-500/20',
      icon: Activity,
      iconColor: 'text-gray-500',
      textColor: 'text-gray-600 dark:text-gray-400'
    }
  };

  // Status geral de saúde (calculado com base nos dados)
  const healthScore = alerts.filter(a => a.type === 'urgent').length === 0 ? 'excelente' : 
                      alerts.filter(a => a.type === 'urgent').length === 1 ? 'atenção' : 'crítico';

  const healthScoreConfig = {
    'excelente': { color: 'text-emerald-500', bg: 'bg-emerald-500/20', label: 'Excelente' },
    'atenção': { color: 'text-amber-500', bg: 'bg-amber-500/20', label: 'Requer Atenção' },
    'crítico': { color: 'text-red-500', bg: 'bg-red-500/20', label: 'Crítico' }
  };

  const currentHealthScore = healthScoreConfig[healthScore];

  return (
    <div className="space-y-6">
      {/* Header com Ações */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h3 className="text-xl text-foreground dark:text-white">Dashboard de Saúde</h3>
          <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-1">
            Visão geral do estado de saúde de {animalName}
          </p>
        </div>
        <div className="flex gap-2 w-full lg:w-auto">
          <button className="flex-1 lg:flex-initial px-4 py-2 border border-border dark:border-[#333333] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <button className="flex-1 lg:flex-initial px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
        </div>
      </div>

      {/* Status Geral de Saúde */}
      <div className={`${currentHealthScore.bg} border ${currentHealthScore.bg.replace('/20', '/30')} rounded-2xl p-6`}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white dark:bg-[#1a1a1a] rounded-full flex items-center justify-center">
            <Activity className={`w-8 h-8 ${currentHealthScore.color}`} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Status Geral de Saúde</p>
            <p className={`text-2xl font-bold ${currentHealthScore.color}`}>{currentHealthScore.label}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Última Atualização</p>
            <p className="text-sm text-foreground dark:text-white font-medium">{formatDate('2024-12-08')}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Alertas Ativos</p>
            <p className="text-sm text-foreground dark:text-white font-medium">{alerts.length}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Próxima Consulta</p>
            <p className="text-sm text-foreground dark:text-white font-medium">23/12/2024</p>
          </div>
        </div>
      </div>

      {/* Grid de Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertas de Saúde */}
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg text-foreground dark:text-white font-medium">Alertas de Saúde</h4>
            <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
              {alerts.length}
            </div>
          </div>
          <div className="space-y-3">
            {alerts.map((alert) => {
              const config = alertConfig[alert.type];
              const Icon = config.icon;
              return (
                <div key={alert.id} className={`${config.bg} border ${config.border} rounded-lg p-3`}>
                  <div className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${config.textColor}`}>{alert.title}</p>
                      <p className="text-xs text-muted-foreground dark:text-[#99a1af] mt-1">{alert.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Últimas Consultas */}
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <h4 className="text-lg text-foreground dark:text-white font-medium mb-4">Últimas Consultas</h4>
          <div className="space-y-3">
            {recentProcedures.map((proc) => (
              <div key={proc.id} className="bg-muted dark:bg-[#0d0d0d] rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-foreground dark:text-white font-medium">{proc.type}</p>
                  <span className="text-xs text-emerald-500 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Concluído
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground dark:text-[#99a1af]">
                  <span>{proc.veterinarian}</span>
                  <span>{formatDate(proc.date)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vacinas Pendentes */}
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3 mb-4">
            <Syringe className="w-5 h-5 text-primary dark:text-white" />
            <h4 className="text-lg text-foreground dark:text-white font-medium">Vacinas Pendentes</h4>
          </div>
          <div className="space-y-3">
            {pendingVaccines.map((vaccine, index) => (
              <div key={index} className={`rounded-lg p-3 border ${vaccine.status === 'overdue' ? 'bg-red-500/10 border-red-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground dark:text-white font-medium">{vaccine.name}</p>
                    <p className="text-xs text-muted-foreground dark:text-[#99a1af] mt-1">
                      {vaccine.status === 'overdue' ? 'Atrasada desde ' : 'Prevista para '}
                      {formatDate(vaccine.dueDate)}
                    </p>
                  </div>
                  <span className={`text-xs font-medium ${vaccine.status === 'overdue' ? 'text-red-500' : 'text-amber-500'}`}>
                    {vaccine.status === 'overdue' ? 'ATRASADA' : 'PRÓXIMA'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Medicações em Andamento */}
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-5 h-5 text-primary dark:text-white" />
            <h4 className="text-lg text-foreground dark:text-white font-medium">Medicações em Andamento</h4>
          </div>
          {currentMedications.length > 0 ? (
            <div className="space-y-3">
              {currentMedications.map((med, index) => (
                <div key={index} className="bg-muted dark:bg-[#0d0d0d] rounded-lg p-4">
                  <p className="text-sm text-foreground dark:text-white font-medium mb-2">{med.name}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground dark:text-[#99a1af]">
                    <div>
                      <span className="block mb-1">Dosagem:</span>
                      <span className="text-foreground dark:text-white">{med.dosage}</span>
                    </div>
                    <div>
                      <span className="block mb-1">Frequência:</span>
                      <span className="text-foreground dark:text-white">{med.frequency}</span>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
                    <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
                      Término previsto: <span className="text-foreground dark:text-white">{formatDate(med.endDate)}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Nenhuma medicação em andamento</p>
            </div>
          )}
        </div>
      </div>

      {/* Gráfico de Gastos com Saúde */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="text-lg text-foreground dark:text-white font-medium">Gastos com Saúde</h4>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-1">Últimos 6 meses</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Média Mensal</p>
              <p className="text-lg font-bold text-foreground dark:text-white">{formatCurrency(avgMonthlyCost)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Total Período</p>
              <p className="text-lg font-bold text-foreground dark:text-white">{formatCurrency(totalAnnualCost)}</p>
            </div>
          </div>
        </div>

        {/* Gráfico de Barras */}
        <div className="h-48 flex items-end justify-around gap-3">
          {monthlyExpenses.map((expense, index) => {
            const percentage = (expense.amount / maxExpense) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="relative w-full flex flex-col justify-end" style={{ height: '160px' }}>
                  <div
                    className="w-full bg-primary dark:bg-white rounded-t-lg transition-all hover:opacity-80 cursor-pointer relative group"
                    style={{ height: `${percentage}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black dark:bg-white text-white dark:text-black px-2 py-1 rounded text-xs whitespace-nowrap">
                      {formatCurrency(expense.amount)}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground dark:text-[#99a1af]">{expense.month}</span>
              </div>
            );
          })}
        </div>

        {/* Legenda */}
        <div className="mt-6 pt-4 border-t border-border dark:border-[rgba(255,255,255,0.1)] grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-muted-foreground dark:text-[#99a1af]">Emergências: {formatCurrency(1250)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span className="text-muted-foreground dark:text-[#99a1af]">Consultas: {formatCurrency(1130)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span className="text-muted-foreground dark:text-[#99a1af]">Exames: {formatCurrency(1360)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}