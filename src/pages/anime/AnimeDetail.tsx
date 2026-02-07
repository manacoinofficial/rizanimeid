import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Calendar, Clock, Star, Film, Heart } from 'lucide-react';
import { animeApi, AnimeDetailData } from '@/lib/animeApi';
import { Button } from '@/components/ui/button';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { useFavorites } from '@/hooks/useFavorites';
import { useReadingHistory } from '@/hooks/useReadingHistory';
import { Comments } from '@/components/Comments';

export default function AnimeDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [anime, setAnime] = useState<AnimeDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [visibleEpisodes, setVisibleEpisodes] = useState(20);
  const observerTarget = useRef<HTMLDivElement>(null);
  const { toggleFavorite, isFavorite } = useFavorites();
  const { getLastRead } = useReadingHistory();

  useEffect(() => {
    const fetchDetail = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const data = await animeApi.getDetail(slug);
        if (data.status === 'success' && data.data) {
          setAnime(data.data);
        } else {
          setAnime(null);
        }
      } catch (error) {
        console.error('Error fetching anime detail:', error);
        setAnime(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    window.scrollTo(0, 0);
  }, [slug]);

  // Infinite scroll for episodes
  const loadMoreEpisodes = useCallback(() => {
    if (anime?.episodeList && visibleEpisodes < anime.episodeList.length) {
      setVisibleEpisodes(prev => Math.min(prev + 20, anime.episodeList!.length));
    }
  }, [anime, visibleEpisodes]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMoreEpisodes();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMoreEpisodes]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <LoadingSkeleton />
            <div className="md:col-span-2 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Anime not found</h1>
          <Link to="/anime">
            <Button>Back to Anime Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Sort episodes so newest first
  const sortedEpisodes = anime.episodeList?.slice().sort((a, b) => b.eps - a.eps) || [];
  
  const isCurrentFavorite = isFavorite('anime', slug!);
  const lastRead = getLastRead('anime', slug!);

  const handleFavoriteClick = () => {
    toggleFavorite({
      type: 'anime',
      slug: slug!,
      title: anime.title,
      cover: anime.poster,
      rating: anime.score,
      status: anime.status,
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-[400px] md:h-[500px]">
        <img
          src={anime.poster}
          alt={anime.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="flex justify-center md:justify-start">
            <img
              src={anime.poster}
              alt={anime.title}
              className="w-full max-w-sm rounded-lg shadow-hover"
            />
          </div>

          {/* Info */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-5xl font-bold mb-2">{anime.title}</h1>
                  {anime.japanese && (
                    <p className="text-lg text-muted-foreground">{anime.japanese}</p>
                  )}
                </div>
                <Button
                  variant={isCurrentFavorite ? "default" : "outline"}
                  size="icon"
                  onClick={handleFavoriteClick}
                  className="flex-shrink-0"
                >
                  <Heart className={`h-5 w-5 ${isCurrentFavorite ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Watch Button */}
            {sortedEpisodes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <Link to={`/anime/episode/${sortedEpisodes[sortedEpisodes.length - 1].episodeId}`}>
                  <Button size="lg" className="w-full md:w-auto">
                    <Play className="mr-2 h-5 w-5" />
                    Watch Episode 1
                  </Button>
                </Link>
                {lastRead?.lastEpisodeId && (
                  <Link to={`/anime/episode/${lastRead.lastEpisodeId}`}>
                    <Button size="lg" variant="secondary" className="w-full md:w-auto">
                      <Play className="mr-2 h-5 w-5" />
                      Continue: Ep {lastRead.lastEpisode}
                    </Button>
                  </Link>
                )}
              </div>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-sm">
              {anime.aired && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{anime.aired}</span>
                </div>
              )}
              {anime.duration && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{anime.duration}</span>
                </div>
              )}
              {anime.score && (
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{anime.score}</span>
                </div>
              )}
              {anime.type && (
                <div className="flex items-center gap-2">
                  <Film className="h-4 w-4 text-muted-foreground" />
                  <span>{anime.type}</span>
                </div>
              )}
              {anime.status && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    anime.status === 'Ongoing'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {anime.status}
                </span>
              )}
            </div>

            {/* Genres */}
            {anime.genreList && anime.genreList.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {anime.genreList.map((genre, index) => (
                  <Button key={index} variant="outline" size="sm" className="rounded-full">
                    {genre.title}
                  </Button>
                ))}
              </div>
            )}

            {/* Synopsis */}
            {anime.synopsis?.paragraphs && anime.synopsis.paragraphs.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Synopsis</h2>
                <div className="space-y-3 text-muted-foreground leading-relaxed">
                  {anime.synopsis.paragraphs.map((para, index) => (
                    <p key={index}>{para}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            {(anime.studios || anime.producers || anime.episodes) && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                {anime.studios && (
                  <div>
                    <span className="text-muted-foreground">Studio:</span>
                    <p className="font-medium">{anime.studios}</p>
                  </div>
                )}
                {anime.producers && (
                  <div>
                    <span className="text-muted-foreground">Producers:</span>
                    <p className="font-medium">{anime.producers}</p>
                  </div>
                )}
                {anime.episodes && (
                  <div>
                    <span className="text-muted-foreground">Episodes:</span>
                    <p className="font-medium">{anime.episodes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Episodes List with Infinite Scroll */}
        {sortedEpisodes.length > 0 && (
          <div className="mt-12 mb-8">
            <h2 className="text-2xl font-bold mb-6">Episodes</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {sortedEpisodes.slice(0, visibleEpisodes).map((episode, index) => (
                <Link key={index} to={`/anime/episode/${episode.episodeId}`}>
                  <Button
                    variant="outline"
                    className="w-full h-auto py-3 hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    <div className="text-center">
                      <span className="block">Ep {episode.eps}</span>
                      <span className="text-xs text-muted-foreground">{episode.date}</span>
                    </div>
                  </Button>
                </Link>
              ))}
            </div>

            {/* Infinite scroll trigger */}
            <div ref={observerTarget} className="mt-4">
              {visibleEpisodes < sortedEpisodes.length && (
                <div className="text-center text-sm text-muted-foreground">
                  Loading more episodes...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recommended Anime */}
        {anime.recommendedAnimeList && anime.recommendedAnimeList.length > 0 && (
          <div className="mt-12 mb-8">
            <h2 className="text-2xl font-bold mb-6">Recommended</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {anime.recommendedAnimeList.map((rec, index) => (
                <Link key={index} to={`/anime/detail/${rec.animeId}`} className="group block">
                  <div className="relative overflow-hidden rounded-lg bg-card shadow-card hover:shadow-hover transition-all duration-300">
                    <div className="relative aspect-[2/3] overflow-hidden">
                      <img
                        src={rec.poster}
                        alt={rec.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                        {rec.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <Comments contentType="anime" contentSlug={slug!} />
      </div>
    </div>
  );
}
