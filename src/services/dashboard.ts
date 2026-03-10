// ============================================
// DASHBOARD SERVICE
// Snapshot otimizado do dashboard do criador
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

export interface DashboardSnapshot {
    stats: DashboardStats;
    categoryDistribution: CategoryDistribution[];
    pelagemDistribution: PelagemDistribution[];
    growthData: GrowthData[];
    ageDistribution: AgeDistribution[];
    upcomingEvents: UpcomingEvent[];
    recentActivities: RecentActivity[];
}

interface DashboardSnapshotOptions {
    months?: number;
    eventsLimit?: number;
    activitiesLimit?: number;
}

interface DashboardRpcClient {
    rpc: (
        fn: 'get_dashboard_snapshot',
        args: {
            p_haras_id: string;
            p_months: number;
            p_events_limit: number;
            p_activities_limit: number;
        }
    ) => Promise<{ data: DashboardSnapshotResponse | null; error: unknown }>;
}

interface DashboardSnapshotResponse {
    stats?: Partial<DashboardStats> | null;
    categoryDistribution?: CategoryDistribution[] | null;
    pelagemDistribution?: PelagemDistribution[] | null;
    growthData?: Array<{
        month_start: string;
        total: number;
        machos: number;
        femeas: number;
    }> | null;
    ageDistribution?: AgeDistribution[] | null;
    upcomingEvents?: Array<{
        id: string;
        title: string;
        starts_at: string;
        type: string;
        status?: string | null;
    }> | null;
    recentActivities?: Array<{
        id: string;
        title: string;
        description: string;
        created_at: string;
        type: RecentActivity['type'];
    }> | null;
}

const EMPTY_SNAPSHOT: DashboardSnapshot = {
    stats: {
        totalAnimals: 0,
        totalMales: 0,
        totalFemales: 0,
        activeGestations: 0,
        pendingServices: 0,
        scheduledEventsToday: 0,
        animalsNeedingCare: 0,
        monthlyRevenue: 0,
        monthlyExpenses: 0,
        unreadNotifications: 0,
    },
    categoryDistribution: [],
    pelagemDistribution: [],
    growthData: [],
    ageDistribution: [],
    upcomingEvents: [],
    recentActivities: [],
};

function formatMonthLabel(monthStart: string): string {
    const date = new Date(`${monthStart}T00:00:00Z`);
    const label = new Intl.DateTimeFormat('pt-BR', {
        month: 'short',
        year: '2-digit',
        timeZone: 'UTC',
    }).format(date).replace('.', '');

    return label.charAt(0).toUpperCase() + label.slice(1);
}

function formatUpcomingEvent(startsAt: string, event: { id: string; title: string; type: string }): UpcomingEvent {
    const date = new Date(startsAt);
    const isToday = date.toDateString() === new Date().toDateString();
    const isTomorrow = date.toDateString() === new Date(Date.now() + 86400000).toDateString();

    let dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    if (isToday) dateStr = 'Hoje';
    if (isTomorrow) dateStr = 'Amanhã';

    return {
        id: event.id,
        title: event.title,
        date: dateStr,
        time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        type: event.type || 'servico',
        priority: 'medium',
    };
}

function formatTimeAgo(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.max(0, Math.floor(diffMs / 60000));
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutos atrás`;
    if (diffHours < 24) return `${diffHours} horas atrás`;
    if (diffDays === 1) return '1 dia atrás';
    return `${diffDays} dias atrás`;
}

function normalizeSnapshot(data: DashboardSnapshotResponse | null | undefined): DashboardSnapshot {
    if (!data) return EMPTY_SNAPSHOT;

    return {
        stats: {
            ...EMPTY_SNAPSHOT.stats,
            ...(data.stats || {}),
        },
        categoryDistribution: data.categoryDistribution || [],
        pelagemDistribution: data.pelagemDistribution || [],
        growthData: (data.growthData || []).map((item) => ({
            month: formatMonthLabel(item.month_start),
            total: Number(item.total) || 0,
            machos: Number(item.machos) || 0,
            femeas: Number(item.femeas) || 0,
        })),
        ageDistribution: data.ageDistribution || [],
        upcomingEvents: (data.upcomingEvents || []).map((event) =>
            formatUpcomingEvent(event.starts_at, {
                id: event.id,
                title: event.title,
                type: event.type,
            })
        ),
        recentActivities: (data.recentActivities || []).map((activity) => ({
            id: activity.id,
            title: activity.title,
            description: activity.description,
            time: formatTimeAgo(activity.created_at),
            type: activity.type,
        })),
    };
}

export const dashboardService = {
    async getSnapshot(
        harasId: string,
        options: DashboardSnapshotOptions = {}
    ): Promise<DashboardSnapshot> {
        const { data, error } = await (supabase as DashboardRpcClient).rpc('get_dashboard_snapshot', {
            p_haras_id: harasId,
            p_months: Math.max(1, options.months ?? 6),
            p_events_limit: Math.max(1, options.eventsLimit ?? 5),
            p_activities_limit: Math.max(1, options.activitiesLimit ?? 5),
        });

        if (error) handleSupabaseError(error);

        return normalizeSnapshot(data as DashboardSnapshotResponse | null | undefined);
    },

    async getStats(harasId: string): Promise<DashboardStats> {
        return (await this.getSnapshot(harasId)).stats;
    },

    async getCategoryDistribution(harasId: string): Promise<CategoryDistribution[]> {
        return (await this.getSnapshot(harasId)).categoryDistribution;
    },

    async getPelagemDistribution(harasId: string): Promise<PelagemDistribution[]> {
        return (await this.getSnapshot(harasId)).pelagemDistribution;
    },

    async getGrowthData(harasId: string, months: number = 6): Promise<GrowthData[]> {
        return (await this.getSnapshot(harasId, { months })).growthData;
    },

    async getUpcomingEvents(harasId: string, limit: number = 5): Promise<UpcomingEvent[]> {
        return (await this.getSnapshot(harasId, { eventsLimit: limit })).upcomingEvents;
    },

    async getRecentActivities(harasId: string, limit: number = 5): Promise<RecentActivity[]> {
        return (await this.getSnapshot(harasId, { activitiesLimit: limit })).recentActivities;
    },

    async getAgeDistribution(harasId: string): Promise<AgeDistribution[]> {
        return (await this.getSnapshot(harasId)).ageDistribution;
    },
};
