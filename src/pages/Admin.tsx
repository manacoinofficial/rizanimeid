import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, ShieldCheck, MessageSquare, Users } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  content: string;
  content_type: string;
  content_slug: string;
  created_at: string;
  display_name: string | null;
  github_username: string | null;
}

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  created_at: string;
}

export default function Admin() {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [adminIds, setAdminIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      const [{ data: c }, { data: p }, { data: r }] = await Promise.all([
        supabase.from('comments').select('*').order('created_at', { ascending: false }).limit(100),
        supabase.from('profiles').select('id,user_id,display_name,created_at').order('created_at', { ascending: false }),
        supabase.from('user_roles').select('user_id').eq('role', 'admin'),
      ]);
      setComments((c ?? []) as Comment[]);
      setProfiles((p ?? []) as Profile[]);
      setAdminIds(new Set((r ?? []).map((x: any) => x.user_id)));
      setLoading(false);
    })();
  }, [isAdmin]);

  if (authLoading) {
    return <div className="container mx-auto py-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-2">Akses Ditolak</h1>
        <p className="text-muted-foreground">Halaman ini hanya untuk admin.</p>
      </div>
    );
  }

  const deleteComment = async (id: string) => {
    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (error) return toast.error(error.message);
    setComments((prev) => prev.filter((c) => c.id !== id));
    toast.success('Komentar dihapus');
  };

  const toggleAdmin = async (userId: string) => {
    if (adminIds.has(userId)) {
      const { error } = await supabase.from('user_roles').delete().eq('user_id', userId).eq('role', 'admin');
      if (error) return toast.error(error.message);
      setAdminIds((prev) => { const s = new Set(prev); s.delete(userId); return s; });
      toast.success('Role admin dicabut');
    } else {
      const { error } = await supabase.from('user_roles').insert({ user_id: userId, role: 'admin' });
      if (error) return toast.error(error.message);
      setAdminIds((prev) => new Set(prev).add(userId));
      toast.success('User dipromote jadi admin');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center gap-3 mb-8">
        <ShieldCheck className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Admin Panel</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5" />Komentar ({comments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {comments.map((c) => (
                  <div key={c.id} className="p-3 rounded-lg bg-secondary/40 flex gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-muted-foreground mb-1">
                        <span className="font-medium text-foreground">{c.display_name || c.github_username || 'User'}</span>
                        {' · '}{c.content_type}/{c.content_slug}{' · '}
                        {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}
                      </div>
                      <p className="text-sm break-words">{c.content}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteComment(c.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                {comments.length === 0 && <p className="text-center text-muted-foreground py-8">Belum ada komentar</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Users ({profiles.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {profiles.map((p) => (
                  <div key={p.id} className="p-3 rounded-lg bg-secondary/40 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{p.display_name || 'Unnamed'}</div>
                      <div className="text-xs text-muted-foreground">
                        {adminIds.has(p.user_id) ? '👑 Admin' : 'User'} · {formatDistanceToNow(new Date(p.created_at), { addSuffix: true })}
                      </div>
                    </div>
                    <Button size="sm" variant={adminIds.has(p.user_id) ? 'destructive' : 'default'} onClick={() => toggleAdmin(p.user_id)}>
                      {adminIds.has(p.user_id) ? 'Cabut Admin' : 'Jadikan Admin'}
                    </Button>
                  </div>
                ))}
                {profiles.length === 0 && <p className="text-center text-muted-foreground py-8">Belum ada user</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}