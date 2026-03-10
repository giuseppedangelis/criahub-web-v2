import { useState } from 'react';
import { LayoutDashboard, AlertTriangle, CreditCard, User } from 'lucide-react';
import { MobileDashboard } from './MobileDashboard';
import { MobileAlerts } from './MobileAlerts';
import { MobileSubscriptions } from './MobileSubscriptions';
import { MobileProfile } from './MobileProfile';
import { BrandLogo } from '../../branding/BrandLogo';

export type MobilePageType = 'dashboard' | 'alerts' | 'subscriptions' | 'profile';

export function MobileApp() {
  const [currentPage, setCurrentPage] = useState<MobilePageType>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <MobileDashboard />;
      case 'alerts':
        return <MobileAlerts />;
      case 'subscriptions':
        return <MobileSubscriptions />;
      case 'profile':
        return <MobileProfile />;
      default:
        return <MobileDashboard />;
    }
  };

  const menuItems = [
    { id: 'dashboard' as MobilePageType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'alerts' as MobilePageType, label: 'Alertas', icon: AlertTriangle },
    { id: 'subscriptions' as MobilePageType, label: 'Assinaturas', icon: CreditCard },
    { id: 'profile' as MobilePageType, label: 'Perfil', icon: User },
  ];

  return (
    <div className="h-screen flex flex-col bg-background max-w-md mx-auto">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4">
        <BrandLogo orientation="horizontal" className="h-8 w-auto" />
        <p className="text-muted-foreground">Administrador</p>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {renderPage()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border max-w-md mx-auto">
        <div className="flex justify-around items-center">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex flex-1 flex-col items-center px-4 py-3 transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
