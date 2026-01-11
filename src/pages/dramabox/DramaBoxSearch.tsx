import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { dramaboxApi, extractDramaBoxItems } from '@/lib/dramaboxApi';
import DramaBoxCard from '@/components/DramaBoxCard';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { ErrorState } from '@/components/ErrorState';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const DramaBoxSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('q') || '';
  const [inputValue, setInputValue] = useState(keyword);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dramabox-search', keyword],
    queryFn: () => dramaboxApi.search(keyword),
    enabled: !!keyword,
  });

  const items = extractDramaBoxItems(data);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchParams({ q: inputValue.trim() });
    }
  };

  return (
    <div className="container mx-auto space-y-6 px-4 py-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-foreground">Search DramaBox</h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          placeholder="Search dramas..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1"
        />
        <Button type="submit">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </form>

      {/* Results */}
      {isLoading && <LoadingSkeleton />}

      {error && <ErrorState message="Search failed" onRetry={() => refetch()} />}

      {!isLoading && !error && keyword && items.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {items.map((item) => (
            <DramaBoxCard key={item.bookId || item.id} item={item} />
          ))}
        </div>
      )}

      {!isLoading && !error && keyword && items.length === 0 && (
        <p className="text-center text-muted-foreground">
          No results found for "{keyword}"
        </p>
      )}

      {!keyword && (
        <p className="text-center text-muted-foreground">
          Enter a keyword to search
        </p>
      )}
    </div>
  );
};

export default DramaBoxSearch;
