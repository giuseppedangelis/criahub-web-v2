'use client'

// ============================================
// HOOKS - VETERINARIANS
// ============================================

import { useQuery } from '@tanstack/react-query'
import { veterinariansService } from '@/services/veterinarians'

export const veterinarianKeys = {
  all: ['veterinarians'] as const,
  list: (harasId: string) => [...veterinarianKeys.all, harasId] as const,
}

export function useVeterinarians(harasId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: veterinarianKeys.list(harasId),
    queryFn: () => veterinariansService.list(harasId),
    enabled: !!harasId && enabled,
  })
}
