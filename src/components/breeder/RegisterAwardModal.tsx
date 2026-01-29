import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';

interface RegisterAwardModalProps {
  animalName: string;
  onClose: () => void;
  onSave: (data: AwardData) => void;
}

export interface AwardData {
  eventName: string;
  date: string;
  location: string;
  category: string;
  placementType: '1º Lugar' | '2º Lugar' | '3º Lugar' | 'Campeão' | 'Reservado' | 'Menção Honrosa';
  placement: string;
  points?: number;
  description?: string;
  photos: File[];
}

export function RegisterAwardModal({ animalName, onClose, onSave }: RegisterAwardModalProps) {
  const [formData, setFormData] = useState<AwardData>({
    eventName: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    category: '',
    placementType: '1º Lugar',
    placement: '',
    points: undefined,
    description: '',
    photos: [],
  });

  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Adicionar novos arquivos aos existentes
    setFormData({ ...formData, photos: [...formData.photos, ...files] });
    
    // Criar previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setFormData({
      ...formData,
      photos: formData.photos.filter((_, i) => i !== index)
    });
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-[rgba(255,255,255,0.1)]">
          <div>
            <h3 className="text-xl text-foreground dark:text-white mb-1">
              Registrar Nova Premiação
            </h3>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
              {animalName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-foreground dark:text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nome do Evento */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Nome do Evento *
            </label>
            <input
              type="text"
              required
              value={formData.eventName}
              onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
              placeholder="Ex: Exposição Nacional de Mangalarga Marchador 2024"
              className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
            />
          </div>

          {/* Data e Local */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Data *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
            </div>
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Local *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ex: Parque de Exposições - BH/MG"
                className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
            </div>
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Categoria *
            </label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Ex: Égua 3 a 5 anos, Garanhão Adulto, etc."
              className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
            />
          </div>

          {/* Tipo de Colocação */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Tipo de Colocação *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(['Campeão', '1º Lugar', '2º Lugar', '3º Lugar', 'Reservado', 'Menção Honrosa'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, placementType: type, placement: type })}
                  className={`p-3 rounded-lg border-2 transition-all text-sm ${
                    formData.placementType === type
                      ? 'border-primary dark:border-white bg-primary/10 dark:bg-white/10 text-foreground dark:text-white font-medium'
                      : 'border-gray-200 dark:border-[rgba(255,255,255,0.1)] text-muted-foreground dark:text-[#99a1af] hover:border-gray-300 dark:hover:border-[rgba(255,255,255,0.2)]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Pontos */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Pontos (Sistema Interno de Classificação)
            </label>
            <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-2">
              Use este campo para classificar a importância do evento (ex: Nacional = 100 pontos, Regional = 50 pontos)
            </p>
            <input
              type="number"
              min="0"
              value={formData.points || ''}
              onChange={(e) => setFormData({ ...formData, points: e.target.value ? parseInt(e.target.value) : undefined })}
              placeholder="Ex: 100"
              className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
            />
          </div>

          {/* Fotos e Documentos do Pódio */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Fotos e Documentos do Pódio
            </label>
            <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-3">
              Anexe fotos do pódio ou certificados em PDF (comprovante principal)
            </p>
            
            {/* Upload Button */}
            <label className="cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg p-6 hover:border-primary dark:hover:border-white/30 transition-colors">
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-muted-foreground dark:text-[#99a1af]" />
                  <p className="text-sm text-foreground dark:text-white">
                    Clique para selecionar arquivos
                  </p>
                  <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
                    Fotos: PNG, JPG | Documentos: PDF | Até 10MB cada
                  </p>
                </div>
              </div>
              <input
                type="file"
                accept="image/*,.pdf"
                multiple
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>

            {/* Preview das Fotos */}
            {photoPreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                {photoPreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-[rgba(255,255,255,0.1)]"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Descrição / Observações (Opcional)
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Informações adicionais sobre a premiação..."
              rows={3}
              className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 dark:bg-[#2a2a2a] text-foreground dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-[#3a3a3a] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity"
            >
              Registrar Premiação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}