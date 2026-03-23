'use client'

// ============================================
// HOOKS - HARAS SETTINGS
// ============================================

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { harasSettingsService, type HarasSettings } from '@/services/harasSettings'
import { teamKeys } from '@/hooks/useTeam'

export const harasSettingsKeys = {
  all: ['haras-settings'] as const,
  settings: (harasId: string) => [...harasSettingsKeys.all, harasId] as const,
  team: (harasId: string) => [...teamKeys.members(harasId), 'settings'] as const,
}

export function useHarasSettings(harasId: string) {
  return useQuery({
    queryKey: harasSettingsKeys.settings(harasId),
    queryFn: () => harasSettingsService.getByHarasId(harasId),
    enabled: !!harasId,
  })
}

export function useUpdateHarasSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ harasId, input }: { harasId: string; input: Partial<HarasSettings> }) =>
      harasSettingsService.upsertSettings(harasId, input),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(harasSettingsKeys.settings(variables.harasId), data)
    },
  })
}

export function useHarasTeamMembers(harasId: string) {
  return useQuery({
    queryKey: harasSettingsKeys.team(harasId),
    queryFn: () => harasSettingsService.listTeamMembers(harasId),
    enabled: !!harasId,
  })
}

export function useUpdateTeamMemberStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ memberId, status, harasId }: { memberId: string; status: 'Ativo' | 'Inativo'; harasId: string }) =>
      harasSettingsService.updateTeamMemberStatus(memberId, harasId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: teamKeys.members(variables.harasId) })
    },
  })
}

export function useRemoveTeamMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ memberId, harasId }: { memberId: string; harasId: string }) =>
      harasSettingsService.removeTeamMember(memberId, harasId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: teamKeys.members(variables.harasId) })
    },
  })
}
