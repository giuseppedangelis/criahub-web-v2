// ============================================
// HARAS SERVICE
// Gerencia operações do Haras
// ============================================

import { supabase, handleSupabaseError } from './base';
import { dashboardService } from './dashboard';
import type { Haras, HarasMember, Profile, DashboardStats } from '@/types';

const HARAS_SELECT = `
    id,
    nome,
    proprietario,
    cidade,
    estado,
    telefone,
    email,
    logo_url,
    subscription_plan,
    subscription_status,
    subscription_due_date,
    subscription_value,
    subscription_start_date,
    created_at,
    updated_at
`;

function mapHaras(row: any): Haras {
    return {
        id: row.id,
        name: row.nome ?? row.name ?? '',
        owner_id: row.owner_id ?? null,
        cnpj: row.cnpj ?? null,
        address: row.address ?? row.endereco ?? null,
        city: row.city ?? row.cidade ?? null,
        state: row.state ?? row.estado ?? null,
        phone: row.phone ?? row.telefone ?? null,
        email: row.email ?? null,
        logo_url: row.logo_url ?? null,
        subscription_plan: row.subscription_plan ?? '',
        subscription_status: row.subscription_status ?? '',
        subscription_due_date: row.subscription_due_date ?? null,
        subscription_value: row.subscription_value ?? null,
        subscription_start_date: row.subscription_start_date ?? null,
        created_at: row.created_at,
        updated_at: row.updated_at
    };
}

export const harasService = {
    /**
     * Busca haras por ID
     */
    async getById(id: string): Promise<Haras | null> {
        const { data, error } = await supabase
            .from('haras')
            .select(HARAS_SELECT)
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            handleSupabaseError(error);
        }

        return data ? mapHaras(data) : null;
    },

    /**
     * Atualiza dados do haras
     */
    async update(id: string, input: Partial<Haras>): Promise<Haras> {
        const payload: Record<string, any> = {
            updated_at: new Date().toISOString(),
        };

        if (input.name !== undefined) payload.nome = input.name;
        if (input.city !== undefined) payload.cidade = input.city;
        if (input.state !== undefined) payload.estado = input.state;
        if (input.phone !== undefined) payload.telefone = input.phone;
        if (input.email !== undefined) payload.email = input.email;
        if (input.logo_url !== undefined) payload.logo_url = input.logo_url;
        if (input.subscription_plan !== undefined) payload.subscription_plan = input.subscription_plan;
        if (input.subscription_status !== undefined) payload.subscription_status = input.subscription_status;
        if (input.subscription_due_date !== undefined) payload.subscription_due_date = input.subscription_due_date;
        if (input.subscription_value !== undefined) payload.subscription_value = input.subscription_value;
        if (input.subscription_start_date !== undefined) payload.subscription_start_date = input.subscription_start_date;

        const { data, error } = await supabase
            .from('haras')
            .update(payload)
            .eq('id', id)
            .select(HARAS_SELECT)
            .single();

        if (error) handleSupabaseError(error);

        return mapHaras(data);
    },

    /**
     * Lista membros do haras
     */
    async getMembers(harasId: string): Promise<(HarasMember & { profile: Profile })[]> {
        const { data, error } = await supabase
            .from('haras_members')
            .select(`
        *,
        profile:profiles(*)
      `)
            .eq('haras_id', harasId);

        if (error) handleSupabaseError(error);

        return data as (HarasMember & { profile: Profile })[];
    },

    /**
     * Adiciona membro ao haras
     */
    async addMember(
        harasId: string,
        userId: string,
        role: HarasMember['role'],
        permissions: Record<string, boolean> = {}
    ): Promise<HarasMember> {
        const { data, error } = await supabase
            .from('haras_members')
            .insert({
                haras_id: harasId,
                user_id: userId,
                role,
                permissions
            })
            .select()
            .single();

        if (error) handleSupabaseError(error);

        return data as HarasMember;
    },

    /**
     * Remove membro do haras
     */
    async removeMember(memberId: string): Promise<void> {
        const { error } = await supabase
            .from('haras_members')
            .delete()
            .eq('id', memberId);

        if (error) handleSupabaseError(error);
    },

    /**
     * Obtém estatísticas do dashboard
     */
    async getDashboardStats(harasId: string): Promise<DashboardStats> {
        const snapshot = await dashboardService.getSnapshot(harasId, {
            months: 1,
            eventsLimit: 1,
            activitiesLimit: 1,
        });

        return {
            totalAnimals: snapshot.stats.totalAnimals,
            totalMales: snapshot.stats.totalMales,
            totalFemales: snapshot.stats.totalFemales,
            activeGestations: snapshot.stats.activeGestations,
            pendingServices: snapshot.stats.pendingServices,
            monthlyRevenue: snapshot.stats.monthlyRevenue,
            monthlyExpenses: snapshot.stats.monthlyExpenses,
            recentNotifications: snapshot.stats.unreadNotifications,
        };
    }
};
