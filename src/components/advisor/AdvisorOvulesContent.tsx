import { Egg, Plus, Search, Eye, Edit2, Download, Grid3x3, List, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { NativeSelect } from '../ui/native-select';
import { toast } from 'sonner';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { AddOvuleModal, EditOvuleModal } from './modals/OvuleModals';

type ViewMode = 'list' | 'card';
type Screen = 'list' | 'details';

interface Ovule {
  id: string;
  nomeAnimal: string;
  registro: string;
  dataColeta: string;
  metodoColeta: string;
  meioUtilizado: string;
  condicoesMaturacao: string;
  quantidade: string;
  estagioMaturacao: string;
  indicadoresQualidade: string;
  status: string[];
  imageUrl?: string;
}

export function AdvisorOvulesContent() {
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMetodo, setSelectedMetodo] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedOvule, setSelectedOvule] = useState<Ovule | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('list');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const ovules: Ovule[] = [
    {
      id: '001',
      nomeAnimal: 'Estrela',
      registro: 'BRH-2023-054',
      dataColeta: '12/03/2025',
      metodoColeta: 'OPU guiado por ultrassom',
      meioUtilizado: 'TCM-199 + FSH',
      condicoesMaturacao: '38.5°C, 24h incubadora',
      quantidade: '12 oócitos',
      estagioMaturacao: '9 em MII, 3 em GV',
      indicadoresQualidade: '75% em MII, qualidade A e B',
      status: ['Disponível para fertilização'],
      imageUrl: 'https://images.unsplash.com/photo-1748212548716-e94468ebc70e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3JzZSUyMHJ1bm5pbmclMjBmaWVsZHxlbnwxfHx8fDE3NjQxMDQxMjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: '002',
      nomeAnimal: 'Aurora',
      registro: 'BRH-2023-054',
      dataColeta: '12/03/2025',
      metodoColeta: 'OPU guiado por ultrassom',
      meioUtilizado: 'SOF + BSA',
      condicoesMaturacao: '38.5°C, 22h incubadora',
      quantidade: '8 oócitos',
      estagioMaturacao: '5 em MII, 3 em MI',
      indicadoresQualidade: '62% em MII, qualidade B e C',
      status: ['Descartado'],
      imageUrl: 'https://images.unsplash.com/photo-1587778907607-d36fc21ac297?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMGhvcnNlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY0MTAwMTI4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: '003',
      nomeAnimal: 'Safira',
      registro: 'BRH-2023-054',
      dataColeta: '12/03/2025',
      metodoColeta: 'Aspiração folicular',
      meioUtilizado: 'TCM-199 + FSH',
      condicoesMaturacao: '38.5°C, 24h incubadora',
      quantidade: '15 oócitos',
      estagioMaturacao: '12 em MII, 3 em GV',
      indicadoresQualidade: '80% em MII, qualidade A',
      status: ['Utilizado em FIV/ICSI'],
      imageUrl: 'https://images.unsplash.com/photo-1656964353220-99aa5acc47e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHN0YWxsaW9ufGVufDF8fHx8MTc2NDE2MjgxOHww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: '004',
      nomeAnimal: 'Lua',
      registro: 'BRH-2023-054',
      dataColeta: '12/03/2025',
      metodoColeta: 'OPU guiado por ultrassom',
      meioUtilizado: 'TCM-199 + EGF',
      condicoesMaturacao: '38.5°C, 24h incubadora',
      quantidade: '10 oócitos',
      estagioMaturacao: '7 em MII, 3 em MI',
      indicadoresQualidade: '70% em MII, qualidade A e B',
      status: ['Em maturação'],
      imageUrl: 'https://images.unsplash.com/photo-1653832276650-0e7f0584f9ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJlJTIwaG9yc2UlMjBncmF6aW5nfGVufDF8fHx8MTc2NDE2MjgxOXww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: '005',
      nomeAnimal: 'Sol',
      registro: 'BRH-2023-054',
      dataColeta: '12/03/2025',
      metodoColeta: 'Aspiração folicular',
      meioUtilizado: 'SOF + BSA',
      condicoesMaturacao: '38.5°C, 22h incubadora',
      quantidade: '6 oócitos',
      estagioMaturacao: '4 em MII, 2 em GV',
      indicadoresQualidade: '67% em MII, qualidade B',
      status: ['Em cultivo'],
      imageUrl: 'https://images.unsplash.com/photo-1748212548716-e94468ebc70e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3JzZSUyMHJ1bm5pbmclMjBmaWVsZHxlbnwxfHx8fDE3NjQxMDQxMjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: '006',
      nomeAnimal: 'Jasmim',
      registro: 'BRH-2023-054',
      dataColeta: '12/03/2025',
      metodoColeta: 'OPU guiado por ultrassom',
      meioUtilizado: 'TCM-199 + FSH',
      condicoesMaturacao: '38.5°C, 24h incubadora',
      quantidade: '14 oócitos',
      estagioMaturacao: '11 em MII, 3 em MI',
      indicadoresQualidade: '78% em MII, qualidade A e B',
      status: ['Congelados'],
      imageUrl: 'https://images.unsplash.com/photo-1587778907607-d36fc21ac297?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMGhvcnNlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY0MTAwMTI4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'disponível para fertilização':
        return 'bg-emerald-500 text-white';
      case 'descartado':
        return 'bg-red-500 text-white';
      case 'em maturação':
        return 'bg-blue-500 text-white';
      case 'em cultivo':
        return 'bg-gray-500 text-white';
      case 'congelados':
        return 'bg-purple-500 text-white';
      case 'utilizado em fiv/icsi':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const handleViewDetails = (ovule: Ovule) => {
    setSelectedOvule(ovule);
    setCurrentScreen('details');
  };

  const handleEdit = (ovule: Ovule) => {
    setSelectedOvule(ovule);
    setShowEditModal(true);
  };

  const handleAdd = () => {
    setSelectedOvule(null);
    setShowAddModal(true);
  };

  const handleBack = () => {
    setCurrentScreen('list');
    setSelectedOvule(null);
  };

  // Render different screens
  if (currentScreen === 'details' && selectedOvule) {
    return <DetailsScreen ovule={selectedOvule} onBack={handleBack} getStatusColor={getStatusColor} />;
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
          <input
            type="text"
            placeholder="Buscar por égua..."
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
            value={selectedMetodo}
            onChange={(e) => setSelectedMetodo(e.target.value)}
            className="w-full"
          >
            <option value="">Método de coleta</option>
            <option value="opu">OPU guiado por ultrassom</option>
            <option value="aspiracao">Aspiração folicular</option>
          </NativeSelect>

          <NativeSelect
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full"
          >
            <option value="">Status</option>
            <option value="disponivel">Disponível para fertilização</option>
            <option value="maturacao">Em maturação</option>
            <option value="cultivo">Em cultivo</option>
            <option value="congelados">Congelados</option>
            <option value="utilizado">Utilizado em FIV/ICSI</option>
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
        <OvulesListView 
          ovules={ovules} 
          getStatusColor={getStatusColor}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
        />
      ) : (
        <OvulesCardView 
          ovules={ovules} 
          getStatusColor={getStatusColor}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
        />
      )}

      {/* Modals */}
      {showAddModal && (
        <AddOvuleModal 
          onClose={() => setShowAddModal(false)}
          onSave={(data) => {
            console.log('Novo óvulo:', data);
            setShowAddModal(false);
          }}
        />
      )}

      {showEditModal && selectedOvule && (
        <EditOvuleModal 
          ovule={selectedOvule}
          onClose={() => setShowEditModal(false)}
          onSave={(data) => {
            console.log('Óvulo atualizado:', data);
            setShowEditModal(false);
          }}
        />
      )}
    </div>
  );
}

function OvulesListView({ 
  ovules, 
  getStatusColor,
  onViewDetails,
  onEdit
}: { 
  ovules: Ovule[], 
  getStatusColor: (status: string) => string,
  onViewDetails: (ovule: Ovule) => void,
  onEdit: (ovule: Ovule) => void
}) {
  return (
    <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted dark:bg-[#0d0d0d]">
            <tr>
              <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Nº</th>
              <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Nome do Animal</th>
              <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Registro</th>
              <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Data da Coleta</th>
              <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Método de Coleta</th>
              <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Quantidade</th>
              <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Estágio de Maturação</th>
              <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Status</th>
              <th className="text-center px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border dark:divide-[rgba(255,255,255,0.1)]">
            {ovules.map((ovule) => (
              <tr key={ovule.id} className="hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors">
                <td className="px-6 py-4 text-foreground dark:text-white">{ovule.id}</td>
                <td className="px-6 py-4 text-foreground dark:text-white">{ovule.nomeAnimal}</td>
                <td className="px-6 py-4 text-foreground dark:text-white">{ovule.registro}</td>
                <td className="px-6 py-4 text-foreground dark:text-white">{ovule.dataColeta}</td>
                <td className="px-6 py-4 text-foreground dark:text-white">{ovule.metodoColeta}</td>
                <td className="px-6 py-4 text-foreground dark:text-white">{ovule.quantidade}</td>
                <td className="px-6 py-4 text-foreground dark:text-white">{ovule.estagioMaturacao}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {ovule.status.map((status, idx) => (
                      <span key={idx} className={`px-2 py-1 rounded-md text-xs ${getStatusColor(status)}`}>
                        {status}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => onViewDetails(ovule)}
                      className="p-2 hover:bg-muted dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
                      title="Ver detalhes"
                    >
                      <Eye className="w-4 h-4 text-foreground dark:text-white" />
                    </button>
                    <button 
                      onClick={() => onEdit(ovule)}
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

function OvulesCardView({ 
  ovules, 
  getStatusColor,
  onViewDetails,
  onEdit
}: { 
  ovules: Ovule[], 
  getStatusColor: (status: string) => string,
  onViewDetails: (ovule: Ovule) => void,
  onEdit: (ovule: Ovule) => void
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});

  const handlePrevImage = (ovuleId: string) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [ovuleId]: (prev[ovuleId] || 0) - 1
    }));
  };

  const handleNextImage = (ovuleId: string) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [ovuleId]: (prev[ovuleId] || 0) + 1
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {ovules.map((ovule) => (
        <div
          key={ovule.id}
          className="bg-card dark:bg-[#1a1a1a] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-2xl overflow-hidden hover:border-primary dark:hover:border-white transition-colors"
        >
          {/* Image */}
          <div className="relative h-64 bg-muted dark:bg-[#0d0d0d]">
            {ovule.imageUrl ? (
              <>
                <ImageWithFallback 
                  src={ovule.imageUrl}
                  alt={ovule.nomeAnimal}
                  className="w-full h-full object-cover"
                />
                {/* Navigation Arrows */}
                <button 
                  onClick={() => handlePrevImage(ovule.id)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#3a3a3a]/80 hover:bg-[#3a3a3a] rounded-full flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button 
                  onClick={() => handleNextImage(ovule.id)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#3a3a3a]/80 hover:bg-[#3a3a3a] rounded-full flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>

                {/* Status Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-md text-xs ${getStatusColor(ovule.status[0])}`}>
                  {ovule.status[0]}
                </div>

                {/* Edit Button - Positioned on image */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(ovule);
                  }}
                  className="absolute top-4 left-4 p-2 bg-primary dark:bg-white text-white dark:text-black rounded-full hover:opacity-90 transition-opacity"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground dark:text-[#99a1af]">
                <Egg className="w-16 h-16 opacity-20" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 bg-muted dark:bg-[#1a1a1a]">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg text-foreground dark:text-white mb-1">{ovule.nomeAnimal}</h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div>
                <p className="text-muted-foreground dark:text-[#6b6b6b] text-xs mb-1">Registro</p>
                <p className="text-foreground dark:text-white">{ovule.registro}</p>
              </div>
              <div>
                <p className="text-muted-foreground dark:text-[#6b6b6b] text-xs mb-1">Data da coleta</p>
                <p className="text-foreground dark:text-white">{ovule.dataColeta}</p>
              </div>
            </div>

            {/* Actions */}
            <button 
              onClick={() => onViewDetails(ovule)}
              className="w-full px-4 py-2 bg-primary dark:bg-white text-white dark:text-[#1a1a1a] rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
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
  ovule, 
  onBack,
  getStatusColor
}: { 
  ovule: Ovule, 
  onBack: () => void,
  getStatusColor: (status: string) => string
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="space-y-6">
      {/* Breadcrumb and Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <button onClick={onBack} className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white transition-colors">
            Óvulos
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
        <h2 className="text-2xl text-foreground dark:text-white mb-1">{ovule.nomeAnimal}</h2>
        <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Óvulos</p>
      </div>

      {/* Image */}
      <div className="relative h-[600px] bg-muted dark:bg-[#1a1a1a] rounded-2xl overflow-hidden">
        {ovule.imageUrl ? (
          <>
            <ImageWithFallback 
              src={ovule.imageUrl}
              alt={ovule.nomeAnimal}
              className="w-full h-full object-cover"
            />
            {/* Navigation Arrows */}
            <button 
              onClick={() => setCurrentImageIndex(prev => prev - 1)}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#3a3a3a]/80 hover:bg-[#3a3a3a] rounded-full flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button 
              onClick={() => setCurrentImageIndex(prev => prev + 1)}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#3a3a3a]/80 hover:bg-[#3a3a3a] rounded-full flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Status Badge */}
            <div className={`absolute top-6 right-6 px-3 py-1 rounded-md text-xs ${getStatusColor(ovule.status[0])}`}>
              {ovule.status[0]}
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground dark:text-[#99a1af]">
            <Egg className="w-24 h-24 opacity-20" />
          </div>
        )}
      </div>

      {/* Details Grid */}
      <div className="bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#3a3a3a] rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {/* Left Column */}
          <div className="space-y-6">
            <DetailField label="Nome do Animal" value={ovule.nomeAnimal} />
            <DetailField label="Data da Coleta" value={ovule.dataColeta} />
            <DetailField label="Meio Utilizado" value={ovule.meioUtilizado} />
            <DetailField label="Condições de Maturação" value={ovule.condicoesMaturacao} />
            <DetailField label="Indicadores de Qualidade" value={ovule.indicadoresQualidade} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <DetailField label="Registro" value={ovule.registro} />
            <DetailField label="Método de Coleta" value={ovule.metodoColeta} />
            <DetailField label="Quantidade" value={ovule.quantidade} />
            <DetailField label="Estágio de Maturação" value={ovule.estagioMaturacao} />
            <StatusField label="Status" statuses={ovule.status} getStatusColor={getStatusColor} />
          </div>
        </div>
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

function StatusField({ label, statuses, getStatusColor }: { label: string, statuses: string[], getStatusColor: (status: string) => string }) {
  return (
    <div>
      <label className="block text-sm text-foreground dark:text-white mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {statuses.map((status, idx) => (
          <span key={idx} className={`px-3 py-1 rounded-md text-xs ${getStatusColor(status)}`}>
            {status}
          </span>
        ))}
      </div>
    </div>
  );
}

// Add Screen
function AddScreen({ onBack }: { onBack: () => void }) {
  const [formData, setFormData] = useState<Partial<Ovule>>({
    nomeAnimal: '',
    registro: '',
    dataColeta: '',
    metodoColeta: '',
    meioUtilizado: '',
    condicoesMaturacao: '',
    quantidade: '',
    estagioMaturacao: '',
    indicadoresQualidade: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Óvulo cadastrado com sucesso!');
    onBack();
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb and Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <button onClick={onBack} className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white transition-colors">
            Óvulos
          </button>
          <span className="text-muted-foreground dark:text-[#99a1af]">/</span>
          <span className="text-foreground dark:text-white">Cadastrar</span>
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
        <h2 className="text-2xl text-foreground dark:text-white mb-1">Cadastrar Novo Óvulo</h2>
        <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Preencha os dados abaixo</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {/* Left Column */}
            <div className="space-y-6">
              <FormField 
                label="Nome do Animal" 
                value={formData.nomeAnimal || ''}
                onChange={(value) => setFormData({ ...formData, nomeAnimal: value })}
                placeholder="Ex: Estrela"
                required
              />
              <FormField 
                label="Data da Coleta" 
                value={formData.dataColeta || ''}
                onChange={(value) => setFormData({ ...formData, dataColeta: value })}
                placeholder="DD/MM/AAAA"
                required
              />
              <FormField 
                label="Meio Utilizado" 
                value={formData.meioUtilizado || ''}
                onChange={(value) => setFormData({ ...formData, meioUtilizado: value })}
                placeholder="Ex: TCM-199 + FSH"
                required
              />
              <FormField 
                label="Condições de Maturação" 
                value={formData.condicoesMaturacao || ''}
                onChange={(value) => setFormData({ ...formData, condicoesMaturacao: value })}
                placeholder="Ex: 38.5°C, 24h incubadora"
                required
              />
              <FormField 
                label="Indicadores de Qualidade" 
                value={formData.indicadoresQualidade || ''}
                onChange={(value) => setFormData({ ...formData, indicadoresQualidade: value })}
                placeholder="Ex: 75% em MII, qualidade A e B"
                required
              />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <FormField 
                label="Registro" 
                value={formData.registro || ''}
                onChange={(value) => setFormData({ ...formData, registro: value })}
                placeholder="Ex: BRH-2023-054"
                required
              />
              <FormField 
                label="Método de Coleta" 
                value={formData.metodoColeta || ''}
                onChange={(value) => setFormData({ ...formData, metodoColeta: value })}
                placeholder="Ex: OPU guiado por ultrassom"
                required
              />
              <FormField 
                label="Quantidade" 
                value={formData.quantidade || ''}
                onChange={(value) => setFormData({ ...formData, quantidade: value })}
                placeholder="Ex: 12 oócitos"
                required
              />
              <FormField 
                label="Estágio de Maturação" 
                value={formData.estagioMaturacao || ''}
                onChange={(value) => setFormData({ ...formData, estagioMaturacao: value })}
                placeholder="Ex: 9 em MII, 3 em GV"
                required
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col lg:flex-row gap-4 mt-6">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-6 py-3 bg-transparent border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white rounded-xl hover:bg-muted dark:hover:bg-[#1a1a1a] transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
          >
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
}

function FormField({ 
  label, 
  value, 
  onChange, 
  placeholder,
  required = false
}: { 
  label: string, 
  value: string, 
  onChange: (value: string) => void,
  placeholder?: string,
  required?: boolean
}) {
  return (
    <div>
      <label className="block text-sm text-white mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full h-10 px-4 bg-[#3a3a3a] border-none rounded-lg text-white placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-white"
      />
    </div>
  );
}