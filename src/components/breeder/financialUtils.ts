import type { TransactionCategory, TransactionType } from '@/types'

export const transactionTypeLabels: Record<TransactionType, string> = {
  receita: 'Receita',
  despesa: 'Despesa',
}

export const transactionCategoryOptions: Record<TransactionType, { value: TransactionCategory; label: string }[]> = {
  receita: [
    { value: 'venda_animal', label: 'Venda de Animal' },
    { value: 'servico_reproducao', label: 'Serviço de Reprodução' },
    { value: 'premiacao', label: 'Premiação' },
    { value: 'outros', label: 'Outros' },
  ],
  despesa: [
    { value: 'alimentacao', label: 'Alimentação' },
    { value: 'veterinario', label: 'Veterinário' },
    { value: 'medicamento', label: 'Medicamentos' },
    { value: 'equipamento', label: 'Equipamentos' },
    { value: 'funcionario', label: 'Funcionários' },
    { value: 'infraestrutura', label: 'Infraestrutura' },
    { value: 'outros', label: 'Outros' },
  ],
}

const categoryLabelLookup = transactionCategoryOptions.receita
  .concat(transactionCategoryOptions.despesa)
  .reduce((acc, item) => {
    acc[item.value] = item.label
    return acc
  }, {} as Record<string, string>)

export function getCategoryLabel(category?: string | null): string {
  if (!category) return '-'
  return categoryLabelLookup[category] || category
}

export function parseCurrencyToNumber(value: string): number {
  if (!value) return 0
  const normalized = value
    .replace(/[^\d,.-]/g, '')
    .replace(/\.(?=\d{3,})/g, '')
    .replace(',', '.')
  const amount = Number(normalized)
  return Number.isFinite(amount) ? amount : 0
}

export function formatCurrencyInput(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (!digits) return ''
  const amount = Number(digits) / 100
  return formatCurrency(amount)
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value || 0)
}

export function formatDate(value?: string | null): string {
  if (!value) return '-'
  const [year, month, day] = value.split('T')[0].split('-')
  if (!year || !month || !day) return value
  return `${day}/${month}/${year}`
}
