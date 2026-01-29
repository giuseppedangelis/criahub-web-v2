import { ArrowLeft, Upload, Camera, X, Video } from 'lucide-react';
import { useState } from 'react';
import { NativeSelect } from '../ui/native-select';

interface BreederCadastrarAnimalProps {
  onBack: () => void;
}

export function BreederCadastrarAnimal({ onBack }: BreederCadastrarAnimalProps) {
  const [formData, setFormData] = useState({
    nome: '',
    registro: '',
    chip: '',  // Novo campo
    marca: '',  // Novo campo
    dataNascimento: '',
    sexo: '',
    categoria: '',  // Categoria do animal (Reprodutora, Potro, etc)
    statusManejo: '',
    localizacao: 'Baia',  // Novo campo
    servicoTipo: 'Reprodução',  // Novo campo
    harasOrigem: '',  // Haras de origem
    pelagem: '',
    altura: '',
    peso: '',
    pai: '',
    mae: '',
    observacoes: '',
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de salvamento
    console.log('Salvando animal:', formData);
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

            {/* Chip */}
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

            {/* Marca */}
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

            {/* Data de Nascimento */}
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Data de Nascimento <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
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
              <input
                type="text"
                placeholder="Ex: Reprodutora, Potro"
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                className="w-full h-10 px-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#3a3a3a] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
            </div>

            {/* Status de Manejo */}
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

            {/* Localização */}
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

            {/* Tipo de Serviço */}
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

            {/* Haras de Origem */}
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Haras de Origem
              </label>
              <input
                type="text"
                placeholder="Ex: Haras ABC"
                value={formData.harasOrigem}
                onChange={(e) => setFormData({ ...formData, harasOrigem: e.target.value })}
                className="w-full h-10 px-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#3a3a3a] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
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

        {/* Características Físicas */}
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

        {/* Genealogia */}
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <h2 className="text-xl text-foreground dark:text-white mb-6">Genealogia</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pai */}
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Pai
              </label>
              <input
                type="text"
                placeholder="Nome do pai"
                value={formData.pai}
                onChange={(e) => setFormData({ ...formData, pai: e.target.value })}
                className="w-full h-10 px-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#3a3a3a] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
            </div>

            {/* Mãe */}
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Mãe
              </label>
              <input
                type="text"
                placeholder="Nome da mãe"
                value={formData.mae}
                onChange={(e) => setFormData({ ...formData, mae: e.target.value })}
                className="w-full h-10 px-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#3a3a3a] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
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
              className="px-8 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity"
            >
              Salvar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}