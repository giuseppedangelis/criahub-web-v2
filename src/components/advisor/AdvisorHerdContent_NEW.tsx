import { Search, Filter, Grid, List, Plus, Upload, Users, Eye, AlertTriangle, Info, FileUp, Edit, ChevronLeft, ChevronRight, GitBranch, Baby, Award, Video, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { NativeSelect } from '../ui/native-select';
import { AdvisorCadastrarAnimal } from './AdvisorCadastrarAnimal';
import { AdvisorAnimalDetails } from './AdvisorAnimalDetails';
import { toast } from 'sonner';

// Função auxiliar para formatar data de nascimento
function formatBirthDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

// Função auxiliar para obter classes de cor baseado no status
function getStatusColorClasses(status: string): string {
  switch (status) {
    case 'Ativo':
      return 'bg-green-500 dark:bg-gray-600 text-white dark:text-gray-200';
    case 'Gestante':
      return 'bg-pink-500 dark:bg-gray-600 text-white dark:text-gray-200';
    case 'Em Cobertura':
      return 'bg-blue-500 dark:bg-gray-600 text-white dark:text-gray-200';
    case 'Em Crescimento':
      return 'bg-yellow-500 dark:bg-gray-600 text-white dark:text-gray-200';
    default:
      return 'bg-gray-500 dark:bg-gray-600 text-white dark:text-gray-200';
  }
}

interface Animal {
  id: number;
  name: string;
  registry: string;
  chip?: string;
  marca?: string;
  sex?: 'Macho' | 'Fêmea';
  birthDate?: string;
  harasOrigem?: string;
  category: string;
  age: string;
  haras: string;
  status: string;
  statusColor: string;
  localizacao?: string;
  servicoTipo?: string;
  filhos?: number;
  premiacoes?: number;
  image: string;
  images: string[];
  imageCaptions?: string[];
  reproductionType?: 'Doadora' | 'Matriz' | 'Garanhão' | 'Castrado' | 'Receptora';
  activeForReproduction?: boolean;
  coverageCount?: number;
  lastReproductiveEvent?: {
    type: string;
    date: string;
  };
}

export function AdvisorHerdContent() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAnimalDetails, setShowAnimalDetails] = useState(false);
  const [showEditarAnimal, setShowEditarAnimal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showCadastrarAnimal, setShowCadastrarAnimal] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [initialTab, setInitialTab] = useState<string>('overview');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [animalToDelete, setAnimalToDelete] = useState<Animal | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Estados dos filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSexo, setFilterSexo] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterCategoria, setFilterCategoria] = useState('todos');
  const [filterIdade, setFilterIdade] = useState('todos');
  const [filterFilhos, setFilterFilhos] = useState('todos');
  const [filterPremiacoes, setFilterPremiacoes] = useState('todos');
  
  // Lista de animais (dados mockados para o Assessor)
  const [animalsList, setAnimalsList] = useState<Animal[]>([
    { 
      id: 1, 
      name: 'Estrela Mangalarga', 
      registry: 'MM-2020-1234',
      chip: '123456789',
      marca: 'HV-001',
      sex: 'Fêmea',
      birthDate: '2020-01-15',
      category: 'Reprodutora', 
      age: '4 anos', 
      haras: 'Haras Vale Verde', 
      status: 'Ativo', 
      statusColor: 'bg-green-500',
      localizacao: 'Baia 12',
      servicoTipo: 'Reprodução',
      filhos: 3,
      premiacoes: 2,
      image: 'https://images.unsplash.com/photo-1667992711873-4bd87cbfbb65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVzdG51dCUyMGhvcnNlfGVufDF8fHx8MTc2MzUwMDExNHww&ixlib=rb-4.1.0&q=80&w=1080', 
      images: [
        'https://images.unsplash.com/photo-1667992711873-4bd87cbfbb65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVzdG51dCUyMGhvcnNlfGVufDF8fHx8MTc2MzUwMDExNHww&ixlib=rb-4.1.0&q=80&w=1080',
      ],
      reproductionType: 'Matriz',
      activeForReproduction: true,
      coverageCount: 5,
    },
    { 
      id: 2, 
      name: 'Relâmpago Negro', 
      registry: 'MM-2018-5678',
      chip: '987654321',
      marca: 'HT-002',
      sex: 'Macho',
      birthDate: '2018-03-22',
      category: 'Reprodutor', 
      age: '6 anos', 
      haras: 'Haras Trovão', 
      status: 'Ativo', 
      statusColor: 'bg-green-500',
      localizacao: 'Piquete 5',
      servicoTipo: 'Reprodução',
      filhos: 8,
      premiacoes: 5,
      image: 'https://images.unsplash.com/photo-1656964353220-99aa5acc47e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHN0YWxsaW9uJTIwaG9yc2V8ZW58MXx8fHwxNzYzNTAwMTEzfDA&ixlib=rb-4.1.0&q=80&w=1080', 
      images: [
        'https://images.unsplash.com/photo-1656964353220-99aa5acc47e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHN0YWxsaW9uJTIwaG9yc2V8ZW58MXx8fHwxNzYzNTAwMTEzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      ],
      reproductionType: 'Garanhão',
      activeForReproduction: true,
      coverageCount: 12,
    },
  ]);

  // Função de filtro
  const filteredAnimals = animalsList.filter((animal) => {
    const matchesSearch = animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          animal.registry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSexo = filterSexo === 'todos' || animal.sex === filterSexo;
    const matchesStatus = filterStatus === 'todos' || animal.status === filterStatus;
    const matchesCategoria = filterCategoria === 'todos' || animal.category === filterCategoria;
    
    let matchesIdade = true;
    if (filterIdade !== 'todos') {
      const ageNum = parseInt(animal.age);
      if (filterIdade === '0-2') matchesIdade = ageNum >= 0 && ageNum <= 2;
      else if (filterIdade === '3-5') matchesIdade = ageNum >= 3 && ageNum <= 5;
      else if (filterIdade === '6-10') matchesIdade = ageNum >= 6 && ageNum <= 10;
      else if (filterIdade === '10+') matchesIdade = ageNum > 10;
    }

    let matchesFilhos = true;
    if (filterFilhos !== 'todos' && animal.filhos !== undefined) {
      if (filterFilhos === '0') matchesFilhos = animal.filhos === 0;
      else if (filterFilhos === '1-3') matchesFilhos = animal.filhos >= 1 && animal.filhos <= 3;
      else if (filterFilhos === '4-10') matchesFilhos = animal.filhos >= 4 && animal.filhos <= 10;
      else if (filterFilhos === '10+') matchesFilhos = animal.filhos > 10;
    }

    let matchesPremiacoes = true;
    if (filterPremiacoes !== 'todos' && animal.premiacoes !== undefined) {
      if (filterPremiacoes === '0') matchesPremiacoes = animal.premiacoes === 0;
      else if (filterPremiacoes === '1-3') matchesPremiacoes = animal.premiacoes >= 1 && animal.premiacoes <= 3;
      else if (filterPremiacoes === '4+') matchesPremiacoes = animal.premiacoes >= 4;
    }

    return matchesSearch && matchesSexo && matchesStatus && matchesCategoria && 
           matchesIdade && matchesFilhos && matchesPremiacoes;
  });

  // Função para deletar animal
  const handleDeleteAnimal = (animal: Animal) => {
    setAnimalToDelete(animal);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (animalToDelete) {
      setAnimalsList(animalsList.filter(a => a.id !== animalToDelete.id));
      setShowDeleteModal(false);
      setAnimalToDelete(null);
      toast.success('Animal removido com sucesso!');
    }
  };

  return (
    <div className="space-y-6">
      {showCadastrarAnimal ? (
        <AdvisorCadastrarAnimal onBack={() => setShowCadastrarAnimal(false)} />
      ) : showAnimalDetails && selectedAnimal ? (
        <AdvisorAnimalDetails
          key={selectedAnimal.id}
          animal={selectedAnimal}
          onBack={() => {
            setShowAnimalDetails(false);
            setSelectedAnimal(null);
            setInitialTab('overview');
          }}
          onEdit={() => {
            setShowAnimalDetails(false);
            setShowEditarAnimal(true);
          }}
          initialTab={initialTab}
        />
      ) : (
        <>
          {/* Header com Filtros */}
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl text-foreground dark:text-white mb-2">Plantel</h1>
                <p className="text-muted-foreground dark:text-[#99a1af]">
                  {filteredAnimals.length} {filteredAnimals.length === 1 ? 'animal' : 'animais'} cadastrados
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] text-foreground dark:text-white rounded-xl hover:bg-muted dark:hover:bg-[#2a2a2a] transition-colors flex items-center gap-2"
                >
                  {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
                  {viewMode === 'grid' ? 'Lista' : 'Grade'}
                </button>
                <button
                  onClick={() => setShowCadastrarAnimal(true)}
                  className="px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Cadastrar Animal
                </button>
              </div>
            </div>

            {/* Barra de Busca e Filtros */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
                <input
                  type="text"
                  placeholder="Buscar por nome ou registro..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                />
              </div>
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="px-4 py-3 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] text-foreground dark:text-white rounded-xl hover:bg-muted dark:hover:bg-[#2a2a2a] transition-colors flex items-center gap-2"
              >
                <Filter className="w-5 h-5" />
                Filtros Avançados
              </button>
            </div>

            {/* Filtros Avançados */}
            {showAdvancedFilters && (
              <div className="mt-4 pt-4 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm text-foreground dark:text-white mb-2">Sexo</label>
                    <NativeSelect
                      value={filterSexo}
                      onChange={(e) => setFilterSexo(e.target.value)}
                    >
                      <option value="todos">Todos</option>
                      <option value="Macho">Macho</option>
                      <option value="Fêmea">Fêmea</option>
                    </NativeSelect>
                  </div>

                  <div>
                    <label className="block text-sm text-foreground dark:text-white mb-2">Status</label>
                    <NativeSelect
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="todos">Todos</option>
                      <option value="Ativo">Ativo</option>
                      <option value="Gestante">Gestante</option>
                      <option value="Em Cobertura">Em Cobertura</option>
                      <option value="Em Crescimento">Em Crescimento</option>
                    </NativeSelect>
                  </div>

                  <div>
                    <label className="block text-sm text-foreground dark:text-white mb-2">Categoria</label>
                    <NativeSelect
                      value={filterCategoria}
                      onChange={(e) => setFilterCategoria(e.target.value)}
                    >
                      <option value="todos">Todas</option>
                      <option value="Reprodutor">Reprodutor</option>
                      <option value="Reprodutora">Reprodutora</option>
                      <option value="Potro">Potro</option>
                    </NativeSelect>
                  </div>

                  <div>
                    <label className="block text-sm text-foreground dark:text-white mb-2">Idade</label>
                    <NativeSelect
                      value={filterIdade}
                      onChange={(e) => setFilterIdade(e.target.value)}
                    >
                      <option value="todos">Todas</option>
                      <option value="0-2">0-2 anos</option>
                      <option value="3-5">3-5 anos</option>
                      <option value="6-10">6-10 anos</option>
                      <option value="10+">10+ anos</option>
                    </NativeSelect>
                  </div>

                  <div>
                    <label className="block text-sm text-foreground dark:text-white mb-2">Filhos</label>
                    <NativeSelect
                      value={filterFilhos}
                      onChange={(e) => setFilterFilhos(e.target.value)}
                    >
                      <option value="todos">Todos</option>
                      <option value="0">Sem filhos</option>
                      <option value="1-3">1-3 filhos</option>
                      <option value="4-10">4-10 filhos</option>
                      <option value="10+">10+ filhos</option>
                    </NativeSelect>
                  </div>

                  <div>
                    <label className="block text-sm text-foreground dark:text-white mb-2">Premiações</label>
                    <NativeSelect
                      value={filterPremiacoes}
                      onChange={(e) => setFilterPremiacoes(e.target.value)}
                    >
                      <option value="todos">Todas</option>
                      <option value="0">Sem premiações</option>
                      <option value="1-3">1-3 premiações</option>
                      <option value="4+">4+ premiações</option>
                    </NativeSelect>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Lista/Grade de Animais */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAnimals.map((animal) => (
                <div
                  key={animal.id}
                  className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedAnimal(animal);
                    setShowAnimalDetails(true);
                  }}
                >
                  <div className="aspect-square relative overflow-hidden bg-black">
                    <ImageWithFallback
                      src={animal.image}
                      alt={animal.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs ${animal.statusColor}`}>
                        {animal.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg text-foreground dark:text-white mb-1">{animal.name}</h3>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-3">{animal.registry}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground dark:text-[#99a1af]">{animal.category}</span>
                      <span className="text-muted-foreground dark:text-[#99a1af]">{animal.age}</span>
                    </div>
                    {(animal.filhos !== undefined || animal.premiacoes !== undefined) && (
                      <div className="flex gap-3 mt-3 pt-3 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
                        {animal.filhos !== undefined && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground dark:text-[#99a1af]">
                            <Baby className="w-4 h-4" />
                            {animal.filhos}
                          </div>
                        )}
                        {animal.premiacoes !== undefined && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground dark:text-[#99a1af]">
                            <Award className="w-4 h-4" />
                            {animal.premiacoes}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted dark:bg-[#0d0d0d] border-b border-border dark:border-[rgba(255,255,255,0.1)]">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm text-foreground dark:text-white">Animal</th>
                      <th className="px-6 py-4 text-left text-sm text-foreground dark:text-white">Registro</th>
                      <th className="px-6 py-4 text-left text-sm text-foreground dark:text-white">Sexo</th>
                      <th className="px-6 py-4 text-left text-sm text-foreground dark:text-white">Categoria</th>
                      <th className="px-6 py-4 text-left text-sm text-foreground dark:text-white">Idade</th>
                      <th className="px-6 py-4 text-left text-sm text-foreground dark:text-white">Status</th>
                      <th className="px-6 py-4 text-left text-sm text-foreground dark:text-white">Haras</th>
                      <th className="px-6 py-4 text-left text-sm text-foreground dark:text-white">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAnimals.map((animal) => (
                      <tr
                        key={animal.id}
                        className="border-b border-border dark:border-[rgba(255,255,255,0.1)] hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedAnimal(animal);
                          setShowAnimalDetails(true);
                        }}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-black flex-shrink-0">
                              <ImageWithFallback
                                src={animal.image}
                                alt={animal.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-foreground dark:text-white">{animal.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground dark:text-[#99a1af]">{animal.registry}</td>
                        <td className="px-6 py-4 text-foreground dark:text-white">{animal.sex || 'N/A'}</td>
                        <td className="px-6 py-4 text-foreground dark:text-white">{animal.category}</td>
                        <td className="px-6 py-4 text-foreground dark:text-white">{animal.age}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs ${animal.statusColor}`}>
                            {animal.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-foreground dark:text-white">{animal.haras}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedAnimal(animal);
                                setShowAnimalDetails(true);
                              }}
                              className="p-2 text-muted-foreground dark:text-[#99a1af] hover:text-primary dark:hover:text-white transition-colors"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAnimal(animal);
                              }}
                              className="p-2 text-muted-foreground dark:text-[#99a1af] hover:text-red-500 dark:hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Modal de Confirmação de Exclusão */}
          {showDeleteModal && animalToDelete && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 max-w-md w-full border border-border dark:border-[rgba(255,255,255,0.1)]">
                <h2 className="text-xl text-foreground dark:text-white mb-4">Confirmar Exclusão</h2>
                <p className="text-muted-foreground dark:text-[#99a1af] mb-6">
                  Tem certeza que deseja excluir o animal <strong>{animalToDelete.name}</strong>? Esta ação não pode ser desfeita.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setAnimalToDelete(null);
                    }}
                    className="flex-1 px-4 py-3 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] text-foreground dark:text-white rounded-xl hover:bg-muted dark:hover:bg-[#2a2a2a] transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
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
