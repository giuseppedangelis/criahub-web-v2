import { Heart, Egg, Baby, Plus, Search, Calendar, Filter, Eye, Edit2, Download, Grid3x3, List, FileText, X, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { NativeSelect } from '../ui/native-select';
import { toast } from 'sonner';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { AdvisorOvulesContent } from './AdvisorOvulesContent';
import { AdvisorEmbryosContent } from './AdvisorEmbryosContent';
import { AdvisorPregnanciesContent } from './AdvisorPregnanciesContent';
import { AddCoverageModal, EditCoverageModal } from './modals/CoverageModals';

type ReproductionTab = 'coverage' | 'ovules' | 'embryos' | 'pregnancies';
type ViewMode = 'list' | 'card';
type Screen = 'list' | 'details';

interface Coverage {
  id: string;
  nomeAnimal: string;
  registro: string;
  dataCobertura: string;
  tipoCobertura: string;
  garanhao: string;
  situacaoGestacional: string;
  dataConfirmacao: string;
  nascimento: string;
  geneticaUtilizada: string;
  observacoes: string;
  imageUrl?: string;
}

export function AdvisorReproductionContentNew() {
  const [activeTab, setActiveTab] = useState<ReproductionTab>('coverage');
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCoverage, setSelectedCoverage] = useState<Coverage | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('list');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const tabs = [
    { id: 'coverage' as ReproductionTab, label: 'Cobertura', icon: Heart },
    { id: 'ovules' as ReproductionTab, label: 'Óvulos', icon: Egg },
    { id: 'embryos' as ReproductionTab, label: 'Embriões', icon: Baby },
    { id: 'pregnancies' as ReproductionTab, label: 'Gestações', icon: Heart },
  ];

  const coverages: Coverage[] = [
    {
      id: '001',
      nomeAnimal: 'Dama da Pavibra',
      registro: 'BRH-2020-001',
      dataCobertura: '12/03/2020',
      tipoCobertura: 'Inseminação Artificial',
      garanhao: 'Rei da Serra',
      situacaoGestacional: 'Confirmada',
      dataConfirmacao: '12/03/2020',
      nascimento: '12/03/2020',
      geneticaUtilizada: 'Sêmen Refrigerado',
      observacoes: 'Nova tentativa em julho',
      imageUrl: 'https://images.unsplash.com/photo-1748212548716-e94468ebc70e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3JzZSUyMHJ1bm5pbmclMjBmaWVsZHxlbnwxfHx8fDE3NjQxMDQxMjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: '002',
      nomeAnimal: 'Flor do Campo',
      registro: 'BRH-2020-002',
      dataCobertura: '15/04/2020',
      tipoCobertura: 'Inseminação Artificial',
      garanhao: 'Vale Verde',
      situacaoGestacional: 'Pendente',
      dataConfirmacao: '15/04/2020',
      nascimento: '15/04/2020',
      geneticaUtilizada: 'Sêmen Congelado',
      observacoes: 'Aguardando resultados',
      imageUrl: 'https://images.unsplash.com/photo-1587778907607-d36fc21ac297?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMGhvcnNlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY0MTAwMTI4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: '003',
      nomeAnimal: 'Cavalo do Sol',
      registro: 'BRH-2020-003',
      dataCobertura: '20/05/2020',
      tipoCobertura: 'Inseminação Artificial',
      garanhao: 'Estância dos Ventos',
      situacaoGestacional: 'Confirmada',
      dataConfirmacao: '20/05/2020',
      nascimento: '20/05/2020',
      geneticaUtilizada: 'Sêmen Refrigerado',
      observacoes: 'Próxima avaliação em setembro',
      imageUrl: 'https://images.unsplash.com/photo-1656964353220-99aa5acc47e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHN0YWxsaW9ufGVufDF8fHx8MTc2NDE2MjgxOHww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: '004',
      nomeAnimal: 'Estrela do Oriente',
      registro: 'BRH-2020-004',
      dataCobertura: '10/06/2020',
      tipoCobertura: 'Inseminação Natural',
      garanhao: 'Fazenda da Luz',
      situacaoGestacional: 'Sucesso',
      dataConfirmacao: '10/06/2020',
      nascimento: '10/06/2020',
      geneticaUtilizada: 'Sêmen Fresco',
      observacoes: 'Gestação confirmada',
      imageUrl: 'https://images.unsplash.com/photo-1653832276650-0e7f0584f9ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJlJTIwaG9yc2UlMjBncmF6aW5nfGVufDF8fHx8MTc2NDE2MjgxOXww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: '005',
      nomeAnimal: 'Rei do Sertão',
      registro: 'BRH-2020-005',
      dataCobertura: '22/07/2020',
      tipoCobertura: 'Inseminação Artificial',
      garanhao: 'Campo Verde',
      situacaoGestacional: 'Pendente',
      dataConfirmacao: '22/07/2020',
      nascimento: '22/07/2020',
      geneticaUtilizada: 'Sêmen Congelado',
      observacoes: 'Aguardando avaliação',
      imageUrl: 'https://images.unsplash.com/photo-1748212548716-e94468ebc70e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3JzZSUyMHJ1bm5pbmclMjBmaWVsZHxlbnwxfHx8fDE3NjQxMDQxMjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: '006',
      nomeAnimal: 'Rainha da Floresta',
      registro: 'BRH-2020-006',
      dataCobertura: '30/08/2020',
      tipoCobertura: 'Inseminação Artificial',
      garanhao: 'Chácara do Sol',
      situacaoGestacional: 'Confirmada',
      dataConfirmacao: '30/08/2020',
      nascimento: '30/08/2020',
      geneticaUtilizada: 'Sêmen Refrigerado',
      observacoes: 'Preparando para parto',
      imageUrl: 'https://images.unsplash.com/photo-1587778907607-d36fc21ac297?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMGhvcnNlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY0MTAwMTI4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: '007',
      nomeAnimal: 'Guerreiro do Norte',
      registro: 'BRH-2020-007',
      dataCobertura: '05/09/2020',
      tipoCobertura: 'Inseminação Artificial',
      garanhao: 'Estância Santa Maria',
      situacaoGestacional: 'Confirmada',
      dataConfirmacao: '05/09/2020',
      nascimento: '05/09/2020',
      geneticaUtilizada: 'Sêmen Fresco',
      observacoes: 'Monitoramento em andamento',
      imageUrl: 'https://images.unsplash.com/photo-1656964353220-99aa5acc47e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHN0YWxsaW9ufGVufDF8fHx8MTc2NDE2MjgxOHww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: '008',
      nomeAnimal: 'Coração do Vale',
      registro: 'BRH-2020-008',
      dataCobertura: '12/10/2020',
      tipoCobertura: 'Inseminação Natural',
      garanhao: 'Fazenda Ouro Verde',
      situacaoGestacional: 'Sucesso',
      dataConfirmacao: '12/10/2020',
      nascimento: '12/10/2020',
      geneticaUtilizada: 'Sêmen Fresco',
      observacoes: 'Obtenção de dados em breve',
      imageUrl: 'https://images.unsplash.com/photo-1653832276650-0e7f0584f9ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJlJTIwaG9yc2UlMjBncmF6aW5nfGVufDF8fHx8MTc2NDE2MjgxOXww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: '009',
      nomeAnimal: 'Princesa do Mar',
      registro: 'BRH-2020-009',
      dataCobertura: '18/11/2020',
      tipoCobertura: 'Inseminação Artificial',
      garanhao: 'Recanto dos Peixes',
      situacaoGestacional: 'Pendente',
      dataConfirmacao: '18/11/2020',
      nascimento: '18/11/2020',
      geneticaUtilizada: 'Sêmen Congelado',
      observacoes: 'Aguardando teste de gravidez',
      imageUrl: 'https://images.unsplash.com/photo-1748212548716-e94468ebc70e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3JzZSUyMHJ1bm5pbmclMjBmaWVsZHxlbnwxfHx8fDE3NjQxMDQxMjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: '010',
      nomeAnimal: 'Luz da Manhã',
      registro: 'BRH-2020-010',
      dataCobertura: '25/12/2020',
      tipoCobertura: 'Inseminação Artificial',
      garanhao: 'Chácara da Esperança',
      situacaoGestacional: 'Confirmada',
      dataConfirmacao: '25/12/2020',
      nascimento: '25/12/2020',
      geneticaUtilizada: 'Sêmen Refrigerado',
      observacoes: 'Próxima consulta em fevereiro',
      imageUrl: 'https://images.unsplash.com/photo-1587778907607-d36fc21ac297?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMGhvcnNlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY0MTAwMTI4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: '011',
      nomeAnimal: 'Cavalo da Liberdade',
      registro: 'BRH-2021-011',
      dataCobertura: '02/01/2021',
      tipoCobertura: 'Inseminação Artificial',
      garanhao: 'Sítio do Sol',
      situacaoGestacional: 'Pendente',
      dataConfirmacao: '02/01/2021',
      nascimento: '02/01/2021',
      geneticaUtilizada: 'Sêmen Congelado',
      observacoes: 'Aguardando resultados',
      imageUrl: 'https://images.unsplash.com/photo-1656964353220-99aa5acc47e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHN0YWxsaW9ufGVufDF8fHx8MTc2NDE2MjgxOHww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: '012',
      nomeAnimal: 'Fortaleza do Norte',
      registro: 'BRH-2021-012',
      dataCobertura: '15/02/2021',
      tipoCobertura: 'Inseminação Natural',
      garanhao: 'Fazenda Estrela',
      situacaoGestacional: 'Sucesso',
      dataConfirmacao: '15/02/2021',
      nascimento: '15/02/2021',
      geneticaUtilizada: 'Sêmen Fresco',
      observacoes: 'Gestação esperada',
      imageUrl: 'https://images.unsplash.com/photo-1653832276650-0e7f0584f9ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJlJTIwaG9yc2UlMjBncmF6aW5nfGVufDF8fHx8MTc2NDE2MjgxOXww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: '013',
      nomeAnimal: 'Sombra da Árvore',
      registro: 'BRH-2021-013',
      dataCobertura: '28/03/2021',
      tipoCobertura: 'Inseminação Artificial',
      garanhao: 'Chácara do Lago',
      situacaoGestacional: 'Confirmada',
      dataConfirmacao: '28/03/2021',
      nascimento: '28/03/2021',
      geneticaUtilizada: 'Sêmen Refrigerado',
      observacoes: 'Preparação para parto',
      imageUrl: 'https://images.unsplash.com/photo-1748212548716-e94468ebc70e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3JzZSUyMHJ1bm5pbmclMjBmaWVsZHxlbnwxfHx8fDE3NjQxMDQxMjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: '014',
      nomeAnimal: 'Gato do Sol',
      registro: 'BRH-2021-014',
      dataCobertura: '14/04/2021',
      tipoCobertura: 'Inseminação Artificial',
      garanhao: 'Fazenda do Pôr do Sol',
      situacaoGestacional: 'Pendente',
      dataConfirmacao: '14/04/2021',
      nascimento: '14/04/2021',
      geneticaUtilizada: 'Sêmen Congelado',
      observacoes: 'Aguardando resultados',
      imageUrl: 'https://images.unsplash.com/photo-1587778907607-d36fc21ac297?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMGhvcnNlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY0MTAwMTI4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmada':
        return 'bg-emerald-500 text-white';
      case 'sucesso':
        return 'bg-blue-500 text-white';
      case 'pendente':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const handleViewDetails = (coverage: Coverage) => {
    setSelectedCoverage(coverage);
    setCurrentScreen('details');
  };

  const handleEdit = (coverage: Coverage) => {
    setSelectedCoverage(coverage);
    setShowEditModal(true);
  };

  const handleAdd = () => {
    setShowAddModal(true);
  };

  const handleBack = () => {
    setCurrentScreen('list');
    setSelectedCoverage(null);
  };

  // Render different screens for Coverage tab
  if (activeTab === 'coverage') {
    if (currentScreen === 'details' && selectedCoverage) {
      return (
        <div className="space-y-6">
          {/* Tabs - Desktop */}
          <div className="hidden md:flex gap-2 border-b border-border dark:border-[rgba(255,255,255,0.1)] overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-foreground dark:text-white border-b-2 border-primary dark:border-white'
                      : 'text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
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
          
          <DetailsScreen coverage={selectedCoverage} onBack={handleBack} getStatusColor={getStatusColor} />
        </div>
      );
    }
  }

  // Render Ovules tab content
  if (activeTab === 'ovules') {
    return (
      <div className="space-y-6">
        {/* Tabs - Desktop */}
        <div className="hidden md:flex gap-2 border-b border-border dark:border-[rgba(255,255,255,0.1)] overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-foreground dark:text-white border-b-2 border-primary dark:border-white'
                    : 'text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
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
        
        <AdvisorOvulesContent />
      </div>
    );
  }

  // Render Embryos tab content
  if (activeTab === 'embryos') {
    return (
      <div className="space-y-6">
        {/* Tabs - Desktop */}
        <div className="hidden md:flex gap-2 border-b border-border dark:border-[rgba(255,255,255,0.1)] overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-foreground dark:text-white border-b-2 border-primary dark:border-white'
                    : 'text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
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
        
        <AdvisorEmbryosContent />
      </div>
    );
  }

  // Render Pregnancies tab content
  if (activeTab === 'pregnancies') {
    return (
      <div className="space-y-6">
        {/* Tabs - Desktop */}
        <div className="hidden md:flex gap-2 border-b border-border dark:border-[rgba(255,255,255,0.1)] overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-foreground dark:text-white border-b-2 border-primary dark:border-white'
                    : 'text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
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
        
        <AdvisorPregnanciesContent />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs - Desktop */}
      <div className="hidden md:flex gap-2 border-b border-border dark:border-[rgba(255,255,255,0.1)] overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-foreground dark:text-white border-b-2 border-primary dark:border-white'
                  : 'text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
            </button>
          );
        })}
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

      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
          <input
            type="text"
            placeholder="Buscar por égua, garanhão..."
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
            value={selectedTipo}
            onChange={(e) => setSelectedTipo(e.target.value)}
            className="w-full"
          >
            <option value="">Tipo de cobertura</option>
            <option value="ia">Inseminação Artificial</option>
            <option value="mn">Monta Natural</option>
            <option value="te">Transferência de Embrião</option>
          </NativeSelect>

          <NativeSelect
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full"
          >
            <option value="">Status</option>
            <option value="confirmada">Confirmada</option>
            <option value="pendente">Pendente</option>
            <option value="sucesso">Sucesso</option>
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
        <CoberturaListView 
          coverages={coverages} 
          getStatusColor={getStatusColor}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
        />
      ) : (
        <CoberturaCardView 
          coverages={coverages} 
          getStatusColor={getStatusColor}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
        />
      )}

      {/* Modals */}
      {showAddModal && (
        <AddCoverageModal 
          onClose={() => setShowAddModal(false)}
          onSave={(data) => {
            console.log('Nova cobertura:', data);
            setShowAddModal(false);
          }}
        />
      )}

      {showEditModal && selectedCoverage && (
        <EditCoverageModal 
          coverage={selectedCoverage}
          onClose={() => setShowEditModal(false)}
          onSave={(data) => {
            console.log('Cobertura atualizada:', data);
            setShowEditModal(false);
          }}
        />
      )}
    </div>
  );
}

function CoberturaListView({ 
  coverages, 
  getStatusColor,
  onViewDetails,
  onEdit
}: { 
  coverages: Coverage[], 
  getStatusColor: (status: string) => string,
  onViewDetails: (coverage: Coverage) => void,
  onEdit: (coverage: Coverage) => void
}) {
  return (
    <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted dark:bg-[#0d0d0d]">
            <tr>
              <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Nº</th>
              <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Nome do Animal</th>
              <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Data da Cobertura</th>
              <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Tipo de Cobertura</th>
              <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Garanhão</th>
              <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Situação Gestacional</th>
              <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Data Confirmação</th>
              <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Nascimento</th>
              <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Genética Utilizada</th>
              <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Observações</th>
              <th className="text-center px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border dark:divide-[rgba(255,255,255,0.1)]">
            {coverages.map((coverage) => (
              <tr key={coverage.id} className="hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors">
                <td className="px-6 py-4 text-foreground dark:text-white">{coverage.id}</td>
                <td className="px-6 py-4 text-foreground dark:text-white">{coverage.nomeAnimal}</td>
                <td className="px-6 py-4 text-foreground dark:text-white">{coverage.dataCobertura}</td>
                <td className="px-6 py-4 text-foreground dark:text-white">{coverage.tipoCobertura}</td>
                <td className="px-6 py-4 text-foreground dark:text-white">{coverage.garanhao}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-md text-xs ${getStatusColor(coverage.situacaoGestacional)}`}>
                    {coverage.situacaoGestacional}
                  </span>
                </td>
                <td className="px-6 py-4 text-foreground dark:text-white">{coverage.dataConfirmacao}</td>
                <td className="px-6 py-4 text-foreground dark:text-white">{coverage.nascimento}</td>
                <td className="px-6 py-4 text-foreground dark:text-white">{coverage.geneticaUtilizada}</td>
                <td className="px-6 py-4 text-muted-foreground dark:text-[#99a1af] max-w-[200px] truncate" title={coverage.observacoes}>
                  {coverage.observacoes}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => onViewDetails(coverage)}
                      className="p-2 hover:bg-muted dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
                      title="Ver detalhes"
                    >
                      <Eye className="w-4 h-4 text-foreground dark:text-white" />
                    </button>
                    <button 
                      onClick={() => onEdit(coverage)}
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

function CoberturaCardView({ 
  coverages, 
  getStatusColor,
  onViewDetails,
  onEdit
}: { 
  coverages: Coverage[], 
  getStatusColor: (status: string) => string,
  onViewDetails: (coverage: Coverage) => void,
  onEdit: (coverage: Coverage) => void
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});

  const handlePrevImage = (coverageId: string) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [coverageId]: (prev[coverageId] || 0) - 1
    }));
  };

  const handleNextImage = (coverageId: string) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [coverageId]: (prev[coverageId] || 0) + 1
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {coverages.map((coverage) => (
        <div
          key={coverage.id}
          className="bg-card dark:bg-[#1a1a1a] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-2xl overflow-hidden hover:border-primary dark:hover:border-white transition-colors"
        >
          {/* Image */}
          <div className="relative h-64 bg-muted dark:bg-[#0d0d0d]">
            {coverage.imageUrl ? (
              <>
                <ImageWithFallback 
                  src={coverage.imageUrl}
                  alt={coverage.nomeAnimal}
                  className="w-full h-full object-cover"
                />
                {/* Navigation Arrows */}
                <button 
                  onClick={() => handlePrevImage(coverage.id)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#3a3a3a]/80 hover:bg-[#3a3a3a] rounded-full flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button 
                  onClick={() => handleNextImage(coverage.id)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#3a3a3a]/80 hover:bg-[#3a3a3a] rounded-full flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground dark:text-[#99a1af]">
                <Heart className="w-16 h-16 opacity-20" />
              </div>
            )}

            {/* Status Badge */}
            <div className={`absolute top-4 right-4 px-3 py-1 rounded-md text-xs ${getStatusColor(coverage.situacaoGestacional)}`}>
              {coverage.situacaoGestacional}
            </div>

            {/* Edit Button - Positioned on image */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(coverage);
              }}
              className="absolute top-4 left-4 p-2 bg-primary dark:bg-white text-white dark:text-black rounded-full hover:opacity-90 transition-opacity"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 bg-muted dark:bg-[#1a1a1a]">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg text-foreground dark:text-white mb-1">{coverage.nomeAnimal}</h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div>
                <p className="text-muted-foreground dark:text-[#6b6b6b] text-xs mb-1">Registro</p>
                <p className="text-foreground dark:text-white">{coverage.registro}</p>
              </div>
              <div>
                <p className="text-muted-foreground dark:text-[#6b6b6b] text-xs mb-1">Data da cobertura</p>
                <p className="text-foreground dark:text-white">{coverage.dataCobertura}</p>
              </div>
            </div>

            {/* Actions */}
            <button 
              onClick={() => onViewDetails(coverage)}
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
  coverage, 
  onBack,
  getStatusColor
}: { 
  coverage: Coverage, 
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
            Cobertura
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
        <h2 className="text-2xl text-foreground dark:text-white mb-1">{coverage.nomeAnimal}</h2>
        <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Cobertura</p>
      </div>

      {/* Image */}
      <div className="relative h-[600px] bg-muted dark:bg-[#1a1a1a] rounded-2xl overflow-hidden">
        {coverage.imageUrl ? (
          <>
            <ImageWithFallback 
              src={coverage.imageUrl}
              alt={coverage.nomeAnimal}
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
            <div className={`absolute top-6 right-6 px-3 py-1 rounded-md text-xs ${getStatusColor(coverage.situacaoGestacional)}`}>
              {coverage.situacaoGestacional}
            </div>
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
            <DetailField label="Nome do Animal" value={coverage.nomeAnimal} />
            <DetailField label="Data da Cobertura" value={coverage.dataCobertura} />
            <DetailField label="Tipo de Cobertura" value={coverage.tipoCobertura} />
            <DetailField label="Situação Gestacional" value={coverage.situacaoGestacional} />
            <DetailField label="Genética Utilizada" value={coverage.geneticaUtilizada} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <DetailField label="Registro" value={coverage.registro} />
            <DetailField label="Garanhão" value={coverage.garanhao} />
            <DetailField label="Data Confirmação" value={coverage.dataConfirmacao} />
            <DetailField label="Nascimento" value={coverage.nascimento} />
            <DetailField label="Observações" value={coverage.observacoes} />
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

// Edit Screen
function EditScreen({ 
  coverage, 
  onBack
}: { 
  coverage: Coverage, 
  onBack: () => void
}) {
  const [formData, setFormData] = useState(coverage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Cobertura atualizada com sucesso!');
    onBack();
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb and Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <button onClick={onBack} className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white transition-colors">
            Cobertura
          </button>
          <span className="text-muted-foreground dark:text-[#99a1af]">/</span>
          <span className="text-foreground dark:text-white">Editar</span>
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
        <h2 className="text-2xl text-foreground dark:text-white mb-1">Editar Cobertura</h2>
        <p className="text-sm text-muted-foreground dark:text-[#99a1af]">{coverage.nomeAnimal}</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {/* Left Column */}
            <div className="space-y-6">
              <FormField 
                label="Nome do Animal" 
                value={formData.nomeAnimal}
                onChange={(value) => setFormData({ ...formData, nomeAnimal: value })}
                required
              />
              <FormField 
                label="Data da Cobertura" 
                value={formData.dataCobertura}
                onChange={(value) => setFormData({ ...formData, dataCobertura: value })}
                required
              />
              <FormField 
                label="Tipo de Cobertura" 
                value={formData.tipoCobertura}
                onChange={(value) => setFormData({ ...formData, tipoCobertura: value })}
                required
              />
              <FormField 
                label="Situação Gestacional" 
                value={formData.situacaoGestacional}
                onChange={(value) => setFormData({ ...formData, situacaoGestacional: value })}
                required
              />
              <FormField 
                label="Genética Utilizada" 
                value={formData.geneticaUtilizada}
                onChange={(value) => setFormData({ ...formData, geneticaUtilizada: value })}
                required
              />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <FormField 
                label="Registro" 
                value={formData.registro}
                onChange={(value) => setFormData({ ...formData, registro: value })}
                required
              />
              <FormField 
                label="Garanhão" 
                value={formData.garanhao}
                onChange={(value) => setFormData({ ...formData, garanhao: value })}
                required
              />
              <FormField 
                label="Data Confirmação" 
                value={formData.dataConfirmacao}
                onChange={(value) => setFormData({ ...formData, dataConfirmacao: value })}
                required
              />
              <FormField 
                label="Nascimento" 
                value={formData.nascimento}
                onChange={(value) => setFormData({ ...formData, nascimento: value })}
              />
              <FormField 
                label="Observações" 
                value={formData.observacoes}
                onChange={(value) => setFormData({ ...formData, observacoes: value })}
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
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
}

// Add Screen
function AddScreen({ onBack }: { onBack: () => void }) {
  const [formData, setFormData] = useState<Partial<Coverage>>({
    nomeAnimal: '',
    registro: '',
    dataCobertura: '',
    tipoCobertura: '',
    garanhao: '',
    situacaoGestacional: '',
    dataConfirmacao: '',
    nascimento: '',
    geneticaUtilizada: '',
    observacoes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Cobertura cadastrada com sucesso!');
    onBack();
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb and Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <button onClick={onBack} className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white transition-colors">
            Cobertura
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
        <h2 className="text-2xl text-foreground dark:text-white mb-1">Cadastrar Nova Cobertura</h2>
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
                placeholder="Ex: Dama da Pavibra"
                required
              />
              <FormField 
                label="Data da Cobertura" 
                value={formData.dataCobertura || ''}
                onChange={(value) => setFormData({ ...formData, dataCobertura: value })}
                placeholder="DD/MM/AAAA"
                required
              />
              <FormField 
                label="Tipo de Cobertura" 
                value={formData.tipoCobertura || ''}
                onChange={(value) => setFormData({ ...formData, tipoCobertura: value })}
                placeholder="Ex: Inseminação Artificial"
                required
              />
              <FormField 
                label="Situação Gestacional" 
                value={formData.situacaoGestacional || ''}
                onChange={(value) => setFormData({ ...formData, situacaoGestacional: value })}
                placeholder="Ex: Confirmada"
                required
              />
              <FormField 
                label="Genética Utilizada" 
                value={formData.geneticaUtilizada || ''}
                onChange={(value) => setFormData({ ...formData, geneticaUtilizada: value })}
                placeholder="Ex: Sêmen Refrigerado"
                required
              />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <FormField 
                label="Registro" 
                value={formData.registro || ''}
                onChange={(value) => setFormData({ ...formData, registro: value })}
                placeholder="Ex: BRH-2020-001"
                required
              />
              <FormField 
                label="Garanhão" 
                value={formData.garanhao || ''}
                onChange={(value) => setFormData({ ...formData, garanhao: value })}
                placeholder="Ex: Rei da Serra"
                required
              />
              <FormField 
                label="Data Confirmação" 
                value={formData.dataConfirmacao || ''}
                onChange={(value) => setFormData({ ...formData, dataConfirmacao: value })}
                placeholder="DD/MM/AAAA"
                required
              />
              <FormField 
                label="Nascimento" 
                value={formData.nascimento || ''}
                onChange={(value) => setFormData({ ...formData, nascimento: value })}
                placeholder="DD/MM/AAAA"
              />
              <FormField 
                label="Observações" 
                value={formData.observacoes || ''}
                onChange={(value) => setFormData({ ...formData, observacoes: value })}
                placeholder="Adicione observações relevantes"
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