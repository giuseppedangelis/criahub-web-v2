'use client'

// ============================================
// HOOK - Advisor Dashboard
// ============================================

import { useQuery } from '@tanstack/react-query'
import { advisorDashboardService } from '@/services/advisorDashboard'

export const advisorDashboardKeys = {
  all: ['advisor-dashboard'] as const,
  stats: (harasId: string) => [...advisorDashboardKeys.all, harasId] as const,
}

export function useAdvisorDashboard(harasId?: string) {
  return useQuery({
    queryKey: advisorDashboardKeys.stats(harasId || 'no-haras'),
    queryFn: () => advisorDashboardService.getStats(harasId || ''),
    enabled: !!harasId,
  })
}
