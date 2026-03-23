// ============================================
// HOOKS - Exportação centralizada
// ============================================

// Hooks de domínio (TanStack Query)
export * from './useAnimals'
export * from './useReproduction'
export * from './useFinancial'
export * from './useHaras'
export * from './useEvents'
export * from './useVeterinarians'
export * from './useReports'
export {
  harasSettingsKeys,
  useHarasSettings,
  useUpdateHarasSettings,
  useHarasTeamMembers,
  useUpdateTeamMemberStatus,
} from './useHarasSettings'
export * from './useProfileSettings'
export * from './useSessions'
export * from './useAdvisorDashboard'
export * from './useTasks'
export * from './useTeam'
export * from './useDocuments'

// Hooks utilitários
export * from './useResponsive'
export * from './useEscapeKey'
