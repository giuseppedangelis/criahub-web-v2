import { ChevronLeft, ChevronRight, MapPin, Heart, Calendar, Award, Users, Baby, FileText, Stethoscope, Clock } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { GenealogyTree } from '../breeder/GenealogyTree';

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

interface AnimalDetailsContentProps {
  animal: Animal;
  activeTab: string;
  onTabChange?: (tab: string) => void;
}

function formatBirthDate(isoDate: string | undefined): string {
  if (!isoDate) return 'N/A';
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

export function AnimalDetailsContent({ animal, activeTab, onTabChange }: AnimalDetailsContentProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  // Visão Geral
  if (activeTab === 'overview') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Imagem Principal */}
          <div className="md:col-span-1 space-y-3">
            <div className="group relative w-full aspect-square rounded-xl overflow-hidden bg-black">
              <ImageWithFallback
                src={animalImages[currentImageIndex]}
                alt={animal.name}
                className="w-full h-full object-cover"
              />
              
              {/* Contador de imagens */}
              {animalImages.length > 1 && (
                <div className="absolute top-3 right-3 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-lg">
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
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2.5 bg-black/70 hover:bg-black/90 backdrop-blur-sm rounded-full opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-black/70 hover:bg-black/90 backdrop-blur-sm rounded-full opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>

                  {/* Indicadores de navegação */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
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
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] text-center">
                {animal.imageCaptions[currentImageIndex]}
              </p>
            )}
          </div>

          {/* Informações do Animal */}
          <div className="md:col-span-2 space-y-6">
            {/* Informações Básicas */}
            <div>
              <h2 className="text-lg text-foreground dark:text-white mb-4">Informações Básicas</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Registro</p>
                  <p className="text-foreground dark:text-white">{registryValue}</p>
                </div>
                {animal.chip && (
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Chip</p>
                    <p className="text-foreground dark:text-white">{animal.chip}</p>
                  </div>
                )}
                {animal.marca && (
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Marca</p>
                    <p className="text-foreground dark:text-white">{animal.marca}</p>
                  </div>
                )}
                {animal.sex && (
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Sexo</p>
                    <p className="text-foreground dark:text-white">{animal.sex}</p>
                  </div>
                )}
                {animal.birthDate && (
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Data de Nascimento</p>
                    <p className="text-foreground dark:text-white">{formatBirthDate(animal.birthDate)}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Idade</p>
                  <p className="text-foreground dark:text-white">{animal.age}</p>
                </div>
                {animal.coat && (
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Pelagem</p>
                    <p className="text-foreground dark:text-white">{animal.coat}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Categoria</p>
                  <p className="text-foreground dark:text-white">{animal.category}</p>
                </div>
                {animal.harasOrigem && (
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Haras de Origem</p>
                    <p className="text-foreground dark:text-white">{animal.harasOrigem}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Haras Atual</p>
                  <p className="text-foreground dark:text-white">{animal.haras}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${animal.statusColor}`}>
                    {animal.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Localização e Serviço */}
            {(animal.localizacao || animal.servicoTipo) && (
              <div>
                <h2 className="text-lg text-foreground dark:text-white mb-4">Localização e Serviço</h2>
                <div className="grid grid-cols-2 gap-4">
                  {animal.localizacao && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 dark:bg-white/10 rounded-lg">
                        <MapPin className="w-5 h-5 text-primary dark:text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Localização</p>
                        <p className="text-foreground dark:text-white">{animal.localizacao}</p>
                      </div>
                    </div>
                  )}
                  {animal.servicoTipo && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 dark:bg-white/10 rounded-lg">
                        <Calendar className="w-5 h-5 text-primary dark:text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Tipo de Serviço</p>
                        <p className="text-foreground dark:text-white">{animal.servicoTipo}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Genealogia Resumida */}
            <div>
              <h4 className="text-foreground dark:text-white mb-4">Genealogia</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Pai</p>
                  <p className="text-foreground dark:text-white">{animal.father || 'Trovão Branco'}</p>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af]">MM-2019-2468</p>
                </div>
                <div className="p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Mãe</p>
                  <p className="text-foreground dark:text-white">{animal.mother || 'Bella Vista'}</p>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af]">MM-2021-7890</p>
                </div>
              </div>
            </div>

            {/* Premiações Resumidas */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-foreground dark:text-white">Premiações</h4>
                {animal.premiacoes !== undefined && animal.premiacoes >= 0 && (
                  <span className="text-sm text-muted-foreground dark:text-[#99a1af]">
                    Total: {animal.premiacoes} {animal.premiacoes === 1 ? 'prêmio' : 'prêmios'}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <div className="p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg flex justify-between items-center">
                  <div>
                    <p className="text-foreground dark:text-white">Exposição Nacional ABCCMM 2024</p>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af]">15 de Agosto, 2024</p>
                  </div>
                  <span className="text-primary dark:text-white">1º Lugar</span>
                </div>
              </div>
            </div>

            {/* Reprodução */}
            {(animal.reproductionType || animal.sex === 'Macho' || animal.sex === 'Fêmea') && (
              <div>
                <h4 className="text-foreground dark:text-white mb-4">Reprodução</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {animal.reproductionType && (
                      <div className="p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
                        <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Tipo Reprodutivo</p>
                        <p className="text-foreground dark:text-white">{animal.reproductionType}</p>
                      </div>
                    )}
                    
                    {animal.activeForReproduction !== undefined && (
                      <div className="p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
                        <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Status Reprodutivo</p>
                        <p className="text-foreground dark:text-white">
                          {animal.activeForReproduction ? '✅ Ativo para Reprodução' : '❌ Inativo para Reprodução'}
                        </p>
                      </div>
                    )}

                    {animal.coverageCount !== undefined && animal.coverageCount > 0 && (
                      <div className="p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
                        <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Coberturas Realizadas</p>
                        <div className="flex items-center justify-between">
                          <p className="text-foreground dark:text-white text-xl">{animal.coverageCount}</p>
                        </div>
                      </div>
                    )}

                    {animal.lastReproductiveEvent && (
                      <div className="p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
                        <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Último Evento Reprodutivo</p>
                        <p className="text-foreground dark:text-white mb-1">{animal.lastReproductiveEvent.type}</p>
                        <p className="text-sm text-muted-foreground dark:text-[#99a1af]">{animal.lastReproductiveEvent.date}</p>
                      </div>
                    )}
                  </div>

                  {/* Filhos Registrados */}
                  {animal.filhos !== undefined && animal.filhos > 0 && (
                    <div className="p-4 bg-primary/10 dark:bg-white/10 border border-primary/20 dark:border-white/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-foreground dark:text-white mb-1">Descendentes Registrados</p>
                          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                            {animal.filhos} {animal.filhos === 1 ? 'filho registrado' : 'filhos registrados'}
                          </p>
                        </div>
                        {onTabChange && (
                          <button 
                            onClick={() => onTabChange('offspring')}
                            className="px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity text-sm"
                          >
                            Ver Filhos
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Genealogia
  if (activeTab === 'genealogy') {
    return (
      <div className="space-y-6">
        <GenealogyTree animalId={animal.id} animalName={animal.name} />
      </div>
    );
  }

  return null;
}
