import { useCallback, useMemo } from 'react'
import { useUser } from '@/contexts/UserContext'
import { useCurrentHaras } from '@/hooks/useHaras'
import { useTeamMembers } from '@/hooks/useTeam'
import { normalizeTeamPermissions, type TeamPermissionKey, type TeamPermissions } from '@/services/team'
import { isAdminRole, isCreatorRole, normalizeRole } from '@/lib/roles'

export type AccessModule =
  | 'dashboard'
  | 'plantel'
  | 'herd'
  | 'reproduction'
  | 'financial'
  | 'finance'
  | 'agenda'
  | 'calendar'
  | 'tasks'
  | 'team'
  | 'reports'
  | 'documents'
  | 'settings'
  | 'help'

const MODULE_PERMISSIONS: Partial<Record<AccessModule, TeamPermissionKey[]>> = {
  plantel: ['viewHerd'],
  herd: ['viewHerd'],
  reproduction: ['reproduction'],
  financial: ['financialManagement'],
  finance: ['financialManagement'],
  agenda: ['registerActivities'],
  calendar: ['registerActivities'],
  tasks: ['registerActivities'],
  team: ['teamManagement'],
  reports: ['documentManagement'],
  documents: ['documentManagement'],
}

export function useAccessControl() {
  const { user, profile, stableHarasId, isSessionReady } = useUser()
  const { data: currentHaras } = useCurrentHaras()
  const harasId = currentHaras?.id || stableHarasId || ''

  const roleKey = normalizeRole(profile?.role)
  const isAdmin = isAdminRole(roleKey)
  const isCreator = isCreatorRole(roleKey)

  const { data: members = [], isLoading } = useTeamMembers(harasId, !!harasId && isSessionReady)

  const currentMember = useMemo(
    () => members.find((member) => member.user_id === user?.id),
    [members, user?.id]
  )

  const permissions: TeamPermissions = useMemo(
    () => normalizeTeamPermissions(currentMember?.permissions || currentMember?.role?.permissions),
    [currentMember]
  )

  const isReady = isAdmin || isCreator || !isLoading
  const hasMembership = Boolean(currentMember)

  const canAccessModule = useCallback((module: AccessModule) => {
    if (isAdmin || isCreator) return true
    const required = MODULE_PERMISSIONS[module]
    if (!required || required.length === 0) return true
    if (!hasMembership && !isLoading) return false
    return required.some((key) => permissions[key])
  }, [isAdmin, isCreator, hasMembership, isLoading, permissions])

  return {
    canAccessModule,
    permissions,
    isReady,
    isAdmin,
    isCreator,
  }
}
