'use client'

// ============================================
// HOOKS - TASKS
// ============================================

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { tasksService } from '@/services/tasks'
import type { CreateTaskInput, UpdateTaskInput, TaskFilters, PaginationParams } from '@/types'

export const taskKeys = {
  all: ['tasks'] as const,
  list: (filters: TaskFilters, pagination: PaginationParams) =>
    [...taskKeys.all, 'list', filters, pagination] as const,
  detail: (id: string) => [...taskKeys.all, 'detail', id] as const,
}

export function useTasks(
  filters: TaskFilters = {},
  pagination: PaginationParams = { page: 1, limit: 50 },
  enabled: boolean = true
) {
  return useQuery({
    queryKey: taskKeys.list(filters, pagination),
    queryFn: () => tasksService.list(filters, pagination),
    enabled,
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateTaskInput) => tasksService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTaskInput }) =>
      tasksService.update(id, input),
    onSuccess: (data) => {
      queryClient.setQueryData(taskKeys.detail(data.id), data)
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => tasksService.delete(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: taskKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
    },
  })
}
