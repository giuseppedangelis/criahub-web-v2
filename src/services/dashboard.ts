// ============================================
// DASHBOARD SERVICE
// Gerencia dados do dashboard do criador
// ============================================

import { supabase, handleSupabaseError } from './base';

export interface DashboardStats {
    totalAnimals: number;
    totalMales: number;
    totalFemales: number;
    activeGestations: number;
    pendingServices: number;
    scheduledEventsToday: number;
    animalsNeedingCare: number;
    monthlyRevenue: number;
    monthlyExpenses: number;
    unreadNotifications: number;
}

export interface CategoryDistribution {
    name: string;
    value: number;
    color: string;
}

export interface PelagemDistribution {
    name: string;
    value: number;
    color: string;
}

export interface AgeDistribution {
    age: string;
    count: number;
}

export interface GrowthData {
    month: string;
    total: number;
    machos: number;
    femeas: number;
}

export interface UpcomingEvent {
    id: string;
    title: string;
    date: string;
    time: string;
    type: string;
    priority: 'high' | 'medium' | 'low';
}

export interface RecentActivity {
    id: string;
    title: string;
    description: string;
    time: string;
    type: 'cobertura' | 'animal' | 'receita' | 'servico';
}

export const dashboardService = {
    /**
     * Obtém estatísticas gerais do dashboard
     */
    async getStats(harasId: string): Promise<DashboardStats> {
        // Contar animais
        const { data: animals, error: animalsError } = await supabase
            .from('animals')
            .select('sexo, status, categoria')
            .eq('haras_id', harasId)
            .eq('status', 'Ativo');

        if (animalsError) handleSupabaseError(animalsError);

        // Contar gestações ativas
        const { count: gestationsCount, error: gestationsError } = await supabase
            .from('gestations')
            .select('*', { count: 'exact', head: true })
            .eq('haras_id', harasId)
            .in('status', ['Em andamento']);

        if (gestationsError) console.error('Gestations error:', gestationsError);

        // Contar serviços pendentes
        const { count: servicesCount, error: servicesError } = await supabase
            .from('service_orders')
            .select('*', { count: 'exact', head: true })
            .eq('haras_id', harasId)
            .in('status', ['pendente', 'em_andamento']);

        if (servicesError) console.error('Services error:', servicesError);

        // Contar eventos de hoje
        const today = new Date().toISOString().split('T')[0];
        const { count: eventsToday, error: eventsError } = await supabase
            .from('events')
            .select('*', { count: 'exact', head: true })
            .eq('haras_id', harasId)
            .gte('data_inicio', `${today}T00:00:00`)
            .lte('data_inicio', `${today}T23:59:59`)
            .neq('status', 'cancelado');

        if (eventsError) console.error('Events error:', eventsError);

        // Calcular receitas/despesas do mês
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

        const { data: transactions, error: transError } = await supabase
            .from('transactions')
            .select('tipo, valor')
            .eq('haras_id', harasId)
            .gte('data_transacao', firstDay)
            .lte('data_transacao', lastDay);

        if (transError) console.error('Transactions error:', transError);

        let monthlyRevenue = 0;
        let monthlyExpenses = 0;
        transactions?.forEach((t: { tipo: string; valor: number }) => {
            if (t.tipo === 'Receita') {
                monthlyRevenue += Number(t.valor);
            } else {
                monthlyExpenses += Number(t.valor);
            }
        });

        // Contar notificações não lidas
        const { data: { user } } = await supabase.auth.getUser();
        let unreadNotifications = 0;

        if (user) {
            const { count } = await supabase
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('lida', false);

            unreadNotifications = count || 0;
        }

        // Contar animais que precisam de cuidados (com próximo procedimento agendado)
        const todayStr = new Date().toISOString().split('T')[0];
        const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const { count: animalsNeedingCare } = await supabase
            .from('health_records')
            .select('*', { count: 'exact', head: true })
            .eq('haras_id', harasId)
            .gte('proximadata', todayStr)
            .lte('proximadata', nextWeek);

        return {
            totalAnimals: animals?.length || 0,
            totalMales: animals?.filter((a: { sexo: string }) => a.sexo === 'Macho').length || 0,
            totalFemales: animals?.filter((a: { sexo: string }) => a.sexo === 'Fêmea').length || 0,
            activeGestations: gestationsCount || 0,
            pendingServices: servicesCount || 0,
            scheduledEventsToday: eventsToday || 0,
            animalsNeedingCare: animalsNeedingCare || 0,
            monthlyRevenue,
            monthlyExpenses,
            unreadNotifications
        };
    },

    /**
     * Obtém distribuição por categoria
     */
    async getCategoryDistribution(harasId: string): Promise<CategoryDistribution[]> {
        const { data, error } = await supabase
            .from('animals')
            .select('categoria')
            .eq('haras_id', harasId)
            .eq('status', 'Ativo');

        if (error) handleSupabaseError(error);

        const counts: Record<string, number> = {};
        data?.forEach((item: { categoria: string }) => {
            const cat = item.categoria || 'Outros';
            counts[cat] = (counts[cat] || 0) + 1;
        });

        const colors: Record<string, string> = {
            'Potro': '#10b981',
            'Potranca': '#f59e0b',
            'Garanhão': '#3b82f6',
            'Égua': '#8b5cf6',
            'Castrado': '#6b7280',
            'Outros': '#4b5563'
        };

        const labels: Record<string, string> = {
            'Potro': 'Potro',
            'Potranca': 'Potranca',
            'Garanhão': 'Garanhão',
            'Égua': 'Égua',
            'Castrado': 'Castrado',
            'Outros': 'Outros'
        };

        return Object.entries(counts).map(([key, value]) => ({
            name: labels[key] || key,
            value,
            color: colors[key] || '#4b5563'
        }));
    },

    /**
     * Obtém distribuição por pelagem
     */
    async getPelagemDistribution(harasId: string): Promise<PelagemDistribution[]> {
        const { data, error } = await supabase
            .from('animals')
            .select('pelagem')
            .eq('haras_id', harasId)
            .eq('status', 'Ativo');

        if (error) handleSupabaseError(error);

        const counts: Record<string, number> = {};
        data?.forEach((item: { pelagem: string }) => {
            const pelagem = item.pelagem || 'Outros';
            counts[pelagem] = (counts[pelagem] || 0) + 1;
        });

        const colors: Record<string, string> = {
            'Castanha': '#92400e',
            'Tordilha': '#9ca3af',
            'Alazã': '#dc2626',
            'Preta': '#1f2937',
            'Pampa': '#f97316',
            'Baio': '#d97706',
            'Rosilha': '#a78bfa',
            'Outros': '#4b5563'
        };

        return Object.entries(counts).map(([key, value]) => ({
            name: key,
            value,
            color: colors[key] || '#4b5563'
        }));
    },

    /**
     * Obtém dados de crescimento do plantel
     */
    async getGrowthData(harasId: string, months: number = 6): Promise<GrowthData[]> {
        const result: GrowthData[] = [];
        const now = new Date();

        for (let i = months - 1; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            const monthStr = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });

            const { data, error } = await supabase
                .from('animals')
                .select('sexo')
                .eq('haras_id', harasId)
                .lte('created_at', endOfMonth.toISOString())
                .eq('status', 'Ativo');

            if (error) console.error('Growth data error:', error);

            const total = data?.length || 0;
            const machos = data?.filter((a: { sexo: string }) => a.sexo === 'Macho').length || 0;
            const femeas = data?.filter((a: { sexo: string }) => a.sexo === 'Fêmea').length || 0;

            result.push({
                month: monthStr.charAt(0).toUpperCase() + monthStr.slice(1),
                total,
                machos,
                femeas
            });
        }

        return result;
    },

    /**
     * Obtém próximos eventos/serviços
     */
    async getUpcomingEvents(harasId: string, limit: number = 5): Promise<UpcomingEvent[]> {
        const today = new Date().toISOString();

        const { data, error } = await supabase
            .from('events')
            .select('id, titulo, data_inicio, tipo, status')
            .eq('haras_id', harasId)
            .gte('data_inicio', today)
            .neq('status', 'cancelado')
            .order('data_inicio', { ascending: true })
            .limit(limit);

        if (error) {
            console.error('Upcoming events error:', error);
            return [];
        }

        return (data || []).map(event => {
            const date = new Date(event.data_inicio);
            const isToday = date.toDateString() === new Date().toDateString();
            const isTomorrow = date.toDateString() === new Date(Date.now() + 86400000).toDateString();

            let dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
            if (isToday) dateStr = 'Hoje';
            if (isTomorrow) dateStr = 'Amanhã';

            return {
                id: event.id,
                title: event.titulo,
                date: dateStr,
                time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                type: event.tipo || 'servico',
                priority: 'medium' as const
            };
        });
    },

    /**
     * Obtém atividades recentes
     */
    async getRecentActivities(harasId: string, limit: number = 5): Promise<RecentActivity[]> {
        // Por enquanto, buscar de múltiplas tabelas e combinar
        const activities: RecentActivity[] = [];

        // Buscar últimos animais cadastrados
        const { data: recentAnimals } = await supabase
            .from('animals')
            .select('id, nome, created_at')
            .eq('haras_id', harasId)
            .order('created_at', { ascending: false })
            .limit(3);

        recentAnimals?.forEach((animal: { id: string; nome: string; created_at: string }) => {
            activities.push({
                id: animal.id,
                title: 'Animal cadastrado',
                description: animal.nome || 'Sem nome',
                time: formatTimeAgo(animal.created_at),
                type: 'animal'
            });
        });

        // Buscar últimas transações
        const { data: recentTransactions } = await supabase
            .from('transactions')
            .select('id, descricao, tipo, valor, created_at')
            .eq('haras_id', harasId)
            .order('created_at', { ascending: false })
            .limit(3);

        recentTransactions?.forEach(trans => {
            activities.push({
                id: trans.id,
                title: trans.tipo === 'receita' ? 'Receita registrada' : 'Despesa registrada',
                description: `${trans.descricao} - R$ ${Number(trans.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                time: formatTimeAgo(trans.created_at),
                type: 'receita'
            });
        });

        // Ordenar por tempo e limitar
        return activities
            .sort((a, b) => getTimeAgoSeconds(b.time) - getTimeAgoSeconds(a.time))
            .slice(0, limit);
    },

    /**
     * Obtém distribuição por idade
     */
    async getAgeDistribution(harasId: string): Promise<AgeDistribution[]> {
        const { data, error } = await supabase
            .from('animals')
            .select('data_nascimento')
            .eq('haras_id', harasId)
            .eq('status', 'Ativo');

        if (error) handleSupabaseError(error);

        const ageRanges = [
            { age: '0-2 anos', min: 0, max: 2, count: 0 },
            { age: '3-5 anos', min: 3, max: 5, count: 0 },
            { age: '6-10 anos', min: 6, max: 10, count: 0 },
            { age: '11-15 anos', min: 11, max: 15, count: 0 },
            { age: '16+ anos', min: 16, max: 100, count: 0 },
        ];

        const now = new Date();
        data?.forEach((item: { data_nascimento: string }) => {
            if (!item.data_nascimento) return;
            const birthDate = new Date(item.data_nascimento);
            const age = Math.floor((now.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

            for (const range of ageRanges) {
                if (age >= range.min && age <= range.max) {
                    range.count++;
                    break;
                }
            }
        });

        return ageRanges.map(r => ({ age: r.age, count: r.count }));
    }
};

// Helpers
function formatTimeAgo(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutos atrás`;
    if (diffHours < 24) return `${diffHours} horas atrás`;
    if (diffDays === 1) return '1 dia atrás';
    return `${diffDays} dias atrás`;
}

function getTimeAgoSeconds(timeAgo: string): number {
    const match = timeAgo.match(/(\d+)\s+(minutos?|horas?|dias?)/);
    if (!match) return 0;
    const value = parseInt(match[1]);
    const unit = match[2];
    if (unit.startsWith('minuto')) return value * 60;
    if (unit.startsWith('hora')) return value * 3600;
    if (unit.startsWith('dia')) return value * 86400;
    return 0;
}
