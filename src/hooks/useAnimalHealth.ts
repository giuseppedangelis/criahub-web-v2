'use client'

// ============================================
// HOOKS - ANIMAL HEALTH
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { healthService } from '@/services/health'
import type { CreateHealthRecordInput, CreateVaccineInput, CreateExamInput } from '@/types'

export const healthKeys = {
    all: ['health'] as const,
    records: () => [...healthKeys.all, 'records'] as const,
    recordsByAnimal: (animalId: string) => [...healthKeys.records(), { animalId }] as const,
    vaccines: () => [...healthKeys.all, 'vaccines'] as const,
    vaccinesByAnimal: (animalId: string) => [...healthKeys.vaccines(), { animalId }] as const,
    exams: () => [...healthKeys.all, 'exams'] as const,
    examsByAnimal: (animalId: string) => [...healthKeys.exams(), { animalId }] as const,
}

export function useAnimalHealthRecords(animalId: string) {
    return useQuery({
        queryKey: healthKeys.recordsByAnimal(animalId),
        queryFn: () => healthService.listHealthRecords(animalId),
        enabled: !!animalId,
    })
}

export function useCreateHealthRecord() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (input: CreateHealthRecordInput) => healthService.createHealthRecord(input),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: healthKeys.recordsByAnimal(data.animal_id) })
        },
    })
}

export function useAnimalVaccines(animalId: string) {
    return useQuery({
        queryKey: healthKeys.vaccinesByAnimal(animalId),
        queryFn: () => healthService.listVaccines(animalId),
        enabled: !!animalId,
    })
}

export function useCreateVaccine() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (input: CreateVaccineInput) => healthService.createVaccine(input),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: healthKeys.vaccinesByAnimal(data.animal_id) })
        },
    })
}

export function useAnimalExams(animalId: string) {
    return useQuery({
        queryKey: healthKeys.examsByAnimal(animalId),
        queryFn: () => healthService.listExams(animalId),
        enabled: !!animalId,
    })
}

export function useCreateExam() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (input: CreateExamInput) => healthService.createExam(input),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: healthKeys.examsByAnimal(data.animal_id) })
        },
    })
}
