import { Search, Camera, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export function VetHerdContent() {
  const [searchQuery, setSearchQuery] = useState('');

  const animals = [
    { id: 1, name: 'Estrela Mangalarga', status: 'Gestante - 45 dias', statusColor: 'bg-pink-500' },
    { id: 2, name: 'Relâmpago Negro', status: 'Saudável', statusColor: 'bg-green-500' },
    { id: 3, name: 'Lua Dourada', status: 'Em tratamento', statusColor: 'bg-yellow-500' },
    { id: 4, name: 'Vento Sul', status: 'Vacinação em dia', statusColor: 'bg-blue-500' },
    { id: 5, name: 'Bella Vista', status: 'Aguardando exame', statusColor: 'bg-yellow-500' },
    { id: 6, name: 'Trovão Branco', status: 'Saudável', statusColor: 'bg-green-500' },
  ];

  const filteredAnimals = animals.filter(animal =>
    animal.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <div>
        <h2 className="text-2xl text-foreground dark:text-white mb-1">Plantel</h2>
        <p className="text-muted-foreground dark:text-[#99a1af]">
          Acesso rápido aos animais
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
        <input
          type="text"
          placeholder="Buscar animal..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
        />
      </div>

      {/* Animal List */}
      <div className="space-y-2">
        {filteredAnimals.map((animal) => (
          <button
            key={animal.id}
            className="w-full flex items-center gap-3 p-3 bg-card dark:bg-[#1a1a1a] rounded-lg border border-border dark:border-[rgba(255,255,255,0.1)] hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
          >
            <div className="w-16 h-16 bg-primary/20 dark:bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Camera className="w-6 h-6 text-primary dark:text-white opacity-50" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-foreground dark:text-white mb-1">{animal.name}</p>
              <span className={`${animal.statusColor} text-white text-xs px-2 py-1 rounded`}>
                {animal.status}
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground dark:text-[#99a1af] flex-shrink-0" />
          </button>
        ))}
      </div>

      {filteredAnimals.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-muted-foreground dark:text-[#99a1af] mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground dark:text-[#99a1af]">
            Nenhum animal encontrado
          </p>
        </div>
      )}
    </div>
  );
}
