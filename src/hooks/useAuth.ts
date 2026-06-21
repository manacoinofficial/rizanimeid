import { useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadRoles = (uid: string) => {
    supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', uid)
      .then(({ data }) => {
        const roles = (data ?? []).map((r: any) => r.role);
        setIsOwner(roles.includes('owner'));
        setIsAdmin(roles.includes('admin') || roles.includes('owner'));
      });
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        setTimeout(() => loadRoles(sess.user.id), 0);
      } else {
        setIsAdmin(false);
        setIsOwner(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      setIsLoading(false);
      if (sess?.user) loadRoles(sess.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, session, isAdmin, isOwner, isLoading, signOut };
};