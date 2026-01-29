import { X, Search, Plus, Check, Calendar, MapPin, Users, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface Animal {
  id: string;
  name: string;
  registry: string;
  gender: 'macho' | 'femea';
  age: number;
  photo?: string;
  category?: string;
}

interface Tropa {
  id: string;
  name: string;
  animalCount: number;
}

interface RegisterShowParticipationModalProps {
  onClose: () => void;
  onRegister: (data: any) => void;
}

export function RegisterShowParticipationModal({ onClose, onRegister }: RegisterShowParticipationModalProps) {
  const [step, setStep] = useState<'event' | 'animals' | 'details' | 'confirmation'>('event');
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [selectedAnimals, setSelectedAnimals] = useState<string[]>([]);
  const [selectedTropa, setSelectedTropa] = useState<string>('');
  const [newTropaName, setNewTropaName] = useState('');
  const [showNewTropa, setShowNewTropa] = useState(false);
  const [presenter, setPresenter] = useState('');
  const [breeder, setBreeder] = useState('');
  const [observations, setObservations] = useState('');

  const events = [
    { id: '1', name: 'Exposição Nacional de Mangalarga Marchador', date: '2025-03-15', location: 'Belo Horizonte, MG' },
    { id: '2', name: 'Campeonato Regional Sul de Minas', date: '2025-02-20', location: 'Pouso Alegre, MG' },
    { id: '3', name: 'Prova Funcional de Marcha', date: '2025-01-30', location: 'Três Corações, MG' },
  ];

  const animals: Animal[] = [
    { id: '1', name: 'Estrela da Manhã', registry: '123456', gender: 'femea', age: 5, category: 'Adulto Fêmea' },
    { id: '2', name: 'Trovão Negro', registry: '123457', gender: 'macho', age: 7, category: 'Adulto Macho' },
    { id: '3', name: 'Lua Cheia', registry: '123458', gender: 'femea', age: 4, category: 'Adulto Fêmea' },
    { id: '4', name: 'Sol Nascente', registry: '123459', gender: 'macho', age: 3, category: 'Júnior Macho' },
    { id: '5', name: 'Bella Vista', registry: '123460', gender: 'femea', age: 6, category: 'Adulto Fêmea' },
    { id: '6', name: 'Imperador', registry: '123461', gender: 'macho', age: 8, category: 'Adulto Macho' },
  ];

  const tropas: Tropa[] = [
    { id: '1', name: 'Tropa Principal', animalCount: 12 },
    { id: '2', name: 'Tropa Júnior', animalCount: 8 },
    { id: '3', name: 'Tropa Sênior', animalCount: 15 },
  ];

  const toggleAnimal = (animalId: string) => {
    if (selectedAnimals.includes(animalId)) {
      setSelectedAnimals(selectedAnimals.filter(id => id !== animalId));
    } else {
      setSelectedAnimals([...selectedAnimals, animalId]);
    }
  };

  const handleNext = () => {
    if (step === 'event' && selectedEvent) setStep('animals');
    else if (step === 'animals' && selectedAnimals.length > 0) setStep('details');
    else if (step === 'details') setStep('confirmation');
  };

  const handleConfirm = () => {
    const data = {
      eventId: selectedEvent,
      animals: selectedAnimals,
      tropa: showNewTropa ? newTropaName : selectedTropa,
      presenter,
      breeder,
      observations,
    };
    onRegister(data);
    onClose();
  };

  const selectedEventData = events.find(e => e.id === selectedEvent);
  const selectedAnimalsData = animals.filter(a => selectedAnimals.includes(a.id));

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto border border-border dark:border-[rgba(255,255,255,0.1)]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)] sticky top-0 bg-white dark:bg-[#1a1a1a] z-10">
          <div>
            <h3 className="text-2xl text-foreground dark:text-white mb-1">
              Registrar Participação em Exposição
            </h3>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
              {step === 'event' && 'Passo 1 de 4: Selecione o evento'}
              {step === 'animals' && 'Passo 2 de 4: Selecione os animais'}
              {step === 'details' && 'Passo 3 de 4: Informações adicionais'}
              {step === 'confirmation' && 'Passo 4 de 4: Confirme os dados'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-foreground dark:text-white" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="flex items-center gap-2">
            {['event', 'animals', 'details', 'confirmation'].map((s, idx) => (
              <div key={s} className="flex-1 flex items-center gap-2">
                <div className={`flex-1 h-1 rounded-full ${
                  step === s ? 'bg-white dark:bg-white' : 
                  ['event', 'animals', 'details', 'confirmation'].indexOf(step) > idx ? 'bg-emerald-500' : 
                  'bg-muted dark:bg-[#3a3a3a]'
                }`} />
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Passo 1: Selecionar Evento */}
          {step === 'event' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground dark:text-white mb-3">
                  Selecione o Evento
                </label>
                <div className="space-y-3">
                  {events.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => setSelectedEvent(event.id)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        selectedEvent === event.id
                          ? 'border-white dark:border-white bg-muted dark:bg-[#0d0d0d]'
                          : 'border-border dark:border-[rgba(255,255,255,0.1)] hover:border-[#3a3a3a]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="text-foreground dark:text-white font-medium mb-2">
                            {event.name}
                          </h4>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground dark:text-[#99a1af]">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              {event.date.split('-').reverse().join('/')}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4" />
                              {event.location}
                            </div>
                          </div>
                        </div>
                        {selectedEvent === event.id && (
                          <div className="w-6 h-6 bg-white dark:bg-white rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 text-[#1a1a1a]" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Passo 2: Selecionar Animais */}
          {step === 'animals' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground dark:text-white mb-3">
                  Selecione os Animais ({selectedAnimals.length} selecionado{selectedAnimals.length !== 1 ? 's' : ''})
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {animals.map((animal) => (
                    <button
                      key={animal.id}
                      onClick={() => toggleAnimal(animal.id)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        selectedAnimals.includes(animal.id)
                          ? 'border-white dark:border-white bg-muted dark:bg-[#0d0d0d]'
                          : 'border-border dark:border-[rgba(255,255,255,0.1)] hover:border-[#3a3a3a]'
                      }`}
                    >
                      <div className="relative">
                        {/* Foto do Animal (Placeholder) */}
                        <div className="w-full aspect-square bg-muted dark:bg-[#3a3a3a] rounded-lg mb-3 flex items-center justify-center">
                          <div className="w-12 h-12 bg-[#6b7280] rounded-full" />
                        </div>
                        
                        {selectedAnimals.includes(animal.id) && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-white dark:bg-white rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-[#1a1a1a]" />
                          </div>
                        )}
                      </div>
                      
                      <h5 className="text-sm font-medium text-foreground dark:text-white mb-1">
                        {animal.name}
                      </h5>
                      <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">
                        Reg: {animal.registry}
                      </p>
                      <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
                        {animal.category}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Passo 3: Detalhes */}
          {step === 'details' && (
            <div className="space-y-6">
              {/* Tropa */}
              <div>
                <label className="block text-sm font-medium text-foreground dark:text-white mb-3">
                  Tropa
                </label>
                
                {!showNewTropa ? (
                  <>
                    <select
                      value={selectedTropa}
                      onChange={(e) => setSelectedTropa(e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white mb-3"
                    >
                      <option value="">Selecione uma tropa</option>
                      {tropas.map((tropa) => (
                        <option key={tropa.id} value={tropa.id}>
                          {tropa.name} ({tropa.animalCount} animais)
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => setShowNewTropa(true)}
                      className="text-sm text-foreground dark:text-white hover:underline flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Criar nova tropa
                    </button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={newTropaName}
                      onChange={(e) => setNewTropaName(e.target.value)}
                      placeholder="Nome da nova tropa"
                      className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af]"
                    />
                    <button
                      onClick={() => {
                        setShowNewTropa(false);
                        setNewTropaName('');
                      }}
                      className="text-sm text-muted-foreground dark:text-[#99a1af] hover:underline"
                    >
                      Usar tropa existente
                    </button>
                  </div>
                )}
              </div>

              {/* Apresentador/Criador */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                    Apresentador
                  </label>
                  <input
                    type="text"
                    value={presenter}
                    onChange={(e) => setPresenter(e.target.value)}
                    placeholder="Nome do apresentador"
                    className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                    Criador
                  </label>
                  <input
                    type="text"
                    value={breeder}
                    onChange={(e) => setBreeder(e.target.value)}
                    placeholder="Nome do criador"
                    className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af]"
                  />
                </div>
              </div>

              {/* Observações */}
              <div>
                <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                  Observações
                </label>
                <textarea
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  rows={4}
                  placeholder="Informações adicionais sobre a participação..."
                  className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] resize-none"
                />
              </div>
            </div>
          )}

          {/* Passo 4: Confirmação */}
          {step === 'confirmation' && selectedEventData && (
            <div className="space-y-6">
              <div className="bg-muted dark:bg-[#0d0d0d] rounded-xl p-4 border border-border dark:border-[rgba(255,255,255,0.1)]">
                <h4 className="text-sm font-medium text-foreground dark:text-white mb-3">
                  Resumo da Participação
                </h4>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Evento</p>
                    <p className="text-sm text-foreground dark:text-white">{selectedEventData.name}</p>
                    <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
                      {selectedEventData.date.split('-').reverse().join('/')} • {selectedEventData.location}
                    </p>
                  </div>

                  <div className="border-t border-border dark:border-[rgba(255,255,255,0.1)] pt-3">
                    <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-2">
                      Animais Selecionados ({selectedAnimalsData.length})
                    </p>
                    <div className="space-y-1.5">
                      {selectedAnimalsData.map((animal) => (
                        <div key={animal.id} className="flex items-center justify-between text-sm">
                          <span className="text-foreground dark:text-white">{animal.name}</span>
                          <span className="text-muted-foreground dark:text-[#99a1af]">{animal.category}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {(selectedTropa || newTropaName) && (
                    <div className="border-t border-border dark:border-[rgba(255,255,255,0.1)] pt-3">
                      <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Tropa</p>
                      <p className="text-sm text-foreground dark:text-white">
                        {showNewTropa ? newTropaName : tropas.find(t => t.id === selectedTropa)?.name}
                      </p>
                    </div>
                  )}

                  {(presenter || breeder) && (
                    <div className="border-t border-border dark:border-[rgba(255,255,255,0.1)] pt-3 grid grid-cols-2 gap-4">
                      {presenter && (
                        <div>
                          <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Apresentador</p>
                          <p className="text-sm text-foreground dark:text-white">{presenter}</p>
                        </div>
                      )}
                      {breeder && (
                        <div>
                          <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Criador</p>
                          <p className="text-sm text-foreground dark:text-white">{breeder}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-1">
                      Confirmação de Participação
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                      Ao confirmar, os animais serão registrados para o evento. Certifique-se de que todos os dados estão corretos antes de prosseguir.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-[#1a1a1a] border-t border-border dark:border-[rgba(255,255,255,0.1)] p-6">
          <div className="flex gap-3">
            {step !== 'event' && (
              <button
                onClick={() => {
                  if (step === 'animals') setStep('event');
                  else if (step === 'details') setStep('animals');
                  else if (step === 'confirmation') setStep('details');
                }}
                className="px-6 py-3 border border-border dark:border-[#333333] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
              >
                Voltar
              </button>
            )}
            <button
              onClick={onClose}
              className="px-6 py-3 border border-border dark:border-[#333333] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={step === 'confirmation' ? handleConfirm : handleNext}
              disabled={
                (step === 'event' && !selectedEvent) ||
                (step === 'animals' && selectedAnimals.length === 0)
              }
              className="flex-1 px-6 py-3 bg-white dark:bg-white text-[#1a1a1a] rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {step === 'confirmation' ? 'Confirmar Participação' : 'Continuar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}