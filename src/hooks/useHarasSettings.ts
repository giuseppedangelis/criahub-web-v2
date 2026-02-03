'use client'

// ============================================
// HOOKS - HARAS SETTINGS
// ============================================

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { harasSettingsService, type HarasSettings } from '@/services/harasSettings'

export const harasSettingsKeys = {
  all: ['haras-settings'] as const,
  settings: (harasId: string) => [...harasSettingsKeys.all, harasId] as const,
  team: (harasId: string) => [...harasSettingsKeys.all, harasId, 'team'] as const,
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
      harasSettingsService.updateTeamMemberStatus(memberId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: harasSettingsKeys.team(variables.harasId) })
    },
  })
}

export function useRemoveTeamMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ memberId }: { memberId: string; harasId: string }) =>
      harasSettingsService.removeTeamMember(memberId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: harasSettingsKeys.team(variables.harasId) })
    },
  })
}
