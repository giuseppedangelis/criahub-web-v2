import { ArrowLeft, Upload, X, Camera, FileText, Plus, Video, Loader2, Lock, Home, PlaneTakeoff, Users } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { NativeSelect } from '../ui/native-select';
import { useSaveAnimalOwnershipShares, useUpdateAnimal } from '@/hooks/useAnimals';
import { useHarasSettings } from '@/hooks/useHarasSettings';
import { useUser } from '@/contexts/UserContext';
import { createClient } from '@/lib/supabase/client';
import { isAdultByAgeOrCategory, isManualCastradoCategory, normalizeAnimalStatus, resolveManagedCategory } from '@/lib/animal-classification';
import {
  buildAnimalLocationLabel,
  getLocationOptionsForType,
  getServiceTypeLabel,
  isHospedagemLocation,
  isLocationAtHaras,
  normalizeHarasLocationSettings,
  normalizeServiceType,
  parseAnimalLocation,
  unwrapLocationOptionLabel,
  withCurrentLocationOption,
} from '@/lib/animal-location';
import { eventsService } from '@/services/events';
import { OwnershipSharesModal } from './OwnershipSharesModal';
import type { AnimalOwnershipShare, OwnershipShareDraft } from '@/types';

interface Animal {
  id: string;
  abccmm_rowid?: string | null;
  name: string;
  registry: string;
  registry_number?: string;
  chip?: string;
  chip_number?: string;
  sex?: string;
  birthDate?: string;
  birth_date?: string;
  father_id?: string | null;
  mother_id?: string | null;
  category: string;
  age: string;
  haras: string;
  haras_id?: string;
  status: string;
  statusColor?: string;
  localizacao?: string;
  location?: string;
  status_manejo?: string;
  servicoTipo?: string;
  service_type?: string;
  coat_color?: string;
  pelagem?: string;
  gait?: string;
  father_name?: string;
  documents?: string[];
  mother_name?: string;
  pai?: string;
  mae?: string;
  origin_haras?: string;
  harasOrigem?: string;
  observations?: string;
  filhos?: number;
  premiacoes?: number;
  image: string;
  main_image_url?: string;
  images?: string[];
  imageCaptions?: string[];
  weight?: number;
  height?: number;
  is_at_haras?: boolean;
  presence_manual_override?: boolean;
  ownership_shares?: AnimalOwnershipShare[];
  proprietario?: string | null;
}

interface BreederEditarAnimalProps {
  animal: Animal;
  onBack: () => void;
  onSave: () => void;
}

interface MediaItem {
  id: string;
  url: string;
  caption: string;
  type: 'image' | 'video';
  isExisting: boolean;
}

interface DocumentItem {
  id: string;
  name: string;
  url: string;
  isExisting: boolean;
}

export function BreederEditarAnimal({ animal, onBack, onSave }: BreederEditarAnimalProps) {
  const DEFAULT_PLACEHOLDER = '';
  const SERVICE_TYPE_OPTIONS = ['Reproducao', 'Trabalho', 'Repouso', 'Hospedagem', 'Compra', 'Nascimento', 'Outro'] as const;

  const updateAnimalMutation = useUpdateAnimal();
  const { stableHarasId } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [hydratedAnimal, setHydratedAnimal] = useState<Animal | null>(null);
  const [stallions, setStallions] = useState<{ id: string; name: string; registry_number?: string | null; birth_date?: string | null; category?: string }[]>([]);
  const [mares, setMares] = useState<{ id: string; name: string; registry_number?: string | null; birth_date?: string | null; category?: string }[]>([]);
  const [fatherSearch, setFatherSearch] = useState('');
  const [motherSearch, setMotherSearch] = useState('');
  const isOfficialDataLocked = Boolean(animal.abccmm_rowid);
  const effectiveHarasId = animal.haras_id || stableHarasId || '';
  const { data: harasSettings } = useHarasSettings(effectiveHarasId);
  const locationSettings = useMemo(
    () => normalizeHarasLocationSettings(harasSettings?.location_settings),
    [harasSettings?.location_settings]
  );
  const [returnReminderDate, setReturnReminderDate] = useState('');
  const [isAtHaras, setIsAtHaras] = useState<boolean>((animal as Animal).is_at_haras ?? true);
  const [presenceManualOverride, setPresenceManualOverride] = useState<boolean>(false);
  const [showOwnershipModal, setShowOwnershipModal] = useState(false);
  const { mutateAsync: saveOwnershipShares, isPending: isSavingOwnership } = useSaveAnimalOwnershipShares();
  const currentShares: AnimalOwnershipShare[] = useMemo(() => {
    const src = hydratedAnimal?.ownership_shares ?? animal.ownership_shares ?? [];
    return src.filter((s) => !s.end_date);
  }, [hydratedAnimal?.ownership_shares, animal.ownership_shares]);
  const animalBirthDateIso = useMemo(() => {
    const src = hydratedAnimal?.birthDate || hydratedAnimal?.birth_date || animal.birthDate || animal.birth_date || '';
    if (!src) return null;
    return src.split('T')[0] || src;
  }, [hydratedAnimal?.birthDate, hydratedAnimal?.birth_date, animal.birthDate, animal.birth_date]);
  const normalizeCategoryValue = (value?: string | null) => {
    switch (value) {
      case 'Égua':
        return 'egua';
      case 'Garanhão':
        return 'garanhao';
      case 'Potro':
        return 'potro';
      case 'Potra':
      case 'Potranca':
        return 'potra';
      case 'Castrado':
        return 'castrado';
      default:
        return value || '';
    }
  };

  const buildFormData = (source: Animal | null | undefined) => {
    const parsedLocation = parseAnimalLocation(
      source?.localizacao || source?.location,
      source?.servicoTipo || source?.service_type || (source as any)?.tipo_servico
    );

    return {
      nome: source?.name || '',
      registro: source?.registry || source?.registry_number || '',
      chip: source?.chip || source?.chip_number || '',
      categoria: normalizeCategoryValue(source?.category),
      sexo: source?.sex || 'Macho',
      dataNascimento: source?.birthDate || source?.birth_date || '',
      pelagem: source?.coat_color || source?.pelagem || '',
      andamento: source?.gait || 'Marchado',
      pai_id: source?.father_id || (source as any)?.pai_id || (source?.father_name ? 'external' : ''),
      pai: source?.father_name || source?.pai || '',
      mae_id: source?.mother_id || (source as any)?.mae_id || (source?.mother_name ? 'external' : ''),
      mae: source?.mother_name || source?.mae || '',
      haras: source?.haras || '',
      status: normalizeAnimalStatus(source?.status) || 'ativo',
      statusManejo: (source as any)?.status_manejo || (source as any)?.management_status || '',
      localizacaoTipo: parsedLocation.locationType,
      localizacao: parsedLocation.locationName || '',
      servicoTipo: parsedLocation.serviceType || '',
      origemHaras: source?.origin_haras || source?.harasOrigem || '',
      observacoes: source?.observations || '',
      peso: source?.weight || '',
      altura: source?.height || '',
    };
  };

  // Initialize form data with actual animal data from the database
  const [formData, setFormData] = useState(() => buildFormData(animal));
  const originalParsedLocation = useMemo(
    () => parseAnimalLocation(
      (hydratedAnimal || animal)?.localizacao || (hydratedAnimal || animal)?.location,
      (hydratedAnimal || animal)?.servicoTipo || (hydratedAnimal || animal)?.service_type
    ),
    [animal, hydratedAnimal]
  );
  const locationOptions = useMemo(() => {
    const baseOptions = getLocationOptionsForType(locationSettings, formData.localizacaoTipo);
    const currentLocationName =
      originalParsedLocation.locationType === formData.localizacaoTipo
        ? originalParsedLocation.locationName
        : '';
    return withCurrentLocationOption(baseOptions, currentLocationName);
  }, [formData.localizacaoTipo, locationSettings, originalParsedLocation.locationName, originalParsedLocation.locationType]);
  const normalizedServiceType = normalizeServiceType(formData.servicoTipo);
  const isServiceLocation = formData.localizacaoTipo === 'Servico';
  const isHospedagemSelection =
    isServiceLocation
    && (
      normalizedServiceType === 'Hospedagem'
      || isHospedagemLocation(formData.localizacao, formData.servicoTipo)
    );

  useEffect(() => {
    let isMounted = true;

    async function loadAnimalDetails() {
      const { animalsService } = await import('@/services/animals');
      const fullAnimal = await animalsService.getById(String(animal.id));
      if (isMounted && fullAnimal) {
        setHydratedAnimal(fullAnimal as unknown as Animal);
      }
    }

    setHydratedAnimal(null);
    loadAnimalDetails().catch((error) => {
      console.error('Erro ao carregar ficha completa do animal para edição:', error);
    });

    return () => {
      isMounted = false;
    };
  }, [animal.id]);

  // Update form data when animal prop changes
  useEffect(() => {
    setFormData(buildFormData(hydratedAnimal || animal));
  }, [animal, hydratedAnimal]);

  // Sincroniza presença com o animal hidratado (fonte de verdade do banco).
  useEffect(() => {
    const src = hydratedAnimal || animal;
    if (src?.is_at_haras !== undefined) {
      setIsAtHaras(Boolean(src.is_at_haras));
    }
    if (src?.presence_manual_override !== undefined) {
      setPresenceManualOverride(Boolean(src.presence_manual_override));
    }
  }, [hydratedAnimal, animal]);

  // Auto-atualiza presença conforme localização muda (só se ainda não houve override manual na edição).
  useEffect(() => {
    if (presenceManualOverride) return;
    const normalized = normalizeServiceType(formData.servicoTipo);
    const next = isLocationAtHaras(formData.localizacaoTipo, normalized);
    setIsAtHaras(next);
  }, [formData.localizacaoTipo, formData.servicoTipo, presenceManualOverride]);

  useEffect(() => {
    if (locationOptions.length === 0) return;

    const currentLocation = unwrapLocationOptionLabel(formData.localizacao || '');
    const matchingOption = locationOptions.find(
      (option) => unwrapLocationOptionLabel(option) === currentLocation
    );

    if (matchingOption) {
      if (formData.localizacao !== matchingOption) {
        setFormData((prev) => ({
          ...prev,
          localizacao: matchingOption,
        }));
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      localizacao: locationOptions[0],
    }));
  }, [formData.localizacao, locationOptions]);

  useEffect(() => {
    const autoCategory = resolveManagedCategory(formData.sexo, formData.dataNascimento, formData.categoria);
    if (autoCategory && formData.categoria !== autoCategory) {
      if (isManualCastradoCategory(formData.categoria)) return;
      setFormData((prev) => ({ ...prev, categoria: autoCategory }));
    }
  }, [formData.sexo, formData.dataNascimento]);

  useEffect(() => {
    let isMounted = true;

    async function loadReturnReminder() {
      if (!effectiveHarasId) {
        if (isMounted) setReturnReminderDate('');
        return;
      }

      const reminderEvent = await eventsService.findHospedagemReturnReminder(effectiveHarasId, String(animal.id));
      if (!isMounted) return;
      setReturnReminderDate(reminderEvent?.start_date?.split('T')[0] || '');
    }

    loadReturnReminder().catch((error) => {
      console.error('Erro ao carregar lembrete de retorno da hospedagem:', error);
    });

    return () => {
      isMounted = false;
    };
  }, [animal.id, effectiveHarasId]);

  // Carregar garanhões e éguas do mesmo haras para seleção de genealogia
  useEffect(() => {
    let isMounted = true;

    async function loadParents() {
      const effectiveHarasId = animal.haras_id || stableHarasId || null;

      if (!effectiveHarasId) return;

      const { animalsService } = await import('@/services/animals');
      const [stallionsData, maresData] = await Promise.all([
        animalsService.getStallions(effectiveHarasId, { includeInactive: true, includeAllCategories: true }),
        animalsService.getMares(effectiveHarasId, { includeInactive: true, includeAllCategories: true }),
      ]);

      if (!isMounted) return;

      // Evitar auto-referência (animal não pode ser pai/mãe dele mesmo)
      const currentId = String(animal.id);
      setStallions(
        stallionsData.filter((item) => String(item.id) !== currentId)
          .filter((item) => isAdultByAgeOrCategory({ birth_date: (item as any).birth_date, category: (item as any).category }))
      );
      setMares(
        maresData.filter((item) => String(item.id) !== currentId)
          .filter((item) => isAdultByAgeOrCategory({ birth_date: (item as any).birth_date, category: (item as any).category }))
      );
    }

    loadParents();
    return () => { isMounted = false; };
  }, [animal.id, animal.haras_id]);

  // Preencher nomes de pai/mãe quando vierem apenas IDs
  useEffect(() => {
    setFormData((prev) => {
      let next = prev;

      if (prev.pai_id && prev.pai_id !== 'external' && !prev.pai) {
        const selectedFather = stallions.find((item) => item.id === prev.pai_id);
        if (selectedFather) {
          next = { ...next, pai: selectedFather.name };
        }
      }

      if (prev.mae_id && prev.mae_id !== 'external' && !prev.mae) {
        const selectedMother = mares.find((item) => item.id === prev.mae_id);
        if (selectedMother) {
          next = { ...next, mae: selectedMother.name };
        }
      }

      return next;
    });
  }, [stallions, mares]);

  // Estado para mídia existente e nova
  const [existingMedia, setExistingMedia] = useState<MediaItem[]>([]);
  const [newMedia, setNewMedia] = useState<{ file: File; caption: string; type: 'image' | 'video' }[]>([]);
  const [selectedCoverId, setSelectedCoverId] = useState<string>('');

  // Estado para documentos existentes e novos
  const [existingDocuments, setExistingDocuments] = useState<DocumentItem[]>([]);
  const [newDocuments, setNewDocuments] = useState<File[]>([]);

  const getMediaToken = (file: File) => `${file.name}-${file.size}-${file.lastModified}`;

  // Initialize media and documents from animal prop when component mounts or animal changes
  useEffect(() => {
    console.log('Inicializando mídia e documentos do animal:', animal.id);
    console.log('Animal prop:', animal);
    console.log('Animal images:', animal.images);
    console.log('Animal documents:', animal.documents);

    // Handle images - check both 'images' and legacy 'image' properties
    const animalImages = (animal.images || (animal.image ? [animal.image] : []))
      .filter((url) => !!url && url !== DEFAULT_PLACEHOLDER);
    console.log('Animal images processadas:', animalImages);

    if (animalImages && animalImages.length > 0) {
      const mediaItems = animalImages.map((img, index) => ({
        id: `existing-${index}`,
        url: img,
        caption: animal.imageCaptions?.[index] || '',
        type: 'image' as const,
        isExisting: true,
      }));
      console.log('Mídia existente inicializada:', mediaItems.length, 'itens');
      setExistingMedia(mediaItems);
      const preferredCover = animal.main_image_url && animal.main_image_url !== DEFAULT_PLACEHOLDER
        ? mediaItems.find((item) => item.url === animal.main_image_url)
        : mediaItems[0];
      setSelectedCoverId(preferredCover?.id || '');
    } else {
      console.log('Nenhuma mídia existente');
      setExistingMedia([]);
      setSelectedCoverId('');
    }

    // Handle documents
    const animalDocs = animal.documents || [];
    console.log('Animal documents processados:', animalDocs);

    if (animalDocs && animalDocs.length > 0) {
      const docItems = animalDocs.map((url, index) => {
        const fileName = url.split('/').pop() || `documento-${index + 1}`;
        return {
          id: `existing-doc-${index}`,
          name: fileName,
          url: url,
          isExisting: true,
        };
      });
      console.log('Documentos existentes inicializados:', docItems.length, 'itens');
      setExistingDocuments(docItems);
    } else {
      console.log('Nenhum documento existente');
      setExistingDocuments([]);
    }

    // Reset new media and documents when animal changes
    setNewMedia([]);
    setNewDocuments([]);
  }, [animal.id, animal.images, animal.documents, animal.main_image_url]); // Re-run when animal data changes

  const handleNewMediaSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleNewMediaSelect chamado', event.target.files);
    if (event.target.files && event.target.files.length > 0) {
      const filesArray = Array.from(event.target.files);
      console.log('Arquivos selecionados:', filesArray.map(f => f.name));
      const newMediaItems = filesArray.map(file => ({
        file,
        caption: '',
        type: file.type.startsWith('video/') ? 'video' as const : 'image' as const
      }));
      setNewMedia(prev => {
        const updated = [...prev, ...newMediaItems];
        console.log('newMedia atualizado:', updated.length, 'itens');
        return updated;
      });
      if (!selectedCoverId) {
        const firstImage = newMediaItems.find((item) => item.type === 'image');
        if (firstImage) setSelectedCoverId(`new-${getMediaToken(firstImage.file)}`);
      }
      // Reset input value to allow selecting the same file again
      event.target.value = '';
    }
  };

  const handleNewDocumentSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleNewDocumentSelect chamado', event.target.files);
    if (event.target.files && event.target.files.length > 0) {
      const filesArray = Array.from(event.target.files);
      console.log('Documentos selecionados:', filesArray.map(f => f.name));
      setNewDocuments(prev => {
        const updated = [...prev, ...filesArray];
        console.log('newDocuments atualizado:', updated.length, 'itens');
        return updated;
      });
      // Reset input value to allow selecting the same file again
      event.target.value = '';
    }
  };

  const removeExistingMedia = (id: string) => {
    const updated = existingMedia.filter(item => item.id !== id);
    setExistingMedia(updated);
    if (selectedCoverId === id) {
      const nextExisting = updated.find((item) => item.type === 'image');
      if (nextExisting) {
        setSelectedCoverId(nextExisting.id);
        return;
      }
      const nextNew = newMedia.find((item) => item.type === 'image');
      setSelectedCoverId(nextNew ? `new-${getMediaToken(nextNew.file)}` : '');
    }
  };

  const removeNewMedia = (index: number) => {
    const removed = newMedia[index];
    const updated = newMedia.filter((_, i) => i !== index);
    setNewMedia(updated);
    if (removed && selectedCoverId === `new-${getMediaToken(removed.file)}`) {
      const nextExisting = existingMedia.find((item) => item.type === 'image');
      if (nextExisting) {
        setSelectedCoverId(nextExisting.id);
        return;
      }
      const nextNew = updated.find((item) => item.type === 'image');
      setSelectedCoverId(nextNew ? `new-${getMediaToken(nextNew.file)}` : '');
    }
  };

  const updateExistingMediaCaption = (id: string, caption: string) => {
    setExistingMedia(existingMedia.map(item =>
      item.id === id ? { ...item, caption } : item
    ));
  };

  const updateNewMediaCaption = (index: number, caption: string) => {
    const updated = [...newMedia];
    updated[index].caption = caption;
    setNewMedia(updated);
  };

  const removeExistingDocument = (id: string) => {
    setExistingDocuments(existingDocuments.filter(doc => doc.id !== id));
  };

  const removeNewDocument = (index: number) => {
    setNewDocuments(newDocuments.filter((_, i) => i !== index));
  };

  const uploadFiles = async (files: { file: File; caption: string; type: 'image' | 'video' }[], folder: string): Promise<string[]> => {
    const supabase = createClient();
    const uploadedUrls: string[] = [];

    console.log(`Iniciando upload de ${files.length} arquivo(s) para ${folder}`);

    for (const item of files) {
      try {
        const fileExt = item.file.name.split('.').pop();
        const fileName = `${animal.id}/${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

        console.log(`Uploadando arquivo: ${item.file.name} como ${fileName}`);

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('animals')
          .upload(fileName, item.file);

        if (uploadError) {
          console.error('Erro ao fazer upload:', uploadError);
          toast.error(`Erro ao enviar ${item.file.name}: ${uploadError.message}`);
          continue;
        }

        console.log('Upload bem-sucedido:', uploadData);

        const { data: { publicUrl } } = supabase.storage
          .from('animals')
          .getPublicUrl(fileName);

        console.log('URL pública gerada:', publicUrl);
        uploadedUrls.push(publicUrl);
        toast.success(`${item.file.name} enviado com sucesso!`);
      } catch (error) {
        console.error('Erro no upload de arquivo:', error);
        toast.error(`Erro ao enviar arquivo`);
      }
    }

    console.log(`Upload finalizado. ${uploadedUrls.length} arquivo(s) enviado(s)`);
    return uploadedUrls;
  };

  const handleSave = async () => {
    try {
      if (isServiceLocation && !normalizedServiceType) {
        toast.error('Selecione o tipo de serviço.');
        return;
      }

      if (isHospedagemSelection && !returnReminderDate) {
        toast.error('Informe a data prevista de retorno da hospedagem.');
        return;
      }

      setIsLoading(true);
      const supabase = createClient();

      // Upload new media files if any
      const existingImageUrls = existingMedia.filter((item) => item.type === 'image').map(item => item.url);
      const newImageMedia = newMedia.filter((item) => item.type === 'image');
      const newVideoMedia = newMedia.filter((item) => item.type === 'video');
      let allMediaUrls = [...existingImageUrls];
      let uploadedMediaCount = 0;

      if (newImageMedia.length > 0) {
        toast.info('Fazendo upload das fotos/vídeos...');
        const uploadedMediaUrls = await uploadFiles(newImageMedia, 'media');
        allMediaUrls = [...allMediaUrls, ...uploadedMediaUrls];
        uploadedMediaCount = uploadedMediaUrls.length;
        console.log(`Upload de mídia concluído: ${uploadedMediaCount} arquivo(s) enviado(s)`);
      }

      if (newVideoMedia.length > 0) {
        const uploadedVideoUrls = await uploadFiles(newVideoMedia, 'videos');
        if (uploadedVideoUrls.length > 0) {
          const videoPayload = uploadedVideoUrls.map((url, index) => ({
            animal_id: animal.id,
            haras_id: animal.haras_id || stableHarasId,
            title: newVideoMedia[index]?.caption || newVideoMedia[index]?.file.name || `Vídeo ${index + 1}`,
            url,
            type: 'Upload',
            visibility: 'Privado',
            source: 'upload',
            caption: newVideoMedia[index]?.caption || null,
          }));
          const { error: videoInsertError } = await (supabase as any).from('animal_videos').insert(videoPayload);
          if (videoInsertError) {
            console.error('Erro ao registrar vídeos:', videoInsertError);
            toast.warning('Vídeos enviados, mas houve falha no registro.');
          }
        }
      }

      // Upload new documents if any
      let allDocumentUrls = existingDocuments.map(doc => doc.url);
      let uploadedDocCount = 0;

      if (newDocuments.length > 0) {
        toast.info('Fazendo upload dos documentos...');
        const documentMedia = newDocuments.map(file => ({
          file,
          caption: file.name,
          type: 'image' as const
        }));
        const uploadedDocUrls = await uploadFiles(documentMedia, 'documents');
        allDocumentUrls = [...allDocumentUrls, ...uploadedDocUrls];
        uploadedDocCount = uploadedDocUrls.length;
        console.log(`Upload de documentos concluído: ${uploadedDocCount} arquivo(s) enviado(s)`);
      }

      console.log('URLs de mídia finais:', allMediaUrls);
      console.log('URLs de documentos finais:', allDocumentUrls);
      console.log('Total de mídias:', allMediaUrls.length);
      console.log('Total de documentos:', allDocumentUrls.length);

      // Prepare update data mapping form fields to database fields
      const selectedExistingCover = existingMedia.find((item) => item.id === selectedCoverId && item.type === 'image');
      const selectedNewCoverIndex = newImageMedia.findIndex((item) => `new-${getMediaToken(item.file)}` === selectedCoverId);
      const selectedNewCoverUrl = selectedNewCoverIndex >= 0
        ? allMediaUrls[existingImageUrls.length + selectedNewCoverIndex]
        : undefined;
      const mainImageUrl = selectedExistingCover?.url || selectedNewCoverUrl || allMediaUrls[0] || undefined;
      const locationName = unwrapLocationOptionLabel(formData.localizacao || '');
      const resolvedLocation = buildAnimalLocationLabel(
        formData.localizacaoTipo,
        locationName,
        isServiceLocation ? formData.servicoTipo : undefined
      );
      const resolvedServiceType = isServiceLocation && normalizedServiceType
        ? getServiceTypeLabel(normalizedServiceType)
        : undefined;
      let nextStatus = mapStatusToDb(formData.status) as 'ativo' | 'vendido' | 'morto' | 'emprestado' | 'em_servico';
      if (isHospedagemSelection) {
        nextStatus = 'em_servico';
      } else if (nextStatus === 'em_servico') {
        nextStatus = 'ativo';
      }

      const updateData = {
        id: animal.id,
        name: formData.nome,
        registry_number: formData.registro,
        chip_number: formData.chip,
        sex: formData.sexo as 'Macho' | 'Fêmea',
        category: mapCategoryToDb(resolveManagedCategory(formData.sexo, formData.dataNascimento, formData.categoria) || formData.categoria),
        birth_date: formData.dataNascimento,
        coat_color: formData.pelagem,
        gait: formData.andamento,
        status: nextStatus,
        management_status: formData.statusManejo || undefined,
        father_id: formData.pai_id && formData.pai_id !== 'external' ? formData.pai_id : undefined,
        mother_id: formData.mae_id && formData.mae_id !== 'external' ? formData.mae_id : undefined,
        father_name: formData.pai || undefined,
        mother_name: formData.mae || undefined,
        location: resolvedLocation,
        service_type: resolvedServiceType,
        is_at_haras: isAtHaras,
        presence_manual_override: presenceManualOverride,
        origin_haras: formData.origemHaras,
        weight: formData.peso ? Number(formData.peso) : undefined,
        height: formData.altura ? Number(formData.altura) : undefined,
        observations: formData.observacoes,
        // Media URLs (existing + newly uploaded)
        images: allMediaUrls,
        main_image_url: mainImageUrl,
        documents: allDocumentUrls,
      };

      console.log('Dados a serem salvos:', updateData);
      console.log('Images:', updateData.images);
      console.log('Documents:', updateData.documents);

      // Validate that we have data to save
      if (!updateData.id) {
        throw new Error('ID do animal não encontrado');
      }

      // Call the mutation to update the animal
      const result = await updateAnimalMutation.mutateAsync(updateData);
      console.log('Resultado da atualização:', result);

      if (effectiveHarasId) {
        if (isHospedagemSelection && returnReminderDate) {
          await eventsService.syncHospedagemReturnReminder({
            harasId: effectiveHarasId,
            animalId: String(animal.id),
            animalName: formData.nome,
            returnDate: returnReminderDate,
            location: resolvedLocation,
            observations: formData.observacoes || null,
          });
        } else {
          await eventsService.deleteHospedagemReturnReminder(effectiveHarasId, String(animal.id));
        }
      }

      // Show success message with details
      const successMsg = uploadedMediaCount > 0 || uploadedDocCount > 0
        ? `Animal atualizado com sucesso! (${uploadedMediaCount} foto(s), ${uploadedDocCount} documento(s) adicionados)`
        : 'Animal atualizado com sucesso!';
      toast.success(successMsg);

      // Call onSave callback and navigate back
      onSave();
      onBack();
    } catch (error) {
      console.error('Erro ao atualizar animal:', error);
      toast.error('Erro ao atualizar animal. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to map category from form values to database values
  // Database values: 'Potro', 'Potranca', 'Garanhão', 'Égua', 'Castrado'
  const mapCategoryToDb = (category: string): string => {
    const mapping: Record<string, string> = {
      'Égua': 'Égua',
      'Garanhão': 'Garanhão',
      'Potro': 'Potro',
      'Potra': 'Potranca',
      'Castrado': 'Castrado',
    };
    return mapping[category] || category;
  };

  // Helper function to map status from form to database
  const mapStatusToDb = (status: string): string => {
    const mapping: Record<string, string> = {
      'Ativo': 'ativo',
      'Em serviço': 'em_servico',
      'Provisório': 'provisorio',
      'Vendido': 'vendido',
      'Falecido': 'morto',
      'Transferido': 'emprestado',
      'Inativo': 'morto',
    };
    return mapping[status] || normalizeAnimalStatus(status) || status.toLowerCase();
  };

  const lockedFieldClasses = isOfficialDataLocked
    ? 'disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-zinc-200/60 dark:disabled:bg-zinc-800/60'
    : '';

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
            <span
              className="text-muted-foreground dark:text-[#99a1af] cursor-pointer hover:text-foreground dark:hover:text-white"
              onClick={onBack}
            >
              Detalhes do Animal
            </span>
            <span className="text-muted-foreground dark:text-[#99a1af]">/</span>
            <span className="text-foreground dark:text-white">Editar Animal</span>
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
        <div>
          <h1 className="text-2xl text-foreground dark:text-white mb-2">Editar Animal</h1>
          <p className="text-muted-foreground dark:text-[#99a1af]">Atualize as informações do animal</p>
        </div>
      </div>

      {/* Formulário */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
        <div className="space-y-8">
          {isOfficialDataLocked && (
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-3 py-2">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-zinc-500 dark:text-zinc-400 flex-shrink-0" />
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-snug">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-200">Dados Oficiais:</span> Importados da ABCCMM. Apenas manejo e localização são editáveis.
                </p>
              </div>
            </div>
          )}

          {/* Informações Básicas */}
          <div>
            <h3 className="text-lg text-foreground dark:text-white mb-4">Informações Básicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">Nome do Animal *</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  disabled={isOfficialDataLocked}
                  className={`w-full h-10 px-4 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white ${lockedFieldClasses}`}
                  placeholder="Ex: Relâmpago"
                />
              </div>

              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">Registro ABCCMM *</label>
                <input
                  type="text"
                  value={formData.registro}
                  onChange={(e) => setFormData({ ...formData, registro: e.target.value })}
                  disabled={isOfficialDataLocked}
                  className={`w-full h-10 px-4 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white ${lockedFieldClasses}`}
                  placeholder="Ex: MM-2022-4321"
                />
              </div>

              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">Chip</label>
                <input
                  type="text"
                  value={formData.chip}
                  onChange={(e) => setFormData({ ...formData, chip: e.target.value })}
                  disabled={isOfficialDataLocked}
                  className={`w-full h-10 px-4 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white ${lockedFieldClasses}`}
                  placeholder="Ex: 1234567890"
                />
              </div>

              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">Categoria *</label>
                <NativeSelect
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  disabled={isOfficialDataLocked}
                  className={`w-full ${lockedFieldClasses}`}
                >
                  <option value="">Selecione...</option>
                  <option value="egua">Égua</option>
                  <option value="garanhao">Garanhão</option>
                  <option value="potro">Potro</option>
                  <option value="potra">Potra</option>
                  <option value="castrado">Castrado</option>
                </NativeSelect>
              </div>

              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">Sexo *</label>
                <NativeSelect
                  value={formData.sexo}
                  onChange={(e) => setFormData({ ...formData, sexo: e.target.value })}
                  disabled={isOfficialDataLocked}
                  className={`w-full ${lockedFieldClasses}`}
                >
                  <option value="Macho">Macho</option>
                  <option value="Fêmea">Fêmea</option>
                </NativeSelect>
              </div>

              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">Data de Nascimento *</label>
                <input
                  type="date"
                  value={formData.dataNascimento}
                  onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                  disabled={isOfficialDataLocked}
                  className={`w-full h-10 px-4 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white ${lockedFieldClasses}`}
                />
              </div>

              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">Haras de Origem</label>
                <input
                  type="text"
                  value={formData.origemHaras}
                  onChange={(e) => setFormData({ ...formData, origemHaras: e.target.value })}
                  className="w-full h-10 px-4 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                  placeholder="Nome do haras de origem"
                />
              </div>
            </div>
          </div>

          {/* Características Físicas */}
          <div>
            <h3 className="text-lg text-foreground dark:text-white mb-4">Características Físicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">Pelagem</label>
                <NativeSelect
                  value={formData.pelagem}
                  onChange={(e) => setFormData({ ...formData, pelagem: e.target.value })}
                  disabled={isOfficialDataLocked}
                  className={`w-full ${lockedFieldClasses}`}
                >
                  <option value="">Selecione...</option>
                  <option value="Alazã">Alazã</option>
                  <option value="Baia">Baia</option>
                  <option value="Castanha">Castanha</option>
                  <option value="Pampa">Pampa</option>
                  <option value="Tordilha">Tordilha</option>
                  <option value="Outra">Outra</option>
                </NativeSelect>
              </div>

              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">Andamento</label>
                <NativeSelect
                  value={formData.andamento}
                  onChange={(e) => setFormData({ ...formData, andamento: e.target.value })}
                  className="w-full"
                >
                  <option value="Marchado">Marchado</option>
                  <option value="Trotado">Trotado</option>
                  <option value="Picado">Picado</option>
                </NativeSelect>
              </div>

              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">Peso (kg)</label>
                <input
                  type="number"
                  value={formData.peso}
                  onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
                  className="w-full h-10 px-4 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                  placeholder="Ex: 450"
                />
              </div>

              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">Altura (m)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.altura}
                  onChange={(e) => setFormData({ ...formData, altura: e.target.value })}
                  className="w-full h-10 px-4 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                  placeholder="Ex: 1.55"
                />
              </div>
            </div>
          </div>

          {/* Genealogia */}
          <div>
            <h3 className="text-lg text-foreground dark:text-white mb-4">Genealogia</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pai */}
              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">Pai</label>
                <input
                  type="text"
                  value={fatherSearch}
                  onChange={(e) => setFatherSearch(e.target.value)}
                  placeholder="Buscar pai por nome"
                  className="w-full h-10 px-4 mb-2 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#3a3a3a] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                />
                <div className="flex gap-2">
                  <NativeSelect
                    value={formData.pai_id || ''}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const selectedAnimal = stallions.find(a => a.id === selectedId);
                      if (!selectedId) {
                        setFormData({
                          ...formData,
                          pai_id: '',
                          pai: ''
                        });
                        return;
                      }

                      if (selectedId === 'external') {
                        setFormData({
                          ...formData,
                          pai_id: 'external',
                          pai: formData.pai || ''
                        });
                        return;
                      }

                      setFormData({
                        ...formData,
                        pai_id: selectedId,
                        pai: selectedAnimal ? selectedAnimal.name : ''
                      });
                    }}
                    className="flex-1"
                  >
                    <option value="">Selecione ou deixe em branco</option>
                    {formData.pai_id && formData.pai_id !== 'external' && !stallions.some((item) => item.id === formData.pai_id) && (
                      <option value={formData.pai_id}>
                        {formData.pai ? `Atual: ${formData.pai}` : 'Pai atual (fora da lista)'}
                      </option>
                    )}
                    {stallions
                      .filter((stallion) => stallion.name.toLowerCase().includes(fatherSearch.trim().toLowerCase()))
                      .map((stallion) => (
                      <option key={stallion.id} value={stallion.id}>
                        {stallion.name} {stallion.registry_number ? `(${stallion.registry_number})` : ''}
                      </option>
                    ))}
                    <option value="external">Outro (Externo/Não cadastrado)</option>
                  </NativeSelect>
                </div>
                {formData.pai_id === 'external' && (
                  <input
                    type="text"
                    placeholder="Nome do pai"
                    value={formData.pai}
                    onChange={(e) => setFormData({ ...formData, pai: e.target.value })}
                    className="w-full h-10 px-4 mt-2 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#3a3a3a] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                  />
                )}
              </div>

              {/* Mãe */}
              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">Mãe</label>
                <input
                  type="text"
                  value={motherSearch}
                  onChange={(e) => setMotherSearch(e.target.value)}
                  placeholder="Buscar mãe por nome"
                  className="w-full h-10 px-4 mb-2 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#3a3a3a] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                />
                <div className="flex gap-2">
                  <NativeSelect
                    value={formData.mae_id || ''}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const selectedAnimal = mares.find(a => a.id === selectedId);
                      if (!selectedId) {
                        setFormData({
                          ...formData,
                          mae_id: '',
                          mae: ''
                        });
                        return;
                      }

                      if (selectedId === 'external') {
                        setFormData({
                          ...formData,
                          mae_id: 'external',
                          mae: formData.mae || ''
                        });
                        return;
                      }

                      setFormData({
                        ...formData,
                        mae_id: selectedId,
                        mae: selectedAnimal ? selectedAnimal.name : ''
                      });
                    }}
                    className="flex-1"
                  >
                    <option value="">Selecione ou deixe em branco</option>
                    {formData.mae_id && formData.mae_id !== 'external' && !mares.some((item) => item.id === formData.mae_id) && (
                      <option value={formData.mae_id}>
                        {formData.mae ? `Atual: ${formData.mae}` : 'Mãe atual (fora da lista)'}
                      </option>
                    )}
                    {mares
                      .filter((mare) => mare.name.toLowerCase().includes(motherSearch.trim().toLowerCase()))
                      .map((mare) => (
                      <option key={mare.id} value={mare.id}>
                        {mare.name} {mare.registry_number ? `(${mare.registry_number})` : ''}
                      </option>
                    ))}
                    <option value="external">Outro (Externo/Não cadastrado)</option>
                  </NativeSelect>
                </div>
                {formData.mae_id === 'external' && (
                  <input
                    type="text"
                    placeholder="Nome da mãe"
                    value={formData.mae}
                    onChange={(e) => setFormData({ ...formData, mae: e.target.value })}
                    className="w-full h-10 px-4 mt-2 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#3a3a3a] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-lg text-foreground dark:text-white mb-4">Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">Status do Animal</label>
                <NativeSelect
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as typeof formData.status })}
                  className="w-full"
                >
                  <option value="ativo">Ativo</option>
                  <option value="em_servico">Em serviço</option>
                  <option value="provisorio">Provisório</option>
                  <option value="vendido">Vendido</option>
                  <option value="morto">Falecido</option>
                  <option value="emprestado">Transferido</option>
                  <option value="morto">Inativo</option>
                </NativeSelect>
              </div>
            </div>
          </div>

          {/* Localização - Apenas se Status = Ativo */}
          {normalizeAnimalStatus(formData.status) !== 'vendido' && normalizeAnimalStatus(formData.status) !== 'morto' && (
            <div>
              <h3 className="text-lg text-foreground dark:text-white mb-4">Localização Atual</h3>

              <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 rounded-xl border border-border dark:border-[rgba(255,255,255,0.1)] bg-muted/40 dark:bg-[#0d0d0d]">
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                      isAtHaras
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                        : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                    }`}
                  >
                    {isAtHaras ? <Home className="w-4 h-4" /> : <PlaneTakeoff className="w-4 h-4" />}
                    {isAtHaras ? 'No Haras' : 'Fora do Haras'}
                  </span>
                  <span className="text-xs text-muted-foreground dark:text-[#99a1af]">
                    Atualiza automaticamente ao trocar a localização. Você pode ajustar manualmente.
                  </span>
                </div>
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isAtHaras}
                    onChange={(e) => {
                      setIsAtHaras(e.target.checked);
                      setPresenceManualOverride(true);
                    }}
                    className="w-4 h-4 rounded border-gray-300 dark:border-[rgba(255,255,255,0.2)]"
                  />
                  <span className="text-sm text-foreground dark:text-white">Presente no Haras</span>
                </label>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-foreground dark:text-white mb-2">Onde está o animal? *</label>
                    <NativeSelect
                      value={formData.localizacaoTipo}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          localizacaoTipo: e.target.value as 'Baia' | 'Pasto' | 'Servico',
                          servicoTipo: e.target.value === 'Servico' ? formData.servicoTipo : '',
                        })
                      }
                      className="w-full"
                    >
                      <option value="Baia">Baia</option>
                      <option value="Pasto">Pasto</option>
                      <option value="Servico">Serviço</option>
                    </NativeSelect>
                  </div>

                  <div>
                    <label className="block text-sm text-foreground dark:text-white mb-2">Localização *</label>
                    <NativeSelect
                      value={formData.localizacao}
                      onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                      className="w-full"
                    >
                      {locationOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </NativeSelect>
                  </div>

                  <div>
                    <label className="block text-sm text-foreground dark:text-white mb-2">Status de Manejo</label>
                    <input
                      type="text"
                      list="status-suggestions-edit"
                      value={formData.statusManejo}
                      onChange={(e) => setFormData({ ...formData, statusManejo: e.target.value })}
                      placeholder="Descreva o status"
                      className="w-full h-10 px-4 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                    />
                    <datalist id="status-suggestions-edit">
                      <option value="Treinamento para pista" />
                      <option value="Baia para tratamento" />
                      <option value="Trato em baia" />
                      <option value="Pasto" />
                      <option value="Serviço" />
                      <option value="Reprodução" />
                      <option value="Repouso" />
                      <option value="Em observação" />
                    </datalist>
                  </div>

                  {isServiceLocation && (
                  <div>
                    <label className="block text-sm text-foreground dark:text-white mb-2">Tipo de Serviço</label>
                    <NativeSelect
                      value={formData.servicoTipo}
                      onChange={(e) => setFormData({ ...formData, servicoTipo: (e.target.value || '') as typeof formData.servicoTipo })}
                      className="w-full"
                    >
                      <option value="">Selecione</option>
                      {SERVICE_TYPE_OPTIONS.map((option) => (
                        <option key={option} value={option}>{getServiceTypeLabel(option)}</option>
                      ))}
                    </NativeSelect>
                  </div>
                  )}

                  {isHospedagemSelection && (
                    <div>
                      <label className="block text-sm text-foreground dark:text-white mb-2">Data prevista de retorno *</label>
                      <input
                        type="date"
                        value={returnReminderDate}
                        onChange={(e) => setReturnReminderDate(e.target.value)}
                        className="w-full h-10 px-4 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                      />
                    </div>
                  )}
                </div>

                {/* Informação da última alteração */}
                <div className="p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg border border-border dark:border-[rgba(255,255,255,0.1)]">
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                    <span className="text-foreground dark:text-white">Última alteração de localização:</span> {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Propriedade / Condomínio — seção independente da localização */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div>
                <h3 className="text-lg text-foreground dark:text-white mb-1">Propriedade / Condomínio</h3>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                  Cotistas, percentuais e — em sociedade — prazos e localização física.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowOwnershipModal(true)}
                className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity"
              >
                <Users className="w-4 h-4" />
                Gerenciar propriedade
              </button>
            </div>

            {currentShares.length > 0 ? (
              <div className="space-y-2">
                {currentShares.map((share) => (
                  <div
                    key={share.id}
                    className="flex items-center justify-between p-3 bg-muted dark:bg-[#0d0d0d] rounded-lg border border-border dark:border-[rgba(255,255,255,0.1)]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-foreground dark:text-white">{share.owner_name}</span>
                      {share.is_primary && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                          Principal
                        </span>
                      )}
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary dark:bg-white/10 dark:text-white">
                      {share.percentage}%
                    </span>
                  </div>
                ))}

                {currentShares.length >= 2 && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    {(() => {
                      const ref = currentShares.find((s) => s.termination_type) || currentShares[0];
                      if (!ref) return null;
                      return (
                        <>
                          <div className="p-3 rounded-lg bg-muted dark:bg-[#0d0d0d]">
                            <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Localização física</p>
                            <p className="text-foreground dark:text-white">{ref.physical_location || 'Não informada'}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-muted dark:bg-[#0d0d0d]">
                            <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Critério de término</p>
                            <p className="text-foreground dark:text-white">
                              {ref.termination_type === 'date'
                                ? `Até ${(ref.termination_date || '').split('-').reverse().join('/') || '-'}`
                                : ref.termination_type === 'age'
                                  ? `Até os ${ref.termination_age_years} anos`
                                  : 'Sem prazo definido'}
                            </p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-muted dark:bg-[#0d0d0d] text-sm text-muted-foreground dark:text-[#99a1af]">
                Nenhum cotista cadastrado. Clique em &quot;Gerenciar propriedade&quot; para definir.
              </div>
            )}
          </div>

          {/* Observações */}
          <div>
            <h3 className="text-lg text-foreground dark:text-white mb-4">Observações</h3>
            <textarea
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              className="w-full h-32 px-4 py-3 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white resize-none"
              placeholder="Adicione observações sobre o animal..."
            />
          </div>

          {/* Fotos e Vídeos */}
          <div>
            <h3 className="text-lg text-foreground dark:text-white mb-4">Fotos e Vídeos</h3>

            {/* Mídia Existente */}
            {existingMedia.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-3">Mídia existente ({existingMedia.length})</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {existingMedia.map((item) => (
                    <div key={item.id} className="space-y-2">
                      <div className="relative group">
                        <div className="aspect-square rounded-xl overflow-hidden bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)]">
                          {item.type === 'image' ? (
                            <img
                              src={item.url}
                              alt="Animal"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <video
                              src={item.url}
                              className="w-full h-full object-cover"
                              controls
                            />
                          )}
                        </div>
                        {item.type === 'image' && (
                          <button
                            type="button"
                            onClick={() => setSelectedCoverId(item.id)}
                            className={`absolute bottom-2 left-2 px-2 py-1 text-xs rounded-md ${selectedCoverId === item.id ? 'bg-primary text-white' : 'bg-black/70 text-white'}`}
                          >
                            {selectedCoverId === item.id ? 'Foto de capa' : 'Definir capa'}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeExistingMedia(item.id)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Adicionar legenda..."
                          value={item.caption}
                          onChange={(e) => updateExistingMediaCaption(item.id, e.target.value)}
                          className="w-full h-10 px-3 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-xl text-sm text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Adicionar Nova Mídia */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Adicionar novas fotos e vídeos
                  </div>
                </label>
                <div
                  className="border-2 border-dashed border-border dark:border-[#616161] rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary dark:hover:border-white/50 transition-colors"
                  onClick={() => document.getElementById('edit-media-input')?.click()}
                >
                  <div className="w-16 h-16 bg-muted dark:bg-[#0d0d0d] rounded-lg flex items-center justify-center mb-3">
                    <Camera className="w-8 h-8 text-muted-foreground dark:text-[#616161]" />
                  </div>
                  <p className="text-sm text-muted-foreground dark:text-[#6b6b6b]">Clique para adicionar fotos e vídeos</p>
                  <input
                    id="edit-media-input"
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleNewMediaSelect}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Nova Mídia Selecionada */}
              {newMedia.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-3">Nova mídia ({newMedia.length})</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {newMedia.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="relative group">
                          <div className="aspect-square rounded-xl overflow-hidden bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)]">
                            {item.type === 'image' ? (
                              <img
                                src={URL.createObjectURL(item.file)}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <video
                                src={URL.createObjectURL(item.file)}
                                className="w-full h-full object-cover"
                                controls
                              />
                            )}
                          </div>
                          {item.type === 'image' && (
                            <button
                              type="button"
                              onClick={() => setSelectedCoverId(`new-${getMediaToken(item.file)}`)}
                              className={`absolute bottom-2 left-2 px-2 py-1 text-xs rounded-md ${selectedCoverId === `new-${getMediaToken(item.file)}` ? 'bg-primary text-white' : 'bg-black/70 text-white'}`}
                            >
                              {selectedCoverId === `new-${getMediaToken(item.file)}` ? 'Foto de capa' : 'Definir capa'}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeNewMedia(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Adicionar legenda..."
                            value={item.caption}
                            onChange={(e) => updateNewMediaCaption(index, e.target.value)}
                            className="w-full h-10 px-3 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-xl text-sm text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Documentos */}
          <div>
            <h3 className="text-lg text-foreground dark:text-white mb-4">Documentos</h3>

            {/* Documentos Existentes */}
            {existingDocuments.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-3">Documentos existentes ({existingDocuments.length})</p>
                <div className="space-y-2">
                  {existingDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 bg-muted dark:bg-[#0d0d0d] rounded-lg border border-border dark:border-[rgba(255,255,255,0.1)]"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
                        <span className="text-sm text-foreground dark:text-white">{doc.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExistingDocument(doc.id)}
                        className="text-muted-foreground dark:text-[#99a1af] hover:text-red-500 dark:hover:text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Adicionar Novos Documentos */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Adicionar novos documentos
                  </div>
                </label>
                <div
                  className="border-2 border-dashed border-border dark:border-[#616161] rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary dark:hover:border-white/50 transition-colors"
                  onClick={() => document.getElementById('edit-document-input')?.click()}
                >
                  <Upload className="w-12 h-12 text-muted-foreground dark:text-[#616161] mb-3" />
                  <p className="text-foreground dark:text-white mb-1">Arraste e solte o arquivo aqui</p>
                  <p className="text-sm text-muted-foreground dark:text-[#6b6b6b]">ou clique para selecionar o arquivo</p>
                  <input
                    id="edit-document-input"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx"
                    onChange={handleNewDocumentSelect}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Novos Documentos Selecionados */}
              {newDocuments.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-3">Novos documentos ({newDocuments.length})</p>
                  <div className="space-y-2">
                    {newDocuments.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted dark:bg-[#0d0d0d] rounded-lg border border-green-500/50 dark:border-green-500/30"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-green-500" />
                          <span className="text-sm text-foreground dark:text-white">{doc.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeNewDocument(index)}
                          className="text-muted-foreground dark:text-[#99a1af] hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col lg:flex-row gap-4 pt-4">
            <button
              onClick={onBack}
              disabled={updateAnimalMutation.isPending}
              className="flex-1 px-6 py-3 bg-transparent border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={updateAnimalMutation.isPending}
              className="flex-1 px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {updateAnimalMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </button>
          </div>
        </div>
      </div>

      {showOwnershipModal && (
        <OwnershipSharesModal
          initialShares={currentShares}
          defaultOwnerName={animal.proprietario || undefined}
          animalBirthDate={animalBirthDateIso}
          partnerLocationOptions={locationSettings.partner_locations}
          onClose={() => setShowOwnershipModal(false)}
          onSave={async (shares: OwnershipShareDraft[]) => {
            const harasId = animal.haras_id || stableHarasId;
            if (!harasId) {
              toast.error('Haras não identificado para atualizar a propriedade.');
              throw new Error('Haras não identificado');
            }
            try {
              await saveOwnershipShares({ animalId: String(animal.id), harasId, shares });
              toast.success('Propriedade atualizada com sucesso!');
              // Recarrega animal para refletir cotas atualizadas
              const { animalsService } = await import('@/services/animals');
              const fullAnimal = await animalsService.getById(String(animal.id));
              if (fullAnimal) setHydratedAnimal(fullAnimal as unknown as Animal);
            } catch (error) {
              console.error('Erro ao atualizar cotas:', error);
              toast.error(error instanceof Error ? error.message : 'Erro ao atualizar propriedade.');
              throw error;
            }
          }}
          isSaving={isSavingOwnership}
        />
      )}
    </div>
  );
}
