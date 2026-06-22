import { useEffect, useMemo, useState } from 'react';
// Navigate not needed: route is wrapped by ProtectedRoute
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, ShieldCheck, MessageSquare, Users, Eye, TrendingUp, Crown, Radio } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow, format, subDays, startOfDay } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RTooltip,
  CartesianGrid,
} from 'recharts';

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

interface Visit {
  id: string;
  path: string;
  user_id: string | null;
  created_at: string;
}

export default function Admin() {
  const { isOwner } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [roleMap, setRoleMap] = useState<Map<string, Set<string>>>(new Map());
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [liveVisits, setLiveVisits] = useState<Visit[]>([]);

  useEffect(() => {
    (async () => {
      const since = subDays(new Date(), 30).toISOString();
      const [{ data: c }, { data: p }, { data: r }, { data: v }] = await Promise.all([
        supabase.from('comments').select('*').order('created_at', { ascending: false }).limit(100),
        supabase.from('profiles').select('id,user_id,display_name,created_at').order('created_at', { ascending: false }),
        supabase.from('user_roles').select('user_id,role'),
        supabase
          .from('visits')
          .select('id,path,user_id,created_at')
          .gte('created_at', since)
          .order('created_at', { ascending: false })
          .limit(2000),
      ]);
      setComments((c ?? []) as Comment[]);
      setProfiles((p ?? []) as Profile[]);
      const map = new Map<string, Set<string>>();
      (r ?? []).forEach((row: any) => {
        const s = map.get(row.user_id) ?? new Set<string>();
        s.add(row.role);
        map.set(row.user_id, s);
      });
      setRoleMap(map);
      setVisits((v ?? []) as Visit[]);
      setLoading(false);
    })();
  }, []);

  // Realtime: prepend new visits as they happen
  useEffect(() => {
    const channel = supabase
      .channel('admin-visits')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'visits' },
        (payload) => {
          const v = payload.new as Visit;
          setLiveVisits((prev) => [v, ...prev].slice(0, 30));
          setVisits((prev) => [v, ...prev].slice(0, 3000));
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Build last-14-day visitor chart
  const chartData = useMemo(() => {
    const days: { date: string; visits: number; unique: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = startOfDay(subDays(new Date(), i));
      const next = startOfDay(subDays(new Date(), i - 1));
      const dayVisits = visits.filter(
        (x) => new Date(x.created_at) >= d && new Date(x.created_at) < next
      );
      const unique = new Set(dayVisits.map((x) => x.user_id ?? `anon-${x.id}`));
      days.push({
        date: format(d, 'd MMM'),
        visits: dayVisits.length,
        unique: unique.size,
      });
    }
    return days;
  }, [visits]);

  const totalVisits = visits.length;
  const uniqueUsers = useMemo(
    () => new Set(visits.filter((v) => v.user_id).map((v) => v.user_id!)).size,
    [visits]
  );

  const profileById = useMemo(() => {
    const m = new Map<string, Profile>();
    profiles.forEach((p) => m.set(p.user_id, p));
    return m;
  }, [profiles]);

  const recentVisitors = useMemo(() => {
    const seen = new Map<string, Visit>();
    for (const v of visits) {
      const key = v.user_id ?? `anon-${v.id}`;
      if (!seen.has(key)) seen.set(key, v);
    }
    return Array.from(seen.values()).slice(0, 30);
  }, [visits]);

  const roleLabel = (uid: string) => {
    const r = roleMap.get(uid);
    if (r?.has('owner')) return { text: 'Owner', cls: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40' };
    if (r?.has('admin')) return { text: 'Admin', cls: 'bg-primary/20 text-primary border-primary/40' };
    return { text: 'User', cls: 'bg-muted text-muted-foreground' };
  };

  const deleteComment = async (id: string) => {
    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (error) return toast.error(error.message);
    setComments((prev) => prev.filter((c) => c.id !== id));
    toast.success('Komentar dihapus');
  };

  const toggleAdmin = async (userId: string) => {
    const roles = roleMap.get(userId) ?? new Set<string>();
    if (roles.has('owner') && !isOwner) {
      return toast.error('Hanya Owner yang bisa mengubah role Owner');
    }
    if (roles.has('admin')) {
      const { error } = await supabase.from('user_roles').delete().eq('user_id', userId).eq('role', 'admin');
      if (error) return toast.error(error.message);
      setRoleMap((prev) => {
        const m = new Map(prev);
        const s = new Set(m.get(userId) ?? []);
        s.delete('admin');
        m.set(userId, s);
        return m;
      });
      toast.success('Role admin dicabut');
    } else {
      const { error } = await supabase.from('user_roles').insert({ user_id: userId, role: 'admin' });
      if (error) return toast.error(error.message);
      setRoleMap((prev) => {
        const m = new Map(prev);
        const s = new Set(m.get(userId) ?? []);
        s.add('admin');
        m.set(userId, s);
        return m;
      });
      toast.success('User dipromote jadi admin');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center gap-3 mb-8">
        <ShieldCheck className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold leading-tight">Admin Panel</h1>
          {isOwner && (
            <span className="inline-flex items-center gap-1 text-xs text-yellow-400">
              <Crown className="h-3 w-3" /> Owner Access
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/15"><Eye className="h-5 w-5 text-primary" /></div>
                <div><div className="text-2xl font-bold">{totalVisits}</div><div className="text-xs text-muted-foreground">Total kunjungan (30 hari)</div></div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/15"><Users className="h-5 w-5 text-primary" /></div>
                <div><div className="text-2xl font-bold">{uniqueUsers}</div><div className="text-xs text-muted-foreground">User unik login</div></div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/15"><MessageSquare className="h-5 w-5 text-primary" /></div>
                <div><div className="text-2xl font-bold">{comments.length}</div><div className="text-xs text-muted-foreground">Komentar</div></div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/15"><TrendingUp className="h-5 w-5 text-primary" /></div>
                <div><div className="text-2xl font-bold">{profiles.length}</div><div className="text-xs text-muted-foreground">Total user terdaftar</div></div>
              </CardContent>
            </Card>
          </div>

          {/* Visitors chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-5 w-5" /> Pengunjung 14 Hari Terakhir
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gVisits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gUnique" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} allowDecimals={false} />
                    <RTooltip
                      contentStyle={{
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Area type="monotone" dataKey="visits" name="Kunjungan" stroke="hsl(var(--primary))" fill="url(#gVisits)" strokeWidth={2} />
                    <Area type="monotone" dataKey="unique" name="Unik" stroke="#f59e0b" fill="url(#gUnique)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent visitors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <Radio className="h-4 w-4 text-emerald-500" /> Live ({liveVisits.length}) ·
                  <Eye className="h-5 w-5" /> Pengunjung Terbaru ({recentVisitors.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[480px] overflow-y-auto">
                  {liveVisits.map((v) => {
                    const p = v.user_id ? profileById.get(v.user_id) : null;
                    const name = p?.display_name || (v.user_id ? 'User' : 'Tamu (anonim)');
                    return (
                      <div key={`live-${v.id}`} className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate flex items-center gap-2">
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {name}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">{v.path}</div>
                        </div>
                        <div className="text-[10px] uppercase tracking-wide text-emerald-500 shrink-0">LIVE</div>
                      </div>
                    );
                  })}
                  {recentVisitors.map((v) => {
                    const p = v.user_id ? profileById.get(v.user_id) : null;
                    const name = p?.display_name || (v.user_id ? 'User' : 'Tamu (anonim)');
                    return (
                      <div key={v.id} className="p-2.5 rounded-lg bg-secondary/40 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{name}</div>
                          <div className="text-xs text-muted-foreground truncate">{v.path}</div>
                        </div>
                        <div className="text-xs text-muted-foreground shrink-0">
                          {formatDistanceToNow(new Date(v.created_at), { addSuffix: true })}
                        </div>
                      </div>
                    );
                  })}
                  {recentVisitors.length === 0 && (
                    <p className="text-center text-muted-foreground py-8 text-sm">Belum ada data kunjungan</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Users */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><Users className="h-5 w-5" />Users ({profiles.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[480px] overflow-y-auto">
                  {profiles.map((p) => {
                    const label = roleLabel(p.user_id);
                    return (
                      <div key={p.id} className="p-2.5 rounded-lg bg-secondary/40 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-medium truncate flex items-center gap-2">
                            {p.display_name || 'Unnamed'}
                            <Badge variant="outline" className={`text-[10px] py-0 ${label.cls}`}>{label.text}</Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(p.created_at), { addSuffix: true })}
                          </div>
                        </div>
                        {!roleMap.get(p.user_id)?.has('owner') && (
                          <Button size="sm" variant={roleMap.get(p.user_id)?.has('admin') ? 'destructive' : 'default'} onClick={() => toggleAdmin(p.user_id)}>
                            {roleMap.get(p.user_id)?.has('admin') ? 'Cabut' : 'Admin'}
                          </Button>
                        )}
                      </div>
                    );
                  })}
                  {profiles.length === 0 && <p className="text-center text-muted-foreground py-8 text-sm">Belum ada user</p>}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Comments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><MessageSquare className="h-5 w-5" />Komentar ({comments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
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
                {comments.length === 0 && <p className="text-center text-muted-foreground py-8 text-sm">Belum ada komentar</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}