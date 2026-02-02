'use client'
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { LayoutDashboard, Users as HorseIcon, Heart, DollarSign, Calendar, Settings, Moon, Sun, Bell, User, Menu, X, FileText, HelpCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useResponsive } from '../hooks/useResponsive';
import { ProfileView } from './ProfileView';
import { UserDropdown } from './shared/UserDropdown';
import { BreederDashboardContent } from './breeder/BreederDashboardContent';
import { BreederPlantelContent } from './breeder/BreederPlantelContent';
import { BreederReproductionContent } from './breeder/BreederReproductionContent';
import { BreederFinancialContent } from './breeder/BreederFinancialContent';
import { BreederAgendaContent } from './breeder/BreederAgendaContent';
import { BreederHelpContent } from './breeder/BreederHelpContent';
import { BreederSettingsContent } from './breeder/BreederSettingsContent';
import { AddAnimalForm } from './breeder/AddAnimalForm';
import { NotificationsPanel } from './NotificationsPanel';
import { NotificationsCenter } from './breeder/NotificationsCenter';
import { ReportsTab } from './breeder/ReportsTab';
import { AnimalReportModal } from './breeder/AnimalReportModal';
import { HerdReportModal } from './breeder/HerdReportModal';
import { FinancialReportModal } from './breeder/FinancialReportModal';
import { HealthReportModal } from './breeder/HealthReportModal';

export function BreederDashboard() {
  const { theme, toggleTheme } = useTheme();
  const { userRole, userEmail, userName, logout } = useUser();
  const { isMobile } = useResponsive();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAnimalReportModal, setShowAnimalReportModal] = useState(false);
  const [showHerdReportModal, setShowHerdReportModal] = useState(false);
  const [showFinancialReportModal, setShowFinancialReportModal] = useState(false);
  const [showHealthReportModal, setShowHealthReportModal] = useState(false);
  const [showNotificationsCenter, setShowNotificationsCenter] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Nova cobertura registrada', message: 'Estrela Mangalarga x Vento Sul', time: '2 min atrás', unread: true },
    { id: 2, title: 'Lembrete de vacina', message: 'Sol do Amanhecer - vacina vence em 3 dias', time: '1 hora atrás', unread: true },
    { id: 3, title: 'Pagamento recebido', message: 'R$ 2.500 - venda de produto Lua da Serra', time: '2 horas atrás', unread: true },
    { id: 4, title: 'Evento agendado', message: 'Exposição Mangalarga - 15/12', time: '1 dia atrás', unread: false },
    { id: 5, title: 'Documento pendente', message: 'GIA de Estrela Dourada aguardando assinatura', time: '2 dias atrás', unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  // Fecha a sidebar quando mudar de mobile para desktop
  useEffect(() => {
    if (!isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  // Fecha dropdowns quando clicar fora
  useEffect(() => {
    const handleClickOutside = () => {
      setShowNotifications(false);
      setShowUserMenu(false);
    };

    if (showNotifications || showUserMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showNotifications, showUserMenu]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'plantel', label: 'Plantel', icon: HorseIcon },
    { id: 'reproduction', label: 'Reprodução', icon: Heart },
    { id: 'financial', label: 'Financeiro', icon: DollarSign },
    { id: 'agenda', label: 'Agenda', icon: Calendar },
    { id: 'reports', label: 'Relatórios', icon: FileText },
    { id: 'settings', label: 'Configurações', icon: Settings },
    { id: 'help', label: 'Ajuda', icon: HelpCircle },
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
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      setIsLoggingOut(false);
    }
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
            <p className="text-muted-foreground dark:text-[#99a1af]">Haras Vale Verde</p>
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
              <p className="text-muted-foreground dark:text-[#99a1af]">
                Gestão Completa do Haras
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
                        setShowNotificationsCenter(true);
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
                <UserDropdown
                  userName={userName}
                  userEmail={userEmail}
                  userRole={userRole}
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
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto mobile-scroll-hidden bg-background dark:bg-[#0d0d0d] p-4 md:p-8">
          {activeTab === 'dashboard' && <BreederDashboardContent onNavigate={setActiveTab} />}
          {activeTab === 'add-animal' && <AddAnimalForm onBack={() => setActiveTab('dashboard')} />}
          {activeTab === 'plantel' && <BreederPlantelContent />}
          {activeTab === 'reproduction' && <BreederReproductionContent onNavigateToAgenda={() => setActiveTab('agenda')} />}
          {activeTab === 'financial' && <BreederFinancialContent />}
          {activeTab === 'agenda' && <BreederAgendaContent />}
          {activeTab === 'help' && <BreederHelpContent />}
          {activeTab === 'settings' && <BreederSettingsContent />}
          {activeTab === 'profile' && <ProfileView />}
          {activeTab === 'reports' && (
            <ReportsTab
              onGenerateAnimalReport={() => setShowAnimalReportModal(true)}
              onGenerateHerdReport={() => setShowHerdReportModal(true)}
              onGenerateFinancialReport={() => setShowFinancialReportModal(true)}
              onGenerateHealthReport={() => setShowHealthReportModal(true)}
            />
          )}
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

      {/* Report Modals */}
      <AnimalReportModal
        isOpen={showAnimalReportModal}
        onClose={() => setShowAnimalReportModal(false)}
      />

      <HerdReportModal
        isOpen={showHerdReportModal}
        onClose={() => setShowHerdReportModal(false)}
      />

      <FinancialReportModal
        isOpen={showFinancialReportModal}
        onClose={() => setShowFinancialReportModal(false)}
      />

      <HealthReportModal
        isOpen={showHealthReportModal}
        onClose={() => setShowHealthReportModal(false)}
      />

      {/* Notifications Center */}
      <NotificationsCenter
        isOpen={showNotificationsCenter}
        onClose={() => setShowNotificationsCenter(false)}
      />
    </div>
  );
}