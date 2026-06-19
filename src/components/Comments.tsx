import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, Send, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  content: string;
  display_name: string | null;
  avatar_url: string | null;
  github_username: string | null;
  github_avatar: string | null;
  created_at: string;
  user_id: string;
}

interface CommentsProps {
  contentType: string;
  contentSlug: string;
}

export const Comments = ({ contentType, contentSlug }: CommentsProps) => {
  const { user, signOut } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ||
    user?.email?.split('@')[0] ||
    'User';
  const avatarUrl = (user?.user_metadata?.avatar_url as string | undefined) || null;

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentType, contentSlug]);

  const fetchComments = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('content_type', contentType)
      .eq('content_slug', contentSlug)
      .order('created_at', { ascending: false });
    if (!error) setComments((data ?? []) as Comment[]);
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    if (!newComment.trim() || !user) return;
    setIsSubmitting(true);
    const { error } = await supabase.from('comments').insert({
      content_type: contentType,
      content_slug: contentSlug,
      user_id: user.id,
      display_name: displayName,
      avatar_url: avatarUrl,
      content: newComment.trim().slice(0, 1000),
    });
    setIsSubmitting(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    setNewComment('');
    fetchComments();
    toast({ title: 'Komentar berhasil ditambahkan!' });
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    setComments((prev) => prev.filter((c) => c.id !== id));
    toast({ title: 'Komentar dihapus' });
  };

  const nameOf = (c: Comment) => c.display_name || c.github_username || 'User';
  const avatarOf = (c: Comment) => c.avatar_url || c.github_avatar || '';

  return (
    <section className="mt-8 border-t pt-8">
      <h3 className="text-xl font-bold mb-6 text-foreground">Komentar</h3>

      {!user ? (
        <div className="bg-secondary/60 border rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">Login untuk meninggalkan komentar.</p>
          <Button asChild size="sm" className="gap-2">
            <Link to="/auth">
              <LogIn className="h-4 w-4" />
              Login / Daftar
            </Link>
          </Button>
        </div>
      ) : (
        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              {avatarUrl && <AvatarImage src={avatarUrl} />}
              <AvatarFallback>{displayName[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-foreground">{displayName}</span>
            <Button variant="ghost" size="sm" onClick={signOut} className="ml-auto text-xs">
              Logout
            </Button>
          </div>
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Tulis komentar..."
            rows={3}
            maxLength={1000}
            className="resize-none"
          />
          <Button onClick={handleSubmit} disabled={!newComment.trim() || isSubmitting} size="sm" className="gap-2">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Kirim
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex gap-3">
              <div className="h-8 w-8 bg-muted rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-24" />
                <div className="h-16 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-muted-foreground text-center py-8 text-sm">
          Belum ada komentar. Jadilah yang pertama!
        </p>
      ) : (
        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3 p-4 bg-secondary/40 border rounded-xl">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={avatarOf(c)} />
                <AvatarFallback>{nameOf(c)[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm text-foreground">{nameOf(c)}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}
                  </span>
                  {user?.id === c.user_id && (
                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto" onClick={() => handleDelete(c.id)}>
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  )}
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap break-words">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};