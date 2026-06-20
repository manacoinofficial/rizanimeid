import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { newsApi, NEWS_SOURCES, NewsSource, NewsItem } from '@/lib/newsApi';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ExternalLink, Calendar, Newspaper } from 'lucide-react';

const formatDate = (raw?: string) => {
  if (!raw) return '';
  const d = new Date(raw);
  if (!isNaN(d.getTime())) {
    return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
  }
  return raw;
};

const NewsHome = () => {
  const [source, setSource] = useState<NewsSource>('antara');

  const { data: items = [], isLoading, isError } = useQuery({
    queryKey: ['news', source],
    queryFn: () => newsApi.getBySource(source),
    staleTime: 5 * 60 * 1000,
  });

  const current = NEWS_SOURCES.find((s) => s.id === source)!;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
          <Newspaper className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Berita</h1>
          <p className="text-sm text-muted-foreground">{current.description}</p>
        </div>
      </div>

      <Tabs value={source} onValueChange={(v) => setSource(v as NewsSource)} className="mb-6">
        <TabsList className="flex-wrap h-auto gap-1 bg-transparent p-0">
          {NEWS_SOURCES.map((s) => (
            <TabsTrigger
              key={s.id}
              value={s.id}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border rounded-lg px-4 py-2"
            >
              {s.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : isError || items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            {isError ? 'Sumber berita ini sedang tidak tersedia.' : 'Belum ada berita.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item: NewsItem, idx: number) => {
            const img = item.image || item.thumbnail;
            return (
              <a
                key={`${item.link}-${idx}`}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <Card className="overflow-hidden h-full hover:shadow-xl transition-all hover:-translate-y-0.5">
                  {img ? (
                    <div className="aspect-video overflow-hidden bg-muted">
                      <img
                        src={img}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-primary/10 flex items-center justify-center">
                      <Newspaper className="h-10 w-10 text-primary/40" />
                    </div>
                  )}
                  <div className="p-4 space-y-2">
                    {item.category && (
                      <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                    )}
                    <h3 className="font-semibold text-sm line-clamp-3 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    {item.caption && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{item.caption}</p>
                    )}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                      <span className="flex items-center gap-1">
                        {item.date && <><Calendar className="h-3 w-3" />{formatDate(item.date)}</>}
                      </span>
                      <span className="flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        Baca <ExternalLink className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </Card>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NewsHome;
