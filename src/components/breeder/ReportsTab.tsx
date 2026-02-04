import { useMemo, useState } from 'react';
import { FileText, Download, Calendar, TrendingUp, DollarSign, Activity, Users, Award, Printer, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '@/contexts/UserContext';
import { useReports, useReportsSummary } from '@/hooks/useReports';
import { reportsService } from '@/services/reports';
import { REPORT_LAYOUT_VERSION, uploadReportFile } from '@/services/reportFiles';
import type { ReportFormat, ReportType } from '@/types';

interface ReportTemplate {
  id: string;
  reportType: ReportType;
  name: string;
  description: string;
  icon: any;
  color: string;
  category: 'animal' | 'plantel' | 'financeiro' | 'saude';
  lastGenerated?: string;
  frequency: 'manual' | 'mensal' | 'trimestral' | 'anual';
}

interface RecentReport {
  id: string;
  name: string;
  type: string;
  date: string;
  format: string;
  size: string;
  fileUrl?: string | null;
  rawFormat?: ReportFormat;
  rawType?: ReportType;
  parameters?: Record<string, unknown> | null;
}

interface ReportsTabProps {
  onGenerateAnimalReport: (type?: ReportType) => void;
  onGenerateHerdReport: (type?: ReportType) => void;
  onGenerateFinancialReport: () => void;
  onGenerateHealthReport: () => void;
}

const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: '1',
    reportType: 'animal',
    name: 'Relatório Individual de Animal',
    description: 'Histórico completo, genealogia, saúde e premiações de um animal específico',
    icon: FileText,
    color: 'bg-purple-500',
    category: 'animal',
    frequency: 'manual'
  },
  {
    id: '2',
    reportType: 'plantel',
    name: 'Relatório do Plantel Completo',
    description: 'Visão geral do plantel com estatísticas, distribuição e análises',
    icon: Users,
    color: 'bg-emerald-500',
    category: 'plantel',
    frequency: 'mensal'
  },
  {
    id: '3',
    reportType: 'financeiro',
    name: 'Relatório Financeiro',
    description: 'Receitas, despesas, investimentos e ROI do haras',
    icon: DollarSign,
    color: 'bg-amber-500',
    category: 'financeiro',
    frequency: 'mensal'
  },
  {
    id: '4',
    reportType: 'saude',
    name: 'Relatório de Saúde do Plantel',
    description: 'Vacinas, procedimentos veterinários e alertas de saúde',
    icon: Activity,
    color: 'bg-red-500',
    category: 'saude',
    frequency: 'trimestral'
  },
  {
    id: '5',
    reportType: 'premiacoes',
    name: 'Relatório de Premiações',
    description: 'Histórico de competições, troféus e desempenho em exposições',
    icon: Award,
    color: 'bg-gray-500',
    category: 'animal',
    frequency: 'manual'
  },
  {
    id: '6',
    reportType: 'reproducao',
    name: 'Relatório de Reprodução',
    description: 'Coberturas, gestações, nascimentos e índices reprodutivos',
    icon: TrendingUp,
    color: 'bg-pink-500',
    category: 'plantel',
    frequency: 'trimestral'
  }
];

export function ReportsTab({ 
  onGenerateAnimalReport, 
  onGenerateHerdReport, 
  onGenerateFinancialReport,
  onGenerateHealthReport 
}: ReportsTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { stableHarasId, isSessionReady } = useUser();
  const harasId = isSessionReady ? (stableHarasId || '') : '';

  const { data: reportsResponse } = useReports(
    { haras_id: harasId },
    { page: 1, limit: 200 },
    isSessionReady && !!harasId
  );
  const { data: summary } = useReportsSummary(harasId);

  const reports = reportsResponse?.data || [];

  const categoryConfig = {
    'animal': { label: 'Animal', color: 'bg-purple-500' },
    'plantel': { label: 'Plantel', color: 'bg-emerald-500' },
    'financeiro': { label: 'Financeiro', color: 'bg-amber-500' },
    'saude': { label: 'Saúde', color: 'bg-red-500' }
  } as const;

  const frequencyConfig = {
    'manual': { label: 'Manual', color: 'text-gray-500' },
    'mensal': { label: 'Mensal', color: 'text-emerald-500' },
    'trimestral': { label: 'Trimestral', color: 'text-amber-500' },
    'anual': { label: 'Anual', color: 'text-purple-500' }
  } as const;

  const reportTypeLabels: Record<ReportType, string> = {
    animal: 'Animal Individual',
    plantel: 'Plantel Completo',
    financeiro: 'Financeiro',
    saude: 'Saúde do Plantel',
    premiacoes: 'Premiações',
    reproducao: 'Reprodução',
  };

  const lastGeneratedByType = useMemo(() => {
    const map: Partial<Record<ReportType, string>> = {};
    reports.forEach((report) => {
      if (report.created_at && !map[report.type]) {
        map[report.type] = report.created_at;
      }
    });
    return map;
  }, [reports]);

  const reportTemplatesWithHistory = useMemo(() => {
    return REPORT_TEMPLATES.map((template) => ({
      ...template,
      lastGenerated: lastGeneratedByType[template.reportType],
    }));
  }, [lastGeneratedByType]);

  const recentReports: RecentReport[] = useMemo(() => {
    return reports.slice(0, 4).map((report) => ({
      id: report.id,
      name: report.name,
      type: reportTypeLabels[report.type] || report.type,
      date: report.created_at || '',
      format: report.format ? report.format.toUpperCase() : '-',
      size: report.size_bytes ? formatBytes(report.size_bytes) : '-',
      fileUrl: report.file_url,
      rawFormat: report.format,
      rawType: report.type,
      parameters: report.parameters ?? null,
    }));
  }, [reports, reportTypeLabels]);

  const filteredTemplates = selectedCategory === 'all' 
    ? reportTemplatesWithHistory 
    : reportTemplatesWithHistory.filter(t => t.category === selectedCategory);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('pt-BR');
  };

  const handleGenerateReport = (reportType: ReportType) => {
    if (reportType === 'animal' || reportType === 'premiacoes') {
      onGenerateAnimalReport(reportType);
      return;
    }
    if (reportType === 'plantel' || reportType === 'reproducao') {
      onGenerateHerdReport(reportType);
      return;
    }
    if (reportType === 'financeiro') {
      onGenerateFinancialReport();
      return;
    }
    if (reportType === 'saude') {
      onGenerateHealthReport();
    }
  };

  const lastGeneratedLabel = formatDate(summary?.lastGeneratedAt || reports[0]?.created_at);
  const totalReports = summary?.total ?? reportsResponse?.total ?? 0;
  const scheduledReports = summary?.scheduled ?? 0;

  const ensureReportFile = async (report: RecentReport) => {
    if (!harasId) throw new Error('Haras não identificado.');
    const format = report.rawFormat || 'html';
    const payload = report.parameters || {};

    const { fileUrl, sizeBytes, storedFormat, notice } = await uploadReportFile({
      harasId,
      reportName: report.name,
      format,
      payload,
      reportType: report.rawType,
    });

    await reportsService.update(report.id, {
      file_url: fileUrl,
      size_bytes: sizeBytes,
      format: storedFormat,
      status: 'Gerado',
    });

    if (notice) {
      toast.message(notice);
    }

    return fileUrl;
  };

  const handleDownload = async (report: RecentReport) => {
    try {
      const metaVersion = (report.parameters as any)?.meta?.layoutVersion;
      const shouldRegenerate = !report.fileUrl || !metaVersion || metaVersion !== REPORT_LAYOUT_VERSION;
      const url = shouldRegenerate ? await ensureReportFile(report) : report.fileUrl;
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Erro ao baixar relatório:', error);
      toast.error('Relatório ainda não está disponível para download.');
    }
  };

  const handlePrint = async (report: RecentReport) => {
    try {
      const metaVersion = (report.parameters as any)?.meta?.layoutVersion;
      const shouldRegenerate = !report.fileUrl || !metaVersion || metaVersion !== REPORT_LAYOUT_VERSION;
      const url = shouldRegenerate ? await ensureReportFile(report) : report.fileUrl;
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Erro ao imprimir relatório:', error);
      toast.error('Relatório ainda não está disponível para impressão.');
    }
  };

  function formatBytes(bytes: number): string {
    if (!bytes || bytes <= 0) return '-';
    const units = ['B', 'KB', 'MB', 'GB'];
    let value = bytes;
    let unitIndex = 0;
    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex += 1;
    }
    return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
  }


  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card dark:bg-[#1a1a1a] rounded-xl p-4 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground dark:text-white">{REPORT_TEMPLATES.length}</p>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Tipos Disponíveis</p>
            </div>
          </div>
        </div>

        <div className="bg-card dark:bg-[#1a1a1a] rounded-xl p-4 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground dark:text-white">{totalReports}</p>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Relatórios Gerados</p>
            </div>
          </div>
        </div>

        <div className="bg-card dark:bg-[#1a1a1a] rounded-xl p-4 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground dark:text-white">{lastGeneratedLabel}</p>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Último Gerado</p>
            </div>
          </div>
        </div>

        <div className="bg-card dark:bg-[#1a1a1a] rounded-xl p-4 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-500/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground dark:text-white">{scheduledReports}</p>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Agendados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtro de Categoria */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            selectedCategory === 'all'
              ? 'bg-primary dark:bg-white text-white dark:text-black'
              : 'bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white hover:bg-[#3a3a3a]'
          }`}
        >
          Todos
        </button>
        {Object.entries(categoryConfig).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === key
                ? 'bg-primary dark:bg-white text-white dark:text-black'
                : 'bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white hover:bg-[#3a3a3a]'
            }`}
          >
            {config.label}
          </button>
        ))}
      </div>

      {/* Templates de Relatórios */}
      <div>
        <h4 className="text-lg text-foreground dark:text-white mb-4">Modelos de Relatórios</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => {
            const Icon = template.icon;
            const categoryInfo = categoryConfig[template.category];
            const frequencyInfo = frequencyConfig[template.frequency];
            
            return (
              <div
                key={template.id}
                className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)] hover:border-[#3a3a3a] transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${template.color}/20 rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${template.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div className="flex gap-1">
                    <span className={`${categoryInfo.color} text-white px-2 py-1 rounded-md text-xs font-medium`}>
                      {categoryInfo.label}
                    </span>
                  </div>
                </div>

                <h5 className="text-foreground dark:text-white font-medium mb-2">{template.name}</h5>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-4 line-clamp-2">
                  {template.description}
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground dark:text-[#99a1af] mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span className={frequencyInfo.color}>{frequencyInfo.label}</span>
                  </div>
                  {template.lastGenerated && (
                    <span>Último: {formatDate(template.lastGenerated)}</span>
                  )}
                </div>

                <button
                  onClick={() => handleGenerateReport(template.reportType)}
                  className="w-full px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Gerar Relatório
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Relatórios Recentes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg text-foreground dark:text-white">Relatórios Recentes</h4>
          <button className="text-sm text-primary dark:text-white hover:opacity-80 transition-opacity">
            Ver todos
          </button>
        </div>

        <div className="space-y-3">
          {recentReports.length === 0 && (
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
              Nenhum relatório gerado ainda.
            </p>
          )}
          {recentReports.map((report) => (
            <div
              key={report.id}
              className="bg-card dark:bg-[#1a1a1a] rounded-xl p-4 border border-border dark:border-[rgba(255,255,255,0.1)] hover:border-[#3a3a3a] transition-all"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
                  <div className="w-10 h-10 bg-muted dark:bg-[#0d0d0d] rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground dark:text-white font-medium">{report.name}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground dark:text-[#99a1af]">{report.type}</span>
                      <span className="text-xs text-muted-foreground dark:text-[#99a1af]">•</span>
                      <span className="text-xs text-muted-foreground dark:text-[#99a1af]">{formatDate(report.date)}</span>
                      <span className="text-xs text-muted-foreground dark:text-[#99a1af]">•</span>
                      <span className="text-xs text-muted-foreground dark:text-[#99a1af]">{report.size}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <span className="px-3 py-1 bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white rounded-md text-xs font-medium">
                    {report.format}
                  </span>
                  <button
                    onClick={() => handleDownload(report)}
                    className="p-2 hover:bg-muted dark:hover:bg-[#0d0d0d] rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4 text-foreground dark:text-white" />
                  </button>
                  <button
                    onClick={() => handlePrint(report)}
                    className="p-2 hover:bg-muted dark:hover:bg-[#0d0d0d] rounded-lg transition-colors"
                  >
                    <Printer className="w-4 h-4 text-foreground dark:text-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dicas */}
      <div className="bg-gray-500/10 border border-gray-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-foreground dark:text-white font-medium mb-1">Dicas sobre Relatórios</p>
            <ul className="text-sm text-muted-foreground dark:text-[#99a1af] space-y-1">
              <li>• Os relatórios são gerados em tempo real com os dados mais atualizados</li>
              <li>• Você pode exportar em PDF para compartilhar ou Excel para análises</li>
              <li>• Relatórios agendados são gerados automaticamente no período configurado</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
