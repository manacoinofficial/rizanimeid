import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { mangasusukuApi, MangasusukuHomeResponse, getCover } from '@/lib/mangasusukuApi';
import { ComicCard } from '@/components/ComicCard';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Flame, Clock, Star, List } from 'lucide-react';

const MangasusukuHome = () => {
  const [page, setPage] = useState(1);

  const { data: homeData, isLoading: homeLoading } = useQuery({
    queryKey: ['mangasusuku-home', page],
    queryFn: async () => {
      const response = await mangasusukuApi.getHome(page);
      return response as MangasusukuHomeResponse;
    },
  });

  // Extract hotComics and latestUpdates from home response
  const hotComics = homeData?.hotComics || [];
  const latestUpdates = homeData?.latestUpdates || [];
  const hasNextPage = homeData?.pagination?.hasNextPage ?? latestUpdates.length > 0;

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

      {homeLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          {/* Hot Comics Section */}
          {hotComics.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" /> Hot Comics
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
                {hotComics.map((manga) => (
                  <ComicCard
                    key={manga.slug}
                    title={manga.title}
                    slug={manga.slug}
                    cover={getCover(manga)}
                    chapter={manga.chapter}
                    type={manga.type}
                    rating={manga.rating}
                    linkPrefix="/mangasusuku"
                  />
                ))}
              </div>
            </section>
          )}

          {/* Latest Updates Section */}
          {latestUpdates.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" /> Latest Updates
                </h2>
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
                    disabled={!hasNextPage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {latestUpdates.map((manga) => (
                  <ComicCard
                    key={manga.slug}
                    title={manga.title}
                    slug={manga.slug}
                    cover={getCover(manga)}
                    chapter={manga.chapter}
                    type={manga.type}
                    rating={manga.rating}
                    linkPrefix="/mangasusuku"
                  />
                ))}
              </div>
            </section>
          )}

          {hotComics.length === 0 && latestUpdates.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No manga found</p>
          )}
        </>
      )}
    </div>
  );
};

export default MangasusukuHome;
