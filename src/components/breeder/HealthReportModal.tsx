import { useState } from 'react';
import { X, Activity, Download, Check, AlertTriangle } from 'lucide-react';
import { NativeSelect } from '../ui/native-select';

interface HealthReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HealthReportModal({ isOpen, onClose }: HealthReportModalProps) {
  const [reportPeriod, setReportPeriod] = useState('year');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [reportSections, setReportSections] = useState({
    resumoGeral: true,
    vacinacao: true,
    procedimentos: true,
    exames: true,
    alertas: true,
    custosSaude: false,
    veterinarios: false,
    medicamentos: true,
    graficos: true,
    recomendacoes: true,
  });
  const [animalFilters, setAnimalFilters] = useState({
    includeAll: true,
    withAlerts: false,
    vaccineOverdue: false,
    underTreatment: false,
  });
  const [reportFormat, setReportFormat] = useState('pdf');
  const [includeDetails, setIncludeDetails] = useState(true);

  const handleToggleSection = (section: keyof typeof reportSections) => {
    setReportSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleToggleFilter = (filter: keyof typeof animalFilters) => {
    if (filter === 'includeAll') {
      setAnimalFilters({
        includeAll: true,
        withAlerts: false,
        vaccineOverdue: false,
        underTreatment: false,
      });
    } else {
      setAnimalFilters(prev => ({
        ...prev,
        includeAll: false,
        [filter]: !prev[filter]
      }));
    }
  };

  const handleGenerate = () => {
    const selectedCount = Object.values(reportSections).filter(v => v).length;
    if (selectedCount === 0) {
      alert('Por favor, selecione pelo menos uma seção');
      return;
    }

    if (reportPeriod === 'custom' && (!customStartDate || !customEndDate)) {
      alert('Por favor, preencha as datas do período personalizado');
      return;
    }

    // Aqui seria a lógica de geração do relatório
    console.log('Gerando relatório de saúde:', { 
      reportPeriod, 
      reportSections, 
      animalFilters,
      reportFormat 
    });
    onClose();
  };

  const sections = [
    { 
      key: 'resumoGeral', 
      label: 'Resumo Geral de Saúde', 
      description: 'Visão executiva do estado de saúde do plantel',
      recommended: true
    },
    { 
      key: 'vacinacao', 
      label: 'Calendário de Vacinação', 
      description: 'Vacinas aplicadas, pendentes e atrasadas',
      recommended: true
    },
    { 
      key: 'procedimentos', 
      label: 'Procedimentos Veterinários', 
      description: 'Consultas, cirurgias e emergências realizadas',
      recommended: true
    },
    { 
      key: 'exames', 
      label: 'Histórico de Exames', 
      description: 'Exames realizados e resultados obtidos',
      recommended: false
    },
    { 
      key: 'alertas', 
      label: 'Alertas de Saúde', 
      description: 'Vacinas atrasadas e tratamentos pendentes',
      recommended: true
    },
    { 
      key: 'custosSaude', 
      label: 'Custos com Saúde', 
      description: 'Investimentos em veterinário, medicamentos e exames',
      recommended: false
    },
    { 
      key: 'veterinarios', 
      label: 'Análise por Veterinário', 
      description: 'Profissionais que atenderam o plantel',
      recommended: false
    },
    { 
      key: 'medicamentos', 
      label: 'Controle de Medicamentos', 
      description: 'Medicações em andamento e histórico de uso',
      recommended: true
    },
    { 
      key: 'graficos', 
      label: 'Gráficos e Indicadores', 
      description: 'Visualizações de dados de saúde',
      recommended: true
    },
    { 
      key: 'recomendacoes', 
      label: 'Recomendações', 
      description: 'Ações recomendadas baseadas no histórico',
      recommended: true
    },
  ];

  const selectedSectionsCount = Object.values(reportSections).filter(v => v).length;
  const selectedFiltersCount = Object.entries(animalFilters).filter(([k, v]) => k !== 'includeAll' && v).length;

  // Mock de dados de saúde
  const healthSummary = {
    totalAnimals: 42,
    vaccinatedUpToDate: 35,
    vaccineOverdue: 7,
    activeAlerts: 12,
    totalProcedures: 156
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)] sticky top-0 bg-card dark:bg-[#1a1a1a] z-10">
          <div>
            <h3 className="text-xl text-foreground dark:text-white">Relatório de Saúde do Plantel</h3>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-1">
              Análise completa do estado de saúde dos animais
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Resumo de Saúde Rápido */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-card dark:bg-[#0d0d0d] rounded-lg p-3 border border-border dark:border-[rgba(255,255,255,0.1)]">
              <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Animais</p>
              <p className="text-xl font-bold text-foreground dark:text-white">{healthSummary.totalAnimals}</p>
            </div>
            <div className="bg-card dark:bg-[#0d0d0d] rounded-lg p-3 border border-border dark:border-[rgba(255,255,255,0.1)]">
              <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Vacinas OK</p>
              <p className="text-xl font-bold text-emerald-500">{healthSummary.vaccinatedUpToDate}</p>
            </div>
            <div className="bg-card dark:bg-[#0d0d0d] rounded-lg p-3 border border-border dark:border-[rgba(255,255,255,0.1)]">
              <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Atrasadas</p>
              <p className="text-xl font-bold text-red-500">{healthSummary.vaccineOverdue}</p>
            </div>
            <div className="bg-card dark:bg-[#0d0d0d] rounded-lg p-3 border border-border dark:border-[rgba(255,255,255,0.1)]">
              <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Alertas</p>
              <p className="text-xl font-bold text-amber-500">{healthSummary.activeAlerts}</p>
            </div>
            <div className="bg-card dark:bg-[#0d0d0d] rounded-lg p-3 border border-border dark:border-[rgba(255,255,255,0.1)]">
              <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Procedimentos</p>
              <p className="text-xl font-bold text-foreground dark:text-white">{healthSummary.totalProcedures}</p>
            </div>
          </div>

          {/* Alertas Críticos */}
          {healthSummary.vaccineOverdue > 0 && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-foreground dark:text-white font-medium mb-1">
                    Atenção: {healthSummary.vaccineOverdue} animais com vacinas atrasadas
                  </p>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                    É importante manter o calendário de vacinação em dia para garantir a saúde do plantel.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Período do Relatório */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Período do Relatório
            </label>
            <NativeSelect
              value={reportPeriod}
              onChange={(e) => setReportPeriod(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
            >
              <option value="current">Situação Atual</option>
              <option value="month">Último Mês</option>
              <option value="quarter">Último Trimestre</option>
              <option value="semester">Último Semestre</option>
              <option value="year">Último Ano</option>
              <option value="custom">Período Personalizado</option>
            </NativeSelect>

            {reportPeriod === 'custom' && (
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <label className="block text-xs text-muted-foreground dark:text-[#99a1af] mb-1">
                    Data Inicial
                  </label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-sm text-foreground dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground dark:text-[#99a1af] mb-1">
                    Data Final
                  </label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-sm text-foreground dark:text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Filtros de Animais */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-3">
              Filtros de Animais {!animalFilters.includeAll && `(${selectedFiltersCount} filtros)`}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                onClick={() => handleToggleFilter('includeAll')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  animalFilters.includeAll
                    ? 'border-primary dark:border-white bg-primary/5 dark:bg-white/5'
                    : 'border-border dark:border-[rgba(255,255,255,0.1)] hover:border-[#3a3a3a]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    animalFilters.includeAll
                      ? 'border-primary dark:border-white bg-primary dark:bg-white'
                      : 'border-border dark:border-[rgba(255,255,255,0.3)]'
                  }`}>
                    {animalFilters.includeAll && <Check className="w-3 h-3 text-white dark:text-black" />}
                  </div>
                  <span className="text-sm text-foreground dark:text-white">Todos os Animais</span>
                </div>
              </button>

              <button
                onClick={() => handleToggleFilter('withAlerts')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  animalFilters.withAlerts
                    ? 'border-primary dark:border-white bg-primary/5 dark:bg-white/5'
                    : 'border-border dark:border-[rgba(255,255,255,0.1)] hover:border-[#3a3a3a]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    animalFilters.withAlerts
                      ? 'border-primary dark:border-white bg-primary dark:bg-white'
                      : 'border-border dark:border-[rgba(255,255,255,0.3)]'
                  }`}>
                    {animalFilters.withAlerts && <Check className="w-3 h-3 text-white dark:text-black" />}
                  </div>
                  <span className="text-sm text-foreground dark:text-white">Com Alertas</span>
                </div>
              </button>

              <button
                onClick={() => handleToggleFilter('vaccineOverdue')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  animalFilters.vaccineOverdue
                    ? 'border-primary dark:border-white bg-primary/5 dark:bg-white/5'
                    : 'border-border dark:border-[rgba(255,255,255,0.1)] hover:border-[#3a3a3a]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    animalFilters.vaccineOverdue
                      ? 'border-primary dark:border-white bg-primary dark:bg-white'
                      : 'border-border dark:border-[rgba(255,255,255,0.3)]'
                  }`}>
                    {animalFilters.vaccineOverdue && <Check className="w-3 h-3 text-white dark:text-black" />}
                  </div>
                  <span className="text-sm text-foreground dark:text-white">Vacinas Atrasadas</span>
                </div>
              </button>

              <button
                onClick={() => handleToggleFilter('underTreatment')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  animalFilters.underTreatment
                    ? 'border-primary dark:border-white bg-primary/5 dark:bg-white/5'
                    : 'border-border dark:border-[rgba(255,255,255,0.1)] hover:border-[#3a3a3a]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    animalFilters.underTreatment
                      ? 'border-primary dark:border-white bg-primary dark:bg-white'
                      : 'border-border dark:border-[rgba(255,255,255,0.3)]'
                  }`}>
                    {animalFilters.underTreatment && <Check className="w-3 h-3 text-white dark:text-black" />}
                  </div>
                  <span className="text-sm text-foreground dark:text-white">Em Tratamento</span>
                </div>
              </button>
            </div>
          </div>

          {/* Seções do Relatório */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm text-foreground dark:text-white">
                Seções do Relatório ({selectedSectionsCount}/10 selecionadas)
              </label>
              <button
                onClick={() => {
                  // Selecionar apenas recomendadas
                  const recommended = sections.reduce((acc, section) => ({
                    ...acc,
                    [section.key]: section.recommended
                  }), {} as typeof reportSections);
                  setReportSections(recommended);
                }}
                className="text-sm text-primary dark:text-white hover:opacity-80 transition-opacity"
              >
                Selecionar recomendadas
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sections.map((section) => (
                <button
                  key={section.key}
                  onClick={() => handleToggleSection(section.key as keyof typeof reportSections)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    reportSections[section.key as keyof typeof reportSections]
                      ? 'border-primary dark:border-white bg-primary/5 dark:bg-white/5'
                      : 'border-border dark:border-[rgba(255,255,255,0.1)] hover:border-[#3a3a3a]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      reportSections[section.key as keyof typeof reportSections]
                        ? 'border-primary dark:border-white bg-primary dark:bg-white'
                        : 'border-border dark:border-[rgba(255,255,255,0.3)]'
                    }`}>
                      {reportSections[section.key as keyof typeof reportSections] && (
                        <Check className="w-3 h-3 text-white dark:text-black" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-foreground dark:text-white">
                          {section.label}
                        </p>
                        {section.recommended && (
                          <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-500 rounded">
                            Recomendada
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
                        {section.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Opções de Formatação */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Formato de Exportação
              </label>
              <NativeSelect
                value={reportFormat}
                onChange={(e) => setReportFormat(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel (XLSX)</option>
                <option value="csv">CSV</option>
              </NativeSelect>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setIncludeDetails(!includeDetails)}
                className="flex items-center gap-3 w-full p-3 rounded-lg border border-border dark:border-[rgba(255,255,255,0.1)] hover:border-[#3a3a3a] transition-all"
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  includeDetails
                    ? 'border-primary dark:border-white bg-primary dark:bg-white'
                    : 'border-border dark:border-[rgba(255,255,255,0.3)]'
                }`}>
                  {includeDetails && <Check className="w-3 h-3 text-white dark:text-black" />}
                </div>
                <span className="text-sm text-foreground dark:text-white">Incluir detalhamento por animal</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-border dark:border-[#333333] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleGenerate}
            disabled={selectedSectionsCount === 0}
            className="flex-1 px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Gerar Relatório
          </button>
        </div>
      </div>
    </div>
  );
}