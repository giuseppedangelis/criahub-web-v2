import { ArrowLeft, Upload, X, Camera, FileText, Plus, Video } from 'lucide-react';
import { useState } from 'react';
import { NativeSelect } from '../ui/native-select';

interface Animal {
  id: number;
  name: string;
  registry: string;
  chip?: string;
  marca?: string;
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
  images?: string[];
  imageCaptions?: string[];
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
  const [formData, setFormData] = useState({
    nome: animal.name,
    registro: animal.registry,
    chip: animal.chip || '',
    marca: animal.marca || '',
    categoria: animal.category,
    sexo: 'Macho',
    dataNascimento: '2020-01-15',
    pelagem: 'Alazã',
    andamento: 'Marchado',
    pai: 'Trovão Branco',
    mae: 'Bella Vista',
    haras: animal.haras,
    status: animal.status,
    localizacao: animal.localizacao || 'Baia',
    servicoTipo: animal.servicoTipo || 'Reprodução',
  });

  // Estado para mídia existente e nova
  const [existingMedia, setExistingMedia] = useState<MediaItem[]>(
    animal.images?.map((img, index) => ({
      id: `existing-${index}`,
      url: img,
      caption: animal.imageCaptions?.[index] || '',
      type: 'image' as const,
      isExisting: true,
    })) || []
  );

  const [newMedia, setNewMedia] = useState<{ file: File; caption: string; type: 'image' | 'video' }[]>([]);

  // Estado para documentos existentes e novos
  const [existingDocuments, setExistingDocuments] = useState<DocumentItem[]>([
    { id: 'doc-1', name: 'Registro ABCCMM.pdf', url: '#', isExisting: true },
    { id: 'doc-2', name: 'Certificado Genealogia.pdf', url: '#', isExisting: true },
  ]);

  const [newDocuments, setNewDocuments] = useState<File[]>([]);

  const handleNewMediaSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      const newMediaItems = filesArray.map(file => ({
        file,
        caption: '',
        type: file.type.startsWith('video/') ? 'video' as const : 'image' as const
      }));
      setNewMedia([...newMedia, ...newMediaItems]);
    }
  };

  const handleNewDocumentSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setNewDocuments([...newDocuments, ...filesArray]);
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

  const handleSave = () => {
    onSave();
    onBack();
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
                  <option value="Égua">Égua</option>
                  <option value="Garanhão">Garanhão</option>
                  <option value="Potro">Potro</option>
                  <option value="Potra">Potra</option>
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
                <label className="block text-sm text-foreground dark:text-white mb-2">Haras *</label>
                <NativeSelect
                  value={formData.haras}
                  onChange={(e) => setFormData({ ...formData, haras: e.target.value })}
                  className="w-full"
                >
                  <option value="Haras Pedra Alta">Haras Pedra Alta</option>
                  <option value="Outro Haras">Outro Haras</option>
                </NativeSelect>
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
                  <option value="Alazã">Alazã</option>
                  <option value="Baia">Baia</option>
                  <option value="Castanha">Castanha</option>
                  <option value="Pampa">Pampa</option>
                  <option value="Tordilha">Tordilha</option>
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
            </div>
          </div>

          {/* Genealogia */}
          <div>
            <h3 className="text-lg text-foreground dark:text-white mb-4">Genealogia</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">Pai</label>
                <input
                  type="text"
                  value={formData.pai}
                  onChange={(e) => setFormData({ ...formData, pai: e.target.value })}
                  className="w-full h-10 px-4 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                  placeholder="Nome do pai"
                />
              </div>

              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">Mãe</label>
                <input
                  type="text"
                  value={formData.mae}
                  onChange={(e) => setFormData({ ...formData, mae: e.target.value })}
                  className="w-full h-10 px-4 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                  placeholder="Nome da mãe"
                />
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
                  <option value="Ativo">Ativo</option>
                  <option value="Vendido">Vendido</option>
                  <option value="Falecido">Falecido</option>
                  <option value="Transferido">Transferido</option>
                  <option value="Inativo">Inativo</option>
                </NativeSelect>
              </div>
            </div>
          </div>

          {/* Localização - Apenas se Status = Ativo */}
          {formData.status === 'Ativo' && (
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
              className="flex-1 px-6 py-3 bg-transparent border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity"
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}