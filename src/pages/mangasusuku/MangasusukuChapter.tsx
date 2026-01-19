import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { mangasusukuApi, getChapterImages } from '@/lib/mangasusukuApi';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Home, List, Lock } from 'lucide-react';
import { useReadingHistory } from '@/hooks/useReadingHistory';
import { useLevel } from '@/hooks/useLevel';

const MangasusukuChapter = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToHistory } = useReadingHistory();
  const { onReadChapter } = useLevel();
  const [showNav, setShowNav] = useState(true);

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['mangasusuku-chapter', slug],
    queryFn: () => mangasusukuApi.getChapter(slug!),
    enabled: !!slug,
  });

  // API returns data at top level (title, images, navigation)
  const chapter = response?.title ? response : response?.data;
  const images = (chapter as any)?.images || [];
  const mangaSlug = slug?.replace(/-chapter-\d+.*$/, '').replace(/-season-\d+-chapter-\d+.*$/, '') || slug?.replace(/-\d+$/, '') || slug;
  
  // Navigation - API returns strings like "#/prev/" or actual slugs
  const navPrev = (chapter as any)?.navigation?.prev;
  const navNext = (chapter as any)?.navigation?.next;
  const prevSlug = navPrev && typeof navPrev === 'string' && !navPrev.includes('#') ? navPrev.replace(/\/$/, '') : null;
  const nextSlug = navNext && typeof navNext === 'string' && !navNext.includes('#') ? navNext.replace(/\/$/, '') : null;

  useEffect(() => {
    if (chapter && slug && mangaSlug) {
      addToHistory({
        slug: mangaSlug,
        title: chapter.title || 'Unknown Chapter',
        cover: '',
        type: 'mangasusuku',
        lastChapter: chapter.title || 'Chapter',
        lastChapterSlug: slug,
      });
      onReadChapter();
    }
  }, [chapter, slug, mangaSlug, addToHistory, onReadChapter]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowNav(currentScrollY < lastScrollY || currentScrollY < 100);
      lastScrollY = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && prevSlug) {
        navigate(`/mangasusuku/chapter/${prevSlug}`);
      } else if (e.key === 'ArrowRight' && nextSlug) {
        navigate(`/mangasusuku/chapter/${nextSlug}`);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlug, nextSlug, navigate]);

  if (isLoading) return <LoadingSkeleton />;

  if (error || !chapter || images.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Lock className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-2">Premium Content</h1>
        <p className="text-muted-foreground mb-6">This chapter is only available for premium users.</p>
        <div className="flex justify-center gap-4">
          <Link to={`/mangasusuku/detail/${mangaSlug}`}><Button variant="outline">Back to Manga</Button></Link>
          <Link to="/mangasusuku"><Button>Browse Manga</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className={`fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur border-b transition-transform duration-300 ${showNav ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/mangasusuku"><Button variant="ghost" size="icon"><Home className="h-4 w-4" /></Button></Link>
            <Link to={`/mangasusuku/detail/${mangaSlug}`}><Button variant="ghost" size="icon"><List className="h-4 w-4" /></Button></Link>
          </div>
          <h1 className="text-sm font-medium truncate max-w-[200px] md:max-w-md">{chapter.title}</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" disabled={!prevSlug} onClick={() => prevSlug && navigate(`/mangasusuku/chapter/${prevSlug}`)}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" disabled={!nextSlug} onClick={() => nextSlug && navigate(`/mangasusuku/chapter/${nextSlug}`)}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto pt-8">
        {images.map((image, index) => (
          <img key={index} src={image} alt={`Page ${index + 1}`} className="w-full" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur border-t">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="outline" disabled={!prevSlug} onClick={() => prevSlug && navigate(`/mangasusuku/chapter/${prevSlug}`)}><ChevronLeft className="h-4 w-4 mr-2" /> Previous</Button>
          <Link to={`/mangasusuku/detail/${mangaSlug}`}><Button variant="ghost">All Chapters</Button></Link>
          <Button variant="outline" disabled={!nextSlug} onClick={() => nextSlug && navigate(`/mangasusuku/chapter/${nextSlug}`)}>Next <ChevronRight className="h-4 w-4 ml-2" /></Button>
        </div>
      </div>
    </div>
  );
};

export default MangasusukuChapter;
