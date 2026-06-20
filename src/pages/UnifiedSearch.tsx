import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Tv, Film, BookOpen, Newspaper, Play, Monitor, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { animeApi } from '@/lib/animeApi';
import { api as donghuaApi } from '@/lib/api';
import { comicApi } from '@/lib/comicApi';
import { mangasusukuApi, MangasusukuHomeResponse } from '@/lib/mangasusukuApi';
import { novelApi } from '@/lib/novelApi';
import { tvshowApi, extractShows } from '@/lib/tvshowApi';
import { newsApi } from '@/lib/newsApi';

interface SearchResult {
  id: string;
  title: string;
  image: string;
  type: 'anime' | 'donghua' | 'comic' | 'mangasusuku' | 'novel' | 'tvshow' | 'news';
  link: string;
  extra?: string;
}

const UnifiedSearch = () => {
  const { keyword: urlKeyword } = useParams<{ keyword: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(urlKeyword || searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState('all');

  const searchKeyword = urlKeyword || searchParams.get('q') || '';

  // Anime search
  const { data: animeData, isLoading: animeLoading } = useQuery({
    queryKey: ['search-anime', searchKeyword],
    queryFn: () => animeApi.search(searchKeyword),
    enabled: !!searchKeyword,
  });

  // Donghua search
  const { data: donghuaData, isLoading: donghuaLoading } = useQuery({
    queryKey: ['search-donghua', searchKeyword],
    queryFn: () => donghuaApi.search(searchKeyword),
    enabled: !!searchKeyword,
  });

  // Comic search
  const { data: comicData, isLoading: comicLoading } = useQuery({
    queryKey: ['search-comic', searchKeyword],
    queryFn: () => comicApi.search(searchKeyword),
    enabled: !!searchKeyword,
  });

  // Novel search
  const { data: novelData, isLoading: novelLoading } = useQuery({
    queryKey: ['search-novel', searchKeyword],
    queryFn: () => novelApi.search(searchKeyword),
    enabled: !!searchKeyword,
  });

  // TV Show search
  const { data: tvshowData, isLoading: tvshowLoading } = useQuery({
    queryKey: ['search-tvshow', searchKeyword],
    queryFn: () => tvshowApi.search(searchKeyword),
    enabled: !!searchKeyword,
  });

  // News search
  const { data: newsData, isLoading: newsLoading } = useQuery({
    queryKey: ['search-news', searchKeyword],
    queryFn: () => newsApi.search(searchKeyword),
    enabled: !!searchKeyword,
  });

  // Process results
  const animeResults: SearchResult[] = (animeData?.data?.animeList || []).map((item: any) => ({
    id: item.animeId,
    title: item.title,
    image: item.poster || '/placeholder.svg',
    type: 'anime' as const,
    link: `/anime/${item.animeId}`,
    extra: item.score,
  }));

  const donghuaResults: SearchResult[] = (donghuaData?.data || []).map((item: any) => ({
    id: item.slug,
    title: item.title,
    image: item.poster || '/placeholder.svg',
    type: 'donghua' as const,
    link: `/detail/${item.slug}`,
    extra: item.status,
  }));

  const comicResults: SearchResult[] = (comicData?.data || comicData?.comics || []).map((item: any) => ({
    id: item.slug,
    title: item.title,
    image: item.cover || item.image || '/placeholder.svg',
    type: 'comic' as const,
    link: `/comic/detail/${item.slug}`,
    extra: item.chapter,
  }));

  const novelResults: SearchResult[] = (novelData?.data || novelData?.novels || []).map((item: any) => ({
    id: item.slug,
    title: item.title,
    image: item.image || '/placeholder.svg',
    type: 'novel' as const,
    link: `/novel/detail/${item.slug}`,
    extra: item.rating,
  }));

  const tvshowResults: SearchResult[] = extractShows(tvshowData).map((item: any) => ({
    id: item.id || item.slug,
    title: item.title,
    image: item.poster || item.image || '/placeholder.svg',
    type: 'tvshow' as const,
    link: `/tvshow/detail/${item.id || item.slug}`,
    extra: item.type,
  }));

  const newsResults: SearchResult[] = (newsData?.data || newsData?.articles || []).map((item: any) => ({
    id: item.id,
    title: item.title,
    image: item.image || '/placeholder.svg',
    type: 'news' as const,
    link: `/news/detail/${item.id}/${item.slug}`,
    extra: item.category,
  }));

  const allResults = [
    ...animeResults,
    ...donghuaResults,
    ...comicResults,
    ...novelResults,
    ...tvshowResults,
    ...newsResults,
  ];

  const isLoading = animeLoading || donghuaLoading || comicLoading || novelLoading || tvshowLoading || newsLoading;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search/${encodeURIComponent(query.trim())}`);
    }
  };

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'anime': return <Tv className="h-3 w-3" />;
      case 'donghua': return <Play className="h-3 w-3" />;
      case 'comic': return <BookOpen className="h-3 w-3" />;
      case 'mangasusuku': return <BookOpen className="h-3 w-3" />;
      case 'novel': return <BookOpen className="h-3 w-3" />;
      case 'tvshow': return <Monitor className="h-3 w-3" />;
      case 'news': return <Newspaper className="h-3 w-3" />;
      default: return <Film className="h-3 w-3" />;
    }
  };

  const getTypeColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'anime': return 'bg-purple-500';
      case 'donghua': return 'bg-blue-500';
      case 'comic': return 'bg-green-500';
      case 'mangasusuku': return 'bg-pink-500';
      case 'novel': return 'bg-amber-500';
      case 'tvshow': return 'bg-cyan-500';
      case 'news': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getFilteredResults = () => {
    switch (activeTab) {
      case 'anime': return animeResults;
      case 'donghua': return donghuaResults;
      case 'comic': return comicResults;
      case 'novel': return novelResults;
      case 'tvshow': return tvshowResults;
      case 'news': return newsResults;
      default: return allResults;
    }
  };

  const filteredResults = getFilteredResults();

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
            <Search className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Unified Search</h1>
            <p className="text-muted-foreground text-sm">Search across all content</p>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search anime, donghua, comic, novel, drama..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
          </div>
        </form>

        {searchKeyword && (
          <>
            <p className="text-muted-foreground mb-4">
              Showing results for "<span className="text-foreground font-medium">{searchKeyword}</span>"
            </p>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="flex-wrap h-auto gap-1">
                <TabsTrigger value="all" className="gap-1">
                  All <Badge variant="secondary" className="ml-1">{allResults.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="anime" className="gap-1">
                  <Tv className="h-3 w-3" /> Anime <Badge variant="secondary" className="ml-1">{animeResults.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="donghua" className="gap-1">
                  <Play className="h-3 w-3" /> Donghua <Badge variant="secondary" className="ml-1">{donghuaResults.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="comic" className="gap-1">
                  <BookOpen className="h-3 w-3" /> Comic <Badge variant="secondary" className="ml-1">{comicResults.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="novel" className="gap-1">
                  <BookOpen className="h-3 w-3" /> Novel <Badge variant="secondary" className="ml-1">{novelResults.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="tvshow" className="gap-1">
                  <Monitor className="h-3 w-3" /> TV Show <Badge variant="secondary" className="ml-1">{tvshowResults.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="news" className="gap-1">
                  <Newspaper className="h-3 w-3" /> News <Badge variant="secondary" className="ml-1">{newsResults.length}</Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Results */}
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredResults.map((result, index) => (
                  <Link key={`${result.type}-${result.id}-${index}`} to={result.link} className="group block">
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative aspect-[2/3] overflow-hidden bg-muted">
                        <img
                          src={result.image}
                          alt={result.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          loading="lazy"
                          onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                        <Badge className={`absolute top-2 left-2 ${getTypeColor(result.type)} text-white text-xs gap-1`}>
                          {getTypeIcon(result.type)}
                          {result.type}
                        </Badge>
                        {result.extra && (
                          <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
                            {result.extra}
                          </Badge>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                          {result.title}
                        </h3>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground mb-4">No results found for "{searchKeyword}"</p>
                <p className="text-sm text-muted-foreground">Try different keywords or browse categories</p>
              </div>
            )}
          </>
        )}

        {!searchKeyword && (
          <div className="text-center py-16">
            <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Start Searching</h2>
            <p className="text-muted-foreground">Enter a keyword to search across all content</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedSearch;