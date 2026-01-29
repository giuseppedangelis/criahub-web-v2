'use client'

import { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
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

  // Ref to track which user profile is currently being fetched to prevent duplicates
  const fetchingForUserId = useRef<string | null>(null);

  const fetchProfile = async (userId: string) => {
    // If we are already fetching for this exact user, skip
    if (fetchingForUserId.current === userId) {
      return;
    }

    fetchingForUserId.current = userId;
    setError(null);

    // SWR Pattern: Try to load from cache first for instant UX
    const cacheKey = `criahub_profile_${userId}`;
    let cachedProfile: UserProfile | null = null;

    try {
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          cachedProfile = JSON.parse(cached);
          setProfile(cachedProfile);

          if (cachedProfile) {
            let mappedRole = cachedProfile.role;
            if (mappedRole === 'criador') mappedRole = 'breeder' as UserRole;
            if (mappedRole === 'assessor') mappedRole = 'advisor' as UserRole;
            setUserRole(mappedRole);
            // Stop loading immediately if we found cache
            setIsLoading(false);
          }
        }
      }
    } catch (e) {
      // Cache read error ignored
    }

    try {

      // Create a specific timeout for the query - Increased to 15s
      const queryTimeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout ao buscar perfil no banco de dados')), 15000)
      );

      const queryPromise = supabase
        .from('profiles')
        .select('id, email, full_name, avatar_url, role, haras_id, phone')
        .eq('id', userId)
        .maybeSingle();

      const result = await Promise.race([queryPromise, queryTimeout]) as any;
      const { data, error: supabaseError } = result;

      if (supabaseError) {
        // If we have cached data, we can accept the error silently
        if (cachedProfile) {
          // Using cached data
        } else {
          setError(`Erro ao carregar perfil: ${supabaseError.message}`);
        }
        return;
      }

      if (data) {
        const profileData = data as UserProfile;

        // Update state and cache
        setProfile(profileData);
        if (typeof window !== 'undefined') {
          localStorage.setItem(cacheKey, JSON.stringify(profileData));
        }

        // Map database roles to component roles
        let mappedRole = profileData.role;
        if (mappedRole === 'criador') mappedRole = 'breeder' as UserRole;
        if (mappedRole === 'assessor') mappedRole = 'advisor' as UserRole;

        setUserRole(mappedRole);
      } else {
        if (!cachedProfile) {
          setError('Perfil de usuário não encontrado no sistema.');
        }
      }
    } catch (err: any) {
      const isTimeout = err.message?.includes('Timeout');

      // If we have cache, don't block the user with an error
      if (!cachedProfile) {
        // If it's a timeout, show a friendlier message
        const userMsg = isTimeout
          ? 'A conexão com o banco de dados está lenta. Tente recarregar.'
          : (err.message || 'Erro inesperado ao carregar perfil.');
        setError(userMsg);
      }
    } finally {
      fetchingForUserId.current = null; // Release the lock
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
      setError(error.message);
      return false;
    }
    return true;
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      // Error ignored
    } finally {
      setUser(null);
      setProfile(null);
      setUserRole(null);
      setError(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    const getInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        const session = data?.session;

        if (mounted) {
          if (session?.user) {
            // Use functional update to avoid stale closure issues
            setUser((currentUser) => {
              if (currentUser?.id === session.user.id) return currentUser;
              return session.user;
            });

            // Should verify if we need to fetch profile or if onAuthStateChange will handle it
            // We'll optimistically fetch if we don't have it yet 
            // (Note: we can't easily check 'profile' state here due to closure, so we just call it. 
            // fetchProfile manages its own state updates)
            await fetchProfile(session.user.id);
          } else {
            // Only explicitly clear if we are sure we are logged out
            setUser((currentUser) => {
              if (currentUser) return null;
              return currentUser;
            });
            setProfile(null);
            setUserRole(null);
          }
        }
      } catch (error: any) {
        if (mounted) {
          // Do not forcefully clear user here to avoid race with onAuthStateChange success
          // Only set error if we truly end up with no user
          setUser((currentUser) => {
            if (!currentUser) setError(error.message || 'Erro ao verificar sessão.');
            return currentUser;
          });
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (event === 'SIGNED_OUT') {
          if (mounted) {
            setUser(null);
            setProfile(null);
            setUserRole(null);
            setIsLoading(false);
          }
          fetchingForUserId.current = null;
        } else if (session?.user) {
          setUser((curr) => {
            // Avoid re-render if same user
            if (curr?.id === session.user.id) return curr;
            return session.user;
          });

          // Determine if we need to fetch profile:
          // 1. If we have no profile OR profile ID doesn't match current user
          // 2. AND we are not locked on fetching this ID
          if ((!profile || profile.id !== session.user.id) && fetchingForUserId.current !== session.user.id) {
            try {
              await fetchProfile(session.user.id);
            } finally {
              if (mounted) setIsLoading(false);
            }
          } else {
            // User exists, profile exists or is fetching => stop loading
            if (mounted) setIsLoading(false);
          }
        } else if (event === 'INITIAL_SESSION' && !session) {
          // Initial session returned nothing -> stop loading
          if (mounted) setIsLoading(false);
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
