// ============================================
// HARAS SERVICE
// Gerencia operações do Haras
// ============================================

import { supabase, handleSupabaseError } from './base';
import type { Haras, HarasMember, Profile, DashboardStats } from '@/types';

function mapHaras(row: any): Haras {
    return {
        id: row.id,
        name: row.nome ?? row.name ?? '',
        owner_id: row.owner_id,
        cnpj: row.cnpj ?? null,
        address: row.address ?? row.endereco ?? null,
        city: row.city ?? row.cidade ?? null,
        state: row.state ?? row.estado ?? null,
        phone: row.phone ?? row.telefone ?? null,
        email: row.email ?? null,
        logo_url: row.logo_url ?? row.logo ?? null,
        subscription_plan: row.subscription_plan ?? row.plano ?? '',
        subscription_status: row.subscription_status ?? row.status_assinatura ?? '',
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
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            handleSupabaseError(error);
        }

        return data ? mapHaras(data) : null;
    },

    /**
     * Busca haras do usuário atual
     */
    async getCurrentUserHaras(): Promise<Haras | null> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data: profile } = await supabase
            .from('profiles')
            .select('haras_id')
            .eq('id', user.id)
            .single();

        if (!profile?.haras_id) return null;

        return this.getById(profile.haras_id);
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
            .select()
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
        // Contar animais
        const { data: animals, error: animalsError } = await supabase
            .from('animals')
            .select('sexo')
            .eq('haras_id', harasId)
            .eq('status', 'Ativo');

        if (animalsError) handleSupabaseError(animalsError);

        // Contar gestações ativas
        const { count: gestationsCount, error: gestationsError } = await supabase
            .from('gestations')
            .select('*', { count: 'exact', head: true })
            .eq('haras_id', harasId)
            .in('status', ['confirmada', 'em_andamento']);

        if (gestationsError) handleSupabaseError(gestationsError);

        // Contar serviços pendentes
        const { count: servicesCount, error: servicesError } = await supabase
            .from('service_orders')
            .select('*', { count: 'exact', head: true })
            .eq('haras_id', harasId)
            .in('status', ['pendente', 'em_andamento']);

        if (servicesError) handleSupabaseError(servicesError);

        // Calcular receitas/despesas do mês
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

        const { data: transactions, error: transError } = await supabase
            .from('transactions')
            .select('tipo, valor')
            .eq('haras_id', harasId)
            .gte('data_transacao', firstDay)
            .lte('data_transacao', lastDay);

        if (transError) handleSupabaseError(transError);

        let monthlyRevenue = 0;
        let monthlyExpenses = 0;
        transactions?.forEach(t => {
            const type = (t as any).tipo;
            const amount = Number((t as any).valor);
            if (type === 'Receita') {
                monthlyRevenue += amount;
            } else {
                monthlyExpenses += amount;
            }
        });

        // Contar notificações não lidas
        const { data: { user } } = await supabase.auth.getUser();
        let unreadNotifications = 0;

        if (user) {
            const { count } = await supabase
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('lida', false);

            unreadNotifications = count || 0;
        }

        return {
            totalAnimals: animals?.length || 0,
            totalMales: animals?.filter(a => a.sexo === 'Macho').length || 0,
            totalFemales: animals?.filter(a => a.sexo === 'Fêmea').length || 0,
            activeGestations: gestationsCount || 0,
            pendingServices: servicesCount || 0,
            monthlyRevenue,
            monthlyExpenses,
            recentNotifications: unreadNotifications
        };
    }
};
