import { Search, Filter, Eye, Upload, Download, Info } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { getAnimalStatusLabel, getDisplayCategoryLabel } from '@/lib/animal-classification';
import { NativeSelect } from '../ui/native-select';
import { AdvisorAnimalDetails } from './AdvisorAnimalDetails';
import { AdvisorImportABCCMM } from './AdvisorImportABCCMM';
import { toast } from 'sonner';

interface Animal {
  id: number;
  photo: string;
  name: string;
  registration: string;
  sex: string;
  birthDate: string;
  status: 'Ativo' | 'Vendido' | 'Falecido';
  category: 'Pista' | 'Pasto' | 'Reprodução';
  father?: string;
  mother?: string;
  coat?: string;
  importedFromABCCMM?: boolean;
}

type AdvisorHerdView = 'list' | 'import' | 'details';

export function AdvisorHerdContent() {
  const [activeView, setActiveView] = useState<AdvisorHerdView>('list');
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterCategory, setFilterCategory] = useState('todos');
  const [filterSex, setFilterSex] = useState('todos');

  const [animals] = useState<Animal[]>([]);

  // Filtrar animais
  const filteredAnimals = animals.filter((animal) => {
    const matchesSearch = 
      animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.registration.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'todos' || animal.status === filterStatus;
    const matchesCategory = filterCategory === 'todos' || animal.category === filterCategory;
    const matchesSex = filterSex === 'todos' || animal.sex === filterSex;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesSex;
  });

  const handleViewAnimal = (animal: Animal) => {
    setSelectedAnimal(animal);
    setActiveView('details');
  };

  const exportToExcel = () => {
    toast.success('Exportação iniciada - será baixado em instantes');
    // Lógica de exportação
  };

  // Se está mostrando importação
  if (activeView === 'import') {
    return (
      <AdvisorImportABCCMM 
        onBack={() => setActiveView('list')}
        onImportComplete={(result) => {
          console.log('Import result:', result);
          toast.success(`Importação concluída: ${result.newAnimals} novos, ${result.updatedAnimals} atualizados`);
        }}
      />
    );
  }

  // Se está mostrando detalhes
  if (activeView === 'details' && selectedAnimal) {
    return (
      <AdvisorAnimalDetails
        animal={selectedAnimal as any}
        onBack={() => {
          setActiveView('list');
          setSelectedAnimal(null);
        }}
        onEdit={() => {
          toast.info('Edição não disponível - dados importados da ABCCMM são bloqueados (RN-001)');
        }}
        initialTab="overview"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Info sobre o papel do Acessor no Plantel */}
      <div className="bg-blue-500/10 dark:bg-gray-500/10 border border-blue-500/20 dark:border-gray-500/20 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-500/10 dark:bg-gray-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5 text-blue-600 dark:text-gray-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-foreground dark:text-white mb-2">Consulta e Importação de Plantel</h3>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
              Como Acessor Administrativo, você pode <strong>consultar</strong> o plantel e <strong>importar planilhas da ABCCMM</strong> para atualização em massa. Os dados importados são bloqueados para garantir integridade (RN-001). Para cadastro manual de novos animais, solicite ao Criador/Proprietário.
            </p>
          </div>
        </div>
      </div>

      {/* Header com Filtros */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl text-foreground dark:text-white mb-2">Plantel</h1>
            <p className="text-muted-foreground dark:text-[#99a1af]">
              {filteredAnimals.length} {filteredAnimals.length === 1 ? 'animal' : 'animais'} • Modo Consulta
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={exportToExcel}
              className="px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] text-foreground dark:text-white rounded-xl hover:bg-muted dark:hover:bg-[#2a2a2a] transition-colors flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Exportar Excel
            </button>
            <button
              onClick={() => setActiveView('import')}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors flex items-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Importar ABCCMM
            </button>
          </div>
        </div>

        {/* Busca e Filtros */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
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
              Filtros
            </button>
          </div>

          {/* Filtros Avançados */}
          {showAdvancedFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">Status</label>
                <NativeSelect value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="todos">Todos</option>
                  <option value="Ativo">Ativo</option>
                  <option value="Vendido">Vendido</option>
                  <option value="Falecido">Falecido</option>
                </NativeSelect>
              </div>
              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">Categoria</label>
                <NativeSelect value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                  <option value="todos">Todas</option>
                  <option value="Pista">Pista</option>
                  <option value="Pasto">Pasto</option>
                  <option value="Reprodução">Reprodução</option>
                </NativeSelect>
              </div>
              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">Sexo</label>
                <NativeSelect value={filterSex} onChange={(e) => setFilterSex(e.target.value)}>
                  <option value="todos">Todos</option>
                  <option value="Macho">Macho</option>
                  <option value="Fêmea">Fêmea</option>
                </NativeSelect>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lista de Animais - Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAnimals.map((animal) => (
          <div
            key={animal.id}
            className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] overflow-hidden hover:border-primary dark:hover:border-white/50 transition-all group cursor-pointer"
            onClick={() => handleViewAnimal(animal)}
          >
            {/* Foto */}
            <div className="aspect-video bg-black relative overflow-hidden">
              <ImageWithFallback
                src={animal.photo}
                alt={animal.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {animal.importedFromABCCMM && (
                <div className="absolute top-3 right-3 px-3 py-1 bg-green-500 rounded-lg text-xs text-white">
                  ABCCMM
                </div>
              )}
              <div className="absolute bottom-3 left-3">
                <span className={`px-3 py-1 rounded-lg text-xs text-white ${
                  animal.status === 'Ativo' ? 'bg-green-500' :
                  animal.status === 'Vendido' ? 'bg-gray-500' :
                  'bg-red-500'
                }`}>
                  {getAnimalStatusLabel(animal.status)}
                </span>
              </div>
            </div>

            {/* Informações */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg text-foreground dark:text-white mb-1">{animal.name}</h3>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af]">{animal.registration}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground dark:text-[#99a1af]">Sexo</p>
                  <p className="text-foreground dark:text-white">{animal.sex}</p>
                </div>
                <div>
                  <p className="text-muted-foreground dark:text-[#99a1af]">Nascimento</p>
                  <p className="text-foreground dark:text-white">{animal.birthDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground dark:text-[#99a1af]">Categoria</p>
                  <p className="text-foreground dark:text-white">{getDisplayCategoryLabel(animal.category)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground dark:text-[#99a1af]">Pelagem</p>
                  <p className="text-foreground dark:text-white">{animal.coat}</p>
                </div>
              </div>

              {/* Botão Ver Detalhes */}
              <button className="w-full mt-4 px-4 py-2 bg-primary/10 dark:bg-white/10 text-primary dark:text-white rounded-xl hover:bg-primary/20 dark:hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
                <Eye className="w-4 h-4" />
                Ver Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Estado Vazio */}
      {filteredAnimals.length === 0 && (
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-12 border border-border dark:border-[rgba(255,255,255,0.1)] text-center">
          <div className="w-16 h-16 bg-muted dark:bg-[#0d0d0d] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-muted-foreground dark:text-[#616161]" />
          </div>
          <h3 className="text-lg text-foreground dark:text-white mb-2">Nenhum animal encontrado</h3>
          <p className="text-muted-foreground dark:text-[#99a1af]">
            Ajuste os filtros ou busque por outro termo.
          </p>
        </div>
      )}
    </div>
  );
}
