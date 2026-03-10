import type { AnimalLocationType, AnimalServiceType, HarasLocationSettings } from '@/types'

const SERVICE_TYPE_LABELS: Record<AnimalServiceType, string> = {
  Reproducao: 'Reprodução',
  Trabalho: 'Trabalho',
  Repouso: 'Repouso',
  Hospedagem: 'Hospedagem',
  Compra: 'Compra',
  Nascimento: 'Nascimento',
  Outro: 'Outro',
}

export const DEFAULT_HARAS_LOCATION_SETTINGS: HarasLocationSettings = {
  baias: ['Baia 01', 'Baia 02', 'Baia 03'],
  pastos: ['Pasto Maternidade', 'Pasto Norte', 'Pasto Sul'],
  servicos: ['Centro de Treinamento', 'Hospedagem Externa'],
}

function normalizeText(value: string | null | undefined): string {
  if (!value) return ''
  return value
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

function normalizeOption(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

function dedupeAndSort(values: string[]): string[] {
  const seen = new Set<string>()
  const normalized = values
    .map(normalizeOption)
    .filter(Boolean)
    .filter((value) => {
      const key = normalizeText(value)
      if (!key || seen.has(key)) return false
      seen.add(key)
      return true
    })

  return normalized.sort((a, b) => a.localeCompare(b, 'pt-BR', { sensitivity: 'base' }))
}

export function normalizeHarasLocationSettings(
  input?: Partial<HarasLocationSettings> | null
): HarasLocationSettings {
  return {
    baias: dedupeAndSort(input?.baias ?? DEFAULT_HARAS_LOCATION_SETTINGS.baias),
    pastos: dedupeAndSort(input?.pastos ?? DEFAULT_HARAS_LOCATION_SETTINGS.pastos),
    servicos: dedupeAndSort(input?.servicos ?? DEFAULT_HARAS_LOCATION_SETTINGS.servicos),
  }
}

export function getServiceTypeLabel(value?: string | null): string {
  const normalized = normalizeServiceType(value)
  return normalized ? SERVICE_TYPE_LABELS[normalized] : value || ''
}

export function normalizeServiceType(value?: string | null): AnimalServiceType | null {
  const key = normalizeText(value)
  if (!key) return null
  if (key.includes('reproducao')) return 'Reproducao'
  if (key.includes('trabalho')) return 'Trabalho'
  if (key.includes('repouso')) return 'Repouso'
  if (key.includes('hospedagem')) return 'Hospedagem'
  if (key.includes('compra')) return 'Compra'
  if (key.includes('nascimento')) return 'Nascimento'
  return 'Outro'
}

export function buildAnimalLocationLabel(
  locationType: AnimalLocationType,
  locationName: string,
  serviceType?: string | null
): string {
  const normalizedName = normalizeOption(locationName)
  if (locationType === 'Servico') {
    const normalizedServiceType = normalizeServiceType(serviceType) || 'Outro'
    return `Servico - ${getServiceTypeLabel(normalizedServiceType)} - ${normalizedName}`
  }
  return normalizedName
}

export function resolveLocationTypeFromLabel(
  location?: string | null,
  serviceType?: string | null
): AnimalLocationType {
  const key = normalizeText(location)
  if (normalizeServiceType(serviceType)) return 'Servico'
  if (key.startsWith('servico')) return 'Servico'
  if (key.includes('pasto')) return 'Pasto'
  if (key.includes('baia')) return 'Baia'
  return 'Baia'
}

export function parseAnimalLocation(
  location?: string | null,
  serviceType?: string | null
): {
  locationType: AnimalLocationType
  locationName: string
  serviceType: AnimalServiceType | null
  label: string
} {
  const label = normalizeOption(location || '')
  const normalizedServiceType = normalizeServiceType(serviceType)
  const serviceMatch = label.match(/^Servico\s*-\s*(.+?)\s*-\s*(.+)$/i)

  if (serviceMatch) {
    return {
      locationType: 'Servico',
      locationName: normalizeOption(serviceMatch[2]),
      serviceType: normalizeServiceType(serviceMatch[1]),
      label,
    }
  }

  if (normalizedServiceType) {
    return {
      locationType: 'Servico',
      locationName: label,
      serviceType: normalizedServiceType,
      label,
    }
  }

  const locationType = resolveLocationTypeFromLabel(label)
  return {
    locationType,
    locationName: label,
    serviceType: null,
    label,
  }
}

export function getLocationOptionsForType(
  settings: HarasLocationSettings,
  locationType: AnimalLocationType
): string[] {
  if (locationType === 'Baia') return settings.baias
  if (locationType === 'Pasto') return settings.pastos
  return settings.servicos
}

export function withCurrentLocationOption(
  options: string[],
  currentLocation?: string | null
): string[] {
  const normalizedCurrent = normalizeOption(currentLocation || '')
  if (!normalizedCurrent) return options
  if (options.some((option) => normalizeText(option) === normalizeText(normalizedCurrent))) {
    return options
  }
  return [`Atual: ${normalizedCurrent}`, ...options]
}

export function unwrapLocationOptionLabel(value: string): string {
  return value.startsWith('Atual: ') ? value.slice('Atual: '.length).trim() : value
}

export function isHospedagemLocation(location?: string | null, serviceType?: string | null): boolean {
  const normalizedServiceType = normalizeServiceType(serviceType)
  if (normalizedServiceType === 'Hospedagem') return true
  return normalizeText(location).includes('hospedagem')
}
