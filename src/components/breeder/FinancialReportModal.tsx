import { useState } from 'react';
import { X, DollarSign, Download, Check, TrendingUp, TrendingDown } from 'lucide-react';
import { NativeSelect } from '../ui/native-select';

interface FinancialReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FinancialReportModal({ isOpen, onClose }: FinancialReportModalProps) {
  const [reportPeriod, setReportPeriod] = useState('year');
  const [fiscalYear, setFiscalYear] = useState('2024');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [reportSections, setReportSections] = useState({
    resumoExecutivo: true,
    receitas: true,
    despesas: true,
    fluxoCaixa: true,
    analiseROI: false,
    comparativoAnos: true,
    projecoes: false,
    graficos: true,
    detalhamentoAnimais: false,
    impostos: false,
  });
  const [detailLevel, setDetailLevel] = useState('medium');
  const [reportFormat, setReportFormat] = useState('pdf');
  const [includeCharts, setIncludeCharts] = useState(true);

  const handleToggleSection = (section: keyof typeof reportSections) => {
    setReportSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
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
    console.log('Gerando relatório financeiro:', { 
      reportPeriod, 
      reportSections, 
      detailLevel,
      reportFormat 
    });
    onClose();
  };

  const sections = [
    { 
      key: 'resumoExecutivo', 
      label: 'Resumo Executivo', 
      description: 'Visão geral com principais indicadores financeiros',
      recommended: true
    },
    { 
      key: 'receitas', 
      label: 'Análise de Receitas', 
      description: 'Vendas, coberturas, aluguéis e outras receitas',
      recommended: true
    },
    { 
      key: 'despesas', 
      label: 'Análise de Despesas', 
      description: 'Custos operacionais, saúde, alimentação e manutenção',
      recommended: true
    },
    { 
      key: 'fluxoCaixa', 
      label: 'Fluxo de Caixa', 
      description: 'Entradas e saídas mensais com saldo acumulado',
      recommended: false
    },
    { 
      key: 'analiseROI', 
      label: 'Análise de ROI', 
      description: 'Retorno sobre investimento por animal e categoria',
      recommended: false
    },
    { 
      key: 'comparativoAnos', 
      label: 'Comparativo entre Anos', 
      description: 'Evolução financeira ano a ano',
      recommended: true
    },
    { 
      key: 'projecoes', 
      label: 'Projeções Futuras', 
      description: 'Estimativas financeiras para próximos períodos',
      recommended: false
    },
    { 
      key: 'graficos', 
      label: 'Gráficos e Dashboards', 
      description: 'Visualizações de dados financeiros',
      recommended: true
    },
    { 
      key: 'detalhamentoAnimais', 
      label: 'Detalhamento por Animal', 
      description: 'Custos e receitas individuais de cada animal',
      recommended: false
    },
    { 
      key: 'impostos', 
      label: 'Informações Fiscais', 
      description: 'Base para declaração de impostos',
      recommended: false
    },
  ];

  const selectedSectionsCount = Object.values(reportSections).filter(v => v).length;

  // Mock de dados financeiros
  const financialSummary = {
    totalReceitas: 285000,
    totalDespesas: 142000,
    lucro: 143000,
    crescimentoAnual: 23.5
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)] sticky top-0 bg-card dark:bg-[#1a1a1a] z-10">
          <div>
            <h3 className="text-xl text-foreground dark:text-white">Relatório Financeiro</h3>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-1">
              Análise completa das finanças do haras
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
          {/* Resumo Financeiro Rápido */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Receitas Totais</p>
                <p className="text-lg font-bold text-foreground dark:text-white flex items-center gap-1">
                  {formatCurrency(financialSummary.totalReceitas)}
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Despesas Totais</p>
                <p className="text-lg font-bold text-foreground dark:text-white flex items-center gap-1">
                  {formatCurrency(financialSummary.totalDespesas)}
                  <TrendingDown className="w-4 h-4 text-red-500" />
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Lucro/Prejuízo</p>
                <p className="text-lg font-bold text-emerald-500">
                  {formatCurrency(financialSummary.lucro)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Crescimento</p>
                <p className="text-lg font-bold text-emerald-500">
                  +{financialSummary.crescimentoAnual}%
                </p>
              </div>
            </div>
          </div>

          {/* Período do Relatório */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Período do Relatório
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NativeSelect
                value={reportPeriod}
                onChange={(e) => setReportPeriod(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
              >
                <option value="month">Mensal</option>
                <option value="quarter">Trimestral</option>
                <option value="semester">Semestral</option>
                <option value="year">Anual</option>
                <option value="custom">Personalizado</option>
              </NativeSelect>

              {reportPeriod !== 'custom' && (
                <NativeSelect
                  value={fiscalYear}
                  onChange={(e) => setFiscalYear(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                >
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </NativeSelect>
              )}
            </div>

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

          {/* Nível de Detalhamento */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Nível de Detalhamento
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['basic', 'medium', 'detailed'] as const).map((level) => {
                const labels = {
                  basic: { title: 'Básico', desc: 'Resumo executivo' },
                  medium: { title: 'Médio', desc: 'Análises principais' },
                  detailed: { title: 'Detalhado', desc: 'Análise completa' }
                };
                
                return (
                  <button
                    key={level}
                    onClick={() => setDetailLevel(level)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      detailLevel === level
                        ? 'border-primary dark:border-white bg-primary/5 dark:bg-white/5'
                        : 'border-border dark:border-[rgba(255,255,255,0.1)] hover:border-[#3a3a3a]'
                    }`}
                  >
                    <p className="text-sm font-medium text-foreground dark:text-white">
                      {labels[level].title}
                    </p>
                    <p className="text-xs text-muted-foreground dark:text-[#99a1af] mt-1">
                      {labels[level].desc}
                    </p>
                  </button>
                );
              })}
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
                onClick={() => setIncludeCharts(!includeCharts)}
                className="flex items-center gap-3 w-full p-3 rounded-lg border border-border dark:border-[rgba(255,255,255,0.1)] hover:border-[#3a3a3a] transition-all"
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  includeCharts
                    ? 'border-primary dark:border-white bg-primary dark:bg-white'
                    : 'border-border dark:border-[rgba(255,255,255,0.3)]'
                }`}>
                  {includeCharts && <Check className="w-3 h-3 text-white dark:text-black" />}
                </div>
                <span className="text-sm text-foreground dark:text-white">Incluir gráficos e tabelas</span>
              </button>
            </div>
          </div>

          {/* Aviso Confidencial */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-foreground dark:text-white font-medium mb-1">Informações Confidenciais</p>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                  Este relatório contém dados financeiros sensíveis. Mantenha-o em local seguro e não compartilhe sem autorização.
                </p>
              </div>
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