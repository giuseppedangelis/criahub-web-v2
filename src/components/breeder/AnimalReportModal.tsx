import { useMemo, useState } from 'react';
import { X, FileText, Download, Check } from 'lucide-react';
import { NativeSelect } from '../ui/native-select';
import { toast } from 'sonner';
import { useUser } from '@/contexts/UserContext';
import { useAnimals } from '@/hooks/useAnimals';
import { useHaras } from '@/hooks/useHaras';
import { useCreateReport } from '@/hooks/useReports';
import type { ReportFormat, ReportType } from '@/types';
import { uploadReportFile } from '@/services/reportFiles';

interface AnimalReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportType?: ReportType;
}

export function AnimalReportModal({ isOpen, onClose, reportType = 'animal' }: AnimalReportModalProps) {
  const { stableHarasId, isSessionReady, profile } = useUser();
  const harasId = isSessionReady ? (stableHarasId || '') : '';
  const { data: haras } = useHaras(harasId);
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

  const { data: animalsResponse, isLoading: isLoadingAnimals } = useAnimals(
    { haras_id: harasId },
    { page: 1, limit: 200 },
    !!harasId && isSessionReady
  );
  const animals = animalsResponse?.data || [];
  const { mutateAsync: createReport, isPending: isCreating } = useCreateReport();

  const selectedAnimalData = useMemo(
    () => animals.find((animal) => animal.id === selectedAnimal),
    [animals, selectedAnimal]
  );

  const formatDate = (value?: string | null) => {
    if (!value) return '-';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return '-';
    return parsed.toLocaleDateString('pt-BR');
  };

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

  const handleGenerate = async () => {
    if (!selectedAnimal) {
      toast.error('Por favor, selecione um animal');
      return;
    }
    if (!harasId) {
      toast.error('Haras não identificado.');
      return;
    }

    const baseName = reportType === 'premiacoes'
      ? 'Relatório de Premiações'
      : 'Relatório Individual';
    const reportName = selectedAnimalData
      ? `${baseName} - ${selectedAnimalData.name}`
      : baseName;

    try {
      const selectedSections = sections
        .filter((section) => reportSections[section.key as keyof typeof reportSections])
        .map((section) => section.label);

      const reportPayload = {
        reportType,
        meta: {
          title: reportName,
          subtitle: reportType === 'premiacoes'
            ? 'Histórico completo de conquistas e premiações'
            : 'Ficha completa do animal com dados principais',
          harasName: haras?.name || 'Haras',
          harasLocation: [haras?.city, haras?.state].filter(Boolean).join(' • '),
          author: profile?.full_name || profile?.email || 'Equipe CriaHub',
          generatedAt: new Date().toISOString(),
          periodLabel: 'Atual',
          orientation: pageOrientation === 'landscape' ? 'landscape' : 'portrait',
        },
        heroImageUrl: includeImages ? selectedAnimalData?.main_image_url || undefined : undefined,
        tags: [
          reportType === 'premiacoes' ? 'Premiações' : 'Animal',
          selectedAnimalData?.status || '',
          selectedAnimalData?.category || '',
        ].filter(Boolean),
        summary: [
          { label: 'Animal', value: selectedAnimalData?.name || '-' },
          { label: 'Registro', value: selectedAnimalData?.registry_number || '-' },
          { label: 'Sexo', value: selectedAnimalData?.sex || '-' },
          { label: 'Categoria', value: selectedAnimalData?.category || '-' },
          { label: 'Nascimento', value: formatDate(selectedAnimalData?.birth_date) },
          { label: 'Status', value: selectedAnimalData?.status || '-', tone: selectedAnimalData?.status === 'ativo' ? 'success' : 'warning' },
        ],
        sections: [
          {
            title: 'Ficha do Animal',
            description: 'Dados principais do animal registrado no sistema.',
            table: {
              headers: ['Campo', 'Valor'],
              rows: [
                ['Nome', selectedAnimalData?.name || '-'],
                ['Registro', selectedAnimalData?.registry_number || '-'],
                ['Sexo', selectedAnimalData?.sex || '-'],
                ['Categoria', selectedAnimalData?.category || '-'],
                ['Nascimento', formatDate(selectedAnimalData?.birth_date)],
                ['Pelagem', selectedAnimalData?.coat_color || '-'],
                ['Localização', selectedAnimalData?.location || '-'],
                ['Status', selectedAnimalData?.status || '-'],
              ],
            },
          },
          {
            title: 'Seções selecionadas',
            description: 'Conteúdos que serão incluídos no relatório detalhado.',
            bullets: selectedSections,
          },
          {
            title: 'Configurações',
            bullets: [
              `Imagens em alta qualidade: ${includeImages ? 'Sim' : 'Não'}`,
              `Orientação: ${pageOrientation === 'landscape' ? 'Paisagem' : 'Retrato'}`,
            ],
          },
        ],
      };

      const { fileUrl, sizeBytes, storedFormat, notice } = await uploadReportFile({
        harasId,
        reportName,
        format: reportFormat as ReportFormat,
        payload: reportPayload,
        reportType,
      });

      if (notice) {
        toast.message(notice);
      }

      await createReport({
        haras_id: harasId,
        name: reportName,
        type: reportType,
        format: storedFormat,
        created_by: profile?.id,
        file_url: fileUrl,
        size_bytes: sizeBytes,
        parameters: reportPayload,
      });
      toast.success('Relatório solicitado com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório.');
    }
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
            <h3 className="text-xl text-foreground dark:text-white">
              {reportType === 'premiacoes' ? 'Relatório de Premiações' : 'Relatório Individual de Animal'}
            </h3>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-1">
              {reportType === 'premiacoes'
                ? 'Gere um relatório de conquistas e premiações por animal'
                : 'Gere um relatório completo de um animal específico'}
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
              {isLoadingAnimals && (
                <option value="" disabled>Carregando animais...</option>
              )}
              {animals.map(animal => (
                <option key={animal.id} value={animal.id}>
                  {animal.name} - {animal.registry_number || '-'}
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
            disabled={!selectedAnimal || selectedCount === 0 || isCreating}
            className="flex-1 px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            {isCreating ? 'Gerando...' : 'Gerar Relatório'}
          </button>
        </div>
      </div>
    </div>
  );
}
