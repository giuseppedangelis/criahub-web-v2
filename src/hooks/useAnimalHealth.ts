'use client'

// ============================================
// HOOKS - ANIMAL HEALTH
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { healthService } from '@/services/health'
import { useUser } from '@/contexts/UserContext'
import type { CreateHealthRecordInput, CreateVaccineInput, CreateExamInput } from '@/types'

export const healthKeys = {
    all: ['health'] as const,
    records: () => [...healthKeys.all, 'records'] as const,
    recordsByAnimal: (animalId: string) => [...healthKeys.records(), { animalId }] as const,
    vaccines: () => [...healthKeys.all, 'vaccines'] as const,
    vaccinesByAnimal: (animalId: string) => [...healthKeys.vaccines(), { animalId }] as const,
    exams: () => [...healthKeys.all, 'exams'] as const,
    examsByAnimal: (animalId: string) => [...healthKeys.exams(), { animalId }] as const,
    summary: (harasId: string) => [...healthKeys.all, 'summary', harasId] as const,
}

export function useAnimalHealthRecords(animalId: string, enabled: boolean = true) {
    return useQuery({
        queryKey: healthKeys.recordsByAnimal(animalId),
        queryFn: () => healthService.listHealthRecords(animalId),
        enabled: enabled && !!animalId,
        staleTime: 30_000,
        refetchOnWindowFocus: false,
    })
}

export function useCreateHealthRecord() {
    const queryClient = useQueryClient()
    const { stableHarasId } = useUser()

    return useMutation({
        mutationFn: (input: CreateHealthRecordInput) =>
            healthService.createHealthRecord({
                ...input,
                haras_id: input.haras_id || stableHarasId || undefined,
            }),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: healthKeys.recordsByAnimal(data.animal_id) })
        },
    })
}

export function useAnimalVaccines(animalId: string, enabled: boolean = true) {
    return useQuery({
        queryKey: healthKeys.vaccinesByAnimal(animalId),
        queryFn: () => healthService.listVaccines(animalId),
        enabled: enabled && !!animalId,
        staleTime: 30_000,
        refetchOnWindowFocus: false,
    })
}

export function useCreateVaccine() {
    const queryClient = useQueryClient()
    const { stableHarasId } = useUser()

    return useMutation({
        mutationFn: (input: CreateVaccineInput) =>
            healthService.createVaccine({
                ...input,
                haras_id: input.haras_id || stableHarasId || undefined,
            }),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: healthKeys.vaccinesByAnimal(data.animal_id) })
        },
    })
}

export function useAnimalExams(animalId: string, enabled: boolean = true) {
    return useQuery({
        queryKey: healthKeys.examsByAnimal(animalId),
        queryFn: () => healthService.listExams(animalId),
        enabled: enabled && !!animalId,
        staleTime: 30_000,
        refetchOnWindowFocus: false,
    })
}

export function useCreateExam() {
    const queryClient = useQueryClient()
    const { stableHarasId } = useUser()

    return useMutation({
        mutationFn: (input: CreateExamInput) =>
            healthService.createExam({
                ...input,
                haras_id: input.haras_id || stableHarasId || undefined,
            }),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: healthKeys.examsByAnimal(data.animal_id) })
        },
    })
}

export function useHealthSummary(harasId: string) {
    return useQuery({
        queryKey: healthKeys.summary(harasId),
        queryFn: () => healthService.getHealthSummary(harasId),
        enabled: !!harasId,
    })
}
