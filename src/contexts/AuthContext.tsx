import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // MOCK AUTHENTICATION MODE
  // Set this to true to bypass Supabase and use fake authentication
  const MOCK_MODE = true;

  useEffect(() => {
    // Debug Supabase URL
    console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
    console.log("AuthContext: Mock Mode is", MOCK_MODE ? "ENABLED" : "DISABLED");

    if (MOCK_MODE) {
      // Check for mock session in localStorage
      const mockSessionStr = localStorage.getItem('mock_session');
      if (mockSessionStr) {
        const mockSession = JSON.parse(mockSessionStr);
        setSession(mockSession);
        setUser(mockSession.user);
      }
      setLoading(false);
      return;
    }

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("AuthContext: Auth state changed", _event, session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("AuthContext: Initial session check", session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch(err => {
      console.error("AuthContext: Error getting session", err);
      // Fallback to mock if session check fails and we want to be linient? 
      // For now, respect MOCK_MODE flag only.
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName?: string) => {
    console.log("AuthContext: Attempting signUp", { email, password, displayName });

    if (MOCK_MODE) {
      return new Promise<{ error: Error | null }>((resolve) => {
        setTimeout(() => {
          console.log("AuthContext: MOCK signUp success");
          const mockUser = {
            id: 'mock-user-id-' + Math.random(),
            email: email,
            aud: 'authenticated',
            role: 'authenticated',
            created_at: new Date().toISOString(),
            app_metadata: { provider: 'email' },
            user_metadata: { display_name: displayName }
          } as User;

          const mockSession = {
            access_token: 'mock-access-token',
            refresh_token: 'mock-refresh-token',
            expires_in: 3600,
            token_type: 'bearer',
            user: mockUser
          } as Session;

          localStorage.setItem('mock_session', JSON.stringify(mockSession));
          setSession(mockSession);
          setUser(mockUser);
          resolve({ error: null });
        }, 1000);
      });
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            display_name: displayName,
          },
        },
      });
      if (error) {
        console.error("AuthContext: signUp error", error.message, error);
        return { error };
      }
      console.log("AuthContext: signUp success", data.user?.email);
      return { error: null };
    } catch (e) {
      console.error("AuthContext: signUp unexpected error", e);
      return { error: e as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log("AuthContext: Attempting signIn", { email, password });

    if (MOCK_MODE) {
      return new Promise<{ error: Error | null }>((resolve) => {
        setTimeout(() => {
          console.log("AuthContext: MOCK signIn success");
          const mockUser = {
            id: 'mock-user-id-123',
            email: email,
            aud: 'authenticated',
            role: 'authenticated',
            created_at: new Date().toISOString(),
            app_metadata: { provider: 'email' },
            user_metadata: { display_name: 'Mock User' }
          } as User;

          const mockSession = {
            access_token: 'mock-access-token',
            refresh_token: 'mock-refresh-token',
            expires_in: 3600,
            token_type: 'bearer',
            user: mockUser
          } as Session;

          localStorage.setItem('mock_session', JSON.stringify(mockSession));
          setSession(mockSession);
          setUser(mockUser);
          resolve({ error: null });
        }, 1000);
      });
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error("AuthContext: signIn error", error.message, error);
        return { error };
      }
      console.log("AuthContext: signIn success", data.user?.email);
      return { error: null };
    } catch (e) {
      console.error("AuthContext: signIn unexpected error", e);
      return { error: e as Error };
    }
  };

  const signOut = async () => {
    console.log("AuthContext: Attempting signOut");
    if (MOCK_MODE) {
      localStorage.removeItem('mock_session');
      setSession(null);
      setUser(null);
      return;
    }
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
