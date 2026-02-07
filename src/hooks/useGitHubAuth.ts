import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

interface GitHubUser {
  id: string;
  username: string;
  avatar: string;
}

export const useGitHubAuth = () => {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const meta = session.user.user_metadata;
          setUser({
            id: session.user.id,
            username: meta?.user_name || meta?.preferred_username || 'User',
            avatar: meta?.avatar_url || '',
          });
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const meta = session.user.user_metadata;
        setUser({
          id: session.user.id,
          username: meta?.user_name || meta?.preferred_username || 'User',
          avatar: meta?.avatar_url || '',
        });
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGitHub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.href,
      },
    });
    if (error) {
      console.error('GitHub sign in error:', error);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return { user, isLoading, signInWithGitHub, signOut };
};
