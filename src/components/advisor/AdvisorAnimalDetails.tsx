import { ArrowLeft, ChevronLeft, ChevronRight, Edit, MapPin, Heart, Calendar, Users, Award, FileText, Activity, Clock, Syringe, Pill, Stethoscope, Baby, Info, Download } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { NativeSelect } from '../ui/native-select';
import { toast } from 'sonner';

interface Animal {
  id: number;
  name: string;
  registration?: string;
  registry?: string;
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
  importedFromABCCMM?: boolean;
  coat?: string;
  father?: string;
  mother?: string;
}

interface AdvisorAnimalDetailsProps {
  animal: Animal;
  onBack: () => void;
  onEdit: () => void;
  initialTab?: string;
}

export function AdvisorAnimalDetails({ animal, onBack, onEdit, initialTab = 'overview' }: AdvisorAnimalDetailsProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Verificar se o animal foi importado da ABCCMM
  const isImportedFromABCCMM = animal.importedFromABCCMM || false;

  const tabs = [
    { id: 'overview', label: 'Visão Geral' },
    { id: 'genealogy', label: 'Genealogia' },
    { id: 'reproduction', label: 'Reprodução' },
    ...(animal.premiacoes && animal.premiacoes > 0 ? [{ id: 'awards', label: `Premiações (${animal.premiacoes})` }] : []),
    ...(animal.filhos && animal.filhos > 0 ? [{ id: 'offspring', label: `Filhos (${animal.filhos})` }] : []),
    { id: 'documents', label: 'Documentos' },
    { id: 'health', label: 'Saúde' },
    { id: 'history', label: 'Histórico' },
  ];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? (animal.images?.length || 1) - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === (animal.images?.length || 1) - 1 ? 0 : prev + 1
    );
  };

  const animalImages = animal.images || [animal.image];
  const registryValue = animal.registration || animal.registry || 'N/A';

  function formatBirthDate(isoDate: string | undefined): string {
    if (!isoDate) return 'N/A';
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  }

  // Mock data para completar as abas
  const genealogyData = {
    father: animal.father || 'Trovão Branco',
    fatherRegistry: 'MM-2019-2468',
    mother: animal.mother || 'Bella Vista',
    motherRegistry: 'MM-2021-7890',
    paternalGrandfather: 'Rei da Marcha',
    paternalGrandfatherRegistry: 'MM-2015-1234',
    paternalGrandmother: 'Lua Prateada',
    paternalGrandmotherRegistry: 'MM-2016-5678',
    maternalGrandfather: 'Vento Sul',
    maternalGrandfatherRegistry: 'MM-2017-9012',
    maternalGrandmother: 'Rosa Branca',
    maternalGrandmotherRegistry: 'MM-2018-3456',
  };

  const reproductionHistory = [
    { id: 1, type: 'Cobertura', partner: 'Trovão Dourado', date: '15/01/2024', status: 'Confirmada', result: 'Prenha' },
    { id: 2, type: 'Parto', offspring: 'Potro Macho - Cometa da Estrela', date: '20/11/2023', status: 'Sucesso', observations: 'Sem complicações, potro saudável' },
    { id: 3, type: 'Cobertura', partner: 'Rei da Marcha', date: '10/02/2023', status: 'Confirmada', result: 'Vazia' },
  ];

  const awards = [
    { id: 1, event: 'Expo Nacional Mangalarga 2024', category: 'Marcha Picada - Fêmeas', position: '1º Lugar', date: '15/08/2024', location: 'Belo Horizonte - MG' },
    { id: 2, event: 'Campeonato Regional Sul', category: 'Melhor Conjunto', position: '2º Lugar', date: '20/05/2024', location: 'Curitiba - PR' },
    { id: 3, event: 'Ranking ABCCMM 2023', category: 'Top 10 Fêmeas', position: '7º Lugar', date: '10/12/2023', location: 'Nacional' },
  ];

  const offspring = [
    { id: 1, name: 'Cometa da Estrela', sex: 'Macho', birthDate: '20/11/2023', father: 'Trovão Dourado', registration: 'MM-12360', status: 'Ativo', image: 'https://images.unsplash.com/photo-1598632640487-6ea4a4e8b6f1?w=200' },
    { id: 2, name: 'Lua Crescente', sex: 'Fêmea', birthDate: '15/10/2022', father: 'Rei da Marcha', registration: 'MM-12350', status: 'Vendido', image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=200' },
    { id: 3, name: 'Vento Forte', sex: 'Macho', birthDate: '05/09/2021', father: 'Trovão Dourado', registration: 'MM-12340', status: 'Ativo', image: 'https://images.unsplash.com/photo-1587463272036-4cb85a5a7c88?w=200' },
  ];

  const documents = [
    { id: 1, type: 'GIA', name: 'Guia de Ingresso - Estrela Mangalarga', date: '15/11/2024', status: 'Assinado', size: '1.2 MB' },
    { id: 2, type: 'Registro', name: 'Certificado de Registro ABCCMM', date: '10/03/2018', status: 'Assinado', size: '856 KB' },
    { id: 3, type: 'Exame', name: 'Atestado Sanitário', date: '08/01/2025', status: 'Assinado', size: '524 KB' },
    { id: 4, type: 'Contrato', name: 'Contrato de Cobertura', date: '15/01/2024', status: 'Assinado', size: '1.8 MB' },
  ];

  const healthRecords = [
    { id: 1, type: 'Vacina', name: 'Raiva', date: '10/01/2025', veterinarian: 'Dr. Carlos Silva', observations: 'Aplicada sem intercorrências' },
    { id: 2, type: 'Vermífugo', name: 'Ivermectina', date: '05/01/2025', veterinarian: 'Dra. Maria Santos', observations: 'Peso: 450kg' },
    { id: 3, type: 'Consulta', name: 'Check-up Anual', date: '20/12/2024', veterinarian: 'Dr. Carlos Silva', observations: 'Animal saudável, sem alterações' },
    { id: 4, type: 'Vacina', name: 'Influenza Equina', date: '15/11/2024', veterinarian: 'Dra. Maria Santos', observations: 'Reforço anual aplicado' },
    { id: 5, type: 'Tratamento', name: 'Tratamento de Casco', date: '01/11/2024', veterinarian: 'João Ferrador', observations: 'Casqueamento e ferrageamento' },
  ];

  const historyEvents = [
    { id: 1, type: 'award', title: '1º Lugar - Expo Nacional', date: '15/08/2024', icon: Award, color: 'text-yellow-500' },
    { id: 2, type: 'reproduction', title: 'Cobertura Confirmada', date: '15/01/2024', icon: Heart, color: 'text-pink-500' },
    { id: 3, type: 'health', title: 'Check-up Anual', date: '20/12/2024', icon: Stethoscope, color: 'text-green-500' },
    { id: 4, type: 'offspring', title: 'Nascimento: Cometa da Estrela', date: '20/11/2023', icon: Baby, color: 'text-blue-500' },
    { id: 5, type: 'health', title: 'Vacina Raiva', date: '10/01/2025', icon: Syringe, color: 'text-green-500' },
    { id: 6, type: 'document', title: 'GIA Assinado', date: '15/11/2024', icon: FileText, color: 'text-gray-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
        <div className="flex items-center justify-between mb-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <span 
              className="text-muted-foreground dark:text-[#99a1af] cursor-pointer hover:text-foreground dark:hover:text-white" 
              onClick={onBack}
            >
              Plantel
            </span>
            <span className="text-muted-foreground dark:text-[#99a1af]">/</span>
            <span className="text-foreground dark:text-white">Detalhes do Animal</span>
          </div>
          {/* Botão Voltar */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
        </div>
        <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl text-foreground dark:text-white">{animal.name}</h1>
              {isImportedFromABCCMM && (
                <span className="px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg text-xs">
                  ABCCMM
                </span>
              )}
            </div>
            <p className="text-muted-foreground dark:text-[#99a1af]">{registryValue}</p>
          </div>
        </div>
      </div>

      {/* Info sobre RN-001 */}
      {isImportedFromABCCMM && (
        <div className="bg-blue-500/10 dark:bg-gray-500/10 border border-blue-500/20 dark:border-gray-500/20 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-foreground dark:text-white mb-1">Dados Importados da ABCCMM</p>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
                Este animal foi importado da planilha ABCCMM. Os dados oficiais são bloqueados para edição (RN-001).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] overflow-hidden">
        <div className="border-b border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="px-6 py-3">
            {/* Dropdown para Mobile */}
            <div className="block lg:hidden">
              <NativeSelect
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
              >
                {tabs.map((tab) => (
                  <option key={tab.id} value={tab.id}>
                    {tab.label}
                  </option>
                ))}
              </NativeSelect>
            </div>

            {/* Tabs para Desktop */}
            <div className="hidden lg:flex gap-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-foreground dark:text-white border-b-2 border-primary dark:border-white'
                      : 'text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Visão Geral */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Grid Principal: Foto + Informações */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Coluna Esquerda - Foto e Status */}
                <div className="lg:col-span-4 space-y-4">
                  {/* Galeria de Fotos */}
                  <div className="group relative w-full aspect-square rounded-2xl overflow-hidden bg-black shadow-lg">
                    <ImageWithFallback
                      src={animalImages[currentImageIndex]}
                      alt={animal.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Contador de imagens */}
                    {animalImages.length > 1 && (
                      <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/80 backdrop-blur-md rounded-lg">
                        <span className="text-sm text-white font-medium">
                          {currentImageIndex + 1} / {animalImages.length}
                        </span>
                      </div>
                    )}

                    {/* Setas de navegação */}
                    {animalImages.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/80 hover:bg-black/90 backdrop-blur-md rounded-full opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                        >
                          <ChevronLeft className="w-6 h-6 text-white" />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/80 hover:bg-black/90 backdrop-blur-md rounded-full opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                        >
                          <ChevronRight className="w-6 h-6 text-white" />
                        </button>
                        
                        {/* Indicadores de navegação */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          {animalImages.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`h-2 rounded-full transition-all ${
                                index === currentImageIndex
                                  ? 'bg-white w-8'
                                  : 'bg-white/50 w-2 hover:bg-white/70'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Legenda da imagem */}
                  {animal.imageCaptions && animal.imageCaptions[currentImageIndex] && (
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af] text-center px-2">
                      {animal.imageCaptions[currentImageIndex]}
                    </p>
                  )}

                  {/* Card de Status do Animal */}
                  <div className="bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-muted-foreground dark:text-[#99a1af]">Status Atual</span>
                      <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${animal.statusColor}`}>
                        {animal.status}
                      </span>
                    </div>
                    {(animal.localizacao || animal.servicoTipo) && (
                      <div className="space-y-3 pt-3 border-t border-border dark:border-[#3a3a3a]">
                        {animal.localizacao && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground dark:text-[#99a1af]" />
                            <div className="flex-1">
                              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Localização</p>
                              <p className="text-sm text-foreground dark:text-white">{animal.localizacao}</p>
                            </div>
                          </div>
                        )}
                        {animal.servicoTipo && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground dark:text-[#99a1af]" />
                            <div className="flex-1">
                              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Serviço</p>
                              <p className="text-sm text-foreground dark:text-white">{animal.servicoTipo}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Coluna Direita - Todas as Informações */}
                <div className="lg:col-span-8 space-y-4">
                  {/* Card: Informações Básicas */}
                  <div className="bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-2xl p-6">
                    <h3 className="text-lg text-foreground dark:text-white mb-4 flex items-center gap-2">
                      <div className="w-1 h-6 bg-primary dark:bg-white rounded-full"></div>
                      Informações Básicas
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                      <div>
                        <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Registro ABCCMM</p>
                        <p className="text-sm text-foreground dark:text-white font-medium">{registryValue}</p>
                      </div>
                      {animal.chip && (
                        <div>
                          <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Chip RFID</p>
                          <p className="text-sm text-foreground dark:text-white font-medium">{animal.chip}</p>
                        </div>
                      )}
                      {animal.marca && (
                        <div>
                          <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Marca/Ferro</p>
                          <p className="text-sm text-foreground dark:text-white font-medium">{animal.marca}</p>
                        </div>
                      )}
                      {animal.sex && (
                        <div>
                          <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Sexo</p>
                          <p className="text-sm text-foreground dark:text-white font-medium">{animal.sex}</p>
                        </div>
                      )}
                      {animal.birthDate && (
                        <div>
                          <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Nascimento</p>
                          <p className="text-sm text-foreground dark:text-white font-medium">{formatBirthDate(animal.birthDate)}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Idade</p>
                        <p className="text-sm text-foreground dark:text-white font-medium">{animal.age}</p>
                      </div>
                      {animal.coat && (
                        <div>
                          <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Pelagem</p>
                          <p className="text-sm text-foreground dark:text-white font-medium">{animal.coat}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Categoria</p>
                        <p className="text-sm text-foreground dark:text-white font-medium">{animal.category}</p>
                      </div>
                      {animal.harasOrigem && (
                        <div>
                          <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Haras de Origem</p>
                          <p className="text-sm text-foreground dark:text-white font-medium">{animal.harasOrigem}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Haras Atual</p>
                        <p className="text-sm text-foreground dark:text-white font-medium">{animal.haras}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card: Genealogia Resumida */}
                  <div className="bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-2xl p-6">
                    <h3 className="text-lg text-foreground dark:text-white mb-4 flex items-center gap-2">
                      <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                      Genealogia
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-500/5 dark:bg-gray-500/5 border border-blue-500/20 dark:border-gray-500/20 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-blue-500 dark:bg-gray-400 rounded-full"></div>
                          <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Pai</p>
                        </div>
                        <p className="text-foreground dark:text-white font-medium mb-1">{genealogyData.father}</p>
                        <p className="text-xs text-muted-foreground dark:text-[#99a1af]">{genealogyData.fatherRegistry}</p>
                      </div>
                      <div className="bg-pink-500/5 dark:bg-pink-500/5 border border-pink-500/20 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                          <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Mãe</p>
                        </div>
                        <p className="text-foreground dark:text-white font-medium mb-1">{genealogyData.mother}</p>
                        <p className="text-xs text-muted-foreground dark:text-[#99a1af]">{genealogyData.motherRegistry}</p>
                      </div>
                    </div>
                  </div>

                  {/* Grid: Premiações + Descendentes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Card: Premiações */}
                    <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/5 dark:from-yellow-500/10 dark:to-orange-500/5 border border-yellow-500/20 rounded-2xl p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
                          <Award className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Premiações</p>
                          <p className="text-2xl text-foreground dark:text-white font-bold">
                            {animal.premiacoes !== undefined ? animal.premiacoes : 0}
                          </p>
                        </div>
                      </div>
                      <div className="bg-background/50 dark:bg-black/20 backdrop-blur-sm rounded-lg p-3 border border-yellow-500/10">
                        <p className="text-xs text-foreground dark:text-white font-medium mb-1">Último título</p>
                        <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Expo Nacional ABCCMM 2024 - 1º Lugar</p>
                      </div>
                    </div>

                    {/* Card: Descendentes */}
                    {animal.filhos !== undefined && animal.filhos > 0 && (
                      <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 dark:from-green-500/10 dark:to-emerald-500/5 border border-green-500/20 rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                            <Baby className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Descendentes</p>
                            <p className="text-2xl text-foreground dark:text-white font-bold">{animal.filhos}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setActiveTab('offspring')}
                          className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors"
                        >
                          Ver Todos os Filhos
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Card: Reprodução */}
                  {(animal.reproductionType || animal.sex === 'Macho' || animal.sex === 'Fêmea') && (
                    <div className="bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-2xl p-6">
                      <h3 className="text-lg text-foreground dark:text-white mb-4 flex items-center gap-2">
                        <div className="w-1 h-6 bg-pink-500 rounded-full"></div>
                        Informações Reprodutivas
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {animal.reproductionType && (
                          <div className="bg-pink-500/5 dark:bg-pink-500/5 border border-pink-500/20 rounded-xl p-4">
                            <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Tipo Reprodutivo</p>
                            <p className="text-sm text-foreground dark:text-white font-medium">{animal.reproductionType}</p>
                          </div>
                        )}
                        
                        {animal.activeForReproduction !== undefined && (
                          <div className="bg-pink-500/5 dark:bg-pink-500/5 border border-pink-500/20 rounded-xl p-4">
                            <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Status Reprodutivo</p>
                            <p className="text-sm text-foreground dark:text-white font-medium">
                              {animal.activeForReproduction ? '✅ Ativo' : '❌ Inativo'}
                            </p>
                          </div>
                        )}

                        {animal.coverageCount !== undefined && animal.coverageCount > 0 && (
                          <div className="bg-pink-500/5 dark:bg-pink-500/5 border border-pink-500/20 rounded-xl p-4">
                            <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Coberturas Realizadas</p>
                            <p className="text-2xl text-foreground dark:text-white font-bold">{animal.coverageCount}</p>
                          </div>
                        )}

                        {animal.lastReproductiveEvent && (
                          <div className="bg-pink-500/5 dark:bg-pink-500/5 border border-pink-500/20 rounded-xl p-4">
                            <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Último Evento</p>
                            <p className="text-sm text-foreground dark:text-white font-medium mb-0.5">{animal.lastReproductiveEvent.type}</p>
                            <p className="text-xs text-muted-foreground dark:text-[#99a1af]">{animal.lastReproductiveEvent.date}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Genealogia - INLINE (não modal) */}
          {activeTab === 'genealogy' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-500/10 dark:bg-purple-500/20 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg text-foreground dark:text-white">Árvore Genealógica</h2>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Três gerações</p>
                </div>
              </div>

              {/* Árvore Genealógica - 3 Gerações */}
              <div className="space-y-6">
                {/* Geração 1 - Atual */}
                <div className="flex justify-center">
                  <div className="bg-primary/10 dark:bg-white/10 border-2 border-primary dark:border-white rounded-xl p-4 text-center min-w-[200px]">
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Animal Atual</p>
                    <p className="text-foreground dark:text-white">{animal.name}</p>
                    <p className="text-xs text-muted-foreground dark:text-[#99a1af]">{registryValue}</p>
                  </div>
                </div>

                {/* Geração 2 - Pais */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-500/10 dark:bg-gray-500/10 border border-blue-500/20 dark:border-gray-500/20 rounded-xl p-4 text-center">
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Pai</p>
                    <p className="text-foreground dark:text-white">{genealogyData.father}</p>
                    <p className="text-xs text-muted-foreground dark:text-[#99a1af]">{genealogyData.fatherRegistry}</p>
                  </div>
                  <div className="bg-pink-500/10 dark:bg-pink-500/20 border border-pink-500/20 rounded-xl p-4 text-center">
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Mãe</p>
                    <p className="text-foreground dark:text-white">{genealogyData.mother}</p>
                    <p className="text-xs text-muted-foreground dark:text-[#99a1af]">{genealogyData.motherRegistry}</p>
                  </div>
                </div>

                {/* Geração 3 - Avós */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl p-3 text-center">
                    <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Avô Paterno</p>
                    <p className="text-sm text-foreground dark:text-white">{genealogyData.paternalGrandfather}</p>
                    <p className="text-xs text-muted-foreground dark:text-[#99a1af]">{genealogyData.paternalGrandfatherRegistry}</p>
                  </div>
                  <div className="bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl p-3 text-center">
                    <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Avó Paterna</p>
                    <p className="text-sm text-foreground dark:text-white">{genealogyData.paternalGrandmother}</p>
                    <p className="text-xs text-muted-foreground dark:text-[#99a1af]">{genealogyData.paternalGrandmotherRegistry}</p>
                  </div>
                  <div className="bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl p-3 text-center">
                    <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Avô Materno</p>
                    <p className="text-sm text-foreground dark:text-white">{genealogyData.maternalGrandfather}</p>
                    <p className="text-xs text-muted-foreground dark:text-[#99a1af]">{genealogyData.maternalGrandfatherRegistry}</p>
                  </div>
                  <div className="bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl p-3 text-center">
                    <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Avó Materna</p>
                    <p className="text-sm text-foreground dark:text-white">{genealogyData.maternalGrandmother}</p>
                    <p className="text-xs text-muted-foreground dark:text-[#99a1af]">{genealogyData.maternalGrandmotherRegistry}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reprodução */}
          {activeTab === 'reproduction' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-pink-500/10 dark:bg-pink-500/20 rounded-lg">
                  <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                </div>
                <div>
                  <h2 className="text-lg text-foreground dark:text-white">Histórico Reprodutivo</h2>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af]">{reproductionHistory.length} eventos registrados</p>
                </div>
              </div>

              <div className="space-y-4">
                {reproductionHistory.map((event) => (
                  <div key={event.id} className="bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-3 py-1 rounded-lg text-xs ${
                            event.type === 'Parto' ? 'bg-green-500/20 text-green-600 dark:text-green-400' :
                            'bg-pink-500/20 text-pink-600 dark:text-pink-400'
                          }`}>
                            {event.type}
                          </span>
                          <span className={`px-3 py-1 rounded-lg text-xs ${
                            event.status === 'Sucesso' || event.status === 'Confirmada' 
                              ? 'bg-green-500/20 text-green-600 dark:text-green-400' 
                              : 'bg-gray-500/20 text-gray-600 dark:text-gray-400'
                          }`}>
                            {event.status}
                          </span>
                        </div>
                        <p className="text-foreground dark:text-white">
                          {event.type === 'Parto' ? `Nascimento: ${event.offspring}` : `Parceiro: ${event.partner}`}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground dark:text-[#99a1af]">{event.date}</p>
                    </div>
                    {event.result && (
                      <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                        <strong>Resultado:</strong> {event.result}
                      </p>
                    )}
                    {event.observations && (
                      <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-2">
                        <strong>Observações:</strong> {event.observations}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Premiações */}
          {activeTab === 'awards' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-yellow-500/10 dark:bg-yellow-500/20 rounded-lg">
                  <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-lg text-foreground dark:text-white">Premiações</h2>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af]">{awards.length} prêmios conquistados</p>
                </div>
              </div>

              <div className="space-y-4">
                {awards.map((award) => (
                  <div key={award.id} className="bg-gradient-to-r from-yellow-500/5 to-transparent dark:from-yellow-500/5 border border-yellow-500/20 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-foreground dark:text-white mb-1">{award.event}</h3>
                        <p className="text-sm text-muted-foreground dark:text-[#99a1af]">{award.category}</p>
                      </div>
                      <span className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm whitespace-nowrap ml-3">
                        {award.position}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground dark:text-[#99a1af] mt-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {award.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {award.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filhos */}
          {activeTab === 'offspring' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500/10 dark:bg-gray-500/20 rounded-lg">
                  <Baby className="w-5 h-5 text-blue-600 dark:text-gray-400" />
                </div>
                <div>
                  <h2 className="text-lg text-foreground dark:text-white">Descendentes</h2>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af]">{offspring.length} filhos registrados</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {offspring.map((child) => (
                  <div key={child.id} className="bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl overflow-hidden hover:border-primary dark:hover:border-white/50 transition-all">
                    <div className="flex gap-4 p-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-black flex-shrink-0">
                        <ImageWithFallback
                          src={child.image}
                          alt={child.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-foreground dark:text-white">{child.name}</h3>
                            <p className="text-xs text-muted-foreground dark:text-[#99a1af]">{child.registration}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            child.status === 'Ativo' ? 'bg-green-500/20 text-green-600 dark:text-green-400' :
                            'bg-gray-500/20 text-gray-600 dark:text-gray-400'
                          }`}>
                            {child.status}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground dark:text-[#99a1af] space-y-1">
                          <p><strong>Sexo:</strong> {child.sex}</p>
                          <p><strong>Nascimento:</strong> {child.birthDate}</p>
                          <p><strong>Pai:</strong> {child.father}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documentos */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gray-500/10 dark:bg-gray-500/20 rounded-lg">
                  <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h2 className="text-lg text-foreground dark:text-white">Documentos Vinculados</h2>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af]">{documents.length} documentos</p>
                </div>
              </div>

              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl p-4 hover:border-primary dark:hover:border-white/50 transition-all">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 bg-primary/10 dark:bg-white/10 rounded-lg">
                          <FileText className="w-5 h-5 text-primary dark:text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-foreground dark:text-white">{doc.name}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground dark:text-[#99a1af] mt-1">
                            <span className="px-2 py-1 bg-primary/10 dark:bg-white/10 rounded">
                              {doc.type}
                            </span>
                            <span>{doc.date}</span>
                            <span>{doc.size}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={doc.status === 'Assinado' ? 'px-3 py-1 rounded-lg text-xs bg-green-500/20 text-green-600 dark:text-green-400' : 'px-3 py-1 rounded-lg text-xs bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'}>
                          {doc.status}
                        </span>
                        <button
                          onClick={() => {
                            toast.success(`Iniciando download: ${doc.name}`);
                          }}
                          className="p-2 bg-primary dark:bg-white hover:opacity-80 rounded-lg transition-opacity"
                          title="Baixar documento"
                        >
                          <Download className="w-4 h-4 text-white dark:text-black" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Saúde */}
          {activeTab === 'health' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-500/10 dark:bg-green-500/20 rounded-lg">
                  <Stethoscope className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h2 className="text-lg text-foreground dark:text-white">Histórico de Saúde</h2>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af]">{healthRecords.length} registros</p>
                </div>
              </div>

              <div className="space-y-4">
                {healthRecords.map((record) => {
                  const Icon = record.type === 'Vacina' ? Syringe :
                              record.type === 'Vermífugo' ? Pill :
                              record.type === 'Consulta' ? Stethoscope :
                              Activity;
                  
                  return (
                    <div key={record.id} className="bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-500/10 dark:bg-green-500/20 rounded-lg">
                          <Icon className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <span className="px-3 py-1 bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-lg text-xs">
                                {record.type}
                              </span>
                              <h3 className="text-foreground dark:text-white mt-2">{record.name}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">{record.date}</p>
                          </div>
                          <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-2">
                            <strong>Responsável:</strong> {record.veterinarian}
                          </p>
                          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                            {record.observations}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Histórico */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gray-500/10 dark:bg-gray-500/20 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h2 className="text-lg text-foreground dark:text-white">Linha do Tempo</h2>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Todos os eventos do animal</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="relative">
                {/* Linha vertical */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border dark:bg-[#3a3a3a]"></div>

                <div className="space-y-6">
                  {historyEvents.map((event) => {
                    const Icon = event.icon;
                    return (
                      <div key={event.id} className="relative flex items-start gap-4 pl-0">
                        {/* Ícone na linha */}
                        <div className={`relative z-10 p-2 bg-card dark:bg-[#1a1a1a] rounded-lg border-2 border-border dark:border-[#3a3a3a]`}>
                          <Icon className={`w-5 h-5 ${event.color}`} />
                        </div>
                        {/* Conteúdo */}
                        <div className="flex-1 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-foreground dark:text-white">{event.title}</p>
                              <p className="text-xs text-muted-foreground dark:text-[#99a1af] mt-1">
                                {event.date}
                              </p>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs ${event.color} bg-current/10`}>
                              {event.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}