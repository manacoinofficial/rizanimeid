import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ChevronRight, Flame, TrendingUp, Clock, Star, Sparkles } from 'lucide-react';
import { aniwatchApi } from '@/lib/aniwatchApi';
import { EnAnimeCard } from '@/components/EnAnimeCard';
import { LoadingGrid } from '@/components/LoadingSkeleton';
import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/ErrorState';

export default function EnAnimeHome() {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['en-anime-home'],
    queryFn: () => aniwatchApi.getHome(),
  });

  const homeData = data?.data;

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          title="Unable to Load Anime"
          message="We couldn't fetch the anime data. Please check your connection and try again."
          onRetry={refetch}
          isRetrying={isFetching}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
            English Anime
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto animate-fade-in">
            Watch anime with English subtitles and dubs
          </p>
        </div>
      </section>

      {/* Quick Links */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap gap-2">
          <Link to="/en/anime/list">
            <Button variant="outline" size="sm">A-Z List</Button>
          </Link>
          <Link to="/en/anime/search">
            <Button variant="outline" size="sm">Search</Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Spotlight */}
        {homeData?.spotlightAnimes && homeData.spotlightAnimes.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-yellow-500/10">
                <Sparkles className="w-5 h-5 text-yellow-500" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">Spotlight</h2>
            </div>
            {isLoading ? (
              <LoadingGrid count={6} />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {homeData.spotlightAnimes.slice(0, 6).map((anime) => (
                  <EnAnimeCard key={anime.id} anime={anime} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Trending */}
        {homeData?.trendingAnimes && homeData.trendingAnimes.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-500/10">
                <TrendingUp className="w-5 h-5 text-red-500" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">Trending</h2>
            </div>
            {isLoading ? (
              <LoadingGrid count={6} />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {homeData.trendingAnimes.slice(0, 6).map((anime) => (
                  <EnAnimeCard key={anime.id} anime={anime} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Latest Episodes */}
        {homeData?.latestEpisodeAnimes && homeData.latestEpisodeAnimes.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-500/10">
                <Clock className="w-5 h-5 text-green-500" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">Latest Episodes</h2>
            </div>
            {isLoading ? (
              <LoadingGrid count={12} />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {homeData.latestEpisodeAnimes.slice(0, 12).map((anime) => (
                  <EnAnimeCard key={anime.id} anime={anime} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Top Airing */}
        {homeData?.topAiringAnimes && homeData.topAiringAnimes.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-500/10">
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">Top Airing</h2>
            </div>
            {isLoading ? (
              <LoadingGrid count={6} />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {homeData.topAiringAnimes.slice(0, 6).map((anime) => (
                  <EnAnimeCard key={anime.id} anime={anime} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Most Popular */}
        {homeData?.mostPopularAnimes && homeData.mostPopularAnimes.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-pink-500/10">
                <Star className="w-5 h-5 text-pink-500" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">Most Popular</h2>
            </div>
            {isLoading ? (
              <LoadingGrid count={6} />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {homeData.mostPopularAnimes.slice(0, 6).map((anime) => (
                  <EnAnimeCard key={anime.id} anime={anime} />
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
