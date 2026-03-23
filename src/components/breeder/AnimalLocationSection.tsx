import { MapPin, Users, Clock, Plus, Calendar, User, AlertCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { LocationChangeModal, LocationChangeData } from './LocationChangeModal';
import { OwnershipSharesModal } from './OwnershipSharesModal';
import { useSaveAnimalOwnershipShares } from '@/hooks/useAnimals';
import { useAnimalLocationHistory, useCreateAnimalLocationChange } from '@/hooks/useAnimalLocations';
import { useHarasSettings } from '@/hooks/useHarasSettings';
import { getServiceTypeLabel, normalizeHarasLocationSettings, parseAnimalLocation } from '@/lib/animal-location';
import type { AnimalLocationType, AnimalOwnershipShare, AnimalServiceType } from '@/types';

interface LocationHistory {
  id: string;
  date: string;
  time: string;
  previousLocation: string;
  newLocation: string;
  reason?: string;
  registeredBy: string;
  notes?: string;
}

interface AnimalLocationSectionProps {
  animalId: string;
  harasId?: string;
  currentLocation?: string;
  locationType?: AnimalLocationType;
  serviceType?: AnimalServiceType;
  ownershipShares?: AnimalOwnershipShare[];
  defaultOwnerName?: string;
  locationHistory?: LocationHistory[];
}

function formatDateLabel(value?: string | null): string {
  if (!value) return '-';
  const [year, month, day] = value.split('T')[0].split('-');
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

export function AnimalLocationSection({
  animalId,
  harasId,
  currentLocation = '-',
  locationType = 'Baia',
  serviceType,
  ownershipShares = [],
  defaultOwnerName,
  locationHistory = []
}: AnimalLocationSectionProps) {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showOwnershipModal, setShowOwnershipModal] = useState(false);
  const { data: remoteHistory, isLoading } = useAnimalLocationHistory(animalId);
  const { mutateAsync: createLocationChange, isPending: isSaving } = useCreateAnimalLocationChange();
  const { mutateAsync: saveOwnershipShares, isPending: isSavingOwnership } = useSaveAnimalOwnershipShares();
  const { data: harasSettings } = useHarasSettings(harasId || '');

  const locationSettings = useMemo(
    () => normalizeHarasLocationSettings(harasSettings?.location_settings),
    [harasSettings?.location_settings]
  );
  const parsedCurrentLocation = useMemo(
    () => parseAnimalLocation(currentLocation, serviceType),
    [currentLocation, serviceType]
  );
  const activeOwnershipShares = useMemo(
    () => ownershipShares.filter((share) => !share.end_date),
    [ownershipShares]
  );
  const historicalOwnershipShares = useMemo(
    () =>
      ownershipShares
        .filter((share) => !!share.end_date)
        .sort((left, right) => (right.end_date || '').localeCompare(left.end_date || '')),
    [ownershipShares]
  );
  const partners = useMemo(
    () =>
      activeOwnershipShares.map((share) => ({
        id: share.id,
        name: share.is_primary ? `${share.owner_name} (principal)` : share.owner_name,
        percentage: share.percentage,
      })),
    [activeOwnershipShares]
  );

  const historyEntries: LocationHistory[] = useMemo(() => {
    if (remoteHistory && remoteHistory.length > 0) {
      return remoteHistory.map((entry) => {
        const [datePart, timePart = ''] = entry.changed_at.split('T');
        return {
          id: entry.id,
          date: datePart,
          time: timePart.slice(0, 5),
          previousLocation: entry.previous_location || '-',
          newLocation: entry.new_location,
          reason: entry.reason || undefined,
          registeredBy: entry.changed_by_name || 'Sistema',
          notes: entry.notes || undefined,
        };
      });
    }

    return locationHistory;
  }, [remoteHistory, locationHistory]);

  const handleSaveLocationChange = async (data: LocationChangeData) => {
    try {
      const changedAt = new Date(`${data.date}T${data.time}:00`).toISOString();
      await createLocationChange({
        animal_id: animalId,
        haras_id: harasId,
        location_type: data.locationType,
        location_name: data.locationName,
        service_type: data.locationType === 'Servico' ? data.serviceType : undefined,
        return_date: data.locationType === 'Servico' ? data.returnDate || null : null,
        reason: data.reason,
        notes: data.notes,
        changed_at: changedAt,
      });
      toast.success('Localizacao atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar localizacao:', error);
      toast.error('Erro ao atualizar localizacao. Tente novamente.');
      throw error;
    }
  };

  const handleSaveOwnershipShares = async (
    shares: Array<{
      id?: string;
      owner_name: string;
      percentage: number;
      is_primary: boolean;
    }>
  ) => {
    if (!harasId) {
      toast.error('Haras não identificado para atualizar a propriedade.');
      throw new Error('Haras não identificado.');
    }

    try {
      await saveOwnershipShares({
        animalId,
        harasId,
        shares,
      });
      toast.success('Propriedade atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar cotas do animal:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar propriedade. Tente novamente.');
      throw error;
    }
  };

  const getLocationIcon = (type: string) => {
    if (type === 'Servico') {
      return <AlertCircle className="w-5 h-5" />;
    }
    if (type === 'Pasto') {
      return <Calendar className="w-5 h-5" />;
    }
    return <Clock className="w-5 h-5" />;
  };

  const getLocationColor = () => {
    return 'bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-[rgba(255,255,255,0.1)] p-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
          <div>
            <h4 className="text-lg text-foreground dark:text-white mb-1">Localizacao Atual</h4>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
              Onde o animal esta localizado no momento
            </p>
          </div>
          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setShowOwnershipModal(true)}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-[#0d0d0d] transition-colors flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              Gerenciar Propriedade
            </button>
            <button
              onClick={() => setShowLocationModal(true)}
              className="w-full sm:w-auto px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Registrar Mudanca
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className={`p-3 rounded-lg ${getLocationColor()}`}>
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                Localizacao
              </p>
              <div className="flex items-center gap-2">
                <div className="text-foreground dark:text-white">
                  {getLocationIcon(locationType)}
                </div>
                <p className="text-foreground dark:text-white">{currentLocation}</p>
              </div>
              {locationType === 'Servico' && serviceType && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400">
                    Tipo: {getServiceTypeLabel(serviceType)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3 pt-4 border-t border-gray-200 dark:border-[rgba(255,255,255,0.1)]">
            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
              <Users className="w-5 h-5 text-purple-700 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                  Socios / Propriedade
                </p>
                <button
                  type="button"
                  onClick={() => setShowOwnershipModal(true)}
                  className="text-sm text-primary dark:text-white hover:opacity-80 transition-opacity text-left sm:text-right"
                >
                  Editar cotas
                </button>
              </div>

              {partners.length > 0 ? (
                <div className="space-y-2">
                  {partners.map((partner) => (
                    <div
                      key={partner.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#0d0d0d] rounded-lg"
                    >
                      <span className="text-foreground dark:text-white">{partner.name}</span>
                      <span className="px-3 py-1 bg-primary/10 dark:bg-white/10 text-primary dark:text-white rounded-full text-sm font-medium">
                        {partner.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-[#0d0d0d] text-sm text-muted-foreground dark:text-[#99a1af]">
                  Nenhuma cota ativa cadastrada para este animal.
                </div>
              )}
            </div>
          </div>

          {historicalOwnershipShares.length > 0 && (
            <div className="flex items-start gap-3 pt-4 border-t border-gray-200 dark:border-[rgba(255,255,255,0.1)]">
              <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-900/30">
                <Clock className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </div>
              <div className="flex-1">
                <div className="mb-3">
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                    Histórico de Propriedade
                  </p>
                  <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
                    Participações encerradas permanecem aqui para consulta.
                  </p>
                </div>

                <div className="space-y-2">
                  {historicalOwnershipShares.map((share) => (
                    <div
                      key={share.id}
                      className="p-3 bg-gray-50 dark:bg-[#0d0d0d] rounded-lg border border-gray-200/70 dark:border-[rgba(255,255,255,0.06)]"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="text-foreground dark:text-white">
                          {share.owner_name}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white rounded-full text-sm font-medium">
                            {share.percentage}%
                          </span>
                          {share.is_primary && (
                            <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-medium">
                              Principal
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground dark:text-[#99a1af]">
                        Vigência: {formatDateLabel(share.start_date)} até {formatDateLabel(share.end_date)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-[rgba(255,255,255,0.1)] p-6">
        <div className="mb-6">
          <h4 className="text-lg text-foreground dark:text-white mb-1">Historico de Localizacao</h4>
          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
            Todas as mudancas de localizacao registradas
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
              {historyEntries.map((entry) => {
                const formattedDate = formatDateLabel(entry.date);

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
                        {entry.reason || (
                          <span className="text-muted-foreground dark:text-[#99a1af] italic">
                            Sem motivo informado
                          </span>
                        )}
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

        {!isLoading && historyEntries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground dark:text-[#99a1af]">
              Nenhuma mudanca de localizacao registrada
            </p>
          </div>
        )}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground dark:text-[#99a1af]">
              Carregando historico de localizacao...
            </p>
          </div>
        )}
      </div>

      {showLocationModal && (
        <LocationChangeModal
          currentLocation={currentLocation}
          currentLocationType={locationType || parsedCurrentLocation.locationType}
          currentServiceType={serviceType || parsedCurrentLocation.serviceType || undefined}
          locationSettings={locationSettings}
          onClose={() => setShowLocationModal(false)}
          onSave={handleSaveLocationChange}
          isSaving={isSaving}
        />
      )}

      {showOwnershipModal && (
        <OwnershipSharesModal
          initialShares={activeOwnershipShares}
          defaultOwnerName={defaultOwnerName}
          onClose={() => setShowOwnershipModal(false)}
          onSave={handleSaveOwnershipShares}
          isSaving={isSavingOwnership}
        />
      )}
    </div>
  );
}
