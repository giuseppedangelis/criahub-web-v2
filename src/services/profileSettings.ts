// ============================================
// PROFILE SETTINGS SERVICE
// Gerencia preferências do usuário
// ============================================

import { supabase, handleSupabaseError } from './base'

export interface ProfileNotificationSettings {
  documents: boolean
  tasks: boolean
  calendar: boolean
  team: boolean
  system: boolean
}

export interface ProfilePrivacySettings {
  showEmail: boolean
  showPhone: boolean
}

export interface ProfileSettings {
  user_id: string
  notification_settings: ProfileNotificationSettings
  privacy_settings: ProfilePrivacySettings
  created_at?: string
  updated_at?: string
}

const DEFAULT_SETTINGS: Omit<ProfileSettings, 'user_id'> = {
  notification_settings: {
    documents: true,
    tasks: true,
    calendar: true,
    team: true,
    system: true,
  },
  privacy_settings: {
    showEmail: true,
    showPhone: true,
  },
}

function normalizeSettings(row: any, userId: string): ProfileSettings {
  return {
    user_id: row?.user_id ?? userId,
    notification_settings: {
      ...DEFAULT_SETTINGS.notification_settings,
      ...(row?.notification_settings ?? {}),
    },
    privacy_settings: {
      ...DEFAULT_SETTINGS.privacy_settings,
      ...(row?.privacy_settings ?? {}),
    },
    created_at: row?.created_at,
    updated_at: row?.updated_at,
  }
}

export const profileSettingsService = {
  async getByUserId(userId: string): Promise<ProfileSettings | null> {
    if (!userId) return null

    const { data, error } = await (supabase as any)
      .from('profile_settings')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        const { data: created, error: insertError } = await (supabase as any)
          .from('profile_settings')
          .insert({ user_id: userId })
          .select('*')
          .single()

        if (insertError) handleSupabaseError(insertError)
        return normalizeSettings(created, userId)
      }
      handleSupabaseError(error)
    }

    return normalizeSettings(data, userId)
  },

  async upsertSettings(userId: string, input: Partial<ProfileSettings>): Promise<ProfileSettings> {
    const payload = {
      user_id: userId,
      notification_settings: {
        ...DEFAULT_SETTINGS.notification_settings,
        ...(input.notification_settings ?? {}),
      },
      privacy_settings: {
        ...DEFAULT_SETTINGS.privacy_settings,
        ...(input.privacy_settings ?? {}),
      },
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await (supabase as any)
      .from('profile_settings')
      .upsert(payload, { onConflict: 'user_id' })
      .select('*')
      .single()

    if (error) handleSupabaseError(error)

    return normalizeSettings(data, userId)
  },
}
