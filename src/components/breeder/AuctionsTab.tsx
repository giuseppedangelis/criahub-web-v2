import { useState } from 'react';
import { Plus, Gavel, Calendar, MapPin, DollarSign, Users, TrendingUp, Eye, Download } from 'lucide-react';
import { NativeSelect } from '../ui/native-select';
import { AuctionCard } from './AuctionCard';

interface Auction {
  id: string;
  name: string;
  date: string;
  location: string;
  city: string;
  state: string;
  organizer: string;
  type: 'presencial' | 'online' | 'hibrido';
  status: 'inscricoes-abertas' | 'confirmado' | 'em-andamento' | 'concluido' | 'cancelado';
  registeredAnimals: number;
  totalLots?: number;
  commission?: number;
  website?: string;
  results?: boolean;
}

export function AuctionsTab() {
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const auctions: Auction[] = [
    {
      id: '1',
      name: 'Grande Leilão Virtual Mangalarga Marchador',
      date: '2025-04-15',
      location: 'Plataforma Online',
      city: 'Belo Horizonte',
      state: 'MG',
      organizer: 'Leilões BH',
      type: 'online',
      status: 'inscricoes-abertas',
      registeredAnimals: 2,
      totalLots: 120,
      commission: 5,
      website: 'www.leiloesmarcha.com.br',
    },
    {
      id: '2',
      name: 'Leilão Elite do Haras Santa Clara',
      date: '2025-03-22',
      location: 'Haras Santa Clara',
      city: 'Varginha',
      state: 'MG',
      organizer: 'Haras Santa Clara',
      type: 'presencial',
      status: 'confirmado',
      registeredAnimals: 3,
      totalLots: 85,
      commission: 4,
    },
    {
      id: '3',
      name: 'Mega Leilão ABCCMM 2025',
      date: '2025-05-10',
      location: 'Parque de Exposições',
      city: 'Belo Horizonte',
      state: 'MG',
      organizer: 'ABCCMM',
      type: 'hibrido',
      status: 'inscricoes-abertas',
      registeredAnimals: 1,
      totalLots: 200,
      commission: 6,
      website: 'www.abccmm.org.br/leilao',
    },
    {
      id: '4',
      name: 'Leilão de Potros Jovens',
      date: '2024-12-05',
      location: 'Haras Vale Verde',
      city: 'Pouso Alegre',
      state: 'MG',
      organizer: 'Haras Vale Verde',
      type: 'presencial',
      status: 'concluido',
      registeredAnimals: 2,
      totalLots: 60,
      commission: 5,
      results: true,
    },
  ];

  const filteredAuctions = auctions.filter((auction) => {
    if (selectedType && auction.type !== selectedType) return false;
    if (selectedStatus && auction.status !== selectedStatus) return false;
    return true;
  });

  const upcomingAuctions = filteredAuctions.filter(
    (a) => a.status !== 'concluido' && a.status !== 'cancelado'
  );
  const pastAuctions = filteredAuctions.filter(
    (a) => a.status === 'concluido' || a.status === 'cancelado'
  );

  // Estatísticas
  const totalRegistered = auctions.reduce((sum, a) => sum + a.registeredAnimals, 0);
  const totalUpcoming = upcomingAuctions.length;
  const avgCommission = auctions.filter(a => a.commission).reduce((sum, a) => sum + (a.commission || 0), 0) / auctions.filter(a => a.commission).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl text-foreground dark:text-white">Leilões</h3>
          <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-1">
            {filteredAuctions.length} {filteredAuctions.length === 1 ? 'leilão' : 'leilões'} cadastrado(s)
          </p>
        </div>
        <button className="px-6 py-3 bg-white dark:bg-white text-[#1a1a1a] rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Registrar Animal
        </button>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card dark:bg-[#1a1a1a] rounded-xl p-4 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <Gavel className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground dark:text-white">{totalUpcoming}</p>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Próximos Leilões</p>
            </div>
          </div>
        </div>

        <div className="bg-card dark:bg-[#1a1a1a] rounded-xl p-4 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground dark:text-white">{totalRegistered}</p>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Animais Registrados</p>
            </div>
          </div>
        </div>

        <div className="bg-card dark:bg-[#1a1a1a] rounded-xl p-4 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground dark:text-white">{avgCommission.toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Comissão Média</p>
            </div>
          </div>
        </div>

        <div className="bg-card dark:bg-[#1a1a1a] rounded-xl p-4 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground dark:text-white">{pastAuctions.length}</p>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Concluídos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-muted-foreground dark:text-[#99a1af] mb-2 block">
            Tipo de Leilão
          </label>
          <NativeSelect
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full h-10 bg-muted dark:bg-[#3a3a3a] border-0 text-foreground dark:text-white rounded-lg"
          >
            <option value="">Todos os tipos</option>
            <option value="presencial">Presencial</option>
            <option value="online">Online</option>
            <option value="hibrido">Híbrido</option>
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
            <option value="passados">Leilões passados</option>
          </NativeSelect>
        </div>
      </div>

      {/* Estado Vazio */}
      {filteredAuctions.length === 0 && (
        <div className="bg-muted dark:bg-[#0d0d0d] rounded-2xl p-12 text-center border border-border dark:border-[rgba(255,255,255,0.1)]">
          <Gavel className="w-16 h-16 text-muted-foreground dark:text-[#99a1af] mx-auto mb-4" />
          <h4 className="text-lg text-foreground dark:text-white mb-2">
            Nenhum leilão encontrado
          </h4>
          <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-6 max-w-md mx-auto">
            Você ainda não tem leilões cadastrados. Registre seus animais em leilões para começar.
          </p>
          <button className="px-6 py-3 bg-white dark:bg-white text-[#1a1a1a] rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto">
            <Plus className="w-5 h-5" />
            Registrar Animal no Leilão
          </button>
        </div>
      )}

      {/* Lista de Leilões Futuros */}
      {upcomingAuctions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-foreground dark:text-white" />
            <h4 className="text-lg text-foreground dark:text-white font-medium">
              Próximos Leilões
            </h4>
            <span className="px-2 py-0.5 bg-muted dark:bg-[#3a3a3a] text-muted-foreground dark:text-[#99a1af] rounded-full text-xs">
              {upcomingAuctions.length}
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {upcomingAuctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        </div>
      )}

      {/* Lista de Leilões Passados */}
      {pastAuctions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Gavel className="w-5 h-5 text-foreground dark:text-white" />
            <h4 className="text-lg text-foreground dark:text-white font-medium">
              Leilões Anteriores
            </h4>
            <span className="px-2 py-0.5 bg-muted dark:bg-[#3a3a3a] text-muted-foreground dark:text-[#99a1af] rounded-full text-xs">
              {pastAuctions.length}
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pastAuctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
