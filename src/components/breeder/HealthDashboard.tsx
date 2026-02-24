import { useMemo } from 'react';
import { Syringe, FileText, Activity, AlertTriangle, CheckCircle, Calendar, DollarSign, Download, Printer } from 'lucide-react';
import { useAnimalHealthRecords, useAnimalVaccines, useAnimalExams } from '@/hooks/useAnimalHealth';

interface HealthDashboardProps {
  animalId: string;
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

const MONTH_LABELS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function normalizeKey(value: string | null | undefined): string {
  if (!value) return '';
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function normalizeResult(value: string | null | undefined): 'normal' | 'alterado' | 'critico' {
  const key = normalizeKey(value || '');
  if (key.includes('crit')) return 'critico';
  if (key.includes('alter')) return 'alterado';
  return 'normal';
}

function getVaccineStatus(nextDose?: string | null): 'ok' | 'warning' | 'overdue' {
  if (!nextDose) return 'ok';
  const today = new Date();
  const doseDate = new Date(nextDose);
  const diffDays = Math.floor((doseDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'overdue';
  if (diffDays <= 30) return 'warning';
  return 'ok';
}

export function HealthDashboard({ animalId, animalName }: HealthDashboardProps) {
  const { data: procedures } = useAnimalHealthRecords(animalId);
  const { data: vaccines } = useAnimalVaccines(animalId);
  const { data: exams } = useAnimalExams(animalId);

  const vaccineStatus = useMemo(() => {
    return (vaccines || []).map((vaccine) => ({
      ...vaccine,
      status: getVaccineStatus(vaccine.next_dose_date),
    }));
  }, [vaccines]);

  const overdueVaccines = vaccineStatus.filter((v) => v.status === 'overdue');
  const warningVaccines = vaccineStatus.filter((v) => v.status === 'warning');
  const criticalExams = (exams || []).filter((exam) => normalizeResult(exam.result) === 'critico');

  const nextAppointmentDate = (procedures || [])
    .map((proc) => proc.next_date)
    .filter((date): date is string => Boolean(date))
    .map((date) => new Date(date))
    .filter((date) => date >= new Date())
    .sort((a, b) => a.getTime() - b.getTime())[0];

  const alerts: Alert[] = [];
  if (overdueVaccines.length > 0) {
    alerts.push({
      id: 'overdue-vaccine',
      type: 'urgent',
      title: 'Vacina atrasada',
      description: `${overdueVaccines.length} vacina(s) atrasada(s)`,
      date: new Date().toISOString().split('T')[0],
    });
  }
  if (criticalExams.length > 0) {
    alerts.push({
      id: 'critical-exam',
      type: 'urgent',
      title: 'Exame critico',
      description: `${criticalExams.length} exame(s) com resultado critico`,
      date: new Date().toISOString().split('T')[0],
    });
  }
  if (nextAppointmentDate) {
    alerts.push({
      id: 'next-appointment',
      type: 'warning',
      title: 'Retorno agendado',
      description: `Retorno marcado para ${nextAppointmentDate.toISOString().split('T')[0]}`,
      date: nextAppointmentDate.toISOString().split('T')[0],
    });
  }

  const recentProcedures: RecentProcedure[] = (procedures || []).slice(0, 3).map((proc) => ({
    id: proc.id,
    type: proc.type || 'Procedimento',
    date: proc.procedure_date,
    veterinarian: proc.veterinarian || '-',
    status: 'concluido',
  }));

  const pendingVaccines = vaccineStatus.filter((v) => v.status !== 'ok').map((v) => ({
    name: v.name,
    dueDate: v.next_dose_date || v.application_date,
    status: v.status,
  }));

  const currentMedications: Medication[] = [];

  const monthlyExpenses = useMemo(() => {
    const items: { month: string; amount: number; key: string }[] = [];
    const today = new Date();

    for (let i = 5; i >= 0; i -= 1) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const label = MONTH_LABELS[date.getMonth()];
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const amount = (procedures || [])
        .filter((proc) => {
          const procDate = new Date(proc.procedure_date);
          return procDate.getFullYear() === date.getFullYear() && procDate.getMonth() === date.getMonth();
        })
        .reduce((sum, proc) => sum + Number(proc.cost || 0), 0);
      items.push({ month: label, amount, key });
    }

    return items;
  }, [procedures]);

  const totalAnnualCost = monthlyExpenses.reduce((sum, m) => sum + m.amount, 0);
  const avgMonthlyCost = monthlyExpenses.length ? totalAnnualCost / monthlyExpenses.length : 0;
  const maxExpense = Math.max(1, ...monthlyExpenses.map((m) => m.amount));

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const healthScore = alerts.filter((a) => a.type === 'urgent').length === 0
    ? 'excelente'
    : alerts.filter((a) => a.type === 'urgent').length === 1
      ? 'atencao'
      : 'critico';

  const healthScoreConfig = {
    excelente: { color: 'text-emerald-500', bg: 'bg-emerald-500/20', label: 'Excelente' },
    atencao: { color: 'text-amber-500', bg: 'bg-amber-500/20', label: 'Requer Atencao' },
    critico: { color: 'text-red-500', bg: 'bg-red-500/20', label: 'Critico' },
  };

  const currentHealthScore = healthScoreConfig[healthScore];

  const lastUpdateDate = [
    procedures?.[0]?.procedure_date,
    vaccines?.[0]?.application_date,
    exams?.[0]?.exam_date,
  ]
    .filter(Boolean)
    .sort()
    .pop();

  return (
    <div className="space-y-6">
      {/* Header com Acoes */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h3 className="text-xl text-foreground dark:text-white">Dashboard de Saude</h3>
          <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-1">
            Visao geral do estado de saude de {animalName}
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

      {/* Status Geral de Saude */}
      <div className={`${currentHealthScore.bg} border ${currentHealthScore.bg.replace('/20', '/30')} rounded-2xl p-6`}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white dark:bg-[#1a1a1a] rounded-full flex items-center justify-center">
            <Activity className={`w-8 h-8 ${currentHealthScore.color}`} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Status Geral de Saude</p>
            <p className={`text-2xl font-bold ${currentHealthScore.color}`}>{currentHealthScore.label}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Ultima Atualizacao</p>
            <p className="text-sm text-foreground dark:text-white font-medium">
              {lastUpdateDate ? formatDate(lastUpdateDate) : '-'}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Alertas Ativos</p>
            <p className="text-sm text-foreground dark:text-white font-medium">{alerts.length}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Proxima Consulta</p>
            <p className="text-sm text-foreground dark:text-white font-medium">
              {nextAppointmentDate ? formatDate(nextAppointmentDate.toISOString().split('T')[0]) : '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Grid de Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertas de Saude */}
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg text-foreground dark:text-white font-medium">Alertas de Saude</h4>
            <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
              {alerts.length}
            </div>
          </div>
          <div className="space-y-3">
            {alerts.length === 0 && (
              <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Nenhum alerta ativo</p>
            )}
            {alerts.map((alert) => {
              const config = alert.type === 'urgent'
                ? { bg: 'bg-red-500/10', border: 'border-red-500/20', iconColor: 'text-red-500', textColor: 'text-red-600 dark:text-red-400' }
                : alert.type === 'warning'
                  ? { bg: 'bg-amber-500/10', border: 'border-amber-500/20', iconColor: 'text-amber-500', textColor: 'text-amber-600 dark:text-amber-400' }
                  : { bg: 'bg-gray-500/10', border: 'border-gray-500/20', iconColor: 'text-gray-500', textColor: 'text-gray-600 dark:text-gray-400' };
              const Icon = AlertTriangle;
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

        {/* Ultimos Procedimentos */}
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <h4 className="text-lg text-foreground dark:text-white font-medium mb-4">Ultimos Procedimentos</h4>
          <div className="space-y-3">
            {recentProcedures.length === 0 && (
              <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Nenhum procedimento registrado</p>
            )}
            {recentProcedures.map((proc) => (
              <div key={proc.id} className="bg-muted dark:bg-[#0d0d0d] rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-foreground dark:text-white font-medium">{proc.type}</p>
                  <span className="text-xs text-emerald-500 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Concluido
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
            {pendingVaccines.length === 0 && (
              <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Nenhuma vacina pendente</p>
            )}
            {pendingVaccines.map((vaccine, index) => (
              <div key={index} className={`rounded-lg p-3 border ${vaccine.status === 'overdue' ? 'bg-red-500/10 border-red-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground dark:text-white font-medium">{vaccine.name}</p>
                    <p className="text-xs text-muted-foreground dark:text-[#99a1af] mt-1">
                      {vaccine.status === 'overdue' ? 'Atrasada desde ' : 'Prevista para '}
                      {vaccine.dueDate ? formatDate(vaccine.dueDate) : '-'}
                    </p>
                  </div>
                  <span className={`text-xs font-medium ${vaccine.status === 'overdue' ? 'text-red-500' : 'text-amber-500'}`}>
                    {vaccine.status === 'overdue' ? 'ATRASADA' : 'PROXIMA'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Medicacoes em Andamento */}
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-5 h-5 text-primary dark:text-white" />
            <h4 className="text-lg text-foreground dark:text-white font-medium">Medicacoes em Andamento</h4>
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
                      <span className="block mb-1">Frequencia:</span>
                      <span className="text-foreground dark:text-white">{med.frequency}</span>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
                    <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
                      Termino previsto: <span className="text-foreground dark:text-white">{formatDate(med.endDate)}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Nenhuma medicacao em andamento</p>
            </div>
          )}
        </div>
      </div>

      {/* Grafico de Gastos com Saude */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="text-lg text-foreground dark:text-white font-medium">Gastos com Saude</h4>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-1">Ultimos 6 meses</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Media Mensal</p>
              <p className="text-lg font-bold text-foreground dark:text-white">{formatCurrency(avgMonthlyCost)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Total Periodo</p>
              <p className="text-lg font-bold text-foreground dark:text-white">{formatCurrency(totalAnnualCost)}</p>
            </div>
          </div>
        </div>

        <div className="h-48 flex items-end justify-around gap-3">
          {monthlyExpenses.map((expense) => {
            const percentage = (expense.amount / maxExpense) * 100;
            return (
              <div key={expense.key} className="flex-1 flex flex-col items-center gap-2">
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

        <div className="mt-6 pt-4 border-t border-border dark:border-[rgba(255,255,255,0.1)] grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-muted-foreground dark:text-[#99a1af]">Emergencias: {formatCurrency(0)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span className="text-muted-foreground dark:text-[#99a1af]">Consultas: {formatCurrency(0)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span className="text-muted-foreground dark:text-[#99a1af]">Exames: {formatCurrency(0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
