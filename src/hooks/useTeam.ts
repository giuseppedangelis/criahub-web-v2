'use client'

// ============================================
// HOOKS - TEAM (Equipe)
// ============================================

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { teamService, type TeamRole, type TeamMember, type TeamPermissions } from '@/services/team'

export const teamKeys = {
  all: ['team'] as const,
  roles: (harasId: string) => [...teamKeys.all, harasId, 'roles'] as const,
  members: (harasId: string) => [...teamKeys.all, harasId, 'members'] as const,
}

export function useTeamRoles(harasId: string) {
  return useQuery({
    queryKey: teamKeys.roles(harasId),
    queryFn: () => teamService.listRoles(harasId),
    enabled: !!harasId,
  })
}

export function useTeamMembers(harasId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: teamKeys.members(harasId),
    queryFn: () => teamService.listMembers(harasId),
    enabled: !!harasId && enabled,
  })
}

export function useCreateTeamRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ harasId, input, createdBy }: { harasId: string; input: Partial<TeamRole> & { name: string }; createdBy?: string | null }) =>
      teamService.createRole(harasId, input, createdBy),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: teamKeys.roles(variables.harasId) })
    },
  })
}

export function useUpdateTeamRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ roleId, input, harasId }: { roleId: string; input: Partial<TeamRole>; harasId: string }) =>
      teamService.updateRole(roleId, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: teamKeys.roles(variables.harasId) })
    },
  })
}

export function useDeleteTeamRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ roleId }: { roleId: string }) => teamService.deleteRole(roleId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: teamKeys.all })
    },
  })
}

export function useUpsertTeamMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { harasId: string; userId: string; roleId?: string | null; permissions?: TeamPermissions | null; status?: 'Ativo' | 'Inativo'; createdBy?: string | null }) =>
      teamService.upsertMember(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: teamKeys.members(variables.harasId) })
    },
  })
}

export function useUpdateTeamMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ memberId, input, harasId }: { memberId: string; input: Partial<TeamMember>; harasId: string }) =>
      teamService.updateMember(memberId, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: teamKeys.members(variables.harasId) })
    },
  })
}

export function useRemoveTeamMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, harasId }: { userId: string; harasId: string }) =>
      teamService.removeMember(userId, harasId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: teamKeys.members(variables.harasId) })
    },
  })
}
