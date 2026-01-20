import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Play, Star, Film, ArrowLeft, Loader2, Heart, ChevronLeft, ChevronRight, History } from 'lucide-react';
import { dramaboxApi, getEpisodeNumber, getTotalEpisodes, getGenres, getDescription, getRating, getPoster, getTitle, getViews } from '@/lib/dramaboxApi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { useReadingHistory } from '@/hooks/useReadingHistory';

const EPISODES_PER_PAGE = 24;

const DramaBoxDetail = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const { getLastRead } = useReadingHistory();

  const { data, isLoading, error } = useQuery({
    queryKey: ['dramabox-detail', bookId],
    queryFn: () => dramaboxApi.getDetail(bookId!),
    enabled: !!bookId,
  });

  // Get last watched episode
  const lastRead = getLastRead('dramabox', bookId || '');
  const lastWatchedEpisode = lastRead?.lastEpisode ? parseInt(lastRead.lastEpisode) : null;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Handle API response - data might be at top level or nested
  const detail = data?.data || (data as any);
  const hasValidDetail = detail && (detail.title || detail.judul || detail.bookId || detail.id);

  if (error || !hasValidDetail) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center gap-4 px-4 py-20">
        <p className="text-lg text-muted-foreground">Drama not found</p>
        <Button asChild variant="outline">
          <Link to="/dramabox">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to DramaBox
          </Link>
        </Button>
      </div>
    );
  }

  const poster = getPoster(detail);
  const description = getDescription(detail);
  const rating = getRating(detail);
  const genres = getGenres(detail);
  const totalEpisodesCount = getTotalEpisodes(detail);
  const episodes = detail.episodes || detail.episodeList || [];
  const detailBookId = detail.bookId || detail.id || bookId;
  const title = getTitle(detail);
  const views = getViews(detail);

  // Build episode list - use actual episodes or generate from count
  const episodeList = episodes.length > 0 
    ? episodes.map((ep, index) => getEpisodeNumber(ep) || index + 1)
    : Array.from({ length: totalEpisodesCount }, (_, i) => i + 1);

  // Pagination logic
  const totalPages = Math.ceil(episodeList.length / EPISODES_PER_PAGE);
  const startIndex = (currentPage - 1) * EPISODES_PER_PAGE;
  const endIndex = startIndex + EPISODES_PER_PAGE;
  const paginatedEpisodes = episodeList.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to episodes section
    document.getElementById('episodes-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 'ellipsis', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div
        className="relative h-64 bg-cover bg-center md:h-80"
        style={{ backgroundImage: `url(${poster})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      <div className="container mx-auto px-4">
        <div className="relative -mt-32 flex flex-col gap-6 md:flex-row">
          {/* Poster */}
          <div className="mx-auto w-48 flex-shrink-0 md:mx-0">
            <div className="aspect-[2/3] overflow-hidden rounded-lg shadow-xl">
              <img
                src={poster || '/placeholder.svg'}
                alt={title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4 pt-4">
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">
              {title}
            </h1>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {rating && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-yellow-500/90 text-white">
                  <Star className="h-3 w-3" fill="currentColor" />
                  {rating}
                </Badge>
              )}
              {views && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-pink-500/90 text-white">
                  <Heart className="h-3 w-3" fill="currentColor" />
                  {views}
                </Badge>
              )}
              {episodeList.length > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Film className="h-3 w-3" />
                  {episodeList.length} Episodes
                </Badge>
              )}
              {detail.status && (
                <Badge variant="outline">{detail.status}</Badge>
              )}
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <Badge key={genre} variant="secondary">
                    {genre}
                  </Badge>
                ))}
              </div>
            )}

            {/* Watch Button */}
            <div className="flex flex-wrap gap-3">
              {lastWatchedEpisode ? (
                <Button asChild size="lg">
                  <Link to={`/dramabox/watch/${detailBookId}/${lastWatchedEpisode}`}>
                    <History className="mr-2 h-5 w-5" />
                    Resume Episode {lastWatchedEpisode}
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg">
                  <Link to={`/dramabox/watch/${detailBookId}/1`}>
                    <Play className="mr-2 h-5 w-5" fill="currentColor" />
                    Watch Episode 1
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {description && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Synopsis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        )}

        {/* Episodes with Pagination */}
        {episodeList.length > 0 && (
          <Card className="mt-6 mb-8" id="episodes-section">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Episodes ({episodeList.length})</CardTitle>
              {totalPages > 1 && (
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Episode Grid */}
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
                {paginatedEpisodes.map((epNum) => (
                  <Link
                    key={epNum}
                    to={`/dramabox/watch/${detailBookId}/${epNum}`}
                    className="group relative aspect-video overflow-hidden rounded-lg bg-muted transition-all hover:ring-2 hover:ring-primary"
                  >
                    {/* Episode Thumbnail */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                      <span className="text-lg font-bold text-foreground">{epNum}</span>
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                      <Play className="h-6 w-6 text-white" fill="currentColor" />
                    </div>
                    
                    {/* Episode Label */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                      <p className="text-center text-xs font-medium text-white">Ep {epNum}</p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) handlePageChange(currentPage - 1);
                        }}
                        className={currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>

                    {getPageNumbers().map((page, index) => (
                      <PaginationItem key={`${page}-${index}`}>
                        {page === 'ellipsis' ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            href="#"
                            isActive={currentPage === page}
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(page);
                            }}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) handlePageChange(currentPage + 1);
                        }}
                        className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DramaBoxDetail;
