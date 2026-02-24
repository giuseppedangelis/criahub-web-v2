// ============================================
// TEAM SERVICE
// Funções e membros do haras (Equipe)
// ============================================

import { supabase, handleSupabaseError } from './base'
import { normalizeRoleForStorage } from '@/lib/roles'

export type TeamPermissionKey =
  | 'viewHerd'
  | 'registerActivities'
  | 'healthManagement'
  | 'reproduction'
  | 'financialManagement'
  | 'trainingManagement'
  | 'teamManagement'
  | 'documentManagement'
  | 'fullAdministrative'

export type TeamPermissions = Record<TeamPermissionKey, boolean>

export const DEFAULT_TEAM_PERMISSIONS: TeamPermissions = {
  viewHerd: false,
  registerActivities: false,
  healthManagement: false,
  reproduction: false,
  financialManagement: false,
  trainingManagement: false,
  teamManagement: false,
  documentManagement: false,
  fullAdministrative: false,
}

export function normalizeTeamPermissions(input?: Partial<TeamPermissions> | null): TeamPermissions {
  if (!input) return { ...DEFAULT_TEAM_PERMISSIONS }
  return {
    viewHerd: !!input.viewHerd,
    registerActivities: !!input.registerActivities,
    healthManagement: !!input.healthManagement,
    reproduction: !!input.reproduction,
    financialManagement: !!input.financialManagement,
    trainingManagement: !!input.trainingManagement,
    teamManagement: !!input.teamManagement,
    documentManagement: !!input.documentManagement,
    fullAdministrative: !!input.fullAdministrative,
  }
}

export interface TeamRole {
  id: string
  haras_id: string
  name: string
  description: string | null
  user_type: string
  permissions: TeamPermissions
  can_edit: boolean
  can_view: boolean
  can_delete: boolean
  created_at?: string
  updated_at?: string
}

export interface TeamMemberProfile {
  id: string
  full_name: string | null
  email: string | null
  role: string | null
  status: string | null
  avatar_url: string | null
  phone: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface TeamMember {
  id: string
  haras_id: string
  user_id: string
  role_id: string | null
  permissions: TeamPermissions
  status: 'Ativo' | 'Inativo'
  created_at?: string
  updated_at?: string
  profile: TeamMemberProfile
  role?: TeamRole | null
}

function mapRole(row: any): TeamRole | null {
  if (!row) return null
  return {
    id: row.id,
    haras_id: row.haras_id,
    name: row.name,
    description: row.description ?? null,
    user_type: row.user_type ?? 'Interno',
    permissions: normalizeTeamPermissions(row.permissions),
    can_edit: row.can_edit ?? true,
    can_view: row.can_view ?? true,
    can_delete: row.can_delete ?? false,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

export const teamService = {
  async listRoles(harasId: string): Promise<TeamRole[]> {
    if (!harasId) return []

    const { data, error } = await (supabase as any)
      .from('haras_roles')
      .select('*')
      .eq('haras_id', harasId)
      .order('name', { ascending: true })

    if (error) handleSupabaseError(error)

    return (data || []).map((row: any) => mapRole(row) as TeamRole)
  },

  async createRole(harasId: string, input: Partial<TeamRole> & { name: string }, createdBy?: string | null): Promise<TeamRole> {
    const payload = {
      haras_id: harasId,
      name: input.name,
      description: input.description ?? null,
      user_type: input.user_type ?? 'Interno',
      permissions: normalizeTeamPermissions(input.permissions),
      can_edit: input.can_edit ?? true,
      can_view: input.can_view ?? true,
      can_delete: input.can_delete ?? false,
      created_by: createdBy ?? null,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await (supabase as any)
      .from('haras_roles')
      .insert(payload)
      .select('*')
      .single()

    if (error) handleSupabaseError(error)

    return mapRole(data) as TeamRole
  },

  async updateRole(roleId: string, input: Partial<TeamRole>): Promise<TeamRole> {
    const payload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    }

    if (input.name !== undefined) payload.name = input.name
    if (input.description !== undefined) payload.description = input.description
    if (input.user_type !== undefined) payload.user_type = input.user_type
    if (input.permissions !== undefined) payload.permissions = normalizeTeamPermissions(input.permissions)
    if (input.can_edit !== undefined) payload.can_edit = input.can_edit
    if (input.can_view !== undefined) payload.can_view = input.can_view
    if (input.can_delete !== undefined) payload.can_delete = input.can_delete

    const { data, error } = await (supabase as any)
      .from('haras_roles')
      .update(payload)
      .eq('id', roleId)
      .select('*')
      .single()

    if (error) handleSupabaseError(error)

    return mapRole(data) as TeamRole
  },

  async deleteRole(roleId: string): Promise<void> {
    const { error } = await (supabase as any)
      .from('haras_roles')
      .delete()
      .eq('id', roleId)

    if (error) handleSupabaseError(error)
  },

  async listMembers(harasId: string): Promise<TeamMember[]> {
    if (!harasId) return []

    const { data, error } = await (supabase as any)
      .from('profiles')
      .select(`
        id,
        full_name,
        email,
        role,
        status,
        avatar_url,
        phone,
        created_at,
        updated_at,
        haras_members:haras_members!haras_members_user_id_fkey (
          id,
          haras_id,
          user_id,
          role_id,
          permissions,
          status,
          created_at,
          updated_at,
          role:haras_roles!haras_members_role_id_fkey (
            id,
            haras_id,
            name,
            description,
            user_type,
            permissions,
            can_edit,
            can_view,
            can_delete,
            created_at,
            updated_at
          )
        )
      `)
      .eq('haras_id', harasId)
      .order('full_name', { ascending: true })

    if (error) handleSupabaseError(error)

    const rows = (data || []) as any[]
    return rows.map((profileRow) => {
      const membership = Array.isArray(profileRow.haras_members) ? profileRow.haras_members[0] : null
      const permissions = normalizeTeamPermissions(membership?.permissions)
      const role = mapRole(membership?.role)
      const status = (membership?.status || profileRow.status || 'Ativo') as 'Ativo' | 'Inativo'

      return {
        id: membership?.id || '',
        haras_id: membership?.haras_id || harasId,
        user_id: profileRow.id,
        role_id: membership?.role_id || null,
        permissions,
        status,
        created_at: membership?.created_at,
        updated_at: membership?.updated_at,
        profile: {
          id: profileRow.id,
          full_name: profileRow.full_name ?? null,
          email: profileRow.email ?? null,
          role: profileRow.role ?? null,
          status: profileRow.status ?? null,
          avatar_url: profileRow.avatar_url ?? null,
          phone: profileRow.phone ?? null,
          created_at: profileRow.created_at ?? null,
          updated_at: profileRow.updated_at ?? null,
        },
        role,
      } as TeamMember
    })
  },

  async upsertMember(input: {
    harasId: string
    userId: string
    roleId?: string | null
    permissions?: TeamPermissions | null
    status?: 'Ativo' | 'Inativo'
    createdBy?: string | null
  }): Promise<void> {
    const payload = {
      haras_id: input.harasId,
      user_id: input.userId,
      role_id: input.roleId ?? null,
      permissions: normalizeTeamPermissions(input.permissions),
      status: input.status ?? 'Ativo',
      created_by: input.createdBy ?? null,
      updated_at: new Date().toISOString(),
    }

    const { error } = await (supabase as any)
      .from('haras_members')
      .upsert(payload, { onConflict: 'haras_id,user_id' })

    if (error) handleSupabaseError(error)
  },

  async updateMember(memberId: string, input: Partial<TeamMember>): Promise<void> {
    const payload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    }

    if (input.role_id !== undefined) payload.role_id = input.role_id
    if (input.permissions !== undefined) payload.permissions = normalizeTeamPermissions(input.permissions)
    if (input.status !== undefined) payload.status = input.status

    const { error } = await (supabase as any)
      .from('haras_members')
      .update(payload)
      .eq('id', memberId)

    if (error) handleSupabaseError(error)
  },

  async updateProfile(userId: string, input: Partial<TeamMemberProfile>): Promise<void> {
    const payload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    }

    if (input.full_name !== undefined) payload.full_name = input.full_name
    if (input.email !== undefined) payload.email = input.email
    if (input.phone !== undefined) payload.phone = input.phone
    if (input.status !== undefined) payload.status = input.status
    if (input.role !== undefined) payload.role = normalizeRoleForStorage(input.role) ?? input.role

    const { error } = await (supabase as any)
      .from('profiles')
      .update(payload)
      .eq('id', userId)

    if (error) handleSupabaseError(error)
  },

  async removeMember(userId: string, harasId: string): Promise<void> {
    const now = new Date().toISOString()

    const { error: profileError } = await (supabase as any)
      .from('profiles')
      .update({ haras_id: null, status: 'Inativo', updated_at: now })
      .eq('id', userId)

    if (profileError) handleSupabaseError(profileError)

    const { error: memberError } = await (supabase as any)
      .from('haras_members')
      .delete()
      .eq('user_id', userId)
      .eq('haras_id', harasId)

    if (memberError) handleSupabaseError(memberError)
  },
}
