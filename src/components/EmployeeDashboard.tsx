'use client'
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { Home, Heart, Users as HorseIcon, User, Calendar, Moon, Sun, Bell, LogOut, UserCircle, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { ProfileView } from './ProfileView';
import { PeonHomeContent } from './employee/PeonHomeContent';
import { PeonPregnanciesContent } from './employee/PeonPregnanciesContent';
import { PeonHerdContent } from './employee/PeonHerdContent';
import { VetHomeContent } from './employee/VetHomeContent';
import { VetHerdContent } from './employee/VetHerdContent';
import { VetCalendarContent } from './employee/VetCalendarContent';
import { BrandLogo } from './branding/BrandLogo';

export function EmployeeDashboard() {
  const { theme, toggleTheme } = useTheme();
  const { userRole, userName, userEmail, logout } = useUser();
  const [activeTab, setActiveTab] = useState('home');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [employeeType, setEmployeeType] = useState<'peon' | 'vet'>('peon'); // or 'vet'
  const [unreadNotifications] = useState(3);

  // For demo purposes, we can toggle between Peão and Veterinária
  const isPeon = employeeType === 'peon';
  const isVet = employeeType === 'vet';

  const peonMenuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'pregnancies', label: 'Gestações', icon: Heart },
    { id: 'herd', label: 'Plantel', icon: HorseIcon },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  const vetMenuItems = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'herd', label: 'Plantel', icon: HorseIcon },
    { id: 'calendar', label: 'Calendário', icon: Calendar },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  const menuItems = isPeon ? peonMenuItems : vetMenuItems;
  const userTitle = isPeon ? 'Peão' : 'Veterinária';

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex flex-col h-screen bg-background dark:bg-[#0d0d0d]">
      {/* Mobile Header */}
      <header className="bg-card dark:bg-[#1a1a1a] border-b border-border dark:border-[rgba(255,255,255,0.1)] px-4 py-4 flex items-center justify-between">
        <div>
          <BrandLogo orientation="horizontal" tone="dark" className="h-7 w-auto" />
          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">{userTitle}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button className="p-2 rounded-lg bg-muted dark:bg-[#0d0d0d] hover:bg-accent dark:hover:bg-[#2a2a2a] transition-colors relative">
            <Bell className="w-5 h-5 text-foreground dark:text-white" />
            {unreadNotifications > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="p-2 rounded-lg bg-muted dark:bg-[#0d0d0d] hover:bg-accent dark:hover:bg-[#2a2a2a] transition-colors"
            >
              <User className="w-5 h-5 text-foreground dark:text-white" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] md:w-64 max-w-sm bg-card dark:bg-[#1a1a1a] rounded-xl shadow-xl border border-border dark:border-[rgba(255,255,255,0.1)] z-50">
                <div className="p-4 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary dark:bg-white rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white dark:text-black" />
                    </div>
                    <div>
                      <p className="text-foreground dark:text-white">{userName || 'Usuário'}</p>
                      <p className="text-sm text-muted-foreground dark:text-[#99a1af]">{userEmail || ''}</p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      setActiveTab('profile');
                    }}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] text-foreground dark:text-white flex items-center gap-3"
                  >
                    <UserCircle className="w-4 h-4" />
                    Meu Perfil
                  </button>
                  <button
                    onClick={() => {
                      toggleTheme();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] text-foreground dark:text-white flex items-center gap-3"
                  >
                    {theme === 'dark' ? (
                      <>
                        <Sun className="w-4 h-4" />
                        Modo Claro
                      </>
                    ) : (
                      <>
                        <Moon className="w-4 h-4" />
                        Modo Escuro
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setEmployeeType(employeeType === 'peon' ? 'vet' : 'peon');
                      setActiveTab('home');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] text-foreground dark:text-white flex items-center gap-3"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Alternar: {isPeon ? 'Ver como Veterinária' : 'Ver como Peão'}
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
      <div className="flex-1 overflow-auto mobile-scroll-hidden pb-20">
        {activeTab === 'profile' && <ProfileView />}

        {/* Peão Content */}
        {isPeon && activeTab === 'home' && <PeonHomeContent />}
        {isPeon && activeTab === 'pregnancies' && <PeonPregnanciesContent />}
        {isPeon && activeTab === 'herd' && <PeonHerdContent />}

        {/* Veterinária Content */}
        {isVet && activeTab === 'home' && <VetHomeContent />}
        {isVet && activeTab === 'herd' && <VetHerdContent />}
        {isVet && activeTab === 'calendar' && <VetCalendarContent />}
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card dark:bg-[#1a1a1a] border-t border-border dark:border-[rgba(255,255,255,0.1)] px-4 py-3">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="flex flex-col items-center gap-1 min-w-[60px]"
              >
                <Icon className={`w-6 h-6 ${isActive ? 'text-primary dark:text-white' : 'text-muted-foreground dark:text-[#99a1af]'}`} />
                <span className={`text-xs ${isActive ? 'text-primary dark:text-white' : 'text-muted-foreground dark:text-[#99a1af]'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>


    </div>
  );
}
