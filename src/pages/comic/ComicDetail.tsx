import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { comicApi } from '@/lib/comicApi';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Star, BookOpen, User, Palette, Calendar, Clock, Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { useReadingHistory } from '@/hooks/useReadingHistory';
import { Comments } from '@/components/Comments';

const ComicDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { getLastRead } = useReadingHistory();

  const { data, isLoading } = useQuery({
    queryKey: ['comic-detail', slug],
    queryFn: () => comicApi.getDetail(slug!),
    enabled: !!slug,
  });

  if (isLoading) return <LoadingSkeleton />;

  const detail = data?.detail;
  if (!detail) return <div className="container mx-auto px-4 py-8">Comic not found</div>;

  const isCurrentFavorite = isFavorite('comic', slug!);
  const lastRead = getLastRead('comic', slug!);

  const handleFavoriteClick = () => {
    toggleFavorite({
      type: 'comic',
      slug: slug!,
      title: detail.title,
      cover: detail.cover,
      rating: detail.rating,
      status: detail.status,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={detail.cover}
          alt={detail.title}
          className="w-full h-full object-cover blur-sm scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Cover Image */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <Card className="overflow-hidden w-48 shadow-2xl">
              <img
                src={detail.cover}
                alt={detail.title}
                className="w-full aspect-[3/4] object-cover"
              />
            </Card>
          </div>

          {/* Info Section */}
          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl md:text-4xl font-bold">{detail.title}</h1>
              <Button
                variant={isCurrentFavorite ? "default" : "outline"}
                size="icon"
                onClick={handleFavoriteClick}
                className="flex-shrink-0"
              >
                <Heart className={`h-5 w-5 ${isCurrentFavorite ? 'fill-current' : ''}`} />
              </Button>
            </div>
            
            {detail.otherTitle && (
              <p className="text-sm text-muted-foreground">{detail.otherTitle}</p>
            )}

            <div className="flex flex-wrap gap-2">
              {detail.rating && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {detail.rating}
                </Badge>
              )}
              {detail.status && (
                <Badge variant={detail.status === 'Berjalan' ? 'default' : 'secondary'}>
                  {detail.status}
                </Badge>
              )}
              {detail.type && (
                <Badge variant="outline">{detail.type}</Badge>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              {detail.author && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Author:</span>
                  <span>{detail.author}</span>
                </div>
              )}
              {detail.artist && (
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Artist:</span>
                  <span>{detail.artist}</span>
                </div>
              )}
              {detail.release && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Release:</span>
                  <span>{detail.release}</span>
                </div>
              )}
              {detail.reader && (
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Readers:</span>
                  <span>{detail.reader}</span>
                </div>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {detail.genres?.map((genre: { title: string; slug: string }) => (
                <Link key={genre.slug} to={`/comic/bacakomik/genre/${genre.slug}`}>
                  <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors">
                    {genre.title}
                  </Badge>
                </Link>
              ))}
            </div>

            {/* Continue Reading Button */}
            {lastRead?.lastChapterSlug && (
              <Link to={`/comic/bacakomik/chapter/${lastRead.lastChapterSlug}`}>
                <Button variant="secondary" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  Continue: {lastRead.lastChapter}
                </Button>
              </Link>
            )}
          </div>
        </div>
        {/* Synopsis */}
        {detail.synopsis && (
          <Card className="mt-8">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-3">Synopsis</h2>
              <p className="text-muted-foreground leading-relaxed">{detail.synopsis}</p>
            </CardContent>
          </Card>
        )}

        {/* Chapters */}
        <Card className="mt-6 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Chapters ({detail.chapters?.length || 0})
              </h2>
            </div>
            <ScrollArea className="h-96">
              <div className="space-y-2">
                {detail.chapters?.map((chapter: { title: string; slug: string; date: string }) => (
                  <Link
                    key={chapter.slug}
                    to={`/comic/bacakomik/chapter/${chapter.slug}`}
                    className="block"
                  >
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                      <span className="font-medium">
                        {chapter.title || chapter.slug.replace(/-/g, ' ')}
                      </span>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {chapter.date}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Comments contentType="comic" contentSlug={slug!} />
      </div>
    </div>
  );
};

export default ComicDetail;
