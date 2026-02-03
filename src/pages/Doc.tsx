import { Link } from 'react-router-dom';
import { FileText, ExternalLink, BookOpen, Shield, Coins, Users, Zap, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Doc = () => {
  const whitepaperSections = [
    {
      icon: BookOpen,
      title: 'Introduction',
      description: 'Overview of Sakananime platform, mission, and vision for the future of anime streaming.',
      image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80',
    },
    {
      icon: Zap,
      title: 'Technology',
      description: 'Advanced streaming infrastructure, API architecture, and real-time content delivery system.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building a global community of anime, donghua, and manga enthusiasts.',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80',
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'End-to-end encryption, secure authentication, and privacy-first approach.',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80',
    },
    {
      icon: Globe,
      title: 'Multi-Platform',
      description: 'Seamless experience across web, mobile, and PWA applications.',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80',
    },
    {
      icon: Coins,
      title: 'Tokenomics',
      description: 'Future plans for community rewards and engagement tokens.',
      image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&q=80',
    },
  ];

  const externalLinks = [
    {
      title: 'GitHub Repository',
      url: 'https://github.com/sakananime',
      description: 'View our open source projects',
      image: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
    },
    {
      title: 'API Documentation',
      url: 'https://docs.sakananime.com',
      description: 'Developer API reference',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80',
    },
    {
      title: 'Discord Community',
      url: 'https://discord.gg/sakananime',
      description: 'Join our community',
      image: 'https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png',
    },
    {
      title: 'Twitter/X',
      url: 'https://twitter.com/sakananime',
      description: 'Follow for updates',
      image: 'https://abs.twimg.com/responsive-web/client-web/icon-ios.77d25eba.png',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg">
            <FileText className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gradient mb-4">Whitepaper & Documentation</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Comprehensive documentation about Sakananime platform architecture, technology, and future roadmap.
        </p>
      </div>

      {/* Whitepaper Sections */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          Whitepaper
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whitepaperSections.map((section, index) => (
            <Card key={index} className="overflow-hidden hover-lift glow-hover group">
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={section.image}
                  alt={section.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                    <section.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Download Whitepaper CTA */}
      <section className="mb-16">
        <Card className="bg-gradient-primary text-white overflow-hidden">
          <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Download Full Whitepaper</h3>
              <p className="text-white/80">
                Get the complete technical documentation in PDF format.
              </p>
            </div>
            <Button 
              variant="secondary" 
              size="lg" 
              className="shrink-0 gap-2"
              onClick={() => window.open('https://docs.sakananime.com/whitepaper.pdf', '_blank')}
            >
              <FileText className="h-5 w-5" />
              Download PDF
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* External Links */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <ExternalLink className="h-6 w-6 text-primary" />
          External Links
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {externalLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Card className="h-full hover-lift glow-hover group cursor-pointer">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-xl overflow-hidden mb-4 bg-secondary">
                    <img
                      src={link.image}
                      alt={link.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{link.description}</p>
                  <ExternalLink className="h-4 w-4 mt-3 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </section>

      {/* Navigation */}
      <div className="text-center">
        <Link to="/">
          <Button variant="outline" size="lg">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Doc;
