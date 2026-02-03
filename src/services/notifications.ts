// ============================================
// NOTIFICATIONS SERVICE
// Gerencia notificações do sistema
// ============================================

import { supabase, applyPagination, formatPaginatedResponse, handleSupabaseError } from './base';
import type { Notification, NotificationType, PaginationParams, PaginatedResponse } from '@/types';

function mapNotification(row: any): Notification {
    return {
        id: row.id,
        user_id: row.user_id,
        type: row.type,
        title: row.title,
        message: row.message,
        read: row.lida ?? row.read ?? false,
        data: row.data ?? null,
        created_at: row.created_at
    };
}

export const notificationsService = {
    /**
     * Lista notificações do usuário
     */
    async list(
        pagination: PaginationParams = { page: 1, limit: 20 },
        unreadOnly: boolean = false
    ): Promise<PaginatedResponse<Notification>> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        let query = supabase
            .from('notifications')
            .select('*', { count: 'exact' })
            .eq('user_id', user.id);

        if (unreadOnly) {
            query = query.eq('lida', false);
        }

        query = query.order('created_at', { ascending: false });
        query = applyPagination(query, pagination);

        const { data, error, count } = await query;

        if (error) handleSupabaseError(error);

        const mapped = (data || []).map(mapNotification);
        return formatPaginatedResponse(mapped, count || 0, pagination);
    },

    /**
     * Marca notificação como lida
     */
    async markAsRead(notificationId: string): Promise<void> {
        const { error } = await supabase
            .from('notifications')
            .update({ lida: true })
            .eq('id', notificationId);

        if (error) handleSupabaseError(error);
    },

    /**
     * Marca todas como lidas
     */
    async markAllAsRead(): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const { error } = await supabase
            .from('notifications')
            .update({ lida: true })
            .eq('user_id', user.id)
            .eq('lida', false);

        if (error) handleSupabaseError(error);
    },

    /**
     * Deleta notificação
     */
    async delete(notificationId: string): Promise<void> {
        const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('id', notificationId);

        if (error) handleSupabaseError(error);
    },

    /**
     * Cria uma notificação (para uso interno/admin)
     */
    async create(
        userId: string,
        type: NotificationType,
        title: string,
        message: string,
        data?: Record<string, unknown>
    ): Promise<Notification> {
        const { data: notification, error } = await supabase
            .from('notifications')
            .insert({
                user_id: userId,
                type,
                title,
                message,
                data,
                lida: false
            })
            .select()
            .single();

        if (error) handleSupabaseError(error);

        return mapNotification(notification);
    },

    /**
     * Conta notificações não lidas
     */
    async getUnreadCount(): Promise<number> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return 0;

        const { count, error } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('lida', false);

        if (error) return 0;

        return count || 0;
    }
};
