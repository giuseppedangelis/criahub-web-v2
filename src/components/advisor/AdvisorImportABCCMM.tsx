import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, X, Download, ArrowLeft, Info } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { animalsService } from '@/services/animals';
import { useCurrentHaras } from '@/hooks/useHaras';
import { useUser } from '@/contexts/UserContext';
import { useSearchParams } from 'next/navigation';
import type { ABCCMMImportResult } from '@/types';

type ImportResult = ABCCMMImportResult;

interface AdvisorImportABCCMMProps {
  onBack: () => void;
  onImportComplete?: (result: ImportResult) => void;
}

export function AdvisorImportABCCMM({ onBack, onImportComplete }: AdvisorImportABCCMMProps) {
  const { data: currentHaras, isLoading: isLoadingHaras, isError: isErrorHaras } = useCurrentHaras();
  const { stableHarasId, profile, isSessionReady } = useUser();
  const searchParams = useSearchParams();
  const harasIdFromUrl = useMemo(
    () => searchParams.get('harasId') || searchParams.get('haras_id') || '',
    [searchParams]
  );
  
  const harasId = useMemo(
    () => currentHaras?.id || stableHarasId || profile?.haras_id || harasIdFromUrl || '',
    [currentHaras?.id, stableHarasId, profile?.haras_id, harasIdFromUrl]
  );
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [confirmedHarasId, setConfirmedHarasId] = useState('');

  useEffect(() => {
    if (!confirmedHarasId && harasId) {
      setConfirmedHarasId(harasId);
      console.log('[AdvisorImportABCCMM] ID do Haras Salvo:', harasId);
    }
  }, [harasId, confirmedHarasId]);

  const effectiveHarasId = confirmedHarasId || harasId;

  // ===== FUNÇÕES DE UPLOAD =====
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) handleFileSelect(files[0]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) handleFileSelect(e.target.files[0]);
  };

  const handleFileSelect = (file: File) => {
    const validExtensions = ['.xls', '.xlsx', '.csv'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      toast.error('Formato de arquivo inválido. Use apenas .xls, .xlsx ou .csv');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Arquivo excede o limite de 10MB');
      return;
    }

    setSelectedFile(file);
    setImportResult(null);
    toast.success('Arquivo selecionado com sucesso!');
  };

  // ===== FUNÇÃO PRINCIPAL DE IMPORTAÇÃO =====
  const handleImport = async () => {
    // 1. TESTE DE FOGO: O alerta trava a tela. Se aparecer, o botão funciona!
    alert('BOTÃO CLICADO! A função handleImport foi disparada com sucesso.');

    // 2. FALLBACK FORÇADO: Se não achar o ID, inventa um pra não barrar o teste de clique.
    const finalHarasId = effectiveHarasId || 'TESTE_ID_FORCADO';

    console.log('[AdvisorImportABCCMM] Iniciando importação com ID:', finalHarasId);

    if (!selectedFile) {
      toast.error('Selecione um arquivo para importar');
      return;
    }

    setIsProcessing(true);

    try {
      console.log('[AdvisorImportABCCMM] Chamando animalsService...');
      
      const result = await animalsService.importABCCMMData({
        file: selectedFile,
        harasId: finalHarasId,
      });
      
      console.log('[AdvisorImportABCCMM] Resultado:', result);
      setImportResult(result);
      toast.success(`Importação concluída: ${result.newAnimals} novos, ${result.updatedAnimals} atualizados`);

      if (result.warnings?.length > 0) {
        toast.warning(`Importação com ${result.warnings.length} aviso(s)`);
      }

      if (onImportComplete) onImportComplete(result);
    } catch (error) {
      console.error('[AdvisorImportABCCMM] Erro capturado:', error);
      const message = error instanceof Error ? error.message : 'Erro ao importar planilha';
      toast.error(`Erro: ${message}`);
      setImportResult(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setImportResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Header com Breadcrumb */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground cursor-pointer hover:text-foreground" onClick={onBack}>Dashboard</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">Importar Planilha ABCCMM</span>
          </div>
          <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" /> Voltar
          </button>
        </div>
        <div>
          <h1 className="text-2xl text-foreground dark:text-white mb-2">Importar Planilha ABCCMM</h1>
          <p className="text-muted-foreground">Atualize o cadastro de animais em massa</p>
        </div>
      </div>

      {/* Área de Upload */}
      {!importResult ? (
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <h3 className="text-lg text-foreground dark:text-white mb-6">Selecionar Arquivo</h3>
          
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
            className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary'}`}
          >
            {selectedFile ? (
              <>
                <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mb-4">
                  <FileSpreadsheet className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-foreground mb-2">{selectedFile.name}</p>
                <button onClick={(e) => { e.stopPropagation(); handleReset(); }} className="text-sm text-red-500 hover:underline">
                  Remover arquivo
                </button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-foreground mb-2">Arraste e solte o arquivo aqui</p>
                <p className="text-xs text-muted-foreground">Formatos aceitos: .xls, .xlsx, .csv (máx. 10MB)</p>
              </>
            )}
            <input id="file-input" type="file" accept=".xls,.xlsx,.csv" onChange={handleFileInput} className="hidden" />
          </div>

          {selectedFile && (
            <div className="mt-6 flex gap-4">
              <button
                onClick={handleReset}
                className="flex-1 px-6 py-3..."
                style={{ backgroundColor: 'hotpink', fontSize: '30px', fontWeight: 'bold' }}
              >
                BATATA FRITA
              </button>
              
              <button
                onClick={(e) => {
                  e.preventDefault(); 
                  e.stopPropagation(); // Evita que o clique seja roubado pelo dropzone
                  handleImport();
                }}
                // NOTA: Removido o disabled para garantir que seja clicável sempre!
                className={`flex-1 px-6 py-3 rounded-xl transition-opacity flex items-center justify-center gap-2 ${isProcessing ? 'bg-gray-500 text-white cursor-not-allowed' : 'bg-primary dark:bg-white text-white dark:text-black hover:opacity-90 cursor-pointer'}`}
              >
                {isProcessing ? 'Processando...' : !effectiveHarasId ? 'Importar (Forçando ID Teste)' : 'Importar Planilha'}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Tela de Sucesso (mantida minimalista para o teste) */
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-4">Sucesso!</h3>
            <button onClick={handleReset} className="px-6 py-3 bg-primary text-white rounded-xl">Nova Importação</button>
        </div>
      )}
    </div>
  );
}