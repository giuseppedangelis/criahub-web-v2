'use client'
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { LayoutDashboard, Users, Heart, DollarSign, CheckSquare, Calendar, FileText, Settings, Moon, Sun, Bell, LogOut, UserCircle, Menu, X, Check, Trash2, HelpCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useResponsive } from '../hooks/useResponsive';
import { ProfileView } from './ProfileView';
import { AdvisorDashboardContent } from './advisor/AdvisorDashboardContent';
import { AdvisorHerdContent } from './advisor/AdvisorHerdContent';
import { AdvisorReproductionContentNew } from './advisor/AdvisorReproductionContentNew';
import { AdvisorFinanceContent } from './advisor/AdvisorFinanceContent';
import { AdvisorTasksContent } from './advisor/AdvisorTasksContent';
import { AdvisorTeamContent } from './advisor/AdvisorTeamContent';
import { AdvisorCalendarContent } from './advisor/AdvisorCalendarContent';
import { AdvisorDocumentsContent } from './advisor/AdvisorDocumentsContent';
import { AdvisorSettingsContent } from './advisor/AdvisorSettingsContent';
import { AdvisorHelpContent } from './advisor/AdvisorHelpContent';
import { AdvisorPendingValidation } from './advisor/AdvisorPendingValidation';
import { NotificationsPanel } from './NotificationsPanel';

export function AdvisorDashboard() {
  const { theme, toggleTheme } = useTheme();
  const { userRole, userName, userEmail, logout } = useUser();
  const { isMobile } = useResponsive();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Documento Assinado',
      message: 'GIA - Estrela Mangalarga foi assinado',
      time: 'Há 2 horas',
      unread: true
    },
    {
      id: 2,
      title: 'Evento Próximo',
      message: 'Vistoria ABCCMM agendada para amanhã às 10:00',
      time: 'Há 3 horas',
      unread: true
    },
    {
      id: 3,
      title: 'Tarefa Atribuída',
      message: 'Atualizar registro de Vento Sul no ABCCMM',
      time: 'Há 5 horas',
      unread: true
    },
    {
      id: 4,
      title: 'Pagamento Pendente',
      message: 'Fatura de veterinário vence em 3 dias',
      time: 'Há 1 dia',
      unread: true
    },
    {
      id: 5,
      title: 'Novo Membro da Equipe',
      message: 'Carlos Silva foi adicionado à equipe',
      time: 'Há 2 dias',
      unread: false
    },
  ]);

  const unreadNotifications = notifications.filter(n => n.unread).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, unread: false } : n
    ));
  };

  const markAllAsRead = () => {
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

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  // Fecha a sidebar quando mudar de mobile para desktop
  useEffect(() => {
    if (!isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  const menuItems = [
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
  ];

  const userRole_display = 'Assessora Administrativa';

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
            <p className="text-muted-foreground dark:text-[#99a1af]">Assessor Administrativo</p>
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
                onClick={() => {
                  setActiveMenu(item.id);
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
                Haras Vale Verde
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
                      onClick={markAllAsRead}
                      className="text-sm text-primary dark:text-white hover:underline"
                    >
                      Marcar todas como lidas
                    </button>
                  </div>

                  {/* Notifications List */}
                  <div className="flex-1 overflow-y-auto">
                    {notifications.length === 0 ? (
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
                  <UserCircle className="w-5 h-5 text-foreground dark:text-white" />
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] md:w-64 max-w-sm bg-card dark:bg-[#1a1a1a] rounded-xl shadow-xl border border-border dark:border-[rgba(255,255,255,0.1)] z-50">
                    <div className="p-4 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
                      <p className="text-foreground dark:text-white">{userName || 'Usuário'}</p>
                      <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                        {userEmail || ''}
                      </p>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          setActiveMenu('profile');
                        }}
                        className="w-full text-left px-4 py-2 rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] text-foreground dark:text-white flex items-center gap-3"
                      >
                        <UserCircle className="w-4 h-4" />
                        Meu Perfil
                      </button>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          setActiveMenu('settings');
                        }}
                        className="w-full text-left px-4 py-2 rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] text-foreground dark:text-white flex items-center gap-3"
                      >
                        <Settings className="w-4 h-4" />
                        Configurações
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
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto mobile-scroll-hidden bg-background dark:bg-[#0d0d0d] p-4 md:p-8">
          {activeMenu === 'profile' && <ProfileView />}
          {activeMenu === 'settings' && <AdvisorSettingsContent />}
          {activeMenu === 'dashboard' && (
            <AdvisorDashboardContent
              onNavigateToPendencies={() => setActiveMenu('tasks')}
              onNavigateToImport={() => setActiveMenu('herd')}
              onNavigateToFinancial={() => setActiveMenu('finance')}
              onNavigateToDocuments={() => setActiveMenu('documents')}
            />
          )}
          {activeMenu === 'herd' && <AdvisorHerdContent />}
          {activeMenu === 'reproduction' && <AdvisorReproductionContentNew />}
          {activeMenu === 'finance' && <AdvisorFinanceContent />}
          {activeMenu === 'tasks' && <AdvisorTasksContent />}
          {activeMenu === 'team' && <AdvisorTeamContent />}
          {activeMenu === 'calendar' && <AdvisorCalendarContent />}
          {activeMenu === 'documents' && <AdvisorDocumentsContent />}
          {activeMenu === 'help' && <AdvisorHelpContent />}
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