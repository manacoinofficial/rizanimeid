import { Link } from 'react-router-dom';
import { Heart, Twitter, Gift, Tv, Film, BookOpen, BookText, Wallet, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const donationMethods = [
  { name: 'GoPay', number: '085974238938', color: 'bg-[#00AA13]', icon: '💚' },
  { name: 'Dana', number: '085974238938', color: 'bg-[#108EE9]', icon: '💙' },
  { name: 'OVO', number: '085974238938', color: 'bg-[#4C3494]', icon: '💜' },
];

export const Footer = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success('Nomor berhasil disalin!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

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
    { href: 'https://sociabuzz.com/rizaxshanachan/tribe', label: 'Donate', icon: Gift },
    { href: 'https://x.com/aishia_network', label: 'Twitter', icon: Twitter },
  ];

  return (
    <footer className="border-t bg-card/50 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-white">S</span>
              </div>
              <span className="text-xl font-bold text-gradient">sakanan!me</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your premier destination for watching Donghua, Anime, Comics and Light Novels with Indonesian subtitles.
            </p>
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
                  <a 
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-foreground/80 hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <link.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Donation */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Support Us
            </h4>
            <div className="space-y-2">
              {donationMethods.map((method, index) => (
                <Button
                  key={method.name}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-between text-xs h-8 px-2"
                  onClick={() => copyToClipboard(method.number, index)}
                >
                  <span className="flex items-center gap-1">
                    <Badge className={`${method.color} text-white border-0 text-[10px] px-1`}>
                      {method.icon}
                    </Badge>
                    {method.name}
                  </span>
                  {copiedIndex === index ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3 text-muted-foreground" />
                  )}
                </Button>
              ))}
              <p className="text-[10px] text-muted-foreground text-center">
                085974238938
              </p>
            </div>
          </div>
        </div>

        <div className="border-t mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Sakanan!me. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-destructive fill-destructive" /> for sakananime Apis
          </p>
        </div>
      </div>
    </footer>
  );
};
