'use client'

// ============================================
// HOOKS - ANIMAL VIDEOS
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { animalVideosService } from '@/services/animalVideos'
import type { CreateAnimalVideoInput, UpdateAnimalVideoInput } from '@/types'

export const animalVideoKeys = {
    all: ['animal_videos'] as const,
    lists: () => [...animalVideoKeys.all, 'list'] as const,
    listByAnimal: (animalId: string) => [...animalVideoKeys.lists(), { animalId }] as const,
    details: () => [...animalVideoKeys.all, 'detail'] as const,
    detail: (id: string) => [...animalVideoKeys.details(), id] as const,
}

export function useAnimalVideos(animalId: string) {
    return useQuery({
        queryKey: animalVideoKeys.listByAnimal(animalId),
        queryFn: () => animalVideosService.listByAnimal(animalId),
        enabled: !!animalId,
    })
}

export function useCreateAnimalVideo() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (input: CreateAnimalVideoInput) => animalVideosService.create(input),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: animalVideoKeys.listByAnimal(variables.animal_id) })
        },
    })
}

export function useUpdateAnimalVideo() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (input: UpdateAnimalVideoInput) => animalVideosService.update(input),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: animalVideoKeys.listByAnimal(data.animal_id) })
            queryClient.setQueryData(animalVideoKeys.detail(data.id), data)
        },
    })
}

export function useDeleteAnimalVideo() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (input: { id: string; animal_id: string }) => animalVideosService.delete(input.id),
        onSuccess: (_, input) => {
            queryClient.invalidateQueries({ queryKey: animalVideoKeys.listByAnimal(input.animal_id) })
            queryClient.removeQueries({ queryKey: animalVideoKeys.detail(input.id) })
        },
    })
}
