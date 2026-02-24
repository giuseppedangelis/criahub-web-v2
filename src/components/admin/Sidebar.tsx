import { LayoutDashboard, CreditCard, BarChart3, AlertTriangle, Settings } from 'lucide-react';
import { PageType } from '@/types';
import { useTheme } from '../../contexts/ThemeContext';

interface SidebarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

const menuItems = [
  { id: 'dashboard' as PageType, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'subscriptions' as PageType, label: 'Assinaturas', icon: CreditCard },
  { id: 'usage' as PageType, label: 'Uso da Plataforma', icon: BarChart3 },
  { id: 'alerts' as PageType, label: 'Alertas Críticos', icon: AlertTriangle },
  { id: 'settings' as PageType, label: 'Configurações', icon: Settings },
];

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { theme } = useTheme();

  return (
    <aside className={`w-64 border-r flex flex-col transition-colors ${
      theme === 'dark'
        ? 'bg-[#1a1a1a] border-[#1a1a1a]'
        : 'bg-white border-gray-200'
    }`}>
      <div className={`p-6 border-b ${
        theme === 'dark' ? 'border-[#1a1a1a]' : 'border-gray-200'
      }`}>
        <h1 className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>CriaHub</h1>
        <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Administrador
        </p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? theme === 'dark'
                        ? 'bg-white text-[#1a1a1a]'
                        : 'bg-[#333333] text-white'
                      : theme === 'dark'
                        ? 'text-white hover:bg-[#333333]'
                        : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}