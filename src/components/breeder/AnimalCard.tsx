import { ChevronLeft, ChevronRight, Edit, GitBranch, Baby, Award, Video, MapPin, Home } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

// Função auxiliar para formatar data de nascimento
function formatBirthDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
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
}

interface AnimalCardProps {
  animal: Animal;
  onClick: () => void;
  onEdit: () => void;
  onViewGenealogy: () => void;
  onViewVideo?: () => void;
}

export function AnimalCard({
  animal,
  onClick,
  onEdit,
  onViewGenealogy,
  onViewVideo,
}: AnimalCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? animal.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === animal.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  const handleGenealogyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewGenealogy();
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewVideo) {
      onViewVideo();
    } else {
      // FASE 17: Funcionalidade será implementada
      console.log('Ver vídeos do animal:', animal.name);
    }
  };

  return (
    <div
      className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] overflow-hidden hover:shadow-lg transition-shadow cursor-pointer relative"
      onClick={onClick}
    >
      {/* Image with Navigation */}
      <div className="relative w-full h-48 overflow-hidden group">
        <ImageWithFallback
          src={animal.images[currentImageIndex]}
          alt={animal.name}
          className="w-full h-full object-cover"
        />
        
        {/* Contador de fotos - sempre visível */}
        {animal.images.length > 1 && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/70 backdrop-blur-sm rounded-lg">
            <span className="text-xs text-white font-medium">
              {currentImageIndex + 1} / {animal.images.length}
            </span>
          </div>
        )}
        
        {/* Navigation Arrows - Only show if multiple images */}
        {animal.images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Próxima imagem"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            
            {/* Indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {animal.images.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    index === currentImageIndex
                      ? 'bg-white w-6'
                      : 'bg-white/60 w-2'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Action Buttons - Top Right */}
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={handleVideoClick}
            className="bg-purple-600 dark:bg-purple-500 text-white rounded-full p-2 hover:opacity-90 transition-opacity shadow-lg"
            title="Ver Vídeos"
          >
            <Video className="w-4 h-4" />
          </button>
          <button
            onClick={handleGenealogyClick}
            className="bg-green-600 dark:bg-green-500 text-white rounded-full p-2 hover:opacity-90 transition-opacity shadow-lg"
            title="Ver Genealogia"
          >
            <GitBranch className="w-4 h-4" />
          </button>
          <button
            onClick={handleEditClick}
            className="bg-primary dark:bg-white text-white dark:text-black rounded-full p-2 hover:opacity-90 transition-opacity shadow-lg"
            title="Editar Animal"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Caption - Below Image */}
      {animal.imageCaptions && animal.imageCaptions[currentImageIndex] && (
        <div className="px-4 py-2 bg-muted dark:bg-[#0d0d0d] border-b border-border dark:border-[rgba(255,255,255,0.1)]">
          <p className="text-xs text-muted-foreground dark:text-[#99a1af] text-center italic">
            {animal.imageCaptions[currentImageIndex]}
          </p>
        </div>
      )}
      
      {/* Card Content */}
      <div className="p-4">
        <p className="text-foreground dark:text-white mb-1">{animal.name}</p>
        <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">{animal.registry}</p>
        
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
        
        <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-3 mt-2">{animal.category} • {animal.age}</p>
        
        {animal.filhos !== undefined && animal.filhos > 0 && (
          <p className="text-xs text-primary dark:text-white mb-1 flex items-center gap-1">
            <Baby className="w-3 h-3" /> {animal.filhos} {animal.filhos === 1 ? 'filho' : 'filhos'}
          </p>
        )}
        
        {animal.premiacoes !== undefined && animal.premiacoes > 0 && (
          <p className="text-xs text-yellow-600 dark:text-yellow-500 mb-2 flex items-center gap-1">
            <Award className="w-3 h-3" /> {animal.premiacoes} {animal.premiacoes === 1 ? 'premiação' : 'premiações'}
          </p>
        )}
        
        <span className={`inline-block px-3 py-1 ${animal.statusColor} text-white text-xs rounded-full`}>
          {animal.status}
        </span>
      </div>
    </div>
  );
}