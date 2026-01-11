import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { dramaboxApi, extractDramaBoxItems } from '@/lib/dramaboxApi';
import DramaBoxCard from '@/components/DramaBoxCard';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { ErrorState } from '@/components/ErrorState';
import { Button } from '@/components/ui/button';

const DramaBoxLatest = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dramabox-latest', page],
    queryFn: () => dramaboxApi.getLatest(page),
  });

  const items = extractDramaBoxItems(data);
  const pagination = data?.pagination;

  const setPage = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
  };

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState message="Failed to load latest dramas" onRetry={() => refetch()} />;

  return (
    <div className="container mx-auto space-y-6 px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Clock className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Latest DramaBox</h1>
      </div>

      {/* Grid */}
      {items.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {items.map((item) => (
            <DramaBoxCard key={item.bookId || item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No dramas found</p>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => setPage(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">Page {page}</span>
        <Button
          variant="outline"
          onClick={() => setPage(page + 1)}
          disabled={pagination && !pagination.hasNextPage}
        >
          Next
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DramaBoxLatest;
