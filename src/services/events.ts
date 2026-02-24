// ============================================
// EVENTS SERVICE
// Gerencia eventos da agenda
// ============================================

import { supabase, applyPagination, formatPaginatedResponse, handleSupabaseError } from './base'
import type {
  AgendaEvent,
  AgendaEventDetails,
  AgendaEventFilters,
  AgendaEventType,
  CreateAgendaEventInput,
  PaginationParams,
  PaginatedResponse,
} from '@/types'

const EVENT_TYPES: AgendaEventType[] = [
  'Serviço',
  'Evento',
  'Veterinário',
  'Casqueamento',
  'Dentista',
  'Aplicação P4',
  'Coleta Embrião',
  'Diagnóstico Gestação',
  'Outro',
]

function normalizeType(value: string | null | undefined): AgendaEventType {
  if (!value) return 'Outro'
  return EVENT_TYPES.includes(value as AgendaEventType) ? (value as AgendaEventType) : 'Outro'
}

function parseDetails(value: string | null | undefined): { details: AgendaEventDetails | null; notes: string | null } {
  if (!value) return { details: null, notes: null }
  try {
    const parsed = JSON.parse(value)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const notes = typeof (parsed as any).notes === 'string' ? (parsed as any).notes : null
      const { notes: _notes, ...rest } = parsed as Record<string, unknown>
      return { details: rest as AgendaEventDetails, notes }
    }
  } catch {
    // Ignore JSON parsing errors
  }
  return { details: null, notes: value }
}

function buildObservacoes(details?: AgendaEventDetails, observations?: string): string | null {
  const hasDetails = details && Object.keys(details).length > 0
  if (hasDetails) {
    const payload = { ...details }
    if (observations) {
      ;(payload as any).notes = observations
    }
    return JSON.stringify(payload)
  }
  return observations || null
}

function mapEventRow(row: any): AgendaEvent {
  const parsed = parseDetails(row.observacoes)
  return {
    id: row.id,
    haras_id: row.haras_id,
    title: row.titulo,
    type: normalizeType(row.tipo),
    start_date: row.data_inicio,
    end_date: row.data_fim ?? null,
    description: row.descricao ?? null,
    location: row.local ?? null,
    status: row.status ?? null,
    animal_id: row.animal_id ?? null,
    auto_generated: row.auto_gerado ?? null,
    origin: row.origem ?? null,
    origin_id: row.origem_id ?? null,
    observations: parsed.notes,
    responsible: row.responsavel ?? null,
    details: parsed.details,
    animal: row.animal
      ? {
          id: row.animal.id,
          name: row.animal.nome,
          registry_number: row.animal.registro ?? null,
        }
      : null,
  }
}

export const eventsService = {
  /**
   * Lista eventos com filtros e paginação
   */
  async list(
    filters: AgendaEventFilters = {},
    pagination: PaginationParams = { page: 1, limit: 50 }
  ): Promise<PaginatedResponse<AgendaEvent>> {
    let query = supabase
      .from('events')
      .select(
        `
        *,
        animal:animals(id, nome, registro)
      `,
        { count: 'exact' }
      )

    if (filters.haras_id) {
      query = query.eq('haras_id', filters.haras_id)
    }
    if (filters.type) {
      if (Array.isArray(filters.type)) {
        query = query.in('tipo', filters.type)
      } else {
        query = query.eq('tipo', filters.type)
      }
    }
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    if (filters.start_date) {
      query = query.gte('data_inicio', filters.start_date)
    }
    if (filters.end_date) {
      query = query.lte('data_inicio', filters.end_date)
    }
    if (filters.animal_id) {
      query = query.eq('animal_id', filters.animal_id)
    }

    query = query.order('data_inicio', { ascending: true })
    query = applyPagination(query, pagination)

    const { data, error, count } = await query
    if (error) handleSupabaseError(error)

    const mapped = (data || []).map(mapEventRow)
    return formatPaginatedResponse(mapped, count || 0, pagination)
  },

  /**
   * Cria um novo evento
   */
  async create(input: CreateAgendaEventInput): Promise<AgendaEvent> {
    const payload = {
      haras_id: input.haras_id,
      titulo: input.title,
      tipo: input.type,
      data_inicio: input.start_date,
      data_fim: input.end_date ?? null,
      descricao: input.description ?? null,
      local: input.location ?? null,
      status: input.status ?? 'Pendente',
      animal_id: input.animal_id ?? null,
      auto_gerado: input.auto_generated ?? null,
      origem: input.origin ?? null,
      origem_id: input.origin_id ?? null,
      responsavel: input.responsible ?? null,
      observacoes: buildObservacoes(input.details, input.observations),
    }

    const { data, error } = await supabase
      .from('events')
      .insert(payload)
      .select()
      .single()

    if (error) handleSupabaseError(error)

    return mapEventRow(data)
  },

  /**
   * Atualiza um evento
   */
  async update(id: string, input: Partial<CreateAgendaEventInput>): Promise<AgendaEvent> {
    const payload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (input.title !== undefined) payload.titulo = input.title
    if (input.type !== undefined) payload.tipo = input.type
    if (input.start_date !== undefined) payload.data_inicio = input.start_date
    if (input.end_date !== undefined) payload.data_fim = input.end_date
    if (input.description !== undefined) payload.descricao = input.description
    if (input.location !== undefined) payload.local = input.location
    if (input.status !== undefined) payload.status = input.status
    if (input.animal_id !== undefined) payload.animal_id = input.animal_id
    if (input.auto_generated !== undefined) payload.auto_gerado = input.auto_generated
    if (input.origin !== undefined) payload.origem = input.origin
    if (input.origin_id !== undefined) payload.origem_id = input.origin_id
    if (input.responsible !== undefined) payload.responsavel = input.responsible
    if (input.details !== undefined || input.observations !== undefined) {
      payload.observacoes = buildObservacoes(input.details, input.observations)
    }

    const { data, error } = await supabase
      .from('events')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) handleSupabaseError(error)

    return mapEventRow(data)
  },

  /**
   * Exclui um evento
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('events').delete().eq('id', id)
    if (error) handleSupabaseError(error)
  },
}
