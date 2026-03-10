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

    const errorMessage =
        typeof error?.message === 'string' && error.message.length > 0
            ? error.message
            : 'Erro ao acessar o banco de dados';

    console.error('Supabase Error:', {
        code: error?.code ?? null,
        message: errorMessage,
        details: error?.details ?? null,
        hint: error?.hint ?? null,
    });

    throw new Error(errorMessage);
}

