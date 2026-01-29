'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

// Roles mantidos conforme o banco: admin, criador, assessor
export type UserRole = 'admin' | 'criador' | 'assessor' | 'breeder' | 'advisor' | 'employee';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  haras_id: string | null;
  phone: string | null;
}

interface UserContextType {
  user: User | null;
  profile: UserProfile | null;
  userRole: UserRole | null;
  userName: string | null;
  userEmail: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setUserRole: (role: UserRole) => void;
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async (userId: string) => {
    console.log('UserContext: Buscando perfil para', userId);
    setError(null);
    try {
      const { data, error: supabaseError } = await supabase
        .from('profiles')
        .select('id, email, full_name, avatar_url, role, haras_id, phone')
        .eq('id', userId)
        .single();

      if (supabaseError) {
        console.error('UserContext: Erro do Supabase ao buscar perfil:', supabaseError);
        setError(`Erro ao carregar perfil: ${supabaseError.message}`);
        // Se não achou perfil, não temos role. 
        // Não setamos userRole, mantemos null.
        return;
      }

      if (data) {
        const profileData = data as UserProfile;
        setProfile(profileData);
        console.log('UserContext: Perfil carregado:', profileData.role);

        // Map database roles to component roles
        let mappedRole = profileData.role;
        if (mappedRole === 'criador') mappedRole = 'breeder' as UserRole;
        if (mappedRole === 'assessor') mappedRole = 'advisor' as UserRole;

        setUserRole(mappedRole);
      } else {
        console.warn('UserContext: Perfil não encontrado (dados vazios).');
        setError('Perfil de usuário não encontrado no sistema.');
      }
    } catch (err) {
      console.error('UserContext: Erro inesperado ao buscar perfil:', err);
      setError('Erro inesperado ao carregar perfil.');
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error('UserContext: Erro no login:', error);
      setError(error.message);
      return false;
    }
    return true;
  };

  const logout = async () => {
    try {
      console.log('Iniciando logout...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Erro no signOut:', error);
      } else {
        console.log('SignOut bem sucedido');
      }
    } catch (err) {
      console.error('Erro no logout:', err);
    } finally {
      // Limpeza de estado garantida
      setUser(null);
      setProfile(null);
      setUserRole(null);
      setError(null);
      console.log('Estado limpo após logout');
    }
  };

  useEffect(() => {
    let mounted = true;

    const getInitialSession = async () => {
      console.log('UserContext: Iniciando verificação de sessão...');
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout ao verificar sessão')), 5000)
        );

        const sessionPromise = supabase.auth.getSession();

        const { data } = await Promise.race([sessionPromise, timeoutPromise]) as any;
        const session = data?.session;

        if (mounted) {
          if (session?.user) {
            console.log('UserContext: Sessão encontrada para usuário', session.user.id);
            setUser(session.user);
            await fetchProfile(session.user.id);
          } else {
            console.log('UserContext: Nenhuma sessão encontrada.');
            setProfile(null);
            setUserRole(null);
          }
        }
      } catch (error: any) {
        console.error('UserContext: Erro ao verificar sessão inicial:', error);
        if (mounted) {
          // Se for timeout ou outro erro, garantimos que o usuário saiba
          setError(error.message || 'Erro de conexão ao verificar sessão.');
          // Não limpamos user/profile aqui se o objetivo é só reportar erro de conexão, mas por segurança no boot inicial:
          if (!user) { // Só limpa se ainda não tinha usuário
            setUser(null);
            setProfile(null);
            setUserRole(null);
          }
        }
      } finally {
        if (mounted) {
          console.log('UserContext: Finalizando loading inicial.');
          setIsLoading(false);
        }
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log(`UserContext: Auth change event: ${event}`);

        if (event === 'SIGNED_OUT' || !session) {
          console.log('UserContext: Limpando estado (logout/sessão inválida).');
          setUser(null);
          setProfile(null);
          setUserRole(null);
          setIsLoading(false);
        } else if (session?.user) {
          // Se o usuário mudou OU se ainda não temos profile carregado para este usuário
          if (user?.id !== session.user.id || !profile) {
            console.log('UserContext: Novo usuário detectado ou perfil pendente, carregando...');
            setUser(session.user);
            await fetchProfile(session.user.id);
          }
          setIsLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // Dependências vazias intencionais

  return (
    <UserContext.Provider value={{
      user,
      profile,
      userRole,
      userName: profile?.full_name || user?.email?.split('@')[0] || null,
      userEmail: profile?.email || user?.email || null,
      isAuthenticated: user !== null, // Mantemos simples, page.tsx trata o role null
      isLoading,
      error,
      login,
      logout,
      setUserRole,
      refreshProfile
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
