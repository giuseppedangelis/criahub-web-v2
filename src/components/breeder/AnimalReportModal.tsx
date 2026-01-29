import { useState } from 'react';
import { X, FileText, Download, Printer, Check } from 'lucide-react';
import { NativeSelect } from '../ui/native-select';

interface AnimalReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AnimalReportModal({ isOpen, onClose }: AnimalReportModalProps) {
  const [selectedAnimal, setSelectedAnimal] = useState('');
  const [reportSections, setReportSections] = useState({
    dadosBasicos: true,
    genealogia: true,
    fotos: true,
    videos: false,
    premiacoes: true,
    saude: true,
    reproducao: true,
    financeiro: false,
    documentos: true,
    historico: true,
  });
  const [reportFormat, setReportFormat] = useState('pdf');
  const [includeImages, setIncludeImages] = useState(true);
  const [pageOrientation, setPageOrientation] = useState('portrait');

  // Lista de animais mock
  const animals = [
    { id: 1, name: 'Ventania da Serra', registry: 'MM-12345' },
    { id: 2, name: 'Relâmpago Dourado', registry: 'MM-23456' },
    { id: 3, name: 'Estrela do Vale', registry: 'MM-34567' },
    { id: 4, name: 'Trovão da Mata', registry: 'MM-45678' },
    { id: 5, name: 'Aurora Campeira', registry: 'MM-56789' },
  ];

  const handleToggleSection = (section: keyof typeof reportSections) => {
    setReportSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSelectAll = () => {
    const allSelected = Object.values(reportSections).every(v => v);
    const newState = Object.keys(reportSections).reduce((acc, key) => ({
      ...acc,
      [key]: !allSelected
    }), {} as typeof reportSections);
    setReportSections(newState);
  };

  const handleGenerate = () => {
    if (!selectedAnimal) {
      alert('Por favor, selecione um animal');
      return;
    }
    // Aqui seria a lógica de geração do relatório
    console.log('Gerando relatório:', { selectedAnimal, reportSections, reportFormat });
    onClose();
  };

  const sections = [
    { key: 'dadosBasicos', label: 'Dados Básicos', description: 'Nome, registro, sexo, idade, pelagem' },
    { key: 'genealogia', label: 'Genealogia', description: 'Árvore genealógica completa até 4ª geração' },
    { key: 'fotos', label: 'Galeria de Fotos', description: 'Fotos cadastradas do animal' },
    { key: 'videos', label: 'Galeria de Vídeos', description: 'Links para vídeos de marcha e competições' },
    { key: 'premiacoes', label: 'Premiações', description: 'Histórico completo de troféus e conquistas' },
    { key: 'saude', label: 'Histórico de Saúde', description: 'Vacinas, exames e procedimentos veterinários' },
    { key: 'reproducao', label: 'Dados de Reprodução', description: 'Coberturas, gestações e filhos' },
    { key: 'financeiro', label: 'Informações Financeiras', description: 'Custos e valor de mercado' },
    { key: 'documentos', label: 'Documentos', description: 'Certificados, laudos e atestados' },
    { key: 'historico', label: 'Histórico de Eventos', description: 'Timeline completa de eventos do animal' },
  ];

  const selectedCount = Object.values(reportSections).filter(v => v).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)] sticky top-0 bg-card dark:bg-[#1a1a1a] z-10">
          <div>
            <h3 className="text-xl text-foreground dark:text-white">Relatório Individual de Animal</h3>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-1">
              Gere um relatório completo de um animal específico
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
          {/* Seleção de Animal */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Selecione o Animal *
            </label>
            <NativeSelect
              value={selectedAnimal}
              onChange={(e) => setSelectedAnimal(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
            >
              <option value="">Selecione um animal</option>
              {animals.map(animal => (
                <option key={animal.id} value={animal.id}>
                  {animal.name} - {animal.registry}
                </option>
              ))}
            </NativeSelect>
          </div>

          {/* Seções do Relatório */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm text-foreground dark:text-white">
                Seções do Relatório ({selectedCount}/10 selecionadas)
              </label>
              <button
                onClick={handleSelectAll}
                className="text-sm text-primary dark:text-white hover:opacity-80 transition-opacity"
              >
                {selectedCount === sections.length ? 'Desmarcar todas' : 'Selecionar todas'}
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
                <option value="docx">Word (DOCX)</option>
                <option value="html">HTML</option>
              </NativeSelect>
            </div>

            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Orientação da Página
              </label>
              <NativeSelect
                value={pageOrientation}
                onChange={(e) => setPageOrientation(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
              >
                <option value="portrait">Retrato</option>
                <option value="landscape">Paisagem</option>
              </NativeSelect>
            </div>
          </div>

          {/* Opções Adicionais */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-3">
              Opções Adicionais
            </label>
            <div className="space-y-3">
              <button
                onClick={() => setIncludeImages(!includeImages)}
                className="flex items-center gap-3 w-full p-3 rounded-lg border border-border dark:border-[rgba(255,255,255,0.1)] hover:border-[#3a3a3a] transition-all"
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  includeImages
                    ? 'border-primary dark:border-white bg-primary dark:bg-white'
                    : 'border-border dark:border-[rgba(255,255,255,0.3)]'
                }`}>
                  {includeImages && <Check className="w-3 h-3 text-white dark:text-black" />}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm text-foreground dark:text-white">Incluir imagens em alta qualidade</p>
                  <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
                    O arquivo ficará maior, mas com melhor qualidade visual
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Preview de Estimativa */}
          <div className="bg-muted dark:bg-[#0d0d0d] rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
              <p className="text-sm text-foreground dark:text-white font-medium">Estimativa do Relatório</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground dark:text-[#99a1af]">Páginas estimadas</p>
                <p className="text-foreground dark:text-white font-medium">
                  {selectedCount * 2 + 5} - {selectedCount * 3 + 8} páginas
                </p>
              </div>
              <div>
                <p className="text-muted-foreground dark:text-[#99a1af]">Tamanho estimado</p>
                <p className="text-foreground dark:text-white font-medium">
                  {includeImages ? '3-5 MB' : '500-800 KB'}
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
            disabled={!selectedAnimal || selectedCount === 0}
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