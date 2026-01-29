import { Camera, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export function PeonPregnanciesContent() {
  const [showBirthModal, setShowBirthModal] = useState(false);
  const [selectedPregnancy, setSelectedPregnancy] = useState<any>(null);

  const pregnancies = [
    {
      id: 1,
      mare: 'Bella Vista',
      sire: 'Relâmpago Negro',
      progress: 95,
      dueDate: '20/11/2024',
      daysPregnant: 320,
      status: 'Em acompanhamento',
    },
    {
      id: 2,
      mare: 'Estrela Mangalarga',
      sire: 'Trovão Branco',
      progress: 88,
      dueDate: '25/11/2024',
      daysPregnant: 295,
      status: 'Confirmada',
    },
    {
      id: 3,
      mare: 'Lua Dourada',
      sire: 'Relâmpago Negro',
      progress: 75,
      dueDate: '05/12/2024',
      daysPregnant: 252,
      status: 'Confirmada',
    },
    {
      id: 4,
      mare: 'Sol Nascente',
      sire: 'Trovão Branco',
      progress: 45,
      dueDate: '15/01/2025',
      daysPregnant: 150,
      status: 'Aguardando confirmação',
    },
    {
      id: 5,
      mare: 'Noite Estrelada',
      sire: 'Vento Sul',
      progress: 15,
      dueDate: '28/02/2025',
      daysPregnant: 50,
      status: 'Aguardando confirmação',
    },
  ];

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <div>
        <h2 className="text-2xl text-foreground dark:text-white mb-1">Gestações</h2>
        <p className="text-muted-foreground dark:text-[#99a1af]">
          {pregnancies.length} éguas em acompanhamento
        </p>
      </div>

      <div className="space-y-3">
        {pregnancies.map((pregnancy) => (
          <button
            key={pregnancy.id}
            onClick={() => {
              setSelectedPregnancy(pregnancy);
              setShowBirthModal(true);
            }}
            className="w-full bg-card dark:bg-[#1a1a1a] rounded-xl p-4 border border-border dark:border-[rgba(255,255,255,0.1)] hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors text-left"
          >
            {/* Image placeholder */}
            <div className="w-full h-32 bg-primary/20 dark:bg-white/10 rounded-lg mb-3 flex items-center justify-center">
              <Camera className="w-8 h-8 text-primary dark:text-white opacity-50" />
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-lg text-foreground dark:text-white mb-1">{pregnancy.mare}</p>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                  Pai: {pregnancy.sire}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground dark:text-[#99a1af]">Progresso</span>
                  <span className="text-foreground dark:text-white">{pregnancy.progress}%</span>
                </div>
                <div className="w-full bg-muted dark:bg-[#0d0d0d] rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getProgressColor(pregnancy.progress)}`}
                    style={{ width: `${pregnancy.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                    Parto estimado
                  </p>
                  <p className="text-foreground dark:text-white">{pregnancy.dueDate}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  pregnancy.status === 'Em acompanhamento' ? 'bg-blue-500/20 text-blue-500' :
                  pregnancy.status === 'Confirmada' ? 'bg-green-500/20 text-green-500' :
                  'bg-yellow-500/20 text-yellow-500'
                }`}>
                  {pregnancy.status}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Birth Registration Modal */}
      {showBirthModal && selectedPregnancy && (
        <BirthRegistrationModal
          pregnancy={selectedPregnancy}
          onClose={() => {
            setShowBirthModal(false);
            setSelectedPregnancy(null);
          }}
        />
      )}
    </div>
  );
}

function BirthRegistrationModal({ pregnancy, onClose }: any) {
  const [sex, setSex] = useState('');
  const [observations, setObservations] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-card dark:bg-[#1a1a1a] rounded-t-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-border dark:border-[rgba(255,255,255,0.1)] flex items-center justify-between">
          <h3 className="text-xl text-foreground dark:text-white">Registrar Nascimento</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="p-3 bg-muted dark:bg-[#0d0d0d] rounded-lg">
            <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Receptora/Matriz</p>
            <p className="text-foreground dark:text-white">{pregnancy.mare}</p>
          </div>

          <div className="p-3 bg-muted dark:bg-[#0d0d0d] rounded-lg">
            <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Pai</p>
            <p className="text-foreground dark:text-white">{pregnancy.sire}</p>
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Sexo <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSex('Macho')}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  sex === 'Macho'
                    ? 'border-primary dark:border-white bg-primary/10 dark:bg-white/10'
                    : 'border-border dark:border-[rgba(255,255,255,0.1)]'
                }`}
              >
                <span className="text-foreground dark:text-white">Macho</span>
              </button>
              <button
                onClick={() => setSex('Fêmea')}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  sex === 'Fêmea'
                    ? 'border-primary dark:border-white bg-primary/10 dark:bg-white/10'
                    : 'border-border dark:border-[rgba(255,255,255,0.1)]'
                }`}
              >
                <span className="text-foreground dark:text-white">Fêmea</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">Observações</label>
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              className="w-full px-4 py-3 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
              rows={4}
              placeholder="Detalhes sobre o nascimento..."
            />
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Fotos <span className="text-red-500">*</span>
            </label>
            <button className="w-full p-8 border-2 border-dashed border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors">
              <Camera className="w-8 h-8 text-muted-foreground dark:text-[#99a1af] mx-auto mb-2" />
              <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                Tirar foto do potro
              </p>
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-border dark:border-[rgba(255,255,255,0.1)] flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white rounded-lg hover:bg-accent dark:hover:bg-[#2a2a2a] transition-colors"
          >
            Cancelar
          </button>
          <button
            disabled={!sex}
            className="flex-1 px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirmar Nascimento
          </button>
        </div>
      </div>
    </div>
  );
}
