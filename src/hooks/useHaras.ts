'use client'

// ============================================
// HOOKS - HARAS
// Hooks para gerenciar haras com TanStack Query
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { harasService } from '@/services/haras'
import { useUser } from '@/contexts/UserContext'
import type { Haras, HarasMember } from '@/types'

// Query Keys
export const harasKeys = {
    all: ['haras'] as const,
    current: () => [...harasKeys.all, 'current'] as const,
    detail: (id: string) => [...harasKeys.all, id] as const,
    members: (harasId: string) => [...harasKeys.detail(harasId), 'members'] as const,
    dashboardStats: (harasId: string) => [...harasKeys.detail(harasId), 'dashboard'] as const,
}

/**
 * Hook para buscar haras atual do usuário logado
 */
export function useCurrentHaras() {
    const { stableHarasId, isSessionReady } = useUser()
    const harasId = stableHarasId

    return useQuery({
        queryKey: [...harasKeys.current(), harasId],
        queryFn: () => (harasId ? harasService.getById(harasId) : null),
        enabled: !!harasId && isSessionReady,
    })
}

/**
 * Hook para buscar haras por ID
 */
export function useHaras(id: string) {
    return useQuery({
        queryKey: harasKeys.detail(id),
        queryFn: () => harasService.getById(id),
        enabled: !!id,
    })
}

/**
 * Hook para atualizar haras
 */
export function useUpdateHaras() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: Partial<Haras> }) =>
            harasService.update(id, input),
        onSuccess: (data) => {
            queryClient.setQueryData(harasKeys.detail(data.id), data)
            queryClient.invalidateQueries({ queryKey: harasKeys.current() })
        },
    })
}

/**
 * Hook para listar membros do haras
 */
export function useHarasMembers(harasId: string) {
    return useQuery({
        queryKey: harasKeys.members(harasId),
        queryFn: () => harasService.getMembers(harasId),
        enabled: !!harasId,
    })
}

/**
 * Hook para adicionar membro ao haras
 */
export function useAddHarasMember() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            harasId,
            userId,
            role,
            permissions
        }: {
            harasId: string;
            userId: string;
            role: HarasMember['role'];
            permissions?: Record<string, boolean>
        }) => harasService.addMember(harasId, userId, role, permissions),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: harasKeys.members(variables.harasId) })
        },
    })
}

/**
 * Hook para remover membro do haras
 */
export function useRemoveHarasMember() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ memberId, harasId }: { memberId: string; harasId: string }) =>
            harasService.removeMember(memberId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: harasKeys.members(variables.harasId) })
        },
    })
}

/**
 * Hook para estatísticas do dashboard
 */
export function useDashboardStats(harasId: string) {
    return useQuery({
        queryKey: harasKeys.dashboardStats(harasId),
        queryFn: () => harasService.getDashboardStats(harasId),
        enabled: !!harasId,
        // Atualiza a cada 5 minutos
        staleTime: 5 * 60 * 1000,
    })
}
