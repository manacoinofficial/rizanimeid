import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Play, Star, Film, ArrowLeft, Loader2, Heart } from 'lucide-react';
import { dramaboxApi, getEpisodeNumber, getTotalEpisodes, getGenres, getDescription, getRating, getPoster, getTitle, getViews } from '@/lib/dramaboxApi';
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
  const poster = getPoster(detail);
  const description = getDescription(detail);
  const rating = getRating(detail);
  const genres = getGenres(detail);
  const totalEpisodes = getTotalEpisodes(detail);
  const episodes = detail.episodes || detail.episodeList || [];
  const detailBookId = detail.bookId || detail.id || bookId;
  const title = getTitle(detail);
  const views = getViews(detail);

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
              alt={title}
              className="w-full rounded-lg shadow-xl"
            />
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4 pt-4">
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">
              {title}
            </h1>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {rating && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-yellow-500/90 text-white">
                  <Star className="h-3 w-3" fill="currentColor" />
                  {rating}
                </Badge>
              )}
              {views && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-pink-500/90 text-white">
                  <Heart className="h-3 w-3" fill="currentColor" />
                  {views}
                </Badge>
              )}
              {totalEpisodes > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Film className="h-3 w-3" />
                  {totalEpisodes} Episodes
                </Badge>
              )}
              {detail.status && (
                <Badge variant="outline">{detail.status}</Badge>
              )}
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <Badge key={genre} variant="secondary">
                    {genre}
                  </Badge>
                ))}
              </div>
            )}

            {/* Watch Button */}
            <Button asChild size="lg">
              <Link to={`/dramabox/watch/${detailBookId}/1`}>
                <Play className="mr-2 h-5 w-5" fill="currentColor" />
                Watch Episode 1
              </Link>
            </Button>
          </div>
        </div>

        {/* Description */}
        {description && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Synopsis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        )}

        {/* Episodes */}
        {episodes.length > 0 ? (
          <Card className="mt-6 mb-8">
            <CardHeader>
              <CardTitle>Episodes ({episodes.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-80">
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                  {episodes.map((ep, index) => {
                    const epNum = getEpisodeNumber(ep) || index + 1;
                    return (
                      <Button
                        key={ep.id || epNum}
                        variant="outline"
                        size="sm"
                        asChild
                        className="justify-center"
                      >
                        <Link to={`/dramabox/watch/${detailBookId}/${epNum}`}>
                          <Play className="mr-1 h-3 w-3" />
                          {epNum}
                        </Link>
                      </Button>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ) : totalEpisodes > 0 ? (
          <Card className="mt-6 mb-8">
            <CardHeader>
              <CardTitle>Episodes ({totalEpisodes})</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-80">
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                  {Array.from({ length: totalEpisodes }, (_, i) => i + 1).map((ep) => (
                    <Button
                      key={ep}
                      variant="outline"
                      size="sm"
                      asChild
                      className="justify-center"
                    >
                      <Link to={`/dramabox/watch/${detailBookId}/${ep}`}>
                        <Play className="mr-1 h-3 w-3" />
                        {ep}
                      </Link>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ) : null}

      </div>
    </div>
  );
};

export default DramaBoxDetail;
