
import { Search, Filter, Grid, List, Plus, Upload, Users, Eye, AlertTriangle, Info, FileUp, Edit, ChevronLeft, ChevronRight, GitBranch, Baby, Award, Video, Trash2, User } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { NativeSelect } from '../ui/native-select';
import { BreederCadastrarAnimal } from './BreederCadastrarAnimal';
import { BreederAnimalDetails } from './BreederAnimalDetails';
import { BreederEditarAnimal } from './BreederEditarAnimal';
import { QuickGenealogyModal } from './QuickGenealogyModal';
import { AnimalCard } from './AnimalCard';
import { AdvancedFiltersModal } from './AdvancedFiltersModal';
import { useAnimals, useDeleteAnimal } from '@/hooks/useAnimals';
import { useUser } from '@/contexts/UserContext';
import { animalsService } from '@/services/animals';
import { getAnimalStatusLabel, getDisplayCategoryLabel, getPlantelStatusActivity, isManualCastradoCategory, resolveManagedCategory } from '@/lib/animal-classification';
import { toast } from 'sonner';
import type { AnimalEnvironment } from '@/types';

// Função auxiliar para formatar data de nascimento
function formatBirthDate(isoDate: string): string {
  if (!isoDate) return '-';
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

// Função auxiliar para obter classes de cor baseado no status
function getStatusColorClasses(status: string): string {
  const s = status?.toLowerCase() || '';
  if (s === 'ativo') return 'bg-green-500 dark:bg-gray-600 text-white dark:text-gray-200';
  if (s === 'em_servico' || s === 'em serviço') return 'bg-orange-500 dark:bg-gray-600 text-white dark:text-gray-200';
  if (s === 'provisorio' || s === 'provisório') return 'bg-cyan-500 dark:bg-gray-600 text-white dark:text-gray-200';
  if (s === 'gestante') return 'bg-pink-500 dark:bg-gray-600 text-white dark:text-gray-200';
  if (s === 'em cobertura') return 'bg-blue-500 dark:bg-gray-600 text-white dark:text-gray-200';
  if (s === 'em crescimento' || s === 'potro' || s === 'potra') return 'bg-yellow-500 dark:bg-gray-600 text-white dark:text-gray-200';
  if (s === 'vendido') return 'bg-red-500 dark:bg-gray-600 text-white dark:text-gray-200';
  if (s === 'morto' || s === 'óbito' || s === 'falecido') return 'bg-gray-800 dark:bg-gray-600 text-white dark:text-gray-200';
  if (s === 'transferido') return 'bg-slate-500 dark:bg-gray-600 text-white dark:text-gray-200';
  return 'bg-gray-500 dark:bg-gray-600 text-white dark:text-gray-200';
}

function calculateAge(birthDate?: string): string {
  if (!birthDate) return '-';
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  if (age === 0) {
    // Menos de 1 ano, mostrar meses?
    const months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
    return `${months} meses`;
  }
  return `${age} anos`;
}

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function resolveDisplayCategory(birthDate: string | undefined, sex: 'Macho' | 'Fêmea' | undefined, fallback: string): string {
  if (isManualCastradoCategory(fallback)) return getDisplayCategoryLabel('castrado');
  return getDisplayCategoryLabel(resolveManagedCategory(sex, birthDate, fallback) || fallback);
}

// Interface local para a UI (compatível com AnimalCard)
interface PlantelAnimal {
  id: string | number;
  abccmm_rowid?: string | null;
  haras_id?: string;
  name: string;
  registry: string;
  chip?: string;
  sex?: 'Macho' | 'Fêmea';
  birthDate?: string;
  birth_date?: string;
  father_id?: string | null;
  mother_id?: string | null;
  harasOrigem?: string;
  origin_haras?: string;
  category: string;
  age: string;
  haras: string;
  status: string;
  statusColor: string;
  // NOVOS CAMPOS: Gestão de Status no Plantel
  statusAtividade: 'Ativo' | 'Inativo';
  motivoInativacao?: string;
  dataInativacao?: string;
  localizacao?: string;
  location?: string;
  status_manejo?: string;
  management_status?: string;
  servicoTipo?: string;
  service_type?: string;
  filhos?: number;
  premiacoes?: number;
  image: string;
  images: string[];
  imageCaptions?: string[];
  documents?: string[];
  coat_color?: string;
  pelagem?: string;
  gait?: string;
  father_name?: string;
  mother_name?: string;
  criador?: string | null;
  proprietario?: string | null;
  observations?: string;
  weight?: number;
  height?: number;
  environment?: AnimalEnvironment;
  // Campos de Reprodução
  reproductionType?: string;
  activeForReproduction?: boolean;
}

export function BreederPlantelContent() {
  const [activeEnvironment, setActiveEnvironment] = useState<AnimalEnvironment>('oficial');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAnimalDetails, setShowAnimalDetails] = useState(false);
  const [showEditarAnimal, setShowEditarAnimal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showCadastrarAnimal, setShowCadastrarAnimal] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<PlantelAnimal | null>(null);
  const [initialTab, setInitialTab] = useState<string>('overview');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [animalToDelete, setAnimalToDelete] = useState<PlantelAnimal | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Estados dos filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSexo, setFilterSexo] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('ativos');
  const [filterCategoria, setFilterCategoria] = useState('todos');
  const [filterIdade, setFilterIdade] = useState('todos');
  const [filterFilhos, setFilterFilhos] = useState('todos');
  const [filterPremiacoes, setFilterPremiacoes] = useState('todos');

  const { stableHarasId, isLoading: isUserLoading, isSessionReady } = useUser();
  const harasId = isSessionReady ? stableHarasId || undefined : undefined;

  // Hook de Animais
  const { data: animalsData, isLoading, refetch } = useAnimals(
    { haras_id: harasId, environment: activeEnvironment },
    { page: 1, limit: 1000 }, // Buscando 1000 para permitir filtro client-side de idade/filhos
    !!harasId && isSessionReady && !isUserLoading
  );

  const {
    data: linkQueueItems = [],
    isLoading: isLinkQueueLoading,
    refetch: refetchLinkQueue,
  } = useQuery({
    queryKey: ['animal-link-queue', harasId],
    queryFn: () => animalsService.listLinkQueue(harasId || ''),
    enabled: !!harasId && activeEnvironment === 'vinculacao',
  });

  const isHarasLoading = !harasId && (isUserLoading || !isSessionReady);

  const { mutateAsync: deleteAnimal } = useDeleteAnimal();

  // Mapeamento dos dados da API para o formato da UI
  const animalsList: PlantelAnimal[] = useMemo(() => {
    if (!animalsData?.data) return [];

    return animalsData.data.map(animal => {
      const realImages = (animal.images || []).filter((url) => !!url);
      const fallbackMain = animal.main_image_url
        ? animal.main_image_url
        : undefined;
      const normalizedImages = fallbackMain && !realImages.includes(fallbackMain)
        ? [fallbackMain, ...realImages]
        : realImages;

      const status = animal.status || 'Ativo';

      return {
        id: animal.id, // Agora string, AnimalCard atualizado aceita string | number
        abccmm_rowid: animal.abccmm_rowid || null,
        haras_id: animal.haras_id,
        name: animal.name,
        registry: animal.registry_number || '-',
        chip: animal.chip_number || undefined,
        sex: animal.sex,
        birthDate: animal.birth_date || (animal as any).data_nascimento || undefined,
        birth_date: animal.birth_date || (animal as any).data_nascimento || undefined,
        father_id: animal.father_id || (animal as any).pai_id || null,
        mother_id: animal.mother_id || (animal as any).mae_id || null,
        harasOrigem: animal.origin_haras || undefined,
        origin_haras: animal.origin_haras || (animal as any).haras_origem || undefined,
        category: resolveDisplayCategory(animal.birth_date || undefined, animal.sex, animal.category),
        age: calculateAge(animal.birth_date || undefined),
        haras: 'Meu Haras', // Poderíamos buscar o nome do haras se necessário
        status: getAnimalStatusLabel(status),
        statusColor: getStatusColorClasses(status),
        statusAtividade: getPlantelStatusActivity(status),
        localizacao: animal.location || (animal as any).localizacao || undefined,
        location: animal.location || (animal as any).localizacao || undefined,
        status_manejo: (animal as any).status_manejo || (animal as any).management_status || undefined,
        management_status: (animal as any).management_status || (animal as any).status_manejo || undefined,
        servicoTipo: (animal as any).service_type || (animal as any).tipo_servico || undefined,
        service_type: (animal as any).service_type || (animal as any).tipo_servico || undefined,
        coat_color: animal.coat_color || (animal as any).pelagem || undefined,
        pelagem: animal.coat_color || (animal as any).pelagem || undefined,
        gait: (animal as any).gait || (animal as any).andamento || undefined,
        father_name: animal.father_name || undefined,
        mother_name: animal.mother_name || undefined,
        criador: animal.criador || null,
        proprietario: animal.proprietario || null,
        observations: animal.observations || (animal as any).observacoes || undefined,
        weight: animal.weight || undefined,
        height: animal.height || undefined,
        filhos: 0, // TODO: Buscar count de filhos via API ou include
        premiacoes: 0, // TODO: Buscar count de premiações
         image: fallbackMain || normalizedImages[0] || '',
         images: normalizedImages,
         documents: animal.documents || [],
         environment: (animal as any).environment || ((animal as any).abccmm_rowid ? 'oficial' : 'avulsos'),
      };
    });
  }, [animalsData]);

  // Lógica de filtros
  const filteredAnimals = useMemo(() => {
    return animalsList.filter((animal) => {
      // Busca
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' ||
        animal.name.toLowerCase().includes(searchLower) ||
        animal.registry.toLowerCase().includes(searchLower) ||
        (animal.chip && animal.chip.toLowerCase().includes(searchLower)) ||
        animal.haras.toLowerCase().includes(searchLower);

      // Sexo
      const matchesSexo = filterSexo === 'todos' ||
        (filterSexo === 'machos' && animal.sex === 'Macho') ||
        (filterSexo === 'femeas' && animal.sex === 'Fêmea');

      // Status
      const matchesStatus = filterStatus === 'todos' ||
        (filterStatus === 'ativos' && animal.statusAtividade === 'Ativo') ||
        (filterStatus === 'inativos' && animal.statusAtividade === 'Inativo');

      // Categoria
      const matchesCategoria = filterCategoria === 'todos' ||
        normalizeText(animal.category).includes(normalizeText(filterCategoria));

      // Idade
      let matchesIdade = true;
      if (filterIdade !== 'todos' && animal.birthDate) {
        const birthYear = parseInt(animal.birthDate.split('-')[0]);
        const currentYear = new Date().getFullYear();
        const age = currentYear - birthYear;

        if (filterIdade === 'menos_1') matchesIdade = age < 1;
        else if (filterIdade === '1_3') matchesIdade = age >= 1 && age <= 3;
        else if (filterIdade === '3_5') matchesIdade = age >= 3 && age <= 5;
        else if (filterIdade === 'mais_5') matchesIdade = age > 5;
      }

      // Filhos & Premiações (TODO: conectar dados reais)
      let matchesFilhos = true;
      if (filterFilhos === 'com_filhos') matchesFilhos = (animal.filhos || 0) > 0;
      else if (filterFilhos === 'sem_filhos') matchesFilhos = (animal.filhos || 0) === 0;

      let matchesPremiacoes = true;
      if (filterPremiacoes === 'com_premiacoes') matchesPremiacoes = (animal.premiacoes || 0) > 0;
      else if (filterPremiacoes === 'sem_premiacoes') matchesPremiacoes = (animal.premiacoes || 0) === 0;

      return matchesSearch && matchesSexo && matchesStatus && matchesCategoria &&
        matchesIdade && matchesFilhos && matchesPremiacoes;
    }).sort((a, b) => {
      const aHasMedia = (a.images?.length || 0) > 0;
      const bHasMedia = (b.images?.length || 0) > 0;
      if (aHasMedia !== bHasMedia) return aHasMedia ? -1 : 1;
      return a.name.localeCompare(b.name, 'pt-BR');
    });
  }, [animalsList, searchTerm, filterSexo, filterStatus, filterCategoria, filterIdade, filterFilhos, filterPremiacoes]);

  const handleDeleteAnimal = (animal: PlantelAnimal) => {
    setAnimalToDelete(animal);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (animalToDelete) {
      try {
        await deleteAnimal(String(animalToDelete.id)); // Ensure ID is string
        toast.success('Animal excluído com sucesso');
        setShowDeleteModal(false);
        setAnimalToDelete(null);
        refetch(); // Refresh list
      } catch (error) {
        console.error(error);
        toast.error('Erro ao excluir animal');
      }
    }
  };

  const handleLinkQueueItem = async (queueId: string) => {
    try {
      await animalsService.linkQueueItem(queueId);
      toast.success('Vinculação concluída com sucesso.');
      refetch();
      refetchLinkQueue();
    } catch (error) {
      console.error(error);
      toast.error('Falha ao vincular animal.');
    }
  };

  const handleDismissQueueItem = async (queueId: string) => {
    try {
      await animalsService.dismissLinkQueueItem(queueId);
      toast.success('Item removido da fila de vinculação.');
      refetchLinkQueue();
    } catch (error) {
      console.error(error);
      toast.error('Falha ao dispensar item da fila.');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="space-y-6">
      {showCadastrarAnimal ? (
        <BreederCadastrarAnimal onBack={() => { setShowCadastrarAnimal(false); refetch(); }} />
      ) : showAnimalDetails && selectedAnimal ? (
        <BreederAnimalDetails
          key={selectedAnimal.id}
          animal={selectedAnimal as any} // Type assertion needed until Details is fully updated
          onBack={() => {
            setShowAnimalDetails(false);
            setSelectedAnimal(null);
            setInitialTab('overview');
          }}
          onEdit={() => {
            setShowAnimalDetails(false);
            setShowEditarAnimal(true);
          }}
          onViewAnimal={(animalId) => {
            const localAnimal = animalsList.find(a => String(a.id) === String(animalId));
            if (localAnimal) {
              setSelectedAnimal(localAnimal);
              setInitialTab('overview');
              setShowAnimalDetails(true);
              return;
            }

            animalsService.getById(String(animalId))
              .then((fetchedAnimal) => {
                if (!fetchedAnimal) {
                  toast.error('Animal não encontrado.');
                  return;
                }

                const mapped: PlantelAnimal = {
                  id: fetchedAnimal.id,
                  abccmm_rowid: (fetchedAnimal as any).abccmm_rowid || null,
                  haras_id: fetchedAnimal.haras_id,
                  name: fetchedAnimal.name,
                  registry: fetchedAnimal.registry_number || '-',
                  chip: fetchedAnimal.chip_number || undefined,
                  sex: fetchedAnimal.sex,
                  birthDate: fetchedAnimal.birth_date || undefined,
                  birth_date: fetchedAnimal.birth_date || undefined,
                  father_id: fetchedAnimal.father_id || null,
                  mother_id: fetchedAnimal.mother_id || null,
                  harasOrigem: fetchedAnimal.origin_haras || undefined,
                  origin_haras: fetchedAnimal.origin_haras || undefined,
                  category: getDisplayCategoryLabel(resolveManagedCategory(fetchedAnimal.sex, fetchedAnimal.birth_date, fetchedAnimal.category) || fetchedAnimal.category),
                  age: calculateAge(fetchedAnimal.birth_date || undefined),
                  haras: 'Meu Haras',
                  status: getAnimalStatusLabel(fetchedAnimal.status || 'Ativo'),
                  statusColor: getStatusColorClasses(fetchedAnimal.status || 'Ativo'),
                  statusAtividade: getPlantelStatusActivity(fetchedAnimal.status),
                  localizacao: fetchedAnimal.location || undefined,
                  location: fetchedAnimal.location || undefined,
                  status_manejo: (fetchedAnimal as any).status_manejo || (fetchedAnimal as any).management_status || undefined,
                  management_status: (fetchedAnimal as any).management_status || (fetchedAnimal as any).status_manejo || undefined,
                  servicoTipo: (fetchedAnimal as any).service_type || undefined,
                  service_type: (fetchedAnimal as any).service_type || undefined,
                  coat_color: fetchedAnimal.coat_color || undefined,
                  pelagem: fetchedAnimal.coat_color || undefined,
                  gait: (fetchedAnimal as any).gait || undefined,
                  father_name: fetchedAnimal.father_name || undefined,
                  mother_name: fetchedAnimal.mother_name || undefined,
                  criador: fetchedAnimal.criador || null,
                  proprietario: fetchedAnimal.proprietario || null,
                  observations: fetchedAnimal.observations || undefined,
                  weight: fetchedAnimal.weight || undefined,
                  height: fetchedAnimal.height || undefined,
                  filhos: 0,
                  premiacoes: 0,
                  image: fetchedAnimal.main_image_url || fetchedAnimal.images?.[0] || '',
                  images: fetchedAnimal.images || [],
                  documents: fetchedAnimal.documents || [],
                  environment: (fetchedAnimal as any).environment || ((fetchedAnimal as any).abccmm_rowid ? 'oficial' : 'avulsos'),
                };

                setSelectedAnimal(mapped);
                setInitialTab('overview');
                setShowAnimalDetails(true);
              })
              .catch(() => {
                toast.error('Não foi possível abrir esse animal agora.');
              });
          }}
          initialTab={initialTab}
        />
      ) : showEditarAnimal && selectedAnimal ? (
        <BreederEditarAnimal
          animal={selectedAnimal as any}
          onBack={() => {
            setShowEditarAnimal(false);
            setSelectedAnimal(null);
          }}
          onSave={() => {
            refetch();
            setShowEditarAnimal(false);
          }}
        />
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <SummaryCard title="Total" value={isHarasLoading ? '...' : String(animalsList.length)} />
            <SummaryCard title="Machos" value={isHarasLoading ? '...' : String(animalsList.filter(a => a.sex === 'Macho').length)} />
            <SummaryCard title="Fêmeas" value={isHarasLoading ? '...' : String(animalsList.filter(a => a.sex === 'Fêmea').length)} />
            <SummaryCard title="Ativos" value={isHarasLoading ? '...' : String(animalsList.filter(a => a.statusAtividade === 'Ativo').length)} />
          </div>

          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-4 border border-border dark:border-[rgba(255,255,255,0.1)]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                onClick={() => setActiveEnvironment('oficial')}
                className={`h-10 rounded-lg text-sm transition-colors ${activeEnvironment === 'oficial' ? 'bg-primary text-white dark:bg-white dark:text-black' : 'bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white'}`}
              >
                Plantel Oficial
              </button>
              <button
                onClick={() => setActiveEnvironment('avulsos')}
                className={`h-10 rounded-lg text-sm transition-colors ${activeEnvironment === 'avulsos' ? 'bg-primary text-white dark:bg-white dark:text-black' : 'bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white'}`}
              >
                Avulsos
              </button>
              <button
                onClick={() => setActiveEnvironment('vinculacao')}
                className={`h-10 rounded-lg text-sm transition-colors ${activeEnvironment === 'vinculacao' ? 'bg-primary text-white dark:bg-white dark:text-black' : 'bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white'}`}
              >
                Vinculação
              </button>
              <button
                onClick={() => setActiveEnvironment('condominio')}
                className={`h-10 rounded-lg text-sm transition-colors ${activeEnvironment === 'condominio' ? 'bg-primary text-white dark:bg-white dark:text-black' : 'bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white'}`}
              >
                Condomínio
              </button>
            </div>
          </div>

          {/* Actions and Filters */}
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
              <div className="flex flex-col lg:flex-row gap-3 w-full">
                <button
                  className="w-full lg:w-auto px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  onClick={() => setShowImportModal(true)}
                >
                  <Upload className="w-5 h-5" />
                  {activeEnvironment === 'condominio' ? 'Importar Condomínio/Premiações' : 'Importar ABCCMM/Premiações'}
                </button>
                <button
                  className="w-full lg:w-auto px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  onClick={() => setShowCadastrarAnimal(true)}
                >
                  <Plus className="w-5 h-5" />
                  Cadastrar Animal
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-3 mb-6 items-stretch">
              <div className="relative flex-[2]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground dark:text-[#6b6b6b] pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar por nome, registro, chip ou haras..."
                  className="w-full h-12 pl-10 pr-4 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full md:w-48">
                <NativeSelect
                  value={filterSexo}
                  onChange={(e) => setFilterSexo(e.target.value)}
                >
                  <option value="todos">Todos os Sexos</option>
                  <option value="machos">Machos</option>
                  <option value="femeas">Fêmeas</option>
                </NativeSelect>
              </div>
              <div className="w-full md:w-48">
                <NativeSelect
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="todos">Status no Plantel</option>
                  <option value="ativos">Ativos</option>
                  <option value="inativos">Inativos</option>
                </NativeSelect>
              </div>
              <button
                onClick={() => setShowAdvancedFilters(true)}
                className="w-full md:w-auto h-12 px-4 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] text-foreground dark:text-white rounded-xl hover:bg-accent dark:hover:bg-[#2a2a2a] transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Filter className="w-4 h-4 flex-shrink-0" />
                Filtros Avançados
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 h-12 rounded-xl transition-colors ${viewMode === 'grid'
                    ? 'bg-primary dark:bg-white text-white dark:text-black'
                    : 'bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white border border-border dark:border-[#3a3a3a]'
                    }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 h-12 rounded-xl transition-colors ${viewMode === 'list'
                    ? 'bg-primary dark:bg-white text-white dark:text-black'
                    : 'bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white border border-border dark:border-[#3a3a3a]'
                    }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Animals Grid/List */}
            {activeEnvironment === 'vinculacao' ? (
              <div className="space-y-3">
                {isLinkQueueLoading ? (
                  <div className="p-6 text-sm text-muted-foreground">Carregando fila de vinculação...</div>
                ) : linkQueueItems.length === 0 ? (
                  <div className="p-6 text-sm text-muted-foreground">Nenhum item pendente na fila de vinculação.</div>
                ) : linkQueueItems.map((item) => (
                  <div key={item.id} className="p-4 bg-muted dark:bg-[#0d0d0d] rounded-xl border border-border dark:border-[#3a3a3a]">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <p className="text-foreground dark:text-white text-sm">
                          Provisório: <span className="font-semibold">{item.provisional_animal?.name || '-'}</span>
                          {item.provisional_animal?.registry_number ? ` (${item.provisional_animal.registry_number})` : ''}
                        </p>
                        <p className="text-foreground dark:text-white text-sm">
                          Oficial sugerido: <span className="font-semibold">{item.official_animal?.name || '-'}</span>
                          {item.official_registry ? ` (${item.official_registry})` : ''}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Match: {item.match_type} | Confiança: {item.confidence ?? 0}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleLinkQueueItem(item.id)}
                          className="px-4 py-2 rounded-lg bg-primary dark:bg-white text-white dark:text-black hover:opacity-90"
                        >
                          Vincular
                        </button>
                        <button
                          onClick={() => handleDismissQueueItem(item.id)}
                          className="px-4 py-2 rounded-lg bg-muted border border-border dark:border-[#3a3a3a] text-foreground dark:text-white hover:bg-accent dark:hover:bg-[#2a2a2a]"
                        >
                          Dispensar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredAnimals.map((animal) => (
                  <AnimalCard
                    key={animal.id}
                    animal={animal as any}
                    onClick={() => {
                      setSelectedAnimal(animal);
                      setInitialTab('overview');
                      setShowAnimalDetails(true);
                    }}
                    onEdit={() => {
                      setSelectedAnimal(animal);
                      setShowEditarAnimal(true);
                    }}
                    onViewGenealogy={() => {
                      setSelectedAnimal(animal);
                      setInitialTab('genealogy');
                      setShowAnimalDetails(true);
                    }}
                    onViewVideo={() => {
                      setSelectedAnimal(animal);
                      setInitialTab('videos');
                      setShowAnimalDetails(true);
                    }}
                    onDelete={() => handleDeleteAnimal(animal)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredAnimals.map((animal) => (
                  <AnimalListItem
                    key={animal.id}
                    animal={animal}
                    onClick={() => {
                      setSelectedAnimal(animal);
                      setInitialTab('overview');
                      setShowAnimalDetails(true);
                    }}
                    onEdit={() => {
                      setSelectedAnimal(animal);
                      setShowEditarAnimal(true);
                    }}
                    onViewGenealogy={() => {
                      setSelectedAnimal(animal);
                      setInitialTab('genealogy');
                      setShowAnimalDetails(true);
                    }}
                    onViewVideo={() => {
                      setSelectedAnimal(animal);
                      setInitialTab('videos');
                      setShowAnimalDetails(true);
                    }}
                    onDelete={() => handleDeleteAnimal(animal)}
                  />
                ))}
              </div>
            )}

            {filteredAnimals.length === 0 && (
              <div className="flex flex-col items-center justify-center p-10 text-muted-foreground">
                <p>{isHarasLoading ? 'Carregando dados do haras...' : 'Nenhum animal encontrado.'}</p>
              </div>
            )}
          </div>

          {/* Import Modal */}
          {showImportModal && (
            <ImportModal
              onClose={() => setShowImportModal(false)}
              harasId={harasId}
              environment={activeEnvironment}
              onSuccess={() => { refetch(); refetchLinkQueue(); }}
            />
          )}

          {/* Advanced Filters Modal */}
          {showAdvancedFilters && (
            <AdvancedFiltersModal
              onClose={() => setShowAdvancedFilters(false)}
              filterCategoria={filterCategoria}
              setFilterCategoria={setFilterCategoria}
              filterIdade={filterIdade}
              setFilterIdade={setFilterIdade}
              filterFilhos={filterFilhos}
              setFilterFilhos={setFilterFilhos}
              filterPremiacoes={filterPremiacoes}
              setFilterPremiacoes={setFilterPremiacoes}
            />
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && animalToDelete && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 max-w-md w-full border border-border dark:border-[rgba(255,255,255,0.1)]">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg text-foreground dark:text-white mb-2">Confirmar Exclusão</h3>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                      Tem certeza que deseja excluir o animal <span className="font-semibold text-foreground dark:text-white">{animalToDelete.name}</span>?
                    </p>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-2">
                      Esta ação não pode ser desfeita.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setAnimalToDelete(null);
                    }}
                    className="flex-1 px-4 py-2 bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white rounded-lg hover:bg-accent dark:hover:bg-[#2a2a2a] transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function SummaryCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
      <p className="text-muted-foreground dark:text-[#99a1af] mb-2">{title}</p>
      <p className="text-3xl text-foreground dark:text-white">{value}</p>
    </div>
  );
}

function AnimalListItem({ animal, onClick, onEdit, onViewGenealogy, onViewVideo, onDelete }: any) {
  const isCondominio =
    animal.proprietario?.toUpperCase().includes('CONDOMINIO') ||
    animal.proprietario?.toUpperCase().includes('CONDOMÍNIO');

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg hover:bg-accent dark:hover:bg-[#2a2a2a] cursor-pointer transition-colors relative"
    >
      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
        <ImageWithFallback
          src={animal.image}
          alt={animal.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-foreground dark:text-white mb-1">{animal.name}</p>
        <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
          {animal.registry} • {animal.category} • {animal.age}
        </p>
        {animal.chip && (
          <p className="text-xs text-muted-foreground dark:text-[#99a1af] mt-1">
            Chip: {animal.chip}
          </p>
        )}
        {animal.birthDate && (
          <p className="text-xs text-muted-foreground dark:text-[#99a1af] mt-1">
            Nascimento: {formatBirthDate(animal.birthDate)}
          </p>
        )}
        {animal.proprietario && (
          <p className="text-xs text-muted-foreground dark:text-[#99a1af] mt-1 flex items-center gap-1 min-w-0">
            <User className="w-3 h-3 flex-shrink-0" />
            <span className="inline-block align-bottom truncate max-w-[160px]">Proprietário: {animal.proprietario}</span>
            {isCondominio && (
              <span className="ml-1 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 flex-shrink-0">
                Condomínio
              </span>
            )}
          </p>
        )}
        {animal.criador && (
          <p className="text-xs text-muted-foreground dark:text-[#99a1af] mt-1 flex items-center gap-1 min-w-0">
            <User className="w-3 h-3 flex-shrink-0" />
            <span className="inline-block align-bottom truncate max-w-[160px]">Criador: {animal.criador}</span>
          </p>
        )}
        {animal.filhos !== undefined && animal.filhos > 0 && (
          <p className="text-xs text-primary dark:text-white mt-1 flex items-center gap-1">
            <Baby className="w-3 h-3" /> {animal.filhos} {animal.filhos === 1 ? 'filho' : 'filhos'}
          </p>
        )}
        {animal.premiacoes !== undefined && animal.premiacoes > 0 && (
          <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-1 flex items-center gap-1">
            <Award className="w-3 h-3" /> {animal.premiacoes} {animal.premiacoes === 1 ? 'premiação' : 'premiações'}
          </p>
        )}
      </div>
      <span className={`px-3 py-1 ${getStatusColorClasses(animal.status)} text-xs rounded-full flex-shrink-0`}>
        {animal.status}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onViewVideo();
        }}
        className="bg-purple-600 dark:bg-gray-600 text-white dark:text-gray-200 rounded-full p-1.5 hover:opacity-90 transition-opacity ml-2"
        title="Ver Vídeos"
      >
        <Video className="w-4 h-4" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onViewGenealogy();
        }}
        className="bg-green-600 dark:bg-gray-600 text-white dark:text-gray-200 rounded-full p-1.5 hover:opacity-90 transition-opacity"
        title="Ver Genealogia"
      >
        <GitBranch className="w-4 h-4" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className="bg-primary dark:bg-white text-white dark:text-black rounded-full p-1.5 hover:opacity-90 transition-opacity"
        title="Editar"
      >
        <Edit className="w-4 h-4" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="bg-red-600 dark:bg-gray-600 text-white dark:text-gray-200 rounded-full p-1.5 hover:opacity-90 transition-opacity"
        title="Excluir Animal"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

function ImportModal({ onClose, harasId, environment, onSuccess }: { onClose: () => void, harasId?: string, environment: AnimalEnvironment, onSuccess: () => void }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importMode, setImportMode] = useState<'abccmm_plantel' | 'abccmm_condominio_animais' | 'premiacoes_associado' | 'premiacoes_condominio'>(
    environment === 'condominio' ? 'abccmm_condominio_animais' : 'abccmm_plantel'
  );

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setSelectedFile(event.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleImport = () => {
    if (!selectedFile) {
      toast.error('Selecione um arquivo para importar');
      return;
    }

    if (!harasId) {
      toast.error('Não foi possível identificar o haras para importação');
      return;
    }

    const toastId = toast.loading('Iniciando importação...', { duration: Infinity });

    const importPromise = importMode === 'abccmm_plantel'
      ? animalsService.importABCCMMData({
        file: selectedFile,
        harasId,
        onProgress: (percent, msg) => {
          toast.loading(`${msg} (${percent}%)`, { id: toastId, duration: Infinity });
        },
      })
      : importMode === 'abccmm_condominio_animais'
        ? animalsService.importCondominiumAnimals({
          file: selectedFile,
          harasId,
          onProgress: (percent, msg) => {
            toast.loading(`${msg} (${percent}%)`, { id: toastId, duration: Infinity });
          },
        })
        : animalsService.importAwardsFromSpreadsheet({
        file: selectedFile,
        harasId,
        source: importMode === 'premiacoes_associado' ? 'associado' : 'condominio',
        onProgress: (percent, msg) => {
          toast.loading(`${msg} (${percent}%)`, { id: toastId, duration: Infinity });
        },
      });

    onClose();

    importPromise
      .then((result) => {
        if ('newAnimals' in result) {
          toast.success(`Importação concluída: ${result.newAnimals} novos, ${result.updatedAnimals} atualizados`, { id: toastId });
        } else {
          toast.success(`Premiações: ${result.insertedAwards} novas, ${result.updatedAwards} atualizadas`, { id: toastId });
        }
        onSuccess();
      })
      .catch((error) => {
        console.error(error);
        const message = error instanceof Error ? error.message : 'Erro ao importar planilha';
        toast.error(message, { id: toastId });
      });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-border dark:border-[#3a3a3a]">
        <div className="p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl text-foreground dark:text-white mb-2">Importações ABCCMM</h3>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white text-xl"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-yellow-500 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-white dark:text-gray-200" />
              </div>
              <h4 className="text-xl text-foreground dark:text-white">Instruções para Importação</h4>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-foreground dark:text-white">Tipo de importação</label>
              <NativeSelect
                value={importMode}
                onChange={(e) => setImportMode(e.target.value as typeof importMode)}
              >
                {environment !== 'condominio' && <option value="abccmm_plantel">Animais do plantel (ABCCMM)</option>}
                <option value="abccmm_condominio_animais">Animais em condomínio</option>
                {environment !== 'condominio' && <option value="premiacoes_associado">Premiações de associado</option>}
                <option value="premiacoes_condominio">Premiações de condomínio</option>
              </NativeSelect>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-foreground dark:text-white">Formato do Arquivo aceito</label>
              <div className="bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-lg px-4 py-2.5">
                <p className="text-sm text-muted-foreground dark:text-[#6b6b6b]">Arquivos Excel (.xlsx) com dados organizados em colunas</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-foreground dark:text-white">Colunas Recomendadas</label>
              <div className="bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-lg px-4 py-3">
                <div className="grid grid-cols-2 gap-x-16">
                  <ul className="text-sm text-muted-foreground dark:text-[#6b6b6b] space-y-1">
                    <li>• RowId / _rowid</li>
                    <li>• Nome do Animal / Nome Exposição</li>
                    <li>• Registro / Evento</li>
                    <li>• Data / Período</li>
                  </ul>
                  <ul className="text-sm text-muted-foreground dark:text-[#6b6b6b] space-y-1">
                    <li>• Colocação / Premiação</li>
                    <li>• Cidade/UF</li>
                    <li>• Código do Evento / Julgados</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border border-border dark:border-[#616161] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-4 h-4 text-muted-foreground dark:text-[#6b6b6b]" />
                <h5 className="text-sm text-foreground dark:text-white">Limitações do Plano Free</h5>
              </div>
              <ul className="text-sm text-muted-foreground dark:text-[#6b6b6b] space-y-1 pl-6">
                <li>• Máximo 1 importação por mês</li>
                <li>• Limite total de 100 animais</li>
                <li>• Animais atuais: 6/100</li>
              </ul>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-foreground dark:text-white">Selecionar Arquivo</label>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-border dark:border-[#616161] rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary dark:hover:border-white/50 transition-colors"
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <FileUp className="w-12 h-12 text-muted-foreground dark:text-[#616161] mb-3" />
                <p className="text-foreground dark:text-white mb-1">Arraste e solte o arquivo aqui</p>
                <p className="text-sm text-muted-foreground dark:text-[#6b6b6b]">ou clique para selecionar o arquivo</p>
                {selectedFile && (
                  <p className="text-sm text-primary dark:text-white mt-3">✓ {selectedFile.name}</p>
                )}
                <input
                  id="file-input"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border dark:border-[rgba(255,255,255,0.1)] flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-transparent border border-muted-foreground dark:border-[#b0b0b0] text-muted-foreground dark:text-[#b0b0b0] rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleImport}
            disabled={!selectedFile}
            className="px-8 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Importar
          </button>
        </div>
      </div>
    </div>
  );
}
