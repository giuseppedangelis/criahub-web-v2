// ============================================
// USE DASHBOARD HOOK
// Hook para buscar dados do dashboard do criador
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { dashboardService, DashboardStats, CategoryDistribution, PelagemDistribution, GrowthData, UpcomingEvent, RecentActivity, AgeDistribution } from '@/services/dashboard';
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
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [categoryDistribution, setCategoryDistribution] = useState<CategoryDistribution[]>([]);
    const [pelagemDistribution, setPelagemDistribution] = useState<PelagemDistribution[]>([]);
    const [growthData, setGrowthData] = useState<GrowthData[]>([]);
    const [ageDistribution, setAgeDistribution] = useState<AgeDistribution[]>([]);
    const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
    const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [currentHarasId, setCurrentHarasId] = useState<string | null>(harasId || null);
    const [hasNoHaras, setHasNoHaras] = useState(false);

    // Buscar haras_id do usuário logado se não foi fornecido
    useEffect(() => {
        if (harasId) {
            setCurrentHarasId(harasId);
            setHasNoHaras(false);
            return;
        }

        if (stableHarasId) {
            setCurrentHarasId(stableHarasId);
            setHasNoHaras(false);
            return;
        }

        if (!isSessionReady) {
            return;
        }

        if (isSessionReady) {
            setIsLoading(false);
            setHasNoHaras(true);
        }
    }, [harasId, stableHarasId, isSessionReady]);

    const months = Math.max(1, options.months ?? 6);
    const eventsLimit = options.eventsLimit ?? 5;
    const activitiesLimit = options.activitiesLimit ?? 5;

    const fetchData = useCallback(async () => {
        if (!currentHarasId) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const [
                statsData,
                categoryData,
                pelagemData,
                growthDataResult,
                ageData,
                eventsData,
                activitiesData
            ] = await Promise.all([
                dashboardService.getStats(currentHarasId),
                dashboardService.getCategoryDistribution(currentHarasId),
                dashboardService.getPelagemDistribution(currentHarasId),
                dashboardService.getGrowthData(currentHarasId, months),
                dashboardService.getAgeDistribution(currentHarasId),
                dashboardService.getUpcomingEvents(currentHarasId, eventsLimit),
                dashboardService.getRecentActivities(currentHarasId, activitiesLimit)
            ]);

            setStats(statsData);
            setCategoryDistribution(categoryData);
            setPelagemDistribution(pelagemData);
            setGrowthData(growthDataResult);
            setAgeDistribution(ageData);
            setUpcomingEvents(eventsData);
            setRecentActivities(activitiesData);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError(err instanceof Error ? err : new Error('Erro ao carregar dados'));
        } finally {
            setIsLoading(false);
        }
    }, [currentHarasId, months, eventsLimit, activitiesLimit]);

    useEffect(() => {
        if (currentHarasId) {
            fetchData();
        }
    }, [fetchData, currentHarasId]);

    return {
        stats,
        categoryDistribution,
        pelagemDistribution,
        growthData,
        ageDistribution,
        upcomingEvents,
        recentActivities,
        isLoading,
        error,
        hasNoHaras,
        refetch: fetchData
    };
}

