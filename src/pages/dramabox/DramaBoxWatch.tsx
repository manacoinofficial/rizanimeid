import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, ArrowLeft, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { dramaboxApi, getTitle, getPoster, DramaBoxStreamData } from '@/lib/dramaboxApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useReadingHistory } from '@/hooks/useReadingHistory';

const DramaBoxWatch = () => {
  const { bookId, episode } = useParams<{ bookId: string; episode: string }>();
  const episodeNum = parseInt(episode || '1', 10);
  const [retryCount, setRetryCount] = useState(0);
  const { addToHistory } = useReadingHistory();

  // Fetch detail to get title and cover for history
  const { data: detailData } = useQuery({
    queryKey: ['dramabox-detail', bookId],
    queryFn: () => dramaboxApi.getDetail(bookId!),
    enabled: !!bookId,
  });

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['dramabox-stream', bookId, episodeNum, retryCount],
    queryFn: async () => {
      // Try to refresh auth first if we've had failures
      if (retryCount > 0) {
        try {
          await dramaboxApi.refreshAuth();
        } catch (e) {
          console.log('Auth refresh failed, continuing anyway');
        }
      }
      return dramaboxApi.getStream(bookId!, episodeNum);
    },
    enabled: !!bookId && !!episodeNum,
    retry: 2,
    retryDelay: 1000,
  });

  // Add to watch history when episode loads
  useEffect(() => {
    const streamData = data?.data || data;
    const detailInfo = detailData?.data || detailData;
    if (streamData && detailInfo && bookId) {
      addToHistory({
        type: 'dramabox',
        slug: bookId,
        title: getTitle(detailInfo),
        cover: getPoster(detailInfo) || '/placeholder.svg',
        lastEpisode: String(episodeNum),
        lastEpisodeId: String(episodeNum),
      });
    }
  }, [data, detailData, bookId, episodeNum, addToHistory]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    refetch();
  };

  if (isLoading || isRefetching) {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading episode...</p>
      </div>
    );
  }

  // Handle API response - data might be at top level or nested
  const stream = (data?.data || data) as DramaBoxStreamData | undefined;
  const videoUrl = stream?.streamUrl || stream?.videoUrl || (stream as any)?.url;
  const totalEps = stream?.totalEpisodes;

  if (error || !stream) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center gap-4 px-4 py-20">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-lg text-muted-foreground">Failed to load episode</p>
        <div className="flex gap-2">
          <Button onClick={handleRetry} variant="default">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
          <Button asChild variant="outline">
            <Link to={`/dramabox/detail/${bookId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Details
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-4">
          <Link to={`/dramabox/detail/${bookId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Details
          </Link>
        </Button>

        {/* Title */}
        <h1 className="mb-4 text-xl font-bold text-foreground md:text-2xl">
          {stream.title || `Episode ${episodeNum}`}
        </h1>

        {/* Video Player */}
        <Card className="mb-6 overflow-hidden">
          <div className="relative aspect-video w-full bg-black">
            {videoUrl ? (
              <video
                key={videoUrl}
                src={videoUrl}
                controls
                autoPlay
                playsInline
                className="h-full w-full"
                controlsList="nodownload"
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-4">
                <AlertCircle className="h-12 w-12 text-muted-foreground" />
                <p className="text-white">Video not available</p>
                <Button onClick={handleRetry} variant="secondary" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Navigation */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-center text-lg">
              Episode {episodeNum}
              {totalEps && ` of ${totalEps}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="outline"
                disabled={episodeNum <= 1}
                asChild={episodeNum > 1}
                className="flex-1"
              >
                {episodeNum > 1 ? (
                  <Link to={`/dramabox/watch/${bookId}/${episodeNum - 1}`}>
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Previous
                  </Link>
                ) : (
                  <>
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Previous
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                disabled={totalEps ? episodeNum >= totalEps : false}
                asChild={!totalEps || episodeNum < totalEps}
                className="flex-1"
              >
                {!totalEps || episodeNum < totalEps ? (
                  <Link to={`/dramabox/watch/${bookId}/${episodeNum + 1}`}>
                    Next
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                ) : (
                  <>
                    Next
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DramaBoxWatch;
