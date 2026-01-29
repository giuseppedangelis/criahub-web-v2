'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

// Roles mantidos conforme o banco: admin, criador, assessor
// 'breeder' e 'advisor' são aliases para compatibilidade com código existente
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
  userRole: UserRole;
  userName: string | null;
  userEmail: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
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
  const [userRole, setUserRole] = useState<UserRole>('criador');
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, avatar_url, role, haras_id, phone')
      .eq('id', userId)
      .single();

    if (!error && data) {
      const profileData = data as UserProfile;
      setProfile(profileData);

      // Map database roles to component roles
      let mappedRole = profileData.role;
      if (mappedRole === 'criador') mappedRole = 'breeder' as UserRole;
      if (mappedRole === 'assessor') mappedRole = 'advisor' as UserRole;

      setUserRole(mappedRole);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return !error;
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
      setUser(null);
      setProfile(null);
      setUserRole('criador');
      console.log('Estado limpo após logout');
    } catch (err) {
      console.error('Erro no logout:', err);
    }
  };

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      }

      setIsLoading(false);
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{
      user,
      profile,
      userRole,
      userName: profile?.full_name || user?.email?.split('@')[0] || null,
      userEmail: profile?.email || user?.email || null,
      isAuthenticated: user !== null,
      isLoading,
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
