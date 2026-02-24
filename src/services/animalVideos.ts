// ============================================
// ANIMAL VIDEOS SERVICE
// Gerencia vídeos vinculados aos animais
// ============================================

import { supabase, handleSupabaseError, getCurrentHarasId } from './base';
import type {
    AnimalVideo,
    CreateAnimalVideoInput,
    UpdateAnimalVideoInput,
    AnimalVideoVisibility,
    AnimalVideoSource
} from '@/types';

const DEFAULT_VISIBILITY: AnimalVideoVisibility = 'Público';

const DB_VISIBILITY_MAP: Record<string, 'publico' | 'privado'> = {
    'Público': 'publico',
    'Publico': 'publico',
    'publico': 'publico',
    'Privado': 'privado',
    'privado': 'privado'
};

const UI_VISIBILITY_MAP: Record<string, AnimalVideoVisibility> = {
    'publico': 'Público',
    'privado': 'Privado'
};

function normalizeVisibilityToDb(value?: string | null): 'publico' | 'privado' {
    if (!value) return 'publico';
    return DB_VISIBILITY_MAP[value] || 'publico';
}

function mapVisibilityFromDb(value?: string | null): AnimalVideoVisibility {
    if (!value) return DEFAULT_VISIBILITY;
    return UI_VISIBILITY_MAP[value.toLowerCase()] || DEFAULT_VISIBILITY;
}

function inferSourceFromUrl(url: string): AnimalVideoSource {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) return 'youtube';
    if (lowerUrl.includes('vimeo.com')) return 'vimeo';
    return 'link';
}

function normalizeSource(source?: AnimalVideoSource, url?: string): AnimalVideoSource {
    if (source) return source;
    if (url) return inferSourceFromUrl(url);
    return 'link';
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

function mapRowToVideo(row: any): AnimalVideo {
    return {
        id: row.id,
        animal_id: row.animal_id,
        haras_id: row.haras_id ?? null,
        title: row.title,
        url: row.url,
        source: normalizeSource(row.source, row.url),
        type: row.type ?? null,
        visibility: mapVisibilityFromDb(row.visibility),
        caption: row.caption ?? null,
        duration: row.duration ?? null,
        thumbnail_url: row.thumbnail_url ?? null,
        created_at: row.created_at,
        updated_at: row.updated_at
    };
}

export const animalVideosService = {
    async listByAnimal(animalId: string): Promise<AnimalVideo[]> {
        const { data, error } = await supabase
            .from('animal_videos')
            .select('*')
            .eq('animal_id', animalId)
            .order('created_at', { ascending: false });

        if (error) handleSupabaseError(error);

        return (data || []).map(mapRowToVideo);
    },

    async create(input: CreateAnimalVideoInput): Promise<AnimalVideo> {
        const harasId = await resolveHarasId(input.animal_id, input.haras_id);
        if (!harasId) {
            throw new Error('Haras não encontrado para salvar o vídeo.');
        }

        const dbInput = {
            animal_id: input.animal_id,
            haras_id: harasId,
            title: input.title,
            url: input.url,
            source: normalizeSource(input.source, input.url),
            type: input.type || null,
            visibility: normalizeVisibilityToDb(input.visibility),
            caption: input.caption || null,
            duration: input.duration || null,
            thumbnail_url: input.thumbnail_url || null
        };

        const { data, error } = await supabase
            .from('animal_videos')
            .insert(dbInput)
            .select('*')
            .single();

        if (error) handleSupabaseError(error);

        return mapRowToVideo(data);
    },

    async update(input: UpdateAnimalVideoInput): Promise<AnimalVideo> {
        const { id, ...updateData } = input;
        const dbInput: any = { updated_at: new Date().toISOString() };

        if (updateData.title !== undefined) dbInput.title = updateData.title;
        if (updateData.url !== undefined) dbInput.url = updateData.url;
        if (updateData.source !== undefined || updateData.url !== undefined) {
            dbInput.source = normalizeSource(updateData.source, updateData.url);
        }
        if (updateData.type !== undefined) dbInput.type = updateData.type || null;
        if (updateData.visibility !== undefined) dbInput.visibility = normalizeVisibilityToDb(updateData.visibility);
        if (updateData.caption !== undefined) dbInput.caption = updateData.caption || null;
        if (updateData.duration !== undefined) dbInput.duration = updateData.duration || null;
        if (updateData.thumbnail_url !== undefined) dbInput.thumbnail_url = updateData.thumbnail_url || null;

        const { data, error } = await supabase
            .from('animal_videos')
            .update(dbInput)
            .eq('id', id)
            .select('*')
            .single();

        if (error) handleSupabaseError(error);

        return mapRowToVideo(data);
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('animal_videos')
            .delete()
            .eq('id', id);

        if (error) handleSupabaseError(error);
    }
};
