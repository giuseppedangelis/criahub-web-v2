'use client'

import { ThemeProvider } from '@/contexts/ThemeContext'
import { UserProvider, useUser } from '@/contexts/UserContext'
import { QueryClientProvider } from '@/lib/query-client'
import { AdminDashboard } from '@/components/AdminDashboard'
import { BreederDashboard } from '@/components/BreederDashboard'
import { AdvisorDashboard } from '@/components/AdvisorDashboard'
import { LoginScreen } from '@/components/auth/LoginScreen'
import { ForgotPasswordScreen } from '@/components/auth/ForgotPasswordScreen'
import { Toaster } from 'sonner'
import { useState } from 'react'

function AppContent() {
  const { userRole, isAuthenticated, isLoading, error } = useUser()
  const [authView, setAuthView] = useState<'login' | 'forgot-password'>('login')

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-[#0d0d0d]">
        <div className="text-center max-w-md p-6 bg-card rounded-lg shadow-lg border border-red-200 dark:border-red-900/50">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">Erro de Acesso</h3>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-[#0d0d0d]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  // Se não estiver autenticado, mostrar tela de login
  if (!isAuthenticated) {
    return (
      <>
        {authView === 'login' ? (
          <LoginScreen
            onLogin={() => { }}
            onForgotPassword={() => setAuthView('forgot-password')}
          />
        ) : (
          <ForgotPasswordScreen
            onBack={() => setAuthView('login')}
          />
        )}
        <Toaster
          position="top-right"
          expand={false}
          richColors
          closeButton
        />
      </>
    )
  }

  // Se autenticado, mostrar o dashboard apropriado
  const renderDashboard = () => {
    // Map database roles to dashboard components
    switch (userRole) {
      case 'admin':
        return <AdminDashboard />
      case 'breeder':
      case 'criador':
        return <BreederDashboard />
      case 'advisor':
      case 'assessor':
      case 'acessor':
        return <AdvisorDashboard />
      case null:
        return (
          <div className="min-h-screen flex items-center justify-center bg-background dark:bg-[#0d0d0d]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando Perfil...</p>
            </div>
          </div>
        )
      default:
        // Se cair aqui com um role desconhecido, mostra Breeder como fallback seguro ou erro? Use Breeder como fallback mas adicione log
        console.warn('Unknown role:', userRole);
        return <BreederDashboard />
    }
  }

  return (
    <>
      {renderDashboard()}
      <Toaster
        position="top-right"
        expand={false}
        richColors
        closeButton
      />
    </>
  )
}

export default function HomePage() {
  return (
    <QueryClientProvider>
      <ThemeProvider>
        <UserProvider>
          <AppContent />
        </UserProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
