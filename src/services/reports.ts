// ============================================
// REPORTS SERVICE
// Gerencia historico de relatorios
// ============================================

import { supabase, applyPagination, formatPaginatedResponse, handleSupabaseError } from './base'
import type {
  CreateReportInput,
  PaginationParams,
  PaginatedResponse,
  Report,
  ReportFilters,
} from '@/types'
import type { Json } from '@/types/database.types'

const REPORT_SELECT = `
  id,
  haras_id,
  nome,
  tipo,
  formato,
  status,
  parametros,
  arquivo_url,
  tamanho_bytes,
  agendado_para,
  criado_por,
  created_at,
  updated_at
`

function mapReportRow(row: any): Report {
  return {
    id: row.id,
    haras_id: row.haras_id,
    name: row.nome,
    type: row.tipo,
    format: row.formato,
    status: row.status,
    parameters: row.parametros ?? null,
    file_url: row.arquivo_url ?? null,
    size_bytes: row.tamanho_bytes !== null && row.tamanho_bytes !== undefined
      ? Number(row.tamanho_bytes)
      : null,
    scheduled_for: row.agendado_para ?? null,
    created_by: row.criado_por ?? null,
    created_at: row.created_at ?? null,
    updated_at: row.updated_at ?? null,
  }
}

export const reportsService = {
  async list(
    filters: ReportFilters = {},
    pagination: PaginationParams = { page: 1, limit: 20 }
  ): Promise<PaginatedResponse<Report>> {
    let query = supabase
      .from('reports')
      .select(REPORT_SELECT, { count: 'exact' })

    if (filters.haras_id) query = query.eq('haras_id', filters.haras_id)
    if (filters.type) query = query.eq('tipo', filters.type)
    if (filters.status) query = query.eq('status', filters.status)
    if (filters.start_date) query = query.gte('created_at', filters.start_date)
    if (filters.end_date) query = query.lte('created_at', filters.end_date)

    query = query.order('created_at', { ascending: false })
    query = applyPagination(query, pagination)

    const { data, error, count } = await query
    if (error) handleSupabaseError(error)

    const mapped = (data || []).map(mapReportRow)
    return formatPaginatedResponse(mapped, count || 0, pagination)
  },

  async getRecent(harasId: string, limit: number = 4): Promise<Report[]> {
    const { data, error } = await supabase
      .from('reports')
      .select(REPORT_SELECT)
      .eq('haras_id', harasId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) handleSupabaseError(error)
    return (data || []).map(mapReportRow)
  },

  async getSummary(harasId: string): Promise<{
    total: number
    lastGeneratedAt: string | null
    scheduled: number
  }> {
    const [
      { count: total, error: totalError },
      { count: scheduled, error: scheduledError },
      { data: last, error: lastError },
    ] = await Promise.all([
        supabase
          .from('reports')
          .select('id', { count: 'exact', head: true })
          .eq('haras_id', harasId),
        supabase
          .from('reports')
          .select('id', { count: 'exact', head: true })
          .eq('haras_id', harasId)
          .eq('status', 'Agendado'),
        supabase
          .from('reports')
          .select('created_at')
          .eq('haras_id', harasId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
      ])

    if (totalError) handleSupabaseError(totalError)
    if (scheduledError) handleSupabaseError(scheduledError)
    if (lastError) handleSupabaseError(lastError)

    return {
      total: total || 0,
      scheduled: scheduled || 0,
      lastGeneratedAt: last?.created_at ?? null,
    }
  },

  async create(input: CreateReportInput): Promise<Report> {
    const payload = {
      haras_id: input.haras_id,
      nome: input.name,
      tipo: input.type,
      formato: input.format,
      status: input.status ?? 'Gerado',
      parametros: (input.parameters ?? null) as Json | null,
      arquivo_url: input.file_url ?? null,
      tamanho_bytes: input.size_bytes ?? null,
      agendado_para: input.scheduled_for ?? null,
      criado_por: input.created_by ?? null,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('reports')
      .insert(payload)
      .select(REPORT_SELECT)
      .single()

    if (error) handleSupabaseError(error)
    return mapReportRow(data)
  },

  async update(id: string, input: Partial<CreateReportInput>): Promise<Report> {
    const payload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (input.name !== undefined) payload.nome = input.name
    if (input.type !== undefined) payload.tipo = input.type
    if (input.format !== undefined) payload.formato = input.format
    if (input.status !== undefined) payload.status = input.status
    if (input.parameters !== undefined) payload.parametros = (input.parameters ?? null) as Json | null
    if (input.file_url !== undefined) payload.arquivo_url = input.file_url
    if (input.size_bytes !== undefined) payload.tamanho_bytes = input.size_bytes
    if (input.scheduled_for !== undefined) payload.agendado_para = input.scheduled_for
    if (input.created_by !== undefined) payload.criado_por = input.created_by

    const { data, error } = await supabase
      .from('reports')
      .update(payload)
      .eq('id', id)
      .select(REPORT_SELECT)
      .single()

    if (error) handleSupabaseError(error)
    return mapReportRow(data)
  },
}
