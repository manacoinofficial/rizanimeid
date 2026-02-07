import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Library, Tags, Clock, CheckCircle, Tv, Play, BookOpen, Newspaper, Clapperboard, Download, BookMarked, FileText, Sparkles, Send, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ThemeToggle';

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${searchQuery}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { to: '/', label: 'Donghua', icon: Play },
    { to: '/anime', label: 'Anime', icon: Tv },
    { to: '/comic', label: 'Comic', icon: BookOpen },
    { to: '/mangasusuku', label: 'Mangasusuku', icon: BookMarked },
    { to: '/novel', label: 'Novel', icon: BookOpen },
    { to: '/news', label: 'Berita', icon: Newspaper },
    { to: '/dramabox', label: 'DramaChina', icon: Clapperboard },
    { to: '/install', label: 'Aplikasi', icon: Download },
    { to: '/tvshow', label: 'TV Show', icon: Tv },
    { to: '/doc', label: 'Doc', icon: FileText },
    { to: '/sakanaai', label: 'SakanaAI', icon: Sparkles },
    { to: '/api', label: 'API', icon: Code },
    { to: '/request', label: 'Request', icon: Send },
  ];

  const browseLinks = [
    { to: '/browse/genres', label: 'Genres', icon: Tags },
    { to: '/browse/ongoing', label: 'Ongoing', icon: Clock },
    { to: '/browse/completed', label: 'Completed', icon: CheckCircle },
    { to: '/library', label: 'Library', icon: Library },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b glass">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="h-9 w-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg">
              <span className="text-lg font-bold text-white">S</span>
            </div>
            <span className="text-xl font-bold text-gradient hidden sm:block">
              sakanan!me
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors flex items-center gap-1.5"
              >
                <link.icon className="h-4 w-4" />
                <span className="hidden xl:inline">{link.label}</span>
              </Link>
            ))}
            <div className="w-px h-6 bg-border mx-2" />
            {browseLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors flex items-center gap-1.5"
              >
                <link.icon className="h-4 w-4" />
                <span className="hidden xl:inline">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Search Bar & Actions - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 lg:w-56 pl-9 bg-secondary/50 border-transparent focus:border-primary/50 focus:bg-background transition-all"
              />
            </form>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-4 animate-slide-up border-t">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9"
                />
              </div>
              <Button type="submit" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </form>

            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-4 py-3 text-sm font-medium text-center bg-secondary/50 hover:bg-secondary rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {browseLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-4 py-3 text-sm font-medium bg-accent/50 hover:bg-accent rounded-lg transition-colors flex items-center justify-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
