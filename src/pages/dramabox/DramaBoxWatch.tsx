import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, ArrowLeft, Loader2 } from 'lucide-react';
import { dramaboxApi } from '@/lib/dramaboxApi';
import { Button } from '@/components/ui/button';

const DramaBoxWatch = () => {
  const { bookId, episode } = useParams<{ bookId: string; episode: string }>();
  const episodeNum = parseInt(episode || '1', 10);

  const { data, isLoading, error } = useQuery({
    queryKey: ['dramabox-stream', bookId, episodeNum],
    queryFn: () => dramaboxApi.getStream(bookId!, episodeNum),
    enabled: !!bookId && !!episodeNum,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center gap-4 px-4 py-20">
        <p className="text-lg text-muted-foreground">Episode not found</p>
        <Button asChild variant="outline">
          <Link to={`/dramabox/detail/${bookId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Details
          </Link>
        </Button>
      </div>
    );
  }

  const stream = data.data;
  const videoUrl = stream.streamUrl || stream.videoUrl || stream.url;

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
        <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-lg bg-black">
          {videoUrl ? (
            <video
              src={videoUrl}
              controls
              autoPlay
              className="h-full w-full"
              controlsList="nodownload"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-white">Video not available</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            disabled={episodeNum <= 1}
            asChild={episodeNum > 1}
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

          <span className="text-sm text-muted-foreground">
            Episode {episodeNum}
            {stream.totalEpisodes && ` / ${stream.totalEpisodes}`}
          </span>

          <Button
            variant="outline"
            disabled={stream.totalEpisodes ? episodeNum >= stream.totalEpisodes : false}
            asChild={!stream.totalEpisodes || episodeNum < stream.totalEpisodes}
          >
            {!stream.totalEpisodes || episodeNum < stream.totalEpisodes ? (
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
      </div>
    </div>
  );
};

export default DramaBoxWatch;
