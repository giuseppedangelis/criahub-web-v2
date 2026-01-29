import { Search, Filter, Calendar, Eye, Plus, Upload, ChevronDown, X } from 'lucide-react';
import { useState } from 'react';
import { NativeSelect } from '../ui/native-select';
import { Heart, TrendingUp, Calendar as CalendarIcon } from 'lucide-react';
import { CoberturaDetailsModal, OvuloDetailsModal, EmbriaoDetailsModal, GestacaoDetailsModal, DocumentoViewModal } from './ReproductionModals';
import { ReproductionAutomationTab } from './ReproductionAutomationTab';
import { CustomProtocolsTab } from './CustomProtocolsTab';
import { GestationsTab } from './GestationsTab';
import { RegisterCoberturaModal, CoberturaData } from './RegisterCoberturaModal';
import { RegisterOvulosModal, OvulosData } from './RegisterOvulosModal';
import { RegisterEmbriaoModal, EmbriaoData } from './RegisterEmbriaoModal';

type ReproductionTab = 'automacao' | 'protocolos' | 'coberturas' | 'ovulos' | 'embrioes' | 'gestacoes' | 'documentos';

interface Cobertura {
  id: number;
  pai: string;
  mae: string;
  tipo: string;
  data: string;
  veterinario: string;
  status: 'positivo' | 'aguardando' | 'negativo';
}

interface Ovulo {
  id: number;
  doadora: string;
  quantidade: number;
  data: string;
  status: string;
  disponiveis: number;
  qualidade: 'excelente' | 'boa' | 'regular';
}

interface Embriao {
  id: number;
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
  id: number;
  nome: string;
  tipo: string;
  data: string;
  tamanho: string;
}

interface BreederReproductionContentProps {
  onNavigateToAgenda?: () => void;
}

export function BreederReproductionContent({ onNavigateToAgenda }: BreederReproductionContentProps = {}) {
  const [activeTab, setActiveTab] = useState<ReproductionTab>('automacao');
  const [selectedAnimal, setSelectedAnimal] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCoberturaDetails, setShowCoberturaDetails] = useState(false);
  const [showOvuloDetails, setShowOvuloDetails] = useState(false);
  const [showEmbriaoDetails, setShowEmbriaoDetails] = useState(false);
  const [showGestacaoDetails, setShowGestacaoDetails] = useState(false);
  const [showDocumentoModal, setShowDocumentoModal] = useState(false);
  const [selectedCobertura, setSelectedCobertura] = useState<Cobertura | null>(null);
  const [selectedOvulo, setSelectedOvulo] = useState<Ovulo | null>(null);
  const [selectedEmbriao, setSelectedEmbriao] = useState<Embriao | null>(null);
  const [selectedGestacao, setSelectedGestacao] = useState<Cobertura | null>(null);
  const [selectedDocumento, setSelectedDocumento] = useState<Documento | null>(null);
  const [showDeadlineModal, setShowDeadlineModal] = useState(false);
  const [selectedDeadline, setSelectedDeadline] = useState<any>(null);
  
  // Novos estados para os modais de registro
  const [showRegisterCoberturaModal, setShowRegisterCoberturaModal] = useState(false);
  const [showRegisterOvulosModal, setShowRegisterOvulosModal] = useState(false);
  const [showRegisterEmbriaoModal, setShowRegisterEmbriaoModal] = useState(false);

  const tabs = [
    { id: 'automacao' as ReproductionTab, label: 'Sequência Automática' },
    { id: 'protocolos' as ReproductionTab, label: 'Protocolos Personalizados' },
    { id: 'coberturas' as ReproductionTab, label: 'Coberturas' },
    { id: 'ovulos' as ReproductionTab, label: 'Óvulos' },
    { id: 'embrioes' as ReproductionTab, label: 'Embriões' },
    { id: 'gestacoes' as ReproductionTab, label: 'Gestações' },
    { id: 'documentos' as ReproductionTab, label: 'Documentos' },
  ];

  const coberturas: Cobertura[] = [
    {
      id: 1,
      pai: 'Trovão',
      mae: 'Estrela',
      tipo: 'Monta Natural',
      data: '15/11/2024',
      veterinario: 'Dr. João Silva',
      status: 'positivo',
    },
    {
      id: 2,
      pai: 'Trovão',
      mae: 'Estrela',
      tipo: 'Inseminação Artificial',
      data: '10/11/2024',
      veterinario: 'Dr. Maria Santos',
      status: 'aguardando',
    },
    {
      id: 3,
      pai: 'Trovão',
      mae: 'Estrela',
      tipo: 'Monta Natural',
      data: '05/11/2024',
      veterinario: 'Dr. Carlos Lima',
      status: 'negativo',
    },
  ];

  const ovulos: Ovulo[] = [
    {
      id: 1,
      doadora: 'Estrela',
      quantidade: 12,
      data: '20/11/2024',
      status: 'Congelado',
      disponiveis: 12,
      qualidade: 'excelente',
    },
    {
      id: 2,
      doadora: 'Íris',
      quantidade: 8,
      data: '15/11/2024',
      status: 'Congelado',
      disponiveis: 6,
      qualidade: 'boa',
    },
    {
      id: 3,
      doadora: 'Lua',
      quantidade: 5,
      data: '10/11/2024',
      status: 'Congelado',
      disponiveis: 3,
      qualidade: 'regular',
    },
  ];

  const embrioes: Embriao[] = [
    {
      id: 1,
      doadora: 'Estrela',
      garanhao: 'Trovão',
      quantidade: 10,
      data: '25/11/2024',
      status: 'Fresco',
      disponiveis: 10,
      grau: 'A',
      tipo: 'Fresco',
    },
    {
      id: 2,
      doadora: 'Íris',
      garanhao: 'Trovão',
      quantidade: 6,
      data: '20/11/2024',
      status: 'Congelado',
      disponiveis: 4,
      grau: 'B',
      tipo: 'Congelado',
    },
    {
      id: 3,
      doadora: 'Lua',
      garanhao: 'Trovão',
      quantidade: 3,
      data: '15/11/2024',
      status: 'Congelado',
      disponiveis: 2,
      grau: 'C',
      tipo: 'Congelado',
    },
  ];

  const documentos: Documento[] = [
    { id: 1, nome: 'Contrato de Cobertura - Trovão x Estrela', tipo: 'PDF', data: '15/11/2024', tamanho: '2.4 MB' },
    { id: 2, nome: 'Laudo Veterinário - Gestação Confirmada', tipo: 'PDF', data: '10/11/2024', tamanho: '1.8 MB' },
    { id: 3, nome: 'Relatório de Coleta de Óvulos', tipo: 'PDF', data: '05/11/2024', tamanho: '3.2 MB' },
  ];

  return (
    <div className="space-y-6">
      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard title="Coberturas Ativas" value="8" icon={Heart} iconColor="text-pink-500" />
        <MetricCard title="Gestações em Andamento" value="5" icon={TrendingUp} iconColor="text-green-500" />
        <MetricCard title="Nascimentos este ano" value="3" icon={Heart} iconColor="text-purple-500" />
        <MetricCard title="Próximos partos" value="2" icon={CalendarIcon} iconColor="text-purple-500" />
      </div>

      {/* Próximos Prazos e Atividades Recentes lado a lado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Próximos Prazos */}
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <h3 className="text-xl text-foreground dark:text-white mb-6">Próximos Prazos</h3>
          <div className="space-y-4">
            <DeadlineItem 
              name="Bella Vista" 
              type="Parto Previsto" 
              days={45} 
              onClick={() => {
                setSelectedDeadline({ name: 'Bella Vista', type: 'Parto Previsto', days: 45, details: 'Parto previsto para 02/02/2025. Égua em ótimo estado de saúde.' });
                setShowDeadlineModal(true);
              }}
            />
            <DeadlineItem 
              name="Sol Nascente" 
              type="Exame Gestacional" 
              days={15} 
              onClick={() => {
                setSelectedDeadline({ name: 'Sol Nascente', type: 'Exame Gestacional', days: 15, details: 'Exame gestacional de acompanhamento agendado para 03/01/2025.' });
                setShowDeadlineModal(true);
              }}
            />
            <DeadlineItem 
              name="Lua Dourada" 
              type="Cobertura" 
              days={-5} 
              onClick={() => {
                setSelectedDeadline({ name: 'Lua Dourada', type: 'Cobertura', days: -5, details: 'Cobertura estava agendada para 14/12/2024. ATRASADO!' });
                setShowDeadlineModal(true);
              }}
            />
            <DeadlineItem 
              name="Estrela" 
              type="Avaliação Reprodutiva" 
              days={7} 
              onClick={() => {
                setSelectedDeadline({ name: 'Estrela', type: 'Avaliação Reprodutiva', days: 7, details: 'Avaliação reprodutiva agendada para 26/12/2024.' });
                setShowDeadlineModal(true);
              }}
            />
          </div>
        </div>

        {/* Atividades Recentes */}
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <h3 className="text-xl text-foreground dark:text-white mb-6">Atividades Recentes</h3>
          <div className="space-y-4">
            <ActivityItem title="Cobertura realizada" animal="Trovão x Estrela" time="2 horas atrás" type="covering" />
            <ActivityItem title="Gestação confirmada" animal="Bella Vista" time="1 dia atrás" type="birth" />
            <ActivityItem title="Coleta de óvulos" animal="Íris - 8 óvulos" time="2 dias atrás" type="report" />
            <ActivityItem title="Exame realizado" animal="Sol Nascente" time="3 dias atrás" type="update" />
          </div>
        </div>
      </div>

      {/* Tabs - Desktop */}
      <div className="hidden md:flex bg-card dark:bg-[#1a1a1a] rounded-xl p-1 border border-border dark:border-[rgba(255,255,255,0.1)] gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-12 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-primary dark:bg-white text-white dark:text-[#1a1a1a]'
                : 'text-foreground dark:text-white hover:bg-muted dark:hover:bg-[#0d0d0d]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Tabs - Mobile (Dropdown) */}
      <div className="md:hidden">
        <NativeSelect
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value as ReproductionTab)}
          className="w-full"
        >
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.label}
            </option>
          ))}
        </NativeSelect>
      </div>

      {/* Filtros */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <NativeSelect
              value={selectedAnimal}
              onChange={(e) => setSelectedAnimal(e.target.value)}
            >
              <option value="">Animal</option>
              <option value="trovao">Trovão</option>
              <option value="estrela">Estrela</option>
              <option value="iris">Íris</option>
              <option value="lua">Lua</option>
            </NativeSelect>
          </div>

          <div className="flex-1">
            <NativeSelect
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">Status</option>
              <option value="positivo">Positivo</option>
              <option value="aguardando">Aguardando</option>
              <option value="negativo">Negativo</option>
            </NativeSelect>
          </div>

          <div className="flex-1">
            <NativeSelect
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="">Escolha o período</option>
              <option value="7dias">Últimos 7 dias</option>
              <option value="30dias">Últimos 30 dias</option>
              <option value="90dias">Últimos 90 dias</option>
              <option value="ano">Último ano</option>
            </NativeSelect>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
        {/* FASE 42: Tab Sequência Automática */}
        {activeTab === 'automacao' && (
          <ReproductionAutomationTab onNavigateToAgenda={onNavigateToAgenda} />
        )}

        {activeTab === 'protocolos' && (
          <CustomProtocolsTab />
        )}

        {activeTab === 'coberturas' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl text-foreground dark:text-white">Coberturas Registradas</h3>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-1">
                  {coberturas.length} {coberturas.length === 1 ? 'cobertura' : 'coberturas'} registrada(s)
                </p>
              </div>
              <button
                onClick={() => setShowRegisterCoberturaModal(true)}
                className="w-full sm:w-auto px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nova Cobertura
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {coberturas.map((cobertura) => (
                <CoberturaCard 
                  key={cobertura.id} 
                  cobertura={cobertura} 
                  onViewDetails={() => {
                    setSelectedCobertura(cobertura);
                    setShowCoberturaDetails(true);
                  }}
                  onRegister={() => {
                    setSelectedCobertura(cobertura);
                    setShowRegisterCoberturaModal(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ovulos' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl text-foreground dark:text-white">Óvulos Coletados</h3>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-1">
                  {ovulos.length} {ovulos.length === 1 ? 'coleta' : 'coletas'} registrada(s)
                </p>
              </div>
              <button
                onClick={() => setShowRegisterOvulosModal(true)}
                className="w-full sm:w-auto px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nova Coleta de Óvulos
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ovulos.map((ovulo) => (
                <OvuloCard 
                  key={ovulo.id} 
                  ovulo={ovulo} 
                  onViewDetails={() => {
                    setSelectedOvulo(ovulo);
                    setShowOvuloDetails(true);
                  }}
                  onRegister={() => {
                    setSelectedOvulo(ovulo);
                    setShowRegisterOvulosModal(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'embrioes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl text-foreground dark:text-white">Embriões Registrados</h3>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-1">
                  {embrioes.length} {embrioes.length === 1 ? 'embrião' : 'embriões'} registrado(s)
                </p>
              </div>
              <button
                onClick={() => setShowRegisterEmbriaoModal(true)}
                className="w-full sm:w-auto px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Novos Embriões
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {embrioes.map((item) => (
                <EmbriaoCard 
                  key={item.id} 
                  embriao={item} 
                  onViewDetails={() => {
                    setSelectedEmbriao(item);
                    setShowEmbriaoDetails(true);
                  }}
                  onRegister={() => {
                    setSelectedEmbriao(item);
                    setShowRegisterEmbriaoModal(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'gestacoes' && (
          <GestationsTab />
        )}

        {activeTab === 'documentos' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Carregar Documento
              </button>
            </div>
            <div className="space-y-2">
              {documentos.map((doc) => (
                <DocumentoItem 
                  key={doc.id} 
                  documento={doc} 
                  onView={() => {
                    setSelectedDocumento(doc);
                    setShowDocumentoModal(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal Upload Documento */}
      {showUploadModal && (
        <UploadDocumentModal onClose={() => setShowUploadModal(false)} />
      )}

      {/* Modals de Detalhes */}
      {showCoberturaDetails && selectedCobertura && (
        <CoberturaDetailsModal 
          cobertura={selectedCobertura} 
          onClose={() => {
            setShowCoberturaDetails(false);
            setSelectedCobertura(null);
          }} 
        />
      )}

      {showOvuloDetails && selectedOvulo && (
        <OvuloDetailsModal 
          ovulo={selectedOvulo} 
          onClose={() => {
            setShowOvuloDetails(false);
            setSelectedOvulo(null);
          }} 
        />
      )}

      {showEmbriaoDetails && selectedEmbriao && (
        <EmbriaoDetailsModal 
          embriao={selectedEmbriao} 
          onClose={() => {
            setShowEmbriaoDetails(false);
            setSelectedEmbriao(null);
          }} 
        />
      )}

      {showGestacaoDetails && selectedGestacao && (
        <GestacaoDetailsModal 
          gestacao={selectedGestacao} 
          onClose={() => {
            setShowGestacaoDetails(false);
            setSelectedGestacao(null);
          }} 
        />
      )}

      {showDocumentoModal && selectedDocumento && (
        <DocumentoViewModal 
          documento={selectedDocumento} 
          onClose={() => {
            setShowDocumentoModal(false);
            setSelectedDocumento(null);
          }} 
        />
      )}

      {/* Modal Detalhes de Prazos */}
      {showDeadlineModal && selectedDeadline && (
        <DeadlineDetailsModal 
          deadline={selectedDeadline} 
          onClose={() => {
            setShowDeadlineModal(false);
            setSelectedDeadline(null);
          }} 
        />
      )}

      {/* Modal de Registro de Cobertura */}
      {showRegisterCoberturaModal && (
        <RegisterCoberturaModal 
          onClose={() => setShowRegisterCoberturaModal(false)}
          onSubmit={(data) => {
            console.log('Nova cobertura registrada:', data);
            // Aqui você adicionaria a lógica para salvar os dados
            setShowRegisterCoberturaModal(false);
          }}
        />
      )}

      {/* Modal de Registro de Óvulos */}
      {showRegisterOvulosModal && (
        <RegisterOvulosModal 
          onClose={() => setShowRegisterOvulosModal(false)}
          onSubmit={(data) => {
            console.log('Nova coleta de óvulos registrada:', data);
            // Aqui você adicionaria a lógica para salvar os dados
            setShowRegisterOvulosModal(false);
          }}
        />
      )}

      {/* Modal de Registro de Embriões */}
      {showRegisterEmbriaoModal && (
        <RegisterEmbriaoModal 
          onClose={() => setShowRegisterEmbriaoModal(false)}
          onSubmit={(data) => {
            console.log('Novos embriões registrados:', data);
            // Aqui você adicionaria a lógica para salvar os dados
            setShowRegisterEmbriaoModal(false);
          }}
        />
      )}
    </div>
  );
}

function CoberturaCard({ cobertura, onViewDetails, onRegister }: { cobertura: Cobertura; onViewDetails: () => void; onRegister: () => void }) {
  const statusConfig = {
    positivo: { label: 'Positivo', color: 'bg-emerald-500' },
    aguardando: { label: 'Aguardando', color: 'bg-amber-500' },
    negativo: { label: 'Negativo', color: 'bg-[#e74c3c]' },
  };

  const config = statusConfig[cobertura.status];

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[rgba(255,255,255,0.1)] space-y-4">
      <div className="flex items-start justify-between">
        <span className={`${config.color} px-3 py-1 rounded-md text-white text-xs`}>
          {config.label}
        </span>
      </div>

      <div className="space-y-2">
        <p className="text-white">{cobertura.pai} (Pai)</p>
        <p className="text-white">{cobertura.mae}</p>
        <p className="text-gray-500 text-xs">Tipo: {cobertura.tipo}</p>
        <p className="text-gray-500 text-xs">Data: {cobertura.data}</p>
        <p className="text-gray-500 text-xs">Veterinário: {cobertura.veterinario}</p>
      </div>

      <button 
        onClick={onViewDetails}
        className="w-full px-8 py-2 border border-[rgba(255,255,255,0.1)] text-white rounded-lg hover:bg-[#0d0d0d] transition-colors flex items-center justify-center gap-2"
      >
        <Eye className="w-5 h-5" />
        Ver Detalhes
      </button>
    </div>
  );
}

function OvuloCard({ ovulo, onViewDetails, onRegister }: { ovulo: Ovulo; onViewDetails: () => void; onRegister: () => void }) {
  const qualidadeConfig = {
    excelente: { label: 'Excelente', color: 'bg-emerald-500' },
    boa: { label: 'Boa', color: 'bg-gray-500' },
    regular: { label: 'Regular', color: 'bg-amber-500' },
  };

  const config = qualidadeConfig[ovulo.qualidade];

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[rgba(255,255,255,0.1)] space-y-4">
      <div className="flex items-start justify-between">
        <span className={`${config.color} px-3 py-1 rounded-md text-white text-xs`}>
          {config.label}
        </span>
      </div>

      <div className="space-y-2">
        <p className="text-white">{ovulo.doadora}</p>
        <p className="text-gray-500 text-xs">Quantidade: {ovulo.quantidade}</p>
        <p className="text-gray-500 text-xs">Data: {ovulo.data}</p>
        <p className="text-gray-500 text-xs">Status: {ovulo.status}</p>
        <p className="text-gray-500 text-xs">Disponíveis: {ovulo.disponiveis}</p>
      </div>

      <button 
        onClick={onViewDetails}
        className="w-full px-8 py-2 border border-[rgba(255,255,255,0.1)] text-white rounded-lg hover:bg-[#0d0d0d] transition-colors flex items-center justify-center gap-2"
      >
        <Eye className="w-5 h-5" />
        Ver Detalhes
      </button>
    </div>
  );
}

function EmbriaoCard({ embriao, onViewDetails, onRegister }: { embriao: Embriao; onViewDetails: () => void; onRegister: () => void }) {
  const qualidadeConfig = {
    A: { label: 'Grau A', color: 'bg-emerald-500' },
    B: { label: 'Grau B', color: 'bg-gray-500' },
    C: { label: 'Grau C', color: 'bg-amber-500' },
  };

  const config = qualidadeConfig[embriao.grau];

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[rgba(255,255,255,0.1)] space-y-4">
      <div className="flex items-start justify-between">
        <span className={`${config.color} px-3 py-1 rounded-md text-white text-xs`}>
          {config.label}
        </span>
      </div>

      <div className="space-y-2">
        <p className="text-white">{embriao.doadora}</p>
        <p className="text-gray-500 text-xs">Quantidade: {embriao.quantidade}</p>
        <p className="text-gray-500 text-xs">Data: {embriao.data}</p>
        <p className="text-gray-500 text-xs">Status: {embriao.status}</p>
        <p className="text-gray-500 text-xs">Disponíveis: {embriao.disponiveis}</p>
      </div>

      <button 
        onClick={onViewDetails}
        className="w-full px-8 py-2 border border-[rgba(255,255,255,0.1)] text-white rounded-lg hover:bg-[#0d0d0d] transition-colors flex items-center justify-center gap-2"
      >
        <Eye className="w-5 h-5" />
        Ver Detalhes
      </button>
    </div>
  );
}

function DocumentoItem({ documento, onView }: { documento: Documento; onView: () => void }) {
  return (
    <div className="flex items-center justify-between p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
      <div>
        <p className="text-foreground dark:text-white mb-1">{documento.nome}</p>
        <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
          {documento.tipo} • {documento.tamanho} • {documento.data}
        </p>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={onView}
          className="px-4 py-2 bg-card dark:bg-[#1a1a1a] text-foreground dark:text-white rounded-lg hover:bg-accent dark:hover:bg-[#2a2a2a] transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function UploadDocumentModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'cobertura',
    descricao: '',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border dark:border-[rgba(255,255,255,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl text-foreground dark:text-white">Carregar Documento</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">Nome do Documento *</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full h-10 px-4 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
              placeholder="Ex: Contrato de Cobertura"
            />
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">Tipo de Documento *</label>
            <select
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
              className="w-full h-10 px-4 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
            >
              <option value="cobertura">Cobertura</option>
              <option value="gestacao">Gestação</option>
              <option value="ovulo">Óvulo</option>
              <option value="embriao">Embrião</option>
              <option value="laudo">Laudo Veterinário</option>
              <option value="contrato">Contrato</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">Descrição</label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className="w-full px-4 py-3 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white resize-none"
              rows={3}
              placeholder="Descrição do documento"
            />
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">Arquivo *</label>
            <div className="flex items-center justify-center w-full h-40 border-2 border-dashed border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg cursor-pointer hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors">
              <div className="text-center">
                <Upload className="w-12 h-12 mx-auto mb-2 text-muted-foreground dark:text-[#99a1af]" />
                <p className="text-muted-foreground dark:text-[#99a1af] mb-1">Clique ou arraste o arquivo aqui</p>
                <p className="text-xs text-muted-foreground dark:text-[#99a1af]">PDF, JPG, PNG (máx. 10MB)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-transparent border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity"
          >
            Carregar Documento
          </button>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, iconColor }: { title: string; value: string; icon: any; iconColor: string }) {
  return (
    <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
      <div className="flex items-start justify-between mb-4">
        <p className="text-muted-foreground dark:text-[#99a1af]">{title}</p>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <p className="text-3xl text-foreground dark:text-white">{value}</p>
    </div>
  );
}

function DeadlineItem({ name, type, days, onClick }: { name: string; type: string; days: number; onClick: () => void }) {
  const color = days < 0 ? 'text-red-500' : 'text-gray-500';

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg cursor-pointer" onClick={onClick}>
      <div className="flex-1">
        <p className="text-foreground dark:text-white mb-1">{name}</p>
        <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
          {type} • {days < 0 ? 'Atrasado' : `${days} dias`}
        </p>
      </div>
      <button className="w-full sm:w-auto px-4 py-2 bg-card dark:bg-[#1a1a1a] text-foreground dark:text-white rounded-lg hover:bg-accent dark:hover:bg-[#2a2a2a] transition-colors flex items-center justify-center gap-2">
        <Eye className="w-4 h-4" />
        <span className="sm:hidden">Ver Detalhes</span>
      </button>
    </div>
  );
}

function ActivityItem({ title, animal, time, type }: { title: string; animal: string; time: string; type: string }) {
  const icon = {
    covering: <Heart className="w-5 h-5 text-pink-500" />,
    birth: <Heart className="w-5 h-5 text-purple-500" />,
    report: <Heart className="w-5 h-5 text-green-500" />,
    update: <Heart className="w-5 h-5 text-gray-500" />,
  };

  return (
    <div className="flex items-center justify-between p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
      <div>
        <p className="text-foreground dark:text-white mb-1">{title}</p>
        <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
          {animal} • {time}
        </p>
      </div>
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-card dark:bg-[#1a1a1a] text-foreground dark:text-white rounded-lg hover:bg-accent dark:hover:bg-[#2a2a2a] transition-colors">
          {icon[type]}
        </button>
      </div>
    </div>
  );
}

function DeadlineDetailsModal({ deadline, onClose }: { deadline: any; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border dark:border-[rgba(255,255,255,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl text-foreground dark:text-white">Detalhes do Prazo</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">Nome do Animal</label>
            <p className="text-foreground dark:text-white">{deadline.name}</p>
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">Tipo de Evento</label>
            <p className="text-foreground dark:text-white">{deadline.type}</p>
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">Dias Restantes</label>
            <p className="text-foreground dark:text-white">{deadline.days < 0 ? 'Atrasado' : `${deadline.days} dias`}</p>
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">Detalhes</label>
            <p className="text-foreground dark:text-white">{deadline.details}</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mt-6">
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