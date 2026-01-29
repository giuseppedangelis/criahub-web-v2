import { Heart, Plus, Search, Eye, Edit2, Download, Grid3x3, List, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { NativeSelect } from '../ui/native-select';
import { toast } from 'sonner';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { AddPregnancyModal, EditPregnancyModal } from './modals/PregnancyModals';

type ViewMode = 'list' | 'card';
type Screen = 'list' | 'details';

interface Pregnancy {
  id: string;
  nomeAnimal: string;
  registro: string;
  dataCobertura: string;
  tipoCobertura: string;
  garanhaoEmbriao: string;
  diagnostico: string;
  observacoes: string;
  status: string;
  imageUrl?: string;
}

export function AdvisorPregnanciesContent() {
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedReceptora, setSelectedReceptora] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPregnancy, setSelectedPregnancy] = useState<Pregnancy | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('list');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const pregnancies: Pregnancy[] = [
    {
      id: '001',
      nomeAnimal: 'Bella',
      registro: 'BRH-2023-054',
      dataCobertura: '12/03/2025',
      tipoCobertura: 'Transferência embrionária',
      garanhaoEmbriao: 'Relâmpago x Estrela',
      diagnostico: 'Palpação aos 14 dias',
      observacoes: 'Gestação única, sem complicações',
      status: 'Gestação confirmada',
      imageUrl: 'https://images.unsplash.com/photo-1653832276650-0e7f0584f9ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJlJTIwaG9yc2UlMjBncmF6aW5nfGVufDF8fHx8MTc2NDE2MjgxOXww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: '002',
      nomeAnimal: 'Serena',
      registro: 'BRH-2023-054',
      dataCobertura: '12/03/2025',
      tipoCobertura: 'Inseminação artificial',
      garanhaoEmbriao: 'Vale Verde',
      diagnostico: 'Ultrassom aos 30 dias',
      observacoes: 'Monitoramento semanal recomendado',
      status: 'Gestação em andamento',
      imageUrl: 'https://images.unsplash.com/photo-1587778907607-d36fc21ac297?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMGhvcnNlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY0MTAwMTI4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: '003',
      nomeAnimal: 'Diamante',
      registro: 'BRH-2023-054',
      dataCobertura: '12/03/2025',
      tipoCobertura: 'Transferência embrionária',
      garanhaoEmbriao: 'Trovão x Aurora',
      diagnostico: 'Ultrassom aos 45 dias',
      observacoes: 'Égua em boas condições, acompanhamento quinzenal',
      status: 'Gestação precoce',
      imageUrl: 'https://images.unsplash.com/photo-1748212548716-e94468ebc70e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3JzZSUyMHJ1bm5pbmclMjBmaWVsZHxlbnwxfHx8fDE3NjQxMDQxMjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: '004',
      nomeAnimal: 'Íris',
      registro: 'BRH-2023-054',
      dataCobertura: '12/03/2025',
      tipoCobertura: 'Monta natural',
      garanhaoEmbriao: 'Estância dos Ventos',
      diagnostico: 'Confirmação por palpação',
      observacoes: 'Perda gestacional aos 60 dias',
      status: 'Gestação de risco',
      imageUrl: 'https://images.unsplash.com/photo-1656964353220-99aa5acc47e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHN0YWxsaW9ufGVufDF8fHx8MTc2NDE2MjgxOHww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: '005',
      nomeAnimal: 'Nevasca',
      registro: 'BRH-2023-054',
      dataCobertura: '12/03/2025',
      tipoCobertura: 'Transferência embrionária',
      garanhaoEmbriao: 'Rei da Serra',
      diagnostico: 'Ultrassom 6 meses',
      observacoes: 'Potro desenvolvendo normalmente, previsão nascimento em 30 dias',
      status: 'Gestação finalizada',
      imageUrl: 'https://images.unsplash.com/photo-1653832276650-0e7f0584f9ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVnbmFudCUyMG1hcmUlMjBob3JzZXxlbnwxfHx8fDE3NjQxNjU5OTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: '006',
      nomeAnimal: 'Jade',
      registro: 'BRH-2023-054',
      dataCobertura: '12/03/2025',
      tipoCobertura: 'Inseminação artificial',
      garanhaoEmbriao: 'Fazenda da Luz',
      diagnostico: 'Ultrassom negativo',
      observacoes: 'Gestação não confirmada, protocolo de sincronização para nova cobertura',
      status: 'Gestação abortada',
      imageUrl: 'https://images.unsplash.com/photo-1587778907607-d36fc21ac297?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMGhvcnNlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY0MTAwMTI4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'gestação confirmada':
        return 'bg-emerald-500 text-white';
      case 'gestação em andamento':
        return 'bg-blue-500 text-white';
      case 'gestação precoce':
        return 'bg-orange-500 text-white';
      case 'gestação de risco':
        return 'bg-red-500 text-white';
      case 'gestação finalizada':
        return 'bg-green-500 text-white';
      case 'gestação abortada':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const handleViewDetails = (pregnancy: Pregnancy) => {
    setSelectedPregnancy(pregnancy);
    setCurrentScreen('details');
  };

  const handleEdit = (pregnancy: Pregnancy) => {
    setSelectedPregnancy(pregnancy);
    setShowEditModal(true);
  };

  const handleAdd = () => {
    setSelectedPregnancy(null);
    setShowAddModal(true);
  };

  const handleBack = () => {
    setCurrentScreen('list');
    setSelectedPregnancy(null);
  };

  // Render different screens
  if (currentScreen === 'details' && selectedPregnancy) {
    return <DetailsScreen pregnancy={selectedPregnancy} onBack={handleBack} getStatusColor={getStatusColor} />;
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
            value={selectedReceptora}
            onChange={(e) => setSelectedReceptora(e.target.value)}
            className="w-full"
          >
            <option value="">Receptora</option>
            <option value="bella">Bella</option>
            <option value="serena">Serena</option>
            <option value="diamante">Diamante</option>
            <option value="iris">Íris</option>
          </NativeSelect>

          <NativeSelect
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full"
          >
            <option value="">Status</option>
            <option value="confirmada">Gestação confirmada</option>
            <option value="andamento">Gestação em andamento</option>
            <option value="precoce">Gestação precoce</option>
            <option value="risco">Gestação de risco</option>
            <option value="finalizada">Gestação finalizada</option>
            <option value="abortada">Gestação abortada</option>
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
        <PregnanciesListView 
          pregnancies={pregnancies} 
          getStatusColor={getStatusColor}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
        />
      ) : (
        <PregnanciesCardView 
          pregnancies={pregnancies} 
          getStatusColor={getStatusColor}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
        />
      )}

      {/* Modals */}
      {showAddModal && (
        <AddPregnancyModal 
          onClose={() => setShowAddModal(false)}
          onSave={(data) => {
            console.log('Nova gestação:', data);
            toast.success('Gestação cadastrada com sucesso!');
            setShowAddModal(false);
          }}
        />
      )}

      {showEditModal && selectedPregnancy && (
        <EditPregnancyModal 
          pregnancy={selectedPregnancy}
          onClose={() => setShowEditModal(false)}
          onSave={(data) => {
            console.log('Gestação atualizada:', data);
            toast.success('Gestação atualizada com sucesso!');
            setShowEditModal(false);
          }}
        />
      )}
    </div>
  );
}

function PregnanciesListView({ 
  pregnancies, 
  getStatusColor,
  onViewDetails,
  onEdit
}: { 
  pregnancies: Pregnancy[], 
  getStatusColor: (status: string) => string,
  onViewDetails: (pregnancy: Pregnancy) => void,
  onEdit: (pregnancy: Pregnancy) => void
}) {
  return (
    <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px]">
          <thead className="bg-muted dark:bg-[#0d0d0d]">
            <tr>
              <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af] whitespace-nowrap">Nº</th>
              <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af] whitespace-nowrap">Nome do Animal</th>
              <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af] whitespace-nowrap">Registro</th>
              <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af] whitespace-nowrap">Data da Cobertura</th>
              <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af] whitespace-nowrap">Tipo de Cobertura</th>
              <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af] whitespace-nowrap">Garanhão/Embrião</th>
              <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af] whitespace-nowrap">Diagnóstico</th>
              <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af] whitespace-nowrap">Status</th>
              <th className="text-center px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af] whitespace-nowrap">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border dark:divide-[rgba(255,255,255,0.1)]">
            {pregnancies.map((pregnancy) => (
              <tr key={pregnancy.id} className="hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors">
                <td className="px-6 py-4 text-foreground dark:text-white whitespace-nowrap">{pregnancy.id}</td>
                <td className="px-6 py-4 text-foreground dark:text-white whitespace-nowrap">{pregnancy.nomeAnimal}</td>
                <td className="px-6 py-4 text-foreground dark:text-white whitespace-nowrap">{pregnancy.registro}</td>
                <td className="px-6 py-4 text-foreground dark:text-white whitespace-nowrap">{pregnancy.dataCobertura}</td>
                <td className="px-6 py-4 text-foreground dark:text-white whitespace-nowrap">{pregnancy.tipoCobertura}</td>
                <td className="px-6 py-4 text-foreground dark:text-white whitespace-nowrap">{pregnancy.garanhaoEmbriao}</td>
                <td className="px-6 py-4 text-foreground dark:text-white whitespace-nowrap">{pregnancy.diagnostico}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${getStatusColor(pregnancy.status)}`}>
                    {pregnancy.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => onViewDetails(pregnancy)}
                      className="p-2 hover:bg-muted dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
                      title="Ver detalhes"
                    >
                      <Eye className="w-4 h-4 text-foreground dark:text-white" />
                    </button>
                    <button 
                      onClick={() => onEdit(pregnancy)}
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

function PregnanciesCardView({ 
  pregnancies, 
  getStatusColor,
  onViewDetails,
  onEdit
}: { 
  pregnancies: Pregnancy[], 
  getStatusColor: (status: string) => string,
  onViewDetails: (pregnancy: Pregnancy) => void,
  onEdit: (pregnancy: Pregnancy) => void
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});

  const handlePrevImage = (pregnancyId: string) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [pregnancyId]: (prev[pregnancyId] || 0) - 1
    }));
  };

  const handleNextImage = (pregnancyId: string) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [pregnancyId]: (prev[pregnancyId] || 0) + 1
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pregnancies.map((pregnancy) => (
        <div
          key={pregnancy.id}
          className="bg-card dark:bg-[#1a1a1a] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-2xl overflow-hidden hover:border-primary dark:hover:border-white transition-colors"
        >
          {/* Image */}
          <div className="relative h-64 bg-muted dark:bg-[#0d0d0d]">
            {pregnancy.imageUrl ? (
              <>
                <ImageWithFallback 
                  src={pregnancy.imageUrl}
                  alt={pregnancy.nomeAnimal}
                  className="w-full h-full object-cover"
                />
                {/* Navigation Arrows */}
                <button 
                  onClick={() => handlePrevImage(pregnancy.id)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#3a3a3a]/80 hover:bg-[#3a3a3a] rounded-full flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button 
                  onClick={() => handleNextImage(pregnancy.id)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#3a3a3a]/80 hover:bg-[#3a3a3a] rounded-full flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>

                {/* Status Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs whitespace-nowrap ${getStatusColor(pregnancy.status)}`}>
                  {pregnancy.status}
                </div>

                {/* Edit Button - Positioned on image */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(pregnancy);
                  }}
                  className="absolute top-4 left-4 p-2 bg-primary dark:bg-white text-white dark:text-black rounded-full hover:opacity-90 transition-opacity"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground dark:text-[#99a1af]">
                <Heart className="w-16 h-16 opacity-20" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 bg-muted dark:bg-[#1a1a1a]">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg text-foreground dark:text-white mb-1">{pregnancy.nomeAnimal}</h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div>
                <p className="text-muted-foreground dark:text-[#6b6b6b] text-xs mb-1">Registro</p>
                <p className="text-foreground dark:text-white">{pregnancy.registro}</p>
              </div>
              <div>
                <p className="text-muted-foreground dark:text-[#6b6b6b] text-xs mb-1">Data da cobertura</p>
                <p className="text-foreground dark:text-white">{pregnancy.dataCobertura}</p>
              </div>
            </div>

            {/* Actions */}
            <button 
              onClick={() => onViewDetails(pregnancy)}
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
  pregnancy, 
  onBack,
  getStatusColor
}: { 
  pregnancy: Pregnancy, 
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
            Gestações
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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl text-foreground dark:text-white mb-1">{pregnancy.nomeAnimal}</h2>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Gestações</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${getStatusColor(pregnancy.status)}`}>
            {pregnancy.status}
          </span>
        </div>
      </div>

      {/* Image */}
      <div className="relative h-[600px] bg-muted dark:bg-[#1a1a1a] rounded-2xl overflow-hidden">
        {pregnancy.imageUrl ? (
          <>
            <ImageWithFallback 
              src={pregnancy.imageUrl}
              alt={pregnancy.nomeAnimal}
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
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground dark:text-[#99a1af]">
            <Heart className="w-24 h-24 opacity-20" />
          </div>
        )}
      </div>

      {/* Details Grid */}
      <div className="bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#3a3a3a] rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {/* Left Column */}
          <div className="space-y-6">
            <DetailField label="Nome do Animal" value={pregnancy.nomeAnimal} />
            <DetailField label="Data da Cobertura" value={pregnancy.dataCobertura} />
            <DetailField label="Garanhão/Embrião" value={pregnancy.garanhaoEmbriao} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <DetailField label="Registro" value={pregnancy.registro} />
            <DetailField label="Tipo de Cobertura" value={pregnancy.tipoCobertura} />
            <DetailField label="Diagnóstico" value={pregnancy.diagnostico} />
            <DetailField label="Observações" value={pregnancy.observacoes} />
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