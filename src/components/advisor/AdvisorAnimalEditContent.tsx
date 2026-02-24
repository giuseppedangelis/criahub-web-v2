import { ChevronLeft, Trash2, Save, X, Upload, ChevronLeft as ArrowLeft, ChevronRight as ArrowRight, Calendar } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '../ui/breadcrumb';

interface AnimalEditProps {
  animalId: number;
  animalName: string;
  onBack: () => void;
}

export function AdvisorAnimalEditContent({ animalId, animalName, onBack }: AnimalEditProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [formData, setFormData] = useState({
    name: 'Haras Rei da Marcha',
    sex: 'Macho',
    registry: 'MM-2020-1234',
    city: 'São Paulo',
    state: 'SP',
    birthDate: '2020-03-12',
    chip: '123456789',
    breeder: 'Haras Vale Verde',
    status: 'Ativo',
  });

  const images = [
    'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1598632640487-6ea4a4e8b928?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=800&h=600&fit=crop',
  ];

  const handleSave = () => {
    toast.success('Animal atualizado com sucesso!');
    onBack();
  };

  const handleDelete = () => {
    toast.success('Animal removido com sucesso!');
    setShowDeleteModal(false);
    onBack();
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb with Back Button */}
      <div className="flex items-center justify-between gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={onBack}
                className="cursor-pointer text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white"
              >
                Plantel
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-foreground dark:text-white">
                {formData.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)] flex items-center justify-between">
          <div>
            <h2 className="text-2xl text-foreground dark:text-white mb-1">Editar Animal</h2>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
              Atualize as informações do animal
            </p>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            <span className="hidden sm:inline">Excluir</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Image Gallery */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-3">
              Imagens do Animal
            </label>
            <div className="relative">
              {/* Main Image */}
              <div className="w-full h-[400px] bg-muted dark:bg-[#0d0d0d] rounded-xl overflow-hidden mb-4">
                <img
                  src={images[currentImageIndex]}
                  alt={`${formData.name} - Imagem ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-[180px] p-2 bg-white dark:bg-black/80 rounded-full hover:bg-gray-100 dark:hover:bg-black transition-colors"
                  >
                    <ArrowLeft className="w-6 h-6 text-black dark:text-white" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-[180px] p-2 bg-white dark:bg-black/80 rounded-full hover:bg-gray-100 dark:hover:bg-black transition-colors"
                  >
                    <ArrowRight className="w-6 h-6 text-black dark:text-white" />
                  </button>
                </>
              )}

              {/* Thumbnails */}
              <div className="flex gap-3">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-[72px] h-[72px] rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? 'border-primary dark:border-white'
                        : 'border-transparent hover:border-muted-foreground dark:hover:border-[#6b6b6b]'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
                {/* Add Image Button */}
                <button className="w-[72px] h-[72px] bg-white dark:bg-white rounded-lg flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
                  <Upload className="w-6 h-6 text-[#1a1a1a]" />
                </button>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome do Animal */}
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Nome do Animal <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full h-10 px-4 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#6b6b6b] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
              />
            </div>

            {/* Sexo */}
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Sexo <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.sex}
                onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                className="w-full h-10 px-4 bg-background dark:bg-[#3a3a3a] border-0 rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
              >
                <option>Escolha o sexo</option>
                <option>Macho</option>
                <option>Fêmea</option>
              </select>
            </div>

            {/* Registro BCCMM */}
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Registro BCCMM <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.registry}
                onChange={(e) => setFormData({ ...formData, registry: e.target.value })}
                className="w-full h-10 px-4 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#6b6b6b] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
              />
            </div>

            {/* Local de Nascimento */}
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Local de Nascimento <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="flex-1 h-10 px-4 bg-background dark:bg-[#3a3a3a] border-0 rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                >
                  <option>Escolha a cidade</option>
                  <option>São Paulo</option>
                  <option>Belo Horizonte</option>
                  <option>Rio de Janeiro</option>
                </select>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-[114px] h-10 px-4 bg-background dark:bg-[#3a3a3a] border-0 rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                >
                  <option>UF</option>
                  <option>SP</option>
                  <option>MG</option>
                  <option>RJ</option>
                </select>
              </div>
            </div>

            {/* Data de Nascimento */}
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Data de Nascimento <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground dark:text-white" />
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full h-10 pl-12 pr-4 bg-background dark:bg-[#3a3a3a] border-0 rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                />
              </div>
            </div>

            {/* Chip */}
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Chip
              </label>
              <input
                type="text"
                value={formData.chip}
                onChange={(e) => setFormData({ ...formData, chip: e.target.value })}
                className="w-full h-10 px-4 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#6b6b6b] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
              />
            </div>

            {/* Criador */}
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Criador
              </label>
              <input
                type="text"
                value={formData.breeder}
                onChange={(e) => setFormData({ ...formData, breeder: e.target.value })}
                className="w-full h-10 px-4 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#6b6b6b] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full h-10 px-4 bg-background dark:bg-[#3a3a3a] border-0 rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
              >
                <option>Ativo</option>
                <option>Inativo</option>
                <option>Gestante</option>
                <option>Reprodutor</option>
                <option>Potro</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col lg:flex-row gap-3 pt-6 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
            <button
              onClick={onBack}
              className="flex-1 px-6 py-3 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] text-foreground dark:text-white rounded-xl hover:bg-muted dark:hover:bg-[#2a2a2a] transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] p-6 max-w-md w-full">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl text-foreground dark:text-white">Excluir Animal</h3>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                Tem certeza que deseja excluir <strong>{formData.name}</strong>? Esta ação não pode ser desfeita.
              </p>
              <div className="flex flex-col lg:flex-row gap-3 pt-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-6 py-3 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] text-foreground dark:text-white rounded-xl hover:bg-muted dark:hover:bg-[#2a2a2a] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-6 py-3 bg-red-600 dark:bg-red-600 text-white rounded-xl hover:bg-red-700 dark:hover:bg-red-700 transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}