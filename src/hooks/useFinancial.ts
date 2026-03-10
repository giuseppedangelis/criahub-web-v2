'use client'

// ============================================
// HOOKS - FINANCIAL
// Hooks para gerenciar finanças com TanStack Query
// ============================================

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { financialService } from '@/services/financial'
import type {
    TransactionFilters,
    CreateTransactionInput,
    PaginationParams
} from '@/types'

// Query Keys
export const financialKeys = {
    all: ['financial'] as const,
    transactions: () => [...financialKeys.all, 'transactions'] as const,
    transactionsList: (filters: TransactionFilters, pagination: PaginationParams) =>
        [...financialKeys.transactions(), filters, pagination] as const,
    transactionDetail: (id: string) => [...financialKeys.transactions(), id] as const,
    recent: (harasId: string, limit: number) =>
        [...financialKeys.transactions(), 'recent', harasId, limit] as const,
    summary: (harasId: string, startDate?: string, endDate?: string) =>
        [...financialKeys.all, 'summary', harasId, startDate, endDate] as const,
    monthly: (harasId: string, year: number) =>
        [...financialKeys.all, 'monthly', harasId, year] as const,
}

/**
 * Hook para listar transações
 */
export function useTransactions(
    filters: TransactionFilters = {},
    pagination: PaginationParams = { page: 1, limit: 20 },
    enabled: boolean = true
) {
    return useQuery({
        queryKey: financialKeys.transactionsList(filters, pagination),
        queryFn: () => financialService.list(filters, pagination),
        enabled,
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
    })
}

/**
 * Hook para buscar transação por ID
 */
export function useTransaction(id: string) {
    return useQuery({
        queryKey: financialKeys.transactionDetail(id),
        queryFn: () => financialService.getById(id),
        enabled: !!id,
        staleTime: 60_000,
        refetchOnWindowFocus: false,
    })
}

/**
 * Hook para transações recentes
 */
export function useRecentTransactions(harasId: string, limit: number = 5) {
    return useQuery({
        queryKey: financialKeys.recent(harasId, limit),
        queryFn: () => financialService.getRecent(harasId, limit),
        enabled: !!harasId,
        staleTime: 60_000,
        refetchOnWindowFocus: false,
    })
}

/**
 * Hook para criar transação
 */
export function useCreateTransaction() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (input: CreateTransactionInput) => financialService.create(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: financialKeys.transactions() })
            queryClient.invalidateQueries({ queryKey: [...financialKeys.all, 'summary'] })
        },
    })
}

/**
 * Hook para atualizar transação
 */
export function useUpdateTransaction() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: Partial<CreateTransactionInput> }) =>
            financialService.update(id, input),
        onSuccess: (data) => {
            queryClient.setQueryData(financialKeys.transactionDetail(data.id), data)
            queryClient.invalidateQueries({ queryKey: financialKeys.transactions() })
            queryClient.invalidateQueries({ queryKey: [...financialKeys.all, 'summary'] })
        },
    })
}

/**
 * Hook para deletar transação
 */
export function useDeleteTransaction() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => financialService.delete(id),
        onSuccess: (_, id) => {
            queryClient.removeQueries({ queryKey: financialKeys.transactionDetail(id) })
            queryClient.invalidateQueries({ queryKey: financialKeys.transactions() })
            queryClient.invalidateQueries({ queryKey: [...financialKeys.all, 'summary'] })
        },
    })
}

/**
 * Hook para resumo financeiro
 */
export function useFinancialSummary(
    harasId: string,
    startDate?: string,
    endDate?: string
) {
    return useQuery({
        queryKey: financialKeys.summary(harasId, startDate, endDate),
        queryFn: () => financialService.getSummary(harasId, startDate, endDate),
        enabled: !!harasId,
        staleTime: 60_000,
        refetchOnWindowFocus: false,
    })
}

/**
 * Hook para dados mensais (gráficos)
 */
export function useMonthlyFinancialData(harasId: string, year: number) {
    return useQuery({
        queryKey: financialKeys.monthly(harasId, year),
        queryFn: () => financialService.getMonthlyData(harasId, year),
        enabled: !!harasId,
        staleTime: 60_000,
        refetchOnWindowFocus: false,
    })
}
