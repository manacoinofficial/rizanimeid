import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { animeApi } from '@/lib/animeApi';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Clapperboard, Play, Search, Tv } from 'lucide-react';

interface DramaItem {
  title: string;
  slug: string;
  poster: string | null;
  type: string | null;
  episode: string | null;
  status: string | null;
}

const JDrama = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['j-drama'],
    queryFn: () => animeApi.getJDrama(),
  });

  // Extract anime_list from response - handle both formats
  const dramaList: DramaItem[] = (data as any)?.data?.anime_list || (data as any)?.anime_list || [];

  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return dramaList;
    return dramaList.filter((drama) =>
      drama.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [dramaList, searchQuery]);

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Clapperboard className="h-8 w-8 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold">Japanese Drama</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search drama..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Link to="/anime/live-action" className="text-primary hover:underline self-center">
            Live Action →
          </Link>
        </div>

        {filteredList.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">
            {searchQuery ? 'No drama found matching your search' : 'No drama found'}
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredList.map((drama, index) => (
              <Link key={index} to={`/anime/drama/${drama.slug}`} className="group block">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-[2/3] overflow-hidden bg-muted">
                    {drama.poster ? (
                      <img
                        src={drama.poster}
                        alt={drama.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Tv className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                      {drama.title}
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

export default JDrama;
