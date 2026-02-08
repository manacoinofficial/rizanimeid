import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Home, Volume2, Subtitles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { aniwatchApi, AniwatchServer } from '@/lib/aniwatchApi';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useReadingHistory } from '@/hooks/useReadingHistory';
import { useLevel } from '@/hooks/useLevel';

export default function EnAnimeEpisode() {
  const { episodeId } = useParams<{ episodeId: string }>();
  const navigate = useNavigate();
  const [selectedServer, setSelectedServer] = useState<string>('vidstreaming');
  const [category, setCategory] = useState<'sub' | 'dub'>('sub');
  const [streamingUrl, setStreamingUrl] = useState('');
  const { addToHistory } = useReadingHistory();
  const { onWatchEpisode } = useLevel();
  const xpGrantedRef = useRef<string | null>(null);

  // Get servers
  const { data: serversData, isLoading: serversLoading } = useQuery({
    queryKey: ['en-anime-servers', episodeId],
    queryFn: () => aniwatchApi.getServers(episodeId!),
    enabled: !!episodeId,
  });

  // Get sources
  const { data: sourcesData, isLoading: sourcesLoading, refetch: refetchSources } = useQuery({
    queryKey: ['en-anime-sources', episodeId, selectedServer, category],
    queryFn: () => aniwatchApi.getEpisodeSources(episodeId!, selectedServer, category),
    enabled: !!episodeId,
  });

  const servers = serversData?.data;
  const sources = sourcesData?.data;

  // Set streaming URL when sources change
  useEffect(() => {
    if (sources?.sources && sources.sources.length > 0) {
      setStreamingUrl(sources.sources[0].url);
    }
  }, [sources]);

  // Track history and grant XP
  useEffect(() => {
    if (episodeId && servers) {
      const animeId = episodeId.split('?')[0].replace(/-episode-\d+$/, '');
      
      addToHistory({
        type: 'en-anime',
        slug: animeId,
        title: animeId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        cover: '',
        lastEpisode: servers.episodeNo?.toString() || '',
        lastEpisodeId: episodeId,
      });
      
      if (xpGrantedRef.current !== episodeId) {
        xpGrantedRef.current = episodeId;
        onWatchEpisode();
      }
    }
  }, [episodeId, servers, addToHistory, onWatchEpisode]);

  const handleServerChange = (serverName: string) => {
    setSelectedServer(serverName);
  };

  const handleCategoryChange = (newCategory: 'sub' | 'dub') => {
    setCategory(newCategory);
  };

  // Navigation helpers
  const getAdjacentEpisode = (direction: 'prev' | 'next') => {
    if (!servers) return null;
    const currentEp = servers.episodeNo;
    const newEp = direction === 'prev' ? currentEp - 1 : currentEp + 1;
    if (newEp < 1) return null;
    
    // Construct episode ID (format: anime-id?ep=number)
    const baseId = episodeId?.split('?')[0].replace(/-episode-\d+$/, '');
    return `${baseId}?ep=${newEp}`;
  };

  const prevEpisode = getAdjacentEpisode('prev');
  const nextEpisode = getAdjacentEpisode('next');
  const animeId = episodeId?.split('?')[0].replace(/-episode-\d+$/, '');

  const isLoading = serversLoading || sourcesLoading;

  return (
    <div className="min-h-screen pb-8">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            Episode {servers?.episodeNo || '...'}
          </h1>
          <p className="text-sm text-muted-foreground capitalize">
            {animeId?.replace(/-/g, ' ')}
          </p>
        </div>

        {/* Video Player */}
        <div className="relative w-full bg-black rounded-lg overflow-hidden shadow-hover mb-6">
          <div className="aspect-video">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : streamingUrl ? (
              <iframe
                src={streamingUrl}
                className="w-full h-full"
                allowFullScreen
                title={`Episode ${servers?.episodeNo}`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <p className="text-muted-foreground">No streaming source available</p>
              </div>
            )}
          </div>
        </div>

        {/* Category Selection (Sub/Dub) */}
        <div className="bg-card border rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium mb-3">Audio</h3>
          <div className="flex gap-2 mb-4">
            <Button
              variant={category === 'sub' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoryChange('sub')}
              disabled={!servers?.sub || servers.sub.length === 0}
            >
              <Subtitles className="w-4 h-4 mr-2" />
              SUB ({servers?.sub?.length || 0})
            </Button>
            <Button
              variant={category === 'dub' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoryChange('dub')}
              disabled={!servers?.dub || servers.dub.length === 0}
            >
              <Volume2 className="w-4 h-4 mr-2" />
              DUB ({servers?.dub?.length || 0})
            </Button>
          </div>

          {/* Server Selection */}
          <h3 className="text-sm font-medium mb-3">Server</h3>
          <div className="flex flex-wrap gap-2">
            {(category === 'sub' ? servers?.sub : servers?.dub)?.map((server) => (
              <Button
                key={server.serverId}
                variant={selectedServer === server.serverName.toLowerCase() ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleServerChange(server.serverName.toLowerCase())}
              >
                {server.serverName}
              </Button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-2 mb-6">
          {prevEpisode ? (
            <Button
              onClick={() => navigate(`/en/anime/episode/${prevEpisode}`)}
              variant="outline"
              size="sm"
              className="h-9 px-3"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Prev</span>
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="h-9 px-3" disabled>
              <ChevronLeft className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Prev</span>
            </Button>
          )}

          <Link to={`/en/anime/detail/${animeId}`} className="flex-1">
            <Button variant="default" className="w-full h-9">
              <Home className="h-4 w-4 mr-2" />
              All Episodes
            </Button>
          </Link>

          {nextEpisode ? (
            <Button
              onClick={() => navigate(`/en/anime/episode/${nextEpisode}`)}
              variant="outline"
              size="sm"
              className="h-9 px-3"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="h-9 px-3" disabled>
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>

        {/* Subtitles info */}
        {sources?.tracks && sources.tracks.length > 0 && (
          <div className="bg-card border rounded-lg p-4">
            <h3 className="text-sm font-medium mb-3">Available Subtitles</h3>
            <div className="flex flex-wrap gap-2">
              {sources.tracks
                .filter(t => t.kind === 'captions')
                .map((track, index) => (
                  <span
                    key={index}
                    className="text-xs bg-muted px-2 py-1 rounded"
                  >
                    {track.label || 'Unknown'}
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
