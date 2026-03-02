'use client'

// ============================================
// HOOKS - ANIMAL LOCATION HISTORY
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { animalLocationsService } from '@/services/animalLocations'
import { animalKeys } from '@/hooks/useAnimals'
import type { CreateAnimalLocationChangeInput } from '@/types'

export const animalLocationKeys = {
    all: ['animal_location_history'] as const,
    lists: () => [...animalLocationKeys.all, 'list'] as const,
    listByAnimal: (animalId: string) => [...animalLocationKeys.lists(), { animalId }] as const,
}

export function useAnimalLocationHistory(animalId: string, enabled: boolean = true) {
    return useQuery({
        queryKey: animalLocationKeys.listByAnimal(animalId),
        queryFn: () => animalLocationsService.listHistory(animalId),
        enabled: enabled && !!animalId,
        staleTime: 30_000,
        refetchOnWindowFocus: false,
    })
}

export function useCreateAnimalLocationChange() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (input: CreateAnimalLocationChangeInput) => animalLocationsService.createChange(input),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: animalLocationKeys.listByAnimal(data.animal_id) })
            queryClient.invalidateQueries({ queryKey: animalKeys.detail(data.animal_id) })
            queryClient.invalidateQueries({ queryKey: animalKeys.lists() })
        },
    })
}
