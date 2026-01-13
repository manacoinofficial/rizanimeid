import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { mangasusukuApi, extractMangasusukuGenres } from '@/lib/mangasusukuApi';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { Badge } from '@/components/ui/badge';

const MangasusukuGenres = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['mangasusuku-genres'],
    queryFn: mangasusukuApi.getGenres,
  });

  const genres = extractMangasusukuGenres(data);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-primary bg-clip-text text-transparent">
        Manga Genres
      </h1>

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <div className="flex flex-wrap gap-3">
          {genres.map((genre) => (
            <Link key={genre.slug || genre.id} to={`/mangasusuku/genre/${genre.slug || genre.id}`}>
              <Badge
                variant="secondary"
                className="px-4 py-2 text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {genre.name}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MangasusukuGenres;
