'use client'

import { useState } from 'react'
import { Bell, Moon, Sun, Search, Menu, User, Settings, LogOut, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useUser } from '@/contexts/UserContext'
import { useTheme } from '@/contexts/ThemeContext'
import type { UserRole } from '@/contexts/UserContext'

interface HeaderProps {
    title?: string
    onMenuClick?: () => void
}

export function Header({ title, onMenuClick }: HeaderProps) {
    const { profile, logout } = useUser()
    const { theme, toggleTheme } = useTheme()
    const [isSigningOut, setIsSigningOut] = useState(false)

    const handleSignOut = async () => {
        setIsSigningOut(true)
        try {
            await logout()
            window.location.href = '/login'
        } catch (error) {
            setIsSigningOut(false)
        }
    }

    const getInitials = (name: string | null | undefined) => {
        if (!name) return 'U'
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    const getRoleLabel = (role: UserRole | undefined) => {
        switch (role) {
            case 'admin':
                return 'Administrador'
            case 'breeder':
                return 'Criador'
            case 'advisor':
                return 'Acessor'
            case 'criador':
                return 'Criador'
            case 'assessor':
                return 'Acessor'
            case 'acessor':
                return 'Acessor'
            default:
                return 'Usuário'
        }
    }

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
            {/* Mobile menu button */}
            <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={onMenuClick}
            >
                <Menu className="h-5 w-5" />
            </Button>

            {/* Title */}
            {title && (
                <h1 className="text-lg font-semibold hidden md:block">{title}</h1>
            )}

            {/* Search */}
            <div className="flex-1 max-w-md hidden md:block">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar..."
                        className="pl-9 bg-muted/50 border-0 focus-visible:ring-1"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
                {/* Theme toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                >
                    {theme === 'dark' ? (
                        <Sun className="h-5 w-5" />
                    ) : (
                        <Moon className="h-5 w-5" />
                    )}
                </Button>

                {/* Notifications */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
                                3
                            </span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                        <DropdownMenuLabel>Notificações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            Nenhuma notificação nova
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* User menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || 'User'} />
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                    {getInitials(profile?.full_name)}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage
                                        src={profile?.avatar_url || undefined}
                                        alt={profile?.full_name || 'User'}
                                    />
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                        {getInitials(profile?.full_name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {profile?.full_name || 'Usuário'}
                                    </p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {getRoleLabel(profile?.role)}
                                    </p>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                            onClick={() => window.location.href = '/profile'}
                            className="cursor-pointer"
                        >
                            <User className="mr-2 h-4 w-4" />
                            <span>Meu Perfil</span>
                            <span className="ml-auto text-xs text-muted-foreground">P</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            onClick={() => window.location.href = '/settings'}
                            className="cursor-pointer"
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Configurações</span>
                            <span className="ml-auto text-xs text-muted-foreground">S</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive cursor-pointer"
                            onClick={handleSignOut}
                            disabled={isSigningOut}
                        >
                            {isSigningOut ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <LogOut className="mr-2 h-4 w-4" />
                            )}
                            <span>{isSigningOut ? 'Saindo...' : 'Sair'}</span>
                            <span className="ml-auto text-xs text-muted-foreground">⌘Q</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
