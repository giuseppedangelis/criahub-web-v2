'use client'

import { createContext, useContext, useState, ReactNode, useEffect, useRef, useMemo, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { normalizeRole } from '@/lib/roles';

// Roles mantidos conforme o banco: admin, criador, assessor e equipe
export type UserRole =
  | 'admin'
  | 'criador'
  | 'assessor'
  | 'veterinario'
  | 'peao'
  | 'funcionario';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
  haras_id: string | null;
  phone: string | null;
}

interface UserContextType {
  user: User | null;
  profile: UserProfile | null;
  stableHarasId: string | null;
  userRole: UserRole | null;
  userName: string | null;
  userEmail: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSessionReady: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setUserRole: (role: UserRole) => void;
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

function mapProfileRoleToUserRole(role?: string | null): UserRole | null {
  const normalized = normalizeRole(role);
  return normalized === 'unknown' ? null : normalized;
}

function isInvalidRefreshTokenError(error: unknown): boolean {
  const message = getErrorMessage(error, '');
  return (
    message.includes('Invalid Refresh Token')
    || message.includes('Refresh Token Not Found')
  );
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === 'string' && error.trim()) {
    return error;
  }

  return fallback;
}

export function UserProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stableHarasId, setStableHarasId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSessionReady, setIsSessionReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ref to track which user profile is currently being fetched to prevent duplicates
  const fetchingForUserId = useRef<string | null>(null);
  const lastUserIdRef = useRef<string | null>(null);
  const profileRef = useRef<UserProfile | null>(null);

  const applyProfileState = useCallback((profileData: UserProfile | null) => {
    profileRef.current = profileData;
    setProfile(profileData);
    setUserRole(mapProfileRoleToUserRole(profileData?.role) || null);
    setStableHarasId(profileData?.haras_id || null);
  }, []);

  const fetchProfile = useCallback(async (userId: string) => {
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
          applyProfileState(cachedProfile);
          if (cachedProfile) {
            // Stop loading immediately if we found cache
            setIsLoading(false);
          }
        }
      }
    } catch {
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

      const result = await Promise.race([queryPromise, queryTimeout]) as Awaited<typeof queryPromise>;
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
        const profileData: UserProfile = {
          id: data.id,
          email: data.email,
          full_name: data.full_name,
          avatar_url: data.avatar_url,
          role: data.role,
          haras_id: data.haras_id,
          phone: data.phone,
        };

        // Update state and cache
        applyProfileState(profileData);
        if (typeof window !== 'undefined') {
          localStorage.setItem(cacheKey, JSON.stringify(profileData));
        }
      } else {
        if (!cachedProfile) {
          setError('Perfil de usuário não encontrado no sistema.');
        }
      }
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, 'Erro inesperado ao carregar perfil.');
      const isTimeout = errorMessage.includes('Timeout');

      // If we have cache, don't block the user with an error
      if (!cachedProfile) {
        // If it's a timeout, show a friendlier message
        const userMsg = isTimeout
          ? 'A conexão com o banco de dados está lenta. Tente recarregar.'
          : errorMessage;
        setError(userMsg);
      }
    } finally {
      fetchingForUserId.current = null; // Release the lock
    }
  }, [applyProfileState, supabase]);

  const refreshProfile = useCallback(async () => {
    const currentUserId = lastUserIdRef.current ?? user?.id;
    if (currentUserId) {
      await fetchProfile(currentUserId);
    }
  }, [fetchProfile, user?.id]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
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
  }, [supabase]);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // Error ignored
    } finally {
      setUser(null);
      applyProfileState(null);
      setError(null);
      lastUserIdRef.current = null;
    }
  }, [applyProfileState, supabase]);

  useEffect(() => {
    let mounted = true;

    const getInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        const session = data?.session;

        if (mounted) {
          if (session?.user) {
            if (lastUserIdRef.current && lastUserIdRef.current !== session.user.id) {
              setProfile(null);
              setUserRole(null);
              setStableHarasId(null);
            }
            lastUserIdRef.current = session.user.id;

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
            applyProfileState(null);
            lastUserIdRef.current = null;
          }
        }
      } catch (error: unknown) {
        if (mounted) {
          if (isInvalidRefreshTokenError(error)) {
            try {
              await supabase.auth.signOut();
            } catch {
              // Error ignored
            } finally {
              setUser(null);
              applyProfileState(null);
              setError(null);
              fetchingForUserId.current = null;
              lastUserIdRef.current = null;
            }
            return;
          }

          // Do not forcefully clear user here to avoid race with onAuthStateChange success
          // Only set error if we truly end up with no user
          setUser((currentUser) => {
            if (!currentUser) setError(getErrorMessage(error, 'Erro ao verificar sessão.'));
            return currentUser;
          });
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
          setIsSessionReady(true);
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
            applyProfileState(null);
            setIsLoading(false);
            setIsSessionReady(true);
            setError(null);
          }
          fetchingForUserId.current = null;
          lastUserIdRef.current = null;
        } else if (session?.user) {
          if (lastUserIdRef.current && lastUserIdRef.current !== session.user.id) {
            applyProfileState(null);
          }
          lastUserIdRef.current = session.user.id;

          setUser((curr) => {
            // Avoid re-render if same user
            if (curr?.id === session.user.id) return curr;
            return session.user;
          });

          // Determine if we need to fetch profile:
          // 1. If we have no profile OR profile ID doesn't match current user
          // 2. AND we are not locked on fetching this ID
          const currentProfile = profileRef.current;
          if ((!currentProfile || currentProfile.id !== session.user.id) && fetchingForUserId.current !== session.user.id) {
            try {
              await fetchProfile(session.user.id);
            } finally {
              if (mounted) {
                setIsLoading(false);
                setIsSessionReady(true);
              }
            }
          } else {
            // User exists, profile exists or is fetching => stop loading
            if (mounted) {
              setIsLoading(false);
              setIsSessionReady(true);
            }
          }
        } else if (event === 'INITIAL_SESSION' && !session) {
          // Initial session returned nothing -> stop loading
          if (mounted) {
            setIsLoading(false);
            setIsSessionReady(true);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [applyProfileState, fetchProfile, supabase]);

  return (
    <UserContext.Provider value={{
      user,
      profile,
      stableHarasId,
      userRole,
      userName: profile?.full_name || user?.email?.split('@')[0] || null,
      userEmail: profile?.email || user?.email || null,
      isAuthenticated: user !== null, // Mantemos simples, page.tsx trata o role null
      isLoading,
      isSessionReady,
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
