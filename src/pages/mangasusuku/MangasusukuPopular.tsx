import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { mangasusukuApi, extractMangasusukuItems, getCover } from '@/lib/mangasusukuApi';
import { ComicCard } from '@/components/ComicCard';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MangasusukuPopular = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['mangasusuku-popular', page],
    queryFn: () => mangasusukuApi.getPopular(page),
  });

  const items = extractMangasusukuItems(data);
  const pagination = data?.pagination;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-primary bg-clip-text text-transparent">
        Popular Manga
      </h1>

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {items.map((manga) => (
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

          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" /> Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} {pagination?.totalPages ? `of ${pagination.totalPages}` : ''}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(p => p + 1)}
              disabled={items.length === 0 || (pagination && !pagination.hasNextPage)}
            >
              Next <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default MangasusukuPopular;
