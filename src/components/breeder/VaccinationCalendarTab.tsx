import { useMemo, useState } from 'react';
import { Syringe, AlertCircle, CheckCircle, Calendar, Download, Plus } from 'lucide-react';
import { NativeSelect } from '../ui/native-select';
import { useAnimalVaccines } from '@/hooks/useAnimalHealth';

interface VaccineView {
  id: string;
  name: string;
  date: string;
  nextDose?: string | null;
  lot: string;
  manufacturer: string;
  veterinarian: string;
  status: 'ok' | 'warning' | 'overdue';
  notes?: string;
}

interface VaccinationCalendarTabProps {
  animalId: string;
  onRegisterVaccine: () => void;
}

function getStatus(nextDose?: string | null): 'ok' | 'warning' | 'overdue' {
  if (!nextDose) return 'ok';
  const today = new Date();
  const doseDate = new Date(nextDose);
  const diffDays = Math.floor((doseDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'overdue';
  if (diffDays <= 30) return 'warning';
  return 'ok';
}

export function VaccinationCalendarTab({ animalId, onRegisterVaccine }: VaccinationCalendarTabProps) {
  const [selectedStatus, setSelectedStatus] = useState('');

  const { data: vaccineRows, isLoading } = useAnimalVaccines(animalId);

  const vaccines = useMemo<VaccineView[]>(() => {
    return (vaccineRows || []).map((row) => ({
      id: row.id,
      name: row.name,
      date: row.application_date,
      nextDose: row.next_dose_date,
      lot: row.lot || '-',
      manufacturer: row.manufacturer || '-',
      veterinarian: row.veterinarian || '-',
      status: getStatus(row.next_dose_date),
      notes: row.observations || undefined,
    }));
  }, [vaccineRows]);

  const filteredVaccines = vaccines.filter((vaccine) => {
    if (selectedStatus && vaccine.status !== selectedStatus) return false;
    return true;
  });

  const totalVaccines = vaccines.length;
  const upToDate = vaccines.filter((v) => v.status === 'ok').length;
  const warning = vaccines.filter((v) => v.status === 'warning').length;
  const overdue = vaccines.filter((v) => v.status === 'overdue').length;

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const statusConfig = {
    ok: {
      label: 'Em dia',
      color: 'bg-emerald-500',
      textColor: 'text-emerald-500',
      bgColor: 'bg-emerald-500/20',
      borderColor: 'border-emerald-500/20',
      icon: CheckCircle,
    },
    warning: {
      label: 'Proxima do vencimento',
      color: 'bg-amber-500',
      textColor: 'text-amber-500',
      bgColor: 'bg-amber-500/20',
      borderColor: 'border-amber-500/20',
      icon: AlertCircle,
    },
    overdue: {
      label: 'Atrasada',
      color: 'bg-red-500',
      textColor: 'text-red-500',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/20',
      icon: AlertCircle,
    },
  };

  return (
    <div className="space-y-6">
      {/* Estatisticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card dark:bg-[#1a1a1a] rounded-xl p-4 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Syringe className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground dark:text-white">{totalVaccines}</p>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Total de Vacinas</p>
            </div>
          </div>
        </div>

        <div className="bg-card dark:bg-[#1a1a1a] rounded-xl p-4 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground dark:text-white">{upToDate}</p>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Em Dia</p>
            </div>
          </div>
        </div>

        <div className="bg-card dark:bg-[#1a1a1a] rounded-xl p-4 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground dark:text-white">{warning}</p>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Proximas do Vencimento</p>
            </div>
          </div>
        </div>

        <div className="bg-card dark:bg-[#1a1a1a] rounded-xl p-4 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground dark:text-white">{overdue}</p>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Atrasadas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header com Filtros */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h3 className="text-xl text-foreground dark:text-white">Calendario de Vacinacao</h3>
          <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-1">
            {filteredVaccines.length} {filteredVaccines.length === 1 ? 'vacina registrada' : 'vacinas registradas'}
          </p>
        </div>
        <div className="flex gap-2 w-full lg:w-auto">
          <button
            onClick={() => alert('Download da carteirinha sera implementado em breve')}
            className="px-4 py-2 border border-border dark:border-[#333333] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Carteirinha
          </button>
          <button
            onClick={onRegisterVaccine}
            className="flex-1 lg:flex-initial px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Registrar Vacina
          </button>
        </div>
      </div>

      {/* Filtro de Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <NativeSelect
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full h-10 bg-muted dark:bg-[#3a3a3a] border-0 text-foreground dark:text-white rounded-lg"
        >
          <option value="">Todos os status</option>
          <option value="ok">Em dia</option>
          <option value="warning">Proximas do vencimento</option>
          <option value="overdue">Atrasadas</option>
        </NativeSelect>
      </div>

      {/* Alertas */}
      {overdue > 0 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-foreground dark:text-white font-medium mb-1">
                Atencao: {overdue} {overdue === 1 ? 'vacina atrasada' : 'vacinas atrasadas'}
              </p>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                Mantenha o calendario de vacinacao em dia para garantir a saude do animal.
              </p>
            </div>
          </div>
        </div>
      )}

      {warning > 0 && overdue === 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-foreground dark:text-white font-medium mb-1">
                {warning} {warning === 1 ? 'vacina proxima' : 'vacinas proximas'} do vencimento
              </p>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                Programe a aplicacao das proximas doses com antecedencia.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-3">
        {isLoading && (
          <div className="text-center py-8 text-sm text-muted-foreground dark:text-[#99a1af]">
            Carregando vacinas...
          </div>
        )}
        {!isLoading && filteredVaccines.map((vaccine) => (
          <VaccineCard key={vaccine.id} vaccine={vaccine} statusConfig={statusConfig} formatDate={formatDate} />
        ))}
      </div>

      {/* Estado Vazio */}
      {!isLoading && filteredVaccines.length === 0 && (
        <div className="bg-muted dark:bg-[#0d0d0d] rounded-2xl p-12 text-center border border-border dark:border-[rgba(255,255,255,0.1)]">
          <Syringe className="w-16 h-16 text-muted-foreground dark:text-[#99a1af] mx-auto mb-4" />
          <h4 className="text-lg text-foreground dark:text-white mb-2">Nenhuma vacina encontrada</h4>
          <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-6">
            Nao ha vacinas registradas com os filtros aplicados.
          </p>
          <button
            onClick={onRegisterVaccine}
            className="px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Registrar Primeira Vacina
          </button>
        </div>
      )}
    </div>
  );
}

interface VaccineCardProps {
  vaccine: VaccineView;
  statusConfig: any;
  formatDate: (dateStr: string) => string;
}

function VaccineCard({ vaccine, statusConfig, formatDate }: VaccineCardProps) {
  const config = statusConfig[vaccine.status];
  const StatusIcon = config.icon;

  return (
    <div className={`bg-card dark:bg-[#1a1a1a] rounded-xl p-5 border ${config.borderColor} hover:border-[#3a3a3a] transition-all`}>
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 ${config.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
          <StatusIcon className={`w-6 h-6 ${config.textColor}`} />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="text-lg text-foreground dark:text-white font-medium mb-1">{vaccine.name}</h4>
              <span className={`${config.color} text-white px-3 py-1 rounded-md text-xs font-medium inline-block`}>
                {config.label}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
            <div>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Data de Aplicacao</p>
              <p className="text-sm text-foreground dark:text-white">{formatDate(vaccine.date)}</p>
            </div>

            {vaccine.nextDose && (
              <div>
                <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Proxima Dose</p>
                <p className="text-sm text-foreground dark:text-white">{formatDate(vaccine.nextDose)}</p>
              </div>
            )}

            <div>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Veterinario</p>
              <p className="text-sm text-foreground dark:text-white">{vaccine.veterinarian}</p>
            </div>
          </div>

          <div className="bg-muted dark:bg-[#0d0d0d] rounded-lg p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Lote</p>
              <p className="text-sm text-foreground dark:text-white">{vaccine.lot}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Fabricante</p>
              <p className="text-sm text-foreground dark:text-white">{vaccine.manufacturer}</p>
            </div>
          </div>

          {vaccine.notes && (
            <div className="mt-3 p-3 bg-muted dark:bg-[#0d0d0d] rounded-lg">
              <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Observacoes</p>
              <p className="text-sm text-foreground dark:text-white">{vaccine.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
