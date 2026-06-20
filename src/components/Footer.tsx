import { Link } from 'react-router-dom';
import { Heart, Twitter, Gift, Tv, Film, BookOpen, BookText, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Footer = () => {
  const contentLinks = [
    { to: '/', label: 'Donghua', icon: Film },
    { to: '/anime', label: 'Anime', icon: Tv },
    { to: '/comic', label: 'Comic', icon: BookOpen },
    { to: '/novel', label: 'Novel', icon: BookText },
  ];

  const browseLinks = [
    { to: '/browse/genres', label: 'All Genres' },
    { to: '/browse/ongoing', label: 'Ongoing' },
    { to: '/browse/completed', label: 'Completed' },
    { to: '/library', label: 'My Library' },
  ];

  const socialLinks = [
    { href: 'https://x.com/aishia_network', label: 'Twitter', icon: Twitter, external: true },
    { href: '/tentang', label: 'Tentang Kami', icon: Info, external: false },
  ];

  return (
    <footer className="border-t bg-card/50 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <img
                src="/icon.jpg"
                alt="rizanime"
                className="h-10 w-10 rounded-xl object-cover shadow-lg ring-1 ring-border"
              />
              <span className="text-xl font-bold text-gradient">rizanime</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Platform hiburan untuk nonton Donghua, Anime, baca Comic & Novel dengan subtitle Indonesia.
            </p>
            <Button asChild size="sm" className="gap-2">
              <a
                href="https://qris.zone.id/rizastore?payment_id=rizastore-fxi5sziq"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Gift className="h-4 w-4" />
                Donate via QRIS
              </a>
            </Button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Content</h4>
            <ul className="space-y-3">
              {contentLinks.map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-sm text-foreground/80 hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <link.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Browse */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Browse</h4>
            <ul className="space-y-3">
              {browseLinks.map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-sm text-foreground/80 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Connect</h4>
            <ul className="space-y-3">
              {socialLinks.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-foreground/80 hover:text-primary transition-colors flex items-center gap-2 group"
                    >
                      <link.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-sm text-foreground/80 hover:text-primary transition-colors flex items-center gap-2 group"
                    >
                      <link.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} rizanime. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-destructive fill-destructive" /> by rizanime
          </p>
        </div>
      </div>
    </footer>
  );
};
