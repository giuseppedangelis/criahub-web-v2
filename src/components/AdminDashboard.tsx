'use client'
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { LayoutDashboard, CreditCard, BarChart3, AlertTriangle, Settings, Bell, User, HelpCircle, TrendingUp, Users } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useResponsive } from '../hooks/useResponsive';
import { ProfileView } from './ProfileView';
import { UserDropdown } from './shared/UserDropdown';
import { AdminSubscriptionsContent } from './admin/AdminSubscriptionsContent';
import { AdminPlatformUsageContent } from './admin/AdminPlatformUsageContent';
import { AdminCriticalAlertsContent } from './admin/AdminCriticalAlertsContent';
import { AdminSettingsContent } from './admin/AdminSettingsContent';
import { AdminHelpContent } from './admin/AdminHelpContent';
import { NotificationsPanel } from './NotificationsPanel';
import { DashboardShell, dashboardTopbarControlClass } from './shared/DashboardShell';
import { toast } from 'sonner';
import type { Notification } from '@/types';
import { notificationsService } from '@/services/notifications';

const formatNotificationTime = (dateValue?: string | null) => {
  if (!dateValue) return '';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Agora';
  if (diffMins < 60) return `${diffMins} min atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays === 1) return '1 dia atrás';
  return `${diffDays} dias atrás`;
};

export function AdminDashboard() {
  const { theme, toggleTheme } = useTheme();
  const { userRole, userName, userEmail, profile, logout } = useUser();
  const { isMobile } = useResponsive();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const loadNotifications = useCallback(async () => {
    setIsLoadingNotifications(true);
    try {
      const response = await notificationsService.list({ page: 1, limit: 50 });
      setNotifications(response.data);
    } catch (error: any) {
      console.error('Erro ao carregar notificações:', error);
      toast.error(error.message || 'Erro ao carregar notificações.');
    } finally {
      setIsLoadingNotifications(false);
    }
  }, []);

  // Fecha a sidebar quando mudar de mobile para desktop
  useEffect(() => {
    if (!isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'subscriptions', label: 'Assinaturas', icon: CreditCard },
    { id: 'usage', label: 'Uso da Plataforma', icon: BarChart3 },
    { id: 'alerts', label: 'Alertas Críticos', icon: AlertTriangle },
    { id: 'help', label: 'Ajuda', icon: HelpCircle },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    } catch (error: any) {
      console.error('Erro ao marcar notificações:', error);
      toast.error(error.message || 'Erro ao marcar notificações.');
    }
  };

  const handleMarkAsRead = async (ids: string[]) => {
    try {
      await Promise.all(ids.map((id) => notificationsService.markAsRead(id)));
      setNotifications((prev) =>
        prev.map((item) => (ids.includes(item.id) ? { ...item, read: true } : item))
      );
    } catch (error: any) {
      console.error('Erro ao marcar notificações:', error);
      toast.error(error.message || 'Erro ao marcar notificações.');
    }
  };

  const handleDelete = async (ids: string[]) => {
    try {
      await Promise.all(ids.map((id) => notificationsService.delete(id)));
      setNotifications((prev) => prev.filter((item) => !ids.includes(item.id)));
    } catch (error: any) {
      console.error('Erro ao excluir notificações:', error);
      toast.error(error.message || 'Erro ao excluir notificações.');
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      setIsLoggingOut(false);
    }
  };

  const currentTitle =
    activeTab === 'profile'
      ? 'Meu Perfil'
      : activeTab === 'settings'
        ? 'Configurações'
        : menuItems.find((item) => item.id === activeTab)?.label || 'Dashboard';

  return (
    <>
      <DashboardShell
        isMobile={isMobile}
        isSidebarOpen={isSidebarOpen}
        menuItems={menuItems}
        activeMenuId={activeTab}
        onSelectMenu={(itemId) => {
          setActiveTab(itemId);
          if (isMobile) setIsSidebarOpen(false);
        }}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onCloseSidebar={() => setIsSidebarOpen(false)}
        title={currentTitle}
        subtitle="Painel Administrativo do CriaHub"
        sidebarSubtitle="Administrador"
        theme={theme}
        onToggleTheme={toggleTheme}
        topbarActions={
          <>
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className={`${dashboardTopbarControlClass} relative`}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="fixed md:absolute top-20 md:top-auto right-4 md:right-0 left-4 md:left-auto md:mt-2 md:w-96 bg-card dark:bg-[#1a1a1a] rounded-xl shadow-xl border border-border dark:border-[rgba(255,255,255,0.1)] z-50">
                  <div className="p-4 border-b border-border dark:border-[rgba(255,255,255,0.1)] flex items-center justify-between">
                    <h3 className="text-foreground dark:text-white">Notificações</h3>
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-sm text-primary dark:text-white hover:underline"
                    >
                      Marcar todas como lidas
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto mobile-scroll-hidden">
                    {isLoadingNotifications && (
                      <div className="p-4 text-sm text-muted-foreground dark:text-[#99a1af]">
                        Carregando notificações...
                      </div>
                    )}
                    {!isLoadingNotifications && notifications.length === 0 && (
                      <div className="p-4 text-sm text-muted-foreground dark:text-[#99a1af]">
                        Nenhuma notificação.
                      </div>
                    )}
                    {!isLoadingNotifications && notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 border-b border-border dark:border-[rgba(255,255,255,0.1)] last:border-0 hover:bg-muted dark:hover:bg-[#0d0d0d] cursor-pointer ${!notif.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                          }`}
                      >
                        <div className="flex items-start gap-3">
                          {!notif.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          )}
                          <div className="flex-1">
                            <p className="text-foreground dark:text-white mb-1">{notif.title}</p>
                            <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                              {notif.message}
                            </p>
                            <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
                              {formatNotificationTime(notif.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        setShowNotificationsPanel(true);
                      }}
                      className="w-full text-center text-sm text-primary dark:text-white hover:underline"
                    >
                      Ver todas as notificações
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className={dashboardTopbarControlClass}
              >
                <User className="w-5 h-5" />
              </button>
              {showUserMenu && (
                <UserDropdown
                  userName={userName}
                  userEmail={userEmail}
                  userRole={userRole}
                  userAvatarUrl={profile?.avatar_url}
                  isLoggingOut={isLoggingOut}
                  onProfileClick={() => setActiveTab('profile')}
                  onSettingsClick={() => setActiveTab('settings')}
                  onHelpClick={() => setActiveTab('help')}
                  onLogout={handleLogout}
                  onClose={() => setShowUserMenu(false)}
                  showProfile={true}
                  showHelp={true}
                />
              )}
            </div>
          </>
        }
      >
        <div className="flex-1 overflow-auto mobile-scroll-hidden bg-background dark:bg-[#0d0d0d] p-4 md:p-8">
          {activeTab === 'dashboard' && <DashboardContent onNavigate={setActiveTab} />}
          {activeTab === 'subscriptions' && <AdminSubscriptionsContent />}
          {activeTab === 'usage' && <AdminPlatformUsageContent />}
          {activeTab === 'alerts' && <AdminCriticalAlertsContent />}
          {activeTab === 'settings' && <AdminSettingsContent />}
          {activeTab === 'profile' && <ProfileView />}
          {activeTab === 'help' && <AdminHelpContent />}
        </div>
      </DashboardShell>

      {/* Notifications Panel */}
      <NotificationsPanel
        isOpen={showNotificationsPanel}
        onClose={() => setShowNotificationsPanel(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onDelete={handleDelete}
      />
    </>
  );
}

function DashboardContent({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar estatísticas de assinaturas
      const subscriptionStats = await (await import('@/services/admin')).getSubscriptionStats();

      // Buscar métricas da plataforma
      const platformMetrics = await (await import('@/services/admin')).getPlatformMetrics();

      // Buscar histórico de receita
      const revenueHistory = await (await import('@/services/admin')).getRevenueHistory();

      setStats({
        subscriptions: subscriptionStats,
        platform: platformMetrics,
        revenueHistory,
      });
    } catch (err: any) {
      console.error('Erro ao carregar dados do dashboard:', err);
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const generateChartPath = (data: any[]) => {
    if (!data || data.length === 0) return "";

    // Extract values
    const values = data.map(d => d.revenue);
    const max = Math.max(...values, 1); // Avoid division by zero
    const min = Math.min(...values);

    // Dimensions matching viewBox "0 0 463 91"
    const width = 463;
    const height = 91;
    const padding = 5;

    const usableHeight = height - (padding * 2);

    // Points generation
    const points = values.map((val, index) => {
      const x = (width / (values.length - 1)) * index;
      // Invert Y because SVG 0 is top
      // Normalize value between 0 and 1
      const normalized = (val - min) / ((max - min) || 1);
      // Map to height (higher value -> lower y)
      const y = height - padding - (normalized * usableHeight);
      return `${x},${y}`;
    });

    // Create curved line (Catmull-Rom or simple bezier)
    // For simplicity, using simple line or basic curve simulation
    // Let's use simple L for now to ensure robustness, or a basic cubic bezier smoothing helper?
    // Given usage context, straight lines or simple smoothing is safer.
    // Let's try to make it smooth.

    if (points.length < 2) return "";

    let path = `M ${points[0]}`;

    for (let i = 0; i < points.length - 1; i++) {
      const [x0, y0] = points[i].split(',').map(Number);
      const [x1, y1] = points[i + 1].split(',').map(Number);

      // Simple smoothing: use midpoints for control points
      const cpx1 = x0 + (x1 - x0) / 2;
      const cpy1 = y0;
      const cpx2 = x0 + (x1 - x0) / 2;
      const cpy2 = y1;

      path += ` C ${cpx1},${cpy1} ${cpx2},${cpy2} ${x1},${y1}`;
    }

    return path;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando métricas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center max-w-md p-6 bg-card rounded-lg shadow-lg border border-red-200 dark:border-red-900/50">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">Erro ao Carregar Dados</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const chartPath = generateChartPath(stats.revenueHistory);

  const metrics = [
    {
      title: 'Receita Mensal',
      value: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(stats.subscriptions.monthly_revenue),
      change: '+12.5%', // TODO: Calculate real change
      trend: 'up' as const,
      color: 'emerald',
      icon: TrendingUp,
    },
    {
      title: 'Assinaturas Ativas',
      value: stats.subscriptions.active_subscriptions.toLocaleString('pt-BR'),
      change: `+${stats.subscriptions.new_customers_month}`,
      trend: 'up' as const,
      color: 'blue',
      icon: Users,
    },
    {
      title: 'Taxa de Renovação',
      value: `${(stats.subscriptions.renewal_rate * 100).toFixed(1)}%`,
      change: '+0.3%',
      trend: 'up' as const,
      color: 'green',
      icon: TrendingUp,
    },
    {
      title: 'Total de Usuários',
      value: stats.platform.total_users.toLocaleString('pt-BR'),
      change: '+5%',
      trend: 'up' as const,
      color: 'violet',
      icon: Users,
    },
  ];

  const totalSubs = stats.subscriptions.total_subscriptions || 1; // Avoid division by zero
  const conversionData = [
    { label: 'Total de Haras', percentage: 100, color: 'bg-blue-500' },
    { label: 'Ativos', percentage: (stats.subscriptions.active_subscriptions / totalSubs) * 100, color: 'bg-emerald-500' },
    { label: 'Trial', percentage: (stats.subscriptions.trial_subscriptions / totalSubs) * 100, color: 'bg-violet-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const isPositive = metric.trend === 'up';

          const colorClasses = {
            emerald: {
              bg: 'bg-emerald-500',
              text: 'text-emerald-500',
            },
            blue: {
              bg: 'bg-[#2472bc]',
              text: 'text-[#2472bc]',
            },
            red: {
              bg: 'bg-red-500',
              text: 'text-red-500',
            },
            violet: {
              bg: 'bg-violet-500',
              text: 'text-violet-500',
            },
            green: {
              bg: 'bg-green-500',
              text: 'text-green-500',
            },
          };

          const colors = colorClasses[metric.color as keyof typeof colorClasses];

          return (
            <div
              key={metric.title}
              className="bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#333333] rounded-2xl p-6 space-y-3 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.1)] dark:shadow-[0px_4px_12px_0px_rgba(0,0,0,0.3)]"
            >
              {/* Badge and Change */}
              <div className="flex items-center gap-6">
                <div className={`${colors.bg} p-3 rounded-xl`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-2xl ${colors.text}`}>
                  {metric.change}
                </span>
              </div>

              {/* Title */}
              <p className="text-sm text-muted-foreground dark:text-gray-400">{metric.title}</p>

              {/* Value */}
              <p className="text-3xl text-foreground dark:text-white">{metric.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#333333] rounded-2xl p-6 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.1)] dark:shadow-[0px_4px_12px_0px_rgba(0,0,0,0.3)]">
          <h3 className="text-foreground dark:text-white mb-8">Evolução da Receita Mensal</h3>

          {/* Chart Area */}
          <div className="relative h-[140px] mb-4">
            {/* SVG Line Chart */}
            <svg className="w-full h-full" viewBox="0 0 463 91" fill="none" preserveAspectRatio="none">
              <path
                d={chartPath}
                stroke="#2472BC"
                strokeWidth="3"
                fill="none"
              />
            </svg>
          </div>

          {/* X-axis labels */}
          <div className="flex justify-between text-[10px] text-muted-foreground dark:text-[#b7c3d1]">
            {stats.revenueHistory?.map((data: any, index: number) => (
              <span key={index}>{data.month}</span>
            ))}
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#333333] rounded-2xl p-6 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.1)] dark:shadow-[0px_4px_12px_0px_rgba(0,0,0,0.3)]">
          <h3 className="text-foreground dark:text-white mb-8">Conversão de Assinaturas</h3>

          <div className="space-y-6">
            {conversionData.map((item) => (
              <div key={item.label} className="flex items-center gap-4">
                {/* Label */}
                <div className="w-16">
                  <p className="text-sm text-muted-foreground dark:text-gray-400">{item.label}</p>
                </div>

                {/* Bar */}
                <div className="flex-1 bg-muted dark:bg-[#0d0d0d] rounded-md h-9 overflow-hidden">
                  <div
                    className={`${item.color} h-full rounded-md transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shortcuts */}
      <div className="space-y-6">
        <h2 className="text-2xl text-foreground dark:text-white">Atalhos</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Platform Usage Metrics */}
          <button
            onClick={() => onNavigate('usage')}
            className="bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#333333] rounded-2xl p-6 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.1)] dark:shadow-[0px_4px_12px_0px_rgba(0,0,0,0.3)] hover:border-muted-foreground dark:hover:border-[#4a4a4a] transition-colors text-left"
          >
            <div className="flex items-center gap-6">
              <div className="bg-cyan-500 p-3 rounded-xl shrink-0">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg text-foreground dark:text-white">Métricas de Uso da Plataforma</h3>
                <p className="text-sm text-muted-foreground dark:text-gray-400">Acompanhe o desempenho e a atividade dos usuários na plataforma.</p>
              </div>
            </div>
          </button>

          {/* Critical Alerts */}
          <button
            onClick={() => onNavigate('alerts')}
            className="bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#333333] rounded-2xl p-6 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.1)] dark:shadow-[0px_4px_12px_0px_rgba(0,0,0,0.3)] hover:border-muted-foreground dark:hover:border-[#4a4a4a] transition-colors text-left"
          >
            <div className="flex items-center gap-6">
              <div className="bg-amber-500 p-3 rounded-xl shrink-0">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg text-foreground dark:text-white">Alertas Críticos do Sistema</h3>
                <p className="text-sm text-muted-foreground dark:text-gray-400">Log de erros, falhas de sincronização e problemas de integração.</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend }: { title: string; value: string; trend: string }) {
  return (
    <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
      <p className="text-muted-foreground dark:text-[#99a1af] mb-2">{title}</p>
      <p className="text-3xl text-foreground dark:text-white mb-2">{value}</p>
      <p className="text-sm text-green-500 dark:text-green-400">{trend}</p>
    </div>
  );
}
