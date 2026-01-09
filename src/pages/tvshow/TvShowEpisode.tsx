import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { tvshowApi, TvShowEpisodeServerRef } from '@/lib/tvshowApi';
import { useLevel } from '@/hooks/useLevel';
import { LoadingGrid } from '@/components/LoadingSkeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, ChevronLeft, ChevronRight, Tv } from 'lucide-react';

const TvShowEpisode = () => {
  const { id } = useParams<{ id: string }>();
  const { onWatchEpisode } = useLevel();

  const [embedUrl, setEmbedUrl] = useState<string>('');
  const [loadingEmbed, setLoadingEmbed] = useState(false);
  const [activeResolution, setActiveResolution] = useState<string>('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['tvshow-episode', id],
    queryFn: () => tvshowApi.getEpisode(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (data?.data) {
      onWatchEpisode();
    }
  }, [data?.data, onWatchEpisode]);

  const episode = data?.data;

  const serverRefs: TvShowEpisodeServerRef[] = useMemo(() => {
    if (!episode) return [];
    // Winbu format: `server`
    const winbuServers = (episode as any).server as TvShowEpisodeServerRef[] | undefined;
    if (Array.isArray(winbuServers)) return winbuServers;
    return [];
  }, [episode]);

  const resolutions = useMemo(() => {
    const ordered: string[] = [];
    for (const s of serverRefs) {
      if (s?.resolution && !ordered.includes(s.resolution)) ordered.push(s.resolution);
    }
    return ordered;
  }, [serverRefs]);

  const serversByResolution = useMemo(() => {
    const map: Record<string, TvShowEpisodeServerRef[]> = {};
    for (const s of serverRefs) {
      if (!s?.resolution) continue;
      map[s.resolution] = map[s.resolution] || [];
      map[s.resolution].push(s);
    }
    return map;
  }, [serverRefs]);

  const fetchEmbed = async (ref: TvShowEpisodeServerRef) => {
    setLoadingEmbed(true);
    try {
      const res = await tvshowApi.getServerEmbedUrl(ref.data);
      setEmbedUrl(res.embed_url || '');
    } finally {
      setLoadingEmbed(false);
    }
  };

  // Pick a default server and resolve embed URL
  useEffect(() => {
    if (!serverRefs.length) return;

    const defaultRef = serverRefs[0];
    if (!activeResolution) setActiveResolution(defaultRef.resolution);

    // Only fetch when we don't have an embed yet (or when episode changes)
    setEmbedUrl('');
    fetchEmbed(defaultRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, serverRefs.length]);

  const prevId = (episode as any)?.navigation?.prev?.id;
  const nextId = (episode as any)?.navigation?.next?.id;

  const getEpisodeTitle = (episodeId?: string) => {
    if (!episodeId || episodeId === '#') return undefined;
    const all = (episode as any)?.all_episodes as { id: string; title: string }[] | undefined;
    return all?.find((e) => e.id === episodeId)?.title;
  };

  if (isLoading) return <LoadingGrid />;

  if (error || !episode) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Episode Not Found</h2>
          <Link to="/tvshow">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to TV Shows
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link to="/tvshow" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to TV Shows
        </Link>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Tv className="w-8 h-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{episode.title}</h1>
          </div>

          {/* Player */}
          <Card>
            <CardContent className="p-0">
              <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
                {loadingEmbed ? (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  </div>
                ) : embedUrl ? (
                  <iframe
                    src={embedUrl}
                    className="w-full h-full"
                    allowFullScreen
                    title={episode.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <p className="text-muted-foreground">No streaming server available.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Servers (Winbu) */}
          {resolutions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Servers</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeResolution || resolutions[0]} onValueChange={setActiveResolution}>
                  <TabsList className="flex flex-wrap h-auto">
                    {resolutions.map((r) => (
                      <TabsTrigger key={r} value={r}>
                        {r}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {resolutions.map((r) => (
                    <TabsContent key={r} value={r}>
                      <div className="flex flex-wrap gap-2">
                        {(serversByResolution[r] || []).map((s, idx) => (
                          <Button
                            key={`${s.server}-${idx}`}
                            variant="outline"
                            size="sm"
                            onClick={() => fetchEmbed(s)}
                            disabled={loadingEmbed}
                          >
                            {s.server}
                          </Button>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            {prevId && prevId !== '#' ? (
              <Link to={`/tvshow/episode/${prevId}`}>
                <Button variant="outline">
                  <ChevronLeft className="w-4 h-4 mr-1" /> {getEpisodeTitle(prevId) || 'Prev'}
                </Button>
              </Link>
            ) : (
              <div />
            )}

            {nextId && nextId !== '#' ? (
              <Link to={`/tvshow/episode/${nextId}`}>
                <Button variant="outline">
                  {getEpisodeTitle(nextId) || 'Next'} <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TvShowEpisode;

