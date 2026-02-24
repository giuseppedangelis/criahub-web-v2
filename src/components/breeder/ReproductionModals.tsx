import { X, Calendar, User, FileText, Download } from 'lucide-react';
import { toast } from 'sonner';

interface Cobertura {
  id: string;
  pai: string;
  mae: string;
  tipo: string;
  data: string;
  veterinario: string;
  status: 'positivo' | 'aguardando' | 'negativo';
  semenType?: string | null;
  confirmationDate?: string | null;
  expectedBirthDate?: string | null;
  observacoes?: string | null;
}

interface Ovulo {
  id: string;
  doadora: string;
  quantidade: number;
  data: string;
  status: string;
  disponiveis: number;
  qualidade: 'excelente' | 'boa' | 'regular';
  veterinario?: string | null;
  metodo?: string | null;
  observacoes?: string | null;
}

interface Embriao {
  id: string;
  doadora: string;
  garanhao: string;
  quantidade: number;
  data: string;
  status: string;
  disponiveis: number;
  grau: 'A' | 'B' | 'C';
  tipo: 'Fresco' | 'Congelado';
  veterinario?: string | null;
  metodo?: string | null;
  observacoes?: string | null;
}

interface Documento {
  id: string;
  nome: string;
  tipo: string;
  data: string;
  tamanho: string;
  url?: string | null;
  fileType?: string | null;
  fileName?: string | null;
}

export function CoberturaDetailsModal({ cobertura, onClose }: { cobertura: Cobertura; onClose: () => void }) {
  const statusConfig = {
    positivo: { label: 'Positivo', color: 'bg-emerald-500' },
    aguardando: { label: 'Aguardando', color: 'bg-amber-500' },
    negativo: { label: 'Negativo', color: 'bg-[#e74c3c]' },
  };

  const config = statusConfig[cobertura.status];
  const formatDate = (value?: string | null) => {
    if (!value) return '-';
    const [year, month, day] = value.split('T')[0].split('-');
    if (!year || !month || !day) return value;
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-border dark:border-[rgba(255,255,255,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl text-foreground dark:text-white">Detalhes da Cobertura</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Status Badge */}
        <div className="mb-6">
          <span className={`${config.color} px-4 py-2 rounded-lg text-white text-sm inline-block`}>
            {config.label}
          </span>
        </div>

        {/* Informações Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Garanhão (Pai)</p>
              <p className="text-lg text-foreground dark:text-white">{cobertura.pai}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Égua (Mãe)</p>
              <p className="text-lg text-foreground dark:text-white">{cobertura.mae}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Tipo de Cobertura</p>
              <p className="text-lg text-foreground dark:text-white">{cobertura.tipo}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Data da Cobertura</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
                <p className="text-lg text-foreground dark:text-white">{cobertura.data}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Veterinário Responsável</p>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
                <p className="text-lg text-foreground dark:text-white">{cobertura.veterinario}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Data de Confirmação</p>
              <p className="text-lg text-foreground dark:text-white">{formatDate(cobertura.confirmationDate)}</p>
            </div>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="bg-muted dark:bg-[#0d0d0d] rounded-xl p-6 mb-6">
          <h3 className="text-lg text-foreground dark:text-white mb-4">Informações Adicionais</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Tipo de Sêmen</p>
              <p className="text-foreground dark:text-white">{cobertura.semenType || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Previsão de Parto</p>
              <p className="text-foreground dark:text-white">{formatDate(cobertura.expectedBirthDate)}</p>
            </div>
          </div>
        </div>

        {/* Observações */}
        <div className="bg-muted dark:bg-[#0d0d0d] rounded-xl p-6 mb-6">
          <h3 className="text-lg text-foreground dark:text-white mb-4">Observações</h3>
          <p className="text-muted-foreground dark:text-[#99a1af]">
            {cobertura.observacoes || 'Sem observações registradas.'}
          </p>
        </div>

        {/* Ações */}
        <div className="flex flex-col lg:flex-row gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-transparent border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export function OvuloDetailsModal({ ovulo, onClose }: { ovulo: Ovulo; onClose: () => void }) {
  const qualidadeConfig = {
    excelente: { label: 'Excelente', color: 'bg-emerald-500' },
    boa: { label: 'Boa', color: 'bg-[#2472bc]' },
    regular: { label: 'Regular', color: 'bg-amber-500' },
  };

  const config = qualidadeConfig[ovulo.qualidade];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-border dark:border-[rgba(255,255,255,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl text-foreground dark:text-white">Detalhes dos Óvulos</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Status Badge */}
        <div className="mb-6">
          <span className={`${config.color} px-4 py-2 rounded-lg text-white text-sm inline-block`}>
            Qualidade: {config.label}
          </span>
        </div>

        {/* Informações Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Égua Doadora</p>
              <p className="text-lg text-foreground dark:text-white">{ovulo.doadora}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Quantidade Coletada</p>
              <p className="text-lg text-foreground dark:text-white">{ovulo.quantidade} óvulos</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Óvulos Disponíveis</p>
              <p className="text-lg text-foreground dark:text-white">{ovulo.disponiveis} óvulos</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Data da Coleta</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
                <p className="text-lg text-foreground dark:text-white">{ovulo.data}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Status</p>
              <p className="text-lg text-foreground dark:text-white">{ovulo.status}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Taxa de Utilização</p>
              <p className="text-lg text-foreground dark:text-white">
                {Math.round((1 - ovulo.disponiveis / ovulo.quantidade) * 100)}%
              </p>
            </div>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="bg-muted dark:bg-[#0d0d0d] rounded-xl p-6 mb-6">
          <h3 className="text-lg text-foreground dark:text-white mb-4">Informações da Coleta</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Veterinário</p>
              <p className="text-foreground dark:text-white">{ovulo.veterinario || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Método</p>
              <p className="text-foreground dark:text-white">{ovulo.metodo || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Observações</p>
              <p className="text-foreground dark:text-white">{ovulo.observacoes || '-'}</p>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex flex-col lg:flex-row gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-transparent border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export function EmbriaoDetailsModal({ embriao, onClose }: { embriao: Embriao; onClose: () => void }) {
  const qualidadeConfig = {
    excelente: { label: 'Grau A', color: 'bg-emerald-500' },
    boa: { label: 'Grau B', color: 'bg-[#2472bc]' },
    regular: { label: 'Grau C', color: 'bg-amber-500' },
  };

  const config =
    embriao.grau === 'A'
      ? qualidadeConfig.excelente
      : embriao.grau === 'B'
        ? qualidadeConfig.boa
        : qualidadeConfig.regular;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-border dark:border-[rgba(255,255,255,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl text-foreground dark:text-white">Detalhes dos Embriões</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Status Badge */}
        <div className="mb-6">
          <span className={`${config.color} px-4 py-2 rounded-lg text-white text-sm inline-block`}>
            {config.label}
          </span>
        </div>

        {/* Informações Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Égua Doadora</p>
              <p className="text-lg text-foreground dark:text-white">{embriao.doadora}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Garanhão</p>
              <p className="text-lg text-foreground dark:text-white">{embriao.garanhao}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Quantidade Produzida</p>
              <p className="text-lg text-foreground dark:text-white">{embriao.quantidade} embriões</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Embriões Disponíveis</p>
              <p className="text-lg text-foreground dark:text-white">{embriao.disponiveis} embriões</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Data da Produção</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
                <p className="text-lg text-foreground dark:text-white">{embriao.data}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Status</p>
              <p className="text-lg text-foreground dark:text-white">{embriao.status}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Método</p>
              <p className="text-lg text-foreground dark:text-white">{embriao.metodo || embriao.tipo}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Taxa de Utilização</p>
              <p className="text-lg text-foreground dark:text-white">
                {Math.round((1 - embriao.disponiveis / embriao.quantidade) * 100)}%
              </p>
            </div>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="bg-muted dark:bg-[#0d0d0d] rounded-xl p-6 mb-6">
          <h3 className="text-lg text-foreground dark:text-white mb-4">Informações Técnicas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Veterinário</p>
              <p className="text-foreground dark:text-white">{embriao.veterinario || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Observações</p>
              <p className="text-foreground dark:text-white">{embriao.observacoes || '-'}</p>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex flex-col lg:flex-row gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-transparent border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export function DocumentoViewModal({ documento, onClose }: { documento: Documento; onClose: () => void }) {
  const fileUrl = documento.url || '';
  const fileName = documento.fileName || documento.nome;
  const fileExtension = fileName.split('.').pop()?.toLowerCase() || fileUrl.split('?')[0].split('.').pop()?.toLowerCase();
  const isPdf = documento.fileType === 'application/pdf' || fileExtension === 'pdf';
  const isImage = documento.fileType?.startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(fileExtension || '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-border dark:border-[rgba(255,255,255,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl text-foreground dark:text-white">{documento.nome}</h2>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-1">
              {documento.tipo} • {documento.tamanho} • {documento.data}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Preview Area */}
        <div className="bg-muted dark:bg-[#0d0d0d] rounded-xl p-6 mb-6 min-h-[400px] flex items-center justify-center">
          {fileUrl ? (
            isImage ? (
              <img
                src={fileUrl}
                alt={documento.nome}
                className="max-h-[70vh] w-auto rounded-lg"
              />
            ) : isPdf ? (
              <iframe
                title={`Documento ${documento.nome}`}
                src={fileUrl}
                className="w-full h-[70vh] rounded-lg border border-border dark:border-[rgba(255,255,255,0.1)]"
              />
            ) : (
              <div className="text-center">
                <FileText className="w-20 h-20 mx-auto mb-4 text-muted-foreground dark:text-[#99a1af]" />
                <p className="text-lg text-foreground dark:text-white mb-2">Pré-visualização indisponível</p>
                <p className="text-muted-foreground dark:text-[#99a1af]">
                  Baixe o arquivo para visualizar.
                </p>
              </div>
            )
          ) : (
            <div className="text-center">
              <FileText className="w-20 h-20 mx-auto mb-4 text-muted-foreground dark:text-[#99a1af]" />
              <p className="text-lg text-foreground dark:text-white mb-2">Documento indisponível</p>
              <p className="text-muted-foreground dark:text-[#99a1af]">
                Nenhum link de arquivo foi encontrado.
              </p>
            </div>
          )}
        </div>

        {/* Ações */}
        <div className="flex flex-col lg:flex-row gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-transparent border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
          >
            Fechar
          </button>
          <button
            onClick={() => {
              if (!fileUrl) {
                toast.error('Arquivo indisponível para download.');
                return;
              }
              if (typeof window !== 'undefined') {
                window.open(fileUrl, '_blank', 'noopener,noreferrer');
              }
            }}
            className="flex-1 px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={!fileUrl}
          >
            <Download className="w-5 h-5" />
            Baixar Documento
          </button>
        </div>
      </div>
    </div>
  );
}
