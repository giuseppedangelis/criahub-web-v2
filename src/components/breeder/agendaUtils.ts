import type { AgendaEventType } from '@/types'

export type AgendaTabKey = 'services' | 'events'

export const serviceCategories = [
  { value: 'saude', label: 'Saúde', color: 'bg-green-500' },
  { value: 'consulta', label: 'Consulta Veterinária', color: 'bg-blue-500' },
  { value: 'cobertura', label: 'Cobertura', color: 'bg-red-500' },
  { value: 'exame', label: 'Exame Reprodutivo', color: 'bg-purple-500' },
  { value: 'casqueamento', label: 'Casqueamento', color: 'bg-yellow-500' },
  { value: 'parto', label: 'Parto', color: 'bg-pink-500' },
  { value: 'coleta', label: 'Coleta de Sêmen', color: 'bg-cyan-500' },
  { value: 'manejo', label: 'Manejo Geral', color: 'bg-orange-500' },
]

export const eventCategories = [
  { value: 'pista', label: 'Pista/Prova de Marcha', color: 'bg-blue-500' },
  { value: 'exposicao', label: 'Exposição', color: 'bg-purple-500' },
  { value: 'leilao', label: 'Leilão', color: 'bg-green-500' },
  { value: 'copa', label: 'Copa', color: 'bg-yellow-500' },
  { value: 'torneio', label: 'Torneio', color: 'bg-red-500' },
  { value: 'feira', label: 'Feira Agropecuária', color: 'bg-orange-500' },
  { value: 'outro', label: 'Outro', color: 'bg-gray-500' },
]

export function getCategoryConfig(
  category?: string | null,
  tab?: AgendaTabKey
): { label: string; color: string } {
  const list = tab === 'events' ? eventCategories : serviceCategories
  const found = list.find((item) => item.value === category)
  if (found) {
    return { label: found.label, color: found.color }
  }
  return { label: category || 'Outro', color: 'bg-gray-500' }
}

export function resolveAgendaType(tab: AgendaTabKey): AgendaEventType {
  return tab === 'events' ? 'Evento' : 'Serviço'
}

export function formatAgendaDateLabel(date: Date): string {
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function formatAgendaTimeLabel(date: Date): string {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}
