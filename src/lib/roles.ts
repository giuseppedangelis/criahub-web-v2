export type NormalizedRole =
  | 'admin'
  | 'criador'
  | 'breeder'
  | 'assessor'
  | 'acessor'
  | 'advisor'
  | 'veterinario'
  | 'peao'
  | 'funcionario'
  | 'employee'
  | 'unknown'

const ROLE_RANK: Record<NormalizedRole, number> = {
  admin: 4,
  criador: 3,
  breeder: 3,
  assessor: 2,
  acessor: 2,
  advisor: 2,
  veterinario: 1,
  peao: 1,
  funcionario: 1,
  employee: 1,
  unknown: 0,
}

export function normalizeRole(role?: string | null): NormalizedRole {
  const normalized = (role || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')

  switch (normalized) {
    case 'admin':
      return 'admin'
    case 'criador':
      return 'criador'
    case 'breeder':
      return 'breeder'
    case 'assessor':
      return 'assessor'
    case 'acessor':
      return 'acessor'
    case 'advisor':
      return 'advisor'
    case 'veterinario':
      return 'veterinario'
    case 'peao':
      return 'peao'
    case 'funcionario':
      return 'funcionario'
    case 'employee':
      return 'employee'
    default:
      return 'unknown'
  }
}

export function isAdminRole(role?: string | null): boolean {
  return normalizeRole(role) === 'admin'
}

export function isCreatorRole(role?: string | null): boolean {
  const normalized = normalizeRole(role)
  return normalized === 'criador' || normalized === 'breeder'
}

export function isAdvisorRole(role?: string | null): boolean {
  const normalized = normalizeRole(role)
  return normalized === 'assessor' || normalized === 'acessor' || normalized === 'advisor'
}

export function isStaffRole(role?: string | null): boolean {
  const normalized = normalizeRole(role)
  return (
    normalized === 'veterinario'
    || normalized === 'peao'
    || normalized === 'funcionario'
    || normalized === 'employee'
  )
}

export function getRoleRank(role?: string | null): number {
  return ROLE_RANK[normalizeRole(role)] ?? 0
}

export function normalizeRoleForStorage(role?: string | null): string | null {
  if (!role) return null
  const normalized = normalizeRole(role)
  switch (normalized) {
    case 'assessor':
    case 'advisor':
    case 'acessor':
      return 'acessor'
    case 'admin':
    case 'criador':
    case 'breeder':
    case 'veterinario':
    case 'peao':
    case 'funcionario':
    case 'employee':
      return normalized
    default:
      return role
  }
}
