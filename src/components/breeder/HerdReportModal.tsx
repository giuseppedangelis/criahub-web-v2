import { useState } from 'react';
import { X, FileText, Download, Check, Calendar } from 'lucide-react';
import { NativeSelect } from '../ui/native-select';

interface HerdReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HerdReportModal({ isOpen, onClose }: HerdReportModalProps) {
  const [reportPeriod, setReportPeriod] = useState('current');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [reportSections, setReportSections] = useState({
    resumoGeral: true,
    estatisticas: true,
    distribuicao: true,
    genealogia: false,
    reproducao: true,
    saude: true,
    financeiro: false,
    premiacoes: true,
    graficos: true,
    listaAnimais: true,
  });
  const [animalFilters, setAnimalFilters] = useState({
    includeAll: true,
    onlyMales: false,
    onlyFemales: false,
    onlyBreeding: false,
    onlyCompetition: false,
  });
  const [reportFormat, setReportFormat] = useState('pdf');
  const [includePhotos, setIncludePhotos] = useState(false);

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
        onlyMales: false,
        onlyFemales: false,
        onlyBreeding: false,
        onlyCompetition: false,
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
    console.log('Gerando relatório do plantel:', { 
      reportPeriod, 
      reportSections, 
      animalFilters,
      reportFormat 
    });
    onClose();
  };

  const sections = [
    { key: 'resumoGeral', label: 'Resumo Geral', description: 'Visão executiva do haras com principais métricas' },
    { key: 'estatisticas', label: 'Estatísticas Detalhadas', description: 'Números completos do plantel' },
    { key: 'distribuicao', label: 'Distribuição do Plantel', description: 'Por sexo, idade, categoria e pelagem' },
    { key: 'genealogia', label: 'Análise Genealógica', description: 'Linhagens e concentração genética' },
    { key: 'reproducao', label: 'Dados de Reprodução', description: 'Coberturas, gestações e nascimentos' },
    { key: 'saude', label: 'Resumo de Saúde', description: 'Vacinas em dia, exames e alertas' },
    { key: 'financeiro', label: 'Análise Financeira', description: 'Custos, receitas e investimentos' },
    { key: 'premiacoes', label: 'Histórico de Premiações', description: 'Troféus e conquistas do plantel' },
    { key: 'graficos', label: 'Gráficos e Dashboards', description: 'Visualizações de dados do plantel' },
    { key: 'listaAnimais', label: 'Lista Completa de Animais', description: 'Tabela com todos os animais do plantel' },
  ];

  const selectedSectionsCount = Object.values(reportSections).filter(v => v).length;
  const selectedFiltersCount = Object.entries(animalFilters).filter(([k, v]) => k !== 'includeAll' && v).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)] sticky top-0 bg-card dark:bg-[#1a1a1a] z-10">
          <div>
            <h3 className="text-xl text-foreground dark:text-white">Relatório do Plantel Completo</h3>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-1">
              Gere um relatório abrangente de todo o plantel do haras
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
              Filtros de Animais {!animalFilters.includeAll && `(${selectedFiltersCount} selecionados)`}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
                onClick={() => handleToggleFilter('onlyMales')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  animalFilters.onlyMales
                    ? 'border-primary dark:border-white bg-primary/5 dark:bg-white/5'
                    : 'border-border dark:border-[rgba(255,255,255,0.1)] hover:border-[#3a3a3a]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    animalFilters.onlyMales
                      ? 'border-primary dark:border-white bg-primary dark:bg-white'
                      : 'border-border dark:border-[rgba(255,255,255,0.3)]'
                  }`}>
                    {animalFilters.onlyMales && <Check className="w-3 h-3 text-white dark:text-black" />}
                  </div>
                  <span className="text-sm text-foreground dark:text-white">Apenas Machos</span>
                </div>
              </button>

              <button
                onClick={() => handleToggleFilter('onlyFemales')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  animalFilters.onlyFemales
                    ? 'border-primary dark:border-white bg-primary/5 dark:bg-white/5'
                    : 'border-border dark:border-[rgba(255,255,255,0.1)] hover:border-[#3a3a3a]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    animalFilters.onlyFemales
                      ? 'border-primary dark:border-white bg-primary dark:bg-white'
                      : 'border-border dark:border-[rgba(255,255,255,0.3)]'
                  }`}>
                    {animalFilters.onlyFemales && <Check className="w-3 h-3 text-white dark:text-black" />}
                  </div>
                  <span className="text-sm text-foreground dark:text-white">Apenas Fêmeas</span>
                </div>
              </button>

              <button
                onClick={() => handleToggleFilter('onlyBreeding')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  animalFilters.onlyBreeding
                    ? 'border-primary dark:border-white bg-primary/5 dark:bg-white/5'
                    : 'border-border dark:border-[rgba(255,255,255,0.1)] hover:border-[#3a3a3a]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    animalFilters.onlyBreeding
                      ? 'border-primary dark:border-white bg-primary dark:bg-white'
                      : 'border-border dark:border-[rgba(255,255,255,0.3)]'
                  }`}>
                    {animalFilters.onlyBreeding && <Check className="w-3 h-3 text-white dark:text-black" />}
                  </div>
                  <span className="text-sm text-foreground dark:text-white">Apenas Reprodução</span>
                </div>
              </button>

              <button
                onClick={() => handleToggleFilter('onlyCompetition')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  animalFilters.onlyCompetition
                    ? 'border-primary dark:border-white bg-primary/5 dark:bg-white/5'
                    : 'border-border dark:border-[rgba(255,255,255,0.1)] hover:border-[#3a3a3a]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    animalFilters.onlyCompetition
                      ? 'border-primary dark:border-white bg-primary dark:bg-white'
                      : 'border-border dark:border-[rgba(255,255,255,0.3)]'
                  }`}>
                    {animalFilters.onlyCompetition && <Check className="w-3 h-3 text-white dark:text-black" />}
                  </div>
                  <span className="text-sm text-foreground dark:text-white">Apenas Competição</span>
                </div>
              </button>
            </div>
          </div>

          {/* Seções do Relatório */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-3">
              Seções do Relatório ({selectedSectionsCount}/10 selecionadas)
            </label>
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
                      <p className="text-sm font-medium text-foreground dark:text-white mb-1">
                        {section.label}
                      </p>
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
                onClick={() => setIncludePhotos(!includePhotos)}
                className="flex items-center gap-3 w-full p-3 rounded-lg border border-border dark:border-[rgba(255,255,255,0.1)] hover:border-[#3a3a3a] transition-all"
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  includePhotos
                    ? 'border-primary dark:border-white bg-primary dark:bg-white'
                    : 'border-border dark:border-[rgba(255,255,255,0.3)]'
                }`}>
                  {includePhotos && <Check className="w-3 h-3 text-white dark:text-black" />}
                </div>
                <span className="text-sm text-foreground dark:text-white">Incluir fotos dos animais</span>
              </button>
            </div>
          </div>

          {/* Preview de Estimativa */}
          <div className="bg-muted dark:bg-[#0d0d0d] rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
              <p className="text-sm text-foreground dark:text-white font-medium">Estimativa do Relatório</p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground dark:text-[#99a1af]">Páginas estimadas</p>
                <p className="text-foreground dark:text-white font-medium">
                  {selectedSectionsCount * 3 + 10} - {selectedSectionsCount * 5 + 15} páginas
                </p>
              </div>
              <div>
                <p className="text-muted-foreground dark:text-[#99a1af]">Tamanho estimado</p>
                <p className="text-foreground dark:text-white font-medium">
                  {includePhotos ? '8-12 MB' : '1-2 MB'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground dark:text-[#99a1af]">Tempo de geração</p>
                <p className="text-foreground dark:text-white font-medium">2-5 minutos</p>
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