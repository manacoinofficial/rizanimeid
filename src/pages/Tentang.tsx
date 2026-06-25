import { Heart, Gift, ExternalLink, Sparkles, Tv, BookOpen, Film, Newspaper } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const features = [
  { icon: Tv, label: 'Anime & Donghua', desc: 'Streaming dengan subtitle Indonesia' },
  { icon: BookOpen, label: 'Comic & Novel', desc: 'Baca manga, manhwa, dan light novel' },
  { icon: Film, label: 'TV Show & Drama', desc: 'Film, serial, dan drama Asia' },
  { icon: Newspaper, label: 'Berita Anime', desc: 'Update berita dunia anime terbaru' },
];

export default function Tentang() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <div className="inline-flex h-16 w-16 rounded-2xl bg-gradient-primary items-center justify-center shadow-lg mb-4">
          <Sparkles className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-bold text-gradient mb-3">Tentang rizanime</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Platform hiburan terlengkap untuk para penggemar anime, donghua, comic, dan novel di Indonesia — gratis, tanpa iklan mengganggu.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-12">
        {features.map((f) => (
          <Card key={f.label} className="hover-lift">
            <CardContent className="p-5 flex gap-4 items-start">
              <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                <f.icon className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <div className="font-semibold mb-1">{f.label}</div>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-primary/30 bg-gradient-to-br from-accent/40 to-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-destructive fill-destructive" />
            Dukung Kami
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            rizanime dijalankan secara mandiri. Setiap dukunganmu — sekecil apa pun — membantu kami menutupi biaya server, API, dan pengembangan fitur baru. Terima kasih sudah mempercayai kami!
          </p>
          <Button asChild size="lg" className="w-full sm:w-auto gap-2">
            <a
              href="https://qris.zone.id/rizastore"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Gift className="h-4 w-4" />
              Donate via QRIS
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
