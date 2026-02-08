import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { Play, Star, Clock, Calendar, Film, Users } from 'lucide-react';
import { aniwatchApi } from '@/lib/aniwatchApi';
import { EnAnimeCard } from '@/components/EnAnimeCard';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ErrorState } from '@/components/ErrorState';
import { Comments } from '@/components/Comments';

export default function EnAnimeDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: infoData, isLoading: infoLoading, isError: infoError, refetch: refetchInfo } = useQuery({
    queryKey: ['en-anime-info', id],
    queryFn: () => aniwatchApi.getInfo(id!),
    enabled: !!id,
  });

  const { data: episodesData, isLoading: episodesLoading } = useQuery({
    queryKey: ['en-anime-episodes', id],
    queryFn: () => aniwatchApi.getEpisodes(id!),
    enabled: !!id,
  });

  const info = infoData?.data;
  const animeInfo = info?.anime?.info;
  const moreInfo = info?.anime?.moreInfo;
  const episodes = episodesData?.data?.episodes || [];

  if (infoLoading) return <LoadingSkeleton />;

  if (infoError || !info) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          title="Unable to Load Anime"
          message="We couldn't fetch the anime details. Please try again."
          onRetry={refetchInfo}
        />
      </div>
    );
  }

  const poster = animeInfo?.poster || info.poster;
  const name = animeInfo?.name || info.name;
  const description = animeInfo?.description || info.description;
  const stats = animeInfo?.stats || info.stats;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-background" />
        <div className="container mx-auto px-4 py-8 relative">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <img
                src={poster}
                alt={name}
                className="w-64 rounded-lg shadow-xl"
              />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold">{name}</h1>
              {info.jname && (
                <p className="text-lg text-muted-foreground">{info.jname}</p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap gap-2">
                {stats?.rating && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {stats.rating}
                  </Badge>
                )}
                {stats?.type && (
                  <Badge variant="outline">
                    <Film className="w-3 h-3 mr-1" />
                    {stats.type}
                  </Badge>
                )}
                {stats?.duration && (
                  <Badge variant="outline">
                    <Clock className="w-3 h-3 mr-1" />
                    {stats.duration}
                  </Badge>
                )}
                {stats?.episodes && (
                  <>
                    {stats.episodes.sub && (
                      <Badge className="bg-blue-600">SUB: {stats.episodes.sub}</Badge>
                    )}
                    {stats.episodes.dub && (
                      <Badge className="bg-purple-600">DUB: {stats.episodes.dub}</Badge>
                    )}
                  </>
                )}
              </div>

              {/* More Info */}
              {moreInfo && (
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {moreInfo.aired && (
                    <div>
                      <span className="text-muted-foreground">Aired:</span>{' '}
                      {moreInfo.aired}
                    </div>
                  )}
                  {moreInfo.status && (
                    <div>
                      <span className="text-muted-foreground">Status:</span>{' '}
                      {moreInfo.status}
                    </div>
                  )}
                  {moreInfo.studios && (
                    <div>
                      <span className="text-muted-foreground">Studios:</span>{' '}
                      {moreInfo.studios}
                    </div>
                  )}
                  {moreInfo.malscore && (
                    <div>
                      <span className="text-muted-foreground">MAL Score:</span>{' '}
                      {moreInfo.malscore}
                    </div>
                  )}
                </div>
              )}

              {/* Genres */}
              {moreInfo?.genres && moreInfo.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {moreInfo.genres.map((genre, index) => (
                    <Badge key={index} variant="secondary">
                      {genre}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Description */}
              {description && (
                <p className="text-muted-foreground leading-relaxed line-clamp-4">
                  {description}
                </p>
              )}

              {/* Watch Button */}
              {episodes.length > 0 && (
                <Link to={`/en/anime/episode/${episodes[0].episodeId}`}>
                  <Button size="lg" className="mt-4">
                    <Play className="w-5 h-5 mr-2" />
                    Watch Now
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Episodes */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Episodes</h2>
          {episodesLoading ? (
            <div className="animate-pulse space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded" />
              ))}
            </div>
          ) : episodes.length > 0 ? (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2">
              {episodes.map((ep) => (
                <Link
                  key={ep.episodeId}
                  to={`/en/anime/episode/${ep.episodeId}`}
                  className={`p-3 text-center rounded-lg transition-colors ${
                    ep.isFiller 
                      ? 'bg-orange-500/20 hover:bg-orange-500/30' 
                      : 'bg-muted hover:bg-primary/20'
                  }`}
                >
                  <span className="font-medium">{ep.number}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No episodes available</p>
          )}
        </section>

        {/* Seasons */}
        {info.seasons && info.seasons.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Seasons</h2>
            <div className="flex flex-wrap gap-2">
              {info.seasons.map((season) => (
                <Link key={season.id} to={`/en/anime/detail/${season.id}`}>
                  <Button
                    variant={season.isCurrent ? 'default' : 'outline'}
                    size="sm"
                  >
                    {season.title || season.name}
                  </Button>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related Anime */}
        {info.relatedAnimes && info.relatedAnimes.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Related Anime</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {info.relatedAnimes.slice(0, 6).map((anime) => (
                <EnAnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          </section>
        )}

        {/* Recommended Anime */}
        {info.recommendedAnimes && info.recommendedAnimes.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Recommended</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {info.recommendedAnimes.slice(0, 6).map((anime) => (
                <EnAnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          </section>
        )}

        {/* Comments */}
        <Comments contentType="en-anime" contentSlug={id || ''} />
      </div>
    </div>
  );
}
