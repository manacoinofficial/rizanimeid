import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Library, Tags, Clock, CheckCircle, Tv, Play, BookOpen, Newspaper, Download, BookMarked, FileText, Sparkles, Send, Code, LogIn, LogOut, ShieldCheck, ChevronDown, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ||
    user?.email?.split('@')[0] ||
    'User';
  const avatarUrl = (user?.user_metadata?.avatar_url as string | undefined) || undefined;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${searchQuery}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const primaryLinks = [
    { to: '/', label: 'Donghua', icon: Play },
    { to: '/anime', label: 'Anime', icon: Tv },
    { to: '/tvshow', label: 'TV Show', icon: Tv },
    { to: '/sakanaai', label: 'Rizanime AI', icon: Sparkles },
  ];

  const readingLinks = [
    { to: '/comic', label: 'Comic', icon: BookOpen },
    { to: '/mangasusuku', label: 'Mangasusuku', icon: BookMarked },
    { to: '/novel', label: 'Novel', icon: BookOpen },
    { to: '/news', label: 'Berita', icon: Newspaper },
  ];

  const browseLinks = [
    { to: '/browse/genres', label: 'Genres', icon: Tags },
    { to: '/browse/ongoing', label: 'Ongoing', icon: Clock },
    { to: '/browse/completed', label: 'Completed', icon: CheckCircle },
    { to: '/library', label: 'Library', icon: Library },
  ];

  const moreLinks = [
    { to: '/install', label: 'Aplikasi', icon: Download },
    { to: '/doc', label: 'Dokumentasi', icon: FileText },
    { to: '/api', label: 'API', icon: Code },
    { to: '/request', label: 'Request', icon: Send },
    { to: '/tentang', label: 'Tentang Kami', icon: Sparkles },
  ];

  const mobileAllLinks = [...primaryLinks, ...readingLinks, ...moreLinks];

  return (
    <nav className="sticky top-0 z-50 w-full border-b glass">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/icon.jpg"
              alt="rizanime"
              className="h-9 w-9 rounded-xl object-cover shadow-lg ring-1 ring-border"
            />
            <span className="text-xl font-bold text-gradient hidden sm:block">
              rizanime
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {primaryLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent rounded-lg transition-colors flex items-center gap-1.5"
              >
                <link.icon className="h-4 w-4" />
                <span className="hidden xl:inline">{link.label}</span>
              </Link>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent rounded-lg transition-colors flex items-center gap-1.5 focus:outline-none">
                <BookOpen className="h-4 w-4" />
                <span className="hidden xl:inline">Bacaan</span>
                <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {readingLinks.map((l) => (
                  <DropdownMenuItem key={l.to} asChild>
                    <Link to={l.to} className="cursor-pointer">
                      <l.icon className="h-4 w-4 mr-2" />
                      {l.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent rounded-lg transition-colors flex items-center gap-1.5 focus:outline-none">
                <Tags className="h-4 w-4" />
                <span className="hidden xl:inline">Jelajah</span>
                <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {browseLinks.map((l) => (
                  <DropdownMenuItem key={l.to} asChild>
                    <Link to={l.to} className="cursor-pointer">
                      <l.icon className="h-4 w-4 mr-2" />
                      {l.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent rounded-lg transition-colors flex items-center gap-1.5 focus:outline-none">
                <span className="hidden xl:inline">Lainnya</span>
                <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {moreLinks.map((l) => (
                  <DropdownMenuItem key={l.to} asChild>
                    <Link to={l.to} className="cursor-pointer">
                      <l.icon className="h-4 w-4 mr-2" />
                      {l.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Search Bar & Actions - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-44 lg:w-56 pl-9 bg-secondary/50 border-transparent focus:border-primary/50 focus:bg-background transition-all"
              />
            </form>
            <ThemeToggle />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <Avatar className="h-9 w-9 border-2 border-primary/30 hover:border-primary transition-colors">
                    {avatarUrl && <AvatarImage src={avatarUrl} />}
                    <AvatarFallback>{displayName[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel>
                    <div className="font-medium truncate">{displayName}</div>
                    <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer">
                        <ShieldCheck className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/library" className="cursor-pointer">
                      <Library className="h-4 w-4 mr-2" />
                      Library
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm" className="gap-1.5">
                <Link to="/auth">
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            {user ? (
              <Avatar className="h-8 w-8 border-2 border-primary/30">
                {avatarUrl && <AvatarImage src={avatarUrl} />}
                <AvatarFallback className="text-xs">{displayName[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
            ) : null}
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
              {mobileAllLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-3 py-2.5 text-sm font-medium bg-secondary/50 hover:bg-secondary text-foreground rounded-lg transition-colors flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <link.icon className="h-4 w-4 text-muted-foreground" />
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {browseLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-3 py-2.5 text-sm font-medium bg-accent/50 hover:bg-accent text-foreground rounded-lg transition-colors flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-2 text-sm">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium truncate text-foreground">{displayName}</span>
                  </div>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium bg-primary/10 text-primary rounded-lg"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Admin Panel
                    </Link>
                  )}
                  <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => { signOut(); setMobileMenuOpen(false); }}>
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button asChild className="w-full gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <Link to="/auth">
                    <LogIn className="h-4 w-4" />
                    Login / Daftar
                  </Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
