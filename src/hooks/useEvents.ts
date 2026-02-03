'use client'

// ============================================
// HOOKS - EVENTS (AGENDA)
// ============================================

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { eventsService } from '@/services/events'
import type {
  AgendaEventFilters,
  CreateAgendaEventInput,
  PaginationParams,
} from '@/types'

export const agendaKeys = {
  all: ['agenda'] as const,
  lists: () => [...agendaKeys.all, 'list'] as const,
  list: (filters: AgendaEventFilters, pagination: PaginationParams) =>
    [...agendaKeys.lists(), filters, pagination] as const,
  details: () => [...agendaKeys.all, 'detail'] as const,
  detail: (id: string) => [...agendaKeys.details(), id] as const,
}

export function useAgendaEvents(
  filters: AgendaEventFilters = {},
  pagination: PaginationParams = { page: 1, limit: 50 },
  enabled: boolean = true
) {
  return useQuery({
    queryKey: agendaKeys.list(filters, pagination),
    queryFn: () => eventsService.list(filters, pagination),
    enabled,
  })
}

export function useCreateAgendaEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateAgendaEventInput) => eventsService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: agendaKeys.lists() })
    },
  })
}

export function useUpdateAgendaEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<CreateAgendaEventInput> }) =>
      eventsService.update(id, input),
    onSuccess: (data) => {
      queryClient.setQueryData(agendaKeys.detail(data.id), data)
      queryClient.invalidateQueries({ queryKey: agendaKeys.lists() })
    },
  })
}

export function useDeleteAgendaEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => eventsService.delete(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: agendaKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: agendaKeys.lists() })
    },
  })
}
