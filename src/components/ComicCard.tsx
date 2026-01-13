import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

interface ComicCardProps {
  title: string;
  slug: string;
  cover: string;
  chapter?: string;
  date?: string;
  type?: string;
  rating?: string;
  isLoading?: boolean;
  linkPrefix?: string;
}

export const ComicCard = ({ 
  title, 
  slug, 
  cover, 
  chapter, 
  date, 
  type, 
  rating, 
  isLoading = false,
  linkPrefix = '/comic'
}: ComicCardProps) => {
  
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="aspect-[3/4] rounded-lg bg-muted mb-2" />
        <div className="h-4 bg-muted rounded w-3/4 mb-2" />
        <div className="flex gap-2">
          <div className="h-5 bg-muted rounded w-16" />
          <div className="h-5 bg-muted rounded w-12" />
        </div>
      </div>
    );
  }

  return (
    <Link 
      to={`${linkPrefix}/detail/${slug}`} 
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:rounded-lg"
      aria-label={`Baca ${title} - ${chapter || 'komik terbaru'}`}
    >
      <div className="relative overflow-hidden rounded-lg bg-card shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.99]">
        {/* Cover Image */}
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={cover}
            alt={`Cover komik ${title}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = '/images/placeholder-comic.jpg';
              e.currentTarget.alt = 'Cover tidak tersedia';
            }}
          />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
          {/* Title */}
          <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight">
            {title}
          </h3>
          
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {type && (
              <Badge 
                variant="secondary" 
                className="text-xs capitalize max-w-[100px] truncate"
                title={type}
              >
                {type}
              </Badge>
            )}
            
            {chapter && (
              <Badge 
                variant="outline" 
                className="text-xs text-white border-white/30 bg-black/20 backdrop-blur-sm"
              >
                {chapter}
              </Badge>
            )}
            
            {rating && (
              <div className="flex items-center gap-1 ml-auto bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-white font-medium">{rating}</span>
              </div>
            )}
          </div>
          
          {/* Date */}
          {date && (
            <p className="text-xs text-gray-300/90 font-medium">
              {date}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};
