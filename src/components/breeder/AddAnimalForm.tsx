import { useState } from 'react';
import { ChevronLeft, Calendar, Upload, X } from 'lucide-react';
import { toast } from 'sonner';


interface AddAnimalFormProps {
  onBack: () => void;
}

export function AddAnimalForm({ onBack }: AddAnimalFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    registration: '',
    birthDate: '',
    sex: '',
    managementStatus: '',
    coat: '',
    height: '',
    weight: '',
    father: '',
    mother: '',
    observations: '',
  });

  const [documents, setDocuments] = useState<File[]>([]);
  const [images, setImages] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.birthDate || !formData.sex) {
      toast.error('Preencha todos os campos obrigatórios!');
      return;
    }

    toast.success('Animal cadastrado com sucesso!');
    onBack();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'document' | 'image') => {
    const files = Array.from(e.target.files || []);
    if (type === 'document') {
      setDocuments([...documents, ...files]);
    } else {
      setImages([...images, ...files]);
    }
  };

  const removeFile = (index: number, type: 'document' | 'image') => {
    if (type === 'document') {
      setDocuments(documents.filter((_, i) => i !== index));
    } else {
      setImages(images.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb e Botão Voltar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-[#99a1af]">
          <span className="cursor-pointer hover:text-foreground dark:hover:text-white transition-colors" onClick={onBack}>
            Dashboard
          </span>
          <span>/</span>
          <span className="text-foreground dark:text-white">Cadastrar Animal</span>
        </div>

        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 border border-border dark:border-[#3a3a3a] rounded-lg text-foreground dark:text-white hover:bg-muted dark:hover:bg-white/5 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Voltar
        </button>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[#3a3a3a] p-6 md:p-12 space-y-8">
        {/* Título */}
        <h1 className="text-4xl text-foreground dark:text-white">Cadastrar Novo Animal</h1>

        {/* Informações Básicas */}
        <div className="space-y-4">
          <h2 className="text-2xl text-foreground dark:text-white">Informações básicas</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-foreground dark:text-white">Nome do Animal *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome do Animal"
                className="w-full h-10 px-4 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#6b6b6b] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-foreground dark:text-white">Registro</label>
              <input
                type="text"
                value={formData.registration}
                onChange={(e) => setFormData({ ...formData, registration: e.target.value })}
                placeholder="Ex: ABCCMM 123456-78"
                className="w-full h-10 px-4 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#6b6b6b] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-foreground dark:text-white">Data de Nascimento *</label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full h-10 px-4 bg-muted dark:bg-[#3a3a3a] border-0 rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-foreground dark:text-white">Sexo *</label>
              <select
                value={formData.sex}
                onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                className="w-full h-10 px-4 bg-muted dark:bg-[#3a3a3a] border-0 rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              >
                <option value="">Escolha o sexo</option>
                <option value="Macho">Macho</option>
                <option value="Fêmea">Fêmea</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-foreground dark:text-white">Status de Manejo</label>
              <input
                type="text"
                value={formData.managementStatus}
                onChange={(e) => setFormData({ ...formData, managementStatus: e.target.value })}
                placeholder="Descreva o status"
                className="w-full h-10 px-4 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#6b6b6b] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-foreground dark:text-white">Pelagem</label>
              <input
                type="text"
                value={formData.coat}
                onChange={(e) => setFormData({ ...formData, coat: e.target.value })}
                placeholder="Ex: Alazã, Castanha, Tordilha"
                className="w-full h-10 px-4 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#6b6b6b] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
            </div>
          </div>
        </div>

        {/* Características Físicas */}
        <div className="space-y-4">
          <h2 className="text-2xl text-foreground dark:text-white">Características Físicas</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-foreground dark:text-white">Altura (cm)</label>
              <input
                type="text"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                placeholder="Ex: 150"
                className="w-full h-10 px-4 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#6b6b6b] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-foreground dark:text-white">Peso (kg)</label>
              <input
                type="text"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="Ex: 450"
                className="w-full h-10 px-4 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#6b6b6b] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
            </div>
          </div>
        </div>

        {/* Genealogia */}
        <div className="space-y-4">
          <h2 className="text-2xl text-foreground dark:text-white">Genealogia</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-foreground dark:text-white">Pai</label>
              <input
                type="text"
                value={formData.father}
                onChange={(e) => setFormData({ ...formData, father: e.target.value })}
                placeholder="Nome do pai"
                className="w-full h-10 px-4 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#6b6b6b] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-foreground dark:text-white">Mãe</label>
              <input
                type="text"
                value={formData.mother}
                onChange={(e) => setFormData({ ...formData, mother: e.target.value })}
                placeholder="Nome da mãe"
                className="w-full h-10 px-4 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#6b6b6b] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
            </div>
          </div>
        </div>

        {/* Documentos */}
        <div className="space-y-4">
          <h2 className="text-2xl text-foreground dark:text-white">Documentos</h2>

          <div className="space-y-2">
            <label className="text-sm text-foreground dark:text-white">Selecionar Arquivo</label>
            <div className="relative">
              <input
                type="file"
                multiple
                onChange={(e) => handleFileUpload(e, 'document')}
                className="hidden"
                id="document-upload"
              />
              <label
                htmlFor="document-upload"
                className="flex items-center justify-center gap-2 w-full h-10 bg-card dark:bg-[#3a3a3a] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-xl cursor-pointer hover:opacity-80 transition-opacity"
              >
                <Upload className="w-5 h-5 text-foreground dark:text-white" />
                <span className="text-sm text-foreground dark:text-white">Selecionar Documentos</span>
              </label>
            </div>

            {documents.length > 0 && (
              <div className="space-y-2 mt-4">
                {documents.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted dark:bg-[#0d0d0d] p-3 rounded-lg">
                    <span className="text-sm text-foreground dark:text-white">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index, 'document')}
                      className="text-red-600 dark:text-red-400 hover:opacity-70"
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
        <div className="space-y-4">
          <h2 className="text-2xl text-foreground dark:text-white">Fotos</h2>

          <div className="space-y-2">
            <label className="text-sm text-foreground dark:text-white">Imagens</label>
            <div className="relative">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'image')}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex items-center justify-center gap-2 w-full h-10 bg-card dark:bg-[#3a3a3a] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-xl cursor-pointer hover:opacity-80 transition-opacity"
              >
                <Upload className="w-5 h-5 text-foreground dark:text-white" />
                <span className="text-sm text-foreground dark:text-white">Selecionar Fotos</span>
              </label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {images.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index, 'image')}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Observações */}
        <div className="space-y-4">
          <h2 className="text-2xl text-foreground dark:text-white">Observações</h2>

          <div className="space-y-2">
            <label className="text-sm text-foreground dark:text-white">Observações Gerais</label>
            <textarea
              value={formData.observations}
              onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
              placeholder="Adicione observações sobre o animal..."
              rows={5}
              className="w-full px-4 py-3 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#6b6b6b] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20 resize-none"
            />
          </div>
        </div>

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <button
            type="button"
            onClick={onBack}
            className="px-12 py-3 border border-border dark:border-[#b0b0b0] rounded-lg text-foreground dark:text-[#b0b0b0] hover:bg-muted dark:hover:bg-white/5 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-12 py-3 bg-primary dark:bg-white text-white dark:text-[#1a1a1a] rounded-lg hover:opacity-90 transition-opacity"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}