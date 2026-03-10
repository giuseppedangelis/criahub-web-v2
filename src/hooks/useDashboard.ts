'use client'

// ============================================
// USE DASHBOARD HOOK
// Hook para buscar snapshot otimizado do dashboard do criador
// ============================================

import { useQuery } from '@tanstack/react-query';
import {
    dashboardService,
    type DashboardStats,
    type CategoryDistribution,
    type PelagemDistribution,
    type GrowthData,
    type UpcomingEvent,
    type RecentActivity,
    type AgeDistribution,
} from '@/services/dashboard';
import { useUser } from '@/contexts/UserContext';

interface UseDashboardReturn {
    stats: DashboardStats | null;
    categoryDistribution: CategoryDistribution[];
    pelagemDistribution: PelagemDistribution[];
    growthData: GrowthData[];
    ageDistribution: AgeDistribution[];
    upcomingEvents: UpcomingEvent[];
    recentActivities: RecentActivity[];
    isLoading: boolean;
    error: Error | null;
    hasNoHaras: boolean;
    refetch: () => Promise<void>;
}

interface DashboardOptions {
    months?: number;
    eventsLimit?: number;
    activitiesLimit?: number;
}

export function useDashboard(harasId?: string, options: DashboardOptions = {}): UseDashboardReturn {
    const { stableHarasId, isSessionReady } = useUser();

    const currentHarasId = harasId || stableHarasId || null;
    const months = Math.max(1, options.months ?? 6);
    const eventsLimit = Math.max(1, options.eventsLimit ?? 5);
    const activitiesLimit = Math.max(1, options.activitiesLimit ?? 5);
    const hasNoHaras = isSessionReady && !currentHarasId;

    const query = useQuery({
        queryKey: ['dashboard', currentHarasId, months, eventsLimit, activitiesLimit],
        queryFn: () => dashboardService.getSnapshot(currentHarasId!, {
            months,
            eventsLimit,
            activitiesLimit,
        }),
        enabled: !!currentHarasId && isSessionReady,
        staleTime: 5 * 60_000,
        refetchOnWindowFocus: false,
    });

    return {
        stats: query.data?.stats || null,
        categoryDistribution: query.data?.categoryDistribution || [],
        pelagemDistribution: query.data?.pelagemDistribution || [],
        growthData: query.data?.growthData || [],
        ageDistribution: query.data?.ageDistribution || [],
        upcomingEvents: query.data?.upcomingEvents || [],
        recentActivities: query.data?.recentActivities || [],
        isLoading: !isSessionReady || query.isLoading,
        error: query.error instanceof Error ? query.error : null,
        hasNoHaras,
        refetch: async () => {
            await query.refetch();
        },
    };
}
