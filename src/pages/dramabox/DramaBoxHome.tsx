import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ChevronRight, TrendingUp, Clock } from 'lucide-react';
import { dramaboxApi, extractDramaBoxItems } from '@/lib/dramaboxApi';
import DramaBoxCard from '@/components/DramaBoxCard';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { ErrorState } from '@/components/ErrorState';

const DramaBoxHome = () => {
  const { data: trendingData, isLoading: trendingLoading, error: trendingError } = useQuery({
    queryKey: ['dramabox-trending'],
    queryFn: () => dramaboxApi.getTrending(),
  });

  const { data: latestData, isLoading: latestLoading, error: latestError } = useQuery({
    queryKey: ['dramabox-latest', 1],
    queryFn: () => dramaboxApi.getLatest(1),
  });

  const trending = extractDramaBoxItems(trendingData);
  const latest = extractDramaBoxItems(latestData);

  if (trendingLoading && latestLoading) {
    return <LoadingSkeleton />;
  }

  if (trendingError && latestError) {
    return <ErrorState message="Failed to load DramaBox" onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="container mx-auto space-y-8 px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">DramaBox</h1>
        <Link
          to="/dramabox/search"
          className="text-sm text-primary hover:underline"
        >
          Search
        </Link>
      </div>

      {/* Trending Section */}
      {trending.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Trending</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {trending.slice(0, 12).map((item) => (
              <DramaBoxCard key={item.bookId || item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Latest Section */}
      {latest.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Latest</h2>
            </div>
            <Link
              to="/dramabox/latest"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              View All
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {latest.slice(0, 12).map((item) => (
              <DramaBoxCard key={item.bookId || item.id} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default DramaBoxHome;
