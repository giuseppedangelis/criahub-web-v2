'use client'

// ============================================
// HOOKS - ANIMALS
// Hooks para gerenciar estado de animais com TanStack Query
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { animalsService } from '@/services/animals'
import type {
    Animal,
    AnimalFilters,
    CreateAnimalInput,
    UpdateAnimalInput,
    PaginationParams
} from '@/types'

// Query Keys
export const animalKeys = {
    all: ['animals'] as const,
    lists: () => [...animalKeys.all, 'list'] as const,
    list: (filters: AnimalFilters, pagination: PaginationParams) =>
        [...animalKeys.lists(), filters, pagination] as const,
    details: () => [...animalKeys.all, 'detail'] as const,
    detail: (id: string) => [...animalKeys.details(), id] as const,
    offspring: (id: string) => [...animalKeys.detail(id), 'offspring'] as const,
    genealogy: (id: string) => [...animalKeys.detail(id), 'genealogy'] as const,
    stallions: (harasId: string) => [...animalKeys.all, 'stallions', harasId] as const,
    mares: (harasId: string) => [...animalKeys.all, 'mares', harasId] as const,
}

/**
 * Hook para listar animais
 */
export function useAnimals(
    filters: AnimalFilters = {},
    pagination: PaginationParams = { page: 1, limit: 20 }
) {
    return useQuery({
        queryKey: animalKeys.list(filters, pagination),
        queryFn: () => animalsService.list(filters, pagination),
    })
}

/**
 * Hook para buscar animal por ID
 */
export function useAnimal(id: string) {
    return useQuery({
        queryKey: animalKeys.detail(id),
        queryFn: () => animalsService.getById(id),
        enabled: !!id,
    })
}

/**
 * Hook para buscar filhos de um animal
 */
export function useAnimalOffspring(animalId: string) {
    return useQuery({
        queryKey: animalKeys.offspring(animalId),
        queryFn: () => animalsService.getOffspring(animalId),
        enabled: !!animalId,
    })
}

/**
 * Hook para buscar genealogia (até bisavós)
 */
export function useAnimalGenealogy(animalId: string) {
    return useQuery({
        queryKey: animalKeys.genealogy(animalId),
        queryFn: () => animalsService.getGenealogy(animalId),
        enabled: !!animalId,
    })
}

/**
 * Hook para buscar garanhões disponíveis
 */
export function useStallions(harasId: string) {
    return useQuery({
        queryKey: animalKeys.stallions(harasId),
        queryFn: () => animalsService.getStallions(harasId),
        enabled: !!harasId,
    })
}

/**
 * Hook para buscar éguas disponíveis
 */
export function useMares(harasId: string) {
    return useQuery({
        queryKey: animalKeys.mares(harasId),
        queryFn: () => animalsService.getMares(harasId),
        enabled: !!harasId,
    })
}

/**
 * Hook para criar animal
 */
export function useCreateAnimal() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (input: CreateAnimalInput) => animalsService.create(input),
        onSuccess: () => {
            // Invalidar lista de animais
            queryClient.invalidateQueries({ queryKey: animalKeys.lists() })
        },
    })
}

/**
 * Hook para atualizar animal
 */
export function useUpdateAnimal() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (input: UpdateAnimalInput) => animalsService.update(input),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: animalKeys.detail(variables.id) })
            queryClient.invalidateQueries({ queryKey: animalKeys.lists() })
        },
    })
}

/**
 * Hook para deletar animal
 */
export function useDeleteAnimal() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => animalsService.delete(id),
        onSuccess: (_, id) => {
            // Remover do cache
            queryClient.removeQueries({ queryKey: animalKeys.detail(id) })
            // Invalidar lista
            queryClient.invalidateQueries({ queryKey: animalKeys.lists() })
        },
    })
}

/**
 * Hook para contar animais por sexo
 */
export function useAnimalCountBySex(harasId: string) {
    return useQuery({
        queryKey: [...animalKeys.all, 'count', 'sex', harasId],
        queryFn: () => animalsService.countBySex(harasId),
        enabled: !!harasId,
    })
}
