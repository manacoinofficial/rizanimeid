import { useState, useEffect } from 'react';
import { Github, Send, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useGitHubAuth } from '@/hooks/useGitHubAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  content: string;
  github_username: string;
  github_avatar: string | null;
  created_at: string;
  user_id: string;
}

interface CommentsProps {
  contentType: string;
  contentSlug: string;
}

export const Comments = ({ contentType, contentSlug }: CommentsProps) => {
  const { user, isLoading: authLoading, signInWithGitHub, signOut } = useGitHubAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();
  }, [contentType, contentSlug]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('content_type', contentType)
        .eq('content_slug', contentSlug)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!newComment.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('comments').insert({
        content_type: contentType,
        content_slug: contentSlug,
        user_id: user.id,
        github_username: user.username,
        github_avatar: user.avatar,
        content: newComment.trim(),
      });

      if (error) throw error;

      setNewComment('');
      fetchComments();
      toast({ title: 'Komentar berhasil ditambahkan!' });
    } catch (error: any) {
      toast({ 
        title: 'Error', 
        description: error.message,
        variant: 'destructive' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
      
      setComments(prev => prev.filter(c => c.id !== commentId));
      toast({ title: 'Komentar dihapus' });
    } catch (error: any) {
      toast({ 
        title: 'Error', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  };

  return (
    <div className="mt-8 border-t pt-8">
      <h3 className="text-xl font-bold mb-6">Komentar</h3>

      {/* Auth Section */}
      {!authLoading && !user && (
        <div className="bg-secondary/50 rounded-lg p-4 mb-6 flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            Login dengan GitHub untuk berkomentar
          </p>
          <Button onClick={signInWithGitHub} size="sm" className="gap-2">
            <Github className="h-4 w-4" />
            Login GitHub
          </Button>
        </div>
      )}

      {/* Comment Form */}
      {user && (
        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{user.username}</span>
            <Button variant="ghost" size="sm" onClick={signOut} className="ml-auto text-xs">
              Logout
            </Button>
          </div>
          <Textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Tulis komentar..."
            rows={3}
            className="resize-none"
          />
          <Button 
            onClick={handleSubmit} 
            disabled={!newComment.trim() || isSubmitting}
            size="sm"
            className="gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Kirim
          </Button>
        </div>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
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
        <p className="text-muted-foreground text-center py-8">
          Belum ada komentar. Jadilah yang pertama!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="flex gap-3 p-4 bg-secondary/30 rounded-lg">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.github_avatar || ''} />
                <AvatarFallback>{comment.github_username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{comment.github_username}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </span>
                  {user?.id === comment.user_id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 ml-auto"
                      onClick={() => handleDelete(comment.id)}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  )}
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
