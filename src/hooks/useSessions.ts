'use client'

// ============================================
// HOOKS - SESSIONS
// ============================================

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { sessionsService } from '@/services/sessions'

export const sessionsKeys = {
  all: ['sessions'] as const,
}

export function useUserSessions() {
  return useQuery({
    queryKey: sessionsKeys.all,
    queryFn: () => sessionsService.listCurrentUserSessions(),
  })
}

export function useRevokeSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (sessionId: string) => sessionsService.revokeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionsKeys.all })
    },
  })
}
