import { useState } from 'react';
import { Heart, Search, X } from 'lucide-react';
import { toast } from 'sonner';

interface AddEventFormProps {
  onClose: () => void;
}

export function AddEventForm({ onClose }: AddEventFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    date: '',
    time: '',
    responsible: '',
    observations: '',
    notifyPartners: false,
  });

  const [searchAnimal, setSearchAnimal] = useState('');
  const [selectedAnimals, setSelectedAnimals] = useState<Array<{ id: number; name: string; registration: string }>>([]);

  // Animais mockados
  const mockAnimals = [
    { id: 1, name: 'Relâmpago', registration: 'ABCCMM 1234567-89' },
    { id: 2, name: 'Estrela', registration: 'ABCCMM 1234567-89' },
    { id: 3, name: 'Trovão', registration: 'ABCCMM 1234567-90' },
    { id: 4, name: 'Lua', registration: 'ABCCMM 1234567-91' },
  ];

  const filteredAnimals = mockAnimals.filter(animal => 
    animal.name.toLowerCase().includes(searchAnimal.toLowerCase())
  );

  const toggleAnimal = (animal: typeof mockAnimals[0]) => {
    if (selectedAnimals.find(a => a.id === animal.id)) {
      setSelectedAnimals(selectedAnimals.filter(a => a.id !== animal.id));
    } else {
      setSelectedAnimals([...selectedAnimals, animal]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.type || !formData.date || !formData.time) {
      toast.error('Preencha todos os campos obrigatórios!');
      return;
    }

    toast.success('Evento cadastrado com sucesso!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#3a3a3a] rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Título com botão fechar */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl text-foreground dark:text-white">Cadastrar Novo Evento</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-muted-foreground dark:text-gray-500 hover:text-foreground dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Informações Básicas do Evento */}
          <div className="space-y-3">
            <h3 className="text-lg text-foreground dark:text-white">Informações básicas do evento</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-foreground dark:text-white">Título do Evento</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Nome do Evento"
                  className="w-full h-10 px-4 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#6b6b6b] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-foreground dark:text-white">Tipo de Evento</label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  placeholder="Tipo de Evento"
                  className="w-full h-10 px-4 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#6b6b6b] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-foreground dark:text-white">Data</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full h-10 px-4 bg-muted dark:bg-[#3a3a3a] border-0 rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-foreground dark:text-white">Hora</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full h-10 px-4 bg-muted dark:bg-[#363636] border-0 rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                />
              </div>
            </div>
          </div>

          {/* Detalhes do Evento */}
          <div className="space-y-3">
            <h3 className="text-lg text-foreground dark:text-white">Detalhes do Evento</h3>
            
            <div className="space-y-2">
              <label className="text-sm text-foreground dark:text-white">Responsável</label>
              <input
                type="text"
                value={formData.responsible}
                onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                placeholder="Nome do responsável"
                className="w-full h-10 px-4 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#6b6b6b] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
            </div>
          </div>

          {/* Animais Relacionados */}
          <div className="bg-card dark:bg-[#0d0d0d] border border-border dark:border-[#333333] rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-muted-foreground dark:text-[#6B7280]" />
              <h3 className="text-lg text-foreground dark:text-white">Animais Relacionados</h3>
            </div>

            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground dark:text-[#6b6b6b]" />
              <input
                type="text"
                value={searchAnimal}
                onChange={(e) => setSearchAnimal(e.target.value)}
                placeholder="Pesquisar"
                className="w-full h-10 pl-10 pr-4 bg-background dark:bg-[#1a1a1a] border border-border dark:border-[#3a3a3a] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
            </div>

            {/* Lista de Animais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredAnimals.slice(0, 2).map((animal) => (
                <div
                  key={animal.id}
                  onClick={() => toggleAnimal(animal)}
                  className={`bg-card dark:bg-[#1a1a1a] border rounded-xl p-3 flex items-center gap-3 cursor-pointer transition-all ${
                    selectedAnimals.find(a => a.id === animal.id)
                      ? 'border-primary dark:border-white'
                      : 'border-border dark:border-[#333333] hover:border-primary dark:hover:border-white/50'
                  }`}
                >
                  <div className="w-16 h-16 bg-muted dark:bg-[#0d0d0d] rounded-full flex items-center justify-center overflow-hidden">
                    <div className="w-8 h-8 bg-[#6b7280] rounded-full" />
                  </div>
                  <div>
                    <p className="text-foreground dark:text-white">{animal.name}</p>
                    <p className="text-xs text-muted-foreground dark:text-[#99a1af]">{animal.registration}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkbox Notificar */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.notifyPartners}
                onChange={(e) => setFormData({ ...formData, notifyPartners: e.target.checked })}
                className="mt-0.5 w-4 h-4 bg-muted dark:bg-[#3a3a3a] border-0 rounded cursor-pointer"
              />
              <span className="text-sm text-foreground dark:text-white">Notificar Sócios/Condôminos sobre esta seleção</span>
            </label>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <label className="text-sm text-foreground dark:text-white">Observações</label>
            <textarea
              value={formData.observations}
              onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
              placeholder="Adicione observações sobre o evento..."
              rows={4}
              className="w-full px-4 py-3 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#6b6b6b] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20 resize-none"
            />
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
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
    </div>
  );
}