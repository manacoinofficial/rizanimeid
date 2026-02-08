import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { List } from 'lucide-react';
import { aniwatchApi } from '@/lib/aniwatchApi';
import { EnAnimeCard } from '@/components/EnAnimeCard';
import { LoadingGrid } from '@/components/LoadingSkeleton';
import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/ErrorState';

export default function EnAnimeList() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['en-anime-list', page],
    queryFn: () => aniwatchApi.getAZList(page),
  });

  const animes = data?.data?.animes || [];
  const hasNextPage = data?.data?.hasNextPage;
  const totalPages = data?.data?.totalPages || 1;

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          title="Unable to Load List"
          message="We couldn't fetch the anime list. Please try again."
          onRetry={refetch}
          isRetrying={isFetching}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
            <List className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">A-Z Anime List</h1>
            <p className="text-muted-foreground">Page {page} of {totalPages}</p>
          </div>
        </div>

        {isLoading ? (
          <LoadingGrid count={18} />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
              {animes.map((anime) => (
                <EnAnimeCard key={anime.id} anime={anime} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isFetching}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 text-sm text-muted-foreground">
                Page {page}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasNextPage || isFetching}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
