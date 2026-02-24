import { useMemo, useState } from 'react';
import { Stethoscope, Activity, FileText, Calendar, DollarSign, User, Plus } from 'lucide-react';
import { NativeSelect } from '../ui/native-select';
import { useAnimalHealthRecords } from '@/hooks/useAnimalHealth';

interface HealthTabProps {
  animalId: string;
  onRegisterProcedure: () => void;
}

interface ProcedureView {
  id: string;
  date: string;
  typeKey: string;
  typeLabel: string;
  veterinarian: string;
  description: string;
  cost: number;
  notes?: string;
  nextDate?: string | null;
}

const TYPE_CONFIG: Record<string, { label: string; color: string; icon: typeof Stethoscope }> = {
  consulta: { label: 'Consulta', color: 'bg-gray-500', icon: Stethoscope },
  cirurgia: { label: 'Cirurgia', color: 'bg-purple-500', icon: Activity },
  dentista: { label: 'Dentista', color: 'bg-indigo-500', icon: Activity },
  casqueamento: { label: 'Casqueamento', color: 'bg-amber-500', icon: Activity },
  vermifugacao: { label: 'Vermifugacao', color: 'bg-teal-500', icon: Activity },
  vacinacao: { label: 'Vacinacao', color: 'bg-emerald-500', icon: Activity },
  exame: { label: 'Exame', color: 'bg-emerald-500', icon: FileText },
  outro: { label: 'Outro', color: 'bg-gray-500', icon: FileText },
};

function normalizeKey(value: string | null | undefined): string {
  if (!value) return 'outro';
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

export function HealthTab({ animalId, onRegisterProcedure }: HealthTabProps) {
  const [selectedType, setSelectedType] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');

  const { data: records, isLoading } = useAnimalHealthRecords(animalId);

  const procedures = useMemo<ProcedureView[]>(() => {
    return (records || []).map((record) => {
      const typeKey = normalizeKey(record.type);
      const config = TYPE_CONFIG[typeKey] || TYPE_CONFIG.outro;
      return {
        id: record.id,
        date: record.procedure_date,
        typeKey,
        typeLabel: config.label,
        veterinarian: record.veterinarian || '-',
        description: record.description || 'Procedimento veterinario',
        cost: Number(record.cost || 0),
        notes: record.observations || undefined,
        nextDate: record.next_date || null,
      };
    });
  }, [records]);

  const filteredProcedures = procedures.filter((proc) => {
    if (selectedType && proc.typeKey !== selectedType) return false;

    if (selectedPeriod) {
      const procDate = new Date(proc.date);
      const today = new Date();
      const daysDiff = Math.floor((today.getTime() - procDate.getTime()) / (1000 * 60 * 60 * 24));

      if (selectedPeriod === '30' && daysDiff > 30) return false;
      if (selectedPeriod === '60' && daysDiff > 60) return false;
      if (selectedPeriod === '90' && daysDiff > 90) return false;
    }

    return true;
  });

  const totalProcedures = procedures.length;
  const lastProcedure = procedures[0];
  const nextAppointment = procedures
    .map((p) => p.nextDate)
    .filter((date): date is string => Boolean(date))
    .map((date) => new Date(date))
    .filter((date) => date >= new Date())
    .sort((a, b) => a.getTime() - b.getTime())[0];
  const totalCost = procedures.reduce((sum, p) => sum + p.cost, 0);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="space-y-6">
      {/* Estatisticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card dark:bg-[#1a1a1a] rounded-xl p-4 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-500/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground dark:text-white">{totalProcedures}</p>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Total de Procedimentos</p>
            </div>
          </div>
        </div>

        <div className="bg-card dark:bg-[#1a1a1a] rounded-xl p-4 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground dark:text-white">
                {lastProcedure ? formatDate(lastProcedure.date) : '-'}
              </p>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Ultimo Procedimento</p>
            </div>
          </div>
        </div>

        <div className="bg-card dark:bg-[#1a1a1a] rounded-xl p-4 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground dark:text-white">
                {nextAppointment ? formatDate(nextAppointment.toISOString().split('T')[0]) : '-'}
              </p>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Proximo Retorno</p>
            </div>
          </div>
        </div>

        <div className="bg-card dark:bg-[#1a1a1a] rounded-xl p-4 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground dark:text-white">{formatCurrency(totalCost)}</p>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Custo Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header com Filtros */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h3 className="text-xl text-foreground dark:text-white">Historico Veterinario</h3>
          <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-1">
            {filteredProcedures.length} {filteredProcedures.length === 1 ? 'procedimento' : 'procedimentos'}
          </p>
        </div>
        <button
          onClick={onRegisterProcedure}
          className="w-full lg:w-auto px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Registrar Procedimento
        </button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <NativeSelect
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full h-10 bg-muted dark:bg-[#3a3a3a] border-0 text-foreground dark:text-white rounded-lg"
          >
            <option value="">Todos os tipos</option>
            {Object.entries(TYPE_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </NativeSelect>
        </div>

        <div>
          <NativeSelect
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-full h-10 bg-muted dark:bg-[#3a3a3a] border-0 text-foreground dark:text-white rounded-lg"
          >
            <option value="">Todos os periodos</option>
            <option value="30">Ultimos 30 dias</option>
            <option value="60">Ultimos 60 dias</option>
            <option value="90">Ultimos 90 dias</option>
          </NativeSelect>
        </div>
      </div>

      {/* Lista de Procedimentos */}
      <div className="space-y-4">
        {isLoading && (
          <div className="text-center py-8 text-sm text-muted-foreground dark:text-[#99a1af]">
            Carregando procedimentos...
          </div>
        )}
        {!isLoading && filteredProcedures.map((procedure) => {
          const config = TYPE_CONFIG[procedure.typeKey] || TYPE_CONFIG.outro;
          const Icon = config.icon;
          return (
            <div
              key={procedure.id}
              className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)] hover:border-[#3a3a3a] transition-all"
            >
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className={`w-12 h-12 ${config.color}/20 rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${config.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                      <span className={`${config.color} text-white px-3 py-1 rounded-md text-xs font-medium inline-block`}>
                        {config.label}
                      </span>
                      <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                        {formatDate(procedure.date)}
                      </p>
                    </div>
                    <h4 className="text-lg text-foreground dark:text-white font-medium break-words">
                      {procedure.description}
                    </h4>
                  </div>
                </div>
                <div className="w-full sm:w-auto text-left sm:text-right">
                  <p className="text-xl font-bold text-foreground dark:text-white">
                    {formatCurrency(procedure.cost)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-muted-foreground dark:text-[#99a1af]" />
                    <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Veterinario</p>
                  </div>
                  <p className="text-sm text-foreground dark:text-white">{procedure.veterinarian}</p>
                </div>

                {procedure.nextDate && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-muted-foreground dark:text-[#99a1af]" />
                      <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Proximo retorno</p>
                    </div>
                    <p className="text-sm text-foreground dark:text-white">{formatDate(procedure.nextDate)}</p>
                  </div>
                )}
              </div>

              {procedure.notes && (
                <div className="bg-muted dark:bg-[#0d0d0d] rounded-lg p-4">
                  <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-2">Observacoes</p>
                  <p className="text-sm text-foreground dark:text-white">{procedure.notes}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Estado Vazio */}
      {!isLoading && filteredProcedures.length === 0 && (
        <div className="bg-muted dark:bg-[#0d0d0d] rounded-2xl p-12 text-center border border-border dark:border-[rgba(255,255,255,0.1)]">
          <Stethoscope className="w-16 h-16 text-muted-foreground dark:text-[#99a1af] mx-auto mb-4" />
          <h4 className="text-lg text-foreground dark:text-white mb-2">Nenhum procedimento encontrado</h4>
          <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-6">
            Nao ha procedimentos veterinarios registrados com os filtros aplicados.
          </p>
          <button
            onClick={onRegisterProcedure}
            className="px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Registrar Primeiro Procedimento
          </button>
        </div>
      )}
    </div>
  );
}
