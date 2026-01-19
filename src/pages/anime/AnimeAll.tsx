import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { animeApi } from '@/lib/animeApi';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tv, Play, Search } from 'lucide-react';

interface AnimeListItem {
  title: string;
  animeId: string;
  href: string;
}

interface AnimeGroup {
  startWith: string;
  animeList: AnimeListItem[];
}

const AnimeAll = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChar, setSelectedChar] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['anime-all'],
    queryFn: () => animeApi.getAllAnime(),
  });

  // Extract grouped anime list from response
  const groupedList: AnimeGroup[] = (data?.data as any)?.list || [];

  // Flatten all anime for search
  const allAnime = useMemo(() => {
    return groupedList.flatMap(group => group.animeList);
  }, [groupedList]);

  // Get unique starting characters
  const chars = useMemo(() => {
    return groupedList.map(g => g.startWith);
  }, [groupedList]);

  // Filter anime based on search and selected character
  const filteredAnime = useMemo(() => {
    let result = allAnime;
    
    if (searchQuery.trim()) {
      result = result.filter(anime =>
        anime.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedChar) {
      const group = groupedList.find(g => g.startWith === selectedChar);
      result = group ? group.animeList.filter(a => 
        !searchQuery.trim() || a.title.toLowerCase().includes(searchQuery.toLowerCase())
      ) : [];
    }
    
    return result;
  }, [allAnime, searchQuery, selectedChar, groupedList]);

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Tv className="h-8 w-8 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold">All Anime</h1>
        </div>

        {/* Search & Character Filter */}
        <div className="space-y-4 mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search anime..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Character Filter */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedChar === null ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedChar(null)}
            >
              All
            </Badge>
            {chars.map(char => (
              <Badge
                key={char}
                variant={selectedChar === char ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedChar(char)}
              >
                {char}
              </Badge>
            ))}
          </div>
        </div>

        {filteredAnime.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">
            {searchQuery ? 'No anime found matching your search' : 'No anime found'}
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredAnime.map((anime, index) => (
              <Link key={`${anime.animeId}-${index}`} to={`/anime/${anime.animeId}`} className="group block">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-[2/3] overflow-hidden bg-muted flex items-center justify-center">
                    <Tv className="h-12 w-12 text-muted-foreground" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                      {anime.title}
                    </h3>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimeAll;
