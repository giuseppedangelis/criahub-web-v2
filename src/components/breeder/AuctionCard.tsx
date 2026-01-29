import { Calendar, MapPin, Users, Gavel, Eye, DollarSign, Globe, Monitor, Building2, RefreshCw } from 'lucide-react';

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

interface AuctionCardProps {
  auction: Auction;
}

export function AuctionCard({ auction }: AuctionCardProps) {
  const statusConfig = {
    'inscricoes-abertas': { label: 'Inscrições Abertas', color: 'bg-emerald-500', textColor: 'text-white' },
    'confirmado': { label: 'Confirmado', color: 'bg-blue-500', textColor: 'text-white' },
    'em-andamento': { label: 'Em Andamento', color: 'bg-amber-500', textColor: 'text-white' },
    'concluido': { label: 'Concluído', color: 'bg-[#6b7280]', textColor: 'text-white' },
    'cancelado': { label: 'Cancelado', color: 'bg-[#e74c3c]', textColor: 'text-white' },
  };

  const typeConfig = {
    'presencial': { label: 'Presencial', Icon: Building2 },
    'online': { label: 'Online', Icon: Monitor },
    'hibrido': { label: 'Híbrido', Icon: RefreshCw },
  };

  const config = statusConfig[auction.status];
  const typeInfo = typeConfig[auction.type];

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)] hover:border-[#3a3a3a] transition-all space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <typeInfo.Icon className="w-4 h-4 text-muted-foreground dark:text-[#99a1af] mt-0.5 flex-shrink-0" />
            <span className="text-xs text-muted-foreground dark:text-[#99a1af]">
              {typeInfo.label}
            </span>
          </div>
          <h4 className="text-lg text-foreground dark:text-white font-medium mb-1">
            {auction.name}
          </h4>
        </div>
        <span className={`${config.color} ${config.textColor} px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap`}>
          {config.label}
        </span>
      </div>

      {/* Informações */}
      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground dark:text-[#99a1af] mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-foreground dark:text-white">{formatDate(auction.date)}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground dark:text-[#99a1af] mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-foreground dark:text-white">{auction.location}</p>
            <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
              {auction.city}, {auction.state}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground dark:text-[#99a1af] flex-shrink-0" />
          <p className="text-sm text-foreground dark:text-white">
            Organizador: <span className="text-muted-foreground dark:text-[#99a1af]">{auction.organizer}</span>
          </p>
        </div>

        {auction.website && (
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground dark:text-[#99a1af] flex-shrink-0" />
            <a 
              href={`https://${auction.website}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-foreground dark:text-white hover:underline"
            >
              {auction.website}
            </a>
          </div>
        )}
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
        <div className="text-center">
          <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Seus Animais</p>
          <p className="text-lg font-bold text-foreground dark:text-white">{auction.registeredAnimals}</p>
        </div>
        {auction.totalLots && (
          <div className="text-center">
            <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Total Lotes</p>
            <p className="text-lg font-bold text-foreground dark:text-white">{auction.totalLots}</p>
          </div>
        )}
        {auction.commission && (
          <div className="text-center">
            <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Comissão</p>
            <p className="text-lg font-bold text-foreground dark:text-white">{auction.commission}%</p>
          </div>
        )}
      </div>

      {/* Animais Registrados */}
      {auction.registeredAnimals > 0 && (
        <div className="bg-muted dark:bg-[#0d0d0d] rounded-lg p-3 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-0.5">
                Você tem animais neste leilão
              </p>
              <p className="text-sm font-medium text-foreground dark:text-white">
                {auction.registeredAnimals} {auction.registeredAnimals === 1 ? 'animal' : 'animais'} cadastrado(s)
              </p>
            </div>
            <Gavel className="w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
          </div>
        </div>
      )}

      {/* Ações */}
      <div className="flex gap-2 pt-2">
        {auction.results && (
          <button className="flex-1 px-4 py-2 bg-white dark:bg-white text-[#1a1a1a] rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <DollarSign className="w-4 h-4" />
            Ver Resultados
          </button>
        )}
        {!auction.results && auction.status !== 'concluido' && auction.status !== 'cancelado' && (
          <button className="flex-1 px-4 py-2 border border-border dark:border-[#333333] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors flex items-center justify-center gap-2">
            <Eye className="w-4 h-4" />
            Ver Detalhes
          </button>
        )}
        {auction.status === 'concluido' && !auction.results && (
          <button className="flex-1 px-4 py-2 border border-border dark:border-[#333333] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors flex items-center justify-center gap-2">
            <Eye className="w-4 h-4" />
            Ver Detalhes
          </button>
        )}
      </div>
    </div>
  );
}