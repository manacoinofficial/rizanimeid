import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { mangasusukuApi, getCover, getSynopsis, getChapters } from '@/lib/mangasusukuApi';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart, BookOpen, Star, User, Palette, History } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { useReadingHistory } from '@/hooks/useReadingHistory';

const MangasusukuDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { getLastRead } = useReadingHistory();

  const { data: response, isLoading } = useQuery({
    queryKey: ['mangasusuku-detail', slug],
    queryFn: () => mangasusukuApi.getDetail(slug!),
    enabled: !!slug,
  });

  // API returns data at top level (title, image, synopsis, chapters)
  const rawDetail = response?.title ? response : response?.data;
  const detail = rawDetail as any;
  const cover = detail?.image || detail?.cover || '/placeholder.svg';
  const synopsis = detail?.synopsis || detail?.description || '';
  const chapters = detail?.chapters || [];

  const handleFavoriteClick = () => {
    if (detail) {
      toggleFavorite({
        slug: slug!,
        title: detail.title || 'Unknown',
        cover: cover,
        type: 'mangasusuku',
      });
    }
  };

  if (isLoading) return <LoadingSkeleton />;
  if (!detail) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Manga Not Found</h1>
        <Link to="/mangasusuku">
          <Button>Back to Mangasusuku</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${cover})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Cover */}
          <div className="shrink-0">
            <img
              src={cover}
              alt={detail.title || 'Manga Cover'}
              className="w-48 h-72 object-cover rounded-lg shadow-xl mx-auto md:mx-0"
              onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
            />
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold">{detail.title || 'Unknown Title'}</h1>
            {detail.alternativeTitle && (
              <p className="text-muted-foreground">{detail.alternativeTitle}</p>
            )}

            <div className="flex flex-wrap gap-2">
              {detail.rating && (
                <Badge variant="secondary" className="gap-1">
                  <Star className="h-3 w-3" /> {detail.rating}
                </Badge>
              )}
              {detail.status && (
                <Badge variant={detail.status.toLowerCase().includes('ongoing') ? 'default' : 'secondary'}>
                  {detail.status}
                </Badge>
              )}
              {detail.type && <Badge variant="outline">{detail.type}</Badge>}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {detail.author && (
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" /> {detail.author}
                </span>
              )}
              {detail.artist && (
                <span className="flex items-center gap-1">
                  <Palette className="h-4 w-4" /> {detail.artist}
                </span>
              )}
              {detail.released && <span>Released: {detail.released}</span>}
            </div>

            {/* Genres */}
            {detail.genres && detail.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {detail.genres.map((genre) => (
                  <Link key={genre} to={`/mangasusuku/genre/${genre.toLowerCase().replace(/\s+/g, '-')}`}>
                    <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                      {genre}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant={isFavorite('mangasusuku', slug!) ? 'default' : 'outline'}
                onClick={handleFavoriteClick}
                className="gap-2"
              >
                <Heart className={`h-4 w-4 ${isFavorite('mangasusuku', slug!) ? 'fill-current' : ''}`} />
                {isFavorite('mangasusuku', slug!) ? 'Favorited' : 'Add to Favorites'}
              </Button>
              {(() => {
                const lastRead = getLastRead('mangasusuku', slug!);
                if (lastRead?.lastChapterSlug) {
                  return (
                    <Link to={`/mangasusuku/chapter/${lastRead.lastChapterSlug}`}>
                      <Button className="gap-2">
                        <History className="h-4 w-4" /> Resume {lastRead.lastChapter}
                      </Button>
                    </Link>
                  );
                }
                if (chapters.length > 0) {
                  return (
                    <Link to={`/mangasusuku/chapter/${chapters[0].slug}`}>
                      <Button className="gap-2">
                        <BookOpen className="h-4 w-4" /> Start Reading
                      </Button>
                    </Link>
                  );
                }
                return null;
              })()}
            </div>
          </div>
        </div>

        {/* Synopsis */}
        {synopsis && synopsis !== 'No synopsis available.' && (
          <Card className="mt-8">
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-3">Synopsis</h2>
              <p className="text-muted-foreground leading-relaxed">
                {synopsis}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Chapters */}
        {chapters.length > 0 && (
          <Card className="mt-6 mb-8">
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-3">
                Chapters ({chapters.length})
              </h2>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {chapters.map((chapter) => (
                    <Link
                      key={chapter.slug}
                      to={`/mangasusuku/chapter/${chapter.slug}`}
                      className="block p-3 rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{chapter.title}</span>
                        {chapter.date && (
                          <span className="text-sm text-muted-foreground">{chapter.date}</span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MangasusukuDetail;
