'use client'

// ============================================
// HOOKS - REPORTS
// ============================================

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { reportsService } from '@/services/reports'
import type { CreateReportInput, PaginationParams, ReportFilters } from '@/types'

export const reportKeys = {
  all: ['reports'] as const,
  lists: () => [...reportKeys.all, 'list'] as const,
  list: (filters: ReportFilters, pagination: PaginationParams) =>
    [...reportKeys.lists(), filters, pagination] as const,
  recent: (harasId: string, limit: number) => [...reportKeys.all, 'recent', harasId, limit] as const,
  summary: (harasId: string) => [...reportKeys.all, 'summary', harasId] as const,
}

export function useReports(
  filters: ReportFilters = {},
  pagination: PaginationParams = { page: 1, limit: 20 },
  enabled: boolean = true
) {
  return useQuery({
    queryKey: reportKeys.list(filters, pagination),
    queryFn: () => reportsService.list(filters, pagination),
    enabled,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  })
}

export function useRecentReports(harasId: string, limit: number = 4) {
  return useQuery({
    queryKey: reportKeys.recent(harasId, limit),
    queryFn: () => reportsService.getRecent(harasId, limit),
    enabled: !!harasId,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  })
}

export function useReportsSummary(harasId: string) {
  return useQuery({
    queryKey: reportKeys.summary(harasId),
    queryFn: () => reportsService.getSummary(harasId),
    enabled: !!harasId,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  })
}

export function useCreateReport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateReportInput) => reportsService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.all })
    },
  })
}
