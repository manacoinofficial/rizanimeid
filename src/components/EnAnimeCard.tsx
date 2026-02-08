import { Link } from 'react-router-dom';
import { Play, Star } from 'lucide-react';
import { AniwatchAnime } from '@/lib/aniwatchApi';

interface EnAnimeCardProps {
  anime: AniwatchAnime;
  showEpisodes?: boolean;
}

export function EnAnimeCard({ anime, showEpisodes = true }: EnAnimeCardProps) {
  return (
    <Link to={`/en/anime/detail/${anime.id}`} className="group">
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-muted shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
        <img
          src={anime.poster}
          alt={anime.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Play button on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
            <Play className="w-6 h-6 text-primary-foreground fill-current" />
          </div>
        </div>

        {/* Rating badge */}
        {anime.rating && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 text-yellow-400 text-xs px-2 py-1 rounded">
            <Star className="w-3 h-3 fill-current" />
            {anime.rating}
          </div>
        )}

        {/* Type badge */}
        {anime.type && (
          <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded font-medium">
            {anime.type}
          </div>
        )}

        {/* Episodes badge */}
        {showEpisodes && anime.episodes && (
          <div className="absolute bottom-2 left-2 right-2 flex gap-1 flex-wrap">
            {anime.episodes.sub && (
              <span className="bg-blue-600/90 text-white text-xs px-2 py-0.5 rounded">
                SUB: {anime.episodes.sub}
              </span>
            )}
            {anime.episodes.dub && (
              <span className="bg-purple-600/90 text-white text-xs px-2 py-0.5 rounded">
                DUB: {anime.episodes.dub}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="mt-2">
        <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
          {anime.name}
        </h3>
        {anime.duration && (
          <p className="text-xs text-muted-foreground mt-1">{anime.duration}</p>
        )}
      </div>
    </Link>
  );
}
