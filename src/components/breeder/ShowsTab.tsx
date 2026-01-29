import { useState } from 'react';
import { Plus, Calendar, MapPin, Trophy, AlertCircle, Download, Upload } from 'lucide-react';
import { NativeSelect } from '../ui/native-select';
import { ShowCard } from './ShowCard';

interface Show {
  id: string;
  name: string;
  date: string;
  endDate?: string;
  location: string;
  city: string;
  state: string;
  type: 'exposicao' | 'campeonato' | 'prova-funcional' | 'julgamento';
  status: 'inscricoes-abertas' | 'confirmado' | 'em-andamento' | 'concluido' | 'cancelado';
  organizer: string;
  registeredAnimals: number;
  totalAnimals?: number;
  results?: boolean;
  abccmmCode?: string;
}

export function ShowsTab() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);

  const shows: Show[] = [
    {
      id: '1',
      name: 'Exposição Nacional de Mangalarga Marchador',
      date: '2025-03-15',
      endDate: '2025-03-17',
      location: 'Parque de Exposições',
      city: 'Belo Horizonte',
      state: 'MG',
      type: 'exposicao',
      status: 'inscricoes-abertas',
      organizer: 'ABCCMM',
      registeredAnimals: 3,
      totalAnimals: 250,
      abccmmCode: 'EXPO-MG-2025-001',
    },
    {
      id: '2',
      name: 'Campeonato Regional Sul de Minas',
      date: '2025-02-20',
      endDate: '2025-02-22',
      location: 'Haras Vale Verde',
      city: 'Pouso Alegre',
      state: 'MG',
      type: 'campeonato',
      status: 'confirmado',
      organizer: 'Associação Regional',
      registeredAnimals: 2,
      totalAnimals: 150,
      abccmmCode: 'CAMP-MG-2025-003',
    },
    {
      id: '3',
      name: 'Prova Funcional de Marcha',
      date: '2025-01-30',
      location: 'Centro Hípico Municipal',
      city: 'Três Corações',
      state: 'MG',
      type: 'prova-funcional',
      status: 'em-andamento',
      organizer: 'Prefeitura Municipal',
      registeredAnimals: 1,
      totalAnimals: 80,
    },
    {
      id: '4',
      name: 'Exposição de Outono ABCCMM',
      date: '2024-11-10',
      endDate: '2024-11-12',
      location: 'Parque de Exposições',
      city: 'Belo Horizonte',
      state: 'MG',
      type: 'exposicao',
      status: 'concluido',
      organizer: 'ABCCMM',
      registeredAnimals: 4,
      totalAnimals: 300,
      results: true,
      abccmmCode: 'EXPO-MG-2024-012',
    },
    {
      id: '5',
      name: 'Julgamento de Categoria Júnior',
      date: '2025-04-05',
      location: 'Haras Santa Clara',
      city: 'Varginha',
      state: 'MG',
      type: 'julgamento',
      status: 'inscricoes-abertas',
      organizer: 'Haras Santa Clara',
      registeredAnimals: 0,
      totalAnimals: 50,
    },
  ];

  const filteredShows = shows.filter((show) => {
    if (selectedType && show.type !== selectedType) return false;
    if (selectedStatus && show.status !== selectedStatus) return false;
    return true;
  });

  const upcomingShows = filteredShows.filter(
    (show) => show.status !== 'concluido' && show.status !== 'cancelado'
  );
  const pastShows = filteredShows.filter(
    (show) => show.status === 'concluido' || show.status === 'cancelado'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl text-foreground dark:text-white">Pistas e Exposições</h3>
          <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-1">
            {filteredShows.length} {filteredShows.length === 1 ? 'evento' : 'eventos'} cadastrado(s)
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2 border border-border dark:border-[#333333] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Importar ABCCMM
          </button>
          <button
            className="px-6 py-3 bg-white dark:bg-white text-[#1a1a1a] rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Registrar Participação
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-muted-foreground dark:text-[#99a1af] mb-2 block">
            Tipo de Evento
          </label>
          <NativeSelect
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full h-10 bg-muted dark:bg-[#3a3a3a] border-0 text-foreground dark:text-white rounded-lg"
          >
            <option value="">Todos os tipos</option>
            <option value="exposicao">Exposição</option>
            <option value="campeonato">Campeonato</option>
            <option value="prova-funcional">Prova Funcional</option>
            <option value="julgamento">Julgamento</option>
          </NativeSelect>
        </div>

        <div>
          <label className="text-sm text-muted-foreground dark:text-[#99a1af] mb-2 block">
            Status
          </label>
          <NativeSelect
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full h-10 bg-muted dark:bg-[#3a3a3a] border-0 text-foreground dark:text-white rounded-lg"
          >
            <option value="">Todos os status</option>
            <option value="inscricoes-abertas">Inscrições Abertas</option>
            <option value="confirmado">Confirmado</option>
            <option value="em-andamento">Em Andamento</option>
            <option value="concluido">Concluído</option>
            <option value="cancelado">Cancelado</option>
          </NativeSelect>
        </div>

        <div>
          <label className="text-sm text-muted-foreground dark:text-[#99a1af] mb-2 block">
            Período
          </label>
          <NativeSelect
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full h-10 bg-muted dark:bg-[#3a3a3a] border-0 text-foreground dark:text-white rounded-lg"
          >
            <option value="">Todos os períodos</option>
            <option value="proximos-30">Próximos 30 dias</option>
            <option value="proximos-60">Próximos 60 dias</option>
            <option value="proximos-90">Próximos 90 dias</option>
            <option value="passados">Eventos passados</option>
          </NativeSelect>
        </div>
      </div>

      {/* Estado Vazio */}
      {filteredShows.length === 0 && (
        <div className="bg-muted dark:bg-[#0d0d0d] rounded-2xl p-12 text-center border border-border dark:border-[rgba(255,255,255,0.1)]">
          <Trophy className="w-16 h-16 text-muted-foreground dark:text-[#99a1af] mx-auto mb-4" />
          <h4 className="text-lg text-foreground dark:text-white mb-2">
            Nenhuma exposição encontrada
          </h4>
          <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-6 max-w-md mx-auto">
            Você ainda não tem eventos cadastrados. Importe eventos diretamente da ABCCMM ou registre sua participação manualmente.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setShowImportModal(true)}
              className="px-6 py-3 border border-border dark:border-[#333333] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Importar da ABCCMM
            </button>
            <button className="px-6 py-3 bg-white dark:bg-white text-[#1a1a1a] rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Registrar Participação
            </button>
          </div>
        </div>
      )}

      {/* Lista de Eventos Futuros */}
      {upcomingShows.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-foreground dark:text-white" />
            <h4 className="text-lg text-foreground dark:text-white font-medium">
              Próximos Eventos
            </h4>
            <span className="px-2 py-0.5 bg-muted dark:bg-[#3a3a3a] text-muted-foreground dark:text-[#99a1af] rounded-full text-xs">
              {upcomingShows.length}
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {upcomingShows.map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        </div>
      )}

      {/* Lista de Eventos Passados */}
      {pastShows.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-foreground dark:text-white" />
            <h4 className="text-lg text-foreground dark:text-white font-medium">
              Eventos Anteriores
            </h4>
            <span className="px-2 py-0.5 bg-muted dark:bg-[#3a3a3a] text-muted-foreground dark:text-[#99a1af] rounded-full text-xs">
              {pastShows.length}
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pastShows.map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        </div>
      )}

      {/* Modal de Importação ABCCMM */}
      {showImportModal && (
        <ImportABCCMMModal onClose={() => setShowImportModal(false)} />
      )}
    </div>
  );
}

// Modal de Importação ABCCMM
function ImportABCCMMModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl w-full max-w-lg border border-border dark:border-[rgba(255,255,255,0.1)]">
        <div className="p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl text-foreground dark:text-white">Importar Eventos ABCCMM</h3>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-1">
                Sincronize eventos oficiais da ABCCMM
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-muted dark:bg-[#0d0d0d] rounded-xl p-4 border border-border dark:border-[rgba(255,255,255,0.1)]">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-muted-foreground dark:text-[#99a1af] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-foreground dark:text-white font-medium mb-1">
                  Funcionalidade em Desenvolvimento
                </p>
                <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
                  A integração com a API da ABCCMM estará disponível em breve. Por enquanto, registre suas participações manualmente.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
              Período de Importação
            </label>
            <NativeSelect>
              <option>Próximos 3 meses</option>
              <option>Próximos 6 meses</option>
              <option>Próximo ano</option>
              <option>Todos os eventos futuros</option>
            </NativeSelect>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
              Estado
            </label>
            <NativeSelect>
              <option value="">Todos os estados</option>
              <option value="MG">Minas Gerais</option>
              <option value="SP">São Paulo</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="ES">Espírito Santo</option>
            </NativeSelect>
          </div>
        </div>

        <div className="p-6 border-t border-border dark:border-[rgba(255,255,255,0.1)] flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-border dark:border-[#333333] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onClose}
            disabled
            className="flex-1 px-6 py-3 bg-muted dark:bg-[#3a3a3a] text-muted-foreground dark:text-[#99a1af] rounded-lg cursor-not-allowed opacity-60"
          >
            Importar (Em breve)
          </button>
        </div>
      </div>
    </div>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}