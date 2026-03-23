export type CanonicalRole =
  | 'admin'
  | 'criador'
  | 'assessor'
  | 'veterinario'
  | 'peao'
  | 'funcionario'

export type NormalizedRole =
  | CanonicalRole
  | 'unknown'

const ROLE_RANK: Record<NormalizedRole, number> = {
  admin: 4,
  criador: 3,
  assessor: 2,
  veterinario: 1,
  peao: 1,
  funcionario: 1,
  unknown: 0,
}

function normalizeRoleInput(role: unknown): string {
  return typeof role === 'string' ? role : ''
}

export function normalizeRole(role?: unknown): NormalizedRole {
  const normalized = normalizeRoleInput(role)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')

  switch (normalized) {
    case 'admin':
      return 'admin'
    case 'criador':
    case 'breeder':
      return 'criador'
    case 'assessor':
    case 'acessor':
    case 'advisor':
      return 'assessor'
    case 'veterinario':
      return 'veterinario'
    case 'peao':
      return 'peao'
    case 'funcionario':
    case 'employee':
      return 'funcionario'
    default:
      return 'unknown'
  }
}

export function getRoleLabel(role?: unknown): string {
  switch (normalizeRole(role)) {
    case 'admin':
      return 'Administrador'
    case 'criador':
      return 'Criador/Dono de Haras'
    case 'assessor':
      return 'Assessor Administrativo'
    case 'veterinario':
      return 'Veterinário'
    case 'peao':
      return 'Peão'
    case 'funcionario':
      return 'Funcionário'
    default:
      return 'Usuário'
  }
}

export function isAdminRole(role?: unknown): boolean {
  return normalizeRole(role) === 'admin'
}

export function isCreatorRole(role?: unknown): boolean {
  return normalizeRole(role) === 'criador'
}

export function isAdvisorRole(role?: unknown): boolean {
  return normalizeRole(role) === 'assessor'
}

export function isStaffRole(role?: unknown): boolean {
  const normalized = normalizeRole(role)
  return (
    normalized === 'veterinario'
    || normalized === 'peao'
    || normalized === 'funcionario'
  )
}

export function getRoleRank(role?: unknown): number {
  return ROLE_RANK[normalizeRole(role)] ?? 0
}

export function normalizeRoleForStorage(role?: unknown): string | null {
  if (typeof role !== 'string' || !role.trim()) return null
  const normalized = normalizeRole(role)
  switch (normalized) {
    case 'admin':
    case 'criador':
    case 'assessor':
    case 'veterinario':
    case 'peao':
    case 'funcionario':
      return normalized
    default:
      return role
  }
}
