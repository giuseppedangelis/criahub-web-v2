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
  const { userRole, isAuthenticated, isLoading } = useUser()
  const [authView, setAuthView] = useState<'login' | 'forgot-password'>('login')

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
        return <AdvisorDashboard />
      default:
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
