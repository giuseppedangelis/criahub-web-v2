// ============================================
// ADMIN SERVICES INDEX
// Exportações principais para fácil uso
// ============================================

export {
  getAdminSubscriptions,
  getSubscriptionStats,
  getRevenueHistory,
  updateSubscriptionPlan,
  getHarasDetails,
  type AdminSubscription,
  type SubscriptionStats,
  type PaginationParams,
  type PaginatedResponse,
  formatCurrency,
  formatPercentage,
} from './subscriptions';

export {
  getPlatformMetrics,
  getTopHarasUsage,
  getGrowthData,
  formatNumber,
  formatStorageSize,
  type PlatformMetrics,
  type GrowthData,
  type PlanDistribution,
  type FeatureUsage,
  type TopHarasUsage,
} from './metrics';