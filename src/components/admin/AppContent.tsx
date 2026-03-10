'use client'

import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Dashboard } from './Dashboard';
import { Subscriptions } from './Subscriptions';
import { PlatformUsage } from './PlatformUsage';
import { CriticalAlerts } from './CriticalAlerts';
import { Settings } from './Settings';
import { MobileApp } from './mobile/MobileApp';
import { useTheme } from '../../contexts/ThemeContext';

export type PageType = 'dashboard' | 'subscriptions' | 'usage' | 'alerts' | 'settings';

export function AppContent() {
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    const handleResize = () => {
      setViewMode(window.innerWidth < 768 ? 'mobile' : 'desktop');
    };

    // Set initial view mode
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'subscriptions':
        return <Subscriptions />;
      case 'usage':
        return <PlatformUsage />;
      case 'alerts':
        return <CriticalAlerts />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="relative">
      {viewMode === 'desktop' ? (
        <div className={`flex h-screen transition-colors ${theme === 'dark' ? 'bg-[#0d0d0d]' : 'bg-background'
          }`}>
          <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Topbar />
            <main className="flex-1 overflow-y-auto">
              {renderPage()}
            </main>
          </div>
        </div>
      ) : (
        <div className="bg-background min-h-screen flex items-center justify-center p-4">
          <MobileApp />
        </div>
      )}
    </div>
  );
}
