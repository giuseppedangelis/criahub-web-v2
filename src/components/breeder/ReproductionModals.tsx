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
}

interface Ovulo {
  id: string;
  doadora: string;
  quantidade: number;
  data: string;
  status: string;
  disponiveis: number;
  qualidade: 'excelente' | 'boa' | 'regular';
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
}

interface Documento {
  id: string;
  nome: string;
  tipo: string;
  data: string;
  tamanho: string;
}

export function CoberturaDetailsModal({ cobertura, onClose }: { cobertura: Cobertura; onClose: () => void }) {
  const statusConfig = {
    positivo: { label: 'Positivo', color: 'bg-emerald-500' },
    aguardando: { label: 'Aguardando', color: 'bg-amber-500' },
    negativo: { label: 'Negativo', color: 'bg-[#e74c3c]' },
  };

  const config = statusConfig[cobertura.status];

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
              <p className="text-lg text-foreground dark:text-white">20/11/2024</p>
            </div>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="bg-muted dark:bg-[#0d0d0d] rounded-xl p-6 mb-6">
          <h3 className="text-lg text-foreground dark:text-white mb-4">Informações Adicionais</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Método</p>
              <p className="text-foreground dark:text-white">{cobertura.tipo}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Tentativa</p>
              <p className="text-foreground dark:text-white">1ª tentativa</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Contrato</p>
              <p className="text-foreground dark:text-white">COB-2024-001</p>
            </div>
          </div>
        </div>

        {/* Observações */}
        <div className="bg-muted dark:bg-[#0d0d0d] rounded-xl p-6 mb-6">
          <h3 className="text-lg text-foreground dark:text-white mb-4">Observações</h3>
          <p className="text-muted-foreground dark:text-[#99a1af]">
            Cobertura realizada com sucesso. Animal apresentou comportamento adequado durante o procedimento. 
            Recomenda-se acompanhamento veterinário em 15 dias para confirmação da gestação.
          </p>
        </div>

        {/* Documentos Relacionados */}
        <div className="mb-6">
          <h3 className="text-lg text-foreground dark:text-white mb-4">Documentos Relacionados</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
                <div>
                  <p className="text-foreground dark:text-white">Contrato de Cobertura</p>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af]">PDF • 2.4 MB</p>
                </div>
              </div>
              <button className="p-2 hover:bg-accent dark:hover:bg-[#2a2a2a] rounded-lg transition-colors">
                <Download className="w-5 h-5 text-foreground dark:text-white" />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
                <div>
                  <p className="text-foreground dark:text-white">Laudo Veterinário</p>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af]">PDF • 1.8 MB</p>
                </div>
              </div>
              <button className="p-2 hover:bg-accent dark:hover:bg-[#2a2a2a] rounded-lg transition-colors">
                <Download className="w-5 h-5 text-foreground dark:text-white" />
              </button>
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
          <button
            onClick={() => {
              toast.success('Relatório exportado com sucesso!');
            }}
            className="flex-1 px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity"
          >
            Exportar Relatório
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
              <p className="text-foreground dark:text-white">Dr. Maria Santos</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Local de Armazenamento</p>
              <p className="text-foreground dark:text-white">Tanque 01 - Setor A</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Temperatura</p>
              <p className="text-foreground dark:text-white">-196°C (N₂ Líquido)</p>
            </div>
          </div>
        </div>

        {/* Histórico de Uso */}
        <div className="mb-6">
          <h3 className="text-lg text-foreground dark:text-white mb-4">Histórico de Uso</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
              <div>
                <p className="text-foreground dark:text-white">Utilizado para FIV</p>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">2 óvulos • 25/11/2024</p>
              </div>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs">
                Sucesso
              </span>
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
          <button
            onClick={() => {
              toast.success('Relatório exportado com sucesso!');
            }}
            className="flex-1 px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity"
          >
            Exportar Relatório
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
              <p className="text-lg text-foreground dark:text-white">{embriao.tipo}</p>
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
              <p className="text-foreground dark:text-white">Dr. Carlos Lima</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Local de Armazenamento</p>
              <p className="text-foreground dark:text-white">Tanque 02 - Setor B</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Dias de Desenvolvimento</p>
              <p className="text-foreground dark:text-white">7 dias</p>
            </div>
          </div>
        </div>

        {/* Histórico de Transferências */}
        <div className="mb-6">
          <h3 className="text-lg text-foreground dark:text-white mb-4">Histórico de Transferências</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
              <div>
                <p className="text-foreground dark:text-white">Transferência para égua receptora</p>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Lua Dourada • 22/11/2024</p>
              </div>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs">
                Confirmado
              </span>
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
          <button
            onClick={() => {
              toast.success('Relatório exportado com sucesso!');
            }}
            className="flex-1 px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity"
          >
            Exportar Relatório
          </button>
        </div>
      </div>
    </div>
  );
}

export function GestacaoDetailsModal({ gestacao, onClose }: { gestacao: Cobertura; onClose: () => void }) {
  const statusConfig = {
    positivo: { label: 'Confirmada', color: 'bg-emerald-500' },
    aguardando: { label: 'Em Acompanhamento', color: 'bg-amber-500' },
    negativo: { label: 'Não Confirmada', color: 'bg-[#e74c3c]' },
  };

  const config = statusConfig[gestacao.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-border dark:border-[rgba(255,255,255,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl text-foreground dark:text-white">Detalhes da Gestação</h2>
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
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Égua</p>
              <p className="text-lg text-foreground dark:text-white">{gestacao.mae}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Garanhão</p>
              <p className="text-lg text-foreground dark:text-white">{gestacao.pai}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Data da Cobertura</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
                <p className="text-lg text-foreground dark:text-white">{gestacao.data}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Previsão de Parto</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
                <p className="text-lg text-foreground dark:text-white">15/10/2025</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Dias de Gestação</p>
              <p className="text-lg text-foreground dark:text-white">45 dias</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Dias Restantes</p>
              <p className="text-lg text-foreground dark:text-white">295 dias</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Veterinário Responsável</p>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
                <p className="text-lg text-foreground dark:text-white">{gestacao.veterinario}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Último Exame</p>
              <p className="text-lg text-foreground dark:text-white">20/11/2024</p>
            </div>
          </div>
        </div>

        {/* Timeline de Acompanhamento */}
        <div className="bg-muted dark:bg-[#0d0d0d] rounded-xl p-6 mb-6">
          <h3 className="text-lg text-foreground dark:text-white mb-4">Timeline de Acompanhamento</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500"></div>
              <div className="flex-1">
                <p className="text-foreground dark:text-white">Gestação Confirmada</p>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">20/11/2024 • Ultrassom realizado</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 mt-2 rounded-full bg-amber-500"></div>
              <div className="flex-1">
                <p className="text-foreground dark:text-white">Próximo Exame Agendado</p>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">05/12/2024 • Ultrassom de acompanhamento</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 mt-2 rounded-full bg-gray-500"></div>
              <div className="flex-1">
                <p className="text-foreground dark:text-white">Parto Previsto</p>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">15/10/2025 • Aproximadamente 295 dias</p>
              </div>
            </div>
          </div>
        </div>

        {/* Observações */}
        <div className="bg-muted dark:bg-[#0d0d0d] rounded-xl p-6 mb-6">
          <h3 className="text-lg text-foreground dark:text-white mb-4">Observações Veterinárias</h3>
          <p className="text-muted-foreground dark:text-[#99a1af]">
            Égua apresenta excelente condição corporal. Gestação confirmada por ultrassom com embrião viável. 
            Recomenda-se manter acompanhamento mensal e cuidados especiais nos últimos 90 dias.
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
          <button
            onClick={() => {
              toast.success('Relatório exportado com sucesso!');
            }}
            className="flex-1 px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity"
          >
            Exportar Relatório
          </button>
        </div>
      </div>
    </div>
  );
}

export function DocumentoViewModal({ documento, onClose }: { documento: Documento; onClose: () => void }) {
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
        <div className="bg-muted dark:bg-[#0d0d0d] rounded-xl p-12 mb-6 min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <FileText className="w-20 h-20 mx-auto mb-4 text-muted-foreground dark:text-[#99a1af]" />
            <p className="text-lg text-foreground dark:text-white mb-2">Visualização do Documento</p>
            <p className="text-muted-foreground dark:text-[#99a1af]">
              O documento será exibido aqui
            </p>
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
          <button
            onClick={() => {
              toast.success('Download iniciado!');
            }}
            className="flex-1 px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Baixar Documento
          </button>
        </div>
      </div>
    </div>
  );
}
