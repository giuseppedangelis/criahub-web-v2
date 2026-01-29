import { useState } from 'react';
import { LayoutDashboard, AlertTriangle, CreditCard, User } from 'lucide-react';
import { MobileDashboard } from './MobileDashboard';
import { MobileAlerts } from './MobileAlerts';
import { MobileSubscriptions } from './MobileSubscriptions';
import { MobileProfile } from './MobileProfile';

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
    <div className="h-screen flex flex-col bg-gray-50 max-w-md mx-auto">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <h1 className="text-gray-900">CriaHub</h1>
        <p className="text-gray-500">Administrador</p>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {renderPage()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-md mx-auto">
        <div className="flex justify-around items-center">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex flex-col items-center py-3 px-4 flex-1 transition-colors ${
                  isActive ? 'text-gray-900' : 'text-gray-500'
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