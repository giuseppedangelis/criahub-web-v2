// ============================================
// ADMIN SUBSCRIPTIONS SERVICE
// Serviço para gerenciamento de assinaturas pelo Admin
// ============================================

import { supabase } from '../base';

// Interface para dados reais do banco
interface HarasData {
  id: string;
  nome: string;
  proprietario: string;
  cidade: string | null;
  estado: string | null;
  telefone: string | null;
  email: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
  subscription_plan: string | null;
  subscription_status: string | null;
  subscription_due_date: string | null;
  subscription_value: number | null;
  subscription_start_date: string | null;
}

export interface AdminSubscription {
  id: string;
  haras_id: string;
  haras_name: string;
  owner_name: string;
  owner_email: string;
  plan: string;
  status: 'active' | 'trial' | 'expired' | 'cancelled' | 'Ativa' | 'Pendente' | 'Vencida' | 'Suspensa';
  start_date: string;
  end_date: string | null;
  trial_ends_at: string | null;
  amount: number;
  payment_method: string | null;
  animals_count: number;
  users_count: number;
  last_payment_date: string | null;
  next_payment_date: string | null;
}

export interface SubscriptionStats {
  total_subscriptions: number;
  active_subscriptions: number;
  trial_subscriptions: number;
  expired_subscriptions: number;
  monthly_revenue: number;
  renewal_rate: number;
  new_customers_month: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  plan?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Busca todas as assinaturas com paginação e filtros
 */
export async function getAdminSubscriptions(
  params: PaginationParams
): Promise<PaginatedResponse<AdminSubscription>> {
  try {
    const { page, limit, search, status, plan } = params;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Query base para haras com informações de assinatura
    let query = supabase
      .from('haras')
      .select('*', { count: 'exact' });

    // Aplicar filtros
    if (search) {
      query = query.or(`nome.ilike.%${search}%,proprietario.ilike.%${search}%,email.ilike.%${search}%`);
    }

    if (status) {
      query = query.eq('subscription_status', status);
    }

    if (plan) {
      query = query.eq('subscription_plan', plan);
    }

    // Aplicar paginação
    const { data: harasData, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Erro ao buscar assinaturas:', error);
      throw new Error(`Erro ao buscar assinaturas: ${error.message}`);
    }

    // Buscar contagens adicionais para cada haras
    const subscriptions = await Promise.all(
      (harasData || []).map(async (haras) => {
        const harasTyped = haras as HarasData;

        // Contar animais do haras
        const { count: animalsCount } = await supabase
          .from('animals')
          .select('*', { count: 'exact', head: true })
          .eq('haras_id', harasTyped.id);

        // Contar membros do haras (via profiles)
        let usersCount = 0;
        try {
          // Contamos profiles vinculados a este haras
          const { count: membersCount } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('haras_id', harasTyped.id);
          usersCount = membersCount || 0;
        } catch (e) {
          usersCount = 0;
        }

        // Buscar última transação
        let lastTransactionDate = null;
        const { data: lastTransaction } = await supabase
          .from('transactions')
          .select('data_transacao')
          .eq('haras_id', harasTyped.id)
          .order('data_transacao', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (lastTransaction) {
          lastTransactionDate = (lastTransaction as any).data_transacao || null;
        }

        return {
          id: harasTyped.id,
          haras_id: harasTyped.id,
          haras_name: harasTyped.nome,
          owner_name: harasTyped.proprietario,
          owner_email: harasTyped.email || 'Não informado',
          plan: harasTyped.subscription_plan || 'free',
          status: normalizeStatus(harasTyped.subscription_status),
          start_date: harasTyped.subscription_start_date || harasTyped.created_at,
          end_date: null,
          trial_ends_at: null,
          amount: harasTyped.subscription_value || getPlanAmount(harasTyped.subscription_plan),
          payment_method: null,
          animals_count: animalsCount || 0,
          users_count: usersCount, // Profiles já deve incluir o proprietário se ele tiver conta
          last_payment_date: lastTransactionDate,
          next_payment_date: harasTyped.subscription_due_date || calculateNextPaymentDate(harasTyped.created_at),
        };
      })
    );

    return {
      data: subscriptions,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  } catch (error) {
    console.error('Erro no serviço getAdminSubscriptions:', error);
    throw error;
  }
}

/**
 * Busca estatísticas de assinaturas
 */
export async function getSubscriptionStats(): Promise<SubscriptionStats> {
  try {
    // Buscar todos os haras
    const { data: allHaras, error } = await supabase
      .from('haras')
      .select('subscription_plan, subscription_status, created_at');

    if (error) {
      console.error('Erro ao buscar haras para estatísticas:', error);
      throw new Error(`Erro ao buscar estatísticas: ${error.message}`);
    }

    const harasList = (allHaras || []) as any[];

    // Calcular estatísticas
    const total_subscriptions = harasList.length;
    const active_subscriptions = harasList.filter(h =>
      h.subscription_status === 'active' || h.subscription_status === 'Ativa'
    ).length;
    const trial_subscriptions = harasList.filter(h =>
      h.subscription_status === 'trial' || h.subscription_status === 'Pendente'
    ).length;
    const expired_subscriptions = harasList.filter(h =>
      h.subscription_status === 'expired' || h.subscription_status === 'Vencida'
    ).length;

    // Calcular receita mensal
    const monthly_revenue = harasList.reduce((total, haras) => {
      return total + (haras.subscription_value || getPlanAmount(haras.subscription_plan));
    }, 0);

    // Calcular taxa de renovação baseada em cancelamentos
    const cancelled_subscriptions = harasList.filter(h =>
      h.subscription_status === 'cancelled' || h.subscription_status === 'Suspensa'
    ).length;

    // Total base para cálculo (Ativas + Canceladas + Vencidas)
    const total_for_rate = active_subscriptions + cancelled_subscriptions + expired_subscriptions;

    // Se não tiver dados suficientes, assumir 100% (todos ativos)
    // Se tiver cancelamentos: 1 - (cancelados / total)
    const renewal_rate = total_for_rate > 0
      ? 1 - (cancelled_subscriptions / total_for_rate)
      : 1.0;

    // Calcular novos clientes no mês atual
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const new_customers_month = harasList.filter(haras => {
      const createdDate = new Date(haras.created_at);
      return createdDate.getMonth() === currentMonth &&
        createdDate.getFullYear() === currentYear;
    }).length;

    return {
      total_subscriptions,
      active_subscriptions,
      trial_subscriptions,
      expired_subscriptions,
      monthly_revenue,
      renewal_rate,
      new_customers_month,
    };
  } catch (error) {
    console.error('Erro no serviço getSubscriptionStats:', error);
    throw error;
  }
}

export interface RevenueData {
  month: string;
  revenue: number;
}

/**
 * Busca histórico de receita dos últimos 6 meses
 */
export async function getRevenueHistory(months: number = 6): Promise<RevenueData[]> {
  try {
    const now = new Date();
    const monthsPromises = [];

    for (let i = months - 1; i >= 0; i--) {
      monthsPromises.push((async () => {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString();
        const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });

        // Tentar buscar transações reais
        const { data: transactions, error } = await supabase
          .from('transactions')
          .select('valor')
          .gte('data_transacao', startOfMonth)
          .lte('data_transacao', endOfMonth)
          .eq('categoria', 'Assinatura');

        let revenue = 0;
        if (!error && transactions && transactions.length > 0) {
          revenue = transactions.reduce((sum, t) => sum + (Number((t as any).valor) || 0), 0);
        } else {
          // Fallback: Calcular baseado em assinaturas ativas criadas até este mês
          // Isso é uma estimativa já que não temos tabela de histórico de pagamentos consolidada ainda
          // Query count of active haras created before end of this month
          const { count } = await supabase
            .from('haras')
            .select('*', { count: 'exact', head: true })
            .lte('created_at', endOfMonth)
            .neq('subscription_status', 'cancelled'); // Approximate

          // Estimate average revenue (mix of Basic/Pro/Premium, avg ~300)
          revenue = (count || 0) * 300;
        }

        return {
          month: monthName,
          revenue
        };
      })());
    }

    const results = await Promise.all(monthsPromises);
    return results;
  } catch (error) {
    console.error('Erro ao buscar histórico de receita:', error);
    return [];
  }
}

/**
 * Atualiza o plano de assinatura de um haras
 */
export async function updateSubscriptionPlan(
  harasId: string,
  plan: string,
  status: string
): Promise<void> {
  try {
    const updateData: any = {
      subscription_plan: plan,
      subscription_status: status,
      updated_at: new Date().toISOString(),
    };

    // Adicionar valor baseado no plano se não especificado
    if (!updateData.subscription_value) {
      updateData.subscription_value = getPlanAmount(plan);
    }

    const { error } = await supabase
      .from('haras')
      .update(updateData)
      .eq('id', harasId);

    if (error) {
      console.error('Erro ao atualizar plano:', error);
      throw new Error(`Erro ao atualizar plano: ${error.message}`);
    }
  } catch (error) {
    console.error('Erro no serviço updateSubscriptionPlan:', error);
    throw error;
  }
}

/**
 * Busca detalhes de um haras específico
 */
export async function getHarasDetails(harasId: string): Promise<any> {
  try {
    const { data: haras, error } = await supabase
      .from('haras')
      .select('*')
      .eq('id', harasId)
      .single();

    if (error) {
      console.error('Erro ao buscar detalhes do haras:', error);
      throw new Error(`Erro ao buscar detalhes: ${error.message}`);
    }

    // Buscar animais do haras
    let animals: any[] = [];
    try {
      const { data: animalsData } = await supabase
        .from('animals')
        .select('*')
        .eq('haras_id', harasId);
      animals = animalsData || [];
    } catch (e) {
      console.warn('Tabela animals não encontrada ou erro:', e);
    }

    // Buscar membros do haras
    let members: any[] = [];
    try {
      const { data: membersData } = await supabase
        .from('profiles')
        .select('*')
        .eq('haras_id', harasId);
      members = membersData || [];
    } catch (e) {
      console.warn('Tabela profiles não encontrada ou erro:', e);
    }

    // Buscar transações recentes
    let transactions: any[] = [];
    try {
      const { data: transactionsData } = await supabase
        .from('transactions')
        .select('*')
        .eq('haras_id', harasId)
        .order('data_transacao', { ascending: false })
        .limit(10);
      transactions = transactionsData || [];
    } catch (e) {
      console.warn('Tabela transactions não encontrada ou erro:', e);
    }

    return {
      haras,
      animals,
      members,
      transactions,
      stats: {
        total_animals: animals.length,
        total_members: members.length + 1, // +1 para o dono
        active_animals: animals.filter(a => a.status === 'ativo').length,
        monthly_transactions: transactions.filter(t => {
          const transDate = new Date(t.data_transacao);
          const now = new Date();
          return transDate.getMonth() === now.getMonth() &&
            transDate.getFullYear() === now.getFullYear();
        }).length,
      },
    };
  } catch (error) {
    console.error('Erro no serviço getHarasDetails:', error);
    throw error;
  }
}

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

/**
 * Normaliza o status para o formato esperado
 */
function normalizeStatus(status: string | null): AdminSubscription['status'] {
  switch (status) {
    case 'active':
    case 'Ativa':
      return 'Ativa';
    case 'trial':
    case 'Pendente':
      return 'Pendente';
    case 'expired':
    case 'Vencida':
      return 'Vencida';
    case 'cancelled':
    case 'Suspensa':
      return 'Suspensa';
    default:
      return 'Ativa';
  }
}

/**
 * Retorna o valor do plano baseado no nome
 */
function getPlanAmount(plan: string | null): number {
  switch (plan) {
    case 'Premium':
    case 'premium':
      return 499.00;
    case 'Professional':
    case 'professional':
      return 299.00;
    case 'Basic':
    case 'basic':
      return 149.00;
    default:
      return 0.00;
  }
}

/**
 * Calcula a próxima data de pagamento (simulação)
 */
function calculateNextPaymentDate(startDate: string): string {
  const date = new Date(startDate);
  date.setMonth(date.getMonth() + 1);
  return date.toISOString().split('T')[0];
}

/**
 * Formata valor monetário
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formata porcentagem
 */
export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}
