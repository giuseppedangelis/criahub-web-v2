import { useState } from 'react';
import { X, ChevronLeft, Calendar, Clock, MapPin, User, FileText, Plus, Trash2, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { NativeSelect } from '../ui/native-select';

interface AddServiceModalProps {
  onClose: () => void;
  onBack?: () => void;
}

export function AddServiceModal({ onClose, onBack }: AddServiceModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    date: '',
    time: '',
    location: '',
    description: '',
    veterinarian: '',
  });

  const [selectedAnimals, setSelectedAnimals] = useState<string[]>([]);
  const [reminders, setReminders] = useState<string[]>(['30 minutos antes']);

  const serviceCategories = [
    { value: 'saude', label: 'Saúde', color: 'bg-green-500' },
    { value: 'consulta', label: 'Consulta Veterinária', color: 'bg-blue-500' },
    { value: 'cobertura', label: 'Cobertura', color: 'bg-red-500' },
    { value: 'exame', label: 'Exame Reprodutivo', color: 'bg-purple-500' },
    { value: 'casqueamento', label: 'Casqueamento', color: 'bg-yellow-500' },
    { value: 'parto', label: 'Parto', color: 'bg-pink-500' },
    { value: 'coleta', label: 'Coleta de Sêmen', color: 'bg-cyan-500' },
    { value: 'manejo', label: 'Manejo Geral', color: 'bg-orange-500' },
  ];

  const availableAnimals = [
    { id: '1', name: 'Trovão', registry: 'ABCCMM 1234567-01' },
    { id: '2', name: 'Ventania', registry: 'ABCCMM 1234567-02' },
    { id: '3', name: 'Estrela', registry: 'ABCCMM 1234567-03' },
    { id: '4', name: 'Relâmpago Negro', registry: 'ABCCMM 1234567-10' },
    { id: '5', name: 'Estrela Dourada', registry: 'ABCCMM 1234567-11' },
  ];

  const veterinarians = [
    'Dr. João Silva',
    'Dr. Maria Santos',
    'Dr. Pedro Costa',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.category || !formData.date || !formData.time) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    toast.success('Serviço cadastrado com sucesso!');
    onClose();
  };

  const toggleAnimal = (animalId: string) => {
    if (selectedAnimals.includes(animalId)) {
      setSelectedAnimals(selectedAnimals.filter(id => id !== animalId));
    } else {
      setSelectedAnimals([...selectedAnimals, animalId]);
    }
  };

  const addReminder = () => {
    setReminders([...reminders, '1 hora antes']);
  };

  const removeReminder = (index: number) => {
    setReminders(reminders.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-card dark:bg-[#1a1a1a] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-border dark:border-[rgba(255,255,255,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="p-2 hover:bg-muted dark:hover:bg-[#0d0d0d] rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-foreground dark:text-white" />
                </button>
              )}
              <h2 className="text-xl text-foreground dark:text-white">Novo Serviço Interno</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-foreground dark:text-white">Informações Básicas</h3>

            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Categoria do Serviço *
              </label>
              <NativeSelect
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full"
              >
                <option value="">Selecione a categoria</option>
                {serviceCategories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </NativeSelect>
            </div>

            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Título do Serviço *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Vacinação - Plantel Completo"
                className="w-full px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">
                  Data *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                />
              </div>

              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">
                  Horário *
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Local
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ex: Piquete Central, Baia 12"
                className="w-full px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
            </div>

            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Veterinário Responsável
              </label>
              <NativeSelect
                value={formData.veterinarian}
                onChange={(e) => setFormData({ ...formData, veterinarian: e.target.value })}
                className="w-full"
              >
                <option value="">Selecione o veterinário</option>
                {veterinarians.map(vet => (
                  <option key={vet} value={vet}>{vet}</option>
                ))}
              </NativeSelect>
            </div>

            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detalhes adicionais sobre o serviço..."
                rows={3}
                className="w-full px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20 resize-none"
              />
            </div>
          </div>

          {/* Animais Relacionados */}
          <div className="space-y-4">
            <h3 className="text-foreground dark:text-white">Animais Relacionados</h3>
            <div className="bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl p-4 max-h-60 overflow-y-auto">
              {availableAnimals.map(animal => (
                <label
                  key={animal.id}
                  className="flex items-center gap-3 p-3 hover:bg-muted dark:hover:bg-[#1a1a1a] rounded-lg cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedAnimals.includes(animal.id)}
                    onChange={() => toggleAnimal(animal.id)}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="text-foreground dark:text-white">{animal.name}</p>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af]">{animal.registry}</p>
                  </div>
                </label>
              ))}
            </div>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
              {selectedAnimals.length} animal(is) selecionado(s)
            </p>
          </div>

          {/* Lembretes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-foreground dark:text-white">Lembretes</h3>
              <button
                type="button"
                onClick={addReminder}
                className="text-sm text-primary dark:text-white hover:opacity-80 transition-opacity flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </button>
            </div>
            <div className="space-y-2">
              {reminders.map((reminder, index) => (
                <div key={index} className="flex items-center gap-2">
                  <NativeSelect
                    value={reminder}
                    onChange={(e) => {
                      const newReminders = [...reminders];
                      newReminders[index] = e.target.value;
                      setReminders(newReminders);
                    }}
                    className="flex-1"
                  >
                    <option value="5 minutos antes">5 minutos antes</option>
                    <option value="15 minutos antes">15 minutos antes</option>
                    <option value="30 minutos antes">30 minutos antes</option>
                    <option value="1 hora antes">1 hora antes</option>
                    <option value="1 dia antes">1 dia antes</option>
                    <option value="2 dias antes">2 dias antes</option>
                  </NativeSelect>
                  {reminders.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeReminder(index)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col lg:flex-row gap-3 pt-4 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white rounded-xl hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
            >
              Cadastrar Serviço
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
