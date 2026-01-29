import { MapPin, Users, Clock, Plus, Calendar, User, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { LocationChangeModal, LocationChangeData } from './LocationChangeModal';

interface Partner {
  name: string;
  percentage: number;
}

interface LocationHistory {
  id: number;
  date: string;
  time: string;
  previousLocation: string;
  newLocation: string;
  reason?: string; // Motivo opcional
  registeredBy: string;
  notes?: string;
}

interface AnimalLocationSectionProps {
  currentLocation?: string;
  locationType?: 'Baia' | 'Pasto' | 'Serviço';
  serviceType?: 'Reprodução' | 'Trabalho' | 'Repouso' | 'Outro';
  partners?: Partner[];
  locationHistory?: LocationHistory[];
}

export function AnimalLocationSection({ 
  currentLocation = 'Baia 12',
  locationType = 'Baia',
  serviceType,
  partners = [],
  locationHistory = []
}: AnimalLocationSectionProps) {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [localHistory, setLocalHistory] = useState(locationHistory);

  // Dados mockados se não houver histórico
  const mockHistory: LocationHistory[] = localHistory.length > 0 ? localHistory : [
    {
      id: 1,
      date: '2024-11-15',
      time: '14:30',
      previousLocation: 'Pasto Sul',
      newLocation: 'Baia 12',
      reason: 'Preparação para cobertura',
      registeredBy: 'João Silva',
      notes: 'Animal apresentando ótimo comportamento'
    },
    {
      id: 2,
      date: '2024-10-20',
      time: '09:15',
      previousLocation: 'Baia 8',
      newLocation: 'Pasto Sul',
      reason: 'Período de descanso',
      registeredBy: 'Maria Santos',
    },
    {
      id: 3,
      date: '2024-09-10',
      time: '16:00',
      previousLocation: 'Serviço - Fazenda Vizinha',
      newLocation: 'Baia 8',
      reason: 'Retorno de trabalho externo',
      registeredBy: 'João Silva',
      notes: 'Animal retornou em excelente estado'
    },
  ];

  const handleSaveLocationChange = (data: LocationChangeData) => {
    const newEntry: LocationHistory = {
      id: mockHistory.length + 1,
      date: data.date,
      time: data.time,
      previousLocation: currentLocation,
      newLocation: `${data.locationType}${data.locationType === 'Serviço' ? ` - ${data.serviceType}` : ''} - ${data.locationName}`,
      reason: data.reason,
      registeredBy: 'Usuário Atual', // Em produção, pegar do contexto de autenticação
      notes: data.notes,
    };
    
    setLocalHistory([newEntry, ...mockHistory]);
  };

  const getLocationIcon = (locationType: string) => {
    if (locationType === 'Serviço') {
      return <AlertCircle className="w-5 h-5" />;
    } else if (locationType === 'Pasto') {
      return <Calendar className="w-5 h-5" />;
    }
    return <Clock className="w-5 h-5" />;
  };

  const getLocationColor = () => {
    return 'bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300';
  };

  const getLocationTypeColor = (type: string) => {
    if (type === 'Pasto') {
      return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400';
    }
    return 'bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300';
  };

  return (
    <div className="space-y-6">
      {/* Localização Atual */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-[rgba(255,255,255,0.1)] p-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
          <div>
            <h4 className="text-lg text-foreground dark:text-white mb-1">Localização Atual</h4>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
              Onde o animal está localizado no momento
            </p>
          </div>
          <button
            onClick={() => setShowLocationModal(true)}
            className="w-full sm:w-auto px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Registrar Mudança
          </button>
        </div>

        <div className="space-y-4">
          {/* Local */}
          <div className="flex items-start gap-3">
            <div className={`p-3 rounded-lg ${getLocationColor()}`}>
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                Localização
              </p>
              <div className="flex items-center gap-2">
                <div className="text-foreground dark:text-white">
                  {getLocationIcon(locationType)}
                </div>
                <p className="text-foreground dark:text-white">
                  {currentLocation}
                </p>
              </div>
              {locationType === 'Serviço' && serviceType && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400">
                    Tipo: {serviceType}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Sócios/Propriedade */}
          {partners && partners.length > 0 && (
            <div className="flex items-start gap-3 pt-4 border-t border-gray-200 dark:border-[rgba(255,255,255,0.1)]">
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                <Users className="w-5 h-5 text-purple-700 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-2">
                  Sócios / Propriedade
                </p>
                <div className="space-y-2">
                  {partners.map((partner, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#0d0d0d] rounded-lg"
                    >
                      <span className="text-foreground dark:text-white">{partner.name}</span>
                      <span className="px-3 py-1 bg-primary/10 dark:bg-white/10 text-primary dark:text-white rounded-full text-sm font-medium">
                        {partner.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Histórico de Localização */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-[rgba(255,255,255,0.1)] p-6">
        <div className="mb-6">
          <h4 className="text-lg text-foreground dark:text-white mb-1">Histórico de Localização</h4>
          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
            Todas as mudanças de localização registradas
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-[rgba(255,255,255,0.1)]">
                <th className="text-left py-3 px-4 text-sm text-muted-foreground dark:text-[#99a1af]">
                  Data/Hora
                </th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground dark:text-[#99a1af]">
                  Local Anterior
                </th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground dark:text-[#99a1af]">
                  Novo Local
                </th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground dark:text-[#99a1af]">
                  Motivo
                </th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground dark:text-[#99a1af]">
                  Registrado por
                </th>
              </tr>
            </thead>
            <tbody>
              {mockHistory.map((entry) => {
                const [year, month, day] = entry.date.split('-');
                const formattedDate = `${day}/${month}/${year}`;
                
                return (
                  <tr 
                    key={entry.id}
                    className="border-b border-gray-100 dark:border-[rgba(255,255,255,0.05)] hover:bg-gray-50 dark:hover:bg-[#0d0d0d] transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground dark:text-[#99a1af]" />
                        <div>
                          <div className="text-foreground dark:text-white">{formattedDate}</div>
                          <div className="text-xs text-muted-foreground dark:text-[#99a1af] flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {entry.time}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-muted-foreground dark:text-[#99a1af]">
                        {entry.previousLocation}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-foreground dark:text-white font-medium">
                        {entry.newLocation}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-foreground dark:text-white">
                        {entry.reason || <span className="text-muted-foreground dark:text-[#99a1af] italic">Sem motivo informado</span>}
                      </div>
                      {entry.notes && (
                        <div className="text-xs text-muted-foreground dark:text-[#99a1af] mt-1">
                          {entry.notes}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-[#99a1af]">
                        <User className="w-4 h-4" />
                        {entry.registeredBy}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {mockHistory.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground dark:text-[#99a1af]">
              Nenhuma mudança de localização registrada
            </p>
          </div>
        )}
      </div>

      {/* Modal de Mudança de Localização */}
      {showLocationModal && (
        <LocationChangeModal
          currentLocation={currentLocation}
          onClose={() => setShowLocationModal(false)}
          onSave={handleSaveLocationChange}
        />
      )}
    </div>
  );
}