'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Home,
    Users,
    CreditCard,
    BarChart3,
    AlertTriangle,
    Settings,
    HelpCircle,
    ChevronLeft,
    ChevronRight,
    LogOut,
    FileText,
    Calendar,
    ClipboardList,
    Heart
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BrandLogo } from '@/components/branding/BrandLogo'
import { useAuth } from '@/contexts/auth-context'
import type { Database } from '@/types/database.types'

type UserRole = Database['public']['Tables']['profiles']['Row']['role']

interface SidebarProps {
    role: UserRole
}

const assessorMenu = [
    { label: 'Dashboard', href: '/assessor', icon: Home },
    { label: 'Plantel', href: '/assessor/plantel', icon: Users },
    { label: 'Pendências', href: '/assessor/pendencias', icon: AlertTriangle },
    { label: 'Reprodução', href: '/assessor/reproducao', icon: Heart },
    { label: 'Financeiro', href: '/assessor/financeiro', icon: CreditCard },
    { label: 'Tarefas', href: '/assessor/tarefas', icon: ClipboardList },
    { label: 'Equipe', href: '/assessor/equipe', icon: Users },
    { label: 'Agenda', href: '/assessor/agenda', icon: Calendar },
    { label: 'Documentos', href: '/assessor/documentos', icon: FileText },
    { label: 'Configurações', href: '/assessor/configuracoes', icon: Settings },
    { label: 'Ajuda', href: '/assessor/ajuda', icon: HelpCircle },
]

const menuConfig = {
    admin: [
        { label: 'Dashboard', href: '/admin', icon: Home },
        { label: 'Assinaturas', href: '/admin/assinaturas', icon: CreditCard },
        { label: 'Uso da Plataforma', href: '/admin/uso', icon: BarChart3 },
        { label: 'Alertas Críticos', href: '/admin/alertas', icon: AlertTriangle },
        { label: 'Configurações', href: '/admin/configuracoes', icon: Settings },
        { label: 'Ajuda', href: '/admin/ajuda', icon: HelpCircle },
    ],
    criador: [
        { label: 'Dashboard', href: '/criador', icon: Home },
        { label: 'Plantel', href: '/criador/plantel', icon: Users },
        { label: 'Reprodução', href: '/criador/reproducao', icon: Heart },
        { label: 'Financeiro', href: '/criador/financeiro', icon: CreditCard },
        { label: 'Agenda', href: '/criador/agenda', icon: Calendar },
        { label: 'Relatórios', href: '/criador/relatorios', icon: BarChart3 },
        { label: 'Configurações', href: '/criador/configuracoes', icon: Settings },
        { label: 'Ajuda', href: '/criador/ajuda', icon: HelpCircle },
    ],
    assessor: assessorMenu,
    advisor: assessorMenu,
}

export function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname()
    const { signOut } = useAuth()
    const [isCollapsed, setIsCollapsed] = useState(false)

    const menu = menuConfig[role] || menuConfig.criador

    const handleSignOut = async () => {
        await signOut()
        window.location.href = '/login'
    }

    return (
        <aside
            className={cn(
                'fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300',
                isCollapsed ? 'w-[70px]' : 'w-[260px]'
            )}
        >
            <div className="flex h-full flex-col">
                {/* Logo */}
                <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
                    <Link href="/" className={cn('flex items-center', isCollapsed ? 'justify-center' : 'pr-2')}>
                        {isCollapsed ? (
                            <BrandLogo orientation="icon" className="h-9 w-9" />
                        ) : (
                            <BrandLogo orientation="horizontal" className="h-8 w-auto" />
                        )}
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-xl text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                    >
                        {isCollapsed ? (
                            <ChevronRight className="w-4 h-4" />
                        ) : (
                            <ChevronLeft className="w-4 h-4" />
                        )}
                    </Button>
                </div>

                {/* Menu */}
                <ScrollArea className="flex-1 px-3 py-4">
                    <nav className="space-y-1">
                        {menu.map((item) => {
                            const isActive = pathname === item.href ||
                                (item.href !== '/' && pathname.startsWith(item.href + '/'))

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                                        isActive
                                            ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm dark:bg-white dark:text-black'
                                            : 'text-sidebar-foreground/72 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                                    )}
                                >
                                    <item.icon className="w-5 h-5 flex-shrink-0" />
                                    {!isCollapsed && <span>{item.label}</span>}
                                </Link>
                            )
                        })}
                    </nav>
                </ScrollArea>

                {/* Footer */}
                <div className="p-3 border-t border-sidebar-border">
                    <Button
                        variant="ghost"
                        className={cn(
                            'w-full justify-start gap-3 rounded-xl text-sidebar-foreground/72 hover:bg-sidebar-accent hover:text-destructive',
                            isCollapsed && 'justify-center'
                        )}
                        onClick={handleSignOut}
                    >
                        <LogOut className="w-5 h-5" />
                        {!isCollapsed && <span>Sair</span>}
                    </Button>
                </div>
            </div>
        </aside>
    )
}
