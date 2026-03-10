import { LayoutDashboard, CreditCard, BarChart3, AlertTriangle, Settings } from 'lucide-react';
import { PageType } from '@/types';
import { BrandLogo } from '../branding/BrandLogo';

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
  return (
    <aside className="w-64 flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-colors dark:border-[#1a1a1a] dark:bg-[#1a1a1a] dark:text-white">
      <div className="border-b border-sidebar-border p-6 dark:border-[#1a1a1a]">
        <BrandLogo orientation="horizontal" className="h-8 w-auto" />
        <p className="mt-1 text-sidebar-foreground/62 dark:text-gray-400">
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
                  className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm dark:bg-white/10 dark:text-white'
                      : 'text-sidebar-foreground/72 hover:bg-sidebar-accent hover:text-sidebar-foreground dark:text-white/80 dark:hover:bg-white/5 dark:hover:text-white'
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
