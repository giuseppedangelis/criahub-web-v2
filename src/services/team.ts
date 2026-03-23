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

const TEAM_ROLE_SELECT = `
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
`

const TEAM_MEMBER_PROFILE_SELECT = `
  id,
  full_name,
  email,
  role,
  status,
  avatar_url,
  phone,
  created_at,
  updated_at
`

const TEAM_MEMBER_SELECT = `
  id,
  haras_id,
  user_id,
  role_id,
  permissions,
  status,
  created_at,
  updated_at,
  profile:profiles!haras_members_user_id_fkey (
    ${TEAM_MEMBER_PROFILE_SELECT}
  ),
  role:haras_roles!haras_members_role_id_fkey (
    ${TEAM_ROLE_SELECT}
  )
`

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

function extractRpcError(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null
  const message = (data as { error?: unknown }).error
  return typeof message === 'string' && message.length > 0 ? message : null
}

async function runTeamRpc(functionName: 'set_haras_member_status' | 'remove_haras_member', args: Record<string, unknown>) {
  const { data, error } = await (supabase as any).rpc(functionName, args)

  if (error) handleSupabaseError(error)

  const rpcError = extractRpcError(data)
  if (rpcError) {
    throw new Error(rpcError)
  }

  return data
}

export const teamService = {
  async listRoles(harasId: string): Promise<TeamRole[]> {
    if (!harasId) return []

    const { data, error } = await (supabase as any)
      .from('haras_roles')
      .select(TEAM_ROLE_SELECT)
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
      .select(TEAM_ROLE_SELECT)
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
      .select(TEAM_ROLE_SELECT)
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
      .from('haras_members')
      .select(TEAM_MEMBER_SELECT)
      .eq('haras_id', harasId)

    if (error) handleSupabaseError(error)

    const rows = (data || []) as any[]
    return rows
      .map((row) => ({
        id: row.id,
        haras_id: row.haras_id,
        user_id: row.user_id,
        role_id: row.role_id ?? null,
        permissions: normalizeTeamPermissions(row.permissions || row.role?.permissions),
        status: (row.status || row.profile?.status || 'Ativo') as 'Ativo' | 'Inativo',
        created_at: row.created_at,
        updated_at: row.updated_at,
        profile: {
          id: row.profile?.id ?? row.user_id,
          full_name: row.profile?.full_name ?? null,
          email: row.profile?.email ?? null,
          role: row.profile?.role ?? null,
          status: row.profile?.status ?? null,
          avatar_url: row.profile?.avatar_url ?? null,
          phone: row.profile?.phone ?? null,
          created_at: row.profile?.created_at ?? null,
          updated_at: row.profile?.updated_at ?? null,
        },
        role: mapRole(row.role),
      }) as TeamMember)
      .sort((left, right) => {
        const leftName = left.profile.full_name || left.profile.email || ''
        const rightName = right.profile.full_name || right.profile.email || ''
        return leftName.localeCompare(rightName, 'pt-BR')
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
    const now = new Date().toISOString()
    const status = input.status ?? 'Ativo'

    const payload = {
      haras_id: input.harasId,
      user_id: input.userId,
      role_id: input.roleId ?? null,
      permissions: normalizeTeamPermissions(input.permissions),
      status,
      created_by: input.createdBy ?? null,
      updated_at: now,
    }

    const { error } = await (supabase as any)
      .from('haras_members')
      .upsert(payload, { onConflict: 'haras_id,user_id' })

    if (error) handleSupabaseError(error)

    const { error: profileError } = await (supabase as any)
      .from('profiles')
      .update({
        haras_id: input.harasId,
        status,
        updated_at: now,
      })
      .eq('id', input.userId)

    if (profileError) handleSupabaseError(profileError)
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

  async setMemberStatus(userId: string, harasId: string, status: 'Ativo' | 'Inativo'): Promise<void> {
    await runTeamRpc('set_haras_member_status', {
      p_user_id: userId,
      p_haras_id: harasId,
      p_status: status,
    })
  },

  async removeMember(userId: string, harasId: string): Promise<void> {
    await runTeamRpc('remove_haras_member', {
      p_user_id: userId,
      p_haras_id: harasId,
    })
  },
}
