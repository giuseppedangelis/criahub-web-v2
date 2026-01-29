import { Search, ChevronRight, Camera } from 'lucide-react';
import { useState } from 'react';

export function PeonHerdContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAnimalDetails, setShowAnimalDetails] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<any>(null);

  const animals = [
    { id: 1, name: 'Estrela Mangalarga', registry: 'MM-2020-1234', status: 'Gestante' },
    { id: 2, name: 'Relâmpago Negro', registry: 'MM-2018-5678', status: 'Reprodutor' },
    { id: 3, name: 'Lua Dourada', registry: 'MM-2019-9012', status: 'Em Cobertura' },
    { id: 4, name: 'Vento Sul', registry: 'MM-2023-3456', status: 'Potro' },
    { id: 5, name: 'Bella Vista', registry: 'MM-2021-7890', status: 'Ativo' },
    { id: 6, name: 'Trovão Branco', registry: 'MM-2019-2468', status: 'Reprodutor' },
    { id: 7, name: 'Noite Estrelada', registry: 'MM-2022-1357', status: 'Potra' },
    { id: 8, name: 'Sol Nascente', registry: 'MM-2020-9876', status: 'Gestante' },
  ];

  const filteredAnimals = animals.filter(animal =>
    animal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    animal.registry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <div>
        <h2 className="text-2xl text-foreground dark:text-white mb-1">Plantel</h2>
        <p className="text-muted-foreground dark:text-[#99a1af]">
          {animals.length} animais cadastrados
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
        <input
          type="text"
          placeholder="Buscar por nome ou registro..."
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
            onClick={() => {
              setSelectedAnimal(animal);
              setShowAnimalDetails(true);
            }}
            className="w-full flex items-center gap-3 p-3 bg-card dark:bg-[#1a1a1a] rounded-lg border border-border dark:border-[rgba(255,255,255,0.1)] hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
          >
            <div className="w-16 h-16 bg-primary/20 dark:bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Camera className="w-6 h-6 text-primary dark:text-white opacity-50" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-foreground dark:text-white mb-1">{animal.name}</p>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af]">{animal.registry}</p>
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

      {/* Animal Details Modal */}
      {showAnimalDetails && selectedAnimal && (
        <AnimalDetailsModal
          animal={selectedAnimal}
          onClose={() => {
            setShowAnimalDetails(false);
            setSelectedAnimal(null);
          }}
        />
      )}
    </div>
  );
}

function AnimalDetailsModal({ animal, onClose }: any) {
  const [activeTab, setActiveTab] = useState('breeder');

  const tabs = [
    { id: 'breeder', label: 'Criador' },
    { id: 'partnership', label: 'Sociedade' },
    { id: 'genealogy', label: 'Genealogia' },
    { id: 'history', label: 'Histórico' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-card dark:bg-[#1a1a1a] rounded-t-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-border dark:border-[rgba(255,255,255,0.1)] flex items-center justify-between">
          <div>
            <h3 className="text-xl text-foreground dark:text-white">{animal.name}</h3>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">{animal.registry}</p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-border dark:border-[rgba(255,255,255,0.1)]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[100px] px-4 py-3 text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'text-foreground dark:text-white border-b-2 border-primary dark:border-white'
                  : 'text-muted-foreground dark:text-[#99a1af]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4">
          {activeTab === 'breeder' && (
            <div className="space-y-4">
              {/* Image Carousel */}
              <div className="w-full h-48 bg-primary/20 dark:bg-white/10 rounded-lg flex items-center justify-center">
                <Camera className="w-12 h-12 text-primary dark:text-white opacity-50" />
              </div>

              <div className="space-y-3">
                <InfoRow label="Status de Manejo" value={animal.status} />
                <InfoRow label="Registro" value={animal.registry} />
                <InfoRow label="Valor de Pedida" value="R$ 5.000" />
                <InfoRow label="Haras Responsável" value="Vale Verde" />
                <InfoRow label="Proprietário" value="Carlos Eduardo Silva" />
                <InfoRow label="Data de Nascimento" value="15/01/2020" />
                <InfoRow label="Tipo" value="Mangalarga Marchador" />
              </div>
            </div>
          )}

          {activeTab === 'partnership' && (
            <div className="space-y-4">
              <div className="p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
                <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-2">
                  Total de Sócios
                </p>
                <p className="text-2xl text-foreground dark:text-white">3 sócios</p>
              </div>
              <div className="space-y-2">
                <PartnerRow name="Carlos Eduardo Silva" percentage="50%" />
                <PartnerRow name="João Pedro Costa" percentage="30%" />
                <PartnerRow name="Maria Santos" percentage="20%" />
              </div>
            </div>
          )}

          {activeTab === 'genealogy' && (
            <div className="space-y-4">
              <div className="p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg text-center">
                <p className="text-foreground dark:text-white mb-2">{animal.name}</p>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">{animal.registry}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted dark:bg-[#0d0d0d] rounded-lg">
                  <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Pai</p>
                  <p className="text-sm text-foreground dark:text-white">Trovão Branco</p>
                </div>
                <div className="p-3 bg-muted dark:bg-[#0d0d0d] rounded-lg">
                  <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Mãe</p>
                  <p className="text-sm text-foreground dark:text-white">Bella Vista</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              <HistoryRow label="Última Vacina" value="Antirrábica - 15/10/2024" />
              <HistoryRow label="Último Tratamento" value="Casqueamento - 10/11/2024" />
              <HistoryRow label="Confirmação de Gestação" value="45 dias - 01/11/2024" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
      <span className="text-sm text-muted-foreground dark:text-[#99a1af]">{label}</span>
      <span className="text-sm text-foreground dark:text-white">{value}</span>
    </div>
  );
}

function PartnerRow({ name, percentage }: { name: string; percentage: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-muted dark:bg-[#0d0d0d] rounded-lg">
      <span className="text-foreground dark:text-white">{name}</span>
      <span className="text-primary dark:text-white">{percentage}</span>
    </div>
  );
}

function HistoryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 bg-muted dark:bg-[#0d0d0d] rounded-lg">
      <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">{label}</p>
      <p className="text-foreground dark:text-white">{value}</p>
    </div>
  );
}
