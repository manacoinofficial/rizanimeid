import { useQuery } from '@tanstack/react-query';
import { novelApi } from '@/lib/novelApi';
import { NovelCard } from '@/components/NovelCard';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, TrendingUp, Clock, BookOpen, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { ErrorState } from '@/components/ErrorState';

const NovelHome = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { data: homeData, isLoading: homeLoading, isError: homeError, refetch: refetchHome, isFetching: homeFetching } = useQuery({
    queryKey: ['novel-home'],
    queryFn: novelApi.getHome,
  });

  const { data: popularData, isLoading: popularLoading, isError: popularError, refetch: refetchPopular, isFetching: popularFetching } = useQuery({
    queryKey: ['novel-popular'],
    queryFn: novelApi.getPopular,
  });

  const { data: latestData, isLoading: latestLoading, isError: latestError, refetch: refetchLatest, isFetching: latestFetching } = useQuery({
    queryKey: ['novel-latest'],
    queryFn: novelApi.getLatest,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/novel/sakuranovel/search?q=${searchQuery}`);
    }
  };

  const handleRetryAll = () => {
    refetchHome();
    refetchPopular();
    refetchLatest();
  };


  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
              Novel Library
            </h1>
            <p className="text-muted-foreground mb-8">
              Temukan ribuan novel terbaik dari berbagai genre
            </p>
            
            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
              <Input
                placeholder="Cari novel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12"
              />
              <Button type="submit" size="lg" className="h-12">
                <Search className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Show global error if all queries failed */}
        {homeError && popularError && latestError && (
          <div className="mb-8">
            <ErrorState
              title="Unable to Load Novels"
              message="We couldn't fetch the novel data. Please check your connection and try again."
              onRetry={handleRetryAll}
              isRetrying={homeFetching || popularFetching || latestFetching}
            />
          </div>
        )}

        {/* Quick Links */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link to="/novel/genres">
            <Button variant="outline" size="sm" className="gap-2">
              <BookOpen className="h-4 w-4" />
              All Genres
            </Button>
          </Link>
          <Link to="/novel/popular">
            <Button variant="outline" size="sm" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Popular
            </Button>
          </Link>
          <Link to="/novel/latest">
            <Button variant="outline" size="sm" className="gap-2">
              <Clock className="h-4 w-4" />
              Latest
            </Button>
          </Link>
        </div>

        {/* Featured Slider */}
        {homeData?.data?.slider && homeData.data.slider.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Featured
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {homeData.data.slider.slice(0, 3).map((novel: any) => (
                <Link key={novel.slug} to={`/novel/detail/${novel.slug}`}>
                  <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300">
                    <div className="relative h-48">
                      <img
                        src={novel.image}
                        alt={novel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-semibold line-clamp-2">{novel.title}</h3>
                        {novel.latestChapter && (
                          <Badge variant="secondary" className="mt-2">
                            {novel.latestChapter}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Latest Updates from Home */}
        {homeData?.data?.latestUpdates && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Latest Updates
            </h2>
            {homeLoading ? (
              <LoadingSkeleton />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {homeData.data.latestUpdates.slice(0, 12).map((novel: any) => (
                  <NovelCard key={novel.slug} {...novel} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Popular Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Popular Novels
            </h2>
            <Link to="/novel/popular">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          {popularLoading ? (
            <LoadingSkeleton />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {popularData?.data?.slice(0, 12).map((novel: any) => (
                <NovelCard key={novel.slug} {...novel} />
              ))}
            </div>
          )}
        </section>

        {/* Latest Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Latest Novels
            </h2>
            <Link to="/novel/latest">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          {latestLoading ? (
            <LoadingSkeleton />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {latestData?.data?.slice(0, 12).map((novel: any) => (
                <NovelCard key={novel.slug} {...novel} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default NovelHome;
