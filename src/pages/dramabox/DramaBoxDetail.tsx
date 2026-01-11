import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Play, Star, Film, ArrowLeft } from 'lucide-react';
import { dramaboxApi } from '@/lib/dramaboxApi';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const DramaBoxDetail = () => {
  const { bookId } = useParams<{ bookId: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ['dramabox-detail', bookId],
    queryFn: () => dramaboxApi.getDetail(bookId!),
    enabled: !!bookId,
  });

  if (isLoading) return <LoadingSkeleton />;

  if (error || !data?.data) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center gap-4 px-4 py-20">
        <p className="text-lg text-muted-foreground">Drama not found</p>
        <Button asChild variant="outline">
          <Link to="/dramabox">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to DramaBox
          </Link>
        </Button>
      </div>
    );
  }

  const detail = data.data;
  const poster = detail.poster || detail.cover;

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div
        className="relative h-64 bg-cover bg-center md:h-80"
        style={{ backgroundImage: `url(${poster})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      <div className="container mx-auto px-4">
        <div className="relative -mt-32 flex flex-col gap-6 md:flex-row">
          {/* Poster */}
          <div className="mx-auto w-48 flex-shrink-0 md:mx-0">
            <img
              src={poster || '/placeholder.svg'}
              alt={detail.title}
              className="w-full rounded-lg shadow-xl"
            />
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4 pt-4">
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">
              {detail.title}
            </h1>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {detail.rating && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-yellow-500/90 text-white">
                  <Star className="h-3 w-3" fill="currentColor" />
                  {detail.rating}
                </Badge>
              )}
              {detail.episodeCount && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Film className="h-3 w-3" />
                  {detail.episodeCount} Episodes
                </Badge>
              )}
              {detail.status && (
                <Badge variant="outline">{detail.status}</Badge>
              )}
            </div>

            {/* Genres */}
            {detail.genres && detail.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {detail.genres.map((genre) => (
                  <Badge key={genre} variant="secondary">
                    {genre}
                  </Badge>
                ))}
              </div>
            )}

            {/* Watch Button */}
            <Button asChild size="lg">
              <Link to={`/dramabox/watch/${bookId}/1`}>
                <Play className="mr-2 h-5 w-5" fill="currentColor" />
                Watch Episode 1
              </Link>
            </Button>
          </div>
        </div>

        {/* Description */}
        {detail.description && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Synopsis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{detail.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Episodes */}
        {detail.episodes && detail.episodes.length > 0 && (
          <Card className="mt-6 mb-8">
            <CardHeader>
              <CardTitle>Episodes</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-80">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {detail.episodes.map((ep) => (
                    <Button
                      key={ep.id || ep.episode}
                      variant="outline"
                      size="sm"
                      asChild
                      className="justify-start"
                    >
                      <Link to={`/dramabox/watch/${bookId}/${ep.episode}`}>
                        <Play className="mr-1 h-3 w-3" />
                        Ep {ep.episode}
                      </Link>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Generate episode buttons if episodeCount exists but episodes array doesn't */}
        {!detail.episodes && detail.episodeCount && (
          <Card className="mt-6 mb-8">
            <CardHeader>
              <CardTitle>Episodes</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-80">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {Array.from({ length: detail.episodeCount }, (_, i) => i + 1).map((ep) => (
                    <Button
                      key={ep}
                      variant="outline"
                      size="sm"
                      asChild
                      className="justify-start"
                    >
                      <Link to={`/dramabox/watch/${bookId}/${ep}`}>
                        <Play className="mr-1 h-3 w-3" />
                        Ep {ep}
                      </Link>
                    </Button>
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

export default DramaBoxDetail;
