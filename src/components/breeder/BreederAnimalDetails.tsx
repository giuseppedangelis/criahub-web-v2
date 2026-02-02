import { ArrowLeft, Eye, Plus, Download, Trash2, FileText, ZoomIn, ZoomOut, RefreshCw, ChevronDown, Filter, X, Upload, ChevronLeft, ChevronRight, Video, Trophy, Calendar, Link, MoreVertical, Edit, Share2, MapPin, Home, AlertCircle, Clock, Stethoscope, Syringe, Heart } from 'lucide-react';
import { useState, useEffect, useMemo, type ChangeEvent } from 'react';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { GenealogyTree } from './GenealogyTree';
import { AwardsDetailModal } from './AwardsDetailModal';
import { AnimalLocationSection } from './AnimalLocationSection';
import { AnimalDocumentsSection } from './AnimalDocumentsSection';
import { HealthTabs } from './HealthTabs';
import { RegisterVaccineModal, type VaccineData } from './RegisterVaccineModal';
import { RegisterExamModal, type ExamData } from './RegisterExamModal';
import { RegisterVeterinaryProcedureModal, type VeterinaryProcedureData } from './RegisterVeterinaryProcedureModal';

import { NativeSelect } from '../ui/native-select';
import { useAnimal, useAnimalGenealogy, useAnimalOffspring, useUpdateAnimal } from '@/hooks/useAnimals';
import { useAnimalExams, useAnimalHealthRecords, useAnimalVaccines, useCreateExam, useCreateHealthRecord, useCreateVaccine } from '@/hooks/useAnimalHealth';
import { useAnimalVideos, useCreateAnimalVideo, useUpdateAnimalVideo, useDeleteAnimalVideo } from '@/hooks/useAnimalVideos';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { buildGenealogyView } from '@/lib/genealogy';
import { useAnimalLocationHistory } from '@/hooks/useAnimalLocations';
import { useAnimalReproductiveEvents } from '@/hooks/useReproduction';


// Função auxiliar para formatar data de nascimento (FASE 20)
function formatBirthDate(isoDate: string): string {
  if (!isoDate) return '-';
  const [datePart] = isoDate.split('T');
  const [year, month, day] = datePart.split('-');
  return `${day}/${month}/${year}`;
}

// Função auxiliar para calcular idade a partir da data de nascimento
function calculateAge(birthDate: string | undefined): string {
  if (!birthDate) return '-';
  
  const birth = new Date(birthDate);
  const today = new Date();
  
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  // Se ainda não completou o mês atual
  if (today.getDate() < birth.getDate()) {
    months--;
    if (months < 0) {
      years--;
      months = 11;
    }
  }
  
  if (years < 0) return '-';
  
  if (years === 0) {
    return `${months} ${months === 1 ? 'mês' : 'meses'}`;
  } else if (months === 0) {
    return `${years} ${years === 1 ? 'ano' : 'anos'}`;
  } else {
    return `${years}a ${months}m`;
  }
}

const DEFAULT_VIDEO_THUMBNAIL =
  'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1080&q=80';

function extractYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/i);
  return match ? match[1] : null;
}

function extractVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/i);
  return match ? match[1] : null;
}

function buildEmbedUrl(url: string): string | null {
  const youtubeId = extractYoutubeId(url);
  if (youtubeId) return `https://www.youtube.com/embed/${youtubeId}`;
  const vimeoId = extractVimeoId(url);
  if (vimeoId) return `https://player.vimeo.com/video/${vimeoId}`;
  return null;
}

function buildThumbnailUrl(url: string): string | null {
  const youtubeId = extractYoutubeId(url);
  if (youtubeId) return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  return null;
}

function normalizeLocationType(value?: string | null): 'Baia' | 'Pasto' | 'Servico' | undefined {
  if (!value) return undefined;
  const key = value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
  if (key.includes('baia')) return 'Baia';
  if (key.includes('pasto')) return 'Pasto';
  if (key.includes('servico')) return 'Servico';
  return undefined;
}

function normalizeServiceType(value?: string | null): 'Reproducao' | 'Trabalho' | 'Repouso' | 'Outro' | undefined {
  if (!value) return undefined;
  const key = value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
  if (key.includes('reproducao')) return 'Reproducao';
  if (key.includes('trabalho')) return 'Trabalho';
  if (key.includes('repouso')) return 'Repouso';
  return 'Outro';
}

function isDirectVideoUrl(url: string): boolean {
  return /\.(mp4|webm|ogg|mov)(\?|#|$)/i.test(url);
}

function VideoThumbnail({ url, title, fallback }: { url: string; title: string; fallback: string }) {
  const [thumb, setThumb] = useState(fallback);

  useEffect(() => {
    if (!isDirectVideoUrl(url)) {
      setThumb(fallback);
      return;
    }

    let cancelled = false;
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.src = url;

    const handleLoaded = () => {
      const targetTime = Number.isFinite(video.duration) && video.duration > 0 ? Math.min(1, video.duration / 10) : 1;
      video.currentTime = targetTime;
    };

    const handleSeeked = () => {
      if (cancelled) return;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      try {
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        if (!cancelled) setThumb(dataUrl);
      } catch {
        // CORS or tainted canvas; keep fallback
      }
    };

    const handleError = () => {
      if (!cancelled) setThumb(fallback);
    };

    video.addEventListener('loadedmetadata', handleLoaded);
    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('error', handleError);

    return () => {
      cancelled = true;
      video.removeEventListener('loadedmetadata', handleLoaded);
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('error', handleError);
      video.src = '';
    };
  }, [url, fallback]);

  return (
    <img
      src={thumb}
      alt={title}
      className="w-full h-full object-cover"
      loading="lazy"
    />
  );
}

function normalizeVideoType(
  value?: string | null
): 'Marcha' | 'Competição' | 'Personalidade' | 'Genealogia' | 'Outro' {
  const allowed = ['Marcha', 'Competição', 'Personalidade', 'Genealogia', 'Outro'] as const;
  return allowed.includes(value as (typeof allowed)[number]) ? (value as (typeof allowed)[number]) : 'Outro';
}

// FASE 30: Interface para Vídeos
interface Video {
  id: string;
  title: string;
  url: string;
  type: 'Marcha' | 'Competição' | 'Personalidade' | 'Genealogia' | 'Outro';
  thumbnail?: string;
  duration?: string;
  uploadDate: string;
  visibility: 'Público' | 'Privado';
  source: 'upload' | 'youtube' | 'vimeo' | 'link';
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

interface HistoryEvent {
  id: string;
  type: string;
  title: string;
  date: string;
  dateValue: number;
  description?: string;
  icon: typeof Stethoscope;
  color: string;
}

type StatusHistoryEntry = {
  data: string;
  statusAnterior: string;
  statusNovo: string;
  motivo?: string;
  usuario: string;
};

interface Animal {
  id: number;
  haras_id?: string;
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
  motivoInativacao?: 'Vendido' | 'Obito' | 'Doado' | 'Transferido'; // Motivo da inativação
  dataInativacao?: string; // Data da inativação (ISO format)
  statusHistorico?: StatusHistoryEntry[]; // Histórico de mudanças de status
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
  lastReproductiveEvent?: { // FASE 27: ?sltimo evento reprodutivo
    type: string;
    date: string;
  };
  videos?: Video[]; // FASE 30: Galeria de vídeos
  documents?: string[]; // URLs dos documentos
  gait?: string; // Tipo de andamento
}

interface BreederAnimalDetailsProps {
  animal: Animal;
  onBack: () => void;
  onEdit: () => void;
  onViewAnimal?: (animalId: number) => void;
  initialTab?: string; // Aba inicial a ser exibida
}

export function BreederAnimalDetails({ animal, onBack, onEdit, onViewAnimal, initialTab = 'overview' }: BreederAnimalDetailsProps) {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [documentTab, setDocumentTab] = useState('todos');
  const [showAddDocumentModal, setShowAddDocumentModal] = useState(false);
  const [showAddProcedureModal, setShowAddProcedureModal] = useState(false);
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
  const [activeVideoMenu, setActiveVideoMenu] = useState<string | null>(null);
  // FASE 31: Estados para formulário de vídeo
  const [videoInputMethod, setVideoInputMethod] = useState<'upload' | 'link'>('link');
  const [videoFormData, setVideoFormData] = useState({
    title: '',
    url: '',
    type: 'Marcha' as Video['type'],
    visibility: 'Público' as Video['visibility'],
    caption: '',
  });
  const [videoUploadFile, setVideoUploadFile] = useState<File | null>(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  // NOVOS ESTADOS: Modal de Inativação
  const [showInactivateModal, setShowInactivateModal] = useState(false);
  const [inactivateReason, setInactivateReason] = useState<'Vendido' | 'Obito' | 'Doado' | 'Transferido'>('Vendido');
  const [inactivateDate, setInactivateDate] = useState(new Date().toISOString().split('T')[0]);
  const [localStatusHistory, setLocalStatusHistory] = useState<StatusHistoryEntry[]>([]);
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

  // FASE 2: Dados Dinâmicos
  const { data: animalDetails, isLoading: isLoadingDetails } = useAnimal(String(animal.id));
  const { data: offspringList, isLoading: isLoadingOffspring } = useAnimalOffspring(String(animal.id));
  const { data: genealogyData, isLoading: isLoadingGenealogy } = useAnimalGenealogy(String(animal.id));
  const { data: animalVideos, isLoading: isLoadingVideos } = useAnimalVideos(String(animal.id));
  const { data: healthRecords, isLoading: isLoadingHistoryHealth } = useAnimalHealthRecords(String(animal.id));
  const { data: vaccineRecords, isLoading: isLoadingHistoryVaccines } = useAnimalVaccines(String(animal.id));
  const { data: examRecords, isLoading: isLoadingHistoryExams } = useAnimalExams(String(animal.id));
  const { data: locationHistory, isLoading: isLoadingHistoryLocations } = useAnimalLocationHistory(String(animal.id));
  const { data: reproductiveEvents, isLoading: isLoadingHistoryReproduction } = useAnimalReproductiveEvents(String(animal.id));
  const { mutateAsync: createVideo } = useCreateAnimalVideo();
  const { mutateAsync: updateVideo } = useUpdateAnimalVideo();
  const { mutateAsync: deleteVideo } = useDeleteAnimalVideo();
  const { mutateAsync: updateAnimal, isPending: isSavingInactivation } = useUpdateAnimal();
  const { mutateAsync: createHealthRecord, isPending: isSavingProcedure } = useCreateHealthRecord();
  const { mutateAsync: createVaccine, isPending: isSavingVaccine } = useCreateVaccine();
  const { mutateAsync: createExam, isPending: isSavingExam } = useCreateExam();

  // Merge prop animal with details - usar fullAnimal em vez de animal para ter acesso a todos os dados sincronizados
  const fullAnimal = { ...animal, ...animalDetails };

  const tabs = [
    { id: 'overview', label: 'Visão Geral' },
    { id: 'videos', label: 'Vídeos' },
    ...(fullAnimal.premiacoes && fullAnimal.premiacoes > 0 ? [{ id: 'awards', label: `Premiações (${fullAnimal.premiacoes})` }] : []),
    { id: 'location', label: 'Localização' },
    { id: 'health', label: 'Saúde' },
    { id: 'genealogy', label: 'Genealogia' },
    ...(offspringList && offspringList.length > 0 ? [{ id: 'offspring', label: `Filhos (${offspringList.length})` }] : []),
    { id: 'documents', label: 'Documentos' },
    { id: 'history', label: 'Histórico' }
  ];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? (fullAnimal.images?.length || 1) - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === (fullAnimal.images?.length || 1) - 1 ? 0 : prev + 1
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
  const animalImages = fullAnimal.images || [fullAnimal.image];

  const currentAnimalId = String(fullAnimal.id || animal.id);
  const resolvedLocationType = normalizeLocationType(fullAnimal.localizacao);
  const resolvedServiceType = normalizeServiceType(fullAnimal.servicoTipo);
  const genealogyView = buildGenealogyView(genealogyData, {
    id: fullAnimal.id || animal.id,
    name: fullAnimal.name,
    registry: fullAnimal.registry,
    imageUrl: fullAnimal.image || (fullAnimal.images && fullAnimal.images[0]) || null,
  });

  const formatEventDate = (value?: string | null) => {
    if (!value) return '-';
    const datePart = value.split('T')[0];
    const [year, month, day] = datePart.split('-');
    if (!year || !month || !day) return value;
    return `${day}/${month}/${year}`;
  };

  const toDateValue = (value?: string | null) => {
    if (!value) return 0;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
  };

  const getReproductionLabel = (value?: string | null) => {
    switch (value) {
      case 'cobertura':
        return 'Cobertura';
      case 'inseminacao':
        return 'Inseminação';
      case 'coleta_ovulos':
        return 'Coleta de Óvulos';
      case 'transferencia_embriao':
        return 'Transferência de Embrião';
      case 'ovulacao':
        return 'Ovulação';
      default:
        return 'Evento Reprodutivo';
    }
  };

  const mapInactivationStatus = (reason: 'Vendido' | 'Obito' | 'Doado' | 'Transferido') => {
    if (reason === 'Obito') return 'Falecido';
    if (reason === 'Doado') return 'Transferido';
    return reason;
  };

  const mergedStatusHistory = useMemo(
    () => [
      ...(fullAnimal.statusHistorico || []),
      ...localStatusHistory,
    ],
    [fullAnimal.statusHistorico, localStatusHistory]
  );

  const historyEvents = useMemo<HistoryEvent[]>(() => {
    const events: HistoryEvent[] = [];

    (healthRecords || []).forEach((record) => {
      events.push({
        id: `health-${record.id}`,
        type: 'Procedimento',
        title: record.description || 'Procedimento veterinario',
        date: record.procedure_date,
        dateValue: toDateValue(record.procedure_date),
        description: record.type || undefined,
        icon: Stethoscope,
        color: 'text-emerald-500',
      });
    });

    (vaccineRecords || []).forEach((vaccine) => {
      events.push({
        id: `vaccine-${vaccine.id}`,
        type: 'Vacina',
        title: vaccine.name,
        date: vaccine.application_date,
        dateValue: toDateValue(vaccine.application_date),
        description: vaccine.veterinarian ? `Veterinario: ${vaccine.veterinarian}` : undefined,
        icon: Syringe,
        color: 'text-blue-500',
      });
    });

    (examRecords || []).forEach((exam) => {
      events.push({
        id: `exam-${exam.id}`,
        type: 'Exame',
        title: exam.exam_type || 'Exame',
        date: exam.exam_date,
        dateValue: toDateValue(exam.exam_date),
        description: exam.result ? `Resultado: ${exam.result}` : undefined,
        icon: FileText,
        color: 'text-amber-500',
      });
    });

    (locationHistory || []).forEach((entry) => {
      const title = entry.new_location
        ? `Mudanca de localizacao`
        : `Localizacao atualizada`;
      const descriptionParts = [];
      if (entry.previous_location) descriptionParts.push(`De ${entry.previous_location}`);
      if (entry.new_location) descriptionParts.push(`Para ${entry.new_location}`);
      if (entry.reason) descriptionParts.push(`Motivo: ${entry.reason}`);
      const description = descriptionParts.join(' · ') || undefined;

      events.push({
        id: `location-${entry.id}`,
        type: 'Localizacao',
        title,
        date: entry.changed_at,
        dateValue: toDateValue(entry.changed_at),
        description,
        icon: MapPin,
        color: 'text-purple-500',
      });
    });

    (reproductiveEvents || []).forEach((event) => {
      const label = getReproductionLabel(event.event_type);
      const description = event.veterinarian ? `Veterinario: ${event.veterinarian}` : event.protocol || undefined;

      events.push({
        id: `repro-${event.id}`,
        type: 'Reproducao',
        title: label,
        date: event.event_date,
        dateValue: toDateValue(event.event_date),
        description,
        icon: Heart,
        color: 'text-pink-500',
      });
    });

    mergedStatusHistory.forEach((status, index) => {
      const description = status.motivo ? `Motivo: ${status.motivo}` : undefined;
      events.push({
        id: `status-${status.data}-${index}`,
        type: 'Status',
        title: `${status.statusAnterior} -> ${status.statusNovo}`,
        date: status.data,
        dateValue: toDateValue(status.data),
        description,
        icon: AlertCircle,
        color: 'text-red-500',
      });
    });

    return events.sort((a, b) => b.dateValue - a.dateValue);
  }, [
    healthRecords,
    vaccineRecords,
    examRecords,
    locationHistory,
    reproductiveEvents,
    mergedStatusHistory,
  ]);

  const isHistoryLoading =
    isLoadingHistoryHealth ||
    isLoadingHistoryVaccines ||
    isLoadingHistoryExams ||
    isLoadingHistoryLocations ||
    isLoadingHistoryReproduction;

  const uploadProcedureFiles = async (animalId: string, files: File[]): Promise<string[]> => {
    if (!files.length) return [];

    const uploaded: string[] = [];
    for (const file of files) {
      const ext = file.name.split('.').pop();
      const fileName = `${animalId}/procedures/${Date.now()}_${Math.random().toString(36).substring(7)}${ext ? `.${ext}` : ''}`;

      const { error } = await supabase.storage
        .from('animals')
        .upload(fileName, file);

      if (error) throw error;

      const { data } = supabase.storage
        .from('animals')
        .getPublicUrl(fileName);

      if (data?.publicUrl) uploaded.push(data.publicUrl);
    }

    return uploaded;
  };

  const buildProcedureObservations = (data: VeterinaryProcedureData, uploadedUrls: string[]) => {
    const parts: string[] = [];

    if (data.time) parts.push(`Horario: ${data.time}`);
    if (data.crm) parts.push(`CRM: ${data.crm}`);
    if (data.clinic) parts.push(`Clinica: ${data.clinic}`);
    if (data.diagnosis) parts.push(`Diagnostico: ${data.diagnosis}`);
    if (data.procedures) parts.push(`Procedimentos: ${data.procedures}`);
    if (data.examsSolicited) parts.push(`Exames solicitados: ${data.examsSolicited}`);
    if (data.recommendations) parts.push(`Recomendacoes: ${data.recommendations}`);
    if (data.notes) parts.push(`Observacoes gerais: ${data.notes}`);

    if (data.medications.length > 0) {
      const meds = data.medications
        .map((med) => {
          const details = [med.dosage, med.frequency, med.duration].filter(Boolean).join(' / ');
          return details ? `${med.name} (${details})` : med.name;
        })
        .join(', ');
      parts.push(`Medicamentos: ${meds}`);
    }

    if (uploadedUrls.length > 0) {
      parts.push(`Anexos: ${uploadedUrls.join(', ')}`);
    }

    return parts.length > 0 ? parts.join(' | ') : null;
  };

  const handleSaveProcedure = async (data: VeterinaryProcedureData) => {
    try {
      const digitsOnly = data.cost ? data.cost.replace(/\D/g, '') : '';
      const costValue = digitsOnly ? Number(digitsOnly) / 100 : null;
      const uploadedUrls = await uploadProcedureFiles(currentAnimalId, data.files);

      await createHealthRecord({
        animal_id: currentAnimalId,
        haras_id: fullAnimal.haras_id,
        procedure_date: data.date,
        type: data.type,
        veterinarian: data.veterinarian || null,
        description: data.reason || data.procedures || 'Procedimento veterinario',
        cost: Number.isFinite(costValue) ? costValue : null,
        next_date: data.nextAppointment || null,
        observations: buildProcedureObservations(data, uploadedUrls),
      });

      toast.success('Procedimento registrado com sucesso!');
      setShowAddProcedureModal(false);
    } catch (error) {
      console.error('Erro ao registrar procedimento:', error);
      toast.error('Erro ao registrar procedimento. Tente novamente.');
      throw error;
    }
  };

  const handleSaveVaccine = async (data: VaccineData) => {
    try {
      await createVaccine({
        animal_id: currentAnimalId,
        haras_id: fullAnimal.haras_id,
        name: data.nome.trim(),
        application_date: data.data,
        next_dose_date: data.proximaDose || null,
        lot: data.lote || null,
        veterinarian: data.veterinario || null,
        observations: data.observacoes || null,
      });
      toast.success('Vacina registrada com sucesso!');
      setShowAddVaccineModal(false);
    } catch (error) {
      console.error('Erro ao registrar vacina:', error);
      toast.error('Erro ao registrar vacina. Tente novamente.');
      throw error;
    }
  };

  const handleSaveExam = async (data: ExamData) => {
    try {
      await createExam({
        animal_id: currentAnimalId,
        haras_id: fullAnimal.haras_id,
        exam_type: data.nome.trim(),
        exam_date: data.data,
        veterinarian: data.veterinario || null,
        result: data.resultado || null,
        observations: data.observacoes || null,
        files: data.arquivo ? [data.arquivo] : undefined,
      });
      toast.success('Exame registrado com sucesso!');
      setShowAddExamModal(false);
    } catch (error) {
      console.error('Erro ao registrar exame:', error);
      toast.error('Erro ao registrar exame. Tente novamente.');
      throw error;
    }
  };

  const handleVideoFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setVideoUploadFile(event.target.files[0]);
      event.target.value = '';
    }
  };

  const uploadVideoFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${currentAnimalId}/videos/${Date.now()}_${Math.random().toString(36).substring(7)}${fileExt ? `.${fileExt}` : ''}`;

    const { error } = await supabase.storage
      .from('animals')
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from('animals')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const resetVideoForm = () => {
    setVideoFormData({
      title: '',
      url: '',
      type: 'Marcha',
      visibility: 'Público',
      caption: '',
    });
    setVideoUploadFile(null);
  };

  const handleAddVideo = async () => {
    try {
      setIsUploadingVideo(true);

      let videoUrl = videoFormData.url;
      let source: Video['source'] | undefined;

      if (videoInputMethod === 'upload') {
        if (!videoUploadFile) {
          toast.error('Selecione um arquivo de vídeo para upload.');
          return;
        }
        videoUrl = await uploadVideoFile(videoUploadFile);
        source = 'upload';
      }

      if (!videoUrl) {
        toast.error('Informe a URL do vídeo.');
        return;
      }

      const thumbnailUrl = buildThumbnailUrl(videoUrl);

      await createVideo({
        animal_id: currentAnimalId,
        haras_id: fullAnimal.haras_id,
        title: videoFormData.title,
        url: videoUrl,
        source,
        type: videoFormData.type,
        visibility: videoFormData.visibility,
        caption: videoFormData.caption,
        thumbnail_url: thumbnailUrl || undefined,
      });

      toast.success('Vídeo adicionado com sucesso!');
      setShowAddVideoModal(false);
      resetVideoForm();
    } catch (error) {
      console.error('Erro ao adicionar vídeo:', error);
      toast.error('Erro ao adicionar vídeo. Tente novamente.');
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleEditVideo = async () => {
    if (!videoToEdit) return;
    try {
      setIsUploadingVideo(true);
      const thumbnailUrl = buildThumbnailUrl(videoFormData.url);

      await updateVideo({
        id: videoToEdit.id,
        title: videoFormData.title,
        url: videoFormData.url,
        type: videoFormData.type,
        visibility: videoFormData.visibility,
        caption: videoFormData.caption,
        ...(thumbnailUrl ? { thumbnail_url: thumbnailUrl } : {}),
      });

      toast.success('Vídeo atualizado com sucesso!');
      setShowEditVideoModal(false);
      setVideoToEdit(null);
    } catch (error) {
      console.error('Erro ao atualizar vídeo:', error);
      toast.error('Erro ao atualizar vídeo. Tente novamente.');
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleDeleteVideo = async () => {
    if (!videoToDelete) return;
    try {
      setIsUploadingVideo(true);
      await deleteVideo({ id: videoToDelete.id, animal_id: currentAnimalId });
      toast.success('Vídeo excluído com sucesso!');
      setShowDeleteVideoModal(false);
      setVideoToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir vídeo:', error);
      toast.error('Erro ao excluir vídeo. Tente novamente.');
    } finally {
      setIsUploadingVideo(false);
    }
  };

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

  // FASE 28: Dados dinâmicos dos filhos
  const offspringData = (offspringList || []).map(child => ({
    id: child.id,
    name: child.name,
    image: child.main_image_url || 'https://images.unsplash.com/photo-1667992711873-4bd87cbfbb65?auto=format&fit=crop&w=1080&q=80', // Placeholder
    birthDate: child.birth_date || '',
    sex: child.sex,
    category: child.category || 'Potro',
    status: child.status || 'Ativo',
    registry: child.registry_number || '-'
  }));

  // FASE 30: Vídeos carregados do banco
  const videosData: Video[] = (animalVideos || []).map((video) => ({
    id: video.id,
    title: video.title,
    url: video.url,
    type: normalizeVideoType(video.type),
    thumbnail: video.thumbnail_url || buildThumbnailUrl(video.url) || DEFAULT_VIDEO_THUMBNAIL,
    duration: video.duration || undefined,
    uploadDate: video.created_at ? video.created_at.split('T')[0] : '',
    visibility: video.visibility,
    source: video.source,
    caption: video.caption || undefined,
  }));

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
            <h1 className="text-2xl text-foreground dark:text-white mb-2">{fullAnimal.name}</h1>
            <p className="text-muted-foreground dark:text-[#99a1af]">{fullAnimal.registry}</p>
          </div>
          <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
            {fullAnimal.statusAtividade !== 'Inativo' ? (
              <button
                onClick={() => setShowInactivateModal(true)}
                className="w-full md:w-auto px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Marcar como Inativo
              </button>
            ) : (
              <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4" />
                Este animal já está inativo.
              </div>
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
                  className={`px-4 py-3 text-sm transition-colors whitespace-nowrap ${activeTab === tab.id
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
                      alt={fullAnimal.name}
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
                              className={`h-2 rounded-full transition-all ${index === currentImageIndex
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
                  {fullAnimal.imageCaptions && fullAnimal.imageCaptions[currentImageIndex] && (
                    <div className="px-4 py-3 bg-muted dark:bg-[#0d0d0d] rounded-lg border border-border dark:border-[rgba(255,255,255,0.1)]">
                      <p className="text-sm text-foreground dark:text-white text-center italic">
                        {fullAnimal.imageCaptions[currentImageIndex]}
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
                      {fullAnimal.sex && <InfoRow label="Sexo" value={fullAnimal.sex} />}
                      <InfoRow label="Categoria" value={fullAnimal.category} />
                      <InfoRow label="Idade" value={calculateAge(fullAnimal.birthDate)} />
                      {fullAnimal.birthDate && <InfoRow label="Nascimento" value={formatBirthDate(fullAnimal.birthDate)} />}
                      <InfoRow label="Status Reprodutivo" value={fullAnimal.status} />
                      {/* Novo: Status no Plantel */}
                      <InfoRow
                        label="Status no Plantel"
                        value={fullAnimal.statusAtividade || 'Ativo'}
                        valueClassName={fullAnimal.statusAtividade === 'Inativo' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}
                      />
                      {fullAnimal.statusAtividade === 'Inativo' && fullAnimal.motivoInativacao && (
                        <InfoRow label="Motivo" value={fullAnimal.motivoInativacao} />
                      )}
                      {fullAnimal.statusAtividade === 'Inativo' && fullAnimal.dataInativacao && (
                        <InfoRow label="Data da Inativação" value={formatBirthDate(fullAnimal.dataInativacao)} />
                      )}
                      {fullAnimal.localizacao && <LocationBadge localizacao={fullAnimal.localizacao} servicoTipo={fullAnimal.servicoTipo} />}
                    </div>

                    {/* Coluna 2: Identificação e genealogia */}
                    <div className="space-y-4">
                      {fullAnimal.chip && <InfoRow label="Chip RFID" value={fullAnimal.chip} />}
                      {fullAnimal.marca && <InfoRow label="Marca/Ferro" value={fullAnimal.marca} />}
                      <InfoRow label="Haras Atual" value={fullAnimal.haras || '-'} />
                      {fullAnimal.harasOrigem && <InfoRow label="Haras de Origem" value={fullAnimal.harasOrigem} />}
                      {fullAnimal.filhos !== undefined && fullAnimal.filhos >= 0 && (
                        <InfoRow label="Filhos Registrados" value={String(fullAnimal.filhos)} />
                      )}
                      {fullAnimal.premiacoes !== undefined && fullAnimal.premiacoes > 0 && (
                        <InfoRow label="Premiações" value={String(fullAnimal.premiacoes)} />
                      )}
                      <InfoRow label="Pelagem" value={fullAnimal.coat_color || '-'} />
                      <InfoRow label="Andamento" value={fullAnimal.gait || '-'} />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-foreground dark:text-white mb-4">Genealogia</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Pai</p>
                    <p className="text-foreground dark:text-white">{fullAnimal.father?.name || fullAnimal.father_name || 'Não informado'}</p>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af]">{fullAnimal.father?.registry_number || '-'}</p>
                  </div>
                  <div className="p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Mãe</p>
                    <p className="text-foreground dark:text-white">{fullAnimal.mother?.name || fullAnimal.mother_name || 'Não informado'}</p>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af]">{fullAnimal.mother?.registry_number || '-'}</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-foreground dark:text-white">Premiações</h4>
                  {fullAnimal.premiacoes !== undefined && fullAnimal.premiacoes >= 0 && (
                    <span className="text-sm text-muted-foreground dark:text-[#99a1af]">
                      Total: {fullAnimal.premiacoes} {fullAnimal.premiacoes === 1 ? 'prêmio' : 'prêmios'}
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

              {/* NOVA SE??O: Hist?rico de Mudan?as de Status */}
              {mergedStatusHistory.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-foreground dark:text-white">Histórico de Mudanças de Status</h4>
                  </div>
                  <div className="space-y-2">
                    {mergedStatusHistory.map((historico, index) => (
                      <div key={index} className="p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg border-l-4 border-primary dark:border-white">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-foreground dark:text-white">
                              <span className="text-red-600 dark:text-red-400">{historico.statusAnterior}</span>
                              {' -> '}
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
              {(fullAnimal.reproductionType || fullAnimal.sex === 'Macho' || fullAnimal.sex === 'Fêmea') && (
                <div>
                  <h4 className="text-foreground dark:text-white mb-4">Reprodução</h4>
                  <div className="space-y-4">
                    {/* Grid de informações reprodutivas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {fullAnimal.reproductionType && (
                        <div className="p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
                          <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Tipo Reprodutivo</p>
                          <p className="text-foreground dark:text-white">{fullAnimal.reproductionType}</p>
                        </div>
                      )}

                      {fullAnimal.activeForReproduction !== undefined && (
                        <div className="p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
                          <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Status Reprodutivo</p>
                          <p className="text-foreground dark:text-white">
                            {fullAnimal.activeForReproduction ? '?o. Ativo para Reprodução' : '?O Inativo para Reprodução'}
                          </p>
                        </div>
                      )}

                      {/* FASE 26: Contador de Coberturas */}
                      {fullAnimal.coverageCount !== undefined && fullAnimal.coverageCount > 0 && (
                        <div className="p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
                          <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Coberturas Realizadas</p>
                          <div className="flex items-center justify-between">
                            <p className="text-foreground dark:text-white text-xl">{fullAnimal.coverageCount}</p>
                            <button
                              onClick={() => alert('Funcionalidade de detalhes de coberturas será implementada em breve')}
                              className="text-sm text-primary dark:text-white hover:underline"
                            >
                              Ver Detalhes ??'
                            </button>
                          </div>
                        </div>
                      )}

                      {/* FASE 27: ?sltimo Evento Reprodutivo */}
                      {fullAnimal.lastReproductiveEvent && (
                        <div className="p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
                          <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">?sltimo Evento Reprodutivo</p>
                          <p className="text-foreground dark:text-white mb-1">{fullAnimal.lastReproductiveEvent.type}</p>
                          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">{fullAnimal.lastReproductiveEvent.date}</p>
                          <button
                            onClick={() => alert('Funcionalidade de detalhes do evento reprodutivo será implementada em breve')}
                            className="mt-2 text-sm text-primary dark:text-white hover:underline"
                          >
                            Ver Evento Completo ??'
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Filhos Registrados */}
                    {fullAnimal.filhos !== undefined && fullAnimal.filhos > 0 && (
                      <div className="p-4 bg-primary/10 dark:bg-white/10 border border-primary/20 dark:border-white/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-foreground dark:text-white mb-1">Descendentes Registrados</p>
                            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                              {fullAnimal.filhos} {fullAnimal.filhos === 1 ? 'filho registrado' : 'filhos registrados'}
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
              animalId={currentAnimalId}
              animalName={fullAnimal.name}
              onRegisterProcedure={() => setShowAddProcedureModal(true)}
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
                  {isLoadingGenealogy && (
                    <div className="text-center text-sm text-muted-foreground dark:text-[#99a1af]">
                      Carregando genealogia...
                    </div>
                  )}

                  {/* Nível 1 - Animal Principal */}
                  <div className="flex justify-center">
                    <GenealogyCard
                      name={genealogyView.root.name}
                      registry={genealogyView.root.registry}
                      image={genealogyView.root.imageUrl}
                      isMain={true}
                      isPlaceholder={genealogyView.root.isPlaceholder}
                    />
                  </div>

                  {selectedFilters.pais && (
                    <>
                      <div className="text-center">
                        <h5 className="text-lg text-foreground dark:text-white">Pais</h5>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                        {genealogyView.parents.map((parent, index) => (
                          <GenealogyCard
                            key={`parent-${index}`}
                            name={parent.name}
                            registry={parent.registry}
                            image={parent.imageUrl}
                            isPlaceholder={parent.isPlaceholder}
                            onViewDetails={parent.id ? () => onViewAnimal?.(Number(parent.id)) : undefined}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {selectedFilters.avos && (
                    <>
                      <div className="text-center">
                        <h5 className="text-lg text-foreground dark:text-white">Avós</h5>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {genealogyView.grandparents.map((grandparent, index) => (
                          <GenealogyCard
                            key={`grandparent-${index}`}
                            name={grandparent.name}
                            registry={grandparent.registry}
                            image={grandparent.imageUrl}
                            isSmall={true}
                            isPlaceholder={grandparent.isPlaceholder}
                            onViewDetails={grandparent.id ? () => onViewAnimal?.(Number(grandparent.id)) : undefined}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {selectedFilters.bisavos && (
                    <>
                      <div className="text-center">
                        <h5 className="text-lg text-foreground dark:text-white">Bisavós</h5>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                        {genealogyView.greatGrandparents.map((greatGrandparent, index) => (
                          <GenealogyCard
                            key={`great-grandparent-${index}`}
                            name={greatGrandparent.name}
                            registry={greatGrandparent.registry}
                            image={greatGrandparent.imageUrl}
                            isTiny={true}
                            isPlaceholder={greatGrandparent.isPlaceholder}
                            onViewDetails={greatGrandparent.id ? () => onViewAnimal?.(Number(greatGrandparent.id)) : undefined}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* BLOCO 14: Aba Filhos */}
          {activeTab === 'offspring' && (
            <div className="space-y-6">
              {/* Header com Título e Contador */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h4 className="text-xl text-foreground dark:text-white mb-1">
                    Descendentes Registrados
                  </h4>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                    {offspringList?.length || 0} {offspringList?.length === 1 ? 'filho registrado' : 'filhos registrados'}
                  </p>
                </div>

                {/* Botão de Filtros */}
                <div className="flex flex-wrap items-center gap-2">
                  <NativeSelect
                    value={offspringFilters.sex}
                    onChange={(e) => setOffspringFilters({ ...offspringFilters, sex: e.target.value })}
                    className="w-auto"
                  >
                    <option value="all">Todos os Sexos</option>
                    <option value="Macho">Machos</option>
                    <option value="Fêmea">Fêmeas</option>
                  </NativeSelect>

                  <NativeSelect
                    value={offspringFilters.category}
                    onChange={(e) => setOffspringFilters({ ...offspringFilters, category: e.target.value })}
                    className="w-auto"
                  >
                    <option value="all">Todas as Categorias</option>
                    <option value="Potro">Potros</option>
                    <option value="Potra">Potrancas</option>
                    <option value="Garanhão">Garanhões</option>
                    <option value="??gua">??guas</option>
                    <option value="Castrado">Castrados</option>
                  </NativeSelect>

                  <NativeSelect
                    value={offspringFilters.status}
                    onChange={(e) => setOffspringFilters({ ...offspringFilters, status: e.target.value })}
                    className="w-auto"
                  >
                    <option value="all">Todos os Status</option>
                    <option value="Ativo">Ativos</option>
                    <option value="Vendido">Vendidos</option>
                    <option value="Obito">Falecidos</option>
                  </NativeSelect>
                </div>
              </div>

              {/* Lista de Filhos */}
              {filteredOffspring.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredOffspring.map((child) => (
                    <div
                      key={child.id}
                      className="bg-muted dark:bg-[#0d0d0d] rounded-xl p-4 border border-border dark:border-[rgba(255,255,255,0.1)] hover:border-primary dark:hover:border-white transition-colors cursor-pointer"
                      onClick={() => onViewAnimal?.(Number(child.id))}
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={child.image}
                          alt={child.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-foreground dark:text-white font-medium truncate">
                            {child.name}
                          </p>
                          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                            {child.registry}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-0.5 bg-primary/10 dark:bg-white/10 rounded">
                              {child.sex === 'Macho' ? '?T,' : '?T?'} {child.sex}
                            </span>
                            <span className="text-xs text-muted-foreground dark:text-[#99a1af]">
                              {child.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground dark:text-[#99a1af]">
                            Nascimento: {child.birthDate ? formatBirthDate(child.birthDate) : 'Não informado'}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            child.status === 'Ativo'
                              ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                              : child.status === 'Vendido'
                                ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                                : 'bg-red-500/20 text-red-600 dark:text-red-400'
                          }`}>
                            {child.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground dark:text-[#99a1af]">
                    {offspringList && offspringList.length > 0
                      ? 'Nenhum filho corresponde aos filtros selecionados'
                      : 'Este animal ainda não possui descendentes registrados'}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <AnimalDocumentsSection
              animalId={currentAnimalId}
              documentUrls={fullAnimal.documents || []}
            />
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-500/10 dark:bg-gray-500/20 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h2 className="text-lg text-foreground dark:text-white">Linha do Tempo</h2>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                    Eventos vinculados ao animal
                  </p>
                </div>
              </div>

              {isHistoryLoading && (
                <div className="text-center text-sm text-muted-foreground dark:text-[#99a1af]">
                  Carregando historico...
                </div>
              )}

              {!isHistoryLoading && historyEvents.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground dark:text-[#99a1af]">
                    Nenhum evento historico encontrado para este animal.
                  </p>
                </div>
              )}

              {!isHistoryLoading && historyEvents.length > 0 && (
                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border dark:bg-[#3a3a3a]"></div>

                  <div className="space-y-6">
                    {historyEvents.map((event) => {
                      const Icon = event.icon;
                      return (
                        <div key={event.id} className="relative flex items-start gap-4">
                          <div className="relative z-10 p-2 bg-card dark:bg-[#1a1a1a] rounded-lg border-2 border-border dark:border-[#3a3a3a]">
                            <Icon className={`w-5 h-5 ${event.color}`} />
                          </div>
                          <div className="flex-1 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-foreground dark:text-white">{event.title}</p>
                                {event.description && (
                                  <p className="text-xs text-muted-foreground dark:text-[#99a1af] mt-1">
                                    {event.description}
                                  </p>
                                )}
                              </div>
                              <span className={`px-2 py-1 rounded text-xs ${event.color} bg-current/10 whitespace-nowrap`}>
                                {event.type}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground dark:text-[#99a1af] mt-2">
                              {formatEventDate(event.date)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'location' && (
            <AnimalLocationSection
              animalId={currentAnimalId}
              harasId={fullAnimal.haras_id}
              currentLocation={fullAnimal.localizacao}
              locationType={resolvedLocationType}
              serviceType={resolvedServiceType}
              availableBaias={[
                { id: 1, name: 'Baia 01 - Setor A', status: 'ocupada', animal: 'Thor' },
                { id: 2, name: 'Baia 02 - Setor A', status: 'disponível' },
                { id: 3, name: 'Baia 03 - Setor A', status: 'manutencao' },
                { id: 4, name: 'Baia 04 - Setor B', status: 'disponível' },
                { id: 5, name: 'Baia 05 - Setor B', status: 'ocupada', animal: 'Safira' },
              ]}
              availablePastos={[
                { id: 1, name: 'Pasto 01 - Norte', status: 'disponível', capacity: 20, current: 12 },
                { id: 2, name: 'Pasto 02 - Norte', status: 'cheio', capacity: 15, current: 15 },
                { id: 3, name: 'Pasto 03 - Sul', status: 'disponível', capacity: 25, current: 8 },
              ]}
            />
          )}

          {/* BLOCO 15: Aba Vídeos */}
          {activeTab === 'videos' && (
            <div className="space-y-6">
              {/* Header com Título e Botão */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h4 className="text-xl text-foreground dark:text-white mb-1">
                    Galeria de Vídeos
                  </h4>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                    {isLoadingVideos
                      ? 'Carregando vídeos...'
                      : `${videosData.length} ${videosData.length === 1 ? 'vídeo' : 'vídeos'} registrados`}
                  </p>
                </div>
                <button
                  onClick={() => {
                    resetVideoForm();
                    setVideoInputMethod('link');
                    setShowAddVideoModal(true);
                  }}
                  className="px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Vídeo
                </button>
              </div>

              {/* Grid de Vídeos */}
              {isLoadingVideos ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : videosData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {videosData.map((video) => (
                    <div
                      key={video.id}
                      className="group bg-muted dark:bg-[#0d0d0d] rounded-xl overflow-hidden border border-border dark:border-[rgba(255,255,255,0.1)] hover:border-primary dark:hover:border-white transition-all"
                    >
                      {/* Thumbnail */}
                      <div className="relative aspect-video">
                        <VideoThumbnail
                          url={video.url}
                          title={video.title}
                          fallback={video.thumbnail}
                        />
                        {/* Overlay com botão play */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => {
                              setSelectedVideo(video);
                              setShowVideoPlayer(true);
                            }}
                            className="p-3 bg-primary dark:bg-white rounded-full hover:scale-110 transition-transform"
                          >
                            <Video className="w-6 h-6 text-white dark:text-black" />
                          </button>
                        </div>
                        {/* Badge de tipo */}
                        <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 rounded text-xs text-white">
                          {video.type}
                        </div>
                        {/* Badge de visibilidade */}
                        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs ${
                          video.visibility === 'Público'
                            ? 'bg-green-500/80 text-white'
                            : 'bg-yellow-500/80 text-white'
                        }`}>
                          {video.visibility}
                        </div>
                        {/* Duração */}
                        {video.duration && (
                          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-xs text-white">
                            {video.duration}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <h5 className="text-foreground dark:text-white font-medium mb-1 line-clamp-1">
                          {video.title}
                        </h5>
                        <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-2">
                          Adicionado em {formatBirthDate(video.uploadDate)}
                        </p>
                        {video.caption && (
                          <p className="text-sm text-muted-foreground dark:text-[#99a1af] line-clamp-2">
                            {video.caption}
                          </p>
                        )}

                        {/* Ações */}
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
                          <button
                            onClick={() => {
                              setSelectedVideo(video);
                              setShowVideoPlayer(true);
                            }}
                            className="flex-1 px-3 py-1.5 text-sm bg-primary/10 dark:bg-white/10 text-primary dark:text-white rounded hover:bg-primary/20 dark:hover:bg-white/20 transition-colors"
                          >
                            Ver Vídeo
                          </button>
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveVideoMenu(activeVideoMenu === video.id ? null : video.id);
                              }}
                              className="p-1.5 hover:bg-muted dark:hover:bg-[#1a1a1a] rounded transition-colors"
                            >
                              <MoreVertical className="w-4 h-4 text-muted-foreground dark:text-[#99a1af]" />
                            </button>

                            {/* Menu Dropdown */}
                            {activeVideoMenu === video.id && (
                              <div className="absolute right-0 bottom-full mb-1 w-40 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#3a3a3a] rounded-lg shadow-lg z-10 py-1">
                                  <button
                                    onClick={() => {
                                      setVideoToEdit(video);
                                      setVideoFormData({
                                        title: video.title,
                                        url: video.url,
                                        type: video.type,
                                        visibility: video.visibility,
                                        caption: video.caption || '',
                                      });
                                      setVideoInputMethod('link');
                                      setShowEditVideoModal(true);
                                      setActiveVideoMenu(null);
                                    }}
                                  className="w-full px-4 py-2 text-sm text-left text-foreground dark:text-white hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors flex items-center gap-2"
                                >
                                  <Edit className="w-4 h-4" />
                                  Editar
                                </button>
                                <button
                                  onClick={() => {
                                    setVideoToDelete(video);
                                    setShowDeleteVideoModal(true);
                                    setActiveVideoMenu(null);
                                  }}
                                  className="w-full px-4 py-2 text-sm text-left text-red-600 dark:text-red-400 hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors flex items-center gap-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Excluir
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Video className="w-12 h-12 mx-auto mb-4 text-muted-foreground dark:text-[#99a1af]" />
                  <p className="text-muted-foreground dark:text-[#99a1af] mb-2">
                    Nenhum vídeo registrado para este animal
                  </p>
                  <button
                    onClick={() => {
                      resetVideoForm();
                      setVideoInputMethod('link');
                      setShowAddVideoModal(true);
                    }}
                    className="text-primary dark:text-white hover:underline text-sm"
                  >
                    Adicionar primeiro vídeo
                  </button>
                </div>
              )}
            </div>
          )}

          {/* BLOCO 16: Aba Premiações */}
          {activeTab === 'awards' && (
            <div className="space-y-6">
              {/* Header com Título, Contador e Botões */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h4 className="text-xl text-foreground dark:text-white mb-1">
                    Histórico de Premiações
                  </h4>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                    {awardsData.length} {awardsData.length === 1 ? 'premiação' : 'premiações'} registradas
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {/* Filtros */}
                  <NativeSelect
                    value={awardFilters.year}
                    onChange={(e) => setAwardFilters({ ...awardFilters, year: e.target.value })}
                    className="w-auto"
                  >
                    <option value="all">Todos os Anos</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                  </NativeSelect>

                  <NativeSelect
                    value={awardFilters.placement}
                    onChange={(e) => setAwardFilters({ ...awardFilters, placement: e.target.value })}
                    className="w-auto"
                  >
                    <option value="all">Todas as Colocações</option>
                    <option value="Campeão">Campeão</option>
                    <option value="1º Lugar">1º Lugar</option>
                    <option value="2º Lugar">2º Lugar</option>
                    <option value="3º Lugar">3º Lugar</option>
                    <option value="Reservado">Reservado</option>
                  </NativeSelect>

                  <NativeSelect
                    value={awardSortBy}
                    onChange={(e) => setAwardSortBy(e.target.value as 'recent' | 'oldest' | 'placement')}
                    className="w-auto"
                  >
                    <option value="recent">Mais Recentes</option>
                    <option value="oldest">Mais Antigos</option>
                    <option value="placement">Por Colocação</option>
                  </NativeSelect>

                  <button
                    onClick={() => setShowAddAwardModal(true)}
                    className="px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar
                  </button>
                </div>
              </div>

              {/* Lista de Premiações */}
              {filteredAndSortedAwards.length > 0 ? (
                <div className="space-y-3">
                  {filteredAndSortedAwards.map((award) => (
                    <div
                      key={award.id}
                      className="bg-muted dark:bg-[#0d0d0d] rounded-xl p-4 border border-border dark:border-[rgba(255,255,255,0.1)] hover:border-primary dark:hover:border-white transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedAward(award);
                        setShowAwardDetailsModal(true);
                      }}
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        {/* Badge de Colocação */}
                        <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center ${
                          award.placementType === 'Campeão' || award.placementType === '1º Lugar'
                            ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                            : award.placementType === '2º Lugar'
                              ? 'bg-gray-400/20 text-gray-600 dark:text-gray-400'
                              : award.placementType === '3º Lugar'
                                ? 'bg-amber-600/20 text-amber-700 dark:text-amber-500'
                                : 'bg-primary/10 dark:bg-white/10 text-primary dark:text-white'
                        }`}>
                          <Trophy className="w-6 h-6" />
                        </div>

                        {/* Info Principal */}
                        <div className="flex-1 min-w-0">
                          <h5 className="text-foreground dark:text-white font-medium truncate">
                            {award.eventName}
                          </h5>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground dark:text-[#99a1af]">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatBirthDate(award.date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {award.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Trophy className="w-3.5 h-3.5" />
                              {award.category}
                            </span>
                          </div>
                        </div>

                        {/* Colocação e Pontos */}
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className={`text-lg font-bold ${
                              award.placementType === 'Campeão' || award.placementType === '1º Lugar'
                                ? 'text-yellow-600 dark:text-yellow-400'
                                : award.placementType === '2º Lugar'
                                  ? 'text-gray-600 dark:text-gray-400'
                                  : award.placementType === '3º Lugar'
                                    ? 'text-amber-700 dark:text-amber-500'
                                    : 'text-primary dark:text-white'
                            }`}>
                              {award.placement}
                            </p>
                            {award.points && (
                              <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                                {award.points} pontos
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Preview da Descrição */}
                      {award.description && (
                        <p className="mt-3 text-sm text-muted-foreground dark:text-[#99a1af] line-clamp-2">
                          {award.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground dark:text-[#99a1af]" />
                  <p className="text-muted-foreground dark:text-[#99a1af] mb-2">
                    {awardsData.length > 0
                      ? 'Nenhuma premiação corresponde aos filtros selecionados'
                      : 'Este animal ainda não possui premiações registradas'}
                  </p>
                  <button
                    onClick={() => setShowAddAwardModal(true)}
                    className="text-primary dark:text-white hover:underline text-sm"
                  >
                    Adicionar primeira premiação
                  </button>
                </div>
              )}

              {/* Resumo Estatístico */}
              {filteredAndSortedAwards.length > 0 && (
                <div className="mt-8 pt-6 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-muted dark:bg-[#0d0d0d] rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-foreground dark:text-white">
                        {filteredAndSortedAwards.filter(a => a.placementType === 'Campeão' || a.placementType === '1º Lugar').length}
                      </p>
                      <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Campeonatos</p>
                    </div>
                    <div className="bg-muted dark:bg-[#0d0d0d] rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-foreground dark:text-white">
                        {filteredAndSortedAwards.filter(a => a.placementType === '2º Lugar').length}
                      </p>
                      <p className="text-sm text-muted-foreground dark:text-[#99a1af]">2º Lugares</p>
                    </div>
                    <div className="bg-muted dark:bg-[#0d0d0d] rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-foreground dark:text-white">
                        {filteredAndSortedAwards.filter(a => a.placementType === '3º Lugar').length}
                      </p>
                      <p className="text-sm text-muted-foreground dark:text-[#99a1af]">3º Lugares</p>
                    </div>
                    <div className="bg-muted dark:bg-[#0d0d0d] rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-foreground dark:text-white">
                        {filteredAndSortedAwards.reduce((acc, a) => acc + (a.points || 0), 0)}
                      </p>
                      <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Pontos Totais</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal: Árvore Genealógica Completa */}
      {showFullGenealogyTree && (
        <GenealogyTree
          genealogy={genealogyView}
          isLoading={isLoadingGenealogy}
          onClose={() => setShowFullGenealogyTree(false)}
          onViewAnimal={onViewAnimal}
        />
      )}

      {/* Modais de Vídeo */}
      {/* Modal: Player de Vídeo */}
      {showVideoPlayer && selectedVideo && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl w-full max-w-4xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
              <h3 className="text-lg text-foreground dark:text-white">{selectedVideo.title}</h3>
              <button
                onClick={() => setShowVideoPlayer(false)}
                className="p-2 hover:bg-muted dark:hover:bg-[#0d0d0d] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
              </button>
            </div>

            {/* Player */}
              <div className="aspect-video bg-black">
                {buildEmbedUrl(selectedVideo.url) ? (
                  <iframe
                    src={buildEmbedUrl(selectedVideo.url) || ''}
                    title={selectedVideo.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : isDirectVideoUrl(selectedVideo.url) ? (
                  <video
                    src={selectedVideo.url}
                    className="w-full h-full"
                    controls
                  />
                ) : (
                  <iframe
                    src={selectedVideo.url}
                    title={selectedVideo.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>

            {/* Info */}
            <div className="p-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground dark:text-[#99a1af] mb-2">
                <span className="px-2 py-1 bg-primary/10 dark:bg-white/10 rounded">
                  {selectedVideo.type}
                </span>
                <span>{selectedVideo.visibility}</span>
                <span>{formatBirthDate(selectedVideo.uploadDate)}</span>
              </div>
              {selectedVideo.caption && (
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                  {selectedVideo.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Adicionar Vídeo */}
      {showAddVideoModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl w-full max-w-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
              <h3 className="text-xl text-foreground dark:text-white">Adicionar Vídeo</h3>
              <button
                onClick={() => {
                  setShowAddVideoModal(false);
                  resetVideoForm();
                }}
                className="p-2 hover:bg-muted dark:hover:bg-[#0d0d0d] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddVideo();
              }}
              className="p-6 space-y-4"
            >
              {/* Tipo de Input */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setVideoInputMethod('link');
                    setVideoUploadFile(null);
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm transition-colors ${
                    videoInputMethod === 'link'
                      ? 'bg-primary dark:bg-white text-white dark:text-black'
                      : 'bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white'
                  }`}
                >
                  <Link className="w-4 h-4 inline mr-2" />
                  Link
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVideoInputMethod('upload');
                    setVideoFormData({ ...videoFormData, url: '' });
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm transition-colors ${
                    videoInputMethod === 'upload'
                      ? 'bg-primary dark:bg-white text-white dark:text-black'
                      : 'bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white'
                  }`}
                >
                  <Upload className="w-4 h-4 inline mr-2" />
                  Upload
                </button>
              </div>

              {/* Título */}
              <div>
                <label className="block text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                  Título do Vídeo
                </label>
                <input
                  type="text"
                  value={videoFormData.title}
                  onChange={(e) => setVideoFormData({ ...videoFormData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[#333333] rounded-lg text-foreground dark:text-white"
                  placeholder="Ex: Demonstração de Marcha"
                  required
                />
              </div>

              {/* URL ou Upload */}
              {videoInputMethod === 'link' ? (
                <div>
                  <label className="block text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                    URL do Vídeo (YouTube, Vimeo, etc.)
                  </label>
                  <input
                    type="url"
                    value={videoFormData.url}
                    onChange={(e) => setVideoFormData({ ...videoFormData, url: e.target.value })}
                    className="w-full px-4 py-2 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[#333333] rounded-lg text-foreground dark:text-white"
                    placeholder="https://..."
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                    Arquivo de Vídeo
                  </label>
                  <div
                    className="border-2 border-dashed border-border dark:border-[#333333] rounded-lg p-8 text-center cursor-pointer hover:border-primary dark:hover:border-white/50 transition-colors"
                    onClick={() => document.getElementById('animal-video-upload-input')?.click()}
                  >
                    <Video className="w-8 h-8 mx-auto mb-2 text-muted-foreground dark:text-[#99a1af]" />
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                      Clique para selecionar ou arraste o vídeo aqui
                    </p>
                    <p className="text-xs text-muted-foreground dark:text-[#99a1af] mt-1">
                      MP4, MOV, AVI (máx. 100MB)
                    </p>
                    {videoUploadFile && (
                      <p className="text-sm text-primary dark:text-white mt-3">
                        {videoUploadFile.name}
                      </p>
                    )}
                  </div>
                  <input
                    id="animal-video-upload-input"
                    type="file"
                    accept="video/*"
                    onChange={handleVideoFileSelect}
                    className="hidden"
                  />
                </div>
              )}

              {/* Tipo de Vídeo */}
              <div>
                <label className="block text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                  Tipo
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

              {/* Visibilidade */}
              <div>
                <label className="block text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                  Visibilidade
                </label>
                <NativeSelect
                  value={videoFormData.visibility}
                  onChange={(e) => setVideoFormData({ ...videoFormData, visibility: e.target.value as Video['visibility'] })}
                >
                  <option value="Público">Público</option>
                  <option value="Privado">Privado</option>
                </NativeSelect>
              </div>

              {/* Legenda */}
              <div>
                <label className="block text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                  Descrição/Legenda
                </label>
                <textarea
                  value={videoFormData.caption}
                  onChange={(e) => setVideoFormData({ ...videoFormData, caption: e.target.value })}
                  className="w-full px-4 py-2 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[#333333] rounded-lg text-foreground dark:text-white resize-none"
                  rows={3}
                  placeholder="Descreva o conteúdo do vídeo..."
                />
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddVideoModal(false);
                    resetVideoForm();
                  }}
                  className="flex-1 px-4 py-2 border border-border dark:border-[#333333] rounded-lg text-foreground dark:text-white hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isUploadingVideo}
                  className="flex-1 px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploadingVideo ? 'Salvando...' : 'Adicionar Vídeo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Editar Vídeo */}
      {showEditVideoModal && videoToEdit && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl w-full max-w-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
              <h3 className="text-xl text-foreground dark:text-white">Editar Vídeo</h3>
              <button
                onClick={() => setShowEditVideoModal(false)}
                className="p-2 hover:bg-muted dark:hover:bg-[#0d0d0d] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditVideo();
              }}
              className="p-6 space-y-4"
            >
              {/* Título */}
              <div>
                <label className="block text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                  Título do Vídeo
                </label>
                <input
                  type="text"
                  value={videoFormData.title}
                  onChange={(e) => setVideoFormData({ ...videoFormData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[#333333] rounded-lg text-foreground dark:text-white"
                  required
                />
              </div>

              {/* URL */}
              <div>
                <label className="block text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                  URL do Vídeo
                </label>
                <input
                  type="url"
                  value={videoFormData.url}
                  onChange={(e) => setVideoFormData({ ...videoFormData, url: e.target.value })}
                  className="w-full px-4 py-2 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[#333333] rounded-lg text-foreground dark:text-white"
                  required
                />
              </div>

              {/* Tipo */}
              <div>
                <label className="block text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                  Tipo
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

              {/* Visibilidade */}
              <div>
                <label className="block text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                  Visibilidade
                </label>
                <NativeSelect
                  value={videoFormData.visibility}
                  onChange={(e) => setVideoFormData({ ...videoFormData, visibility: e.target.value as Video['visibility'] })}
                >
                  <option value="Público">Público</option>
                  <option value="Privado">Privado</option>
                </NativeSelect>
              </div>

              {/* Legenda */}
              <div>
                <label className="block text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                  Descrição/Legenda
                </label>
                <textarea
                  value={videoFormData.caption}
                  onChange={(e) => setVideoFormData({ ...videoFormData, caption: e.target.value })}
                  className="w-full px-4 py-2 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[#333333] rounded-lg text-foreground dark:text-white resize-none"
                  rows={3}
                />
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditVideoModal(false)}
                  className="flex-1 px-4 py-2 border border-border dark:border-[#333333] rounded-lg text-foreground dark:text-white hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isUploadingVideo}
                  className="flex-1 px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploadingVideo ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirmar Exclusão de Vídeo */}
      {showDeleteVideoModal && videoToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
              <h3 className="text-xl text-foreground dark:text-white">Confirmar Exclusão</h3>
              <button
                onClick={() => setShowDeleteVideoModal(false)}
                className="p-2 hover:bg-muted dark:hover:bg-[#0d0d0d] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-muted-foreground dark:text-[#99a1af] mb-4">
                Tem certeza que deseja excluir o vídeo <strong className="text-foreground dark:text-white">{videoToDelete.title}</strong>?
              </p>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-6">
                Esta ação não pode ser desfeita.
              </p>

              {/* Botões */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteVideoModal(false)}
                  className="flex-1 px-4 py-2 border border-border dark:border-[#333333] rounded-lg text-foreground dark:text-white hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteVideo}
                  disabled={isUploadingVideo}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploadingVideo ? 'Excluindo...' : 'Excluir'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modais de Premiações */}
      {showAwardDetailsModal && (
        <AwardsDetailModal
          awards={fullAnimal.awards || []}
          animalName={fullAnimal.name}
          onClose={() => {
            setShowAwardDetailsModal(false);
            setSelectedAward(null);
          }}
        />
      )}

      {/* Modal: Adicionar/Editar Premiação */}
      {showAddAwardModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl w-full max-w-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
              <h3 className="text-xl text-foreground dark:text-white">
                {selectedAward ? 'Editar Premiação' : 'Adicionar Premiação'}
              </h3>
              <button
                onClick={() => {
                  setShowAddAwardModal(false);
                  setSelectedAward(null);
                }}
                className="p-2 hover:bg-muted dark:hover:bg-[#0d0d0d] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                console.log('Salvando premiação:', selectedAward?.id);
                // TODO: Implementar salvamento no banco
                alert(selectedAward ? 'Premiação atualizada!' : 'Premiação adicionada!');
                setShowAddAwardModal(false);
                setSelectedAward(null);
              }}
              className="p-6 space-y-4"
            >
              {/* Nome do Evento */}
              <div>
                <label className="block text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                  Nome do Evento
                </label>
                <input
                  type="text"
                  defaultValue={selectedAward?.eventName}
                  className="w-full px-4 py-2 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[#333333] rounded-lg text-foreground dark:text-white"
                  placeholder="Ex: Exposição Nacional ABCCMM"
                  required
                />
              </div>

              {/* Data */}
              <div>
                <label className="block text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                  Data do Evento
                </label>
                <input
                  type="date"
                  defaultValue={selectedAward?.date}
                  className="w-full px-4 py-2 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[#333333] rounded-lg text-foreground dark:text-white"
                  required
                />
              </div>

              {/* Local */}
              <div>
                <label className="block text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                  Local
                </label>
                <input
                  type="text"
                  defaultValue={selectedAward?.location}
                  className="w-full px-4 py-2 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[#333333] rounded-lg text-foreground dark:text-white"
                  placeholder="Ex: Belo Horizonte - MG"
                />
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                  Categoria
                </label>
                <input
                  type="text"
                  defaultValue={selectedAward?.category}
                  className="w-full px-4 py-2 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[#333333] rounded-lg text-foreground dark:text-white"
                  placeholder="Ex: Garanhão Adulto"
                />
              </div>

              {/* Colocação */}
              <div>
                <label className="block text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                  Colocação
                </label>
                <NativeSelect defaultValue={selectedAward?.placementType || '1º Lugar'}>
                  <option value="Campeão">Campeão</option>
                  <option value="1º Lugar">1º Lugar</option>
                  <option value="2º Lugar">2º Lugar</option>
                  <option value="3º Lugar">3º Lugar</option>
                  <option value="Reservado">Reservado Campeão</option>
                  <option value="Menção Honrosa">Menção Honrosa</option>
                </NativeSelect>
              </div>

              {/* Pontos */}
              <div>
                <label className="block text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                  Pontos
                </label>
                <input
                  type="number"
                  defaultValue={selectedAward?.points}
                  className="w-full px-4 py-2 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[#333333] rounded-lg text-foreground dark:text-white"
                  placeholder="Ex: 98"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                  Descrição
                </label>
                <textarea
                  defaultValue={selectedAward?.description}
                  className="w-full px-4 py-2 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[#333333] rounded-lg text-foreground dark:text-white resize-none"
                  rows={3}
                  placeholder="Descreva a premiação..."
                />
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddAwardModal(false);
                    setSelectedAward(null);
                  }}
                  className="flex-1 px-4 py-2 border border-border dark:border-[#333333] rounded-lg text-foreground dark:text-white hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity"
                >
                  {selectedAward ? 'Salvar Alterações' : 'Adicionar Premiação'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BLOCO 17: Modais de Saude */}
      <RegisterVeterinaryProcedureModal
        isOpen={showAddProcedureModal}
        onClose={() => setShowAddProcedureModal(false)}
        onSave={handleSaveProcedure}
        isSaving={isSavingProcedure}
        animalName={fullAnimal.name}
      />

      <RegisterVaccineModal
        isOpen={showAddVaccineModal}
        onClose={() => setShowAddVaccineModal(false)}
        onSave={handleSaveVaccine}
        isSaving={isSavingVaccine}
        animalName={fullAnimal.name}
      />

      <RegisterExamModal
        isOpen={showAddExamModal}
        onClose={() => setShowAddExamModal(false)}
        onSave={handleSaveExam}
        isSaving={isSavingExam}
        animalName={fullAnimal.name}
      />

      {/* Modal: Inativar Animal */}
      {showInactivateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
              <h3 className="text-xl text-foreground dark:text-white">Marcar como Inativo</h3>
              <button
                onClick={() => setShowInactivateModal(false)}
                className="p-2 hover:bg-muted dark:hover:bg-[#0d0d0d] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
              </button>
            </div>

            {/* Content */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (isSavingInactivation) return;
                if (fullAnimal.statusAtividade === 'Inativo') {
                  toast.info('Este animal já está inativo.');
                  setShowInactivateModal(false);
                  return;
                }
                try {
                  const mappedStatus = mapInactivationStatus(inactivateReason);
                  const managementPayload = JSON.stringify({
                    motivo: inactivateReason,
                    data: inactivateDate,
                  });

                  await updateAnimal({
                    id: currentAnimalId,
                    status: mappedStatus,
                    management_status: managementPayload,
                  });

                  setLocalStatusHistory((prev) => [
                    {
                      data: inactivateDate,
                      statusAnterior: fullAnimal.statusAtividade || 'Ativo',
                      statusNovo: 'Inativo',
                      motivo: inactivateReason,
                      usuario: 'Você',
                    },
                    ...prev,
                  ]);

                  toast.success(`${fullAnimal.name} foi marcado como inativo.`);
                  setShowInactivateModal(false);
                } catch (error) {
                  console.error('Erro ao inativar animal:', error);
                  toast.error('Erro ao marcar como inativo. Tente novamente.');
                }
              }}
              className="p-6 space-y-4"
            >
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-foreground dark:text-white">
                      Você está prestes a marcar <strong>{fullAnimal.name}</strong> como inativo.
                    </p>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-1">
                      Esta ação criará um registro permanente no histórico do animal.
                    </p>
                  </div>
                </div>
              </div>

              {/* Motivo */}
              <div>
                <label className="block text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                  Motivo da Inativação
                </label>
                <NativeSelect
                  value={inactivateReason}
                  onChange={(e) => setInactivateReason(e.target.value as typeof inactivateReason)}
                >
                  <option value="Vendido">Venda</option>
                  <option value="Obito">Obito</option>
                  <option value="Doado">Doação</option>
                  <option value="Transferido">Transferência</option>
                </NativeSelect>
              </div>

              {/* Data */}
              <div>
                <label className="block text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                  Data da Inativação
                </label>
                <input
                  type="date"
                  value={inactivateDate}
                  onChange={(e) => setInactivateDate(e.target.value)}
                  className="w-full px-4 py-2 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[#333333] rounded-lg text-foreground dark:text-white"
                  required
                />
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowInactivateModal(false)}
                  className="flex-1 px-4 py-2 border border-border dark:border-[#333333] rounded-lg text-foreground dark:text-white hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSavingInactivation}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSavingInactivation ? 'Salvando...' : 'Confirmar Inativação'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente auxiliar para exibir informações em linha
function InfoRow({ label, value, valueClassName }: { label: string; value: string; valueClassName?: string }) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-sm text-muted-foreground dark:text-[#99a1af]">{label}</span>
      <span className={`text-sm font-medium text-foreground dark:text-white ${valueClassName || ''}`}>{value}</span>
    </div>
  );
}

// Componente para badge de localizacao
function LocationBadge({ localizacao, servicoTipo }: { localizacao?: string; servicoTipo?: string }) {
  const getLocationColor = (loc: string) => {
    const type = normalizeLocationType(loc);
    if (type === 'Baia') return 'bg-blue-500/20 text-blue-600 dark:text-blue-400';
    if (type === 'Pasto') return 'bg-green-500/20 text-green-600 dark:text-green-400';
    if (type === 'Servico') return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400';
    return 'bg-muted dark:bg-[#0d0d0d] text-muted-foreground dark:text-[#99a1af]';
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`px-2 py-1 rounded text-xs ${getLocationColor(localizacao || '')}`}>
        <MapPin className="w-3 h-3 inline mr-1" />
        {localizacao}
      </span>
      {servicoTipo && (
        <span className="px-2 py-1 rounded text-xs bg-primary/10 dark:bg-white/10 text-primary dark:text-white">
          {servicoTipo}
        </span>
      )}
    </div>
  );
}

// Componente de Card para Genealogia
interface GenealogyCardProps {
  name: string;
  registry: string;
  image: string;
  isMain?: boolean;
  isSmall?: boolean;
  isTiny?: boolean;
  isPlaceholder?: boolean;
  onViewDetails?: () => void;
}

function GenealogyCard({ name, registry, image, isMain, isSmall, isTiny, isPlaceholder, onViewDetails }: GenealogyCardProps) {
  if (isTiny) {
    return (
      <div className={`text-center ${isPlaceholder ? 'opacity-70' : ''}`}>
        <img
          src={image}
          alt={name}
          className="w-12 h-12 rounded-full mx-auto mb-1 object-cover"
        />
        <p className="text-xs text-foreground dark:text-white truncate">{name}</p>
        <p className="text-[10px] text-muted-foreground dark:text-[#99a1af] truncate">{registry}</p>
      </div>
    );
  }

  return (
    <div className={`bg-muted dark:bg-[#0d0d0d] rounded-xl overflow-hidden border border-border dark:border-[rgba(255,255,255,0.1)] ${isMain ? 'ring-2 ring-primary dark:ring-white' : ''} ${isPlaceholder ? 'opacity-70' : ''}`}>
      <img
        src={image}
        alt={name}
        className={`w-full object-cover ${isSmall ? 'h-24' : 'h-32'}`}
      />
      <div className={`p-3 ${isSmall ? 'p-2' : ''}`}>
        <p className={`font-medium text-foreground dark:text-white truncate ${isSmall ? 'text-sm' : ''}`}>{name}</p>
        <p className={`text-muted-foreground dark:text-[#99a1af] truncate ${isSmall ? 'text-xs' : 'text-sm'}`}>{registry}</p>
        {onViewDetails && !isSmall && (
          <button
            onClick={onViewDetails}
            className="mt-2 text-xs text-primary dark:text-white hover:underline"
          >
            Ver Detalhes
          </button>
        )}
      </div>
    </div>
  );
}
