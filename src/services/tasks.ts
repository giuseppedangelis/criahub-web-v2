// ============================================
// TASKS SERVICE
// Gerencia tarefas do haras
// ============================================

import { supabase, applyPagination, formatPaginatedResponse, handleSupabaseError } from './base'
import type {
  Task,
  TaskFilters,
  CreateTaskInput,
  UpdateTaskInput,
  PaginationParams,
  PaginatedResponse,
  TaskDocument,
  TaskPhoto,
} from '@/types'

const STATUS_LABELS: Record<string, string> = {
  pendente: 'Pendente',
  em_andamento: 'Em andamento',
  concluida: 'Concluida',
}

const PRIORITY_LABELS: Record<string, string> = {
  baixa: 'Baixa',
  media: 'Media',
  alta: 'Alta',
}

function normalizeDocuments(value: unknown): TaskDocument[] {
  if (!Array.isArray(value)) return []
  return value.filter(Boolean) as TaskDocument[]
}

function normalizePhotos(value: unknown): TaskPhoto[] {
  if (!Array.isArray(value)) return []
  return value.filter(Boolean) as TaskPhoto[]
}

function mapTaskRow(row: any): Task {
  return {
    id: row.id,
    task_number: row.task_number ?? null,
    haras_id: row.haras_id,
    title: row.title,
    due_date: row.due_date,
    status: row.status,
    priority: row.priority,
    observations: row.observations ?? null,
    animal_id: row.animal_id ?? null,
    responsible_id: row.responsible_id ?? null,
    documents: normalizeDocuments(row.documents),
    photos: normalizePhotos(row.photos),
    created_by: row.created_by ?? null,
    created_at: row.created_at ?? null,
    updated_at: row.updated_at ?? null,
    animal: row.animal
      ? {
          id: row.animal.id,
          name: row.animal.nome ?? row.animal.name ?? null,
        }
      : null,
    responsible: row.responsible
      ? {
          id: row.responsible.id,
          full_name: row.responsible.full_name ?? null,
          email: row.responsible.email ?? null,
        }
      : null,
  }
}

export const tasksService = {
  async list(
    filters: TaskFilters = {},
    pagination: PaginationParams = { page: 1, limit: 50 }
  ): Promise<PaginatedResponse<Task>> {
    let query = supabase
      .from('tasks')
      .select(
        `
        *,
        animal:animals!tasks_animal_id_fkey(id, nome),
        responsible:profiles!tasks_responsible_id_fkey(id, full_name, email)
      `,
        { count: 'exact' }
      )

    if (filters.haras_id) {
      query = query.eq('haras_id', filters.haras_id)
    }
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    if (filters.priority) {
      query = query.eq('priority', filters.priority)
    }
    if (filters.responsible_id) {
      query = query.eq('responsible_id', filters.responsible_id)
    }
    if (filters.animal_id) {
      query = query.eq('animal_id', filters.animal_id)
    }
    if (filters.search) {
      const search = filters.search.trim()
      if (search) {
        query = query.or(
          `title.ilike.%${search}%,observations.ilike.%${search}%`
        )
      }
    }

    query = query.order('due_date', { ascending: true })
    query = applyPagination(query, pagination)

    const { data, error, count } = await query

    if (error) handleSupabaseError(error)

    const mapped = (data || []).map(mapTaskRow)
    return formatPaginatedResponse(mapped, count || 0, pagination)
  },

  async create(input: CreateTaskInput): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        haras_id: input.haras_id,
        title: input.title,
        due_date: input.due_date,
        status: input.status ?? 'pendente',
        priority: input.priority ?? 'media',
        observations: input.observations ?? null,
        animal_id: input.animal_id ?? null,
        responsible_id: input.responsible_id ?? null,
        documents: input.documents ?? [],
        photos: input.photos ?? [],
        created_by: input.created_by ?? null,
      })
      .select(
        `
        *,
        animal:animals!tasks_animal_id_fkey(id, nome),
        responsible:profiles!tasks_responsible_id_fkey(id, full_name, email)
      `
      )
      .single()

    if (error) handleSupabaseError(error)

    return mapTaskRow(data)
  },

  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    const payload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (input.title !== undefined) payload.title = input.title
    if (input.due_date !== undefined) payload.due_date = input.due_date
    if (input.status !== undefined) payload.status = input.status
    if (input.priority !== undefined) payload.priority = input.priority
    if (input.observations !== undefined) payload.observations = input.observations
    if (input.animal_id !== undefined) payload.animal_id = input.animal_id
    if (input.responsible_id !== undefined) payload.responsible_id = input.responsible_id
    if (input.documents !== undefined) payload.documents = input.documents
    if (input.photos !== undefined) payload.photos = input.photos

    const { data, error } = await supabase
      .from('tasks')
      .update(payload)
      .eq('id', id)
      .select(
        `
        *,
        animal:animals!tasks_animal_id_fkey(id, nome),
        responsible:profiles!tasks_responsible_id_fkey(id, full_name, email)
      `
      )
      .single()

    if (error) handleSupabaseError(error)

    return mapTaskRow(data)
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (error) handleSupabaseError(error)
  },

  statusLabels: STATUS_LABELS,
  priorityLabels: PRIORITY_LABELS,
}
