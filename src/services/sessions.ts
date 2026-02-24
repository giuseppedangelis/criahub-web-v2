// ============================================
// SESSIONS SERVICE
// Sessões reais do usuário atual
// ============================================

import { supabase, handleSupabaseError } from './base'

export interface UserSession {
  id: string
  created_at: string
  updated_at: string
  ip: string | null
  user_agent: string | null
  refreshed_at: string | null
  not_after: string | null
}

export const sessionsService = {
  async listCurrentUserSessions(): Promise<UserSession[]> {
    const { data, error } = await (supabase as any)
      .rpc('get_current_user_sessions')

    if (error) handleSupabaseError(error)

    return (data || []) as UserSession[]
  },

  async revokeSession(sessionId: string): Promise<void> {
    const { error } = await (supabase as any)
      .rpc('revoke_current_user_session', { p_session_id: sessionId })

    if (error) handleSupabaseError(error)
  },
}
