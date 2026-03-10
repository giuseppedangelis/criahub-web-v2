'use client'

import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { BrandLogo } from '@/components/branding/BrandLogo'
import { cn } from '@/lib/utils'

export interface DashboardMenuItem {
  id: string
  label: string
  icon: LucideIcon
}

interface DashboardShellProps {
  isMobile: boolean
  isSidebarOpen: boolean
  menuItems: DashboardMenuItem[]
  activeMenuId: string
  onSelectMenu: (menuId: string) => void
  onOpenSidebar: () => void
  onCloseSidebar: () => void
  title: string
  subtitle: string
  sidebarSubtitle: string
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  topbarActions: ReactNode
  children: ReactNode
}

const sidebarItemBaseClass =
  'w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-200'

const sidebarItemActiveClass =
  'bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)] shadow-sm dark:bg-white/10 dark:text-white'

const sidebarItemInactiveClass =
  'text-[color:var(--sidebar-foreground)]/72 hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)] dark:text-white/80 dark:hover:bg-white/5 dark:hover:text-white'

const sidebarUtilityButtonClass =
  'rounded-xl p-2 text-[color:var(--sidebar-foreground)]/72 transition-colors hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)] dark:text-white/80 dark:hover:bg-white/5 dark:hover:text-white'

export const dashboardTopbarControlClass =
  'rounded-xl bg-muted p-3 text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-[#1a1a1a] dark:text-white dark:hover:bg-[#2a2a2a]'

export function DashboardShell({
  isMobile,
  isSidebarOpen,
  menuItems,
  activeMenuId,
  onSelectMenu,
  onOpenSidebar,
  onCloseSidebar,
  title,
  subtitle,
  sidebarSubtitle,
  theme,
  onToggleTheme,
  topbarActions,
  children,
}: DashboardShellProps) {
  return (
    <div className="flex h-screen bg-background dark:bg-[#0d0d0d]">
      {isMobile && isSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={onCloseSidebar} />
      )}

      <aside
        className={cn(
          isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative',
          'w-64 border-r border-[color:var(--sidebar-border)] bg-[var(--sidebar)] text-[var(--sidebar-foreground)] dark:border-[#1a1a1a] dark:bg-[#1a1a1a] flex flex-col transition-transform duration-300',
          isMobile ? (isSidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
        )}
      >
        <div className="h-[101px] px-6 flex items-center justify-between border-b border-[color:var(--sidebar-border)] dark:border-[#1a1a1a]">
          <div>
            <BrandLogo orientation="horizontal" className="h-8 w-auto mb-2" />
            <p className="text-[color:var(--sidebar-foreground)]/62 dark:text-[#99a1af]">{sidebarSubtitle}</p>
          </div>
          {isMobile && (
            <button onClick={onCloseSidebar} className={sidebarUtilityButtonClass}>
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeMenuId === item.id

            return (
              <button
                key={item.id}
                onClick={() => onSelectMenu(item.id)}
                className={cn(
                  sidebarItemBaseClass,
                  isActive ? sidebarItemActiveClass : sidebarItemInactiveClass
                )}
                style={
                  isActive
                    ? {
                        backgroundColor: 'var(--sidebar-primary)',
                        color: 'var(--sidebar-primary-foreground)',
                      }
                    : undefined
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {isMobile && (
          <div className="px-3 pb-4 pt-4 border-t border-[color:var(--sidebar-border)] dark:border-[#1a1a1a]">
            <button
              onClick={onToggleTheme}
              className={cn(sidebarItemBaseClass, sidebarItemInactiveClass)}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-5 h-5 shrink-0" />
                  <span>Modo Claro</span>
                </>
              ) : (
                <>
                  <Moon className="w-5 h-5 shrink-0" />
                  <span>Modo Escuro</span>
                </>
              )}
            </button>
          </div>
        )}
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-[101px] bg-background dark:bg-[#0d0d0d] border-b border-border/90 dark:border-[#1a1a1a] px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isMobile && (
              <button onClick={onOpenSidebar} className={dashboardTopbarControlClass}>
                <Menu className="w-5 h-5" />
              </button>
            )}
            <div>
              <h2 className="text-xl md:text-2xl text-foreground dark:text-white mb-1">{title}</h2>
              <p className="text-muted-foreground dark:text-[#99a1af]">{subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isMobile && (
              <button onClick={onToggleTheme} className={dashboardTopbarControlClass}>
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-white" />
                ) : (
                  <Moon className="w-5 h-5 text-foreground" />
                )}
              </button>
            )}
            {topbarActions}
          </div>
        </header>
        {children}
      </main>
    </div>
  )
}
