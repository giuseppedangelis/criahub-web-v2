// ============================================
// FINANCIAL SERVICE
// Gerencia transações financeiras
// ============================================

import { supabase, applyPagination, formatPaginatedResponse, handleSupabaseError } from './base';
import type {
    Transaction,
    TransactionFilters,
    CreateTransactionInput,
    PaginationParams,
    PaginatedResponse,
    FinancialSummary,
    TransactionCategory
} from '@/types';

export const financialService = {
    /**
     * Lista transações com filtros
     */
    async list(
        filters: TransactionFilters = {},
        pagination: PaginationParams = { page: 1, limit: 20 }
    ): Promise<PaginatedResponse<Transaction>> {
        let query = supabase
            .from('transactions')
            .select(`
        *,
        animal:animals(id, name),
        created_by_profile:profiles!transactions_created_by_fkey(id, full_name)
      `, { count: 'exact' });

        if (filters.haras_id) {
            query = query.eq('haras_id', filters.haras_id);
        }
        if (filters.type) {
            query = query.eq('type', filters.type);
        }
        if (filters.category) {
            query = query.eq('category', filters.category);
        }
        if (filters.start_date) {
            query = query.gte('date', filters.start_date);
        }
        if (filters.end_date) {
            query = query.lte('date', filters.end_date);
        }
        if (filters.animal_id) {
            query = query.eq('animal_id', filters.animal_id);
        }

        query = query.order('date', { ascending: false });
        query = applyPagination(query, pagination);

        const { data, error, count } = await query;

        if (error) handleSupabaseError(error);

        return formatPaginatedResponse(data || [], count || 0, pagination);
    },

    /**
     * Busca transação por ID
     */
    async getById(id: string): Promise<Transaction | null> {
        const { data, error } = await supabase
            .from('transactions')
            .select(`
        *,
        animal:animals(id, name),
        created_by_profile:profiles!transactions_created_by_fkey(id, full_name)
      `)
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            handleSupabaseError(error);
        }

        return data as Transaction;
    },

    /**
     * Cria uma nova transação
     */
    async create(input: CreateTransactionInput): Promise<Transaction> {
        // Obter usuário atual
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const { data, error } = await supabase
            .from('transactions')
            .insert({
                ...input,
                created_by: user.id
            })
            .select()
            .single();

        if (error) handleSupabaseError(error);

        return data as Transaction;
    },

    /**
     * Atualiza uma transação
     */
    async update(id: string, input: Partial<CreateTransactionInput>): Promise<Transaction> {
        const { data, error } = await supabase
            .from('transactions')
            .update({ ...input, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) handleSupabaseError(error);

        return data as Transaction;
    },

    /**
     * Exclui uma transação
     */
    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id);

        if (error) handleSupabaseError(error);
    },

    /**
     * Obtém resumo financeiro
     */
    async getSummary(
        harasId: string,
        startDate?: string,
        endDate?: string
    ): Promise<FinancialSummary> {
        let query = supabase
            .from('transactions')
            .select('type, category, amount')
            .eq('haras_id', harasId);

        if (startDate) {
            query = query.gte('date', startDate);
        }
        if (endDate) {
            query = query.lte('date', endDate);
        }

        const { data, error } = await query;

        if (error) handleSupabaseError(error);

        const summary: FinancialSummary = {
            totalRevenue: 0,
            totalExpenses: 0,
            balance: 0,
            revenueByCategory: {} as Record<TransactionCategory, number>,
            expensesByCategory: {} as Record<TransactionCategory, number>
        };

        data?.forEach(transaction => {
            const amount = Number(transaction.amount);

            if (transaction.type === 'receita') {
                summary.totalRevenue += amount;
                summary.revenueByCategory[transaction.category as TransactionCategory] =
                    (summary.revenueByCategory[transaction.category as TransactionCategory] || 0) + amount;
            } else {
                summary.totalExpenses += amount;
                summary.expensesByCategory[transaction.category as TransactionCategory] =
                    (summary.expensesByCategory[transaction.category as TransactionCategory] || 0) + amount;
            }
        });

        summary.balance = summary.totalRevenue - summary.totalExpenses;

        return summary;
    },

    /**
     * Obtém resumo mensal (para gráficos)
     */
    async getMonthlyData(harasId: string, year: number): Promise<{
        month: number;
        revenue: number;
        expenses: number;
    }[]> {
        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31`;

        const { data, error } = await supabase
            .from('transactions')
            .select('type, amount, date')
            .eq('haras_id', harasId)
            .gte('date', startDate)
            .lte('date', endDate);

        if (error) handleSupabaseError(error);

        // Agrupar por mês
        const monthlyData: Record<number, { revenue: number; expenses: number }> = {};

        for (let i = 1; i <= 12; i++) {
            monthlyData[i] = { revenue: 0, expenses: 0 };
        }

        data?.forEach(transaction => {
            const month = new Date(transaction.date).getMonth() + 1;
            const amount = Number(transaction.amount);

            if (transaction.type === 'receita') {
                monthlyData[month].revenue += amount;
            } else {
                monthlyData[month].expenses += amount;
            }
        });

        return Object.entries(monthlyData).map(([month, values]) => ({
            month: Number(month),
            revenue: values.revenue,
            expenses: values.expenses
        }));
    },

    /**
     * Transações recentes
     */
    async getRecent(harasId: string, limit: number = 5): Promise<Transaction[]> {
        const { data, error } = await supabase
            .from('transactions')
            .select(`
        *,
        animal:animals(id, name)
      `)
            .eq('haras_id', harasId)
            .order('date', { ascending: false })
            .limit(limit);

        if (error) handleSupabaseError(error);

        return data as Transaction[];
    }
};
