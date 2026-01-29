'use client'

// ============================================
// HOOKS - REPRODUCTION
// Hooks para gerenciar reprodução com TanStack Query
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reproductionService } from '@/services/reproduction'
import type {
    GestationFilters,
    CreateReproductiveEventInput,
    CreateGestationInput,
    PaginationParams,
    Gestation
} from '@/types'

// Query Keys
export const reproductionKeys = {
    all: ['reproduction'] as const,
    events: () => [...reproductionKeys.all, 'events'] as const,
    eventsByHaras: (harasId: string, pagination: PaginationParams) =>
        [...reproductionKeys.events(), harasId, pagination] as const,
    eventsByAnimal: (animalId: string) =>
        [...reproductionKeys.events(), 'animal', animalId] as const,
    gestations: () => [...reproductionKeys.all, 'gestations'] as const,
    gestationsList: (filters: GestationFilters, pagination: PaginationParams) =>
        [...reproductionKeys.gestations(), filters, pagination] as const,
    gestationDetail: (id: string) => [...reproductionKeys.gestations(), id] as const,
    activeGestations: (harasId: string) =>
        [...reproductionKeys.gestations(), 'active', harasId] as const,
    stats: (harasId: string, year?: number) =>
        [...reproductionKeys.all, 'stats', harasId, year] as const,
}

/**
 * Hook para listar eventos reprodutivos
 */
export function useReproductiveEvents(
    harasId: string,
    pagination: PaginationParams = { page: 1, limit: 20 }
) {
    return useQuery({
        queryKey: reproductionKeys.eventsByHaras(harasId, pagination),
        queryFn: () => reproductionService.listEvents(harasId, pagination),
        enabled: !!harasId,
    })
}

/**
 * Hook para eventos de um animal específico
 */
export function useAnimalReproductiveEvents(animalId: string) {
    return useQuery({
        queryKey: reproductionKeys.eventsByAnimal(animalId),
        queryFn: () => reproductionService.getEventsByAnimal(animalId),
        enabled: !!animalId,
    })
}

/**
 * Hook para criar evento reprodutivo
 */
export function useCreateReproductiveEvent() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (input: CreateReproductiveEventInput) =>
            reproductionService.createEvent(input),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: reproductionKeys.events() })
            if (variables.animal_id) {
                queryClient.invalidateQueries({
                    queryKey: reproductionKeys.eventsByAnimal(variables.animal_id)
                })
            }
        },
    })
}

/**
 * Hook para listar gestações
 */
export function useGestations(
    filters: GestationFilters = {},
    pagination: PaginationParams = { page: 1, limit: 20 }
) {
    return useQuery({
        queryKey: reproductionKeys.gestationsList(filters, pagination),
        queryFn: () => reproductionService.listGestations(filters, pagination),
    })
}

/**
 * Hook para buscar gestação por ID
 */
export function useGestation(id: string) {
    return useQuery({
        queryKey: reproductionKeys.gestationDetail(id),
        queryFn: () => reproductionService.getGestationById(id),
        enabled: !!id,
    })
}

/**
 * Hook para gestações ativas (próximas do parto)
 */
export function useActiveGestations(harasId: string, daysAhead: number = 30) {
    return useQuery({
        queryKey: reproductionKeys.activeGestations(harasId),
        queryFn: () => reproductionService.getActiveGestations(harasId, daysAhead),
        enabled: !!harasId,
    })
}

/**
 * Hook para criar gestação
 */
export function useCreateGestation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (input: CreateGestationInput) =>
            reproductionService.createGestation(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reproductionKeys.gestations() })
        },
    })
}

/**
 * Hook para atualizar status da gestação
 */
export function useUpdateGestationStatus() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, status, foalId }: {
            id: string;
            status: Gestation['status'];
            foalId?: string
        }) => reproductionService.updateGestationStatus(id, status, foalId),
        onSuccess: (data) => {
            queryClient.setQueryData(reproductionKeys.gestationDetail(data.id), data)
            queryClient.invalidateQueries({ queryKey: reproductionKeys.gestations() })
        },
    })
}

/**
 * Hook para estatísticas de reprodução
 */
export function useReproductionStats(harasId: string, year?: number) {
    return useQuery({
        queryKey: reproductionKeys.stats(harasId, year),
        queryFn: () => reproductionService.getStats(harasId, year),
        enabled: !!harasId,
    })
}
