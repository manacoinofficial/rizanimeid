import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { aniwatchApi } from '@/lib/aniwatchApi';
import { EnAnimeCard } from '@/components/EnAnimeCard';
import { LoadingGrid } from '@/components/LoadingSkeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function EnAnimeSearch() {
  const [searchInput, setSearchInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['en-anime-search', keyword, page],
    queryFn: () => aniwatchApi.search(keyword, page),
    enabled: keyword.length > 0,
  });

  const animes = data?.data?.animes || [];
  const hasNextPage = data?.data?.hasNextPage;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setKeyword(searchInput.trim());
      setPage(1);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
            <Search className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Search Anime</h1>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-8 max-w-xl">
          <Input
            type="text"
            placeholder="Search anime..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isFetching}>
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </form>

        {/* Results */}
        {keyword && (
          <>
            <p className="text-muted-foreground mb-4">
              Results for "{keyword}"
            </p>

            {isLoading ? (
              <LoadingGrid count={12} />
            ) : animes.length > 0 ? (
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
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No anime found for "{keyword}"</p>
              </div>
            )}
          </>
        )}

        {!keyword && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Enter a keyword to search for anime</p>
          </div>
        )}
      </div>
    </div>
  );
}
