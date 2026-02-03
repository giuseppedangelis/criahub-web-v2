// ============================================
// DOCUMENTS SERVICE
// Gestão de documentos do haras
// ============================================

import { supabase, handleSupabaseError } from './base'

export interface DocumentMeta {
  status?: string
  tags?: string[]
  linked_animals?: { id: string; name: string }[]
  linked_people?: { id?: string; name: string }[]
  notes?: string
}

export interface DocumentRecord {
  id: string
  haras_id: string
  animal_id: string | null
  titulo: string
  tipo: string
  file_url: string
  tamanho_bytes: number | null
  observacoes: string | null
  created_at?: string | null
  updated_at?: string | null
  animal?: { id: string; nome: string } | null
  meta: DocumentMeta
}

const sanitizeArray = <T>(value: T[] | undefined | null) =>
  (Array.isArray(value) ? value.filter(Boolean) : []) as T[]

export function parseDocumentMeta(observacoes?: string | null): DocumentMeta {
  if (!observacoes) return {}
  const trimmed = observacoes.trim()
  if (!trimmed) return {}
  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed) as DocumentMeta
      if (parsed && typeof parsed === 'object') return parsed
    } catch {
      return { notes: observacoes }
    }
  }
  return { notes: observacoes }
}

export function buildDocumentObservacoes(meta?: DocumentMeta | null): string | null {
  if (!meta) return null
  const payload: DocumentMeta = {}

  if (meta.status) payload.status = meta.status
  if (meta.notes) payload.notes = meta.notes

  const tags = sanitizeArray(meta.tags)
  if (tags.length) payload.tags = tags

  const linkedAnimals = sanitizeArray(meta.linked_animals)
  if (linkedAnimals.length) payload.linked_animals = linkedAnimals

  const linkedPeople = sanitizeArray(meta.linked_people)
  if (linkedPeople.length) payload.linked_people = linkedPeople

  if (!Object.keys(payload).length) return null

  return JSON.stringify(payload)
}

export const documentsService = {
  async list(harasId: string): Promise<DocumentRecord[]> {
    if (!harasId) return []

    const { data, error } = await (supabase as any)
      .from('documents')
      .select(`
        id,
        haras_id,
        animal_id,
        titulo,
        tipo,
        file_url,
        tamanho_bytes,
        observacoes,
        created_at,
        updated_at,
        animal:animals(id, nome)
      `)
      .eq('haras_id', harasId)
      .order('created_at', { ascending: false })

    if (error) handleSupabaseError(error)

    return (data || []).map((row: any) => ({
      id: row.id,
      haras_id: row.haras_id,
      animal_id: row.animal_id ?? null,
      titulo: row.titulo,
      tipo: row.tipo,
      file_url: row.file_url,
      tamanho_bytes: row.tamanho_bytes ?? null,
      observacoes: row.observacoes ?? null,
      created_at: row.created_at ?? null,
      updated_at: row.updated_at ?? null,
      animal: row.animal ?? null,
      meta: parseDocumentMeta(row.observacoes),
    }))
  },

  async create(input: {
    haras_id: string
    animal_id?: string | null
    titulo: string
    tipo: string
    file_url: string
    tamanho_bytes?: number | null
    observacoes?: string | null
    meta?: DocumentMeta | null
  }): Promise<DocumentRecord> {
    const payload = {
      haras_id: input.haras_id,
      animal_id: input.animal_id ?? null,
      titulo: input.titulo,
      tipo: input.tipo,
      file_url: input.file_url,
      tamanho_bytes: input.tamanho_bytes ?? null,
      observacoes: input.observacoes ?? buildDocumentObservacoes(input.meta) ?? null,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await (supabase as any)
      .from('documents')
      .insert(payload)
      .select(`
        id,
        haras_id,
        animal_id,
        titulo,
        tipo,
        file_url,
        tamanho_bytes,
        observacoes,
        created_at,
        updated_at,
        animal:animals(id, nome)
      `)
      .single()

    if (error) handleSupabaseError(error)

    return {
      id: data.id,
      haras_id: data.haras_id,
      animal_id: data.animal_id ?? null,
      titulo: data.titulo,
      tipo: data.tipo,
      file_url: data.file_url,
      tamanho_bytes: data.tamanho_bytes ?? null,
      observacoes: data.observacoes ?? null,
      created_at: data.created_at ?? null,
      updated_at: data.updated_at ?? null,
      animal: data.animal ?? null,
      meta: parseDocumentMeta(data.observacoes),
    }
  },
}
