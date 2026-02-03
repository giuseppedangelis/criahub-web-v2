'use client'

import { useState } from 'react'
import { User, UserCog, UserCircle, HelpCircle, LogOut, Loader2 } from 'lucide-react'

interface UserDropdownProps {
  userName?: string | null
  userEmail?: string | null
  userRole?: string | null
  isLoggingOut?: boolean
  onProfileClick: () => void
  onSettingsClick: () => void
  onHelpClick: () => void
  onLogout: () => void
  onClose: () => void
  showProfile?: boolean
  showHelp?: boolean
}

export function UserDropdown({
  userName,
  userEmail,
  userRole,
  isLoggingOut = false,
  onProfileClick,
  onSettingsClick,
  onHelpClick,
  onLogout,
  onClose,
  showProfile = true,
  showHelp = true
}: UserDropdownProps) {
  const getRoleLabel = (role: string | null) => {
    switch (role) {
      case 'admin':
        return 'Administrador'
      case 'breeder':
      case 'criador':
        return 'Criador'
      case 'advisor':
      case 'assessor':
      case 'acessor':
        return 'Acessor'
      default:
        return 'Usuário'
    }
  }

  const getRoleColor = (role: string | null) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
      case 'breeder':
      case 'criador':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
      case 'advisor':
      case 'assessor':
      case 'acessor':
        return 'bg-green-500/10 text-green-600 dark:text-green-400'
      default:
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] md:w-64 max-w-sm bg-card dark:bg-[#1a1a1a] rounded-xl shadow-xl border border-border dark:border-[rgba(255,255,255,0.1)] z-50">
      {/* Header do Usuário */}
      <div className="p-4 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary dark:bg-white rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white dark:text-black" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-foreground dark:text-white font-medium truncate">
              {userName || 'Usuário'}
            </p>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af] truncate">
              {userEmail || ''}
            </p>
            <div className={`mt-1 inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${getRoleColor(userRole || null)}`}>
              {getRoleLabel(userRole || null)}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-2">
        {showProfile && (
          <button
            onClick={() => {
              onProfileClick()
              onClose()
            }}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] text-foreground dark:text-white flex items-center gap-3 transition-colors group"
          >
            <div className="w-8 h-8 rounded-md bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
              <UserCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 flex items-center justify-between">
              <span>Meu Perfil</span>
              <span className="text-xs text-muted-foreground dark:text-[#99a1af]">P</span>
            </div>
          </button>
        )}

        <button
          onClick={() => {
            onSettingsClick()
            onClose()
          }}
          className="w-full text-left px-4 py-2 rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] text-foreground dark:text-white flex items-center gap-3 transition-colors group"
        >
          <div className="w-8 h-8 rounded-md bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
            <UserCog className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1 flex items-center justify-between">
            <span>Configurações</span>
            <span className="text-xs text-muted-foreground dark:text-[#99a1af]">S</span>
          </div>
        </button>

        {showHelp && (
          <button
            onClick={() => {
              onHelpClick()
              onClose()
            }}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] text-foreground dark:text-white flex items-center gap-3 transition-colors group"
          >
            <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
              <HelpCircle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex-1 flex items-center justify-between">
              <span>Central de Ajuda</span>
              <span className="text-xs text-muted-foreground dark:text-[#99a1af]">H</span>
            </div>
          </button>
        )}

        <div className="border-t border-border dark:border-[rgba(255,255,255,0.1)] my-2"></div>

        <button
          onClick={() => {
            onLogout()
            onClose()
          }}
          disabled={isLoggingOut}
          className="w-full text-left px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 dark:text-red-400 flex items-center gap-3 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-8 h-8 rounded-md bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
            {isLoggingOut ? (
              <Loader2 className="w-4 h-4 text-red-500 dark:text-red-400 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4 text-red-500 dark:text-red-400" />
            )}
          </div>
          <div className="flex-1 flex items-center justify-between">
            <span>{isLoggingOut ? 'Saindo...' : 'Sair'}</span>
            <span className="text-xs text-red-400 dark:text-red-500">⌘Q</span>
          </div>
        </button>
      </div>
    </div>
  )
}
