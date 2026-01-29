import { useState } from 'react';
import { Trophy, Award, Medal, Search, Calendar, MapPin, TrendingUp } from 'lucide-react';
import { NativeSelect } from '../ui/native-select';

interface AwardRecord {
  id: string;
  animalId: string;
  animalName: string;
  animalRegistry: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  eventType: 'exposicao' | 'campeonato' | 'prova-funcional';
  placement: number;
  points: number;
  award: string;
  category: string;
  judge: string;
}

export function AwardsHistoryTab() {
  const [selectedAnimal, setSelectedAnimal] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedEventType, setSelectedEventType] = useState('');
  const [selectedPlacement, setSelectedPlacement] = useState('');

  const awards: AwardRecord[] = [
    {
      id: '1',
      animalId: '1',
      animalName: 'Estrela da Manhã',
      animalRegistry: '123456',
      eventName: 'Exposição Nacional de Mangalarga Marchador',
      eventDate: '2024-11-12',
      eventLocation: 'Belo Horizonte, MG',
      eventType: 'exposicao',
      placement: 1,
      points: 95,
      award: 'Campeã da Categoria',
      category: 'Adulto Fêmea',
      judge: 'Dr. Carlos Mendes',
    },
    {
      id: '2',
      animalId: '1',
      animalName: 'Estrela da Manhã',
      animalRegistry: '123456',
      eventName: 'Campeonato Regional Sul de Minas',
      eventDate: '2024-09-20',
      eventLocation: 'Pouso Alegre, MG',
      eventType: 'campeonato',
      placement: 2,
      points: 92,
      award: 'Reservada Campeã',
      category: 'Adulto Fêmea',
      judge: 'Dra. Ana Paula Silva',
    },
    {
      id: '3',
      animalId: '2',
      animalName: 'Trovão Negro',
      animalRegistry: '123457',
      eventName: 'Exposição Nacional de Mangalarga Marchador',
      eventDate: '2024-11-12',
      eventLocation: 'Belo Horizonte, MG',
      eventType: 'exposicao',
      placement: 2,
      points: 92,
      award: 'Reservado Campeão',
      category: 'Adulto Macho',
      judge: 'Dr. Carlos Mendes',
    },
    {
      id: '4',
      animalId: '4',
      animalName: 'Sol Nascente',
      animalRegistry: '123459',
      eventName: 'Exposição Nacional de Mangalarga Marchador',
      eventDate: '2024-11-12',
      eventLocation: 'Belo Horizonte, MG',
      eventType: 'exposicao',
      placement: 1,
      points: 93,
      award: 'Campeão da Categoria',
      category: 'Júnior Macho',
      judge: 'Dra. Ana Paula Silva',
    },
    {
      id: '5',
      animalId: '2',
      animalName: 'Trovão Negro',
      animalRegistry: '123457',
      eventName: 'Prova Funcional de Marcha',
      eventDate: '2024-08-15',
      eventLocation: 'Três Corações, MG',
      eventType: 'prova-funcional',
      placement: 1,
      points: 94,
      award: 'Melhor Marcha',
      category: 'Adulto Macho',
      judge: 'Dr. Roberto Lima',
    },
    {
      id: '6',
      animalId: '3',
      animalName: 'Lua Cheia',
      animalRegistry: '123458',
      eventName: 'Campeonato Regional Sul de Minas',
      eventDate: '2024-09-20',
      eventLocation: 'Pouso Alegre, MG',
      eventType: 'campeonato',
      placement: 3,
      points: 89,
      award: '3º Lugar',
      category: 'Adulto Fêmea',
      judge: 'Dra. Ana Paula Silva',
    },
  ];

  // Estatísticas
  const animalStats = awards.reduce((acc, award) => {
    if (!acc[award.animalId]) {
      acc[award.animalId] = {
        name: award.animalName,
        registry: award.animalRegistry,
        first: 0,
        second: 0,
        third: 0,
        total: 0,
        totalPoints: 0,
      };
    }
    if (award.placement === 1) acc[award.animalId].first++;
    if (award.placement === 2) acc[award.animalId].second++;
    if (award.placement === 3) acc[award.animalId].third++;
    acc[award.animalId].total++;
    acc[award.animalId].totalPoints += award.points;
    return acc;
  }, {} as any);

  const filteredAwards = awards.filter((award) => {
    if (selectedAnimal && award.animalId !== selectedAnimal) return false;
    if (selectedYear && !award.eventDate.startsWith(selectedYear)) return false;
    if (selectedEventType && award.eventType !== selectedEventType) return false;
    if (selectedPlacement && award.placement.toString() !== selectedPlacement) return false;
    return true;
  });

  const placementConfig = {
    1: { Icon: Award, color: 'text-yellow-500', bg: 'bg-yellow-500/20' },
    2: { Icon: Medal, color: 'text-gray-400', bg: 'bg-gray-400/20' },
    3: { Icon: Medal, color: 'text-amber-600', bg: 'bg-amber-600/20' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl text-foreground dark:text-white">Histórico de Premiações</h3>
        <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-1">
          {filteredAwards.length} {filteredAwards.length === 1 ? 'premiação' : 'premiações'} registrada(s)
        </p>
      </div>

      {/* Estatísticas por Animal */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(animalStats).map((stat: any) => (
          <div
            key={stat.name}
            className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-5 border border-border dark:border-[rgba(255,255,255,0.1)] hover:border-[#3a3a3a] transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="flex-1">
                <h4 className="text-foreground dark:text-white font-medium">{stat.name}</h4>
                <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Reg: {stat.registry}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-3">
              <div className="text-center">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center mb-1">
                  <Award className="w-5 h-5 text-yellow-500" />
                </div>
                <p className="text-lg font-bold text-foreground dark:text-white">{stat.first}</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-gray-400/20 rounded-full flex items-center justify-center mb-1">
                  <Medal className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-lg font-bold text-foreground dark:text-white">{stat.second}</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-amber-600/20 rounded-full flex items-center justify-center mb-1">
                  <Medal className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-lg font-bold text-foreground dark:text-white">{stat.third}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-border dark:border-[rgba(255,255,255,0.1)] grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-muted-foreground dark:text-[#99a1af]">Total de Eventos</p>
                <p className="text-foreground dark:text-white font-medium">{stat.total}</p>
              </div>
              <div>
                <p className="text-muted-foreground dark:text-[#99a1af]">Pontos Acumulados</p>
                <p className="text-foreground dark:text-white font-medium">{stat.totalPoints.toFixed(1)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="text-sm text-muted-foreground dark:text-[#99a1af] mb-2 block">
            Animal
          </label>
          <NativeSelect
            value={selectedAnimal}
            onChange={(e) => setSelectedAnimal(e.target.value)}
            className="w-full h-10 bg-muted dark:bg-[#3a3a3a] border-0 text-foreground dark:text-white rounded-lg"
          >
            <option value="">Todos os animais</option>
            {Object.entries(animalStats).map(([id, stat]: any) => (
              <option key={id} value={id}>
                {stat.name}
              </option>
            ))}
          </NativeSelect>
        </div>

        <div>
          <label className="text-sm text-muted-foreground dark:text-[#99a1af] mb-2 block">
            Ano
          </label>
          <NativeSelect
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full h-10 bg-muted dark:bg-[#3a3a3a] border-0 text-foreground dark:text-white rounded-lg"
          >
            <option value="">Todos os anos</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </NativeSelect>
        </div>

        <div>
          <label className="text-sm text-muted-foreground dark:text-[#99a1af] mb-2 block">
            Tipo de Evento
          </label>
          <NativeSelect
            value={selectedEventType}
            onChange={(e) => setSelectedEventType(e.target.value)}
            className="w-full h-10 bg-muted dark:bg-[#3a3a3a] border-0 text-foreground dark:text-white rounded-lg"
          >
            <option value="">Todos os tipos</option>
            <option value="exposicao">Exposição</option>
            <option value="campeonato">Campeonato</option>
            <option value="prova-funcional">Prova Funcional</option>
          </NativeSelect>
        </div>

        <div>
          <label className="text-sm text-muted-foreground dark:text-[#99a1af] mb-2 block">
            Colocação
          </label>
          <NativeSelect
            value={selectedPlacement}
            onChange={(e) => setSelectedPlacement(e.target.value)}
            className="w-full h-10 bg-muted dark:bg-[#3a3a3a] border-0 text-foreground dark:text-white rounded-lg"
          >
            <option value="">Todas as colocações</option>
            <option value="1">1º Lugar</option>
            <option value="2">2º Lugar</option>
            <option value="3">3º Lugar</option>
          </NativeSelect>
        </div>
      </div>

      {/* Timeline de Premiações */}
      <div>
        <h4 className="text-lg text-foreground dark:text-white font-medium mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Linha do Tempo
        </h4>
        <div className="space-y-4">
          {filteredAwards.map((award) => (
            <AwardTimelineItem key={award.id} award={award} placementConfig={placementConfig} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface AwardTimelineItemProps {
  award: AwardRecord;
  placementConfig: any;
}

function AwardTimelineItem({ award, placementConfig }: AwardTimelineItemProps) {
  const config = placementConfig[award.placement] || { Icon: Trophy, color: 'text-gray-500', bg: 'bg-gray-500/20' };

  return (
    <div className="flex gap-4">
      {/* Timeline Indicator */}
      <div className="flex flex-col items-center">
        <div className={`w-12 h-12 ${config.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
          <config.Icon className="w-5 h-5" />
        </div>
        <div className="w-0.5 h-full bg-border dark:bg-[rgba(255,255,255,0.1)] mt-2" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-6">
        <div className="bg-card dark:bg-[#1a1a1a] rounded-xl p-5 border border-border dark:border-[rgba(255,255,255,0.1)] hover:border-[#3a3a3a] transition-all">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <h5 className="text-foreground dark:text-white font-medium mb-1">
                {award.animalName}
              </h5>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                {award.eventName}
              </p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium ${config.color}`}>
                {award.placement}º Lugar
              </p>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
                {award.points} pontos
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground dark:text-[#99a1af] mb-3">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {award.eventDate.split('-').reverse().join('/')}
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {award.eventLocation}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
            <Award className="w-4 h-4 text-yellow-500" />
            <p className="text-sm text-foreground dark:text-white font-medium">
              {award.award}
            </p>
            <span className="text-xs text-muted-foreground dark:text-[#99a1af]">
              • {award.category}
            </span>
          </div>

          <p className="text-xs text-muted-foreground dark:text-[#99a1af] mt-2">
            Juiz: {award.judge}
          </p>
        </div>
      </div>
    </div>
  );
}