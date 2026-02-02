import { ArrowLeft, Upload, X, Camera, FileText, Plus, Video, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { NativeSelect } from '../ui/native-select';
import { useUpdateAnimal } from '@/hooks/useAnimals';
import { createClient } from '@/lib/supabase/client';
import { supabase } from '@/services/base';

interface Animal {
  id: string;
  name: string;
  registry: string;
  registry_number?: string;
  chip?: string;
  chip_number?: string;
  marca?: string;
  brand?: string;
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
  const updateAnimalMutation = useUpdateAnimal();
  const [isLoading, setIsLoading] = useState(false);
  const [stallions, setStallions] = useState<{ id: string; name: string; registry_number?: string | null }[]>([]);
  const [mares, setMares] = useState<{ id: string; name: string; registry_number?: string | null }[]>([]);

  // Initialize form data with actual animal data from the database
  const [formData, setFormData] = useState({
    nome: animal.name || '',
    registro: animal.registry || animal.registry_number || '',
    chip: animal.chip || animal.chip_number || '',
    marca: animal.marca || animal.brand || '',
    categoria: animal.category || '',
    sexo: animal.sex || 'Macho',
    dataNascimento: animal.birthDate || animal.birth_date || '',
    pelagem: animal.coat_color || animal.pelagem || '',
    andamento: animal.gait || 'Marchado',
    pai_id: animal.father_id || (animal as any).pai_id || (animal.father_name ? 'external' : ''),
    pai: animal.father_name || animal.pai || '',
    mae_id: animal.mother_id || (animal as any).mae_id || (animal.mother_name ? 'external' : ''),
    mae: animal.mother_name || animal.mae || '',
    haras: animal.haras || '',
    status: animal.status || 'ativo',
    localizacao: animal.localizacao || animal.location || 'Baia',
    servicoTipo: animal.servicoTipo || animal.service_type || 'Reprodução',
    origemHaras: animal.origin_haras || animal.harasOrigem || '',
    observacoes: animal.observations || '',
    peso: animal.weight || '',
    altura: animal.height || '',
  });

  // Update form data when animal prop changes
  useEffect(() => {
    setFormData({
      nome: animal.name || '',
      registro: animal.registry || animal.registry_number || '',
      chip: animal.chip || animal.chip_number || '',
      marca: animal.marca || animal.brand || '',
      categoria: animal.category || '',
      sexo: animal.sex || 'Macho',
      dataNascimento: animal.birthDate || animal.birth_date || '',
      pelagem: animal.coat_color || animal.pelagem || '',
      andamento: animal.gait || 'Marchado',
      pai_id: animal.father_id || (animal as any).pai_id || (animal.father_name ? 'external' : ''),
      pai: animal.father_name || animal.pai || '',
      mae_id: animal.mother_id || (animal as any).mae_id || (animal.mother_name ? 'external' : ''),
      mae: animal.mother_name || animal.mae || '',
      haras: animal.haras || '',
      status: animal.status || 'ativo',
      localizacao: animal.localizacao || animal.location || 'Baia',
      servicoTipo: animal.servicoTipo || animal.service_type || 'Reprodução',
      origemHaras: animal.origin_haras || animal.harasOrigem || '',
      observacoes: animal.observations || '',
      peso: animal.weight || '',
      altura: animal.height || '',
    });
  }, [animal]);

  // Carregar garanhões e éguas do mesmo haras para seleção de genealogia
  useEffect(() => {
    let isMounted = true;

    async function loadParents() {
      let effectiveHarasId = animal.haras_id;

      if (!effectiveHarasId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('haras_id')
            .eq('id', user.id)
            .single();
          effectiveHarasId = profile?.haras_id || null;
        }
      }

      if (!effectiveHarasId) return;

      const { animalsService } = await import('@/services/animals');
      const [stallionsData, maresData] = await Promise.all([
        animalsService.getStallions(effectiveHarasId),
        animalsService.getMares(effectiveHarasId),
      ]);

      if (!isMounted) return;

      // Evitar auto-referência (animal não pode ser pai/mãe dele mesmo)
      const currentId = String(animal.id);
      setStallions(stallionsData.filter((item) => String(item.id) !== currentId));
      setMares(maresData.filter((item) => String(item.id) !== currentId));
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

  // Estado para documentos existentes e novos
  const [existingDocuments, setExistingDocuments] = useState<DocumentItem[]>([]);
  const [newDocuments, setNewDocuments] = useState<File[]>([]);

  // Initialize media and documents from animal prop when component mounts or animal changes
  useEffect(() => {
    console.log('Inicializando mídia e documentos do animal:', animal.id);
    console.log('Animal prop:', animal);
    console.log('Animal images:', animal.images);
    console.log('Animal documents:', animal.documents);

    // Handle images - check both 'images' and legacy 'image' properties
    const animalImages = animal.images || (animal.image ? [animal.image] : []);
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
    } else {
      console.log('Nenhuma mídia existente');
      setExistingMedia([]);
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
  }, [animal.id, animal.images, animal.documents]); // Re-run when animal data changes

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
    setExistingMedia(existingMedia.filter(item => item.id !== id));
  };

  const removeNewMedia = (index: number) => {
    setNewMedia(newMedia.filter((_, i) => i !== index));
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
      setIsLoading(true);

      // Upload new media files if any
      let allMediaUrls = existingMedia.map(item => item.url);
      let uploadedMediaCount = 0;

      if (newMedia.length > 0) {
        toast.info('Fazendo upload das fotos/vídeos...');
        const uploadedMediaUrls = await uploadFiles(newMedia, 'media');
        allMediaUrls = [...allMediaUrls, ...uploadedMediaUrls];
        uploadedMediaCount = uploadedMediaUrls.length;
        console.log(`Upload de mídia concluído: ${uploadedMediaCount} arquivo(s) enviado(s)`);
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
      const updateData = {
        id: animal.id,
        name: formData.nome,
        registry_number: formData.registro,
        chip_number: formData.chip,
        brand: formData.marca,
        sex: formData.sexo as 'Macho' | 'Fêmea',
        category: mapCategoryToDb(formData.categoria),
        birth_date: formData.dataNascimento,
        coat_color: formData.pelagem,
        gait: formData.andamento,
        status: mapStatusToDb(formData.status) as 'ativo' | 'vendido' | 'morto' | 'emprestado' | 'em_servico',
        father_id: formData.pai_id && formData.pai_id !== 'external' ? formData.pai_id : null,
        mother_id: formData.mae_id && formData.mae_id !== 'external' ? formData.mae_id : null,
        father_name: formData.pai || null,
        mother_name: formData.mae || null,
        location: formData.localizacao,
        service_type: formData.servicoTipo,
        origin_haras: formData.origemHaras,
        weight: formData.peso ? Number(formData.peso) : undefined,
        height: formData.altura ? Number(formData.altura) : undefined,
        observations: formData.observacoes,
        // Media URLs (existing + newly uploaded)
        images: allMediaUrls,
        main_image_url: allMediaUrls.length > 0 ? allMediaUrls[0] : undefined,
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
      'Vendido': 'vendido',
      'Falecido': 'morto',
      'Transferido': 'emprestado',
      'Inativo': 'morto',
    };
    return mapping[status] || status.toLowerCase();
  };

  // Função para determinar se deve mostrar sub-opções de serviço
  const mostrarSubOpcoesServico = formData.localizacao === 'Serviço';

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
                  className="w-full h-10 px-4 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                  placeholder="Ex: Relâmpago"
                />
              </div>

              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">Registro ABCCMM *</label>
                <input
                  type="text"
                  value={formData.registro}
                  onChange={(e) => setFormData({ ...formData, registro: e.target.value })}
                  className="w-full h-10 px-4 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                  placeholder="Ex: MM-2022-4321"
                />
              </div>

              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">Chip</label>
                <input
                  type="text"
                  value={formData.chip}
                  onChange={(e) => setFormData({ ...formData, chip: e.target.value })}
                  className="w-full h-10 px-4 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                  placeholder="Ex: 1234567890"
                />
              </div>

              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">Marca</label>
                <input
                  type="text"
                  value={formData.marca}
                  onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                  className="w-full h-10 px-4 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                  placeholder="Ex: Marca XYZ"
                />
              </div>

              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">Categoria *</label>
                <NativeSelect
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="w-full"
                >
                  <option value="">Selecione...</option>
                  <option value="egua">Égua</option>
                  <option value="garanhao">Garanhão</option>
                  <option value="potro">Potro</option>
                  <option value="potra">Potranca</option>
                  <option value="castrado">Castrado</option>
                </NativeSelect>
              </div>

              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">Sexo *</label>
                <NativeSelect
                  value={formData.sexo}
                  onChange={(e) => setFormData({ ...formData, sexo: e.target.value })}
                  className="w-full"
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
                  className="w-full h-10 px-4 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
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
                  className="w-full"
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
                    {stallions.map((stallion) => (
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
                    {mares.map((mare) => (
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
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full"
                >
                  <option value="ativo">Ativo</option>
                  <option value="vendido">Vendido</option>
                  <option value="morto">Falecido</option>
                  <option value="emprestado">Transferido</option>
                  <option value="morto">Inativo</option>
                </NativeSelect>
              </div>
            </div>
          </div>

          {/* Localização - Apenas se Status = Ativo */}
          {formData.status?.toLowerCase() === 'ativo' && (
            <div>
              <h3 className="text-lg text-foreground dark:text-white mb-4">Localização Atual</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-foreground dark:text-white mb-2">Onde está o animal? *</label>
                    <NativeSelect
                      value={formData.localizacao}
                      onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                      className="w-full"
                    >
                      <option value="Baia">Baia</option>
                      <option value="Pasto">Pasto</option>
                      <option value="Serviço">Serviço</option>
                    </NativeSelect>
                  </div>

                  {/* Sub-opções de Serviço */}
                  {mostrarSubOpcoesServico && (
                    <div>
                      <label className="block text-sm text-foreground dark:text-white mb-2">Tipo de Serviço *</label>
                      <NativeSelect
                        value={formData.servicoTipo}
                        onChange={(e) => setFormData({ ...formData, servicoTipo: e.target.value })}
                        className="w-full"
                      >
                        <option value="Reprodução">Reprodução</option>
                        <option value="Trabalho">Trabalho</option>
                        <option value="Repouso">Repouso</option>
                        <option value="Outro">Outro</option>
                      </NativeSelect>
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
    </div>
  );
}
