// ============================================
// ANIMAL LOCATION SERVICE
// Gerencia localizacao e historico de mudancas
// ============================================

import { supabase, handleSupabaseError, getCurrentHarasId } from './base';
import { eventsService } from './events';
import {
    buildAnimalLocationLabel,
    getServiceTypeLabel,
    isHospedagemLocation,
    normalizeServiceType,
} from '@/lib/animal-location';
import { normalizeAnimalStatus } from '@/lib/animal-classification';
import type {
    AnimalLocationHistory,
    CreateAnimalLocationChangeInput,
    AnimalLocationType,
    AnimalServiceType
} from '@/types';

const LOCATION_TYPE_DB_MAP: Record<AnimalLocationType, string> = {
    Baia: 'Baia',
    Pasto: 'Pasto',
    Servico: 'Servi\u00e7o'
};

const SERVICE_TYPE_DB_MAP: Record<AnimalServiceType, string> = {
    Reproducao: 'Reprodu\u00e7\u00e3o',
    Trabalho: 'Trabalho',
    Repouso: 'Repouso',
    Hospedagem: 'Hospedagem',
    Compra: 'Compra',
    Nascimento: 'Nascimento',
    Outro: 'Outro'
};

function normalizeKey(value: string | null | undefined): string {
    if (!value) return '';
    return value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '');
}

function toDbLocationType(value: AnimalLocationType): string {
    return LOCATION_TYPE_DB_MAP[value] || value;
}

function toDbServiceType(value?: AnimalServiceType | null): string | null {
    if (!value) return null;
    return SERVICE_TYPE_DB_MAP[value] || value;
}

function toUiLocationType(value: string | null | undefined): AnimalLocationType {
    const key = normalizeKey(value);
    if (key.includes('pasto')) return 'Pasto';
    if (key.includes('servico')) return 'Servico';
    return 'Baia';
}

function toUiServiceType(value: string | null | undefined): AnimalServiceType | null {
    const key = normalizeKey(value);
    if (!key) return null;
    if (key.includes('reproducao')) return 'Reproducao';
    if (key.includes('trabalho')) return 'Trabalho';
    if (key.includes('repouso')) return 'Repouso';
    if (key.includes('hospedagem')) return 'Hospedagem';
    if (key.includes('compra')) return 'Compra';
    if (key.includes('nascimento')) return 'Nascimento';
    return 'Outro';
}

function normalizeLocationName(type: AnimalLocationType, name: string): string {
    const trimmed = name.trim();
    if (!trimmed) return trimmed;
    if (type === 'Servico') return trimmed;

    const lowerName = trimmed.toLowerCase();
    const lowerType = type.toLowerCase();
    if (lowerName.startsWith(lowerType)) return trimmed;

    return `${type} ${trimmed}`;
}

function buildLocationLabel(
    type: AnimalLocationType,
    name: string,
    serviceType?: AnimalServiceType | null
): string {
    const cleanName = normalizeLocationName(type, name);
    return buildAnimalLocationLabel(type, cleanName, serviceType || undefined);
}

async function resolveHarasId(animalId: string, explicitHarasId?: string): Promise<string | null> {
    if (explicitHarasId) return explicitHarasId;
    const currentHarasId = await getCurrentHarasId();
    if (currentHarasId) return currentHarasId;

    const { data, error } = await supabase
        .from('animals')
        .select('haras_id')
        .eq('id', animalId)
        .single();

    if (error) handleSupabaseError(error);
    return (data as { haras_id?: string | null })?.haras_id || null;
}

async function getCurrentUserId(): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
}

function mapRowToHistory(row: any): AnimalLocationHistory {
    return {
        id: row.id,
        animal_id: row.animal_id,
        haras_id: row.haras_id,
        location_type: toUiLocationType(row.location_type),
        location_name: row.location_name,
        service_type: toUiServiceType(row.service_type),
        previous_location: row.previous_location ?? null,
        new_location: row.new_location,
        reason: row.reason ?? null,
        notes: row.notes ?? null,
        changed_at: row.changed_at,
        changed_by: row.changed_by ?? null,
        changed_by_name: row.changed_by_profile?.full_name ?? row.changed_by_name ?? null,
        created_at: row.created_at
    };
}

export const animalLocationsService = {
    async listHistory(animalId: string): Promise<AnimalLocationHistory[]> {
        const { data, error } = await supabase
            .from('animal_location_history')
            .select('*, changed_by_profile:profiles(full_name)')
            .eq('animal_id', animalId)
            .order('changed_at', { ascending: false });

        if (error) handleSupabaseError(error);

        return (data || []).map(mapRowToHistory);
    },

    async createChange(input: CreateAnimalLocationChangeInput): Promise<AnimalLocationHistory> {
        const harasId = await resolveHarasId(input.animal_id, input.haras_id);
        if (!harasId) {
            throw new Error('Haras nao encontrado para registrar a localizacao.');
        }

        const { data: animalData, error: animalError } = await supabase
            .from('animals')
            .select('nome, localizacao, tipo_servico, status')
            .eq('id', input.animal_id)
            .single();

        if (animalError) handleSupabaseError(animalError);

        const newLocation = buildLocationLabel(input.location_type, input.location_name, input.service_type);
        const changedAt = input.changed_at || new Date().toISOString();
        const changedBy = input.changed_by || await getCurrentUserId();
        const serviceTypeLabel =
            input.location_type === 'Servico'
                ? getServiceTypeLabel(normalizeServiceType(input.service_type) || input.service_type || 'Outro')
                : null;
        const willBeHospedagem = input.location_type === 'Servico' && isHospedagemLocation(newLocation, input.service_type);
        const wasHospedagem = isHospedagemLocation(
            (animalData as { localizacao?: string | null })?.localizacao,
            (animalData as { tipo_servico?: string | null })?.tipo_servico
        );
        const currentStatus = normalizeAnimalStatus((animalData as { status?: string | null })?.status);
        const nextStatus =
            willBeHospedagem
                ? 'em_servico'
                : currentStatus === 'em_servico'
                    ? 'ativo'
                    : undefined;

        if (willBeHospedagem && !input.return_date) {
            throw new Error('Informe a data prevista de retorno para hospedagem.');
        }

        const updatePayload: Record<string, unknown> = {
            localizacao: newLocation,
            tipo_servico: input.location_type === 'Servico' ? serviceTypeLabel : null,
            updated_at: new Date().toISOString()
        };

        if (nextStatus) {
            updatePayload.status = nextStatus;
        }

        const { error: updateError } = await supabase
            .from('animals')
            .update(updatePayload)
            .eq('id', input.animal_id);

        if (updateError) handleSupabaseError(updateError);

        const { data, error } = await supabase
            .from('animal_location_history')
            .insert({
                animal_id: input.animal_id,
                haras_id: harasId,
                location_type: toDbLocationType(input.location_type),
                location_name: input.location_name,
                service_type: input.location_type === 'Servico' ? toDbServiceType(input.service_type) : null,
                previous_location: (animalData as { localizacao?: string | null })?.localizacao ?? null,
                new_location: newLocation,
                reason: input.reason || null,
                notes: input.notes || null,
                changed_at: changedAt,
                changed_by: changedBy
            })
            .select('*, changed_by_profile:profiles(full_name)')
            .single();

        if (error) handleSupabaseError(error);

        const animalName = (animalData as { nome?: string | null })?.nome || 'Animal';

        if (willBeHospedagem && input.return_date) {
            await eventsService.syncHospedagemReturnReminder({
                harasId,
                animalId: input.animal_id,
                animalName,
                returnDate: input.return_date,
                location: newLocation,
                observations: input.notes || input.reason || null,
            });
        } else if (wasHospedagem) {
            await eventsService.deleteHospedagemReturnReminder(harasId, input.animal_id);
        }

        return mapRowToHistory(data);
    }
};
