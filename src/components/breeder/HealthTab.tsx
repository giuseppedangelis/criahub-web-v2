import { useState } from 'react';
import { Stethoscope, Activity, FileText, Calendar, DollarSign, User, Filter, Plus, ChevronDown, ChevronUp, Download } from 'lucide-react';
import { NativeSelect } from '../ui/native-select';

interface VeterinaryProcedure {
  id: string;
  date: string;
  time: string;
  type: 'consulta' | 'cirurgia' | 'emergencia' | 'exame';
  veterinarian: string;
  clinic: string;
  reason: string;
  diagnosis: string;
  treatment: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  cost: number;
  notes: string;
  documents: string[];
  nextAppointment?: string;
}

interface HealthTabProps {
  animalId: number;
  onRegisterProcedure: () => void;
}

export function HealthTab({ animalId, onRegisterProcedure }: HealthTabProps) {
  const [selectedType, setSelectedType] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [expandedProcedure, setExpandedProcedure] = useState<string | null>(null);

  // Dados mock
  const procedures: VeterinaryProcedure[] = [
    {
      id: '1',
      date: '2024-12-08',
      time: '14:30',
      type: 'consulta',
      veterinarian: 'Dr. Carlos Mendes',
      clinic: 'Clínica Veterinária Equinos MG',
      reason: 'Consulta de rotina e avaliação de marcha',
      diagnosis: 'Animal em boas condições gerais. Leve inflamação articular detectada',
      treatment: 'Repouso moderado por 7 dias. Aplicação de anti-inflamatório',
      medications: [
        {
          name: 'Fenilbutazona',
          dosage: '2g',
          frequency: 'A cada 12 horas',
          duration: '7 dias'
        }
      ],
      cost: 450.00,
      notes: 'Retornar em 15 dias para reavaliação. Evitar trabalhos pesados.',
      documents: ['laudo_12_2024.pdf'],
      nextAppointment: '2024-12-23'
    },
    {
      id: '2',
      date: '2024-11-15',
      time: '10:00',
      type: 'exame',
      veterinarian: 'Dra. Ana Paula Santos',
      clinic: 'LabVet Diagnósticos',
      reason: 'Exames pré-cobertura',
      diagnosis: 'Todos os exames dentro dos parâmetros normais',
      treatment: 'Nenhum tratamento necessário',
      medications: [],
      cost: 680.00,
      notes: 'Animal apto para reprodução. Hemograma e exames ginecológicos normais.',
      documents: ['hemograma_11_2024.pdf', 'exame_ginecologico.pdf']
    },
    {
      id: '3',
      date: '2024-10-20',
      time: '16:45',
      type: 'emergencia',
      veterinarian: 'Dr. Roberto Lima',
      clinic: 'Hospital Veterinário 24h',
      reason: 'Cólica aguda',
      diagnosis: 'Cólica espasmódica - Impactação leve do cólon',
      treatment: 'Fluidoterapia intravenosa. Analgésicos. Sondagem nasogástrica',
      medications: [
        {
          name: 'Dipirona',
          dosage: '5ml',
          frequency: 'A cada 8 horas',
          duration: '3 dias'
        },
        {
          name: 'Buscopan Compositum',
          dosage: '10ml',
          frequency: 'Dose única',
          duration: '1 dia'
        }
      ],
      cost: 1250.00,
      notes: 'Animal mantido em observação por 6 horas. Recuperação completa. Ajustar dieta.',
      documents: ['atendimento_emergencia.pdf']
    },
    {
      id: '4',
      date: '2024-09-10',
      time: '11:00',
      type: 'cirurgia',
      veterinarian: 'Dr. Fernando Costa',
      clinic: 'Centro Cirúrgico Equino',
      reason: 'Castração eletiva',
      diagnosis: 'Procedimento cirúrgico eletivo',
      treatment: 'Orquiectomia bilateral. Anestesia geral. Recuperação sem intercorrências',
      medications: [
        {
          name: 'Antibiótico (Penicilina)',
          dosage: '20.000 UI',
          frequency: 'A cada 24 horas',
          duration: '5 dias'
        },
        {
          name: 'Anti-inflamatório',
          dosage: '1g',
          frequency: 'A cada 12 horas',
          duration: '5 dias'
        }
      ],
      cost: 2800.00,
      notes: 'Retirada de pontos em 10 dias. Manter em repouso absoluto por 15 dias.',
      documents: ['relatorio_cirurgico.pdf', 'fotos_pos_cirurgia.jpg']
    }
  ];

  const filteredProcedures = procedures.filter((proc) => {
    if (selectedType && proc.type !== selectedType) return false;
    
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

  // Estatísticas
  const totalProcedures = procedures.length;
  const lastProcedure = procedures[0];
  const nextAppointment = procedures.find(p => p.nextAppointment);
  const totalCost = procedures.reduce((sum, p) => sum + p.cost, 0);

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

  const typeConfig = {
    'consulta': { label: 'Consulta', color: 'bg-gray-500', icon: Stethoscope },
    'cirurgia': { label: 'Cirurgia', color: 'bg-purple-500', icon: Activity },
    'emergencia': { label: 'Emergência', color: 'bg-red-500', icon: Activity },
    'exame': { label: 'Exame', color: 'bg-emerald-500', icon: FileText },
  };

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
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
              <p className="text-sm font-bold text-foreground dark:text-white">{formatDate(lastProcedure.date)}</p>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Última Consulta</p>
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
                {nextAppointment ? formatDate(nextAppointment.nextAppointment!) : '-'}
              </p>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Próxima Consulta</p>
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
          <h3 className="text-xl text-foreground dark:text-white">Histórico Veterinário</h3>
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
            <option value="consulta">Consulta</option>
            <option value="cirurgia">Cirurgia</option>
            <option value="emergencia">Emergência</option>
            <option value="exame">Exame</option>
          </NativeSelect>
        </div>

        <div>
          <NativeSelect
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-full h-10 bg-muted dark:bg-[#3a3a3a] border-0 text-foreground dark:text-white rounded-lg"
          >
            <option value="">Todos os períodos</option>
            <option value="30">Últimos 30 dias</option>
            <option value="60">Últimos 60 dias</option>
            <option value="90">Últimos 90 dias</option>
          </NativeSelect>
        </div>

        <button className="px-4 py-2 border border-border dark:border-[#333333] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors flex items-center justify-center gap-2">
          <Download className="w-4 h-4" />
          Exportar Histórico
        </button>
      </div>

      {/* Lista de Procedimentos */}
      <div className="space-y-4">
        {filteredProcedures.map((procedure) => (
          <ProcedureCard
            key={procedure.id}
            procedure={procedure}
            expanded={expandedProcedure === procedure.id}
            onToggle={() => setExpandedProcedure(expandedProcedure === procedure.id ? null : procedure.id)}
            typeConfig={typeConfig}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
          />
        ))}
      </div>

      {/* Estado Vazio */}
      {filteredProcedures.length === 0 && (
        <div className="bg-muted dark:bg-[#0d0d0d] rounded-2xl p-12 text-center border border-border dark:border-[rgba(255,255,255,0.1)]">
          <Stethoscope className="w-16 h-16 text-muted-foreground dark:text-[#99a1af] mx-auto mb-4" />
          <h4 className="text-lg text-foreground dark:text-white mb-2">
            Nenhum procedimento encontrado
          </h4>
          <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-6">
            Não há procedimentos veterinários registrados com os filtros aplicados.
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

interface ProcedureCardProps {
  procedure: VeterinaryProcedure;
  expanded: boolean;
  onToggle: () => void;
  typeConfig: any;
  formatCurrency: (value: number) => string;
  formatDate: (dateStr: string) => string;
}

function ProcedureCard({ procedure, expanded, onToggle, typeConfig, formatCurrency, formatDate }: ProcedureCardProps) {
  const config = typeConfig[procedure.type];
  const Icon = config.icon;

  return (
    <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)] hover:border-[#3a3a3a] transition-all">
      {/* Header */}
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
                {formatDate(procedure.date)} às {procedure.time}
              </p>
            </div>
            <h4 className="text-lg text-foreground dark:text-white font-medium break-words">{procedure.reason}</h4>
          </div>
        </div>
        <div className="w-full sm:w-auto text-left sm:text-right">
          <p className="text-xl font-bold text-foreground dark:text-white">{formatCurrency(procedure.cost)}</p>
        </div>
      </div>

      {/* Informações Básicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-muted-foreground dark:text-[#99a1af]" />
            <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Veterinário</p>
          </div>
          <p className="text-sm text-foreground dark:text-white">{procedure.veterinarian}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <Stethoscope className="w-4 h-4 text-muted-foreground dark:text-[#99a1af]" />
            <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Clínica/Hospital</p>
          </div>
          <p className="text-sm text-foreground dark:text-white">{procedure.clinic}</p>
        </div>
      </div>

      {/* Diagnóstico */}
      <div className="bg-muted dark:bg-[#0d0d0d] rounded-lg p-4 mb-4">
        <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-2">Diagnóstico</p>
        <p className="text-sm text-foreground dark:text-white">{procedure.diagnosis}</p>
      </div>

      {/* Botão Expandir */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-center gap-2 text-sm text-primary dark:text-white hover:opacity-80 transition-opacity py-2"
      >
        {expanded ? (
          <>
            <ChevronUp className="w-4 h-4" />
            Ver menos detalhes
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4" />
            Ver mais detalhes
          </>
        )}
      </button>

      {/* Detalhes Expandidos */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-border dark:border-[rgba(255,255,255,0.1)] space-y-4">
          {/* Tratamento */}
          <div>
            <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-2">Tratamento Realizado</p>
            <p className="text-sm text-foreground dark:text-white">{procedure.treatment}</p>
          </div>

          {/* Medicamentos */}
          {procedure.medications.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-2">Medicamentos Prescritos</p>
              <div className="space-y-2">
                {procedure.medications.map((med, index) => (
                  <div key={index} className="bg-muted dark:bg-[#0d0d0d] rounded-lg p-3">
                    <p className="text-sm text-foreground dark:text-white font-medium mb-2">{med.name}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-muted-foreground dark:text-[#99a1af]">
                      <div>
                        <span className="block">Dosagem:</span>
                        <span className="text-foreground dark:text-white break-words">{med.dosage}</span>
                      </div>
                      <div>
                        <span className="block">Frequência:</span>
                        <span className="text-foreground dark:text-white break-words">{med.frequency}</span>
                      </div>
                      <div>
                        <span className="block">Duração:</span>
                        <span className="text-foreground dark:text-white break-words">{med.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Observações */}
          {procedure.notes && (
            <div>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-2">Observações</p>
              <p className="text-sm text-foreground dark:text-white">{procedure.notes}</p>
            </div>
          )}

          {/* Próximo Retorno */}
          {procedure.nextAppointment && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-500" />
                <div>
                  <p className="text-xs text-amber-600 dark:text-amber-400">Próximo Retorno Agendado</p>
                  <p className="text-sm text-foreground dark:text-white font-medium">
                    {formatDate(procedure.nextAppointment)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Documentos */}
          {procedure.documents.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-2">Documentos Anexados</p>
              <div className="flex flex-wrap gap-2">
                {procedure.documents.map((doc, index) => (
                  <button
                    key={index}
                    className="px-3 py-2 bg-muted dark:bg-[#0d0d0d] rounded-lg text-xs text-foreground dark:text-white hover:bg-[#3a3a3a] transition-colors flex items-center gap-2"
                  >
                    <FileText className="w-3 h-3" />
                    {doc}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}