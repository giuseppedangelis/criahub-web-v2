'use client'

// ============================================
// HOOKS - REPRODUCTION
// Hooks para gerenciar reprodução com TanStack Query
// ============================================

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { reproductionService } from '@/services/reproduction'
import type {
    GestationFilters,
    CreateReproductiveEventInput,
    CreateGestationInput,
    PaginationParams,
    Gestation,
    CreateCoveringInput,
    CreateOvuleInput,
    CreateEmbryoInput,
    CreateReproductionDocumentInput,
    CreateReproductionProtocolInput,
    CreateReproductionProtocolStepInput,
    CreateReproductionProtocolApplicationInput
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
    coverings: () => [...reproductionKeys.all, 'coverings'] as const,
    coveringsByHaras: (harasId: string, pagination: PaginationParams) =>
        [...reproductionKeys.coverings(), harasId, pagination] as const,
    ovules: () => [...reproductionKeys.all, 'ovules'] as const,
    ovulesByHaras: (harasId: string, pagination: PaginationParams) =>
        [...reproductionKeys.ovules(), harasId, pagination] as const,
    embryos: () => [...reproductionKeys.all, 'embryos'] as const,
    embryosByHaras: (harasId: string, pagination: PaginationParams) =>
        [...reproductionKeys.embryos(), harasId, pagination] as const,
    documents: (harasId: string) =>
        [...reproductionKeys.all, 'documents', harasId] as const,
    protocols: (harasId: string) =>
        [...reproductionKeys.all, 'protocols', harasId] as const,
    protocolApplications: (harasId: string) =>
        [...reproductionKeys.all, 'protocols', 'applications', harasId] as const,
}

/**
 * Hook para listar eventos reprodutivos
 */
export function useReproductiveEvents(
    harasId: string,
    pagination: PaginationParams = { page: 1, limit: 20 },
    enabled: boolean = true
) {
    return useQuery({
        queryKey: reproductionKeys.eventsByHaras(harasId, pagination),
        queryFn: () => reproductionService.listEvents(harasId, pagination),
        enabled: enabled && !!harasId,
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
    })
}

/**
 * Hook para eventos de um animal específico
 */
export function useAnimalReproductiveEvents(animalId: string, enabled: boolean = true) {
    return useQuery({
        queryKey: reproductionKeys.eventsByAnimal(animalId),
        queryFn: () => reproductionService.getEventsByAnimal(animalId),
        enabled: enabled && !!animalId,
        staleTime: 30_000,
        refetchOnWindowFocus: false,
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
    pagination: PaginationParams = { page: 1, limit: 20 },
    enabled: boolean = true
) {
    return useQuery({
        queryKey: reproductionKeys.gestationsList(filters, pagination),
        queryFn: () => reproductionService.listGestations(filters, pagination),
        enabled: enabled && !!filters.haras_id,
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
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
        staleTime: 60_000,
        refetchOnWindowFocus: false,
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
        staleTime: 60_000,
        refetchOnWindowFocus: false,
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
        staleTime: 300_000,
        refetchOnWindowFocus: false,
    })
}

// ============================================
// COBERTURAS
// ============================================

export function useCoverings(
    harasId: string,
    pagination: PaginationParams = { page: 1, limit: 20 },
    enabled: boolean = true
) {
    return useQuery({
        queryKey: reproductionKeys.coveringsByHaras(harasId, pagination),
        queryFn: () => reproductionService.listCoverings(harasId, pagination),
        enabled: enabled && !!harasId,
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
    })
}

export function useCreateCovering() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (input: CreateCoveringInput) =>
            reproductionService.createCovering(input),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: reproductionKeys.coverings() })
            if (variables.haras_id) {
                queryClient.invalidateQueries({
                    queryKey: reproductionKeys.coveringsByHaras(variables.haras_id, { page: 1, limit: 20 })
                })
            }
        },
    })
}

// ============================================
// OVULOS
// ============================================

export function useOvules(
    harasId: string,
    pagination: PaginationParams = { page: 1, limit: 20 },
    enabled: boolean = true
) {
    return useQuery({
        queryKey: reproductionKeys.ovulesByHaras(harasId, pagination),
        queryFn: () => reproductionService.listOvules(harasId, pagination),
        enabled: enabled && !!harasId,
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
    })
}

export function useCreateOvule() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (input: CreateOvuleInput) =>
            reproductionService.createOvule(input),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: reproductionKeys.ovules() })
            if (variables.haras_id) {
                queryClient.invalidateQueries({
                    queryKey: reproductionKeys.ovulesByHaras(variables.haras_id, { page: 1, limit: 20 })
                })
            }
        },
    })
}

// ============================================
// EMBRIOES
// ============================================

export function useEmbryos(
    harasId: string,
    pagination: PaginationParams = { page: 1, limit: 20 },
    enabled: boolean = true
) {
    return useQuery({
        queryKey: reproductionKeys.embryosByHaras(harasId, pagination),
        queryFn: () => reproductionService.listEmbryos(harasId, pagination),
        enabled: enabled && !!harasId,
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
    })
}

export function useCreateEmbryo() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (input: CreateEmbryoInput) =>
            reproductionService.createEmbryo(input),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: reproductionKeys.embryos() })
            if (variables.haras_id) {
                queryClient.invalidateQueries({
                    queryKey: reproductionKeys.embryosByHaras(variables.haras_id, { page: 1, limit: 20 })
                })
            }
        },
    })
}

// ============================================
// DOCUMENTOS
// ============================================

export function useReproductionDocuments(harasId: string, enabled: boolean = true) {
    return useQuery({
        queryKey: reproductionKeys.documents(harasId),
        queryFn: () => reproductionService.listDocuments(harasId),
        enabled: enabled && !!harasId,
        staleTime: 60_000,
        refetchOnWindowFocus: false,
    })
}

export function useCreateReproductionDocument() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (input: CreateReproductionDocumentInput) =>
            reproductionService.createDocument(input),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: reproductionKeys.documents(variables.haras_id) })
        },
    })
}

// ============================================
// PROTOCOLOS
// ============================================

export function useReproductionProtocols(harasId: string, enabled: boolean = true) {
    return useQuery({
        queryKey: reproductionKeys.protocols(harasId),
        queryFn: () => reproductionService.listProtocols(harasId),
        enabled: enabled && !!harasId,
        staleTime: 60_000,
        refetchOnWindowFocus: false,
    })
}

export function useCreateReproductionProtocol() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            input,
            steps,
        }: {
            input: CreateReproductionProtocolInput;
            steps?: CreateReproductionProtocolStepInput[];
        }) => reproductionService.createProtocol(input, steps),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: reproductionKeys.protocols(variables.input.haras_id) })
        },
    })
}

export function useUpdateReproductionProtocol(harasId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: Partial<CreateReproductionProtocolInput> }) =>
            reproductionService.updateProtocol(id, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reproductionKeys.protocols(harasId) })
        },
    })
}

export function useReplaceReproductionProtocolSteps(harasId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            protocolId,
            steps,
        }: {
            protocolId: string;
            steps: CreateReproductionProtocolStepInput[];
        }) => reproductionService.replaceProtocolSteps(protocolId, steps),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reproductionKeys.protocols(harasId) })
        },
    })
}

export function useDeleteReproductionProtocol(harasId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => reproductionService.deleteProtocol(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reproductionKeys.protocols(harasId) })
        },
    })
}

export function useApplyReproductionProtocol() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (input: CreateReproductionProtocolApplicationInput) =>
            reproductionService.applyProtocol(input),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: reproductionKeys.protocolApplications(variables.haras_id) })
        },
    })
}

export function useReproductionProtocolApplications(harasId: string, enabled: boolean = true) {
    return useQuery({
        queryKey: reproductionKeys.protocolApplications(harasId),
        queryFn: () => reproductionService.listProtocolApplications(harasId),
        enabled: enabled && !!harasId,
        staleTime: 60_000,
        refetchOnWindowFocus: false,
    })
}
