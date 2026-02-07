import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { tvshowApi, TvShowDetailData } from '@/lib/tvshowApi';
import { LoadingGrid } from '@/components/LoadingSkeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Play, Star, Calendar, Tv } from 'lucide-react';
import { Comments } from '@/components/Comments';

interface TvShowDetailProps {
  type: 'film' | 'series';
}

const TvShowDetail = ({ type }: TvShowDetailProps) => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ['tvshow-detail', type, id],
    queryFn: () => type === 'film' ? tvshowApi.getFilmDetail(id!) : tvshowApi.getSeriesDetail(id!),
    enabled: !!id,
  });

  if (isLoading) return <LoadingGrid />;

  if (error || !data?.data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Not Found</h2>
          <Link to="/tvshow">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to TV Shows
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const show = data.data;

  const posterUrl = (show as any).poster || (show as any).image || '/placeholder.svg';
  const info = (show as any).info as TvShowDetailData['info'] | undefined;

  const displayType = show.type || info?.type || type;
  const displayStatus = show.status || info?.status;
  const displayYear = show.year || info?.release_date || info?.season;
  const displayRating = show.rating || info?.rating;

  const getGenreSlug = (url: string) => {
    try {
      const u = new URL(url);
      const parts = u.pathname.split('/').filter(Boolean);
      return parts[parts.length - 1] || '';
    } catch {
      const parts = url.split('/').filter(Boolean);
      return parts[parts.length - 1] || '';
    }
  };

  const genreItems =
    (show as any).genres?.map((g: any) => ({ name: g.name, slug: g.slug })) ||
    info?.genres?.map((g) => ({ name: g.name, slug: getGenreSlug(g.url) })) ||
    [];

  return (
    <div className="min-h-screen bg-background">
      <div className="relative">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 blur-xl"
          style={{ backgroundImage: `url(${posterUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background" />

        <div className="container mx-auto px-4 py-8 relative z-10">
          <Link to="/tvshow" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to TV Shows
          </Link>

          <div className="grid md:grid-cols-[300px_1fr] gap-8">
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={posterUrl}
                  alt={show.title}
                  className="w-full aspect-[2/3] object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{show.title}</h1>
                {show.alternativeTitle && (
                  <p className="text-lg text-muted-foreground">{show.alternativeTitle}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {displayType && (
                  <Badge className="bg-primary/20 text-primary">
                    <Tv className="w-3 h-3 mr-1" /> {displayType}
                  </Badge>
                )}
                {displayStatus && <Badge variant="outline">{displayStatus}</Badge>}
                {displayYear && (
                  <Badge variant="secondary">
                    <Calendar className="w-3 h-3 mr-1" /> {displayYear}
                  </Badge>
                )}
                {displayRating && displayRating !== '-' && (
                  <Badge className="bg-accent/20 text-accent-foreground">
                    <Star className="w-3 h-3 mr-1 fill-current" /> {displayRating}
                  </Badge>
                )}
              </div>

              {genreItems.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {genreItems.map((genre) =>
                    genre.slug ? (
                      <Link key={`${genre.slug}-${genre.name}`} to={`/tvshow/genre/${genre.slug}`}>
                        <Badge variant="outline" className="hover:bg-primary/20 cursor-pointer">
                          {genre.name}
                        </Badge>
                      </Link>
                    ) : (
                      <Badge key={genre.name} variant="outline">
                        {genre.name}
                      </Badge>
                    )
                  )}
                </div>
              )}

              {show.synopsis && (
                <Card>
                  <CardHeader>
                    <CardTitle>Synopsis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{show.synopsis}</p>
                  </CardContent>
                </Card>
              )}

              {show.episodes && show.episodes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Episodes ({show.episodes.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                      {show.episodes.map((episode) => (
                        <Link key={episode.id || episode.slug} to={`/tvshow/episode/${episode.id || episode.slug}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            <Play className="w-3 h-3 mr-1" />
                            {episode.title}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Comments Section */}
              <Comments contentType="tvshow" contentSlug={id!} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TvShowDetail;
