'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import type { Profile } from '@/lib/supabase';

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  role: 'admin' | 'customer' | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  role: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(
    async (userId: string) => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      setProfile(data ?? null);
    },
    [supabase],
  );

  useEffect(() => {
    // Grab the initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) fetchProfile(user.id).finally(() => setLoading(false));
      else setLoading(false);
    });

    // Subscribe to auth changes (login / logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      if (nextUser) {
        fetchProfile(nextUser.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, fetchProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, [supabase]);

  const role = profile?.role ?? null;

  return (
    <AuthContext.Provider value={{ user, profile, role, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
