import { Baby, Plus, Search, Eye, Edit2, Download, Grid3x3, List, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { NativeSelect } from '../ui/native-select';
import { toast } from 'sonner';
import { AddEmbryoModal, EditEmbryoModal } from './modals/EmbryoModals';

type ViewMode = 'list' | 'card';
type Screen = 'list' | 'details';

interface Embryo {
  id: string;
  linhaGenetica: string;
  data: string;
  metodoObtencao: string;
  estagio: string;
  meioCultura: string;
  receptora: string;
  destinoStatus: string;
  notas: string;
}

export function AdvisorEmbryosContent() {
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedEstagio, setSelectedEstagio] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedEmbryo, setSelectedEmbryo] = useState<Embryo | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('list');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const embryos: Embryo[] = [
    {
      id: 'EMBR-2025-001',
      linhaGenetica: 'Relâmpago x Estrela',
      data: '18/03/2025',
      metodoObtencao: 'ICSI',
      estagio: 'Blastocisto, qualidade A',
      meioCultura: 'SOF modificado',
      receptora: 'Bella – BRM-2018-099',
      destinoStatus: 'Transferido para receptora Égua "Bella"',
      notas: 'Taxa de implantação esperada 70%',
    },
    {
      id: 'EMBR-2025-002',
      linhaGenetica: 'Relâmpago x Estrela',
      data: '18/03/2025',
      metodoObtencao: 'ICSI',
      estagio: 'Blastocisto, qualidade A',
      meioCultura: 'SOF modificado',
      receptora: 'Bella – BRM-2018-099',
      destinoStatus: 'Congelado – Botucatu Cryobank',
      notas: 'Aguardando receptora compatível',
    },
    {
      id: 'EMBR-2025-003',
      linhaGenetica: 'Relâmpago x Estrela',
      data: '18/03/2025',
      metodoObtencao: 'ICSI',
      estagio: 'Blastocisto, qualidade A',
      meioCultura: 'SOF modificado',
      receptora: 'Bella – BRM-2018-099',
      destinoStatus: 'Descartado por má qualidade',
      notas: 'Inviável para implantação',
    },
    {
      id: 'EMBR-2025-004',
      linhaGenetica: 'Trovão x Aurora',
      data: '22/03/2025',
      metodoObtencao: 'FIV',
      estagio: 'Mórula, qualidade B',
      meioCultura: 'TCM-199',
      receptora: 'Luna – BRM-2019-045',
      destinoStatus: 'Em cultivo',
      notas: 'Monitoramento contínuo',
    },
    {
      id: 'EMBR-2025-005',
      linhaGenetica: 'Vale Verde x Safira',
      data: '25/03/2025',
      metodoObtencao: 'ICSI',
      estagio: 'Blastocisto expandido, qualidade A+',
      meioCultura: 'SOF modificado',
      receptora: 'Jasmine – BRM-2020-078',
      destinoStatus: 'Transferido com sucesso',
      notas: 'Prognóstico excelente',
    },
    {
      id: 'EMBR-2025-006',
      linhaGenetica: 'Estância x Flor',
      data: '28/03/2025',
      metodoObtencao: 'FIV',
      estagio: 'Blastocisto inicial, qualidade B',
      meioCultura: 'TCM-199',
      receptora: 'Pendente',
      destinoStatus: 'Aguardando transferência',
      notas: 'Sincronização de receptora em andamento',
    },
  ];

  const getStatusColor = (status: string) => {
    if (status.toLowerCase().includes('transferido')) {
      return 'bg-emerald-500 text-white';
    } else if (status.toLowerCase().includes('congelado')) {
      return 'bg-orange-500 text-white';
    } else if (status.toLowerCase().includes('descartado')) {
      return 'bg-red-500 text-white';
    } else if (status.toLowerCase().includes('cultivo')) {
      return 'bg-blue-500 text-white';
    } else if (status.toLowerCase().includes('aguardando')) {
      return 'bg-purple-500 text-white';
    }
    return 'bg-gray-500 text-white';
  };

  const handleViewDetails = (embryo: Embryo) => {
    setSelectedEmbryo(embryo);
    setCurrentScreen('details');
  };

  const handleEdit = (embryo: Embryo) => {
    setSelectedEmbryo(embryo);
    setShowEditModal(true);
  };

  const handleAdd = () => {
    setSelectedEmbryo(null);
    setShowAddModal(true);
  };

  const handleBack = () => {
    setCurrentScreen('list');
    setSelectedEmbryo(null);
  };

  // Render different screens
  if (currentScreen === 'details' && selectedEmbryo) {
    return <DetailsScreen embryo={selectedEmbryo} onBack={handleBack} getStatusColor={getStatusColor} />;
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
          <input
            type="text"
            placeholder="Pesquisar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
          />
        </div>
        <button 
          onClick={handleAdd}
          className="h-10 px-6 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Cadastrar novo
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 w-full">
          <NativeSelect
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full"
          >
            <option value="">Data</option>
            <option value="hoje">Hoje</option>
            <option value="7dias">Últimos 7 dias</option>
            <option value="30dias">Últimos 30 dias</option>
            <option value="3meses">Últimos 3 meses</option>
          </NativeSelect>

          <NativeSelect
            value={selectedEstagio}
            onChange={(e) => setSelectedEstagio(e.target.value)}
            className="w-full"
          >
            <option value="">Estágio</option>
            <option value="blastocisto-a">Blastocisto, qualidade A</option>
            <option value="blastocisto-b">Blastocisto, qualidade B</option>
            <option value="morula">Mórula</option>
            <option value="expandido">Blastocisto expandido</option>
          </NativeSelect>

          <NativeSelect
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full"
          >
            <option value="">Status</option>
            <option value="transferido">Transferido</option>
            <option value="congelado">Congelado</option>
            <option value="cultivo">Em cultivo</option>
            <option value="aguardando">Aguardando transferência</option>
            <option value="descartado">Descartado</option>
          </NativeSelect>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' 
                ? 'bg-primary dark:bg-white text-white dark:text-black' 
                : 'bg-muted dark:bg-[#1a1a1a] text-muted-foreground dark:text-[#99a1af] hover:bg-accent dark:hover:bg-[#2a2a2a]'
            }`}
            title="Visualização em lista"
          >
            <List className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('card')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'card' 
                ? 'bg-primary dark:bg-white text-white dark:text-black' 
                : 'bg-muted dark:bg-[#1a1a1a] text-muted-foreground dark:text-[#99a1af] hover:bg-accent dark:hover:bg-[#2a2a2a]'
            }`}
            title="Visualização em cards"
          >
            <Grid3x3 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'list' ? (
        <EmbryosListView 
          embryos={embryos} 
          getStatusColor={getStatusColor}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
        />
      ) : (
        <EmbryosCardView 
          embryos={embryos} 
          getStatusColor={getStatusColor}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
        />
      )}

      {/* Modals */}
      {showAddModal && (
        <AddEmbryoModal 
          onClose={() => setShowAddModal(false)}
          onSave={(data) => {
            console.log('Novo embrião:', data);
            toast.success('Embrião cadastrado com sucesso!');
            setShowAddModal(false);
          }}
        />
      )}

      {showEditModal && selectedEmbryo && (
        <EditEmbryoModal 
          embryo={selectedEmbryo}
          onClose={() => setShowEditModal(false)}
          onSave={(data) => {
            console.log('Embrião atualizado:', data);
            toast.success('Embrião atualizado com sucesso!');
            setShowEditModal(false);
          }}
        />
      )}
    </div>
  );
}

function EmbryosListView({ 
  embryos, 
  getStatusColor,
  onViewDetails,
  onEdit
}: { 
  embryos: Embryo[], 
  getStatusColor: (status: string) => string,
  onViewDetails: (embryo: Embryo) => void,
  onEdit: (embryo: Embryo) => void
}) {
  return (
    <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead className="bg-muted dark:bg-[#0d0d0d]">
            <tr>
              <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af] whitespace-nowrap">ID</th>
              <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af] whitespace-nowrap">Linha Genética</th>
              <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af] whitespace-nowrap">Data</th>
              <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af] whitespace-nowrap">Método de Obtenção</th>
              <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af] whitespace-nowrap">Estágio</th>
              <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af] whitespace-nowrap">Receptora</th>
              <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af] whitespace-nowrap">Destino/Status</th>
              <th className="text-center px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af] whitespace-nowrap">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border dark:divide-[rgba(255,255,255,0.1)]">
            {embryos.map((embryo) => (
              <tr key={embryo.id} className="hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors">
                <td className="px-6 py-4 text-foreground dark:text-white whitespace-nowrap">{embryo.id}</td>
                <td className="px-6 py-4 text-foreground dark:text-white whitespace-nowrap">{embryo.linhaGenetica}</td>
                <td className="px-6 py-4 text-foreground dark:text-white whitespace-nowrap">{embryo.data}</td>
                <td className="px-6 py-4 text-foreground dark:text-white whitespace-nowrap">{embryo.metodoObtencao}</td>
                <td className="px-6 py-4 text-foreground dark:text-white">{embryo.estagio}</td>
                <td className="px-6 py-4 text-foreground dark:text-white whitespace-nowrap">{embryo.receptora}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${getStatusColor(embryo.destinoStatus)}`}>
                    {embryo.destinoStatus}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => onViewDetails(embryo)}
                      className="p-2 hover:bg-muted dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
                      title="Ver detalhes"
                    >
                      <Eye className="w-4 h-4 text-foreground dark:text-white" />
                    </button>
                    <button 
                      onClick={() => onEdit(embryo)}
                      className="p-2 hover:bg-muted dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4 text-foreground dark:text-white" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EmbryosCardView({ 
  embryos, 
  getStatusColor,
  onViewDetails,
  onEdit
}: { 
  embryos: Embryo[], 
  getStatusColor: (status: string) => string,
  onViewDetails: (embryo: Embryo) => void,
  onEdit: (embryo: Embryo) => void
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {embryos.map((embryo) => (
        <div
          key={embryo.id}
          className="bg-card dark:bg-[#1a1a1a] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-2xl overflow-hidden hover:border-primary dark:hover:border-white transition-colors"
        >
          {/* Header */}
          <div className="relative p-4 bg-muted dark:bg-[#0d0d0d] border-b border-border dark:border-[rgba(255,255,255,0.1)]">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg text-foreground dark:text-white mb-1">{embryo.id}</h3>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(embryo);
                }}
                className="p-2 bg-primary dark:bg-white text-white dark:text-black rounded-full hover:opacity-90 transition-opacity"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 bg-muted dark:bg-[#1a1a1a] space-y-3">
            <div>
              <p className="text-muted-foreground dark:text-[#6b6b6b] text-xs mb-1">Linha genética</p>
              <p className="text-foreground dark:text-white text-sm">{embryo.linhaGenetica}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-muted-foreground dark:text-[#6b6b6b] text-xs mb-1">Data</p>
                <p className="text-foreground dark:text-white text-sm">{embryo.data}</p>
              </div>
              <div>
                <p className="text-muted-foreground dark:text-[#6b6b6b] text-xs mb-1">Método</p>
                <p className="text-foreground dark:text-white text-sm">{embryo.metodoObtencao}</p>
              </div>
            </div>

            <div>
              <p className="text-muted-foreground dark:text-[#6b6b6b] text-xs mb-1">Estágio</p>
              <p className="text-foreground dark:text-white text-sm">{embryo.estagio}</p>
            </div>

            <div>
              <p className="text-muted-foreground dark:text-[#6b6b6b] text-xs mb-1">Destino/status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs whitespace-nowrap ${getStatusColor(embryo.destinoStatus)}`}>
                {embryo.destinoStatus}
              </span>
            </div>

            {embryo.notas && (
              <div>
                <p className="text-muted-foreground dark:text-[#6b6b6b] text-xs mb-1">Notas</p>
                <p className="text-foreground dark:text-white text-sm">{embryo.notas}</p>
              </div>
            )}

            {/* Actions */}
            <button 
              onClick={() => onViewDetails(embryo)}
              className="w-full px-4 py-2 bg-primary dark:bg-white text-white dark:text-[#1a1a1a] rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-4"
            >
              <Eye className="w-4 h-4" />
              Ver Detalhes
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Details Screen
function DetailsScreen({ 
  embryo, 
  onBack,
  getStatusColor
}: { 
  embryo: Embryo, 
  onBack: () => void,
  getStatusColor: (status: string) => string
}) {
  return (
    <div className="space-y-6">
      {/* Breadcrumb and Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <button onClick={onBack} className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white transition-colors">
            Embriões
          </button>
          <span className="text-muted-foreground dark:text-[#99a1af]">/</span>
          <span className="text-foreground dark:text-white">Ver Detalhes</span>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-muted dark:bg-[#1a1a1a] text-foreground dark:text-white rounded-xl hover:bg-accent dark:hover:bg-[#2a2a2a] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
      </div>

      {/* Header */}
      <div className="bg-card dark:bg-[#0d0d0d] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] p-6">
        <h2 className="text-2xl text-foreground dark:text-white mb-1">{embryo.id}</h2>
        <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Embriões</p>
      </div>

      {/* Details Grid */}
      <div className="bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#3a3a3a] rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {/* Left Column */}
          <div className="space-y-6">
            <DetailField label="ID" value={embryo.id} />
            <DetailField label="Linha Genética" value={embryo.linhaGenetica} />
            <DetailField label="Método de Obtenção" value={embryo.metodoObtencao} />
            <DetailField label="Meio de Cultura" value={embryo.meioCultura} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <DetailField label="Data" value={embryo.data} />
            <DetailField label="Estágio" value={embryo.estagio} />
            <DetailField label="Receptora" value={embryo.receptora} />
            <StatusField label="Destino/Status" status={embryo.destinoStatus} getStatusColor={getStatusColor} />
          </div>
        </div>

        {/* Notes (full width) */}
        {embryo.notas && (
          <div className="mt-6 pt-6 border-t border-border dark:border-[#3a3a3a]">
            <DetailField label="Notas" value={embryo.notas} />
          </div>
        )}
      </div>
    </div>
  );
}

function DetailField({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <label className="block text-sm text-foreground dark:text-white mb-2">{label}</label>
      <div className="h-10 bg-input dark:bg-[#3a3a3a] border border-border dark:border-[#3a3a3a] rounded-lg flex items-center px-4">
        <span className="text-sm text-foreground dark:text-white">{value}</span>
      </div>
    </div>
  );
}

function StatusField({ label, status, getStatusColor }: { label: string, status: string, getStatusColor: (status: string) => string }) {
  return (
    <div>
      <label className="block text-sm text-foreground dark:text-white mb-2">{label}</label>
      <div className="flex">
        <span className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>
    </div>
  );
}