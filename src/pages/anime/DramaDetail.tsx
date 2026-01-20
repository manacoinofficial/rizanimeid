import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { animeApi, AnimeDetailData } from '@/lib/animeApi';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Star, Play, ArrowLeft, Calendar, Clock, Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { useReadingHistory } from '@/hooks/useReadingHistory';

const DramaDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { getLastRead } = useReadingHistory();

  const { data, isLoading } = useQuery({
    queryKey: ['drama-detail', slug],
    queryFn: () => animeApi.getDramaDetail(slug!),
    enabled: !!slug,
  });

  if (isLoading) return <LoadingSkeleton />;

  // Handle API response - data might be at top level or nested under data
  const rawData = data as any;
  const detail: AnimeDetailData | null = rawData?.data?.title ? rawData.data : rawData?.title ? rawData : null;
  
  if (!detail) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">Drama not found</p>
        <Link to="/anime/j-drama">
          <Button className="mt-4">Back to J-Drama</Button>
        </Link>
      </div>
    );
  }

  const isCurrentFavorite = isFavorite('anime', slug!);
  const lastRead = getLastRead('anime', slug!);

  const handleFavoriteClick = () => {
    toggleFavorite({
      type: 'anime',
      slug: slug!,
      title: detail.title,
      cover: detail.poster,
      rating: detail.score,
      status: detail.status,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={detail.poster}
          alt={detail.title}
          className="w-full h-full object-cover blur-sm scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        <Link to="/anime/j-drama" className="absolute top-4 left-4">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Poster */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <Card className="overflow-hidden w-48 shadow-2xl">
              <img
                src={detail.poster}
                alt={detail.title}
                className="w-full aspect-[2/3] object-cover"
              />
            </Card>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl md:text-4xl font-bold">{detail.title}</h1>
              <Button
                variant={isCurrentFavorite ? "default" : "outline"}
                size="icon"
                onClick={handleFavoriteClick}
              >
                <Heart className={`h-5 w-5 ${isCurrentFavorite ? 'fill-current' : ''}`} />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {detail.score && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {detail.score}
                </Badge>
              )}
              {detail.status && (
                <Badge variant={detail.status === 'Completed' ? 'default' : 'secondary'}>
                  {detail.status}
                </Badge>
              )}
              {detail.type && <Badge variant="outline">{detail.type}</Badge>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {detail.aired && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{detail.aired}</span>
                </div>
              )}
              {detail.duration && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{detail.duration}</span>
                </div>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {detail.genreList?.map((genre, index) => (
                <Badge key={index} variant="outline">
                  {genre.title}
                </Badge>
              ))}
            </div>

            {/* Watch Button */}
            {detail.episodeList && detail.episodeList.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <Link to={`/anime/episode/${detail.episodeList[0].episodeId}`}>
                  <Button size="lg" className="gap-2">
                    <Play className="h-5 w-5" />
                    Watch Episode 1
                  </Button>
                </Link>
                {lastRead?.lastChapterSlug && (
                  <Link to={`/anime/episode/${lastRead.lastChapterSlug}`}>
                    <Button size="lg" variant="secondary" className="gap-2">
                      Continue: Ep {lastRead.lastChapter}
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Synopsis */}
        {detail.synopsis?.paragraphs && (
          <Card className="mt-8">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-3">Synopsis</h2>
              {detail.synopsis.paragraphs.map((p, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed mb-2">{p}</p>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Episodes */}
        {detail.episodeList && detail.episodeList.length > 0 && (
          <Card className="mt-6 mb-8">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Play className="h-5 w-5" />
                Episodes ({detail.episodeList.length})
              </h2>
              <ScrollArea className="h-80">
                <div className="grid gap-2">
                  {detail.episodeList.map((ep, index) => (
                    <Link key={index} to={`/anime/episode/${ep.episodeId}`}>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                        <span className="font-medium">{ep.title}</span>
                        {ep.date && (
                          <span className="text-sm text-muted-foreground">{ep.date}</span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DramaDetail;
