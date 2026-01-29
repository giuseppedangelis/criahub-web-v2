import { ArrowLeft, Eye, Plus, Download, Trash2, FileText, ZoomIn, ZoomOut, RefreshCw, ChevronDown, Filter, X, Upload, ChevronLeft, ChevronRight, Video, Trophy, Calendar, Link, MoreVertical, Edit, Share2, MapPin, Home, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { GenealogyTree } from './GenealogyTree';
import { AwardsDetailModal } from './AwardsDetailModal';
import { AnimalLocationSection } from './AnimalLocationSection';
import { AnimalDocumentsSection } from './AnimalDocumentsSection';
import { HealthTabs } from './HealthTabs';
import { RegisterVeterinaryProcedureModal } from './RegisterVeterinaryProcedureModal';
import { RegisterVaccineModal } from './RegisterVaccineModal';
import { RegisterExamModal } from './RegisterExamModal';
import { NativeSelect } from '../ui/native-select';

// Função auxiliar para formatar data de nascimento (FASE 20)
function formatBirthDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

// FASE 30: Interface para Vídeos
interface Video {
  id: number;
  title: string;
  url: string;
  type: 'Marcha' | 'Competição' | 'Personalidade' | 'Genealogia' | 'Outro';
  thumbnail?: string;
  duration?: string;
  uploadDate: string;
  visibility: 'Público' | 'Privado';
  source: 'upload' | 'youtube' | 'vimeo';
  caption?: string; // Legenda do vídeo
}

// FASE 33: Interface para Premiações
interface Award {
  id: number;
  eventName: string;
  date: string;
  location: string;
  category: string;
  placement: string;
  placementType: '1º Lugar' | '2º Lugar' | '3º Lugar' | 'Campeão' | 'Reservado' | 'Menção Honrosa';
  points?: number;
  description?: string;
  photos: string[];
  certificate?: string;
}

interface Animal {
  id: number;
  name: string;
  registry: string;
  chip?: string;  // Chip RFID
  marca?: string; // Número da marca/ferro
  sex?: 'Macho' | 'Fêmea'; // FASE 19: Sexo do animal
  birthDate?: string; // FASE 20: Data de nascimento (ISO format)
  harasOrigem?: string; // FASE 19: Haras de origem
  category: string;
  age: string;
  haras: string;
  status: string;
  statusColor: string;
  // NOVOS CAMPOS: Gestão de Status no Plantel (Ativo/Inativo)
  statusAtividade?: 'Ativo' | 'Inativo'; // Status no Plantel
  motivoInativacao?: 'Vendido' | 'Óbito' | 'Doado' | 'Transferido'; // Motivo da inativação
  dataInativacao?: string; // Data da inativação (ISO format)
  statusHistorico?: Array<{ // Histórico de mudanças de status
    data: string;
    statusAnterior: string;
    statusNovo: string;
    motivo?: string;
    usuario: string;
  }>;
  localizacao?: string;  // Baia, Pasto, Serviço
  servicoTipo?: string;  // Reprodução, Trabalho, Repouso, Outro
  filhos?: number;  // Contador de descendentes
  premiacoes?: number;  // Contador de prêmios importados
  image: string;
  images: string[];
  imageCaptions?: string[];
  // FASE 25-27: Campos de Reprodução
  reproductionType?: 'Doadora' | 'Matriz' | 'Garanhão' | 'Castrado' | 'Receptora';
  activeForReproduction?: boolean;
  coverageCount?: number; // FASE 26: Contador de coberturas
  lastReproductiveEvent?: { // FASE 27: Último evento reprodutivo
    type: string;
    date: string;
  };
  videos?: Video[]; // FASE 30: Galeria de vídeos
}

interface BreederAnimalDetailsProps {
  animal: Animal;
  onBack: () => void;
  onEdit: () => void;
  onViewAnimal?: (animalId: number) => void;
  initialTab?: string; // Aba inicial a ser exibida
}

export function BreederAnimalDetails({ animal, onBack, onEdit, onViewAnimal, initialTab = 'overview' }: BreederAnimalDetailsProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [documentTab, setDocumentTab] = useState('todos');
  const [showAddDocumentModal, setShowAddDocumentModal] = useState(false);
  const [showAddVaccineModal, setShowAddVaccineModal] = useState(false);
  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{ name: string; type: string; size: string; date: string } | null>(null);
  const [selectedFilters, setSelectedFilters] = useState({
    filhos: true,
    pais: true,
    avos: true,
    bisavos: true,
  });
  const [showFullGenealogyTree, setShowFullGenealogyTree] = useState(false);
  // FASE 29: Estados para filtros da aba Filhos
  const [offspringFilters, setOffspringFilters] = useState({
    sex: 'all',
    category: 'all',
    status: 'all',
  });
  // FASE 30-32: Estados para Vídeos
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showEditVideoModal, setShowEditVideoModal] = useState(false);
  const [showDeleteVideoModal, setShowDeleteVideoModal] = useState(false);
  const [videoToEdit, setVideoToEdit] = useState<Video | null>(null);
  const [videoToDelete, setVideoToDelete] = useState<Video | null>(null);
  const [activeVideoMenu, setActiveVideoMenu] = useState<number | null>(null);
  // FASE 31: Estados para formulário de vídeo
  const [videoInputMethod, setVideoInputMethod] = useState<'upload' | 'link'>('link');
  const [videoFormData, setVideoFormData] = useState({
    title: '',
    url: '',
    type: 'Marcha' as Video['type'],
    visibility: 'Público' as Video['visibility'],
    caption: '',
  });
  // NOVOS ESTADOS: Modal de Inativação
  const [showInactivateModal, setShowInactivateModal] = useState(false);
  const [inactivateReason, setInactivateReason] = useState<'Vendido' | 'Óbito' | 'Doado' | 'Transferido'>('Vendido');
  const [inactivateDate, setInactivateDate] = useState(new Date().toISOString().split('T')[0]);
  // FASE 33-37: Estados para Premiações
  const [showAddAwardModal, setShowAddAwardModal] = useState(false);
  const [showAwardDetailsModal, setShowAwardDetailsModal] = useState(false);
  const [selectedAward, setSelectedAward] = useState<Award | null>(null);
  const [awardFilters, setAwardFilters] = useState({
    year: 'all',
    placement: 'all',
  });
  const [awardSortBy, setAwardSortBy] = useState<'recent' | 'oldest' | 'placement'>('recent');
  // FASE 38: Estado para modal de detalhes completos de premiações
  const [showAwardsFullDetailsModal, setShowAwardsFullDetailsModal] = useState(false);
  // BLOCO 13: Estados para módulo de saúde
  const [showRegisterProcedureModal, setShowRegisterProcedureModal] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Visão Geral' },
    { id: 'videos', label: 'Vídeos' },
    ...(animal.premiacoes && animal.premiacoes > 0 ? [{ id: 'awards', label: `Premiações (${animal.premiacoes})` }] : []),
    { id: 'location', label: 'Localização' },
    { id: 'health', label: 'Saúde' },
    { id: 'genealogy', label: 'Genealogia' },
    ...(animal.filhos && animal.filhos > 0 ? [{ id: 'offspring', label: `Filhos (${animal.filhos})` }] : []),
    { id: 'documents', label: 'Documentos' },
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

  // NOVO: useEffect para fechar modal com tecla ESC
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showInactivateModal) {
          setShowInactivateModal(false);
        }
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showInactivateModal]);

  // Ensure we have images array
  const animalImages = animal.images || [animal.image];

  // useEffect para fechar menu de vídeo ao clicar fora
  useEffect(() => {
    const handleClickOutside = () => {
      if (activeVideoMenu !== null) {
        setActiveVideoMenu(null);
      }
    };

    if (activeVideoMenu !== null) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [activeVideoMenu]);

  // FASE 28: Dados mockados dos filhos
  const offspringData = animal.id === 1 ? [
    {
      id: 101,
      name: 'Diamante da Estrela',
      image: 'https://images.unsplash.com/photo-1667992711873-4bd87cbfbb65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVzdG51dCUyMGhvcnNlfGVufDF8fHx8MTc2MzUwMDExNHww&ixlib=rb-4.1.0&q=80&w=1080',
      birthDate: '2023-03-15',
      sex: 'Fêmea',
      category: 'Potro',
      status: 'Ativo',
      registry: 'MM-2023-1001'
    },
    {
      id: 102,
      name: 'Trovão da Estrela',
      image: 'https://images.unsplash.com/photo-1751715773655-2140695a3a9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmV5JTIwaG9yc2UlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjM1MDAxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      birthDate: '2022-08-20',
      sex: 'Macho',
      category: 'Reprodutor',
      status: 'Ativo',
      registry: 'MM-2022-1002'
    }
  ] : animal.id === 2 ? [
    {
      id: 201,
      name: 'Relâmpago Jr',
      image: 'https://images.unsplash.com/photo-1656964353220-99aa5acc47e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHN0YWxsaW9uJTIwaG9yc2V8ZW58MXx8fHwxNzYzNTAwMTEzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      birthDate: '2023-05-10',
      sex: 'Macho',
      category: 'Potro',
      status: 'Ativo',
      registry: 'MM-2023-2001'
    }
  ] : animal.id === 204 ? [
    // Serena - Matriz com 11 filhos
    {
      id: 2041,
      name: 'Aurora da Serena',
      image: 'https://images.unsplash.com/photo-1667992711873-4bd87cbfbb65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVzdG51dCUyMGhvcnNlfGVufDF8fHx8MTc2MzUwMDExNHww&ixlib=rb-4.1.0&q=80&w=1080',
      birthDate: '2022-02-10',
      sex: 'Fêmea',
      category: 'Reprodutora',
      status: 'Ativo',
      registry: 'MM-2022-2041'
    },
    {
      id: 2042,
      name: 'Brilhante da Serena',
      image: 'https://images.unsplash.com/photo-1751715773655-2140695a3a9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmV5JTIwaG9yc2UlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjM1MDAxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      birthDate: '2021-11-22',
      sex: 'Macho',
      category: 'Reprodutor',
      status: 'Ativo',
      registry: 'MM-2021-2042'
    },
    {
      id: 2043,
      name: 'Cristal da Serena',
      image: 'https://images.unsplash.com/photo-1657150946362-3aee0bbc8163?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWxvbWlubyUyMGhvcnNlfGVufDF8fHx8MTc2MzUwMDExNHww&ixlib=rb-4.1.0&q=80&w=1080',
      birthDate: '2021-05-15',
      sex: 'Fêmea',
      category: 'Reprodutora',
      status: 'Ativo',
      registry: 'MM-2021-2043'
    },
    {
      id: 2044,
      name: 'Diamante da Serena',
      image: 'https://images.unsplash.com/photo-1656964353220-99aa5acc47e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHN0YWxsaW9uJTIwaG9yc2V8ZW58MXx8fHwxNzYzNTAwMTEzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      birthDate: '2020-09-08',
      sex: 'Macho',
      category: 'Reprodutor',
      status: 'Vendido',
      registry: 'MM-2020-2044'
    },
    {
      id: 2045,
      name: 'Esmeralda da Serena',
      image: 'https://images.unsplash.com/photo-1667992711873-4bd87cbfbb65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVzdG51dCUyMGhvcnNlfGVufDF8fHx8MTc2MzUwMDExNHww&ixlib=rb-4.1.0&q=80&w=1080',
      birthDate: '2020-03-12',
      sex: 'Fêmea',
      category: 'Reprodutora',
      status: 'Ativo',
      registry: 'MM-2020-2045'
    },
    {
      id: 2046,
      name: 'Fênix da Serena',
      image: 'https://images.unsplash.com/photo-1608710665474-ad5b01e0ebf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMGhvcnNlJTIwZ3JhemluZyUyMGZpZWxkfGVufDF8fHx8MTc2NDEyMDU1NHww&ixlib=rb-4.1.0&q=80&w=1080',
      birthDate: '2019-12-20',
      sex: 'Fêmea',
      category: 'Reprodutora',
      status: 'Gestante',
      registry: 'MM-2019-2046'
    },
    {
      id: 2047,
      name: 'Guardião da Serena',
      image: 'https://images.unsplash.com/photo-1751715773655-2140695a3a9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmV5JTIwaG9yc2UlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjM1MDAxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      birthDate: '2019-07-05',
      sex: 'Macho',
      category: 'Reprodutor',
      status: 'Ativo',
      registry: 'MM-2019-2047'
    },
    {
      id: 2048,
      name: 'Harmonia da Serena',
      image: 'https://images.unsplash.com/photo-1657150946362-3aee0bbc8163?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWxvbWlubyUyMGhvcnNlfGVufDF8fHx8MTc2MzUwMDExNHww&ixlib=rb-4.1.0&q=80&w=1080',
      birthDate: '2019-01-28',
      sex: 'Fêmea',
      category: 'Reprodutora',
      status: 'Ativo',
      registry: 'MM-2019-2048'
    },
    {
      id: 2049,
      name: 'Imperial da Serena',
      image: 'https://images.unsplash.com/photo-1656964353220-99aa5acc47e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHN0YWxsaW9uJTIwaG9yc2V8ZW58MXx8fHwxNzYzNTAwMTEzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      birthDate: '2018-10-15',
      sex: 'Macho',
      category: 'Potro',
      status: 'Ativo',
      registry: 'MM-2018-2049'
    },
    {
      id: 2050,
      name: 'Joia da Serena',
      image: 'https://images.unsplash.com/photo-1667992711873-4bd87cbfbb65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVzdG51dCUyMGhvcnNlfGVufDF8fHx8MTc2MzUwMDExNHww&ixlib=rb-4.1.0&q=80&w=1080',
      birthDate: '2018-04-03',
      sex: 'Fêmea',
      category: 'Potro',
      status: 'Ativo',
      registry: 'MM-2018-2050'
    },
    {
      id: 2051,
      name: 'Lendário da Serena',
      image: 'https://images.unsplash.com/photo-1608710665474-ad5b01e0ebf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMGhvcnNlJTIwZ3JhemluZyUyMGZpZWxkfGVufDF8fHx8MTc2NDEyMDU1NHww&ixlib=rb-4.1.0&q=80&w=1080',
      birthDate: '2017-11-18',
      sex: 'Macho',
      category: 'Reprodutor',
      status: 'Vendido',
      registry: 'MM-2017-2051'
    }
  ] : [
    // Dados padrão para qualquer outro animal
    {
      id: 101,
      name: 'Diamante da Estrela',
      image: 'https://images.unsplash.com/photo-1667992711873-4bd87cbfbb65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVzdG51dCUyMGhvcnNlfGVufDF8fHx8MTc2MzUwMDExNHww&ixlib=rb-4.1.0&q=80&w=1080',
      birthDate: '2023-03-15',
      sex: 'Fêmea',
      category: 'Potro',
      status: 'Ativo',
      registry: 'MM-2023-1001'
    },
    {
      id: 102,
      name: 'Trovão da Estrela',
      image: 'https://images.unsplash.com/photo-1751715773655-2140695a3a9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmV5JTIwaG9yc2UlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjM1MDAxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      birthDate: '2022-08-20',
      sex: 'Macho',
      category: 'Reprodutor',
      status: 'Ativo',
      registry: 'MM-2022-1002'
    },
    {
      id: 103,
      name: 'Bela da Estrela',
      image: 'https://images.unsplash.com/photo-1657150946362-3aee0bbc8163?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWxvbWlubyUyMGhvcnNlfGVufDF8fHx8MTc2MzUwMDExNHww&ixlib=rb-4.1.0&q=80&w=1080',
      birthDate: '2021-11-10',
      sex: 'Fêmea',
      category: 'Reprodutora',
      status: 'Gestante',
      registry: 'MM-2021-1003'
    },
    {
      id: 104,
      name: 'Relâmpago da Estrela',
      image: 'https://images.unsplash.com/photo-1656964353220-99aa5acc47e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHN0YWxsaW9uJTIwaG9yc2V8ZW58MXx8fHwxNzYzNTAwMTEzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      birthDate: '2020-05-22',
      sex: 'Macho',
      category: 'Reprodutor',
      status: 'Vendido',
      registry: 'MM-2020-1004'
    },
    {
      id: 105,
      name: 'Aurora da Estrela',
      image: 'https://images.unsplash.com/photo-1608710665474-ad5b01e0ebf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMGhvcnNlJTIwZ3JhemluZyUyMGZpZWxkfGVufDF8fHx8MTc2NDEyMDU1NHww&ixlib=rb-4.1.0&q=80&w=1080',
      birthDate: '2024-01-08',
      sex: 'Fêmea',
      category: 'Potro',
      status: 'Ativo',
      registry: 'MM-2024-1005'
    }
  ];

  // FASE 30: Dados mockados de vídeos
  const videosData: Video[] = [
    {
      id: 1,
      title: 'Demonstração de Marcha Batida',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      type: 'Marcha',
      thumbnail: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3JzZSUyMGdhbGxvcHxlbnwxfHx8fDE3NjM1MDAxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      duration: '2:45',
      uploadDate: '2024-11-15',
      visibility: 'Público',
      source: 'youtube',
      caption: 'Marcha batida em pista de avaliação - Demonstração de regularidade e qualidade de andamento'
    },
    {
      id: 2,
      title: 'Campeonato Regional 2023',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      type: 'Competição',
      thumbnail: 'https://images.unsplash.com/photo-1568042424740-e4d3e4ae9f6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3JzZSUyMGNvbXBldGl0aW9ufGVufDF8fHx8MTc2MzUwMDExNHww&ixlib=rb-4.1.0&q=80&w=1080',
      duration: '5:20',
      uploadDate: '2024-10-20',
      visibility: 'Público',
      source: 'youtube',
      caption: 'Apresentação que garantiu o 1º lugar na categoria Reprodutor Sênior'
    },
    {
      id: 3,
      title: 'Interação com Potros',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      type: 'Personalidade',
      thumbnail: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3JzZSUyMGdhbGxvcHxlbnwxfHx8fDE3NjM1MDAxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      duration: '1:30',
      uploadDate: '2024-12-01',
      visibility: 'Privado',
      source: 'upload',
      caption: 'Temperamento dócil e interação positiva com descendentes'
    }
  ];

  // FASE 33-34: Dados mockados de premiações
  const awardsData: Award[] = [
    {
      id: 1,
      eventName: 'Exposição Nacional ABCCMM 2024',
      date: '2024-11-15',
      location: 'Belo Horizonte - MG',
      category: 'Garanhão Adulto',
      placement: '1º Lugar',
      placementType: '1º Lugar',
      points: 98,
      description: 'Campeão da categoria Garanhão Adulto com excelente avaliação em marcha e morfologia.',
      photos: ['https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3JzZSUyMGdhbGxvcHxlbnwxfHx8fDE3NjM1MDAxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080'],
      certificate: 'certificado_nacional_2024.pdf'
    },
    {
      id: 2,
      eventName: 'Copa dos Campeões 2024',
      date: '2024-08-20',
      location: 'São Paulo - SP',
      category: 'Marcha Batida',
      placement: 'Campeão',
      placementType: 'Campeão',
      points: 100,
      description: 'Grande Campeão da Copa com pontuação máxima em marcha batida.',
      photos: ['https://images.unsplash.com/photo-1568042424740-e4d3e4ae9f6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3JzZSUyMGNvbXBldGl0aW9ufGVufDF8fHx8MTc2MzUwMDExNHww&ixlib=rb-4.1.0&q=80&w=1080'],
    },
    {
      id: 3,
      eventName: 'Expo Mangalarga Regional Sul',
      date: '2024-05-10',
      location: 'Curitiba - PR',
      category: 'Melhor Andamento',
      placement: '2º Lugar',
      placementType: '2º Lugar',
      points: 95,
      description: 'Segundo colocado na categoria de melhor andamento.',
      photos: ['https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3JzZSUyMGdhbGxvcHxlbnwxfHx8fDE3NjM1MDAxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080'],
    },
    {
      id: 4,
      eventName: 'Torneio Estadual de Marcha 2023',
      date: '2023-10-15',
      location: 'Rio de Janeiro - RJ',
      category: 'Garanhão Júnior',
      placement: '1º Lugar',
      placementType: '1º Lugar',
      points: 97,
      description: 'Campeão da categoria júnior com destaque em conformação.',
      photos: ['https://images.unsplash.com/photo-1568042424740-e4d3e4ae9f6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3JzZSUyMGNvbXBldGl0aW9ufGVufDF8fHx8MTc2MzUwMDExNHww&ixlib=rb-4.1.0&q=80&w=1080'],
    },
    {
      id: 5,
      eventName: 'Feira Nacional do Cavalo 2023',
      date: '2023-07-22',
      location: 'Goiânia - GO',
      category: 'Morfologia',
      placement: 'Reservado Campeão',
      placementType: 'Reservado',
      points: 96,
      description: 'Reservado campeão em morfologia com excelente pontuação.',
      photos: ['https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3JzZSUyMGdhbGxvcHxlbnwxfHx8fDE3NjM1MDAxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080'],
    },
    {
      id: 6,
      eventName: 'Exposição de Inverno 2023',
      date: '2023-06-10',
      location: 'Poços de Caldas - MG',
      category: 'Apresentação',
      placement: '3º Lugar',
      placementType: '3º Lugar',
      points: 92,
      description: 'Terceiro lugar na categoria de apresentação.',
      photos: ['https://images.unsplash.com/photo-1568042424740-e4d3e4ae9f6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3JzZSUyMGNvbXBldGl0aW9ufGVufDF8fHx8MTc2MzUwMDExNHww&ixlib=rb-4.1.0&q=80&w=1080'],
    },
  ];

  // FASE 37: Aplicar filtros e ordenação às premiações
  const filteredAndSortedAwards = awardsData
    .filter(award => {
      const year = award.date.split('-')[0];
      if (awardFilters.year !== 'all' && year !== awardFilters.year) return false;
      if (awardFilters.placement !== 'all' && award.placementType !== awardFilters.placement) return false;
      return true;
    })
    .sort((a, b) => {
      if (awardSortBy === 'recent') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (awardSortBy === 'oldest') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (awardSortBy === 'placement') {
        const order = { 'Campeão': 1, '1º Lugar': 2, '2º Lugar': 3, '3º Lugar': 4, 'Reservado': 5, 'Menção Honrosa': 6 };
        return order[a.placementType] - order[b.placementType];
      }
      return 0;
    });

  // FASE 29: Aplicar filtros aos filhos
  const filteredOffspring = offspringData.filter(offspring => {
    if (offspringFilters.sex !== 'all' && offspring.sex !== offspringFilters.sex) return false;
    if (offspringFilters.category !== 'all' && offspring.category !== offspringFilters.category) return false;
    if (offspringFilters.status !== 'all' && offspring.status !== offspringFilters.status) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header com Breadcrumb e Botão Voltar */}
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
            <h1 className="text-2xl text-foreground dark:text-white mb-2">{animal.name}</h1>
            <p className="text-muted-foreground dark:text-[#99a1af]">{animal.registry}</p>
          </div>
          <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
            {animal.statusAtividade !== 'Inativo' && (
              <button
                onClick={() => setShowInactivateModal(true)}
                className="w-full md:w-auto px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Marcar como Inativo
              </button>
            )}
            <button className="w-full md:w-auto px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2" onClick={onEdit}>
              Editar Animal
            </button>
          </div>
        </div>
      </div>

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
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-3">
                  <div className="group relative w-full aspect-square rounded-xl overflow-hidden bg-black">
                    <ImageWithFallback
                      src={animalImages[currentImageIndex]}
                      alt={animal.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Contador de imagens - sempre visível */}
                    {animalImages.length > 1 && (
                      <div className="absolute top-3 right-3 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-lg">
                        <span className="text-sm text-white font-medium">
                          {currentImageIndex + 1} / {animalImages.length}
                        </span>
                      </div>
                    )}

                    {/* Setas de navegação - sempre visíveis em mobile, hover em desktop */}
                    {animalImages.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 p-2.5 bg-black/70 hover:bg-black/90 backdrop-blur-sm rounded-full opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                          aria-label="Imagem anterior"
                        >
                          <ChevronLeft className="w-6 h-6 text-white" />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-black/70 hover:bg-black/90 backdrop-blur-sm rounded-full opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                          aria-label="Próxima imagem"
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
                              aria-label={`Ir para imagem ${index + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Legenda da imagem - sempre visível se existir */}
                  {animal.imageCaptions && animal.imageCaptions[currentImageIndex] && (
                    <div className="px-4 py-3 bg-muted dark:bg-[#0d0d0d] rounded-lg border border-border dark:border-[rgba(255,255,255,0.1)]">
                      <p className="text-sm text-foreground dark:text-white text-center italic">
                        {animal.imageCaptions[currentImageIndex]}
                      </p>
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <h4 className="text-foreground dark:text-white mb-4">Informações Básicas</h4>
                  {/* FASE 21: Grid 2 colunas para melhor organização */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {/* Coluna 1: Informações gerais */}
                    <div className="space-y-4">
                      {animal.sex && <InfoRow label="Sexo" value={animal.sex} />}
                      <InfoRow label="Categoria" value={animal.category} />
                      <InfoRow label="Idade" value={animal.age} />
                      {animal.birthDate && <InfoRow label="Nascimento" value={formatBirthDate(animal.birthDate)} />}
                      <InfoRow label="Status Reprodutivo" value={animal.status} />
                      {/* Novo: Status no Plantel */}
                      <InfoRow 
                        label="Status no Plantel" 
                        value={animal.statusAtividade || 'Ativo'}
                        valueClassName={animal.statusAtividade === 'Inativo' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}
                      />
                      {animal.statusAtividade === 'Inativo' && animal.motivoInativacao && (
                        <InfoRow label="Motivo" value={animal.motivoInativacao} />
                      )}
                      {animal.statusAtividade === 'Inativo' && animal.dataInativacao && (
                        <InfoRow label="Data da Inativação" value={formatBirthDate(animal.dataInativacao)} />
                      )}
                      {animal.localizacao && <LocationBadge localizacao={animal.localizacao} servicoTipo={animal.servicoTipo} />}
                    </div>
                    
                    {/* Coluna 2: Identificação e genealogia */}
                    <div className="space-y-4">
                      {animal.chip && <InfoRow label="Chip RFID" value={animal.chip} />}
                      {animal.marca && <InfoRow label="Marca/Ferro" value={animal.marca} />}
                      <InfoRow label="Haras Atual" value={animal.haras} />
                      {animal.harasOrigem && <InfoRow label="Haras de Origem" value={animal.harasOrigem} />}
                      {animal.filhos !== undefined && animal.filhos >= 0 && (
                        <InfoRow label="Filhos Registrados" value={String(animal.filhos)} />
                      )}
                      {animal.premiacoes !== undefined && animal.premiacoes > 0 && (
                        <InfoRow label="Premiações" value={String(animal.premiacoes)} />
                      )}
                      <InfoRow label="Pelagem" value="Alazã" />
                      <InfoRow label="Andamento" value="Marchado" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-foreground dark:text-white mb-4">Genealogia</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Pai</p>
                    <p className="text-foreground dark:text-white">Trovão Branco</p>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af]">MM-2019-2468</p>
                  </div>
                  <div className="p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Mãe</p>
                    <p className="text-foreground dark:text-white">Bella Vista</p>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af]">MM-2021-7890</p>
                  </div>
                </div>
              </div>

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
                      <p className="text-foreground dark:text-white">Exposição Nacional ABCCMM 2023</p>
                      <p className="text-sm text-muted-foreground dark:text-[#99a1af]">15 de Agosto, 2023</p>
                    </div>
                    <span className="text-primary dark:text-white">1º Lugar</span>
                  </div>
                </div>
              </div>

              {/* NOVA SEÇÃO: Histórico de Mudanças de Status */}
              {animal.statusHistorico && animal.statusHistorico.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-foreground dark:text-white">Histórico de Mudanças de Status</h4>
                  </div>
                  <div className="space-y-2">
                    {animal.statusHistorico.map((historico, index) => (
                      <div key={index} className="p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg border-l-4 border-primary dark:border-white">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-foreground dark:text-white">
                              <span className="text-red-600 dark:text-red-400">{historico.statusAnterior}</span>
                              {' → '}
                              <span className={historico.statusNovo === 'Inativo' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>
                                {historico.statusNovo}
                              </span>
                            </p>
                            {historico.motivo && (
                              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-1">
                                Motivo: {historico.motivo}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                              {formatBirthDate(historico.data)}
                            </p>
                            <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
                              {historico.usuario}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FASE 25-27: Seção Reprodução */}
              {(animal.reproductionType || animal.sex === 'Macho' || animal.sex === 'Fêmea') && (
                <div>
                  <h4 className="text-foreground dark:text-white mb-4">Reprodução</h4>
                  <div className="space-y-4">
                    {/* Grid de informações reprodutivas */}
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

                      {/* FASE 26: Contador de Coberturas */}
                      {animal.coverageCount !== undefined && animal.coverageCount > 0 && (
                        <div className="p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
                          <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Coberturas Realizadas</p>
                          <div className="flex items-center justify-between">
                            <p className="text-foreground dark:text-white text-xl">{animal.coverageCount}</p>
                            <button 
                              onClick={() => alert('Funcionalidade de detalhes de coberturas será implementada em breve')}
                              className="text-sm text-primary dark:text-white hover:underline"
                            >
                              Ver Detalhes →
                            </button>
                          </div>
                        </div>
                      )}

                      {/* FASE 27: Último Evento Reprodutivo */}
                      {animal.lastReproductiveEvent && (
                        <div className="p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
                          <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Último Evento Reprodutivo</p>
                          <p className="text-foreground dark:text-white mb-1">{animal.lastReproductiveEvent.type}</p>
                          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">{animal.lastReproductiveEvent.date}</p>
                          <button 
                            onClick={() => alert('Funcionalidade de detalhes do evento reprodutivo será implementada em breve')}
                            className="mt-2 text-sm text-primary dark:text-white hover:underline"
                          >
                            Ver Evento Completo →
                          </button>
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
                          <button 
                            onClick={() => setActiveTab('offspring')}
                            className="px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity text-sm"
                          >
                            Ver Filhos
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* BLOCO 13: Módulo de Saúde Consolidado */}
          {activeTab === 'health' && (
            <HealthTabs 
              animalId={animal.id} 
              animalName={animal.name}
              onRegisterProcedure={() => setShowRegisterProcedureModal(true)}
              onRegisterVaccine={() => setShowAddVaccineModal(true)}
              onRegisterExam={() => setShowAddExamModal(true)}
            />
          )}

          {activeTab === 'genealogy' && (
            <div className="space-y-6">
              <div className="space-y-4 mb-6">
                {/* Título e Botão */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-xl text-foreground dark:text-white">Árvore Genealógica</h4>
                  {/* FASE 23: Botão Ver Árvore Completa */}
                  <button
                    onClick={() => setShowFullGenealogyTree(true)}
                    className="w-full sm:w-auto px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity text-sm flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Ver Árvore Completa
                  </button>
                </div>
                
                {/* Controles */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Zoom Out */}
                  <button
                    onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
                    className="p-2 border border-border dark:border-[#333333] rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
                    aria-label="Diminuir zoom"
                  >
                    <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground dark:text-[#BCC1CA]" />
                  </button>
                  
                  {/* Zoom Level */}
                  <div className="px-3 py-2 border border-border dark:border-[#333333] rounded-lg">
                    <span className="text-sm text-foreground dark:text-white">{zoomLevel}%</span>
                  </div>
                  
                  {/* Zoom In */}
                  <button
                    onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}
                    className="p-2 border border-border dark:border-[#333333] rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
                    aria-label="Aumentar zoom"
                  >
                    <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground dark:text-[#BCC1CA]" />
                  </button>
                  
                  {/* Dropdown Mostrar até */}
                  <div className="relative flex-1 sm:flex-initial">
                    <button
                      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                      className="w-full sm:w-auto px-3 sm:px-4 py-2 border border-border dark:border-[#333333] rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="text-sm text-foreground dark:text-white">Mostrar até</span>
                      <ChevronDown className="w-4 h-4 text-foreground dark:text-white" />
                    </button>
                    
                    {showFilterDropdown && (
                      <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-48 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#3a3a3a] rounded-xl shadow-lg z-10 p-4">
                        <div className="space-y-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedFilters.filhos}
                              onChange={(e) => setSelectedFilters({ ...selectedFilters, filhos: e.target.checked })}
                              className="w-4 h-4 rounded border-gray-300 dark:border-[#333333] bg-white dark:bg-[#0d0d0d] text-primary focus:ring-2 focus:ring-primary dark:focus:ring-white"
                            />
                            <span className="text-sm text-foreground dark:text-white">Filhos</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedFilters.pais}
                              onChange={(e) => setSelectedFilters({ ...selectedFilters, pais: e.target.checked })}
                              className="w-4 h-4 rounded border-gray-300 dark:border-[#333333] bg-white dark:bg-[#0d0d0d] text-primary focus:ring-2 focus:ring-primary dark:focus:ring-white"
                            />
                            <span className="text-sm text-foreground dark:text-white">Pais</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedFilters.avos}
                              onChange={(e) => setSelectedFilters({ ...selectedFilters, avos: e.target.checked })}
                              className="w-4 h-4 rounded border-gray-300 dark:border-[#333333] bg-white dark:bg-[#0d0d0d] text-primary focus:ring-2 focus:ring-primary dark:focus:ring-white"
                            />
                            <span className="text-sm text-foreground dark:text-white">Avós</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedFilters.bisavos}
                              onChange={(e) => setSelectedFilters({ ...selectedFilters, bisavos: e.target.checked })}
                              className="w-4 h-4 rounded border-gray-300 dark:border-[#333333] bg-white dark:bg-[#0d0d0d] text-primary focus:ring-2 focus:ring-primary dark:focus:ring-white"
                            />
                            <span className="text-sm text-foreground dark:text-white">Bisavós</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Refresh */}
                  <button
                    onClick={() => {
                      setZoomLevel(100);
                      setSelectedFilters({ filhos: true, pais: true, avos: true, bisavos: true });
                    }}
                    className="p-2 border border-border dark:border-[#333333] rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
                    aria-label="Resetar visualização"
                  >
                    <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground dark:text-[#BCC1CA]" />
                  </button>
                </div>
              </div>
              
              {/* Container com zoom aplicado */}
              <div className="overflow-auto">
                <div 
                  style={{ 
                    transform: `scale(${zoomLevel / 100})`,
                    transformOrigin: 'top center',
                    transition: 'transform 0.2s ease-out'
                  }}
                  className="space-y-6"
                >
                  {/* Nível 1 - Animal Principal */}
                  <div className="flex justify-center">
                <GenealogyCard
                  name={animal.name}
                  registry={animal.registry}
                  image={animal.image}
                  isMain={true}
                />
              </div>

              {/* Título Pais */}
              <div className="text-center">
                <h5 className="text-lg text-foreground dark:text-white">Pais</h5>
              </div>

              {/* Nível 2 - Pais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <GenealogyCard
                  name="Ouro"
                  registry="ABCCMM 123456-78"
                  image="https://images.unsplash.com/photo-1656964353220-99aa5acc47e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHN0YWxsaW9uJTIwaG9yc2V8ZW58MXx8fHwxNzYzNTAwMTEzfDA&ixlib=rb-4.1.0&q=80&w=1080"
                  onViewDetails={() => onViewAnimal?.(101)}
                />
                <GenealogyCard
                  name="Aurora"
                  registry="ABCCMM 654321-89"
                  image="https://images.unsplash.com/photo-1610137856583-e71966c4351d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMGhvcnNlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYzNDA4Njk3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  onViewDetails={() => onViewAnimal?.(102)}
                />
              </div>

              {/* Título Avós */}
              <div className="text-center">
                <h5 className="text-lg text-foreground dark:text-white">Avós</h5>
              </div>

              {/* Nível 3 - Avós */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <GenealogyCard
                  name="Hércules"
                  registry="ABCCMM 111111-11"
                  image="https://images.unsplash.com/photo-1724783483178-79f7ef970c6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGhvcnNlJTIwbWFyZXxlbnwxfHx8fDE3NjM1MDAxMTN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  isSmall={true}
                  onViewDetails={() => onViewAnimal?.(201)}
                />
                <GenealogyCard
                  name="Safira"
                  registry="ABCCMM 222222-22"
                  image="https://images.unsplash.com/photo-1667992711873-4bd87cbfbb65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVzdG51dCUyMGhvcnNlfGVufDF8fHx8MTc2MzUwMDExNHww&ixlib=rb-4.1.0&q=80&w=1080"
                  isSmall={true}
                  onViewDetails={() => onViewAnimal?.(202)}
                />
                <GenealogyCard
                  name="Trovão"
                  registry="ABCCMM 333333-33"
                  image="https://images.unsplash.com/photo-1751715773655-2140695a3a9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmV5JTIwaG9yc2UlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjM1MDAxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  isSmall={true}
                  onViewDetails={() => onViewAnimal?.(203)}
                />
                <GenealogyCard
                  name="Serena"
                  registry="ABCCMM 444444-44"
                  image="https://images.unsplash.com/photo-1657150946362-3aee0bbc8163?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWxvbWlubyUyMGhvcnNlfGVufDF8fHx8MTc2MzUwMDExNHww&ixlib=rb-4.1.0&q=80&w=1080"
                  isSmall={true}
                  onViewDetails={() => onViewAnimal?.(204)}
                />
              </div>

              {/* Título Bisavós */}
              <div className="text-center">
                <h5 className="text-lg text-foreground dark:text-white">Bisavós</h5>
              </div>

              {/* Nível 4 - Bisavós */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                {/* Nota: Bisavós são isTiny, então não exibem botão "Ver Detalhes" */}
                <GenealogyCard
                  name="Casarão"
                  registry="ABCCMM 11-11"
                  image="https://images.unsplash.com/photo-1648242977013-6f21e5a695f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGhvcnNlJTIwZm9hbHxlbnwxfHx8fDE3NjM1MDAxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  isTiny={true}
                />
                <GenealogyCard
                  name="Iris"
                  registry="ABCCMM 22-22"
                  image="https://images.unsplash.com/photo-1748212550010-74453d20e3ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXklMjBob3JzZSUyMHJ1bm5pbmd8ZW58MXx8fHwxNzYzNTAwMTE0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  isTiny={true}
                />
                <GenealogyCard
                  name="Atlas"
                  registry="ABCCMM 33-33"
                  image="https://images.unsplash.com/photo-1610137856583-e71966c4351d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMGhvcnNlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYzNDA4Njk3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  isTiny={true}
                />
                <GenealogyCard
                  name="Lua"
                  registry="ABCCMM 44-44"
                  image="https://images.unsplash.com/photo-1656964353220-99aa5acc47e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHN0YWxsaW9uJTIwaG9yc2V8ZW58MXx8fHwxNzYzNTAwMTEzfDA&ixlib=rb-4.1.0&q=80&w=1080"
                  isTiny={true}
                />
                <GenealogyCard
                  name="Valente"
                  registry="ABCCMM 55-55"
                  image="https://images.unsplash.com/photo-1724783483178-79f7ef970c6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGhvcnNlJTIwbWFyZXxlbnwxfHx8fDE3NjM1MDAxMTN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  isTiny={true}
                />
                <GenealogyCard
                  name="Jasmin"
                  registry="ABCCMM 66-66"
                  image="https://images.unsplash.com/photo-1667992711873-4bd87cbfbb65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVzdG51dCUyMGhvcnNlfGVufDF8fHx8MTc2MzUwMDExNHww&ixlib=rb-4.1.0&q=80&w=1080"
                  isTiny={true}
                />
                <GenealogyCard
                  name="Imperador"
                  registry="ABCCMM 77-77"
                  image="https://images.unsplash.com/photo-1751715773655-2140695a3a9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmV5JTIwaG9yc2UlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjM1MDAxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  isTiny={true}
                />
                <GenealogyCard
                  name="Alice"
                  registry="ABCCMM 88-88"
                  image="https://images.unsplash.com/photo-1657150946362-3aee0bbc8163?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWxvbWlubyUyMGhvcnNlfGVufDF8fHx8MTc2MzUwMDExNHww&ixlib=rb-4.1.0&q=80&w=1080"
                  isTiny={true}
                />
              </div>
                </div>
              </div>
            </div>
          )}

          {/* FASE 28: Aba Filhos */}
          {activeTab === 'offspring' && (
            <div className="space-y-6">
              {/* FASE 29: Filtros */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <h4 className="text-xl text-foreground dark:text-white">
                  Descendentes de {animal.name}
                </h4>
                
                <div className="w-full sm:w-auto grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Filtro Sexo */}
                  <NativeSelect
                    value={offspringFilters.sex}
                    onChange={(e) => setOffspringFilters({ ...offspringFilters, sex: e.target.value })}
                  >
                    <option value="all">Todos os Sexos</option>
                    <option value="Macho">Machos</option>
                    <option value="Fêmea">Fêmeas</option>
                  </NativeSelect>

                  {/* Filtro Categoria */}
                  <NativeSelect
                    value={offspringFilters.category}
                    onChange={(e) => setOffspringFilters({ ...offspringFilters, category: e.target.value })}
                  >
                    <option value="all">Todas Categorias</option>
                    <option value="Potro">Potros</option>
                    <option value="Reprodutor">Reprodutores</option>
                    <option value="Reprodutora">Reprodutoras</option>
                  </NativeSelect>

                  {/* Filtro Status */}
                  <NativeSelect
                    value={offspringFilters.status}
                    onChange={(e) => setOffspringFilters({ ...offspringFilters, status: e.target.value })}
                  >
                    <option value="all">Todos Status</option>
                    <option value="Ativo">Ativos</option>
                    <option value="Gestante">Gestantes</option>
                    <option value="Vendido">Vendidos</option>
                  </NativeSelect>
                </div>
              </div>

              {/* Contador */}
              <div className="p-4 bg-primary/10 dark:bg-white/10 border border-primary/20 dark:border-white/20 rounded-lg">
                <p className="text-foreground dark:text-white">
                  Mostrando <strong>{filteredOffspring.length}</strong> de <strong>{offspringData.length}</strong> {offspringData.length === 1 ? 'filho' : 'filhos'}
                </p>
              </div>

              {/* Grid de Filhos */}
              {filteredOffspring.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredOffspring.map((offspring) => (
                    <div
                      key={offspring.id}
                      className="bg-card dark:bg-[#0d0d0d] rounded-xl border border-border dark:border-[rgba(255,255,255,0.1)] overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {/* Imagem */}
                      <div className="h-48 overflow-hidden">
                        <img
                          src={offspring.image}
                          alt={offspring.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Informações */}
                      <div className="p-4 space-y-2">
                        <h5 className="text-foreground dark:text-white">{offspring.name}</h5>
                        <p className="text-sm text-muted-foreground dark:text-[#99a1af]">{offspring.registry}</p>
                        
                        <div className="space-y-1 pt-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground dark:text-[#99a1af]">Nascimento:</span>
                            <span className="text-foreground dark:text-white">{offspring.birthDate.split('-').reverse().join('/')}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground dark:text-[#99a1af]">Sexo:</span>
                            <span className="text-foreground dark:text-white">{offspring.sex}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground dark:text-[#99a1af]">Categoria:</span>
                            <span className="text-foreground dark:text-white">{offspring.category}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground dark:text-[#99a1af]">Status:</span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              offspring.status === 'Ativo' ? 'bg-green-500/20 text-green-700 dark:text-green-400' :
                              offspring.status === 'Gestante' ? 'bg-purple-500/20 text-purple-700 dark:text-purple-400' :
                              offspring.status === 'Vendido' ? 'bg-gray-500/20 text-gray-700 dark:text-gray-400' :
                              'bg-blue-500/20 text-blue-700 dark:text-blue-400'
                            }`}>
                              {offspring.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <p className="text-foreground dark:text-white mb-2">Nenhum filho encontrado</p>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                    Tente ajustar os filtros para ver mais resultados
                  </p>
                </div>
              )}
            </div>
          )}

          {/* FASE 41: Aba Documentos Refatorada */}
          {activeTab === 'documents' && (
            <AnimalDocumentsSection />
          )}

          {/* FASE 30: Aba Vídeos */}
          {activeTab === 'videos' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-foreground dark:text-white">Galeria de Vídeos</h4>
                <button 
                  onClick={() => setShowAddVideoModal(true)}
                  className="px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Vídeo
                </button>
              </div>
              
              {videosData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videosData.map((video) => (
                    <div 
                      key={video.id}
                      className="bg-card dark:bg-[#0d0d0d] rounded-xl border border-border dark:border-[rgba(255,255,255,0.1)] hover:shadow-lg transition-shadow group relative"
                    >
                      {/* Thumbnail com Play Button */}
                      <div 
                        className="relative aspect-video bg-black overflow-hidden cursor-pointer rounded-t-xl"
                        onClick={() => {
                          setSelectedVideo(video);
                          setShowVideoPlayer(true);
                        }}
                      >
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        {/* Overlay escuro */}
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                        
                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-black border-b-8 border-b-transparent ml-1" />
                          </div>
                        </div>
                        
                        {/* Duração */}
                        {video.duration && (
                          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-white text-xs">
                            {video.duration}
                          </div>
                        )}
                      </div>
                      
                      {/* Legenda do vídeo */}
                      {video.caption && (
                        <div className="px-4 py-2 bg-muted dark:bg-[#0d0d0d] border-b border-border dark:border-[rgba(255,255,255,0.1)]">
                          <p className="text-xs text-muted-foreground dark:text-[#99a1af] text-center italic">
                            {video.caption}
                          </p>
                        </div>
                      )}
                      
                      {/* Informações */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="text-foreground dark:text-white line-clamp-2 flex-1">{video.title}</h5>
                          
                          {/* Menu de 3 pontos */}
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveVideoMenu(activeVideoMenu === video.id ? null : video.id);
                              }}
                              className="p-1 hover:bg-muted dark:hover:bg-[#3a3a3a] rounded transition-colors"
                            >
                              <MoreVertical className="w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
                            </button>
                            
                            {/* Dropdown Menu */}
                            {activeVideoMenu === video.id && (
                              <div className="absolute right-0 top-8 w-48 bg-white dark:bg-[#1a1a1a] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg shadow-lg z-50 overflow-hidden">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setVideoToEdit(video);
                                    setShowEditVideoModal(true);
                                    setActiveVideoMenu(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-foreground dark:text-white hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors flex items-center gap-2"
                                >
                                  <Edit className="w-4 h-4" />
                                  Editar
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (video.url) {
                                      alert(`Link do vídeo:\n\n${video.url}\n\nVocê pode copiar este link manualmente.`);
                                    }
                                    setActiveVideoMenu(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-foreground dark:text-white hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors flex items-center gap-2"
                                >
                                  <Share2 className="w-4 h-4" />
                                  Compartilhar
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setVideoToDelete(video);
                                    setShowDeleteVideoModal(true);
                                    setActiveVideoMenu(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors flex items-center gap-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Excluir
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs">
                          <span className="px-2 py-1 bg-primary/10 dark:bg-white/10 text-primary dark:text-white rounded">
                            {video.type}
                          </span>
                        </div>
                        
                        <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
                          Adicionado em {video.uploadDate.split('-').reverse().join('/')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <Video className="w-16 h-16 text-muted-foreground dark:text-[#99a1af] mb-4" />
                  <p className="text-foreground dark:text-white mb-2">Nenhum vídeo cadastrado</p>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-4">
                    Adicione vídeos para documentar o desenvolvimento e características do animal
                  </p>
                  <button 
                    onClick={() => setShowAddVideoModal(true)}
                    className="px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Adicionar Primeiro Vídeo
                  </button>
                </div>
              )}
            </div>
          )}

          {/* FASE 33-34: Aba Premiações */}
          {activeTab === 'awards' && (
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
                <div>
                  <h4 className="text-foreground dark:text-white mb-1">Premiações</h4>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                    Total de {filteredAndSortedAwards.length} {filteredAndSortedAwards.length === 1 ? 'premiação' : 'premiações'}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                  <button 
                    onClick={() => setShowAwardsFullDetailsModal(true)}
                    className="px-4 py-2 bg-card dark:bg-[#0d0d0d] text-foreground dark:text-white border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg hover:bg-muted dark:hover:bg-[#1a1a1a] transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Ver Detalhes Completos
                  </button>
                  <button 
                    onClick={() => setShowAddAwardModal(true)}
                    className="px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Premiação
                  </button>
                </div>
              </div>

              {/* FASE 37: Filtros e Ordenação */}
              <div className="flex flex-col lg:flex-row gap-3 pb-4 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
                <div className="w-full lg:flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Filtro Ano */}
                  <div>
                    <NativeSelect
                      value={awardFilters.year}
                      onChange={(e) => setAwardFilters({ ...awardFilters, year: e.target.value })}
                    >
                      <option value="all">Todos os Anos</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                      <option value="2022">2022</option>
                    </NativeSelect>
                  </div>

                  {/* Filtro Colocação */}
                  <div>
                    <NativeSelect
                      value={awardFilters.placement}
                      onChange={(e) => setAwardFilters({ ...awardFilters, placement: e.target.value })}
                    >
                      <option value="all">Todas as Colocações</option>
                      <option value="Campeão">Campeão</option>
                      <option value="1º Lugar">1º Lugar</option>
                      <option value="2º Lugar">2º Lugar</option>
                      <option value="3º Lugar">3º Lugar</option>
                      <option value="Reservado">Reservado</option>
                    </NativeSelect>
                  </div>
                </div>

                {/* Ordenação */}
                <div className="w-full lg:w-56">
                  <NativeSelect
                    value={awardSortBy}
                    onChange={(e) => setAwardSortBy(e.target.value as 'recent' | 'oldest' | 'placement')}
                  >
                    <option value="recent">↓ Mais Recentes</option>
                    <option value="oldest">↑ Mais Antigas</option>
                    <option value="placement">🏆 Por Colocação</option>
                  </NativeSelect>
                </div>
              </div>
              
              {filteredAndSortedAwards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndSortedAwards.map((award) => (
                    <div 
                      key={award.id}
                      className="bg-card dark:bg-[#0d0d0d] rounded-xl overflow-hidden border border-border dark:border-[rgba(255,255,255,0.1)] hover:shadow-lg transition-shadow cursor-pointer group"
                      onClick={() => {
                        setSelectedAward(award);
                        setShowAwardDetailsModal(true);
                      }}
                    >
                      {/* Imagem */}
                      <div className="relative h-48 bg-muted dark:bg-[#2a2a2a] overflow-hidden">
                        <ImageWithFallback
                          src={award.photos[0]}
                          alt={award.eventName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Badge de Colocação */}
                        <div className="absolute top-3 right-3">
                          <span className={`px-3 py-1 rounded-full text-xs text-white ${
                            award.placementType === 'Campeão' || award.placementType === '1º Lugar' ? 'bg-yellow-500' :
                            award.placementType === '2º Lugar' ? 'bg-gray-400' :
                            award.placementType === '3º Lugar' ? 'bg-amber-600' :
                            'bg-blue-500'
                          }`}>
                            {award.placement}
                          </span>
                        </div>
                      </div>
                      
                      {/* Informações */}
                      <div className="p-4 space-y-3">
                        <div>
                          <h5 className="text-foreground dark:text-white line-clamp-2 mb-1">{award.eventName}</h5>
                          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">{award.category}</p>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground dark:text-[#99a1af]">
                            {award.date.split('-').reverse().join('/')}
                          </span>
                          {award.points && (
                            <span className="text-primary dark:text-white">
                              {award.points} pontos
                            </span>
                          )}
                        </div>
                        
                        <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
                          📍 {award.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mb-4">
                    <Trophy className="w-8 h-8 text-yellow-500" />
                  </div>
                  <p className="text-foreground dark:text-white mb-2">Nenhuma premiação encontrada</p>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-4">
                    Adicione as premiações e conquistas deste animal
                  </p>
                  <button 
                    onClick={() => setShowAddAwardModal(true)}
                    className="px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Adicionar Primeira Premiação
                  </button>
                </div>
              )}
            </div>
          )}

          {/* FASE 39-40: Aba Localização */}
          {activeTab === 'location' && (
            <AnimalLocationSection
              currentLocation={animal.localizacao}
              locationType={animal.localizacao?.includes('Baia') ? 'Baia' : animal.localizacao?.includes('Pasto') ? 'Pasto' : 'Serviço'}
              serviceType={animal.servicoTipo as 'Reprodução' | 'Trabalho' | 'Repouso' | 'Outro' | undefined}
              partners={[
                { name: 'Haras Exemplo', percentage: 60 },
                { name: 'João Silva', percentage: 40 },
              ]}
            />
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <HistoryItem
                title="Nascimento Registrado"
                description="Animal oficialmente registrado no sistema"
                date="15/01/2020"
                badge="Concluído"
                badgeColor="bg-green-500"
              />
              <HistoryItem
                title="Primeira Cobertura"
                description="Coberta por Relâmpago Negro"
                date="10/03/2023"
                badge="Reprodutor"
                badgeColor="bg-blue-500"
              />
              <HistoryItem
                title="Nascimento do Potro"
                description="Potro saudável - Vento Sul"
                date="15/01/2024"
                badge="Concluído"
                badgeColor="bg-green-500"
              />
              <HistoryItem
                title="Vacinação Anual"
                description="Tétano, Raiva e Influenza aplicadas"
                date="15/10/2024"
                badge="Veterinário"
                badgeColor="bg-purple-500"
              />
              <HistoryItem
                title="Exame de Rotina"
                description="Hemograma completo - Resultados normais"
                date="20/09/2024"
                badge="Veterinário"
                badgeColor="bg-purple-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Modal Adicionar Vacina */}
      <RegisterVaccineModal
        isOpen={showAddVaccineModal}
        onClose={() => setShowAddVaccineModal(false)}
        onSave={(data) => {
          console.log('Vacina adicionada:', data);
          setShowAddVaccineModal(false);
        }}
        animalName={animal.name}
      />

      {/* Modal Adicionar Exame */}
      <RegisterExamModal
        isOpen={showAddExamModal}
        onClose={() => setShowAddExamModal(false)}
        onSave={(data) => {
          console.log('Exame adicionado:', data);
          setShowAddExamModal(false);
        }}
        animalName={animal.name}
      />

      {/* Modal Adicionar Documento */}
      {showAddDocumentModal && (
        <AddDocumentModal
          onClose={() => setShowAddDocumentModal(false)}
          onSave={() => {
            setShowAddDocumentModal(false);
            // Lógica para adicionar documento
          }}
        />
      )}

      {/* Modal Visualizar Documento */}
      {showDocumentPreview && selectedDocument && (
        <DocumentPreviewModal
          document={selectedDocument}
          onClose={() => setShowDocumentPreview(false)}
        />
      )}

      {/* BLOCO 13: Modal Registrar Procedimento Veterinário */}
      {showRegisterProcedureModal && (
        <RegisterVeterinaryProcedureModal
          onClose={() => setShowRegisterProcedureModal(false)}
          animalName={animal.name}
        />
      )}

      {/* FASE 23 & 24: Modal Árvore Genealógica Completa com Tataravós */}
      {showFullGenealogyTree && (
        <GenealogyTree
          animal={animal}
          onClose={() => setShowFullGenealogyTree(false)}
          onViewAnimal={onViewAnimal}
        />
      )}

      {/* NOVO: Modal Marcar como Inativo */}
      {showInactivateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 max-w-md w-full border border-border dark:border-[rgba(255,255,255,0.1)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl text-foreground dark:text-white">Marcar Animal como Inativo</h2>
              <button
                onClick={() => setShowInactivateModal(false)}
                className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-foreground dark:text-white mb-2">
                  Você está prestes a marcar <strong>{animal.name}</strong> como inativo.
                </p>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                  Esta ação registrará o animal no histórico como inativo e ele será filtrado nas listagens.
                </p>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground dark:text-[#99a1af] mb-2">
                  Motivo da Inativação
                </label>
                <NativeSelect
                  value={inactivateReason}
                  onChange={(e) => setInactivateReason(e.target.value as 'Vendido' | 'Óbito' | 'Doado' | 'Transferido')}
                >
                  <option value="Vendido">Vendido</option>
                  <option value="Óbito">Óbito</option>
                  <option value="Doado">Doado</option>
                  <option value="Transferido">Transferido</option>
                </NativeSelect>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground dark:text-[#99a1af] mb-2">
                  Data da Inativação
                </label>
                <input
                  type="date"
                  value={inactivateDate}
                  onChange={(e) => setInactivateDate(e.target.value)}
                  className="w-full h-12 px-4 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                />
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm text-red-800 dark:text-red-200">
                  <strong>Atenção:</strong> Esta ação criará um registro permanente no histórico do animal.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3 mt-6">
              <button
                onClick={() => setShowInactivateModal(false)}
                className="flex-1 px-6 py-3 border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  // Aqui será implementada a lógica de salvar
                  console.log('Marcar como inativo:', {
                    animalId: animal.id,
                    motivo: inactivateReason,
                    data: inactivateDate
                  });
                  setShowInactivateModal(false);
                }}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirmar Inativação
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FASE 32: Player de Vídeo Fullscreen */}
      {showVideoPlayer && selectedVideo && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          {/* Header do Player */}
          <div className="bg-black/80 p-4 flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-white text-lg mb-1">{selectedVideo.title}</h3>
              <p className="text-gray-400 text-sm">{selectedVideo.type}</p>
            </div>
            <button
              onClick={() => {
                setShowVideoPlayer(false);
                setSelectedVideo(null);
              }}
              className="text-white hover:text-gray-300 transition-colors ml-4"
            >
              <X className="w-8 h-8" />
            </button>
          </div>

          {/* Player Area */}
          <div className="flex-1 flex items-center justify-center bg-black">
            {selectedVideo.source === 'youtube' ? (
              <div className="w-full h-full max-w-6xl aspect-video bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                  <Video className="w-24 h-24 text-white/50 mx-auto mb-4" />
                  <p className="text-white text-lg mb-2">Player de Vídeo</p>
                  <p className="text-gray-400 text-sm">URL: {selectedVideo.url}</p>
                  <p className="text-gray-500 text-xs mt-2">Em produção, o player do YouTube seria incorporado aqui</p>
                </div>
              </div>
            ) : selectedVideo.source === 'vimeo' ? (
              <div className="w-full h-full max-w-6xl aspect-video bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                  <Video className="w-24 h-24 text-white/50 mx-auto mb-4" />
                  <p className="text-white text-lg mb-2">Player de Vídeo Vimeo</p>
                  <p className="text-gray-400 text-sm">URL: {selectedVideo.url}</p>
                  <p className="text-gray-500 text-xs mt-2">Em produção, o player do Vimeo seria incorporado aqui</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full max-w-6xl aspect-video bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                  <Video className="w-24 h-24 text-white/50 mx-auto mb-4" />
                  <p className="text-white text-lg mb-2">Player de Vídeo Upload</p>
                  <p className="text-gray-400 text-sm">Arquivo carregado</p>
                  <p className="text-gray-500 text-xs mt-2">Em produção, o player HTML5 seria incorporado aqui</p>
                </div>
              </div>
            )}
          </div>

          {/* Controls Bar */}
          <div className="bg-black/80 p-4 flex items-center justify-center gap-4">
            <div className="flex items-center gap-3">
              <button className="text-white hover:text-gray-300 transition-colors">
                <RefreshCw className="w-5 h-5" />
              </button>
              <span className="text-white text-sm">
                {selectedVideo.duration || '0:00'} / {selectedVideo.duration || '0:00'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* FASE 35: Modal Adicionar Premiação */}
      {showAddAwardModal && <AddAwardModal onClose={() => setShowAddAwardModal(false)} />}

      {/* FASE 36: Modal Detalhes da Premiação */}
      {showAwardDetailsModal && selectedAward && (
        <AwardDetailsModal award={selectedAward} onClose={() => setShowAwardDetailsModal(false)} />
      )}

      {/* FASE 38: Modal Visualizar Premiações Detalhadas */}
      {showAwardsFullDetailsModal && (
        <AwardsDetailModal 
          awards={awardsData} 
          animalName={animal.name}
          onClose={() => setShowAwardsFullDetailsModal(false)} 
        />
      )}

      {/* Modal Editar Vídeo */}
      {showEditVideoModal && videoToEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => {
          setShowEditVideoModal(false);
          setVideoToEdit(null);
        }}>
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
              <h3 className="text-xl text-foreground dark:text-white">Editar Vídeo</h3>
              <button
                onClick={() => {
                  setShowEditVideoModal(false);
                  setVideoToEdit(null);
                }}
                className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Título */}
              <div>
                <label className="text-sm text-muted-foreground dark:text-[#99a1af] mb-2 block">
                  Título do Vídeo *
                </label>
                <input
                  type="text"
                  defaultValue={videoToEdit.title}
                  placeholder="Ex: Demonstração de Marcha Batida"
                  className="w-full px-4 py-3 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                />
              </div>

              {/* URL */}
              <div>
                <label className="text-sm text-muted-foreground dark:text-[#99a1af] mb-2 block">
                  URL do Vídeo
                </label>
                <input
                  type="url"
                  defaultValue={videoToEdit.url}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-3 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                  disabled
                />
                <p className="text-xs text-muted-foreground dark:text-[#99a1af] mt-2">
                  A URL não pode ser alterada após o upload
                </p>
              </div>

              {/* Tipo de Vídeo */}
              <div>
                <label className="text-sm text-muted-foreground dark:text-[#99a1af] mb-2 block">
                  Tipo de Vídeo *
                </label>
                <NativeSelect defaultValue={videoToEdit.type}>
                  <option value="Marcha">Marcha</option>
                  <option value="Competição">Competição</option>
                  <option value="Personalidade">Personalidade</option>
                  <option value="Genealogia">Genealogia</option>
                  <option value="Outro">Outro</option>
                </NativeSelect>
              </div>

              {/* Legenda do Vídeo */}
              <div>
                <label className="text-sm text-muted-foreground dark:text-[#99a1af] mb-2 block">
                  Legenda do Vídeo
                </label>
                <textarea
                  defaultValue={videoToEdit.caption || ''}
                  placeholder="Ex: Demonstração de marcha em pista de avaliação..."
                  rows={3}
                  className="w-full px-4 py-3 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white resize-none"
                />
                <p className="text-xs text-muted-foreground dark:text-[#99a1af] mt-1">
                  Descrição curta sobre o conteúdo do vídeo (opcional)
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
              <button
                onClick={() => {
                  setShowEditVideoModal(false);
                  setVideoToEdit(null);
                }}
                className="px-6 py-3 text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  alert(`Vídeo "${videoToEdit.title}" atualizado com sucesso!`);
                  setShowEditVideoModal(false);
                  setVideoToEdit(null);
                }}
                className="px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Excluir Vídeo */}
      {showDeleteVideoModal && videoToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => {
          setShowDeleteVideoModal(false);
          setVideoToDelete(null);
        }}>
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl text-foreground dark:text-white mb-2">Excluir Vídeo</h3>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                Esta ação não pode ser desfeita.
              </p>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-lg mb-4">
                <p className="text-sm text-foreground dark:text-white mb-1">
                  <strong>Vídeo:</strong> {videoToDelete.title}
                </p>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                  <strong>Tipo:</strong> {videoToDelete.type} • <strong>Adicionado em:</strong> {videoToDelete.uploadDate.split('-').reverse().join('/')}
                </p>
              </div>
              
              <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                Tem certeza que deseja excluir este vídeo? Todos os dados associados serão permanentemente removidos.
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
              <button
                onClick={() => {
                  setShowDeleteVideoModal(false);
                  setVideoToDelete(null);
                }}
                className="px-6 py-3 text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  alert(`Vídeo "${videoToDelete.title}" foi excluído com sucesso!`);
                  setShowDeleteVideoModal(false);
                  setVideoToDelete(null);
                }}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Excluir Vídeo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FASE 31: Modal Adicionar Vídeo */}
      {showAddVideoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
              <h3 className="text-xl text-foreground dark:text-white">Adicionar Vídeo</h3>
              <button
                onClick={() => setShowAddVideoModal(false)}
                className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Método de Input */}
              <div>
                <label className="text-sm text-muted-foreground dark:text-[#99a1af] mb-2 block">Método de Adição</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setVideoInputMethod('link')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      videoInputMethod === 'link'
                        ? 'border-primary dark:border-white bg-primary/10 dark:bg-white/10'
                        : 'border-border dark:border-[rgba(255,255,255,0.1)] hover:border-primary/50 dark:hover:border-white/50'
                    }`}
                  >
                    <div className="text-center">
                      <Link className="w-8 h-8 mx-auto mb-2 text-muted-foreground dark:text-[#99a1af]" />
                      <p className="text-sm text-foreground dark:text-white">Link Externo</p>
                      <p className="text-xs text-muted-foreground dark:text-[#99a1af] mt-1">YouTube ou Vimeo</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setVideoInputMethod('upload')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      videoInputMethod === 'upload'
                        ? 'border-primary dark:border-white bg-primary/10 dark:bg-white/10'
                        : 'border-border dark:border-[rgba(255,255,255,0.1)] hover:border-primary/50 dark:hover:border-white/50'
                    }`}
                  >
                    <div className="text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground dark:text-[#99a1af]" />
                      <p className="text-sm text-foreground dark:text-white">Upload de Arquivo</p>
                      <p className="text-xs text-muted-foreground dark:text-[#99a1af] mt-1">Máx. 500MB</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Campos do Formulário */}
              <div className="space-y-4">
                {/* Título */}
                <div>
                  <label className="text-sm text-muted-foreground dark:text-[#99a1af] mb-2 block">
                    Título do Vídeo *
                  </label>
                  <input
                    type="text"
                    value={videoFormData.title}
                    onChange={(e) => setVideoFormData({ ...videoFormData, title: e.target.value })}
                    placeholder="Ex: Demonstração de Marcha Batida"
                    className="w-full px-4 py-3 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                  />
                </div>

                {/* Link ou Upload */}
                {videoInputMethod === 'link' ? (
                  <div>
                    <label className="text-sm text-muted-foreground dark:text-[#99a1af] mb-2 block">
                      URL do Vídeo *
                    </label>
                    <input
                      type="url"
                      value={videoFormData.url}
                      onChange={(e) => setVideoFormData({ ...videoFormData, url: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-4 py-3 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                    />
                    <p className="text-xs text-muted-foreground dark:text-[#99a1af] mt-2">
                      Suportado: YouTube e Vimeo
                    </p>
                  </div>
                ) : (
                  <div>
                    <label className="text-sm text-muted-foreground dark:text-[#99a1af] mb-2 block">
                      Upload de Arquivo *
                    </label>
                    <div className="border-2 border-dashed border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg p-8 text-center hover:border-primary dark:hover:border-white transition-colors cursor-pointer">
                      <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground dark:text-[#99a1af]" />
                      <p className="text-sm text-foreground dark:text-white mb-1">
                        Clique para selecionar ou arraste o arquivo
                      </p>
                      <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
                        MP4, MOV, AVI até 500MB
                      </p>
                    </div>
                  </div>
                )}

                {/* Tipo de Vídeo */}
                <div>
                  <label className="text-sm text-muted-foreground dark:text-[#99a1af] mb-2 block">
                    Tipo de Vídeo *
                  </label>
                  <NativeSelect
                    value={videoFormData.type}
                    onChange={(e) => setVideoFormData({ ...videoFormData, type: e.target.value as Video['type'] })}
                  >
                    <option value="Marcha">Marcha</option>
                    <option value="Competição">Competição</option>
                    <option value="Personalidade">Personalidade</option>
                    <option value="Genealogia">Genealogia</option>
                    <option value="Outro">Outro</option>
                  </NativeSelect>
                </div>

                {/* Legenda do Vídeo */}
                <div>
                  <label className="text-sm text-muted-foreground dark:text-[#99a1af] mb-2 block">
                    Legenda do Vídeo
                  </label>
                  <textarea
                    value={videoFormData.caption}
                    onChange={(e) => setVideoFormData({ ...videoFormData, caption: e.target.value })}
                    placeholder="Ex: Demonstração de marcha em pista de avaliação..."
                    rows={3}
                    className="w-full px-4 py-3 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white resize-none"
                  />
                  <p className="text-xs text-muted-foreground dark:text-[#99a1af] mt-1">
                    Descrição curta sobre o conteúdo do vídeo (opcional)
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
              <button
                onClick={() => setShowAddVideoModal(false)}
                className="px-6 py-3 text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  // Aqui seria a lógica de salvar (por enquanto apenas fecha)
                  setShowAddVideoModal(false);
                  setVideoFormData({ title: '', url: '', type: 'Marcha', visibility: 'Público', caption: '' });
                }}
                className="px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity"
              >
                Adicionar Vídeo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// FASE 35-36: Modais de Premiação
function AddAwardModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    eventName: '',
    date: '',
    location: '',
    category: '',
    placement: '',
    placementType: '1º Lugar' as Award['placementType'],
    points: '',
    description: '',
  });
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Simular upload - em produção seria um upload real
      const newPhotos = Array.from(files).map(() => 
        'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3JzZSUyMGdhbGxvcHxlbnwxfHx8fDE3NjM1MDAxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080'
      );
      setUploadedPhotos([...uploadedPhotos, ...newPhotos]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
          <h3 className="text-xl text-foreground dark:text-white">Adicionar Premiação</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Nome do Evento */}
          <div>
            <label className="text-sm text-foreground dark:text-white mb-2 block">
              Nome do Evento *
            </label>
            <input
              type="text"
              value={formData.eventName}
              onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
              placeholder="Ex: Exposição Nacional ABCCMM 2024"
              className="w-full px-4 py-3 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
            />
          </div>

          {/* Data e Local */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-foreground dark:text-white mb-2 block">
                Data *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
              />
            </div>
            <div>
              <label className="text-sm text-foreground dark:text-white mb-2 block">
                Local *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ex: Belo Horizonte - MG"
                className="w-full px-4 py-3 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
              />
            </div>
          </div>

          {/* Categoria e Colocação */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-foreground dark:text-white mb-2 block">
                Categoria *
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Ex: Garanhão Adulto"
                className="w-full px-4 py-3 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
              />
            </div>
            <div>
              <label className="text-sm text-foreground dark:text-white mb-2 block">
                Colocação *
              </label>
              <select
                value={formData.placementType}
                onChange={(e) => setFormData({ ...formData, placementType: e.target.value as Award['placementType'] })}
                className="w-full px-4 py-3 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
              >
                <option value="Campeão">Campeão</option>
                <option value="1º Lugar">1º Lugar</option>
                <option value="2º Lugar">2º Lugar</option>
                <option value="3º Lugar">3º Lugar</option>
                <option value="Reservado">Reservado Campeão</option>
                <option value="Menção Honrosa">Menção Honrosa</option>
              </select>
            </div>
          </div>

          {/* Pontos */}
          <div>
            <label className="text-sm text-foreground dark:text-white mb-2 block">
              Pontuação
            </label>
            <input
              type="number"
              value={formData.points}
              onChange={(e) => setFormData({ ...formData, points: e.target.value })}
              placeholder="Ex: 98"
              className="w-full px-4 py-3 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="text-sm text-foreground dark:text-white mb-2 block">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva os detalhes da premiação..."
              rows={3}
              className="w-full px-4 py-3 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white resize-none"
            />
          </div>

          {/* Upload de Fotos e Documentos */}
          <div>
            <label className="text-sm text-foreground dark:text-white mb-2 block">
              Fotos e Documentos (Troféu, Certificado, Evento)
            </label>
            <div className="border-2 border-dashed border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg p-6 text-center hover:border-primary dark:hover:border-white transition-colors">
              <Upload className="w-12 h-12 text-muted-foreground dark:text-[#99a1af] mx-auto mb-3" />
              <p className="text-sm text-foreground dark:text-white mb-1">
                Clique ou arraste fotos e documentos aqui
              </p>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-3">
                Fotos: PNG, JPG | Documentos: PDF | Até 10MB cada
              </p>
              <input
                type="file"
                accept="image/*,.pdf"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
                id="award-photos"
              />
              <label
                htmlFor="award-photos"
                className="inline-block px-4 py-2 bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white rounded-lg cursor-pointer hover:bg-accent dark:hover:bg-[#2a2a2a] transition-colors"
              >
                Escolher Arquivos
              </label>
            </div>

            {/* Preview das Fotos */}
            {uploadedPhotos.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {uploadedPhotos.map((photo, idx) => (
                  <div key={idx} className="relative group">
                    <ImageWithFallback
                      src={photo}
                      alt={`Foto ${idx + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setUploadedPhotos(uploadedPhotos.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
          <button
            onClick={onClose}
            className="px-6 py-3 text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              // Aqui seria a lógica de salvar
              onClose();
            }}
            className="px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity"
          >
            Adicionar Premiação
          </button>
        </div>
      </div>
    </div>
  );
}

// FASE 36: Modal de Detalhes da Premiação
function AwardDetailsModal({ award, onClose }: { award: Award; onClose: () => void }) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const formatDate = (date: string) => {
    return date.split('-').reverse().join('/');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={onClose}>
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] max-w-3xl w-full my-8 flex flex-col max-h-[calc(100vh-4rem)]" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)] flex-shrink-0">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h3 className="text-xl text-foreground dark:text-white">Detalhes da Premiação</h3>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Galeria de Fotos */}
          {award.photos && award.photos.length > 0 && (
            <div className="relative">
              <div className="aspect-video bg-muted dark:bg-[#0d0d0d] rounded-xl overflow-hidden">
                <ImageWithFallback
                  src={award.photos[currentPhotoIndex]}
                  alt={award.eventName}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Navegação de Fotos */}
              {award.photos.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentPhotoIndex((prev) => prev === 0 ? award.photos.length - 1 : prev - 1)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentPhotoIndex((prev) => prev === award.photos.length - 1 ? 0 : prev + 1)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                    {award.photos.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentPhotoIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === currentPhotoIndex ? 'bg-white w-6' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Badge de Colocação Destaque */}
          <div className="flex items-center justify-center">
            <span className={`px-6 py-2 rounded-full text-white ${
              award.placementType === 'Campeão' || award.placementType === '1º Lugar' ? 'bg-yellow-500' :
              award.placementType === '2º Lugar' ? 'bg-gray-400' :
              award.placementType === '3º Lugar' ? 'bg-amber-600' :
              'bg-blue-500'
            }`}>
              {award.placement}
            </span>
          </div>

          {/* Informações do Evento */}
          <div className="space-y-4">
            <div>
              <h4 className="text-2xl text-foreground dark:text-white mb-2">{award.eventName}</h4>
              <p className="text-muted-foreground dark:text-[#99a1af]">{award.category}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
                <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Data
                </p>
                <p className="text-foreground dark:text-white">{formatDate(award.date)}</p>
              </div>
              <div className="p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
                <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">📍 Local</p>
                <p className="text-foreground dark:text-white">{award.location}</p>
              </div>
            </div>

            {award.points && (
              <div className="p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
                <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Pontuação</p>
                <p className="text-2xl text-primary dark:text-white">{award.points} pontos</p>
              </div>
            )}

            {award.description && (
              <div>
                <h5 className="text-foreground dark:text-white mb-2">Descrição</h5>
                <p className="text-muted-foreground dark:text-[#99a1af]">{award.description}</p>
              </div>
            )}

            {award.certificate && (
              <div className="p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
                  <div>
                    <p className="text-foreground dark:text-white">Certificado</p>
                    <p className="text-xs text-muted-foreground dark:text-[#99a1af]">{award.certificate}</p>
                  </div>
                </div>
                <button className="w-full sm:w-auto px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Baixar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 p-6 border-t border-border dark:border-[rgba(255,255,255,0.1)] flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white transition-colors"
          >
            Fechar
          </button>
          <button
            className="w-full sm:w-auto px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Compartilhar
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, valueClassName }: { label: string; value: string; valueClassName?: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
      <span className="text-muted-foreground dark:text-[#99a1af]">{label}</span>
      <span className={valueClassName || "text-foreground dark:text-white"}>{value}</span>
    </div>
  );
}

function LocationBadge({ localizacao, servicoTipo }: { localizacao: string; servicoTipo?: string }) {
  const isBaia = localizacao.toLowerCase().includes('baia');
  const isServico = localizacao.toLowerCase().includes('serviço');
  
  return (
    <div className="py-2">
      <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-2">Localização Atual</p>
      <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${
        isBaia
          ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-medium'
          : isServico
          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
          : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
      }`}>
        {isBaia ? (
          <Home className="w-4 h-4" />
        ) : isServico ? (
          <AlertCircle className="w-4 h-4" />
        ) : (
          <MapPin className="w-4 h-4" />
        )}
        <span>{localizacao}</span>
      </div>
      {servicoTipo && isServico && (
        <p className="text-xs text-muted-foreground dark:text-[#99a1af] mt-2">
          Tipo: {servicoTipo}
        </p>
      )}
    </div>
  );
}

function DocumentItem({ name, type, size, date, onView }: { name: string; type: string; size: string; date: string; onView: () => void }) {
  return (
    <div className="flex items-center justify-between p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
      <div>
        <p className="text-foreground dark:text-white mb-1">{name}</p>
        <p className="text-sm text-muted-foreground dark:text-[#99a1af]">{type} • {size} • {date}</p>
      </div>
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-card dark:bg-[#1a1a1a] text-foreground dark:text-white rounded-lg hover:bg-accent dark:hover:bg-[#2a2a2a] transition-colors" onClick={onView}>
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function HistoryItem({ title, description, date, badge, badgeColor }: { title: string; description: string; date: string; badge: string; badgeColor: string }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
      <div className="w-2 h-2 bg-primary dark:bg-white rounded-full mt-2 flex-shrink-0"></div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <p className="text-foreground dark:text-white">{title}</p>
          <span className={`px-2 py-1 ${badgeColor} text-white text-xs rounded flex-shrink-0`}>{badge}</span>
        </div>
        <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">{description}</p>
        <p className="text-xs text-muted-foreground dark:text-[#99a1af]">{date}</p>
      </div>
    </div>
  );
}

function GenealogyCard({ name, registry, image, isMain = false, isSmall = false, isTiny = false, onViewDetails }: { name: string; registry: string; image: string; isMain?: boolean; isSmall?: boolean; isTiny?: boolean; onViewDetails?: () => void }) {
  const cardPadding = isMain ? 'p-4' : isSmall ? 'p-3' : isTiny ? 'p-2' : 'p-4';
  const imageSize = isMain ? 'w-24 h-24' : isSmall ? 'w-16 h-16' : isTiny ? 'w-12 h-12' : 'w-20 h-20';
  const textSize = isMain ? '' : isSmall ? 'text-sm' : isTiny ? 'text-xs' : 'text-sm';
  const registrySize = isMain ? 'text-sm' : isSmall ? 'text-xs' : isTiny ? 'text-[10px]' : 'text-xs';

  return (
    <div className={`bg-card dark:bg-[#1a1a1a] rounded-xl ${cardPadding} border border-border dark:border-[rgba(255,255,255,0.1)] flex flex-col items-center gap-3`}>
      {/* Imagem Circular */}
      <div className={`${imageSize} rounded-full overflow-hidden flex-shrink-0 border-2 border-primary dark:border-white`}>
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Informações */}
      <div className="text-center">
        <p className={`text-foreground dark:text-white ${textSize} mb-1`}>{name}</p>
        <p className={`text-muted-foreground dark:text-[#99a1af] ${registrySize}`}>{registry}</p>
      </div>
      
      {/* Botão Ver Detalhes - apenas para os maiores */}
      {!isTiny && onViewDetails && (
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onViewDetails();
          }}
          className="px-3 py-1.5 bg-transparent border border-border dark:border-[#333333] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors text-xs flex items-center gap-1"
        >
          <Eye className="w-3 h-3" />
          Ver Detalhes
        </button>
      )}
    </div>
  );
}

// Modal Adicionar Documento
function AddDocumentModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'registro',
    descricao: '',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border dark:border-[rgba(255,255,255,0.1)]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl text-foreground dark:text-white">Adicionar Documento</h2>
          <button onClick={onClose} className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">Nome do Documento *</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full h-10 px-4 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
              placeholder="Ex: Registro ABCCMM, Certificado de Vacinação"
            />
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">Tipo de Documento *</label>
            <select
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
              className="w-full h-10 px-4 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
            >
              <option value="registro">Registro</option>
              <option value="certificado">Certificado</option>
              <option value="exame">Exame</option>
              <option value="laudo">Laudo Veterinário</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">Descrição</label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className="w-full px-4 py-3 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white resize-none"
              rows={3}
              placeholder="Descrição do documento"
            />
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">Arquivo *</label>
            <div className="flex items-center justify-center w-full h-40 border-2 border-dashed border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg cursor-pointer hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors">
              <div className="text-center">
                <FileText className="w-12 h-12 mx-auto mb-2 text-muted-foreground dark:text-[#99a1af]" />
                <p className="text-muted-foreground dark:text-[#99a1af] mb-1">Clique ou arraste o arquivo aqui</p>
                <p className="text-xs text-muted-foreground dark:text-[#99a1af]">PDF, JPG, PNG (máx. 10MB)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-transparent border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            className="flex-1 px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity"
          >
            Salvar Tratamento
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal Visualizar Documento
function DocumentPreviewModal({ document, onClose }: { document: { name: string; type: string; size: string; date: string }; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border dark:border-[rgba(255,255,255,0.1)]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl text-foreground dark:text-white">Visualizar Documento</h2>
          <button onClick={onClose} className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">Nome do Documento</label>
            <p className="text-foreground dark:text-white">{document.name}</p>
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">Tipo de Documento</label>
            <p className="text-foreground dark:text-white">{document.type}</p>
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">Tamanho do Documento</label>
            <p className="text-foreground dark:text-white">{document.size}</p>
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">Data do Documento</label>
            <p className="text-foreground dark:text-white">{document.date}</p>
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">Visualizar Documento</label>
            <div className="flex items-center justify-center w-full h-40 border-2 border-dashed border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg cursor-pointer hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors">
              <div className="text-center">
                <FileText className="w-12 h-12 mx-auto mb-2 text-muted-foreground dark:text-[#99a1af]" />
                <p className="text-muted-foreground dark:text-[#99a1af] mb-1">Clique para visualizar</p>
                <p className="text-xs text-muted-foreground dark:text-[#99a1af]">PDF, JPG, PNG (máx. 10MB)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-transparent border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}