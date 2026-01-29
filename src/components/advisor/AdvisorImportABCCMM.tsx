import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, X, Download, ArrowLeft, Info } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ImportResult {
  newAnimals: number;
  updatedAnimals: number;
  errors: string[];
  warnings: string[];
}

interface AdvisorImportABCCMMProps {
  onBack: () => void;
  onImportComplete?: (result: ImportResult) => void;
}

export function AdvisorImportABCCMM({ onBack, onImportComplete }: AdvisorImportABCCMMProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showPreview, setShowPreview] = useState(false);

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
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    // Validar tipo de arquivo
    const validExtensions = ['.xls', '.xlsx', '.csv'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      toast.error('Formato de arquivo inválido. Use apenas .xls, .xlsx ou .csv');
      return;
    }

    setSelectedFile(file);
    setImportResult(null);
    toast.success('Arquivo selecionado com sucesso!');
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error('Selecione um arquivo para importar');
      return;
    }

    setIsProcessing(true);

    // Simulação de processamento (substituir por lógica real)
    setTimeout(() => {
      const result: ImportResult = {
        newAnimals: 10,
        updatedAnimals: 50,
        errors: [],
        warnings: [
          'Linha 23: Data de nascimento não informada para "Estrela da Tarde"',
          'Linha 45: Pelagem não reconhecida para "Vento Forte" - usando valor padrão',
        ]
      };

      setImportResult(result);
      setIsProcessing(false);
      toast.success('Importação concluída com sucesso!');
      
      if (onImportComplete) {
        onImportComplete(result);
      }
    }, 3000);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setImportResult(null);
    setShowPreview(false);
  };

  const downloadTemplate = () => {
    toast.success('Download do modelo iniciado');
    // Lógica para download do template
  };

  return (
    <div className="space-y-6">
      {/* Header com Breadcrumb */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
        <div className="flex items-center justify-between mb-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <span 
              className="text-muted-foreground dark:text-[#99a1af] cursor-pointer hover:text-foreground dark:hover:text-white" 
              onClick={onBack}
            >
              Dashboard
            </span>
            <span className="text-muted-foreground dark:text-[#99a1af]">/</span>
            <span className="text-foreground dark:text-white">Importar Planilha ABCCMM</span>
          </div>
          {/* Botão Voltar */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
        </div>
        <div>
          <h1 className="text-2xl text-foreground dark:text-white mb-2">Importar Planilha ABCCMM</h1>
          <p className="text-muted-foreground dark:text-[#99a1af]">
            Atualize o cadastro de animais em massa a partir das planilhas oficiais da ABCCMM
          </p>
        </div>
      </div>

      {/* Informações e Instruções */}
      <div className="bg-blue-500/10 dark:bg-gray-500/10 border border-blue-500/20 dark:border-gray-500/20 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-500/10 dark:bg-gray-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5 text-blue-600 dark:text-gray-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-foreground dark:text-white mb-2">Como importar dados da ABCCMM</h3>
            <ol className="space-y-2 text-sm text-muted-foreground dark:text-[#99a1af]">
              <li>1. Acesse o sistema da ABCCMM e exporte a planilha de animais (.xls ou .xlsx)</li>
              <li>2. Faça o upload do arquivo nesta página</li>
              <li>3. Revise o resumo da importação antes de confirmar</li>
              <li>4. Os dados importados serão bloqueados para edição manual (garantia de integridade)</li>
            </ol>
            <button
              onClick={downloadTemplate}
              className="mt-4 flex items-center gap-2 text-blue-600 dark:text-gray-300 hover:underline"
            >
              <Download className="w-4 h-4" />
              Baixar modelo de planilha de exemplo
            </button>
          </div>
        </div>
      </div>

      {/* Área de Upload */}
      {!importResult ? (
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <h3 className="text-lg text-foreground dark:text-white mb-6">Selecionar Arquivo</h3>
          
          {/* Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
            className={`
              border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all
              ${isDragging 
                ? 'border-primary dark:border-white bg-primary/5 dark:bg-white/5' 
                : 'border-border dark:border-[#616161] hover:border-primary dark:hover:border-white/50'
              }
            `}
          >
            {selectedFile ? (
              <>
                <div className="w-16 h-16 bg-green-500/10 dark:bg-green-500/20 rounded-2xl flex items-center justify-center mb-4">
                  <FileSpreadsheet className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-foreground dark:text-white mb-2">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-4">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReset();
                  }}
                  className="text-sm text-red-500 dark:text-red-400 hover:underline"
                >
                  Remover arquivo
                </button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-muted dark:bg-[#0d0d0d] rounded-2xl flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-muted-foreground dark:text-[#616161]" />
                </div>
                <p className="text-foreground dark:text-white mb-2">Arraste e solte o arquivo aqui</p>
                <p className="text-sm text-muted-foreground dark:text-[#6b6b6b] mb-4">
                  ou clique para selecionar
                </p>
                <p className="text-xs text-muted-foreground dark:text-[#6b6b6b]">
                  Formatos aceitos: .xls, .xlsx, .csv (máx. 10MB)
                </p>
              </>
            )}
            
            <input
              id="file-input"
              type="file"
              accept=".xls,.xlsx,.csv"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>

          {/* Botão de Importar */}
          {selectedFile && (
            <div className="mt-6 flex gap-4">
              <button
                onClick={handleReset}
                className="flex-1 px-6 py-3 bg-transparent border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white rounded-xl hover:bg-muted dark:hover:bg-[#2a2a2a] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleImport}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white dark:border-black border-t-transparent dark:border-t-transparent rounded-full animate-spin"></div>
                    Processando...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Importar Planilha
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Resultado da Importação */
        <div className="space-y-6">
          {/* Resumo Geral */}
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-green-500/10 dark:bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg text-foreground dark:text-white mb-2">Importação Concluída com Sucesso</h3>
                <p className="text-muted-foreground dark:text-[#99a1af]">
                  A planilha foi processada e os dados foram atualizados no sistema.
                </p>
              </div>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-500/10 dark:bg-green-500/5 rounded-xl p-4 border border-green-500/20">
                <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Novos Animais</p>
                <p className="text-2xl text-foreground dark:text-white">{importResult.newAnimals}</p>
              </div>
              <div className="bg-blue-500/10 dark:bg-gray-500/5 rounded-xl p-4 border border-blue-500/20 dark:border-gray-500/20">
                <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Animais Atualizados</p>
                <p className="text-2xl text-foreground dark:text-white">{importResult.updatedAnimals}</p>
              </div>
            </div>
          </div>

          {/* Avisos */}
          {importResult.warnings.length > 0 && (
            <div className="bg-yellow-500/10 dark:bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-yellow-500/10 dark:bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-foreground dark:text-white mb-3">Avisos ({importResult.warnings.length})</h3>
                  <ul className="space-y-2">
                    {importResult.warnings.map((warning, index) => (
                      <li key={index} className="text-sm text-muted-foreground dark:text-[#99a1af]">
                        • {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Erros */}
          {importResult.errors.length > 0 && (
            <div className="bg-red-500/10 dark:bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-500/10 dark:bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <X className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-foreground dark:text-white mb-3">Erros ({importResult.errors.length})</h3>
                  <ul className="space-y-2">
                    {importResult.errors.map((error, index) => (
                      <li key={index} className="text-sm text-muted-foreground dark:text-[#99a1af]">
                        • {error}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Informação de Bloqueio */}
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 dark:bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5 text-primary dark:text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-foreground dark:text-white mb-2">Integridade de Dados Garantida</h3>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                  Os campos importados da ABCCMM (Registro, Nome Oficial, Data de Nascimento, Genealogia) foram bloqueados para edição manual. Apenas usuários com permissão de Administrador podem alterá-los caso necessário.
                </p>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleReset}
              className="flex-1 px-6 py-3 bg-transparent border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white rounded-xl hover:bg-muted dark:hover:bg-[#2a2a2a] transition-colors"
            >
              Importar Outro Arquivo
            </button>
            <button
              onClick={onBack}
              className="flex-1 px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
