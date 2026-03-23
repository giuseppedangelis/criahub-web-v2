// ============================================
// HARAS SETTINGS SERVICE
// Gerencia configurações gerais do haras e equipe
// ============================================

import { normalizeHarasLocationSettings, DEFAULT_HARAS_LOCATION_SETTINGS } from '@/lib/animal-location'
import type { HarasLocationSettings } from '@/types'
import { supabase, handleSupabaseError } from './base'
import { teamService } from './team'

export interface HarasNotificationSettings {
  agenda: boolean
  reproduction: boolean
  system: boolean
}

export interface HarasPrivacySettings {
  publicPlantel: boolean
  shareAnalytics: boolean
  allowSearch: boolean
}

export interface HarasBackupSettings {
  autoBackup: boolean
  frequency: 'daily' | 'weekly' | 'monthly'
}

export interface HarasSettings {
  haras_id: string
  notification_settings: HarasNotificationSettings
  privacy_settings: HarasPrivacySettings
  backup_settings: HarasBackupSettings
  location_settings: HarasLocationSettings
  created_at?: string
  updated_at?: string
}

export interface TeamMemberRecord {
  id: string
  member_id?: string | null
  full_name: string | null
  email: string | null
  role: string | null
  status: string | null
  avatar_url: string | null
  phone?: string | null
}

const DEFAULT_SETTINGS: Omit<HarasSettings, 'haras_id'> = {
  notification_settings: { agenda: true, reproduction: true, system: true },
  privacy_settings: { publicPlantel: true, shareAnalytics: true, allowSearch: true },
  backup_settings: { autoBackup: true, frequency: 'daily' },
  location_settings: DEFAULT_HARAS_LOCATION_SETTINGS,
}

const HARAS_SETTINGS_SELECT = `
  haras_id,
  notification_settings,
  privacy_settings,
  backup_settings,
  location_settings,
  created_at,
  updated_at
`

function normalizeSettings(row: any, harasId: string): HarasSettings {
  const notification = {
    ...DEFAULT_SETTINGS.notification_settings,
    ...(row?.notification_settings ?? {}),
  }
  const privacy = {
    ...DEFAULT_SETTINGS.privacy_settings,
    ...(row?.privacy_settings ?? {}),
  }
  const backup = {
    ...DEFAULT_SETTINGS.backup_settings,
    ...(row?.backup_settings ?? {}),
  }
  const locationSettings = normalizeHarasLocationSettings(row?.location_settings)

  return {
    haras_id: row?.haras_id ?? harasId,
    notification_settings: notification,
    privacy_settings: privacy,
    backup_settings: backup,
    location_settings: locationSettings,
    created_at: row?.created_at,
    updated_at: row?.updated_at,
  }
}

export const harasSettingsService = {
  async getByHarasId(harasId: string): Promise<HarasSettings | null> {
    if (!harasId) return null

    const { data, error } = await (supabase as any)
      .from('haras_settings')
      .select(HARAS_SETTINGS_SELECT)
      .eq('haras_id', harasId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        const { data: created, error: insertError } = await (supabase as any)
          .from('haras_settings')
          .insert({ haras_id: harasId })
          .select(HARAS_SETTINGS_SELECT)
          .single()

        if (insertError) handleSupabaseError(insertError)
        return normalizeSettings(created, harasId)
      }
      handleSupabaseError(error)
    }

    return normalizeSettings(data, harasId)
  },

  async upsertSettings(harasId: string, input: Partial<HarasSettings>): Promise<HarasSettings> {
    const currentSettings = await this.getByHarasId(harasId)
    const payload = {
      haras_id: harasId,
      notification_settings: {
        ...DEFAULT_SETTINGS.notification_settings,
        ...(currentSettings?.notification_settings ?? {}),
        ...(input.notification_settings ?? {}),
      },
      privacy_settings: {
        ...DEFAULT_SETTINGS.privacy_settings,
        ...(currentSettings?.privacy_settings ?? {}),
        ...(input.privacy_settings ?? {}),
      },
      backup_settings: {
        ...DEFAULT_SETTINGS.backup_settings,
        ...(currentSettings?.backup_settings ?? {}),
        ...(input.backup_settings ?? {}),
      },
      location_settings: normalizeHarasLocationSettings(input.location_settings ?? currentSettings?.location_settings),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await (supabase as any)
      .from('haras_settings')
      .upsert(payload, { onConflict: 'haras_id' })
      .select(HARAS_SETTINGS_SELECT)
      .single()

    if (error) handleSupabaseError(error)

    return normalizeSettings(data, harasId)
  },

  async listTeamMembers(harasId: string): Promise<TeamMemberRecord[]> {
    if (!harasId) return []

    const members = await teamService.listMembers(harasId)

    return members.map((member) => ({
      id: member.user_id,
      member_id: member.id || null,
      full_name: member.profile.full_name ?? null,
      email: member.profile.email ?? null,
      role: member.profile.role ?? null,
      status: member.status ?? member.profile.status ?? 'Ativo',
      avatar_url: member.profile.avatar_url ?? null,
      phone: member.profile.phone ?? null,
    }))
  },

  async updateTeamMemberStatus(memberId: string, harasId: string, status: 'Ativo' | 'Inativo'): Promise<void> {
    await teamService.setMemberStatus(memberId, harasId, status)
  },

  async removeTeamMember(memberId: string, harasId: string): Promise<void> {
    await teamService.removeMember(memberId, harasId)
  },
}
