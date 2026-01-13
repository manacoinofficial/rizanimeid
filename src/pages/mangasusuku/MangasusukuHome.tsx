import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { mangasusukuApi, extractMangasusukuItems } from '@/lib/mangasusukuApi';
import { ComicCard } from '@/components/ComicCard';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Flame, Clock, Star, List } from 'lucide-react';

const MangasusukuHome = () => {
  const [page, setPage] = useState(1);

  const { data: homeData, isLoading: homeLoading } = useQuery({
    queryKey: ['mangasusuku-home', page],
    queryFn: () => mangasusukuApi.getHome(page),
  });

  const { data: latestData, isLoading: latestLoading } = useQuery({
    queryKey: ['mangasusuku-latest-preview'],
    queryFn: () => mangasusukuApi.getLatest(1),
  });

  const { data: popularData, isLoading: popularLoading } = useQuery({
    queryKey: ['mangasusuku-popular-preview'],
    queryFn: () => mangasusukuApi.getPopular(1),
  });

  const homeItems = extractMangasusukuItems(homeData);
  const latestItems = extractMangasusukuItems(latestData);
  const popularItems = extractMangasusukuItems(popularData);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
        Mangasusuku
      </h1>

      {/* Quick Links */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link to="/mangasusuku/latest">
          <Button variant="outline" size="sm" className="gap-2">
            <Clock className="h-4 w-4" /> Latest
          </Button>
        </Link>
        <Link to="/mangasusuku/popular">
          <Button variant="outline" size="sm" className="gap-2">
            <Flame className="h-4 w-4" /> Popular
          </Button>
        </Link>
        <Link to="/mangasusuku/list">
          <Button variant="outline" size="sm" className="gap-2">
            <List className="h-4 w-4" /> All Manga
          </Button>
        </Link>
        <Link to="/mangasusuku/genres">
          <Button variant="outline" size="sm" className="gap-2">
            <Star className="h-4 w-4" /> Genres
          </Button>
        </Link>
      </div>

      {/* Home/Featured Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Featured</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="flex items-center px-3 text-sm text-muted-foreground">
              Page {page}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(p => p + 1)}
              disabled={homeItems.length === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {homeLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {homeItems.map((manga) => (
              <ComicCard
                key={manga.slug}
                title={manga.title}
                slug={manga.slug}
                cover={manga.cover}
                chapter={manga.chapter}
                type={manga.type}
                rating={manga.rating}
                linkPrefix="/mangasusuku"
              />
            ))}
          </div>
        )}
      </section>

      {/* Latest Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Latest Updates</h2>
          <Link to="/mangasusuku/latest">
            <Button variant="ghost" size="sm">View All →</Button>
          </Link>
        </div>
        {latestLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {latestItems.slice(0, 12).map((manga) => (
              <ComicCard
                key={manga.slug}
                title={manga.title}
                slug={manga.slug}
                cover={manga.cover}
                chapter={manga.chapter}
                type={manga.type}
                rating={manga.rating}
                linkPrefix="/mangasusuku"
              />
            ))}
          </div>
        )}
      </section>

      {/* Popular Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Popular</h2>
          <Link to="/mangasusuku/popular">
            <Button variant="ghost" size="sm">View All →</Button>
          </Link>
        </div>
        {popularLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {popularItems.slice(0, 12).map((manga) => (
              <ComicCard
                key={manga.slug}
                title={manga.title}
                slug={manga.slug}
                cover={manga.cover}
                chapter={manga.chapter}
                type={manga.type}
                rating={manga.rating}
                linkPrefix="/mangasusuku"
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MangasusukuHome;
