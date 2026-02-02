import { useMemo, useState } from 'react';
import { FileText, Image as ImageIcon, X, Download, Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { NativeSelect } from '../ui/native-select';
import { useAnimalExams } from '@/hooks/useAnimalHealth';

interface ExamDocument {
  name: string;
  type: 'pdf' | 'image';
  url: string;
}

interface ExamView {
  id: string;
  date: string;
  typeKey: string;
  subType: string;
  laboratory: string;
  requestedBy: string;
  resultKey: 'normal' | 'alterado' | 'critico';
  documents: ExamDocument[];
  observations?: string;
}

interface ExamsHistoryTabProps {
  animalId: string;
  onRegisterExam: () => void;
}

function normalizeKey(value: string | null | undefined): string {
  if (!value) return '';
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function detectTypeKey(examType: string): string {
  const key = normalizeKey(examType);
  if (key.includes('sangue') || key.includes('hemograma')) return 'sangue';
  if (key.includes('imagem') || key.includes('raiox') || key.includes('ultrassom')) return 'imagem';
  if (key.includes('laboratorio') || key.includes('bioquim')) return 'laboratorial';
  if (key.includes('gine')) return 'ginecologico';
  if (key.includes('marcha')) return 'marcha';
  return 'outro';
}

function normalizeResult(value: string | null | undefined): 'normal' | 'alterado' | 'critico' {
  const key = normalizeKey(value || '');
  if (key.includes('crit')) return 'critico';
  if (key.includes('alter')) return 'alterado';
  return 'normal';
}

function getFileName(url: string): string {
  try {
    const parts = url.split('/');
    return parts[parts.length - 1];
  } catch {
    return url;
  }
}

export function ExamsHistoryTab({ animalId, onRegisterExam }: ExamsHistoryTabProps) {
  const [selectedType, setSelectedType] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedExam, setSelectedExam] = useState<ExamView | null>(null);
  const [documentPreview, setDocumentPreview] = useState<ExamDocument | null>(null);

  const { data: examRows, isLoading } = useAnimalExams(animalId);

  const exams = useMemo<ExamView[]>(() => {
    return (examRows || []).map((exam) => {
      const typeKey = detectTypeKey(exam.exam_type);
      const resultKey = normalizeResult(exam.result);
      const documents: ExamDocument[] = (exam.file_urls || []).map((url) => {
        const lowerUrl = url.toLowerCase();
        const type = lowerUrl.endsWith('.pdf') ? 'pdf' : 'image';
        return { name: getFileName(url), type, url };
      });

      return {
        id: exam.id,
        date: exam.exam_date,
        typeKey,
        subType: exam.exam_type,
        laboratory: exam.laboratory || '-',
        requestedBy: exam.veterinarian || '-',
        resultKey,
        documents,
        observations: exam.observations || undefined,
      };
    });
  }, [examRows]);

  const filteredExams = exams.filter((exam) => {
    if (selectedType && exam.typeKey !== selectedType) return false;

    if (selectedPeriod) {
      const examDate = new Date(exam.date);
      const today = new Date();
      const daysDiff = Math.floor((today.getTime() - examDate.getTime()) / (1000 * 60 * 60 * 24));

      if (selectedPeriod === '30' && daysDiff > 30) return false;
      if (selectedPeriod === '60' && daysDiff > 60) return false;
      if (selectedPeriod === '90' && daysDiff > 90) return false;
    }

    return true;
  });

  const totalExams = exams.length;
  const normalResults = exams.filter((e) => e.resultKey === 'normal').length;
  const alteredResults = exams.filter((e) => e.resultKey === 'alterado').length;
  const criticalResults = exams.filter((e) => e.resultKey === 'critico').length;

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const typeConfig = {
    sangue: { label: 'Exame de Sangue', color: 'bg-red-500' },
    imagem: { label: 'Exame de Imagem', color: 'bg-gray-500' },
    laboratorial: { label: 'Laboratorial', color: 'bg-purple-500' },
    ginecologico: { label: 'Ginecologico', color: 'bg-pink-500' },
    marcha: { label: 'Avaliacao de Marcha', color: 'bg-emerald-500' },
    outro: { label: 'Outro', color: 'bg-gray-500' },
  };

  const resultConfig = {
    normal: { label: 'Normal', color: 'bg-emerald-500', textColor: 'text-emerald-500', icon: CheckCircle },
    alterado: { label: 'Alterado', color: 'bg-amber-500', textColor: 'text-amber-500', icon: AlertCircle },
    critico: { label: 'Critico', color: 'bg-red-500', textColor: 'text-red-500', icon: AlertCircle },
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
              <p className="text-2xl font-bold text-foreground dark:text-white">{totalExams}</p>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Total de Exames</p>
            </div>
          </div>
        </div>

        <div className="bg-card dark:bg-[#1a1a1a] rounded-xl p-4 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground dark:text-white">{normalResults}</p>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Resultados Normais</p>
            </div>
          </div>
        </div>

        <div className="bg-card dark:bg-[#1a1a1a] rounded-xl p-4 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground dark:text-white">{alteredResults}</p>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Resultados Alterados</p>
            </div>
          </div>
        </div>

        <div className="bg-card dark:bg-[#1a1a1a] rounded-xl p-4 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground dark:text-white">{criticalResults}</p>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Resultados Criticos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header com Filtros */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h3 className="text-xl text-foreground dark:text-white">Historico de Exames</h3>
          <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-1">
            {filteredExams.length} {filteredExams.length === 1 ? 'exame' : 'exames'} {filteredExams.length === 1 ? 'realizado' : 'realizados'}
          </p>
        </div>
        <button
          className="w-full lg:w-auto px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          onClick={onRegisterExam}
        >
          <Plus className="w-4 h-4" />
          Registrar Exame
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
            <option value="sangue">Exame de Sangue</option>
            <option value="imagem">Exame de Imagem</option>
            <option value="laboratorial">Laboratorial</option>
            <option value="ginecologico">Ginecologico</option>
            <option value="marcha">Avaliacao de Marcha</option>
            <option value="outro">Outro</option>
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

        <button className="px-4 py-2 border border-border dark:border-[#333333] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors flex items-center justify-center gap-2">
          <Download className="w-4 h-4" />
          Exportar Historico
        </button>
      </div>

      {/* Alertas de Resultados Criticos */}
      {criticalResults > 0 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-foreground dark:text-white font-medium mb-1">
                Atencao: {criticalResults} {criticalResults === 1 ? 'exame com resultado critico' : 'exames com resultados criticos'}
              </p>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                Exames com resultados criticos requerem atencao veterinaria imediata.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Exames */}
      <div className="space-y-4">
        {isLoading && (
          <div className="text-center py-8 text-sm text-muted-foreground dark:text-[#99a1af]">
            Carregando exames...
          </div>
        )}
        {!isLoading && filteredExams.map((exam) => (
          <ExamCard
            key={exam.id}
            exam={exam}
            typeConfig={typeConfig}
            resultConfig={resultConfig}
            formatDate={formatDate}
            onViewDetails={() => setSelectedExam(exam)}
            onPreviewDocument={(doc) => setDocumentPreview(doc)}
          />
        ))}
      </div>

      {/* Estado Vazio */}
      {!isLoading && filteredExams.length === 0 && (
        <div className="bg-muted dark:bg-[#0d0d0d] rounded-2xl p-12 text-center border border-border dark:border-[rgba(255,255,255,0.1)]">
          <FileText className="w-16 h-16 text-muted-foreground dark:text-[#99a1af] mx-auto mb-4" />
          <h4 className="text-lg text-foreground dark:text-white mb-2">Nenhum exame encontrado</h4>
          <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-6">
            Nao ha exames registrados com os filtros aplicados.
          </p>
          <button
            className="px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2"
            onClick={onRegisterExam}
          >
            <Plus className="w-4 h-4" />
            Registrar Primeiro Exame
          </button>
        </div>
      )}

      {/* Modal de Detalhes */}
      {selectedExam && (
        <ExamDetailsModal
          exam={selectedExam}
          onClose={() => setSelectedExam(null)}
          resultConfig={resultConfig}
          formatDate={formatDate}
          onPreviewDocument={(doc) => setDocumentPreview(doc)}
        />
      )}

      {/* Modal de Preview de Documento */}
      {documentPreview && (
        <DocumentPreviewModal document={documentPreview} onClose={() => setDocumentPreview(null)} />
      )}
    </div>
  );
}

interface ExamCardProps {
  exam: ExamView;
  typeConfig: any;
  resultConfig: any;
  formatDate: (dateStr: string) => string;
  onViewDetails: () => void;
  onPreviewDocument: (doc: ExamDocument) => void;
}

function ExamCard({ exam, typeConfig, resultConfig, formatDate, onViewDetails, onPreviewDocument }: ExamCardProps) {
  const typeInfo = typeConfig[exam.typeKey] || typeConfig.outro;
  const resultInfo = resultConfig[exam.resultKey];
  const ResultIcon = resultInfo.icon;

  return (
    <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)] hover:border-[#3a3a3a] transition-all">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`w-12 h-12 ${resultInfo.color}/20 rounded-lg flex items-center justify-center flex-shrink-0`}>
            <ResultIcon className={`w-6 h-6 ${resultInfo.textColor}`} />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-lg text-foreground dark:text-white font-medium mb-2 break-words">{exam.subType}</h4>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`${typeInfo.color} text-white px-3 py-1 rounded-md text-xs font-medium`}>
                {typeInfo.label}
              </span>
              <span className={`${resultInfo.color} text-white px-3 py-1 rounded-md text-xs font-medium`}>
                {resultInfo.label}
              </span>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground dark:text-[#99a1af]">{formatDate(exam.date)}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Laboratorio/Clinica</p>
          <p className="text-sm text-foreground dark:text-white break-words">{exam.laboratory}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Solicitado por</p>
          <p className="text-sm text-foreground dark:text-white break-words">{exam.requestedBy}</p>
        </div>
      </div>

      {exam.observations && (
        <div className="bg-muted dark:bg-[#0d0d0d] rounded-lg p-3 mb-4">
          <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Observacoes</p>
          <p className="text-sm text-foreground dark:text-white break-words">{exam.observations}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2 flex-1">
          {exam.documents.map((doc, index) => (
            <button
              key={index}
              onClick={() => onPreviewDocument(doc)}
              className="px-3 py-2 bg-muted dark:bg-[#0d0d0d] rounded-lg text-xs text-foreground dark:text-white hover:bg-[#3a3a3a] transition-colors flex items-center gap-2"
            >
              {doc.type === 'pdf' ? <FileText className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
              <span className="break-all">{doc.name}</span>
            </button>
          ))}
        </div>
        <button
          onClick={onViewDetails}
          className="w-full sm:w-auto px-4 py-2 text-sm text-primary dark:text-white hover:opacity-80 transition-opacity whitespace-nowrap"
        >
          Ver detalhes
        </button>
      </div>
    </div>
  );
}

interface ExamDetailsModalProps {
  exam: ExamView;
  onClose: () => void;
  resultConfig: any;
  formatDate: (dateStr: string) => string;
  onPreviewDocument: (doc: ExamDocument) => void;
}

function ExamDetailsModal({ exam, onClose, resultConfig, formatDate, onPreviewDocument }: ExamDetailsModalProps) {
  const resultInfo = resultConfig[exam.resultKey];
  const ResultIcon = resultInfo.icon;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)] sticky top-0 bg-card dark:bg-[#1a1a1a] z-10">
          <div>
            <h3 className="text-xl text-foreground dark:text-white">{exam.subType}</h3>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-1">{formatDate(exam.date)}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className={`${resultInfo.color}/20 border ${resultInfo.color}/20 rounded-xl p-4`}>
            <div className="flex items-center gap-3">
              <ResultIcon className={`w-6 h-6 ${resultInfo.textColor}`} />
              <div>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Resultado do Exame</p>
                <p className={`text-lg font-medium ${resultInfo.textColor}`}>{resultInfo.label}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Laboratorio/Clinica</p>
              <p className="text-sm text-foreground dark:text-white">{exam.laboratory}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Solicitado por</p>
              <p className="text-sm text-foreground dark:text-white">{exam.requestedBy}</p>
            </div>
          </div>

          {exam.observations && (
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-2">Observacoes</p>
              <div className="bg-muted dark:bg-[#0d0d0d] rounded-lg p-4">
                <p className="text-sm text-foreground dark:text-white">{exam.observations}</p>
              </div>
            </div>
          )}

          {exam.documents.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-3">Documentos Anexados</p>
              <div className="grid grid-cols-1 gap-2">
                {exam.documents.map((doc, index) => (
                  <button
                    key={index}
                    onClick={() => onPreviewDocument(doc)}
                    className="p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg text-foreground dark:text-white hover:bg-[#3a3a3a] transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      {doc.type === 'pdf' ? <FileText className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                      <span className="text-sm">{doc.name}</span>
                    </div>
                    <Download className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface DocumentPreviewModalProps {
  document: ExamDocument;
  onClose: () => void;
}

function DocumentPreviewModal({ document, onClose }: DocumentPreviewModalProps) {
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4" onClick={onClose}>
      <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg">{document.name}</h3>
          <button onClick={onClose} className="text-white hover:opacity-80 transition-opacity">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="bg-white rounded-lg overflow-hidden">
          {document.type === 'pdf' ? (
            <iframe title={document.name} src={document.url} className="w-full h-[80vh]" />
          ) : (
            <img src={document.url} alt={document.name} className="w-full h-auto" />
          )}
        </div>
      </div>
    </div>
  );
}
