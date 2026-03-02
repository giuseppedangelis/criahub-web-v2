'use client'
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { LayoutDashboard, Users, Heart, DollarSign, CheckSquare, Calendar, FileText, Settings, Moon, Sun, Bell, User, Menu, X, HelpCircle } from 'lucide-react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useResponsive } from '../hooks/useResponsive';
import { ProfileView } from './ProfileView';
import { AdvisorDashboardContent } from './advisor/AdvisorDashboardContent';
import { BreederPlantelContent } from './breeder/BreederPlantelContent';
import { BreederReproductionContent } from './breeder/BreederReproductionContent';
import { AdvisorFinanceContent } from './advisor/AdvisorFinanceContent';
import { AdvisorTasksContent } from './advisor/AdvisorTasksContent';
import { AdvisorTeamContent } from './advisor/AdvisorTeamContent';
import { BreederAgendaContent } from './breeder/BreederAgendaContent';
import { BreederSettingsContent } from './breeder/BreederSettingsContent';
import { BreederHelpContent } from './breeder/BreederHelpContent';
import { AdvisorDocumentsContent } from './advisor/AdvisorDocumentsContent';
import { UserDropdown } from './shared/UserDropdown';
import { AdvisorPendingValidation } from './advisor/AdvisorPendingValidation';
import { NotificationsPanel } from './NotificationsPanel';
import { BrandLogo } from './branding/BrandLogo';
import type { Notification } from '@/types';
import { notificationsService } from '@/services/notifications';
import { useCurrentHaras } from '@/hooks/useHaras';
import { useAccessControl, type AccessModule } from '@/hooks/useAccessControl';
import { toast } from 'sonner';

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

const BASE_MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'herd', label: 'Plantel', icon: Users },
  { id: 'reproduction', label: 'Reprodução', icon: Heart },
  { id: 'finance', label: 'Financeiro', icon: DollarSign },
  { id: 'tasks', label: 'Tarefas', icon: CheckSquare },
  { id: 'team', label: 'Equipe', icon: Users },
  { id: 'calendar', label: 'Agenda', icon: Calendar },
  { id: 'documents', label: 'Documentos', icon: FileText },
  { id: 'settings', label: 'Configurações', icon: Settings },
  { id: 'help', label: 'Ajuda', icon: HelpCircle },
] as const;

export function AdvisorDashboard() {
  const { theme, toggleTheme } = useTheme();
  const { userRole, userName, userEmail, profile, logout } = useUser();
  const { isMobile } = useResponsive();
  const { data: currentHaras } = useCurrentHaras();
  const { canAccessModule, isReady: isAccessReady } = useAccessControl();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read).length;

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

  const handleSelectMenu = useCallback((menuId: string) => {
    if (!canAccessModule(menuId as AccessModule)) {
      toast.error('Você não tem permissão para acessar esta página.');
      return;
    }
    setActiveMenu(menuId);
    if (isMobile) setIsSidebarOpen(false);
  }, [canAccessModule, isMobile]);

  useEffect(() => {
    if (!isAccessReady) return;
    const isMenuTab = BASE_MENU_ITEMS.some((item) => item.id === activeMenu);
    if (isMenuTab && !canAccessModule(activeMenu as AccessModule)) {
      setActiveMenu('dashboard');
    }
  }, [activeMenu, canAccessModule, isAccessReady]);

  // Fecha a sidebar quando mudar de mobile para desktop
  useEffect(() => {
    if (!isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const menuItems = useMemo(
    () => BASE_MENU_ITEMS.filter((item) => canAccessModule(item.id as AccessModule)),
    [canAccessModule]
  );

  const userRole_display = 'Acessor Administrativo';

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
            <BrandLogo orientation="horizontal" tone="dark" className="h-8 w-auto mb-2" />
            <p className="text-muted-foreground dark:text-[#99a1af]">
              {currentHaras?.name || 'Haras'}
            </p>
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
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectMenu(item.id)}
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
      <div className="flex-1 flex flex-col overflow-hidden">
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
                {activeMenu === 'profile' ? 'Meu Perfil' :
                  activeMenu === 'settings' ? 'Configurações' :
                    menuItems.find(m => m.id === activeMenu)?.label}
              </h2>
              <p className="text-muted-foreground dark:text-[#99a1af]">
                {currentHaras?.name || 'Haras'}
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
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-3 rounded-lg bg-muted dark:bg-[#1a1a1a] hover:bg-accent dark:hover:bg-[#2a2a2a] transition-colors relative"
              >
                <Bell className="w-5 h-5 text-foreground dark:text-white" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] md:w-96 max-w-sm bg-card dark:bg-[#1a1a1a] rounded-xl shadow-xl border border-border dark:border-[rgba(255,255,255,0.1)] z-50 max-h-[500px] flex flex-col">
                  {/* Header */}
                  <div className="p-4 border-b border-border dark:border-[rgba(255,255,255,0.1)] flex items-center justify-between">
                    <h3 className="text-foreground dark:text-white">Notificações</h3>
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-sm text-primary dark:text-white hover:underline"
                    >
                      Marcar todas como lidas
                    </button>
                  </div>

                  {/* Notifications List */}
                  <div className="flex-1 overflow-y-auto">
                    {isLoadingNotifications ? (
                      <div className="p-4 text-sm text-muted-foreground dark:text-[#99a1af]">
                        Carregando notificações...
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <Bell className="w-12 h-12 text-muted-foreground dark:text-[#99a1af] mx-auto mb-3 opacity-50" />
                        <p className="text-muted-foreground dark:text-[#99a1af]">
                          Nenhuma notificação
                        </p>
                      </div>
                    ) : (
                      <div>
                        {notifications.map((notif) => (
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
                    )}
                  </div>

                  {/* Footer - Ver todas */}
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

            {/* User Menu - Desktop Only */}
            {!isMobile && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-3 rounded-lg bg-muted dark:bg-[#1a1a1a] hover:bg-accent dark:hover:bg-[#2a2a2a] transition-colors"
                >
                  <User className="w-5 h-5 text-foreground dark:text-white" />
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <UserDropdown
                    userName={userName}
                    userEmail={userEmail}
                    userRole={userRole}
                    userAvatarUrl={profile?.avatar_url}
                    isLoggingOut={isLoggingOut}
                    onProfileClick={() => setActiveMenu('profile')}
                    onSettingsClick={() => setActiveMenu('settings')}
                    onHelpClick={() => setActiveMenu('help')}
                    onLogout={handleLogout}
                    onClose={() => setShowUserMenu(false)}
                    showProfile={true}
                    showHelp={true}
                  />
                )}
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto mobile-scroll-hidden bg-background dark:bg-[#0d0d0d] p-4 md:p-8">
          {activeMenu === 'profile' && <ProfileView />}
          {activeMenu === 'settings' && <BreederSettingsContent />}
          {activeMenu === 'dashboard' && (
            <AdvisorDashboardContent
              onNavigateToPendencies={() => handleSelectMenu('tasks')}
              onNavigateToImport={() => handleSelectMenu('herd')}
              onNavigateToFinancial={() => handleSelectMenu('finance')}
              onNavigateToDocuments={() => handleSelectMenu('documents')}
              onNavigateToTeam={() => handleSelectMenu('team')}
            />
          )}
          {activeMenu === 'herd' && <BreederPlantelContent />}
          {activeMenu === 'reproduction' && (
            <BreederReproductionContent onNavigateToAgenda={() => handleSelectMenu('calendar')} />
          )}
          {activeMenu === 'finance' && <AdvisorFinanceContent />}
          {activeMenu === 'tasks' && <AdvisorTasksContent />}
          {activeMenu === 'team' && <AdvisorTeamContent />}
          {activeMenu === 'calendar' && <BreederAgendaContent />}
          {activeMenu === 'documents' && <AdvisorDocumentsContent />}
          {activeMenu === 'help' && <BreederHelpContent />}
          {activeMenu === 'pending-validation' && <AdvisorPendingValidation onBack={() => setActiveMenu('dashboard')} />}
        </main>
      </div>



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
