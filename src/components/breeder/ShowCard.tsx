import { Calendar, MapPin, Users, Trophy, Eye, FileText, Award } from 'lucide-react';

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

interface ShowCardProps {
  show: Show;
}

export function ShowCard({ show }: ShowCardProps) {
  const statusConfig = {
    'inscricoes-abertas': { label: 'Inscrições Abertas', color: 'bg-emerald-500', textColor: 'text-white' },
    'confirmado': { label: 'Confirmado', color: 'bg-blue-500', textColor: 'text-white' },
    'em-andamento': { label: 'Em Andamento', color: 'bg-amber-500', textColor: 'text-white' },
    'concluido': { label: 'Concluído', color: 'bg-[#6b7280]', textColor: 'text-white' },
    'cancelado': { label: 'Cancelado', color: 'bg-[#e74c3c]', textColor: 'text-white' },
  };

  const typeConfig = {
    'exposicao': { label: 'Exposição', icon: Trophy },
    'campeonato': { label: 'Campeonato', icon: Award },
    'prova-funcional': { label: 'Prova Funcional', icon: Users },
    'julgamento': { label: 'Julgamento', icon: FileText },
  };

  const config = statusConfig[show.status];
  const typeInfo = typeConfig[show.type];
  const TypeIcon = typeInfo.icon;

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const formatDateRange = () => {
    if (show.endDate) {
      return `${formatDate(show.date)} a ${formatDate(show.endDate)}`;
    }
    return formatDate(show.date);
  };

  return (
    <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)] hover:border-[#3a3a3a] transition-all space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <TypeIcon className="w-4 h-4 text-muted-foreground dark:text-[#99a1af]" />
            <span className="text-xs text-muted-foreground dark:text-[#99a1af]">
              {typeInfo.label}
            </span>
          </div>
          <h4 className="text-lg text-foreground dark:text-white font-medium mb-1">
            {show.name}
          </h4>
          {show.abccmmCode && (
            <p className="text-xs text-muted-foreground dark:text-[#99a1af] font-mono">
              {show.abccmmCode}
            </p>
          )}
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
            <p className="text-sm text-foreground dark:text-white">{formatDateRange()}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground dark:text-[#99a1af] mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-foreground dark:text-white">{show.location}</p>
            <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
              {show.city}, {show.state}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground dark:text-[#99a1af] flex-shrink-0" />
          <p className="text-sm text-foreground dark:text-white">
            Organizador: <span className="text-muted-foreground dark:text-[#99a1af]">{show.organizer}</span>
          </p>
        </div>
      </div>

      {/* Animais Registrados */}
      {show.registeredAnimals > 0 && (
        <div className="bg-muted dark:bg-[#0d0d0d] rounded-lg p-3 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-0.5">
                Seus animais registrados
              </p>
              <p className="text-lg font-medium text-foreground dark:text-white">
                {show.registeredAnimals} {show.registeredAnimals === 1 ? 'animal' : 'animais'}
              </p>
            </div>
            {show.totalAnimals && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-0.5">
                  Total de inscritos
                </p>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                  {show.totalAnimals}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ações */}
      <div className="flex gap-2 pt-2">
        {show.results && (
          <button className="flex-1 px-4 py-2 bg-white dark:bg-white text-[#1a1a1a] rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <Trophy className="w-4 h-4" />
            Ver Resultados
          </button>
        )}
        {!show.results && show.status !== 'concluido' && show.status !== 'cancelado' && (
          <button className="flex-1 px-4 py-2 border border-border dark:border-[#333333] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors flex items-center justify-center gap-2">
            <Eye className="w-4 h-4" />
            Ver Detalhes
          </button>
        )}
        {show.status === 'concluido' && !show.results && (
          <button className="flex-1 px-4 py-2 border border-border dark:border-[#333333] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors flex items-center justify-center gap-2">
            <Eye className="w-4 h-4" />
            Ver Detalhes
          </button>
        )}
      </div>
    </div>
  );
}
