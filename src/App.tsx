import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { useVisitTracker } from "./hooks/useVisitTracker";
import Home from "./pages/Home";
import Ongoing from "./pages/Ongoing";
import Completed from "./pages/Completed";
import Search from "./pages/Search";
import Genres from "./pages/Genres";
import GenreDetail from "./pages/GenreDetail";
import ByYear from "./pages/ByYear";
import Detail from "./pages/Detail";
import Episode from "./pages/Episode";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Tentang from "./pages/Tentang";

// Anime pages
import AnimeHome from "./pages/anime/AnimeHome";
import AnimeOngoing from "./pages/anime/AnimeOngoing";
import AnimeCompleted from "./pages/anime/AnimeCompleted";
import AnimeSchedule from "./pages/anime/AnimeSchedule";
import AnimeDetail from "./pages/anime/AnimeDetail";
import AnimeEpisode from "./pages/anime/AnimeEpisode";
import AnimeSearch from "./pages/anime/AnimeSearch";
import AnimeGenreList from "./pages/anime/AnimeGenreList";
import AnimeByGenre from "./pages/anime/AnimeByGenre";
import AnimeMovies from "./pages/anime/AnimeMovies";
import AnimeAll from "./pages/anime/AnimeAll";
import JDrama from "./pages/anime/JDrama";
import LiveAction from "./pages/anime/LiveAction";
import DramaDetail from "./pages/anime/DramaDetail";

import LiveActionDetail from "./pages/anime/LiveActionDetail";

// Comic pages
import ComicHome from "./pages/comic/ComicHome";
import ComicGenres from "./pages/comic/ComicGenres";
import ComicByGenre from "./pages/comic/ComicByGenre";
import ComicByType from "./pages/comic/ComicByType";
import ComicSearch from "./pages/comic/ComicSearch";

// News pages
import NewsHome from "./pages/news/NewsHome";

// Novel pages
import NovelHome from "./pages/novel/NovelHome";
import NovelGenre from "./pages/novel/NovelGenre";
import NovelSearch from "./pages/novel/NovelSearch";
import NovelDetail from "./pages/novel/NovelDetail";
import NovelChapter from "./pages/novel/NovelChapter";
import NovelGenres from "./pages/novel/NovelGenres";
import NovelPopular from "./pages/novel/NovelPopular";
import NovelLatest from "./pages/novel/NovelLatest";

// Comic detail pages
import ComicDetail from "./pages/comic/ComicDetail";
import ComicChapter from "./pages/comic/ComicChapter";

// Mangasusuku pages
import MangasusukuHome from "./pages/mangasusuku/MangasusukuHome";
import MangasusukuLatest from "./pages/mangasusuku/MangasusukuLatest";
import MangasusukuPopular from "./pages/mangasusuku/MangasusukuPopular";
import MangasusukuList from "./pages/mangasusuku/MangasusukuList";
import MangasusukuGenres from "./pages/mangasusuku/MangasusukuGenres";
import MangasusukuByGenre from "./pages/mangasusuku/MangasusukuByGenre";
import MangasusukuDetail from "./pages/mangasusuku/MangasusukuDetail";
import MangasusukuChapter from "./pages/mangasusuku/MangasusukuChapter";

// Unified pages
import UnifiedGenres from "./pages/unified/UnifiedGenres";
import UnifiedOngoing from "./pages/unified/UnifiedOngoing";
import UnifiedCompleted from "./pages/unified/UnifiedCompleted";
import UnifiedSearch from "./pages/UnifiedSearch";

// TV Show pages
import TvShowHome from "./pages/tvshow/TvShowHome";
import TvShowDetail from "./pages/tvshow/TvShowDetail";
import TvShowEpisode from "./pages/tvshow/TvShowEpisode";
import TvShowSearch from "./pages/tvshow/TvShowSearch";
import TvShowGenres from "./pages/tvshow/TvShowGenres";
import TvShowByGenre from "./pages/tvshow/TvShowByGenre";
import TvShowAll from "./pages/tvshow/TvShowAll";
import TvShowSchedule from "./pages/tvshow/TvShowSchedule";
import TvShowList from "./pages/tvshow/TvShowList";

// Library page
import Library from "./pages/Library";
import Install from "./pages/Install";

// Doc, API and AI pages
import Doc from "./pages/Doc";
import SakanaAI from "./pages/SakanaAI";
import Api from "./pages/Api";
import Request from "./pages/Request";

const queryClient = new QueryClient();

const VisitTracker = () => {
  useVisitTracker();
  return null;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <VisitTracker />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/ongoing" element={<Ongoing />} />
                <Route path="/completed" element={<Completed />} />
                <Route path="/search/:keyword" element={<UnifiedSearch />} />
                <Route path="/search" element={<UnifiedSearch />} />
                <Route path="/genres" element={<Genres />} />
                <Route path="/genre/:slug" element={<GenreDetail />} />
                <Route path="/by-year" element={<ByYear />} />
                <Route path="/detail/:slug" element={<Detail />} />
                <Route path="/episode/:slug" element={<Episode />} />
                
                {/* Anime Routes */}
                <Route path="/anime" element={<AnimeHome />} />
                <Route path="/anime/ongoing" element={<AnimeOngoing />} />
                <Route path="/anime/completed" element={<AnimeCompleted />} />
                <Route path="/anime/schedule" element={<AnimeSchedule />} />
                <Route path="/anime/detail/:slug" element={<AnimeDetail />} />
                <Route path="/anime/episode/:slug" element={<AnimeEpisode />} />
                <Route path="/anime/search/:keyword" element={<AnimeSearch />} />
                <Route path="/anime/genres" element={<AnimeGenreList />} />
                <Route path="/anime/genre/:genre" element={<AnimeByGenre />} />
                <Route path="/anime/movies" element={<AnimeMovies />} />
                <Route path="/anime/all" element={<AnimeAll />} />
                <Route path="/anime/j-drama" element={<JDrama />} />
                <Route path="/anime/live-action" element={<LiveAction />} />
                <Route path="/anime/drama/:slug" element={<DramaDetail />} />
                <Route path="/anime/live-action/:slug" element={<LiveActionDetail />} />

                {/* Comic Routes */}
                <Route path="/comic" element={<ComicHome />} />
                <Route path="/comic/genres" element={<ComicGenres />} />
                <Route path="/comic/genre/:slug" element={<ComicByGenre />} />
                <Route path="/comic/bacakomik/genre/:slug" element={<ComicByGenre />} />
                <Route path="/comic/type/:type" element={<ComicByType />} />
                <Route path="/comic/search/:query" element={<ComicSearch />} />
                <Route path="/comic/detail/:slug" element={<ComicDetail />} />
                <Route path="/comic/bacakomik/detail/:slug" element={<ComicDetail />} />
                <Route path="/comic/chapter/:slug" element={<ComicChapter />} />
                <Route path="/comic/bacakomik/chapter/:slug" element={<ComicChapter />} />

                {/* Mangasusuku Routes */}
                <Route path="/mangasusuku" element={<MangasusukuHome />} />
                <Route path="/mangasusuku/latest" element={<MangasusukuLatest />} />
                <Route path="/mangasusuku/popular" element={<MangasusukuPopular />} />
                <Route path="/mangasusuku/list" element={<MangasusukuList />} />
                <Route path="/mangasusuku/genres" element={<MangasusukuGenres />} />
                <Route path="/mangasusuku/genre/:genreId" element={<MangasusukuByGenre />} />
                <Route path="/mangasusuku/detail/:slug" element={<MangasusukuDetail />} />
                <Route path="/mangasusuku/chapter/:slug" element={<MangasusukuChapter />} />

                {/* News Routes */}
                <Route path="/news" element={<NewsHome />} />

                {/* Novel Routes */}
                <Route path="/novel" element={<NovelHome />} />
                <Route path="/novel/genre/:genreId" element={<NovelGenre />} />
                <Route path="/novel/genres" element={<NovelGenres />} />
                <Route path="/novel/popular" element={<NovelPopular />} />
                <Route path="/novel/latest" element={<NovelLatest />} />
                <Route path="/novel/search/:keyword" element={<NovelSearch />} />
                <Route path="/novel/detail/:slug" element={<NovelDetail />} />
                <Route path="/novel/meionovel/detail/:slug" element={<NovelDetail />} />
                <Route path="/novel/chapter/:novelSlug/:chapterSlug" element={<NovelChapter />} />
                <Route path="/novel/read/:slug" element={<NovelChapter />} />
                <Route path="/novel/read/:novelSlug/:chapterSlug" element={<NovelChapter />} />
                <Route path="/novel/read/:novelSlug/:extra/:chapterSlug" element={<NovelChapter />} />
                <Route path="/novel/meionovel/chapter/:slug" element={<NovelChapter />} />

                {/* Library Route */}
                <Route path="/library" element={<Library />} />

                {/* Unified Routes */}
                <Route path="/browse/genres" element={<UnifiedGenres />} />
                <Route path="/browse/ongoing" element={<UnifiedOngoing />} />
                <Route path="/browse/completed" element={<UnifiedCompleted />} />

                {/* Request Route */}
                <Route path="/request" element={<Request />} />

                {/* TV Show Routes */}
                <Route path="/tvshow" element={<TvShowHome />} />
                <Route path="/tvshow/film/:id" element={<TvShowDetail type="film" />} />
                <Route path="/tvshow/series/:id" element={<TvShowDetail type="series" />} />
                <Route path="/tvshow/episode/:id" element={<TvShowEpisode />} />
                <Route path="/tvshow/search" element={<TvShowSearch />} />
                <Route path="/tvshow/genres" element={<TvShowGenres />} />
                <Route path="/tvshow/genre/:slug" element={<TvShowByGenre />} />
                <Route path="/tvshow/all" element={<TvShowAll />} />
                <Route path="/tvshow/schedule" element={<TvShowSchedule />} />
                <Route path="/tvshow/list" element={<TvShowList />} />

                {/* Install PWA Route */}
                <Route path="/install" element={<Install />} />

                {/* Doc, API and AI Routes */}
                <Route path="/doc" element={<Doc />} />
                <Route path="/sakanaai" element={<SakanaAI />} />
                <Route path="/api" element={<Api />} />

                {/* Auth, Admin, About */}
                <Route path="/auth" element={<Auth />} />
                <Route path="/login" element={<Navigate to="/auth" replace />} />
                <Route path="/register" element={<Navigate to="/auth" replace />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/tentang" element={<Tentang />} />
                <Route path="/about" element={<Navigate to="/tentang" replace />} />

                {/* Novel sakuranovel chapter routes */}
                <Route path="/novel/sakuranovel/chapter/:slug" element={<NovelChapter />} />
                <Route path="/novel/sakuranovel/chapter/:novelSlug/:chapterSlug" element={<NovelChapter />} />

                {/* Aliases (avoid 404 for old/expected URLs) */}
                <Route path="/history" element={<Navigate to="/library" replace />} />
                <Route path="/favorites" element={<Navigate to="/library" replace />} />
                <Route path="/favorit" element={<Navigate to="/library" replace />} />
                <Route path="/bookmark" element={<Navigate to="/library" replace />} />

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
        <Analytics />
        <SpeedInsights />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
