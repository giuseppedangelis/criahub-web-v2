// ============================================
// BASE SERVICE - Funções utilitárias comuns
// ============================================

import { createClient } from '@/lib/supabase/client';
import type { PaginationParams, PaginatedResponse } from '@/types';

export const supabase = createClient();

/**
 * Aplica paginação a uma query do Supabase
 */
export function applyPagination<T>(
    query: any,
    params: PaginationParams
): any {
    const { page, limit } = params;
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    return query.range(from, to);
}

/**
 * Formata resposta paginada
 */
export function formatPaginatedResponse<T>(
    data: T[],
    count: number,
    params: PaginationParams
): PaginatedResponse<T> {
    return {
        data,
        total: count,
        page: params.page,
        limit: params.limit,
        totalPages: Math.ceil(count / params.limit),
    };
}

/**
 * Verifica se o erro é um AbortError (cancelamento do cliente)
 */
function isAbortError(error: any): boolean {
    return (
        error?.name === 'AbortError' ||
        error instanceof DOMException && error.name === 'AbortError' ||
        error?.message?.includes('signal is aborted') ||
        error?.message?.includes('The operation was aborted') ||
        error?.message?.includes('The user aborted a request')
    );
}

/**
 * Trata erros do Supabase
 */
export function handleSupabaseError(error: any): never {
    // Ignorar AbortErrors - são cancelamentos do cliente (ex: componente desmontou)
    if (isAbortError(error)) {
        // Re-lançar como AbortError para que TanStack Query possa tratá-lo corretamente
        throw error;
    }

    console.error('Supabase Error:', error);
    throw new Error(error.message || 'Erro ao acessar o banco de dados');
}

/**
 * Obtém o haras_id do usuário atual
 */
export async function getCurrentHarasId(): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
        .from('profiles')
        .select('haras_id')
        .eq('id', user.id)
        .single();

    return profile?.haras_id || null;
}
