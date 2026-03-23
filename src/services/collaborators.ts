// ============================================
// COLLABORATORS SERVICE
// Gerencia criação de colaboradores (usuários do haras)
// ============================================

import { supabase } from './base'
import { normalizeRoleForStorage } from '@/lib/roles'
import { DEFAULT_TEAM_PERMISSIONS, normalizeTeamPermissions, type TeamPermissions } from '@/services/team'

export interface CreateCollaboratorInput {
  full_name: string
  email: string
  password: string
  role: 'assessor' | 'veterinario' | 'peao' | 'funcionario'
  haras_id: string
  permissions?: Partial<TeamPermissions> | null
  role_id?: string | null
  status?: 'Ativo' | 'Inativo'
  created_by?: string | null
  phone?: string | null
}

export interface CreateCollaboratorResult {
  user_id: string
  haras_id: string
  role: string
  status: 'Ativo' | 'Inativo'
  role_id: string | null
  permissions: TeamPermissions
}

function parseCollaboratorResult(data: any): CreateCollaboratorResult {
  if (!data || typeof data !== 'object') {
    throw new Error('Resposta inválida ao criar colaborador.')
  }

  if (typeof data.error === 'string' && data.error.length > 0) {
    throw new Error(data.error)
  }

  if (!data.user_id) {
    throw new Error('Cadastro concluído sem retorno do identificador do usuário.')
  }

  return {
    user_id: data.user_id,
    haras_id: data.haras_id,
    role: data.role,
    status: data.status === 'Inativo' ? 'Inativo' : 'Ativo',
    role_id: data.role_id ?? null,
    permissions: normalizeTeamPermissions(data.permissions ?? DEFAULT_TEAM_PERMISSIONS),
  }
}

export const collaboratorsService = {
  /**
   * Cria um novo colaborador usando o fluxo atômico do backend.
   */
  async createCollaborator(input: CreateCollaboratorInput): Promise<CreateCollaboratorResult> {
    try {
      const normalizedRole = normalizeRoleForStorage(input.role) || input.role
      if (normalizedRole === 'admin') {
        throw new Error('Não é permitido criar administrador pelo módulo de equipe.')
      }

      const { data, error } = await supabase.rpc('create_collaborator', {
        p_email: input.email,
        p_password: input.password,
        p_full_name: input.full_name,
        p_role: normalizedRole,
        p_haras_id: input.haras_id,
        p_role_id: input.role_id ?? null,
        p_permissions: input.permissions ? normalizeTeamPermissions(input.permissions) : null,
        p_status: input.status ?? 'Ativo',
        p_created_by: input.created_by ?? null,
        p_phone: input.phone ?? null,
      })

      if (error) {
        console.error('Erro ao criar colaborador:', error)
        throw error
      }

      return parseCollaboratorResult(data)
    } catch (error) {
      console.error('Error creating collaborator:', error)
      throw error
    }
  },
}
