import { useState } from 'react';
import { X, ChevronLeft, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { NativeSelect } from '../ui/native-select';
import type { Animal, CreateAgendaEventInput } from '@/types';
import { eventCategories, resolveAgendaType } from './agendaUtils';

interface AddPublicEventModalProps {
  onClose: () => void;
  onBack?: () => void;
  onCreate: (input: CreateAgendaEventInput) => Promise<void> | void;
  harasId: string;
  animals: Animal[];
  isSaving?: boolean;
}

export function AddPublicEventModal({ onClose, onBack, onCreate, harasId, animals, isSaving = false }: AddPublicEventModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    date: '',
    time: '',
    endDate: '',
    endTime: '',
    location: '',
    city: '',
    state: '',
    link: '',
    description: '',
    organizer: '',
  });

  const [selectedAnimals, setSelectedAnimals] = useState<string[]>([]);
  const [reminders, setReminders] = useState<string[]>(['1 dia antes']);

  const brazilianStates = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.category || !formData.date || !formData.time) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const category = eventCategories.find((item) => item.value === formData.category);
    const startDate = `${formData.date}T${formData.time}:00`;
    const resolvedEndDate = formData.endDate || (formData.endTime ? formData.date : '');
    const endDate = resolvedEndDate
      ? `${resolvedEndDate}T${formData.endTime || formData.time}:00`
      : undefined;
    const primaryAnimalId = selectedAnimals[0];

    const payload: CreateAgendaEventInput = {
      haras_id: harasId,
      title: formData.title,
      type: resolveAgendaType('events'),
      start_date: startDate,
      end_date: endDate,
      description: formData.description,
      location: formData.location || undefined,
      status: 'Pendente',
      animal_id: primaryAnimalId,
      responsible: formData.organizer || undefined,
      details: {
        category: formData.category,
        categoryLabel: category?.label,
        categoryColor: category?.color,
        time: formData.time,
        endTime: formData.endTime || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        organizer: formData.organizer || undefined,
        link: formData.link || undefined,
        reminders,
        relatedAnimalIds: selectedAnimals,
      },
    };

    try {
      await onCreate(payload);
      toast.success('Evento público cadastrado com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao criar evento público:', error);
      toast.error('Erro ao cadastrar evento público');
    }
  };

  const toggleAnimal = (animalId: string) => {
    if (selectedAnimals.includes(animalId)) {
      setSelectedAnimals(selectedAnimals.filter(id => id !== animalId));
    } else {
      setSelectedAnimals([...selectedAnimals, animalId]);
    }
  };

  const addReminder = () => {
    setReminders([...reminders, '1 semana antes']);
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
              <h2 className="text-xl text-foreground dark:text-white">Novo Evento Público</h2>
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
                Tipo de Evento *
              </label>
              <NativeSelect
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full"
              >
                <option value="">Selecione o tipo de evento</option>
                {eventCategories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </NativeSelect>
            </div>

            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Nome do Evento *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: 45ª Exposição Nacional do Mangalarga Marchador"
                className="w-full px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">
                  Data de Início *
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
                  Horário de Início *
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                />
              </div>

              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">
                  Data de Término
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                />
              </div>

              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">
                  Horário de Término
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                />
              </div>
            </div>
          </div>

          {/* Localização */}
          <div className="space-y-4">
            <h3 className="text-foreground dark:text-white">Localização</h3>

            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Local do Evento
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ex: Parque Fernando Costa"
                className="w-full px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">
                  Cidade
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Ex: Belo Horizonte"
                  className="w-full px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                />
              </div>

              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">
                  Estado
                </label>
                <NativeSelect
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full"
                >
                  <option value="">Selecione</option>
                  {brazilianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </NativeSelect>
              </div>
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="space-y-4">
            <h3 className="text-foreground dark:text-white">Informações Adicionais</h3>

            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Organizador
              </label>
              <input
                type="text"
                value={formData.organizer}
                onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                placeholder="Ex: ABCCMM"
                className="w-full px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
            </div>

            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Link do Evento
              </label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://www.exemplo.com/evento"
                className="w-full px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
            </div>

            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detalhes sobre o evento..."
                rows={3}
                className="w-full px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20 resize-none"
              />
            </div>
          </div>

          {/* Animais Participantes */}
          <div className="space-y-4">
            <h3 className="text-foreground dark:text-white">Animais Participantes</h3>
            <div className="bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl p-4 max-h-60 overflow-y-auto">
              {animals.map(animal => (
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
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af]">{animal.registry_number}</p>
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
                    <option value="1 dia antes">1 dia antes</option>
                    <option value="3 dias antes">3 dias antes</option>
                    <option value="1 semana antes">1 semana antes</option>
                    <option value="2 semanas antes">2 semanas antes</option>
                    <option value="1 mês antes">1 mês antes</option>
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
              disabled={isSaving}
              className="flex-1 px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Salvando...' : 'Cadastrar Evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
