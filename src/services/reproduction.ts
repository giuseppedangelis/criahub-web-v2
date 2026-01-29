// ============================================
// REPRODUCTION SERVICE
// Gerencia eventos reprodutivos e gestações
// ============================================

import { supabase, applyPagination, formatPaginatedResponse, handleSupabaseError } from './base';
import type {
    ReproductiveEvent,
    Gestation,
    GestationFilters,
    CreateReproductiveEventInput,
    CreateGestationInput,
    PaginationParams,
    PaginatedResponse,
    ReproductionStats
} from '@/types';

export const reproductionService = {
    // ============================================
    // EVENTOS REPRODUTIVOS
    // ============================================

    /**
     * Lista eventos reprodutivos de um haras
     */
    async listEvents(
        harasId: string,
        pagination: PaginationParams = { page: 1, limit: 20 }
    ): Promise<PaginatedResponse<ReproductiveEvent>> {
        let query = supabase
            .from('reproductive_events')
            .select(`
        *,
        animal:animals!reproductive_events_animal_id_fkey(id, name, registry_number),
        stallion:animals!reproductive_events_stallion_id_fkey(id, name),
        mare:animals!reproductive_events_mare_id_fkey(id, name)
      `, { count: 'exact' })
            .eq('haras_id', harasId)
            .order('event_date', { ascending: false });

        query = applyPagination(query, pagination);

        const { data, error, count } = await query;

        if (error) handleSupabaseError(error);

        return formatPaginatedResponse(data || [], count || 0, pagination);
    },

    /**
     * Registra um novo evento reprodutivo
     */
    async createEvent(input: CreateReproductiveEventInput): Promise<ReproductiveEvent> {
        const { data, error } = await supabase
            .from('reproductive_events')
            .insert(input)
            .select()
            .single();

        if (error) handleSupabaseError(error);

        return data as ReproductiveEvent;
    },

    /**
     * Busca eventos por animal
     */
    async getEventsByAnimal(animalId: string): Promise<ReproductiveEvent[]> {
        const { data, error } = await supabase
            .from('reproductive_events')
            .select(`
        *,
        stallion:animals!reproductive_events_stallion_id_fkey(id, name),
        mare:animals!reproductive_events_mare_id_fkey(id, name)
      `)
            .or(`animal_id.eq.${animalId},stallion_id.eq.${animalId},mare_id.eq.${animalId}`)
            .order('event_date', { ascending: false });

        if (error) handleSupabaseError(error);

        return data as ReproductiveEvent[];
    },

    // ============================================
    // GESTAÇÕES
    // ============================================

    /**
     * Lista gestações com filtros
     */
    async listGestations(
        filters: GestationFilters = {},
        pagination: PaginationParams = { page: 1, limit: 20 }
    ): Promise<PaginatedResponse<Gestation>> {
        let query = supabase
            .from('gestations')
            .select(`
        *,
        mare:animals!gestations_mare_id_fkey(id, name, registry_number),
        stallion:animals!gestations_stallion_id_fkey(id, name),
        foal:animals!gestations_foal_id_fkey(id, name)
      `, { count: 'exact' });

        if (filters.haras_id) {
            query = query.eq('haras_id', filters.haras_id);
        }
        if (filters.status) {
            query = query.eq('status', filters.status);
        }
        if (filters.mare_id) {
            query = query.eq('mare_id', filters.mare_id);
        }

        query = query.order('expected_birth_date', { ascending: true });
        query = applyPagination(query, pagination);

        const { data, error, count } = await query;

        if (error) handleSupabaseError(error);

        return formatPaginatedResponse(data || [], count || 0, pagination);
    },

    /**
     * Busca gestação por ID
     */
    async getGestationById(id: string): Promise<Gestation | null> {
        const { data, error } = await supabase
            .from('gestations')
            .select(`
        *,
        mare:animals!gestations_mare_id_fkey(id, name, registry_number),
        stallion:animals!gestations_stallion_id_fkey(id, name),
        foal:animals!gestations_foal_id_fkey(id, name)
      `)
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            handleSupabaseError(error);
        }

        return data as Gestation;
    },

    /**
     * Cria uma nova gestação
     */
    async createGestation(input: CreateGestationInput): Promise<Gestation> {
        // Calcular data prevista de nascimento (340 dias - média para cavalos)
        const startDate = new Date(input.start_date);
        const expectedBirth = new Date(startDate);
        expectedBirth.setDate(expectedBirth.getDate() + 340);

        const { data, error } = await supabase
            .from('gestations')
            .insert({
                ...input,
                expected_birth_date: input.expected_birth_date || expectedBirth.toISOString().split('T')[0],
                status: input.status || 'confirmada'
            })
            .select()
            .single();

        if (error) handleSupabaseError(error);

        return data as Gestation;
    },

    /**
     * Atualiza status da gestação
     */
    async updateGestationStatus(
        id: string,
        status: Gestation['status'],
        foalId?: string
    ): Promise<Gestation> {
        const updateData: Partial<Gestation> = {
            status,
            updated_at: new Date().toISOString()
        };

        if (status === 'nascimento' && foalId) {
            updateData.foal_id = foalId;
            updateData.actual_birth_date = new Date().toISOString().split('T')[0];
        }

        const { data, error } = await supabase
            .from('gestations')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) handleSupabaseError(error);

        return data as Gestation;
    },

    /**
     * Busca gestações ativas (próximas do parto)
     */
    async getActiveGestations(harasId: string, daysAhead: number = 30): Promise<Gestation[]> {
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + daysAhead);

        const { data, error } = await supabase
            .from('gestations')
            .select(`
        *,
        mare:animals!gestations_mare_id_fkey(id, name, registry_number),
        stallion:animals!gestations_stallion_id_fkey(id, name)
      `)
            .eq('haras_id', harasId)
            .in('status', ['confirmada', 'em_andamento'])
            .lte('expected_birth_date', futureDate.toISOString().split('T')[0])
            .order('expected_birth_date', { ascending: true });

        if (error) handleSupabaseError(error);

        return data as Gestation[];
    },

    /**
     * Obtém estatísticas de reprodução
     */
    async getStats(harasId: string, year?: number): Promise<ReproductionStats> {
        const currentYear = year || new Date().getFullYear();
        const startDate = `${currentYear}-01-01`;
        const endDate = `${currentYear}-12-31`;

        const { data, error } = await supabase
            .from('gestations')
            .select('status')
            .eq('haras_id', harasId)
            .gte('start_date', startDate)
            .lte('start_date', endDate);

        if (error) handleSupabaseError(error);

        const stats: ReproductionStats = {
            totalGestations: data?.length || 0,
            confirmedGestations: data?.filter(g => g.status === 'confirmada').length || 0,
            births: data?.filter(g => g.status === 'nascimento').length || 0,
            abortions: data?.filter(g => g.status === 'aborto').length || 0,
            successRate: 0
        };

        if (stats.totalGestations > 0) {
            stats.successRate = (stats.births / stats.totalGestations) * 100;
        }

        return stats;
    }
};
