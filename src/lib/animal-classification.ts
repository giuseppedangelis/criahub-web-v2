import type { AnimalCategory, AnimalStatus, AnimalSex } from '@/types'

function normalizeKey(value: string | null | undefined): string {
  if (!value) return ''
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

export function isManualCastradoCategory(category?: string | null): boolean {
  return normalizeKey(category).includes('castrado')
}

export function getAgeInMonths(birthDate?: string | null): number | null {
  if (!birthDate) return null
  const birth = new Date(birthDate)
  if (Number.isNaN(birth.getTime())) return null

  const today = new Date()
  let months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth())
  if (today.getDate() < birth.getDate()) {
    months -= 1
  }

  return months
}

export function resolveCategoryByAge(
  sex?: AnimalSex | string | null,
  birthDate?: string | null
): AnimalCategory | '' {
  if (!sex || !birthDate) return ''

  const ageInMonths = getAgeInMonths(birthDate)
  if (ageInMonths === null) return ''

  if (ageInMonths < 24) {
    return sex === 'Fêmea' ? 'potra' : 'potro'
  }

  return sex === 'Fêmea' ? 'egua' : 'garanhao'
}

export function isAdultByAgeOrCategory(item: {
  birth_date?: string | null
  category?: string | null
}): boolean {
  if (isManualCastradoCategory(item.category)) return false

  const ageInMonths = getAgeInMonths(item.birth_date)
  if (ageInMonths !== null) return ageInMonths >= 24

  const categoryKey = normalizeKey(item.category)
  return categoryKey.includes('garanhao') || categoryKey.includes('egua')
}

export function resolveManagedCategory(
  sex?: AnimalSex | string | null,
  birthDate?: string | null,
  currentCategory?: string | null
): AnimalCategory | '' {
  if (isManualCastradoCategory(currentCategory)) return 'castrado'
  return resolveCategoryByAge(sex, birthDate)
}

export function getDisplayCategoryLabel(category?: string | null): string {
  const key = normalizeKey(category)
  if (!key) return '-'
  if (key.includes('potranca') || key === 'potra') return 'Potra'
  if (key === 'potro') return 'Potro'
  if (key.includes('garanhao')) return 'Garanhão'
  if (key.includes('egua')) return 'Égua'
  if (key.includes('castrado')) return 'Castrado'
  return category || '-'
}

export function normalizeAnimalStatus(status?: string | null): AnimalStatus | '' {
  const key = normalizeKey(status)
  if (!key) return ''
  if (key === 'ativo') return 'ativo'
  if (key === 'provisorio') return 'provisorio'
  if (key === 'vendido') return 'vendido'
  if (key === 'morto' || key === 'obito' || key === 'falecido') return 'morto'
  if (key === 'emprestado' || key === 'transferido') return 'emprestado'
  if (key === 'emservico') return 'em_servico'
  return ''
}

export function getAnimalStatusLabel(status?: string | null): string {
  const normalized = normalizeAnimalStatus(status)
  switch (normalized) {
    case 'ativo':
      return 'Ativo'
    case 'provisorio':
      return 'Provisório'
    case 'vendido':
      return 'Vendido'
    case 'morto':
      return 'Falecido'
    case 'emprestado':
      return 'Transferido'
    case 'em_servico':
      return 'Em serviço'
    default:
      return status || '-'
  }
}

export function isPlantelActiveStatus(status?: string | null): boolean {
  const normalized = normalizeAnimalStatus(status)
  return normalized !== 'vendido' && normalized !== 'morto'
}

export function getPlantelStatusActivity(status?: string | null): 'Ativo' | 'Inativo' {
  return isPlantelActiveStatus(status) ? 'Ativo' : 'Inativo'
}
