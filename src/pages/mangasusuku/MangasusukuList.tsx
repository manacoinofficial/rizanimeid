import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { mangasusukuApi, extractMangasusukuItems } from '@/lib/mangasusukuApi';
import { ComicCard } from '@/components/ComicCard';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ALPHABET = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const MangasusukuList = () => {
  const [page, setPage] = useState(1);
  const [selectedChar, setSelectedChar] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['mangasusuku-list', selectedChar, page],
    queryFn: () => selectedChar 
      ? mangasusukuApi.getListByChar(selectedChar, page)
      : mangasusukuApi.getList(page),
  });

  const items = extractMangasusukuItems(data);
  const pagination = data?.pagination;

  const handleCharSelect = (char: string) => {
    setSelectedChar(char === selectedChar ? null : char);
    setPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
        All Manga
      </h1>

      {/* Alphabetical Filter */}
      <div className="flex flex-wrap gap-1 mb-6">
        <Button
          variant={selectedChar === null ? "default" : "outline"}
          size="sm"
          onClick={() => { setSelectedChar(null); setPage(1); }}
        >
          All
        </Button>
        {ALPHABET.map((char) => (
          <Button
            key={char}
            variant={selectedChar === char ? "default" : "outline"}
            size="sm"
            className="w-8 h-8 p-0"
            onClick={() => handleCharSelect(char)}
          >
            {char}
          </Button>
        ))}
      </div>

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
                cover={manga.cover}
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

export default MangasusukuList;
