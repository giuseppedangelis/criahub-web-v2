// ============================================
// HARAS SERVICE
// Gerencia operações do Haras
// ============================================

import { supabase, handleSupabaseError } from './base';
import type { Haras, HarasMember, Profile, DashboardStats } from '@/types';

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

        return data as Haras;
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
        const { data, error } = await supabase
            .from('haras')
            .update({ ...input, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) handleSupabaseError(error);

        return data as Haras;
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
            .select('sex')
            .eq('haras_id', harasId)
            .eq('status', 'ativo');

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
            .select('type, amount')
            .eq('haras_id', harasId)
            .gte('date', firstDay)
            .lte('date', lastDay);

        if (transError) handleSupabaseError(transError);

        let monthlyRevenue = 0;
        let monthlyExpenses = 0;
        transactions?.forEach(t => {
            if (t.type === 'receita') {
                monthlyRevenue += Number(t.amount);
            } else {
                monthlyExpenses += Number(t.amount);
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
                .eq('read', false);

            unreadNotifications = count || 0;
        }

        return {
            totalAnimals: animals?.length || 0,
            totalMales: animals?.filter(a => a.sex === 'M').length || 0,
            totalFemales: animals?.filter(a => a.sex === 'F').length || 0,
            activeGestations: gestationsCount || 0,
            pendingServices: servicesCount || 0,
            monthlyRevenue,
            monthlyExpenses,
            recentNotifications: unreadNotifications
        };
    }
};
