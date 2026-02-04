
import { Search, Filter, Grid, List, Plus, Upload, Users, Eye, AlertTriangle, Info, FileUp, Edit, ChevronLeft, ChevronRight, GitBranch, Baby, Award, Video, Trash2 } from 'lucide-react';
import { useState, useMemo } from 'react';
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
import { toast } from 'sonner';

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
  if (s === 'gestante') return 'bg-pink-500 dark:bg-gray-600 text-white dark:text-gray-200';
  if (s === 'em cobertura') return 'bg-blue-500 dark:bg-gray-600 text-white dark:text-gray-200';
  if (s === 'em crescimento' || s === 'potro' || s === 'potra') return 'bg-yellow-500 dark:bg-gray-600 text-white dark:text-gray-200';
  if (s === 'vendido') return 'bg-red-500 dark:bg-gray-600 text-white dark:text-gray-200';
  if (s === 'morto' || s === 'óbito') return 'bg-gray-800 dark:bg-gray-600 text-white dark:text-gray-200';
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

// Interface local para a UI (compatível com AnimalCard)
interface PlantelAnimal {
  id: string | number;
  haras_id?: string;
  name: string;
  registry: string;
  chip?: string;
  marca?: string;
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
  observations?: string;
  weight?: number;
  height?: number;
  // Campos de Reprodução
  reproductionType?: string;
  activeForReproduction?: boolean;
}

export function BreederPlantelContent() {
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
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterCategoria, setFilterCategoria] = useState('todos');
  const [filterIdade, setFilterIdade] = useState('todos');
  const [filterFilhos, setFilterFilhos] = useState('todos');
  const [filterPremiacoes, setFilterPremiacoes] = useState('todos');

  const { stableHarasId, isLoading: isUserLoading, isSessionReady } = useUser();
  const harasId = isSessionReady ? stableHarasId || undefined : undefined;

  // Hook de Animais
  const { data: animalsData, isLoading, refetch } = useAnimals(
    { haras_id: harasId },
    { page: 1, limit: 1000 }, // Buscando 1000 para permitir filtro client-side de idade/filhos
    !!harasId && isSessionReady && !isUserLoading
  );

  const isHarasLoading = !harasId && (isUserLoading || !isSessionReady);

  const { mutateAsync: deleteAnimal } = useDeleteAnimal();

  // Mapeamento dos dados da API para o formato da UI
  const animalsList: PlantelAnimal[] = useMemo(() => {
    if (!animalsData?.data) return [];

    return animalsData.data.map(animal => {
      const status = animal.status || 'Ativo';
      const isInactive = status.toLowerCase() === 'vendido' || status.toLowerCase() === 'morto' || status.toLowerCase() === 'óbito';

      return {
        id: animal.id, // Agora string, AnimalCard atualizado aceita string | number
        haras_id: animal.haras_id,
        name: animal.name,
        registry: animal.registry_number || '-',
        chip: animal.chip_number || undefined,
        marca: animal.brand || undefined,
        sex: animal.sex,
        birthDate: animal.birth_date || (animal as any).data_nascimento || undefined,
        birth_date: animal.birth_date || (animal as any).data_nascimento || undefined,
        father_id: animal.father_id || (animal as any).pai_id || null,
        mother_id: animal.mother_id || (animal as any).mae_id || null,
        harasOrigem: animal.origin_haras || undefined,
        origin_haras: animal.origin_haras || (animal as any).haras_origem || undefined,
        category: animal.category,
        age: calculateAge(animal.birth_date || undefined),
        haras: 'Meu Haras', // Poderíamos buscar o nome do haras se necessário
        status: status,
        statusColor: getStatusColorClasses(status),
        statusAtividade: isInactive ? 'Inativo' : 'Ativo',
        localizacao: animal.location || (animal as any).localizacao || undefined,
        location: animal.location || (animal as any).localizacao || undefined,
        servicoTipo: animal.service_type || (animal as any).tipo_servico || undefined,
        service_type: animal.service_type || (animal as any).tipo_servico || undefined,
        coat_color: animal.coat_color || (animal as any).pelagem || undefined,
        pelagem: animal.coat_color || (animal as any).pelagem || undefined,
        gait: animal.gait || (animal as any).andamento || undefined,
        father_name: animal.father_name || undefined,
        mother_name: animal.mother_name || undefined,
        observations: animal.observations || (animal as any).observacoes || undefined,
        weight: animal.weight || undefined,
        height: animal.height || undefined,
        filhos: 0, // TODO: Buscar count de filhos via API ou include
        premiacoes: 0, // TODO: Buscar count de premiações
        image: animal.main_image_url || 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80', // Placeholder
        images: animal.images && animal.images.length > 0 ? animal.images : (animal.main_image_url ? [animal.main_image_url] : ['https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80']),
        documents: animal.documents || [],
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
        animal.category.toLowerCase().includes(filterCategoria.toLowerCase());

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
            console.log('Navegando para animal ID:', animalId);
            // Simulação de navegação na árvore - TODO integrar busca por ID real
            const mockAnimal = animalsList.find(a => String(a.id) === String(animalId));
            if (mockAnimal) {
              setSelectedAnimal(mockAnimal);
              setInitialTab('overview');
              setShowAnimalDetails(true);
            }
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

          {/* Actions and Filters */}
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
              <div className="flex flex-col lg:flex-row gap-3 w-full">
                <button
                  className="w-full lg:w-auto px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  onClick={() => setShowImportModal(true)}
                >
                  <Upload className="w-5 h-5" />
                  Importar Planilha
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
            {viewMode === 'grid' ? (
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
        {animal.marca && (
          <p className="text-xs text-muted-foreground dark:text-[#99a1af] mt-1">
            Marca: {animal.marca}
          </p>
        )}
        {animal.birthDate && (
          <p className="text-xs text-muted-foreground dark:text-[#99a1af] mt-1">
            Nascimento: {formatBirthDate(animal.birthDate)}
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

function ImportModal({ onClose }: any) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-border dark:border-[#3a3a3a]">
        <div className="p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl text-foreground dark:text-white mb-2">Importar Planilha</h3>
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
                    <li>• Nome do Animal</li>
                    <li>• Registro</li>
                    <li>• Data de Nascimento</li>
                    <li>• Sexo</li>
                  </ul>
                  <ul className="text-sm text-muted-foreground dark:text-[#6b6b6b] space-y-1">
                    <li>• Pelagem</li>
                    <li>• Status</li>
                    <li>• Categoria</li>
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
