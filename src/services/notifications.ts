// ============================================
// NOTIFICATIONS SERVICE
// Gerencia notificações do sistema
// ============================================

import { supabase, applyPagination, formatPaginatedResponse, handleSupabaseError } from './base';
import type { Notification, NotificationType, PaginationParams, PaginatedResponse } from '@/types';

const NOTIFICATION_SELECT = 'id, user_id, tipo, titulo, mensagem, categoria, prioridade, link, lida, created_at';

interface NotificationRow {
    id: string;
    user_id: string;
    tipo: string;
    titulo: string;
    mensagem: string;
    categoria: string;
    prioridade?: string | null;
    link?: string | null;
    lida?: boolean | null;
    created_at: string;
}

function normalizeNotificationType(value: string): NotificationType {
    if (
        value === 'saude' ||
        value === 'reproducao' ||
        value === 'financeiro' ||
        value === 'geral' ||
        value === 'sistema'
    ) {
        return value;
    }

    return 'geral';
}

function mapNotification(row: NotificationRow): Notification {
    const data: Record<string, unknown> = {
        category: row.categoria,
    };

    if (row.prioridade) data.priority = row.prioridade;
    if (row.link) data.link = row.link;

    return {
        id: row.id,
        user_id: row.user_id,
        type: normalizeNotificationType(row.tipo),
        title: row.titulo,
        message: row.mensagem,
        read: row.lida ?? false,
        data,
        created_at: row.created_at,
    };
}

export const notificationsService = {
    requireUserId(userId?: string): string {
        if (!userId) throw new Error('userId is required');
        return userId;
    },

    /**
     * Lista notificações do usuário
     */
    async list(
        pagination: PaginationParams = { page: 1, limit: 20 },
        unreadOnly: boolean = false,
        userId?: string,
        includeTotal: boolean = false
    ): Promise<PaginatedResponse<Notification>> {
        const resolvedUserId = this.requireUserId(userId);

        let query = supabase
            .from('notifications')
            .select(NOTIFICATION_SELECT, includeTotal ? { count: 'exact' } : undefined)
            .eq('user_id', resolvedUserId);

        if (unreadOnly) {
            query = query.eq('lida', false);
        }

        query = query.order('created_at', { ascending: false });
        query = applyPagination(query, pagination);

        const { data, error, count } = await query;

        if (error) handleSupabaseError(error);

        const mapped = (data || []).map(mapNotification);
        return formatPaginatedResponse(mapped, includeTotal ? count || 0 : mapped.length, pagination);
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
    async markAllAsRead(userId?: string): Promise<void> {
        const resolvedUserId = this.requireUserId(userId);

        const { error } = await supabase
            .from('notifications')
            .update({ lida: true })
            .eq('user_id', resolvedUserId)
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
        data?: Record<string, unknown>,
        harasId?: string
    ): Promise<Notification> {
        const resolvedHarasId =
            harasId ||
            (typeof data?.harasId === 'string' ? data.harasId : undefined);

        if (!resolvedHarasId) {
            throw new Error('harasId is required');
        }

        const { data: notification, error } = await supabase
            .from('notifications')
            .insert({
                user_id: userId,
                haras_id: resolvedHarasId,
                tipo: type,
                titulo: title,
                mensagem: message,
                categoria: typeof data?.category === 'string' ? data.category : type,
                prioridade: typeof data?.priority === 'string' ? data.priority : null,
                link: typeof data?.link === 'string' ? data.link : null,
                lida: false,
            })
            .select(NOTIFICATION_SELECT)
            .single();

        if (error) handleSupabaseError(error);

        return mapNotification(notification);
    },

    /**
     * Conta notificações não lidas
     */
    async getUnreadCount(userId?: string): Promise<number> {
        const resolvedUserId = this.requireUserId(userId);

        const { count, error } = await supabase
            .from('notifications')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', resolvedUserId)
            .eq('lida', false);

        if (error) return 0;

        return count || 0;
    }
};
