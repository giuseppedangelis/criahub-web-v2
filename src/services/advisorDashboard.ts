// ============================================
// ADVISOR DASHBOARD SERVICE
// Dados do dashboard do assessor administrativo
// ============================================

import { supabase } from './base'

export interface AdvisorDashboardStats {
  pendingBirths: number
  pendingOccurrences: number
  activeAnimals: number
  soldAnimals: number
  deceasedAnimals: number
  categoryPista: number
  categoryPasto: number
  categoryReproduction: number
  monthlyRevenue: number
  monthlyExpenses: number
}

const isNonBlockingError = (error: any) => {
  const message = (error?.message || '').toLowerCase()
  const code = error?.code
  return (
    code === '42P01' ||
    code === 'PGRST116' ||
    message.includes('does not exist') ||
    message.includes('permission denied')
  )
}

async function safeCountPending(
  harasId: string,
  type: 'nascimento' | 'ocorrencia'
): Promise<number> {
  try {
    const { count, error } = await (supabase as any)
      .from('pending_validations')
      .select('*', { count: 'exact', head: true })
      .eq('haras_id', harasId)
      .eq('type', type)
      .eq('status', 'pendente')

    if (error) {
      if (isNonBlockingError(error)) return 0
      throw error
    }

    return count || 0
  } catch (error) {
    console.warn('Pending validations unavailable:', error)
    return 0
  }
}

function normalizeValue(value?: string | null) {
  return (value || '').toLowerCase().trim()
}

export const advisorDashboardService = {
  async getStats(harasId: string): Promise<AdvisorDashboardStats> {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]

    const animalsPromise = supabase
      .from('animals')
      .select('status, tipo_servico, localizacao')
      .eq('haras_id', harasId)

    const transactionsPromise = supabase
      .from('transactions')
      .select('tipo, valor')
      .eq('haras_id', harasId)
      .gte('data_transacao', firstDay)
      .lte('data_transacao', lastDay)

    const [
      { data: animalsData, error: animalsError },
      { data: transactionsData, error: transactionsError },
      pendingBirths,
      pendingOccurrences,
    ] = await Promise.all([
      animalsPromise,
      transactionsPromise,
      safeCountPending(harasId, 'nascimento'),
      safeCountPending(harasId, 'ocorrencia'),
    ])

    if (animalsError) throw animalsError
    if (transactionsError) throw transactionsError

    const animals = animalsData || []
    const transactions = transactionsData || []

    let activeAnimals = 0
    let soldAnimals = 0
    let deceasedAnimals = 0
    let categoryPista = 0
    let categoryPasto = 0
    let categoryReproduction = 0

    animals.forEach((animal: any) => {
      const status = normalizeValue(animal.status)
      if (status === 'ativo') activeAnimals += 1
      if (status === 'vendido') soldAnimals += 1
      if (status === 'falecido' || status === 'morto') deceasedAnimals += 1

      const categorySource = `${animal.tipo_servico || ''} ${animal.localizacao || ''}`.toLowerCase()
      if (categorySource.includes('pista')) {
        categoryPista += 1
      } else if (categorySource.includes('pasto')) {
        categoryPasto += 1
      } else if (categorySource.includes('repro')) {
        categoryReproduction += 1
      }
    })

    let monthlyRevenue = 0
    let monthlyExpenses = 0
    transactions.forEach((transaction: any) => {
      const type = normalizeValue(transaction.tipo)
      const amount = Number(transaction.valor) || 0
      if (type === 'receita') {
        monthlyRevenue += amount
      } else if (type === 'despesa') {
        monthlyExpenses += amount
      }
    })

    return {
      pendingBirths,
      pendingOccurrences,
      activeAnimals,
      soldAnimals,
      deceasedAnimals,
      categoryPista,
      categoryPasto,
      categoryReproduction,
      monthlyRevenue,
      monthlyExpenses,
    }
  },
}
