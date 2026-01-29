'use client'
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { LayoutDashboard, CreditCard, BarChart3, AlertTriangle, Settings, Moon, Sun, Bell, User, LogOut, HelpCircle, UserCog, UserCircle, Menu, X, TrendingUp, TrendingDown, Users, Repeat } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useResponsive } from '../hooks/useResponsive';
import { ProfileView } from './ProfileView';
import { AdminSubscriptionsContent } from './admin/AdminSubscriptionsContent';
import { AdminPlatformUsageContent } from './admin/AdminPlatformUsageContent';
import { AdminCriticalAlertsContent } from './admin/AdminCriticalAlertsContent';
import { AdminSettingsContent } from './admin/AdminSettingsContent';
import { AdminHelpContent } from './admin/AdminHelpContent';
import { NotificationsPanel } from './NotificationsPanel';
import { toast } from 'sonner';

// SVG Chart Path
const revenueChartPath = "M4.91813e-08 57.7594C17.774 57.7594 17.774 11.9184 35.5481 11.9184C53.3221 11.9184 53.3221 22.3368 71.0962 22.3368C88.8703 22.3368 88.8703 49.4247 106.644 49.4247C124.418 49.4247 124.418 18.1695 142.193 18.1695C159.967 18.1695 159.967 53.5921 177.74 53.5921C195.514 53.5921 195.514 32.7552 213.289 32.7552C231.063 32.7552 231.063 24.4205 248.837 24.4205C266.611 24.4205 266.611 64.0105 284.385 64.0105C302.159 64.0105 302.159 78.5962 319.933 78.5962C337.707 78.5962 337.707 1.5 355.481 1.5C373.255 1.5 373.255 43.1736 391.03 43.1736C408.803 43.1736 408.803 68.1778 426.577 68.1778C444.351 68.1778 444.351 14.0021 462.126 14.0021";

export function AdminDashboard() {
  const { theme, toggleTheme } = useTheme();
  const { userRole, userName, userEmail, logout } = useUser();
  const { isMobile } = useResponsive();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Nova assinatura', message: 'Haras do Sol contratou plano Premium', time: '5 min atrás', unread: true },
    { id: 2, title: 'Pagamento recebido', message: 'R$ 499 - Haras Vale Verde', time: '1 hora atrás', unread: true },
    { id: 3, title: 'Alerta de uso', message: 'Servidor atingiu 80% de capacidade', time: '2 horas atrás', unread: true },
    { id: 4, title: 'Sistema atualizado', message: 'Versão 2.1.0 implantada com sucesso', time: '1 dia atrás', unread: false },
    { id: 5, title: 'Novo feedback de usuário', message: 'Haras Boa Vista deixou uma avaliação', time: '2 dias atrás', unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  // Fecha a sidebar quando mudar de mobile para desktop
  useEffect(() => {
    if (!isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'subscriptions', label: 'Assinaturas', icon: CreditCard },
    { id: 'usage', label: 'Uso da Plataforma', icon: BarChart3 },
    { id: 'alerts', label: 'Alertas Críticos', icon: AlertTriangle },
    { id: 'help', label: 'Ajuda', icon: HelpCircle },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const handleMarkAsRead = (ids: number[]) => {
    setNotifications(notifications.map(n =>
      ids.includes(n.id) ? { ...n, unread: false } : n
    ));
  };

  const handleDelete = (ids: number[]) => {
    setNotifications(notifications.filter(n => !ids.includes(n.id)));
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex h-screen bg-background dark:bg-[#0d0d0d]">
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        ${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'}
        w-64 bg-[#e8e8e8] dark:bg-[#1a1a1a] border-r border-border dark:border-[#1a1a1a] flex flex-col
        transition-transform duration-300
        ${isMobile ? (isSidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
      `}>
        {/* Header */}
        <div className="h-[101px] px-6 flex items-center justify-between border-b border-border dark:border-[#1a1a1a]">
          <div>
            <h1 className="text-foreground dark:text-white mb-2">CriaHub</h1>
            <p className="text-muted-foreground dark:text-[#99a1af]">Administrador</p>
          </div>
          {isMobile && (
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg"
            >
              <X className="w-5 h-5 text-foreground dark:text-white" />
            </button>
          )}
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (isMobile) setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${isActive
                    ? 'bg-white/10 dark:bg-white/10'
                    : 'hover:bg-black/5 dark:hover:bg-white/5'
                  }
                `}
              >
                <Icon className="w-5 h-5 text-foreground dark:text-white" />
                <span className="text-foreground dark:text-white">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Section - Theme Toggle (Mobile Only) */}
        {isMobile && (
          <div className="px-4 pb-4 border-t border-border dark:border-[#1a1a1a] pt-4">
            <button
              onClick={() => {
                toggleTheme();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-black/5 dark:hover:bg-white/5"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-5 h-5 text-foreground dark:text-white" />
                  <span className="text-foreground dark:text-white">Modo Claro</span>
                </>
              ) : (
                <>
                  <Moon className="w-5 h-5 text-foreground dark:text-white" />
                  <span className="text-foreground dark:text-white">Modo Escuro</span>
                </>
              )}
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-[101px] bg-card dark:bg-[#0d0d0d] border-b border-border dark:border-[#1a1a1a] px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-3 rounded-lg bg-muted dark:bg-[#1a1a1a] hover:bg-accent dark:hover:bg-[#2a2a2a] transition-colors"
              >
                <Menu className="w-5 h-5 text-foreground dark:text-white" />
              </button>
            )}

            <div>
              <h2 className="text-xl md:text-2xl text-foreground dark:text-white mb-1">
                {activeTab === 'profile' ? 'Meu Perfil' :
                  activeTab === 'settings' ? 'Configurações' :
                    menuItems.find(item => item.id === activeTab)?.label}
              </h2>
              <p className="text-muted-foreground dark:text-[#99a1af] hidden lg:block">
                Painel Administrativo do CriaHub
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle - Desktop Only */}
            {!isMobile && (
              <button
                onClick={toggleTheme}
                className="p-3 rounded-lg bg-muted dark:bg-[#1a1a1a] hover:bg-accent dark:hover:bg-[#2a2a2a] transition-colors"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-white" />
                ) : (
                  <Moon className="w-5 h-5 text-foreground" />
                )}
              </button>
            )}

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className="p-3 rounded-lg bg-muted dark:bg-[#1a1a1a] hover:bg-accent dark:hover:bg-[#2a2a2a] transition-colors relative"
              >
                <Bell className="w-5 h-5 text-foreground dark:text-white" />
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
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 border-b border-border dark:border-[rgba(255,255,255,0.1)] last:border-0 hover:bg-muted dark:hover:bg-[#0d0d0d] cursor-pointer ${notif.unread ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                          }`}
                      >
                        <div className="flex items-start gap-3">
                          {notif.unread && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          )}
                          <div className="flex-1">
                            <p className="text-foreground dark:text-white mb-1">{notif.title}</p>
                            <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                              {notif.message}
                            </p>
                            <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
                              {notif.time}
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

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="p-3 rounded-lg bg-muted dark:bg-[#1a1a1a] hover:bg-accent dark:hover:bg-[#2a2a2a] transition-colors"
              >
                <User className="w-5 h-5 text-foreground dark:text-white" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] md:w-64 max-w-sm bg-card dark:bg-[#1a1a1a] rounded-xl shadow-xl border border-border dark:border-[rgba(255,255,255,0.1)] z-50">
                  <div className="p-4 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary dark:bg-white rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white dark:text-black" />
                      </div>
                      <div>
                        <p className="text-foreground dark:text-white">{userName || 'Admin'}</p>
                        <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                          {userEmail || ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setActiveTab('settings');
                      }}
                      className="w-full text-left px-4 py-2 rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] text-foreground dark:text-white flex items-center gap-3"
                    >
                      <UserCog className="w-4 h-4" />
                      Configurações da Conta
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setActiveTab('help');
                      }}
                      className="w-full text-left px-4 py-2 rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] text-foreground dark:text-white flex items-center gap-3"
                    >
                      <HelpCircle className="w-4 h-4" />
                      Central de Ajuda
                    </button>
                    <div className="border-t border-border dark:border-[rgba(255,255,255,0.1)] my-2"></div>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-2 rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] text-red-500 dark:text-red-400 flex items-center gap-3"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto mobile-scroll-hidden bg-background dark:bg-[#0d0d0d] p-4 md:p-8">
          {activeTab === 'dashboard' && <DashboardContent onNavigate={setActiveTab} />}
          {activeTab === 'subscriptions' && <AdminSubscriptionsContent />}
          {activeTab === 'usage' && <AdminPlatformUsageContent />}
          {activeTab === 'alerts' && <AdminCriticalAlertsContent />}
          {activeTab === 'settings' && <AdminSettingsContent />}
          {activeTab === 'profile' && <ProfileView />}
          {activeTab === 'help' && <AdminHelpContent />}
        </div>
      </main>



      {/* Notifications Panel */}
      <NotificationsPanel
        isOpen={showNotificationsPanel}
        onClose={() => setShowNotificationsPanel(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onDelete={handleDelete}
      />
    </div>
  );
}

function DashboardContent({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const metrics = [
    {
      title: 'Receita Total',
      value: '728',
      change: '+12.5%',
      trend: 'up' as const,
      color: 'emerald',
      icon: TrendingUp,
    },
    {
      title: 'Assinaturas Ativas',
      value: '1,245',
      change: '+5%',
      trend: 'up' as const,
      color: 'blue',
      icon: Users,
    },
    {
      title: 'Taxa de Cancelamentos',
      value: '1.8%',
      change: '+0.3%',
      trend: 'down' as const,
      color: 'red',
      icon: TrendingDown,
    },
    {
      title: 'Conversão de Planos',
      value: '65%',
      change: '+2.1%',
      trend: 'up' as const,
      color: 'violet',
      icon: Repeat,
    },
  ];

  const conversionData = [
    { label: 'Leads', percentage: 100, color: 'bg-red-500' },
    { label: 'Trial', percentage: 73, color: 'bg-violet-500' },
    { label: 'Pago', percentage: 53, color: 'bg-emerald-500' },
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
                d={revenueChartPath}
                stroke="#2472BC"
                strokeWidth="3"
                fill="none"
              />
            </svg>
          </div>

          {/* X-axis labels */}
          <div className="flex justify-between text-[10px] text-muted-foreground dark:text-[#b7c3d1]">
            <span>S1</span>
            <span>S2</span>
            <span>S3</span>
            <span>S4</span>
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