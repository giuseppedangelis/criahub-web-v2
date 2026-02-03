'use client'

// ============================================
// HOOKS - PROFILE SETTINGS
// ============================================

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { profileSettingsService, type ProfileSettings } from '@/services/profileSettings'

export const profileSettingsKeys = {
  all: ['profile-settings'] as const,
  detail: (userId: string) => [...profileSettingsKeys.all, userId] as const,
}

export function useProfileSettings(userId: string) {
  return useQuery({
    queryKey: profileSettingsKeys.detail(userId),
    queryFn: () => profileSettingsService.getByUserId(userId),
    enabled: !!userId,
  })
}

export function useUpdateProfileSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, input }: { userId: string; input: Partial<ProfileSettings> }) =>
      profileSettingsService.upsertSettings(userId, input),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(profileSettingsKeys.detail(variables.userId), data)
    },
  })
}
