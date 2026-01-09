import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Flame, CheckCircle2 } from 'lucide-react';
import { animeApi, AnimeCard as AnimeCardType } from '@/lib/animeApi';
import { AnimeCard } from '@/components/AnimeCard';
import { LoadingGrid } from '@/components/LoadingSkeleton';
import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/ErrorState';
import { useQuery } from '@tanstack/react-query';

export default function AnimeHome() {
  const { 
    data: homeData, 
    isLoading: homeLoading, 
    isError: homeError, 
    refetch: refetchHome,
    isFetching: homeFetching 
  } = useQuery({
    queryKey: ['anime-home'],
    queryFn: () => animeApi.getHome(),
  });

  const { 
    data: completedData, 
    isLoading: completedLoading, 
    isError: completedError, 
    refetch: refetchCompleted,
    isFetching: completedFetching 
  } = useQuery({
    queryKey: ['anime-completed', 1],
    queryFn: () => animeApi.getCompleted(1),
  });

  const ongoing = homeData?.data?.ongoing?.animeList?.slice(0, 12) || [];
  const completed = completedData?.data?.animeList?.slice(0, 8) || [];
  const loading = homeLoading || completedLoading;
  const hasError = homeError && completedError;

  const handleRetryAll = () => {
    refetchHome();
    refetchCompleted();
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-rose-600 to-pink-600 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
            Anime Subtitle Indonesia
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto animate-fade-in">
            Nonton anime subtitle Indonesia terbaru dan terlengkap
          </p>
        </div>
      </section>

      {/* Quick Links */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link to="/anime/schedule">
          <Button variant="outline" size="sm">Jadwal</Button>
        </Link>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Error State */}
        {hasError && (
          <ErrorState
            title="Unable to Load Anime"
            message="We couldn't fetch the anime data. Please check your connection and try again."
            onRetry={handleRetryAll}
            isRetrying={homeFetching || completedFetching}
          />
        )}
        {/* Ongoing Anime */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-500/10">
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">Ongoing Anime</h2>
            </div>
            <Link to="/anime/ongoing">
              <Button variant="ghost" size="sm">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          {loading ? (
            <LoadingGrid count={12} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {ongoing.map((anime, index) => (
                <AnimeCard key={index} anime={anime} showReleaseDay />
              ))}
            </div>
          )}
        </section>

        {/* Completed Anime */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-500/10">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">Completed Anime</h2>
            </div>
            <Link to="/anime/completed">
              <Button variant="ghost" size="sm">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          {loading ? (
            <LoadingGrid count={8} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {completed.map((anime, index) => (
                <AnimeCard key={index} anime={anime} showScore />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
