import { useQuery } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { novelApi } from '@/lib/novelApi';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Home, List, Settings, Minus, Plus } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useReadingHistory } from '@/hooks/useReadingHistory';
import { useLevel } from '@/hooks/useLevel';

const NovelChapter = () => {
  const { novelSlug, chapterSlug, slug, extra } = useParams<{ novelSlug?: string; chapterSlug?: string; slug?: string; extra?: string }>();
  const navigate = useNavigate();
  const [fontSize, setFontSize] = useState(18);
  const [showSettings, setShowSettings] = useState(false);
  const { addToHistory } = useReadingHistory();
  const { onReadChapter } = useLevel();
  const xpGrantedRef = useRef<string | null>(null);

  // Handle multiple route formats including /novel/read/:novelSlug/:extra/:chapterSlug
  const isSlugOnlyRoute = !!slug && !novelSlug;
  const effectiveNovelSlug = novelSlug || slug?.split('/')[0] || '';
  const effectiveChapterSlug = extra ? chapterSlug : (chapterSlug || slug || '');

  const { data, isLoading } = useQuery({
    queryKey: ['novel-chapter', effectiveNovelSlug, effectiveChapterSlug],
    queryFn: () => {
      // Use chapter slug for the API call
      return novelApi.getChapter(effectiveChapterSlug || slug!);
    },
    enabled: !!(effectiveChapterSlug || slug),
  });

  // Helper to extract navigation slug (handles both string and object)
  const extractNavSlug = (nav: any): string | null => {
    if (!nav) return null;
    if (typeof nav === 'string') return nav;
    if (typeof nav === 'object' && nav.slug) return nav.slug;
    return null;
  };

  const prevSlug = extractNavSlug(data?.navigation?.prev);
  const nextSlug = extractNavSlug(data?.navigation?.next);

  // Load saved font size
  useEffect(() => {
    const saved = localStorage.getItem('novel-font-size');
    if (saved) setFontSize(Number(saved));
  }, []);

  // Save font size
  useEffect(() => {
    localStorage.setItem('novel-font-size', String(fontSize));
  }, [fontSize]);

  // Track reading history and grant XP
  useEffect(() => {
    if (data?.title && (novelSlug || slug)) {
      const chapterKey = `${effectiveNovelSlug}-${effectiveChapterSlug}`;
      
      addToHistory({
        type: 'novel',
        slug: effectiveNovelSlug || slug || '',
        title: data.title.replace(/Chapter.*$/i, '').trim() || effectiveNovelSlug,
        cover: '',
        lastChapter: data.title,
        lastChapterSlug: effectiveChapterSlug || slug || '',
      });
      
      // Grant XP only once per chapter
      if (xpGrantedRef.current !== chapterKey) {
        xpGrantedRef.current = chapterKey;
        onReadChapter();
      }
    }
  }, [data, novelSlug, chapterSlug, slug, effectiveNovelSlug, effectiveChapterSlug, addToHistory, onReadChapter]);

  if (isLoading) return <LoadingSkeleton />;

  if (!data?.content) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">Chapter not found</p>
        <Link to="/novel">
          <Button className="mt-4">Back to Novels</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <div className="sticky top-16 z-40 bg-card/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link to={`/novel/sakuranovel/detail/${effectiveNovelSlug || slug}`}>
                <Button variant="ghost" size="sm">
                  <List className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Chapters</span>
                </Button>
              </Link>
              <Link to="/novel">
                <Button variant="ghost" size="sm">
                  <Home className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <h1 className="text-sm font-semibold truncate max-w-[200px] sm:max-w-none">
              {data.title}
            </h1>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="h-4 w-4" />
              </Button>
              {prevSlug ? (
                <Link to={`/novel/sakuranovel/chapter/${prevSlug}`}>
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
              {nextSlug ? (
                <Link to={`/novel/sakuranovel/chapter/${nextSlug}`}>
                  <Button variant="outline" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="flex items-center justify-center gap-4 py-3 border-t mt-3">
              <span className="text-sm text-muted-foreground">Font Size:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFontSize(Math.max(14, fontSize - 2))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-sm w-8 text-center">{fontSize}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFontSize(Math.min(28, fontSize + 2))}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardContent className="p-6 md:p-10">
            <article
              className="prose prose-neutral dark:prose-invert max-w-none"
              style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
            >
              {data.content.map((block: { type: string; data: string }, index: number) => {
                if (block.type === 'text') {
                  return (
                    <p key={index} className="mb-4">
                      {block.data}
                    </p>
                  );
                }
                if (block.type === 'image') {
                  return (
                    <img
                      key={index}
                      src={block.data}
                      alt=""
                      className="w-full rounded-lg my-4"
                    />
                  );
                }
                return null;
              })}
            </article>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="sticky bottom-0 bg-card/95 backdrop-blur border-t p-4">
        <div className="container mx-auto flex items-center justify-between max-w-3xl">
          {prevSlug ? (
            <Link to={`/novel/sakuranovel/chapter/${prevSlug}`}>
              <Button variant="default">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
            </Link>
          ) : (
            <Button variant="default" disabled>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
          )}

          <Link to={`/novel/sakuranovel/detail/${effectiveNovelSlug || slug}`}>
            <Button variant="outline">
              <List className="h-4 w-4 mr-2" />
              All Chapters
            </Button>
          </Link>

          {nextSlug ? (
            <Link to={`/novel/sakuranovel/chapter/${nextSlug}`}>
              <Button variant="default">
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          ) : (
            <Button variant="default" disabled>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NovelChapter;
