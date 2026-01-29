// ============================================
// ANIMALS SERVICE
// Gerencia operações com animais
// ============================================

import { supabase, applyPagination, formatPaginatedResponse, handleSupabaseError } from './base';
import type {
    Animal,
    AnimalFilters,
    CreateAnimalInput,
    UpdateAnimalInput,
    PaginationParams,
    PaginatedResponse
} from '@/types';

export const animalsService = {
    /**
     * Lista animais com filtros e paginação
     */
    async list(
        filters: AnimalFilters = {},
        pagination: PaginationParams = { page: 1, limit: 20 }
    ): Promise<PaginatedResponse<Animal>> {
        let query = supabase
            .from('animals')
            .select('*, father:animals!animals_father_id_fkey(id, name), mother:animals!animals_mother_id_fkey(id, name)', { count: 'exact' });

        // Aplicar filtros
        if (filters.haras_id) {
            query = query.eq('haras_id', filters.haras_id);
        }
        if (filters.sex) {
            query = query.eq('sex', filters.sex);
        }
        if (filters.category) {
            query = query.eq('category', filters.category);
        }
        if (filters.status) {
            query = query.eq('status', filters.status);
        }
        if (filters.search) {
            query = query.or(`name.ilike.%${filters.search}%,registry_number.ilike.%${filters.search}%`);
        }

        // Ordenar e paginar
        query = query.order('name', { ascending: true });
        query = applyPagination(query, pagination);

        const { data, error, count } = await query;

        if (error) handleSupabaseError(error);

        return formatPaginatedResponse(data || [], count || 0, pagination);
    },

    /**
     * Busca um animal pelo ID
     */
    async getById(id: string): Promise<Animal | null> {
        const { data, error } = await supabase
            .from('animals')
            .select(`
        *,
        father:animals!animals_father_id_fkey(id, name, registry_number),
        mother:animals!animals_mother_id_fkey(id, name, registry_number),
        haras(id, name)
      `)
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // Not found
            handleSupabaseError(error);
        }

        return data as Animal;
    },

    /**
     * Cria um novo animal
     */
    async create(input: CreateAnimalInput): Promise<Animal> {
        const { data, error } = await supabase
            .from('animals')
            .insert(input)
            .select()
            .single();

        if (error) handleSupabaseError(error);

        return data as Animal;
    },

    /**
     * Atualiza um animal
     */
    async update(input: UpdateAnimalInput): Promise<Animal> {
        const { id, ...updateData } = input;

        const { data, error } = await supabase
            .from('animals')
            .update({ ...updateData, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) handleSupabaseError(error);

        return data as Animal;
    },

    /**
     * Exclui um animal (soft delete - muda status para 'morto')
     */
    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('animals')
            .update({ status: 'morto', updated_at: new Date().toISOString() })
            .eq('id', id);

        if (error) handleSupabaseError(error);
    },

    /**
     * Busca filhos de um animal
     */
    async getOffspring(animalId: string): Promise<Animal[]> {
        const { data, error } = await supabase
            .from('animals')
            .select('*')
            .or(`father_id.eq.${animalId},mother_id.eq.${animalId}`)
            .order('birth_date', { ascending: false });

        if (error) handleSupabaseError(error);

        return data as Animal[];
    },

    /**
     * Busca machos disponíveis para reprodução
     */
    async getStallions(harasId: string): Promise<Animal[]> {
        const { data, error } = await supabase
            .from('animals')
            .select('id, name, registry_number')
            .eq('haras_id', harasId)
            .eq('sex', 'M')
            .in('category', ['garanhao'])
            .eq('status', 'ativo')
            .order('name');

        if (error) handleSupabaseError(error);

        return data as Animal[];
    },

    /**
     * Busca fêmeas disponíveis para reprodução
     */
    async getMares(harasId: string): Promise<Animal[]> {
        const { data, error } = await supabase
            .from('animals')
            .select('id, name, registry_number')
            .eq('haras_id', harasId)
            .eq('sex', 'F')
            .in('category', ['egua'])
            .eq('status', 'ativo')
            .order('name');

        if (error) handleSupabaseError(error);

        return data as Animal[];
    },

    /**
     * Conta animais por status
     */
    async countByStatus(harasId: string): Promise<Record<string, number>> {
        const { data, error } = await supabase
            .from('animals')
            .select('status')
            .eq('haras_id', harasId);

        if (error) handleSupabaseError(error);

        const counts: Record<string, number> = {};
        data?.forEach(item => {
            counts[item.status] = (counts[item.status] || 0) + 1;
        });

        return counts;
    },

    /**
     * Conta animais por sexo
     */
    async countBySex(harasId: string): Promise<{ males: number; females: number }> {
        const { data, error } = await supabase
            .from('animals')
            .select('sex')
            .eq('haras_id', harasId)
            .eq('status', 'ativo');

        if (error) handleSupabaseError(error);

        const males = data?.filter(a => a.sex === 'M').length || 0;
        const females = data?.filter(a => a.sex === 'F').length || 0;

        return { males, females };
    }
};
