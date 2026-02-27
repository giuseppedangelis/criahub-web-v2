import { ArrowLeft, Upload, Camera, X, Video, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { NativeSelect } from '../ui/native-select';
import { useCreateAnimal, useUpdateAnimal } from '@/hooks/useAnimals';
import { useUser } from '@/contexts/UserContext';
import { useCurrentHaras } from '@/hooks/useHaras';
import { toast } from 'sonner';
import type { CreateAnimalInput, AnimalSex, AnimalCategory } from '@/types';
import { createClient } from '@/lib/supabase/client';

interface BreederCadastrarAnimalProps {
  onBack: () => void;
}

export function BreederCadastrarAnimal({ onBack }: BreederCadastrarAnimalProps) {
  // Tipos de Entrada
  type EntryType = 'nascimento' | 'avulso' | 'terceiro';
  const [entryType, setEntryType] = useState<EntryType>('nascimento');

  const [formData, setFormData] = useState<{
    nome: string;
    registro: string;
    chip: string;
    marca: string;
    dataNascimento: string;
    sexo: string;
    categoria: string;
    statusManejo: string;
    localizacao: string;
    servicoTipo: string;
    harasOrigem: string;
    pelagem: string;
    altura: string;
    peso: string;
    pai: string;
    pai_id: string;
    mae: string;
    mae_id: string;
    registroFuturoABCCMM: 'sim' | 'nao';
    observacoes: string;
  }>({
    nome: '',
    registro: '',
    chip: '',
    marca: '',
    dataNascimento: '',
    sexo: '',
    categoria: '',
    statusManejo: '',
    localizacao: 'Baia',
    servicoTipo: 'Reprodução',
    harasOrigem: '',
    pelagem: '',
    altura: '',
    peso: '',
    pai: '',
    pai_id: '',
    mae: '',
    mae_id: '',
    registroFuturoABCCMM: 'sim',
    observacoes: '',
  });

  const [stallions, setStallions] = useState<{ id: string; name: string; registry_number?: string | null }[]>([]);
  const [mares, setMares] = useState<{ id: string; name: string; registry_number?: string | null }[]>([]);
  const [userHarasName, setUserHarasName] = useState('');
  const { stableHarasId, user } = useUser();
  const { data: currentHaras } = useCurrentHaras();

  useEffect(() => {
    async function loadInitialData() {
      const harasId = stableHarasId;
      if (!harasId) return;

      const harasName = currentHaras?.name || '';
      setUserHarasName(harasName);

      // Se for nascimento, preencher haras de origem
      if (entryType === 'nascimento') {
        setFormData(prev => ({ ...prev, harasOrigem: harasName }));
      }

      import('@/services/animals').then(async ({ animalsService }) => {
        const [stallionsData, maresData] = await Promise.all([
          animalsService.getStallions(harasId, { includeInactive: true, includeAllCategories: true }),
          animalsService.getMares(harasId, { includeInactive: true, includeAllCategories: true })
        ]);
        setStallions(stallionsData);
        setMares(maresData);
      });
    }
    loadInitialData();
  }, [entryType, stableHarasId, currentHaras?.name]);

  // Atualizar campos ao trocar tipo de entrada
  useEffect(() => {
    if (entryType === 'nascimento') {
      setFormData(prev => ({
        ...prev,
        harasOrigem: userHarasName,
        statusManejo: 'Ao pé da mãe',
        localizacao: 'Pasto Maternidade'
      }));
    } else if (entryType === 'terceiro') {
      setFormData(prev => ({
        ...prev,
        harasOrigem: '',
        statusManejo: 'Em observação',
        servicoTipo: 'Hospedagem'
      }));
    } else {
      // Avulso (resetar defaults se necessário)
      setFormData(prev => ({
        ...prev,
        harasOrigem: '',
        statusManejo: '',
        servicoTipo: '',
      }));
    }
  }, [entryType, userHarasName]);

  const [selectedImages, setSelectedImages] = useState<{ file: File; caption: string; type: 'image' | 'video' }[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<File[]>([]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      const newImages = filesArray.map(file => ({
        file,
        caption: '',
        type: file.type.startsWith('video/') ? 'video' as const : 'image' as const
      }));
      setSelectedImages([...selectedImages, ...newImages]);
    }
  };

  const handleDocumentSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedDocuments([...selectedDocuments, ...filesArray]);
    }
  };

  const handleDocumentDrop = (event: React.DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      const filesArray = Array.from(event.dataTransfer.files);
      setSelectedDocuments([...selectedDocuments, ...filesArray]);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const removeDocument = (index: number) => {
    setSelectedDocuments(selectedDocuments.filter((_, i) => i !== index));
  };

  const createAnimalMutation = useCreateAnimal();
  const updateAnimalMutation = useUpdateAnimal();

  // Helpers para visibilidade de campos
  const isBirth = entryType === 'nascimento';
  const isThirdParty = entryType === 'terceiro';
  const isAvulso = entryType === 'avulso';

  const showPhysicalInfo = true;
  const showLocationInfo = true;
  const isBirthDateRequired = true;

  const uploadFiles = async (animalId: string, files: File[], folder: 'media' | 'documents') => {
    if (files.length === 0) return [];
    const client = createClient();
    const uploadedUrls: string[] = [];

    for (const file of files) {
      try {
        const fileExt = file.name.split('.').pop() || 'bin';
        const fileName = `${animalId}/${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await client.storage
          .from('animals')
          .upload(fileName, file);

        if (uploadError) {
          toast.error(`Erro ao enviar ${file.name}: ${uploadError.message}`);
          continue;
        }

        const { data: { publicUrl } } = client.storage
          .from('animals')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      } catch (error) {
        console.error('Erro no upload de arquivo:', error);
        toast.error(`Erro ao enviar ${file.name}`);
      }
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar Mãe para Nascimento
    if (isBirth && !formData.mae_id) {
      toast.error('O cadastro de nascimento exige a seleção de uma mãe cadastrada.');
      return;
    }

    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    if (!stableHarasId) {
      toast.error('Haras não vinculado ao usuário');
      return;
    }

    // Validar campos obrigatórios
    if (!formData.nome || (isBirthDateRequired && !formData.dataNascimento) || !formData.sexo) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    let statusFinal: 'ativo' | 'em_servico' | 'provisorio' = 'ativo';
    if (isThirdParty) statusFinal = 'em_servico';
    if (isBirth && formData.registroFuturoABCCMM === 'sim') statusFinal = 'provisorio';

    // Mapear campos para CreateAnimalInput
    const animalInput: CreateAnimalInput = {
      haras_id: stableHarasId,
      name: formData.nome,
      sex: formData.sexo as AnimalSex,
      birth_date: formData.dataNascimento || undefined,
      category: (formData.categoria as AnimalCategory) || 'potro',
      registry_number: isBirth ? undefined : (formData.registro || undefined),
      chip_number: isBirth ? undefined : (formData.chip || undefined),
      brand: formData.marca || undefined,
      coat_color: formData.pelagem || undefined,
      location: formData.localizacao || undefined,
      origin_haras: isThirdParty ? undefined : (formData.harasOrigem || undefined),
      proprietario: isThirdParty ? (formData.harasOrigem || undefined) : undefined,
      observations: formData.observacoes || undefined,
      status: statusFinal,
      weight: formData.peso ? parseFloat(formData.peso) : undefined,
      height: formData.altura ? parseFloat(formData.altura) : undefined,
      father_name: formData.pai || undefined,
      mother_name: formData.mae || undefined,
      father_id: formData.pai_id && formData.pai_id !== 'external' ? formData.pai_id : undefined,
      mother_id: formData.mae_id && formData.mae_id !== 'external' ? formData.mae_id : undefined,
      management_status: formData.statusManejo || undefined,
      service_type: formData.servicoTipo || undefined,
    };

    try {
      const createdAnimal = await createAnimalMutation.mutateAsync(animalInput);

      const hasMedia = selectedImages.length > 0;
      const hasDocs = selectedDocuments.length > 0;

      if (hasMedia || hasDocs) {
        let mediaUrls: string[] = [];
        let documentUrls: string[] = [];

        if (hasMedia) toast.info('Fazendo upload das fotos/vídeos...');
        const mediaFiles = selectedImages.map(item => item.file);
        if (mediaFiles.length > 0) {
          mediaUrls = await uploadFiles(createdAnimal.id, mediaFiles, 'media');
        }

        if (hasDocs) toast.info('Fazendo upload dos documentos...');
        if (selectedDocuments.length > 0) {
          documentUrls = await uploadFiles(createdAnimal.id, selectedDocuments, 'documents');
        }

        if (mediaUrls.length > 0 || documentUrls.length > 0) {
          try {
            await updateAnimalMutation.mutateAsync({
              id: createdAnimal.id,
              images: mediaUrls,
              main_image_url: mediaUrls[0],
              documents: documentUrls,
            });
          } catch (updateError) {
            console.error('Erro ao salvar mídias do animal:', updateError);
            toast.error('Animal criado, mas não foi possível salvar as mídias.');
          }
        }
      }

      toast.success('Animal cadastrado com sucesso!');
      onBack();
    } catch (error) {
      console.error('Erro ao cadastrar animal:', error);
      toast.error('Erro ao cadastrar animal. Tente novamente.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header com Breadcrumb e Botão Voltar */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
        <div className="flex items-center justify-between mb-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground dark:text-[#99a1af] cursor-pointer hover:text-foreground dark:hover:text-white" onClick={onBack}>
              Plantel
            </span>
            <span className="text-muted-foreground dark:text-[#99a1af]">/</span>
            <span className="text-foreground dark:text-white">Cadastrar Animal</span>
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
        <h1 className="text-2xl text-foreground dark:text-white">Cadastrar Animal</h1>
      </div>

      {/* Seleção de Tipo de Entrada */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
        <h2 className="text-xl text-foreground dark:text-white mb-6">Tipo de Cadastro</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => setEntryType('nascimento')}
            className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${entryType === 'nascimento'
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border dark:border-[#3a3a3a] text-muted-foreground hover:bg-muted dark:hover:bg-[#2a2a2a]'
              }`}
          >
            <span className="text-2xl">🐣</span>
            <span className="font-medium">Nascimento no Haras</span>
          </button>
          <button
            type="button"
            onClick={() => setEntryType('avulso')}
            className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${entryType === 'avulso'
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border dark:border-[#3a3a3a] text-muted-foreground hover:bg-muted dark:hover:bg-[#2a2a2a]'
              }`}
          >
            <span className="text-2xl">🚚</span>
            <span className="font-medium">Avulso</span>
          </button>
          <button
            type="button"
            onClick={() => setEntryType('terceiro')}
            className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${entryType === 'terceiro'
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border dark:border-[#3a3a3a] text-muted-foreground hover:bg-muted dark:hover:bg-[#2a2a2a]'
              }`}
          >
            <span className="text-2xl">🤝</span>
            <span className="font-medium">Terceiro</span>
          </button>
        </div>

        <div className="mt-4 p-4 bg-muted/50 dark:bg-[#111] rounded-lg text-sm text-muted-foreground">
          {entryType === 'nascimento' && 'Cadastro de animal nascido no haras. Haras de origem bloqueado no seu haras e fluxo preparado para registro ABCCMM futuro.'}
          {isAvulso && 'Cadastro de animal do plantel sem dependência imediata da ABCCMM. Pode ter registro e chip normalmente.'}
          {isThirdParty && 'Animal de terceiro hospedado no haras. Informe o proprietário para rastreabilidade.'}
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <h2 className="text-xl text-foreground dark:text-white mb-6">Informações Básicas</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome do Animal */}
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Nome do Animal <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Nome do Animal"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full h-10 px-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#3a3a3a] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
            </div>

            {/* Registro */}
            {!isBirth && (
              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">
                  Registro
                </label>
                <input
                  type="text"
                  placeholder="Ex: ABCCMM 123456-78"
                  value={formData.registro}
                  onChange={(e) => setFormData({ ...formData, registro: e.target.value })}
                  className="w-full h-10 px-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#3a3a3a] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                />
              </div>
            )}

            {/* Chip */}
            {showPhysicalInfo && !isBirth && (
              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">
                  Chip
                </label>
                <input
                  type="text"
                  placeholder="Ex: 1234567890"
                  value={formData.chip}
                  onChange={(e) => setFormData({ ...formData, chip: e.target.value })}
                  className="w-full h-10 px-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#3a3a3a] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                />
              </div>
            )}

            {/* Registro futuro ABCCMM (somente nascimento) */}
            {isBirth && (
              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">
                  Este animal será registrado na ABCCMM futuramente?
                </label>
                <NativeSelect
                  value={formData.registroFuturoABCCMM}
                  onChange={(e) => setFormData({ ...formData, registroFuturoABCCMM: e.target.value as 'sim' | 'nao' })}
                >
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </NativeSelect>
              </div>
            )}

            {/* Marca - Hidden for Genealogy */}
            {showPhysicalInfo && (
              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">
                  Marca
                </label>
                <input
                  type="text"
                  placeholder="Ex: Marca do Chip"
                  value={formData.marca}
                  onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                  className="w-full h-10 px-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#3a3a3a] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                />
              </div>
            )}

            {/* Data de Nascimento */}
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Data de Nascimento {isBirthDateRequired && <span className="text-red-500">*</span>}
              </label>
              <input
                type="date"
                required={isBirthDateRequired}
                value={formData.dataNascimento}
                onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                className="w-full h-10 px-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#3a3a3a] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
            </div>

            {/* Sexo */}
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Sexo <span className="text-red-500">*</span>
              </label>
              <NativeSelect
                value={formData.sexo}
                onChange={(e) => setFormData({ ...formData, sexo: e.target.value })}
                required
              >
                <option value="">Escolha o sexo</option>
                <option value="Macho">Macho</option>
                <option value="Fêmea">Fêmea</option>
              </NativeSelect>
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Categoria
              </label>
              <NativeSelect
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                required
              >
                <option value="">Selecione a categoria</option>
                <option value="potro">Potro</option>
                <option value="potra">Potranca</option>
                <option value="garanhao">Garanhão</option>
                <option value="egua">Égua</option>
                <option value="castrado">Castrado</option>
              </NativeSelect>
            </div>

            {/* Status de Manejo - Hidden for Genealogy */}
            {showLocationInfo && (
              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">
                  Status de Manejo
                </label>
                <input
                  type="text"
                  list="status-suggestions"
                  placeholder="Descreva o status"
                  value={formData.statusManejo}
                  onChange={(e) => setFormData({ ...formData, statusManejo: e.target.value })}
                  className="w-full h-10 px-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#3a3a3a] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                />
                <datalist id="status-suggestions">
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
            )}

            {/* Localização - Hidden for Genealogy */}
            {showLocationInfo && (
              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">
                  Localização
                </label>
                <input
                  type="text"
                  placeholder="Ex: Baia"
                  value={formData.localizacao}
                  onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                  className="w-full h-10 px-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#3a3a3a] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                />
              </div>
            )}

            {/* Tipo de Serviço - Hidden for Genealogy */}
            {showLocationInfo && (
              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">
                  Tipo de Serviço
                </label>
                <input
                  type="text"
                  placeholder="Ex: Reprodução"
                  value={formData.servicoTipo}
                  onChange={(e) => setFormData({ ...formData, servicoTipo: e.target.value })}
                  className="w-full h-10 px-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#3a3a3a] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                />
              </div>
            )}

            {/* Haras de Origem / Proprietário */}
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                {isThirdParty ? 'Proprietário' : 'Haras de Origem'}
              </label>
              <input
                type="text"
                placeholder={isThirdParty ? 'Nome do Proprietário' : 'Ex: Haras ABC'}
                value={formData.harasOrigem}
                readOnly={isBirth}
                onChange={(e) => setFormData({ ...formData, harasOrigem: e.target.value })}
                className={`w-full h-10 px-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#3a3a3a] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20 ${isBirth ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
            </div>

            {/* Pelagem */}
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Pelagem
              </label>
              <input
                type="text"
                placeholder="Ex: Alazã, Castanha, Tordilha"
                value={formData.pelagem}
                onChange={(e) => setFormData({ ...formData, pelagem: e.target.value })}
                className="w-full h-10 px-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#3a3a3a] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
            </div>
          </div>
        </div>

        {/* Características Físicas - Hidden for Genealogy */}
        {showPhysicalInfo && (
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
            <h2 className="text-xl text-foreground dark:text-white mb-6">Características Físicas</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Altura */}
              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">
                  Altura (cm)
                </label>
                <input
                  type="number"
                  placeholder="Ex: 150"
                  value={formData.altura}
                  onChange={(e) => setFormData({ ...formData, altura: e.target.value })}
                  className="w-full h-10 px-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#3a3a3a] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                />
              </div>

              {/* Peso */}
              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  placeholder="Ex: 450"
                  value={formData.peso}
                  onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
                  className="w-full h-10 px-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#3a3a3a] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                />
              </div>
            </div>
          </div>
        )}

        {/* Genealogia */}
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <h2 className="text-xl text-foreground dark:text-white mb-6">Genealogia</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pai */}
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Pai
              </label>
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
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Mãe
              </label>
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

        {/* Documentos */}
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <h2 className="text-xl text-foreground dark:text-white mb-6">Documentos</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Selecionar Arquivo
              </label>
              <div
                onDrop={handleDocumentDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-border dark:border-[#616161] rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary dark:hover:border-white/50 transition-colors"
                onClick={() => document.getElementById('document-input')?.click()}
              >
                <Upload className="w-12 h-12 text-muted-foreground dark:text-[#616161] mb-3" />
                <p className="text-foreground dark:text-white mb-1">Arraste e solte o arquivo aqui</p>
                <p className="text-sm text-muted-foreground dark:text-[#6b6b6b]">ou clique para selecionar o arquivo</p>
                <input
                  id="document-input"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx"
                  onChange={handleDocumentSelect}
                  className="hidden"
                />
              </div>
            </div>

            {/* Lista de Documentos Selecionados */}
            {selectedDocuments.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-foreground dark:text-white">Arquivos selecionados:</p>
                {selectedDocuments.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted dark:bg-[#0d0d0d] rounded-lg"
                  >
                    <span className="text-sm text-foreground dark:text-white">{doc.name}</span>
                    <button
                      type="button"
                      onClick={() => removeDocument(index)}
                      className="text-muted-foreground dark:text-[#99a1af] hover:text-red-500 dark:hover:text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Fotos */}
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <h2 className="text-xl text-foreground dark:text-white mb-6">Fotos e Vídeos</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Imagens e Vídeos
              </label>
              <div
                className="border-2 border-dashed border-border dark:border-[#616161] rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary dark:hover:border-white/50 transition-colors"
                onClick={() => document.getElementById('image-input')?.click()}
              >
                <div className="w-16 h-16 bg-muted dark:bg-[#0d0d0d] rounded-lg flex items-center justify-center mb-3">
                  <Camera className="w-8 h-8 text-muted-foreground dark:text-[#616161]" />
                </div>
                <p className="text-sm text-muted-foreground dark:text-[#6b6b6b]">Clique para adicionar fotos e vídeos</p>
                <input
                  id="image-input"
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
            </div>

            {/* Grid de Imagens Selecionadas */}
            {selectedImages.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedImages.map((image, index) => (
                  <div key={index} className="space-y-2">
                    <div className="relative group">
                      <div className="aspect-square rounded-xl overflow-hidden bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)]">
                        {image.type === 'image' ? (
                          <img
                            src={URL.createObjectURL(image.file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <video
                            src={URL.createObjectURL(image.file)}
                            className="w-full h-full object-cover"
                            controls
                          />
                        )}
                      </div>
                      {/* Badge de tipo */}
                      <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded-md flex items-center gap-1">
                        {image.type === 'video' ? (
                          <>
                            <Video className="w-3 h-3" />
                            Vídeo
                          </>
                        ) : (
                          <>
                            <Camera className="w-3 h-3" />
                            Foto
                          </>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Adicionar legenda..."
                        value={image.caption}
                        onChange={(e) => {
                          const updatedImages = [...selectedImages];
                          updatedImages[index].caption = e.target.value;
                          setSelectedImages(updatedImages);
                        }}
                        className="w-full h-10 px-3 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#3a3a3a] rounded-xl text-sm text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Observações */}
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <h2 className="text-xl text-foreground dark:text-white mb-6">Observações</h2>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Observações Gerais
            </label>
            <textarea
              placeholder="Adicione observações sobre o animal..."
              rows={6}
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              className="w-full px-4 py-3 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#3a3a3a] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20 resize-none"
            />
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex flex-col lg:flex-row gap-3 justify-end">
            <button
              type="button"
              onClick={onBack}
              className="px-8 py-3 bg-transparent border border-muted-foreground dark:border-[#b0b0b0] text-muted-foreground dark:text-[#b0b0b0] rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={createAnimalMutation.isPending}
              className="px-8 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {createAnimalMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {createAnimalMutation.isPending ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
