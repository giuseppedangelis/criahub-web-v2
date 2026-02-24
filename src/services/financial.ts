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
    TransactionCategory,
    TransactionType
} from '@/types';

const CATEGORY_VALUES: TransactionCategory[] = [
    'venda_animal',
    'servico_reproducao',
    'premiacao',
    'alimentacao',
    'veterinario',
    'medicamento',
    'equipamento',
    'funcionario',
    'infraestrutura',
    'outros',
];

const CATEGORY_MAP: Record<string, TransactionCategory> = {
    'venda de cavalo': 'venda_animal',
    'venda de animal': 'venda_animal',
    'servico de cobertura': 'servico_reproducao',
    'serviço de cobertura': 'servico_reproducao',
    'servico de reproducao': 'servico_reproducao',
    'serviço de reprodução': 'servico_reproducao',
    'venda de embriao': 'servico_reproducao',
    'venda de embrião': 'servico_reproducao',
    'venda de semen': 'servico_reproducao',
    'venda de sêmen': 'servico_reproducao',
    'premios': 'premiacao',
    'prêmios': 'premiacao',
    'medicamentos': 'medicamento',
    'equipamentos': 'equipamento',
    'funcionarios': 'funcionario',
    'funcionários': 'funcionario',
};

const TYPE_MAP: Record<string, TransactionType> = {
    entrada: 'receita',
    receita: 'receita',
    saida: 'despesa',
    saída: 'despesa',
    despesa: 'despesa',
};

function mapTypeToDb(value: string | null | undefined): string {
    const normalized = normalizeType(value);
    return normalized === 'receita' ? 'Receita' : 'Despesa';
}

function normalizeCategory(value: string | null | undefined): TransactionCategory {
    if (!value) return 'outros';
    if (CATEGORY_VALUES.includes(value as TransactionCategory)) return value as TransactionCategory;
    const key = value.toLowerCase().trim();
    return CATEGORY_MAP[key] || 'outros';
}

function normalizeType(value: string | null | undefined): TransactionType {
    if (!value) return 'despesa';
    const key = value.toLowerCase().trim();
    return TYPE_MAP[key] || 'despesa';
}

function mapTransactionRow(row: any): Transaction {
    return {
        id: row.id,
        haras_id: row.haras_id,
        type: normalizeType(row.tipo),
        category: normalizeCategory(row.categoria),
        amount: Number(row.valor) || 0,
        description: row.descricao ?? '',
        date: row.data_transacao ?? '',
        animal_id: row.animal_id ?? null,
        reference_id: row.reference_id ?? null,
        created_by: row.created_by ?? null,
        created_at: row.created_at ?? null,
        updated_at: row.updated_at ?? null,
        observations: row.observacoes ?? null,
        payment_method: row.forma_pagamento ?? null,
        animal: row.animal
            ? {
                id: row.animal.id,
                name: row.animal.nome ?? row.animal.name ?? '',
            }
            : null,
        created_by_profile: null,
    };
}

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
        animal:animals(id, nome)
      `, { count: 'exact' });

        if (filters.haras_id) {
            query = query.eq('haras_id', filters.haras_id);
        }
        if (filters.type) {
            query = query.eq('tipo', mapTypeToDb(filters.type));
        }
        if (filters.category) {
            query = query.eq('categoria', filters.category);
        }
        if (filters.start_date) {
            query = query.gte('data_transacao', filters.start_date);
        }
        if (filters.end_date) {
            query = query.lte('data_transacao', filters.end_date);
        }
        if (filters.animal_id) {
            query = query.eq('animal_id', filters.animal_id);
        }

        query = query.order('data_transacao', { ascending: false });
        query = applyPagination(query, pagination);

        const { data, error, count } = await query;

        if (error) handleSupabaseError(error);

        const mappedData = (data || []).map(mapTransactionRow);

        return formatPaginatedResponse(mappedData, count || 0, pagination);
    },

    /**
     * Busca transação por ID
     */
    async getById(id: string): Promise<Transaction | null> {
        const { data, error } = await supabase
            .from('transactions')
            .select(`
        *,
        animal:animals(id, nome)
      `)
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            handleSupabaseError(error);
        }

        return data ? mapTransactionRow(data) : null;
    },

    /**
     * Cria uma nova transação
     */
    async create(input: CreateTransactionInput): Promise<Transaction> {
        const { data, error } = await supabase
            .from('transactions')
            .insert({
                haras_id: input.haras_id,
                tipo: mapTypeToDb(input.type),
                categoria: input.category,
                valor: input.amount,
                descricao: input.description,
                data_transacao: input.date,
                animal_id: input.animal_id ?? null,
                observacoes: input.observations ?? null,
                forma_pagamento: input.payment_method ?? null,
            })
            .select()
            .single();

        if (error) handleSupabaseError(error);

        return mapTransactionRow(data);
    },

    /**
     * Atualiza uma transação
     */
    async update(id: string, input: Partial<CreateTransactionInput>): Promise<Transaction> {
        const updateData: Record<string, unknown> = {
            updated_at: new Date().toISOString(),
        };

        if (input.type !== undefined) updateData.tipo = mapTypeToDb(input.type);
        if (input.category !== undefined) updateData.categoria = input.category;
        if (input.amount !== undefined) updateData.valor = input.amount;
        if (input.description !== undefined) updateData.descricao = input.description;
        if (input.date !== undefined) updateData.data_transacao = input.date;
        if (input.animal_id !== undefined) updateData.animal_id = input.animal_id;
        if (input.observations !== undefined) updateData.observacoes = input.observations;
        if (input.payment_method !== undefined) updateData.forma_pagamento = input.payment_method;

        const { data, error } = await supabase
            .from('transactions')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) handleSupabaseError(error);

        return mapTransactionRow(data);
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
            .select('tipo, categoria, valor')
            .eq('haras_id', harasId);

        if (startDate) {
            query = query.gte('data_transacao', startDate);
        }
        if (endDate) {
            query = query.lte('data_transacao', endDate);
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
            const amount = Number((transaction as any).valor);
            const type = normalizeType((transaction as any).tipo);
            const category = normalizeCategory((transaction as any).categoria);

            if (type === 'receita') {
                summary.totalRevenue += amount;
                summary.revenueByCategory[category] =
                    (summary.revenueByCategory[category] || 0) + amount;
            } else {
                summary.totalExpenses += amount;
                summary.expensesByCategory[category] =
                    (summary.expensesByCategory[category] || 0) + amount;
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
            .select('tipo, valor, data_transacao')
            .eq('haras_id', harasId)
            .gte('data_transacao', startDate)
            .lte('data_transacao', endDate);

        if (error) handleSupabaseError(error);

        // Agrupar por mês
        const monthlyData: Record<number, { revenue: number; expenses: number }> = {};

        for (let i = 1; i <= 12; i++) {
            monthlyData[i] = { revenue: 0, expenses: 0 };
        }

        data?.forEach(transaction => {
            const month = new Date((transaction as any).data_transacao).getMonth() + 1;
            const amount = Number((transaction as any).valor);
            const type = normalizeType((transaction as any).tipo);

            if (type === 'receita') {
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
        animal:animals(id, nome)
      `)
            .eq('haras_id', harasId)
            .order('data_transacao', { ascending: false })
            .limit(limit);

        if (error) handleSupabaseError(error);

        return (data || []).map(mapTransactionRow);
    }
};
