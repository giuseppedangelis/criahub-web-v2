import { ChevronLeft, ChevronRight, Calendar, Upload, FileText, X, ImageIcon } from 'lucide-react';
import { useState } from 'react';
import { NativeSelect } from '../ui/native-select';
import { toast } from 'sonner';

interface TaskEditProps {
  taskId: number;
  onBack: () => void;
  onSave: (taskData: any) => void;
  initialData: {
    date: string;
    animal: string;
    task: string;
    responsible: string;
    status: string;
    priority: string;
    observations: string;
    documents: { id: string; name: string; size: string }[];
    photos: { id: string; url: string; name: string }[];
  };
}

export function AdvisorTaskEditContent({ taskId, onBack, onSave, initialData }: TaskEditProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [formData, setFormData] = useState(initialData);

  const handlePrevPhoto = () => {
    if (formData.photos.length === 0) return;
    setCurrentPhotoIndex((prev) => (prev === 0 ? formData.photos.length - 1 : prev - 1));
  };

  const handleNextPhoto = () => {
    if (formData.photos.length === 0) return;
    setCurrentPhotoIndex((prev) => (prev === formData.photos.length - 1 ? 0 : prev + 1));
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newDocuments = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
    }));

    setFormData({
      ...formData,
      documents: [...formData.documents, ...newDocuments],
    });

    toast.success(`${newDocuments.length} documento(s) adicionado(s)`);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPhotos = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      name: file.name,
    }));

    setFormData({
      ...formData,
      photos: [...formData.photos, ...newPhotos],
    });

    toast.success(`${newPhotos.length} foto(s) adicionada(s)`);
  };

  const removeDocument = (id: string) => {
    setFormData({
      ...formData,
      documents: formData.documents.filter((doc) => doc.id !== id),
    });
    toast.success('Documento removido');
  };

  const removePhoto = (id: string) => {
    const newPhotos = formData.photos.filter((photo) => photo.id !== id);
    setFormData({
      ...formData,
      photos: newPhotos,
    });
    
    // Ajustar índice se necessário
    if (currentPhotoIndex >= newPhotos.length && newPhotos.length > 0) {
      setCurrentPhotoIndex(newPhotos.length - 1);
    } else if (newPhotos.length === 0) {
      setCurrentPhotoIndex(0);
    }
    
    toast.success('Foto removida');
  };

  const handleSave = () => {
    // Validação
    if (!formData.date || !formData.task || !formData.responsible) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    onSave(formData);
  };

  return (
    <div className="space-y-6">
      {/* Header com Breadcrumb */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={onBack}
            className="text-foreground dark:text-white hover:underline"
          >
            Tarefas
          </button>
          <ChevronRight className="w-4 h-4 text-muted-foreground dark:text-[#99a1af]" />
          <span className="text-foreground dark:text-white">Tarefa #{String(taskId).padStart(3, '0')}</span>
        </div>
        <h2 className="text-foreground dark:text-white">Tarefa #{String(taskId).padStart(3, '0')}</h2>
      </div>

      {/* Galeria de Fotos */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] overflow-hidden">
        {formData.photos.length > 0 ? (
          <div className="relative aspect-[16/9] w-full">
            <img
              src={formData.photos[currentPhotoIndex].url}
              alt={formData.photos[currentPhotoIndex].name}
              className="w-full h-full object-cover"
            />
            {/* Controles de navegação */}
            {formData.photos.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between p-6">
                <button
                  onClick={handlePrevPhoto}
                  className="w-12 h-12 bg-[#3a3a3a]/80 hover:bg-[#3a3a3a] rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={handleNextPhoto}
                  className="w-12 h-12 bg-[#3a3a3a]/80 hover:bg-[#3a3a3a] rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </div>
            )}
            {/* Indicador de foto atual */}
            {formData.photos.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#3a3a3a]/80 backdrop-blur-sm px-3 py-1 rounded-full">
                <p className="text-sm text-white">
                  {currentPhotoIndex + 1} / {formData.photos.length}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-[16/9] w-full bg-muted dark:bg-[#0d0d0d] flex items-center justify-center">
            <div className="text-center">
              <ImageIcon className="w-16 h-16 text-muted-foreground dark:text-[#6b6b6b] mx-auto mb-2" />
              <p className="text-sm text-muted-foreground dark:text-[#6b6b6b]">Nenhuma foto adicionada</p>
            </div>
          </div>
        )}
      </div>

      {/* Formulário */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] p-6">
        <div className="space-y-4">
          {/* Data */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Data *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground dark:text-white" />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full h-10 pl-10 pr-4 bg-card dark:bg-[#3a3a3a] border border-border dark:border-[#6b6b6b] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
            </div>
          </div>

          {/* Nome do Animal */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Nome do Animal
            </label>
            <input
              type="text"
              value={formData.animal}
              onChange={(e) => setFormData({ ...formData, animal: e.target.value })}
              placeholder="Digite o nome do animal"
              className="w-full h-10 px-4 bg-card dark:bg-[#3a3a3a] border border-border dark:border-[#6b6b6b] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
            />
          </div>

          {/* Tarefa */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Tarefa *
            </label>
            <input
              type="text"
              value={formData.task}
              onChange={(e) => setFormData({ ...formData, task: e.target.value })}
              placeholder="Digite a tarefa"
              className="w-full h-10 px-4 bg-card dark:bg-[#3a3a3a] border border-border dark:border-[#6b6b6b] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
            />
          </div>

          {/* Responsável */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Responsável *
            </label>
            <NativeSelect
              value={formData.responsible}
              onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
            >
              <option value="">Selecione o responsável</option>
              <option value="João (Peão)">João (Peão)</option>
              <option value="Dra. Maria (Veterinária)">Dra. Maria (Veterinária)</option>
              <option value="Pedro (Treinador)">Pedro (Treinador)</option>
              <option value="Patrícia (Acessora)">Patrícia (Acessora)</option>
            </NativeSelect>
          </div>

          {/* Status e Prioridade */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Status *
              </label>
              <NativeSelect
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Pendente">Pendente</option>
                <option value="Em andamento">Em andamento</option>
                <option value="Concluída">Concluída</option>
              </NativeSelect>
            </div>

            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Prioridade *
              </label>
              <NativeSelect
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
              </NativeSelect>
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Observações
            </label>
            <textarea
              value={formData.observations}
              onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
              placeholder="Digite observações sobre a tarefa"
              rows={3}
              className="w-full px-4 py-3 bg-card dark:bg-[#3a3a3a] border border-border dark:border-[#6b6b6b] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20 resize-none"
            />
          </div>

          {/* Documentos */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Documentos
            </label>
            <div className="space-y-3">
              {formData.documents.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {formData.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="group relative flex items-center gap-2 px-3 py-2 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-xl"
                    >
                      <FileText className="w-4 h-4 text-foreground dark:text-white flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground dark:text-white truncate max-w-[120px]">
                          {doc.name}
                        </p>
                        <p className="text-xs text-muted-foreground dark:text-[#6b6b6b]">
                          {doc.size}
                        </p>
                      </div>
                      <button
                        onClick={() => removeDocument(doc.id)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <label className="flex items-center justify-center gap-2 w-full h-10 bg-card dark:bg-[#3a3a3a] border border-border dark:border-[#6b6b6b] rounded-xl cursor-pointer hover:opacity-80 transition-opacity">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleDocumentUpload}
                  className="hidden"
                />
                <Upload className="w-5 h-5 text-foreground dark:text-white" />
                <span className="text-sm text-foreground dark:text-white">Adicionar Documentos</span>
              </label>
              <p className="text-xs text-muted-foreground dark:text-[#6b6b6b]">
                Formatos aceitos: PDF, DOC, DOCX, TXT
              </p>
            </div>
          </div>

          {/* Fotos */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Fotos
            </label>
            <div className="space-y-3">
              {formData.photos.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {formData.photos.map((photo, index) => (
                    <div
                      key={photo.id}
                      className="group relative flex flex-col items-end gap-1"
                    >
                      <button
                        onClick={() => removePhoto(photo.id)}
                        className="p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors z-10"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                      <button
                        onClick={() => setCurrentPhotoIndex(index)}
                        className={`w-24 h-24 rounded-xl overflow-hidden border-2 transition-colors ${
                          currentPhotoIndex === index
                            ? 'border-primary dark:border-white'
                            : 'border-border dark:border-[rgba(255,255,255,0.1)]'
                        }`}
                      >
                        <img
                          src={photo.url}
                          alt={photo.name}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <label className="flex items-center justify-center gap-2 w-full h-10 bg-card dark:bg-[#3a3a3a] border border-border dark:border-[#6b6b6b] rounded-xl cursor-pointer hover:opacity-80 transition-opacity">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <ImageIcon className="w-5 h-5 text-foreground dark:text-white" />
                <span className="text-sm text-foreground dark:text-white">Adicionar Fotos</span>
              </label>
              <p className="text-xs text-muted-foreground dark:text-[#6b6b6b]">
                Formatos aceitos: JPG, PNG, GIF, WEBP
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex flex-col lg:flex-row gap-3">
        <button
          onClick={onBack}
          className="flex-1 h-10 px-4 bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white rounded-xl hover:opacity-90 transition-opacity"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="flex-1 h-10 px-4 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
        >
          Salvar Alterações
        </button>
      </div>
    </div>
  );
}
