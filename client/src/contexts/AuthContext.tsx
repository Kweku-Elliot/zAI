import React, { createContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      setUser(currentUser ?? null);
      if (currentUser) await loadProfile(currentUser.id);
      setLoading(false);
    })();

  const { data: sub } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) loadProfile(u.id);
      else setProfile(null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const loadProfile = async (id: string) => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
      if (!error) setProfile(data);
  } catch (err) {
      void err; // ignore error
    }
  };

  const signIn = async (email: string, password: string) => {
    setAuthLoading(true);
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
        // options: { expiresIn: 2592000 } // 30 days
      });
      if (error) throw error;
      if (user) await loadProfile(user.id);
      return { user };
    } finally {
      setAuthLoading(false);
    }
  };

  const signUp = async (full_name: string, email: string, password: string) => {
    setAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name } },
      });
      if (error) throw error;
      const userId = data?.user?.id ?? null;
      if (userId) {
        const profile = {
          id: userId,
          full_name,
          email,
          plan: 'free',
          created_at: new Date().toISOString(),
        };
        await supabase.from('profiles').upsert(profile);
        setProfile(profile);
      }
      return { data };
    } finally {
      setAuthLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, authLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
