// ============================================
// VETERINARIANS SERVICE
// Lista veterinarios cadastrados no sistema
// ============================================

import { supabase, handleSupabaseError } from './base'

export interface VeterinarianProfile {
  id: string
  full_name: string | null
  email: string
}

export const veterinariansService = {
  async list(harasId: string): Promise<VeterinarianProfile[]> {
    if (!harasId) return []

    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .eq('haras_id', harasId)
      .eq('role', 'veterinario')
      .order('full_name', { ascending: true })
      .order('email', { ascending: true })

    if (error) handleSupabaseError(error)

    return (data || []) as VeterinarianProfile[]
  },
}
