// ============================================
// ADMIN METRICS SERVICE
// Serviço para métricas de uso da plataforma pelo Admin
// ============================================

import { supabase } from '../base';

export interface PlatformMetrics {
  total_users: number;
  total_animals: number;
  active_users_today: number;
  storage_used_gb: number;
  total_haras: number;
  growth_data: GrowthData[];
  plan_distribution: PlanDistribution[];
  feature_usage: FeatureUsage[];
}

export interface GrowthData {
  month: string;
  users: number;
  animals: number;
  haras: number;
}

export interface PlanDistribution {
  plan: string;
  count: number;
  percentage: number;
}

export interface FeatureUsage {
  feature: string;
  usage_count: number;
  percentage: number;
}

export interface TopHarasUsage {
  haras_id: string;
  haras_name: string;
  animals_count: number;
  users_count: number;
  transactions_count: number;
  last_active: string;
}

/**
 * Busca métricas gerais da plataforma
 */
export async function getPlatformMetrics(): Promise<PlatformMetrics> {
  try {
    // Buscar contagens totais
    const [
      totalUsers,
      totalAnimals,
      totalHaras,
      activeUsersToday,
    ] = await Promise.all([
      getTotalUsers(),
      getTotalAnimals(),
      getTotalHaras(),
      getActiveUsersToday(),
    ]);

    // Buscar dados de crescimento (últimos 6 meses)
    const growth_data = await getGrowthData();

    // Buscar distribuição de planos
    const plan_distribution = await getPlanDistribution();

    // Buscar uso por funcionalidade
    const feature_usage = await getFeatureUsage();

    // Calcular armazenamento usado (simulação)
    const storage_used_gb = await calculateStorageUsed();

    return {
      total_users: totalUsers,
      total_animals: totalAnimals,
      active_users_today: activeUsersToday,
      storage_used_gb,
      total_haras: totalHaras,
      growth_data,
      plan_distribution,
      feature_usage,
    };
  } catch (error) {
    console.error('Erro no serviço getPlatformMetrics:', error);
    throw error;
  }
}

/**
 * Busca os haras com maior uso
 */
export async function getTopHarasUsage(limit: number = 10): Promise<TopHarasUsage[]> {
  try {
    // Buscar todos os haras
    const { data: allHaras, error } = await supabase
      .from('haras')
      .select('id, nome, created_at');

    if (error) {
      console.error('Erro ao buscar haras:', error);
      throw new Error(`Erro ao buscar haras: ${error.message}`);
    }

    const harasList = (allHaras || []) as any[];

    // Para cada haras, buscar métricas
    const harasUsage = await Promise.all(
      harasList.map(async (haras) => {
        const [
          animalsCount,
          usersCount,
          transactionsCount,
          lastActive,
        ] = await Promise.all([
          getHarasAnimalsCount(haras.id),
          getHarasUsersCount(haras.id),
          getHarasTransactionsCount(haras.id),
          getHarasLastActive(haras.id),
        ]);

        return {
          haras_id: haras.id,
          haras_name: haras.nome,
          animals_count: animalsCount,
          users_count: usersCount,
          transactions_count: transactionsCount,
          last_active: lastActive || haras.created_at,
        };
      })
    );

    // Ordenar por uso (animais + usuários + transações)
    return harasUsage
      .sort((a, b) => {
        const scoreA = a.animals_count + a.users_count + a.transactions_count;
        const scoreB = b.animals_count + b.users_count + b.transactions_count;
        return scoreB - scoreA;
      })
      .slice(0, limit);
  } catch (error) {
    console.error('Erro no serviço getTopHarasUsage:', error);
    throw error;
  }
}

/**
 * Busca dados de crescimento dos últimos 6 meses
 */
export async function getGrowthData(months: number = 6): Promise<GrowthData[]> {
  try {
    const now = new Date();
    const monthsPromises = [];

    for (let i = months - 1; i >= 0; i--) {
      monthsPromises.push((async () => {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });

        // Buscar contagens para este mês em paralelo
        const [
          usersCount,
          animalsCount,
          harasCount,
        ] = await Promise.all([
          getUsersCountByMonth(date),
          getAnimalsCountByMonth(date),
          getHarasCountByMonth(date),
        ]);

        return {
          month: monthName,
          users: usersCount,
          animals: animalsCount,
          haras: harasCount,
          sortDate: date.getTime() // Helper para ordenar depois
        };
      })());
    }

    const results = await Promise.all(monthsPromises);

    // Garantir ordem cronológica
    return results
      .sort((a, b) => a.sortDate - b.sortDate)
      .map(({ month, users, animals, haras }) => ({ month, users, animals, haras }));

  } catch (error) {
    console.error('Erro no serviço getGrowthData:', error);
    // Em caso de erro, retornar array vazio para não quebrar o dashboard inteiro
    return [];
  }
}

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

/**
 * Busca total de usuários
 */
async function getTotalUsers(): Promise<number> {
  const { count, error } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Erro ao contar usuários:', error);
    return 0;
  }

  return count || 0;
}

/**
 * Busca total de animais
 */
async function getTotalAnimals(): Promise<number> {
  const { count, error } = await supabase
    .from('animals')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Erro ao contar animais:', error);
    return 0;
  }

  return count || 0;
}

/**
 * Busca total de haras
 */
async function getTotalHaras(): Promise<number> {
  const { count, error } = await supabase
    .from('haras')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Erro ao contar haras:', error);
    return 0;
  }

  return count || 0;
}

/**
 * Busca usuários ativos hoje (baseado em updated_at recente)
 */
async function getActiveUsersToday(): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('updated_at', today.toISOString());

  if (error) {
    console.error('Erro ao contar usuários ativos hoje:', error);
    return 0;
  }

  return count || 0;
}

/**
 * Calcula armazenamento usado baseado na tabela storage_files
 */
async function calculateStorageUsed(): Promise<number> {
  const { data, error } = await supabase
    .from('storage_files')
    .select('file_size');

  if (error) {
    console.error('Erro ao calcular armazenamento:', error);
    // Fallback: estimativa baseada nos dados
    const totalAnimals = await getTotalAnimals();
    const storageMB = totalAnimals * 5; // 5MB por animal estimado
    return parseFloat((storageMB / 1024).toFixed(2));
  }

  // Somar todos os tamanhos de arquivo (em bytes)
  const totalBytes = (data || []).reduce((sum: number, file: any) => sum + (file.file_size || 0), 0);

  // Converter para GB
  const totalGB = totalBytes / (1024 * 1024 * 1024);
  return parseFloat(totalGB.toFixed(2));
}

/**
 * Busca distribuição de planos
 */
async function getPlanDistribution(): Promise<PlanDistribution[]> {
  const { data: haras, error } = await supabase
    .from('haras')
    .select('subscription_plan');

  if (error) {
    console.error('Erro ao buscar planos:', error);
    return [];
  }

  const planCounts: Record<string, number> = {};
  ((haras || []) as any[]).forEach(haras => {
    const plan = haras.subscription_plan || 'free';
    planCounts[plan] = (planCounts[plan] || 0) + 1;
  });

  const total = haras?.length || 0;
  return Object.entries(planCounts).map(([plan, count]) => ({
    plan,
    count,
    percentage: total > 0 ? count / total : 0,
  }));
}

/**
 * Busca uso por funcionalidade baseado em dados reais
 */
async function getFeatureUsage(): Promise<FeatureUsage[]> {
  try {
    // Buscar total de haras para calcular percentual
    const totalHaras = await getTotalHaras();
    if (totalHaras === 0) return [];

    // Buscar contagens de cada funcionalidade
    const [
      animalsResult,
      coveringsResult,
      transactionsResult,
      eventsResult,
      documentsResult,
      healthResult,
    ] = await Promise.all([
      supabase.from('animals').select('haras_id', { count: 'exact', head: false }),
      supabase.from('coverings').select('haras_id', { count: 'exact', head: false }),
      supabase.from('transactions').select('haras_id', { count: 'exact', head: false }),
      supabase.from('events').select('haras_id', { count: 'exact', head: false }),
      supabase.from('documents').select('haras_id', { count: 'exact', head: false }),
      supabase.from('health_records').select('haras_id', { count: 'exact', head: false }),
    ]);

    // Contar haras únicos que usam cada funcionalidade
    const getUniqueHarasCount = (data: any[] | null) => {
      if (!data) return 0;
      const uniqueHaras = new Set(data.map((item: any) => item.haras_id).filter(Boolean));
      return uniqueHaras.size;
    };

    const features = [
      {
        feature: 'Plantel (Animais)',
        count: getUniqueHarasCount(animalsResult.data)
      },
      {
        feature: 'Reprodução',
        count: getUniqueHarasCount(coveringsResult.data)
      },
      {
        feature: 'Financeiro',
        count: getUniqueHarasCount(transactionsResult.data)
      },
      {
        feature: 'Agenda',
        count: getUniqueHarasCount(eventsResult.data)
      },
      {
        feature: 'Documentos',
        count: getUniqueHarasCount(documentsResult.data)
      },
      {
        feature: 'Saúde',
        count: getUniqueHarasCount(healthResult.data)
      },
    ];

    // Calcular percentual e ordenar por uso
    return features
      .map(f => ({
        feature: f.feature,
        usage_count: f.count,
        percentage: f.count / totalHaras,
      }))
      .sort((a, b) => b.percentage - a.percentage);

  } catch (error) {
    console.error('Erro ao buscar uso por funcionalidade:', error);
    return [];
  }
}

/**
 * Busca contagem de animais por haras
 */
async function getHarasAnimalsCount(harasId: string): Promise<number> {
  const { count, error } = await supabase
    .from('animals')
    .select('*', { count: 'exact', head: true })
    .eq('haras_id', harasId);

  if (error) {
    console.error(`Erro ao contar animais do haras ${harasId}:`, error);
    return 0;
  }

  return count || 0;
}

/**
 * Busca contagem de usuários por haras
 */
async function getHarasUsersCount(harasId: string): Promise<number> {
  const { count, error } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('haras_id', harasId);

  if (error) {
    console.error(`Erro ao contar usuários do haras ${harasId}:`, error);
    return 0;
  }

  // Se contar profiles, isso já deve incluir quem tem acesso.
  // Se o proprietário tiver profile, já está na conta. Se não, idealmente deveria ter.
  // Vou manter o +1 por consistência com o outro arquivo, assumindo que count pode ser 0 mas o dono sempre existe.
  return (count || 0);
}

/**
 * Busca contagem de transações por haras
 */
async function getHarasTransactionsCount(harasId: string): Promise<number> {
  const { count, error } = await supabase
    .from('transactions')
    .select('*', { count: 'exact', head: true })
    .eq('haras_id', harasId);

  if (error) {
    console.error(`Erro ao contar transações do haras ${harasId}:`, error);
    return 0;
  }

  return count || 0;
}

/**
 * Busca última atividade do haras
 */
async function getHarasLastActive(harasId: string): Promise<string | null> {
  /* Buscar a data da última transação */
  const { data: lastTransaction } = await supabase
    .from('transactions')
    .select('data_transacao')
    .eq('haras_id', harasId)
    .order('data_transacao', { ascending: false })
    .limit(1)
    .maybeSingle();

  const transaction = (lastTransaction as any);
  return transaction?.data_transacao || null;
}

/**
 * Busca contagem de usuários por mês
 */
async function getUsersCountByMonth(date: Date): Promise<number> {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const { count, error } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfMonth.toISOString())
    .lte('created_at', endOfMonth.toISOString());

  if (error) {
    console.error(`Erro ao contar usuários do mês ${date.toISOString()}:`, error);
    return 0;
  }

  return count || 0;
}

/**
 * Busca contagem de animais por mês
 */
async function getAnimalsCountByMonth(date: Date): Promise<number> {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const { count, error } = await supabase
    .from('animals')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfMonth.toISOString())
    .lte('created_at', endOfMonth.toISOString());

  if (error) {
    console.error(`Erro ao contar animais do mês ${date.toISOString()}:`, error);
    return 0;
  }

  return count || 0;
}

/**
 * Busca contagem de haras por mês
 */
async function getHarasCountByMonth(date: Date): Promise<number> {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const { count, error } = await supabase
    .from('haras')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfMonth.toISOString())
    .lte('created_at', endOfMonth.toISOString());

  if (error) {
    console.error(`Erro ao contar haras do mês ${date.toISOString()}:`, error);
    return 0;
  }

  return count || 0;
}

/**
 * Formata número com separadores
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
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

/**
 * Formata tamanho de armazenamento
 */
export function formatStorageSize(gb: number): string {
  if (gb < 1) {
    const mb = gb * 1024;
    return `${mb.toFixed(0)} MB`;
  }
  return `${gb.toFixed(1)} GB`;
}