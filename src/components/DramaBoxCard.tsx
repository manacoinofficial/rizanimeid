import { Link } from 'react-router-dom';
import { Play, Star, Film } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { DramaBoxItem } from '@/lib/dramaboxApi';

interface ExtendedDramaBoxItem extends DramaBoxItem {
  judul?: string;
  total_episode?: string;
}

interface DramaBoxCardProps {
  item: ExtendedDramaBoxItem;
}

const DramaBoxCard = ({ item }: DramaBoxCardProps) => {
  const bookId = item.bookId || item.id;
  const poster = item.poster || item.cover || item.image;
  const title = item.title || item.judul || 'Unknown Title';
  const episodeCount = item.episodes || item.total_episode;

  return (
    <Link
      to={`/dramabox/detail/${bookId}`}
      className="group relative block overflow-hidden rounded-lg bg-card transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={poster || '/placeholder.svg'}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        {/* Play icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="rounded-full bg-primary/90 p-3">
            <Play className="h-6 w-6 text-primary-foreground" fill="currentColor" />
          </div>
        </div>

        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {item.rating && (
            <Badge variant="secondary" className="flex items-center gap-1 bg-yellow-500/90 text-white">
              <Star className="h-3 w-3" fill="currentColor" />
              {item.rating}
            </Badge>
          )}
          {episodeCount && (
            <Badge variant="secondary" className="flex items-center gap-1 bg-primary/90">
              <Film className="h-3 w-3" />
              {episodeCount}
            </Badge>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="line-clamp-2 text-sm font-medium leading-tight text-foreground">
          {title}
        </h3>
        {item.views && (
          <p className="mt-1 text-xs text-muted-foreground">{item.views} views</p>
        )}
      </div>
    </Link>
  );
};

export default DramaBoxCard;
