import { Wrench, Trophy, X } from 'lucide-react';
import { useState } from 'react';
import { AddServiceModal } from './AddServiceModal';
import { AddPublicEventModal } from './AddPublicEventModal';

interface AddServiceEventModalProps {
  onClose: () => void;
  initialType?: 'service' | 'event';
}

export function AddServiceEventModal({ onClose, initialType }: AddServiceEventModalProps) {
  const [selectedType, setSelectedType] = useState<'service' | 'event' | null>(initialType || null);

  if (selectedType === 'service') {
    return <AddServiceModal onClose={onClose} onBack={() => setSelectedType(null)} />;
  }

  if (selectedType === 'event') {
    return <AddPublicEventModal onClose={onClose} onBack={() => setSelectedType(null)} />;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 max-w-md w-full border border-border dark:border-[rgba(255,255,255,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl text-foreground dark:text-white">O que deseja adicionar?</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Opção: Serviço Interno */}
          <button
            onClick={() => setSelectedType('service')}
            className="w-full p-6 bg-background dark:bg-[#0d0d0d] border-2 border-border dark:border-[#3a3a3a] hover:border-primary dark:hover:border-white rounded-xl transition-all text-left group"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-muted dark:bg-[#1a1a1a] rounded-lg group-hover:bg-primary dark:group-hover:bg-white transition-colors">
                <Wrench className="w-6 h-6 text-foreground dark:text-white group-hover:text-white dark:group-hover:text-black" />
              </div>
              <div>
                <h3 className="text-foreground dark:text-white mb-1">Serviço Interno</h3>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                  Operações do haras: vacinações, atendimentos veterinários, coberturas, exames, casqueamento, partos
                </p>
              </div>
            </div>
          </button>

          {/* Opção: Evento Público */}
          <button
            onClick={() => setSelectedType('event')}
            className="w-full p-6 bg-background dark:bg-[#0d0d0d] border-2 border-border dark:border-[#3a3a3a] hover:border-primary dark:hover:border-white rounded-xl transition-all text-left group"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-muted dark:bg-[#1a1a1a] rounded-lg group-hover:bg-primary dark:group-hover:bg-white transition-colors">
                <Trophy className="w-6 h-6 text-foreground dark:text-white group-hover:text-white dark:group-hover:text-black" />
              </div>
              <div>
                <h3 className="text-foreground dark:text-white mb-1">Evento Público</h3>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                  Atividades externas: leilões, exposições, pistas, provas de marcha, competições
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
