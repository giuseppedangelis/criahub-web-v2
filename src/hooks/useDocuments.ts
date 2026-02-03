'use client'

// ============================================
// HOOKS - DOCUMENTS
// ============================================

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { documentsService, type DocumentRecord } from '@/services/documents'

export const documentKeys = {
  all: ['documents'] as const,
  list: (harasId: string) => [...documentKeys.all, harasId] as const,
}

export function useDocuments(harasId: string) {
  return useQuery({
    queryKey: documentKeys.list(harasId),
    queryFn: () => documentsService.list(harasId),
    enabled: !!harasId,
  })
}

export function useCreateDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: {
      haras_id: string
      animal_id?: string | null
      titulo: string
      tipo: string
      file_url: string
      tamanho_bytes?: number | null
      observacoes?: string | null
      meta?: DocumentRecord['meta'] | null
    }) => documentsService.create(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: documentKeys.list(variables.haras_id) })
    },
  })
}
