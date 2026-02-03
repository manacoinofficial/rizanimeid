import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Server, Zap } from "lucide-react";

const BASE_URL = "https://sakananime.vercel.app";

interface EndpointInfo {
  method: string;
  path: string;
  description: string;
  example?: string;
}

const animeEndpoints: EndpointInfo[] = [
  { method: "GET", path: "/anime", description: "Get home/featured anime list" },
  { method: "GET", path: "/anime/detail/{slug}", description: "Get anime detail by slug", example: "https://sakananime/anime/detail/one-piece" },
  { method: "GET", path: "/anime/episode/{slug}", description: "Get episode streaming links", example: "https://sakananime.vercel.app/anime/episode/one-piece-episode-1" },
  { method: "GET", path: "/anime/ongoing", description: "Get ongoing anime list" },
  { method: "GET", path: "/anime/completed", description: "Get completed anime list" },
  { method: "GET", path: "/anime/schedule", description: "Get anime schedule" },
  { method: "GET", path: "/anime/search?q=${keyword}", description: "Search anime", example: "https://sakananime.vercel.app/anime/search?q=naruto" },
  { method: "GET", path: "/anime/genres", description: "Get all anime genres" },
  { method: "GET", path: "/aanime/genre/${slug}", description: "Get anime by genre", example: "https://sakananime.vercel.app/anime/genre/action" },
];

const comicEndpoints: EndpointInfo[] = [
  { method: "GET", path: "/comic", description: "Get home/featured comics" },
  { method: "GET", path: "/comic/type/{type}", description: "Get comics by type (manga, manhwa, manhua)", example: "https://sakananime.vercel.app/comic/type/manga" },
  { method: "GET", path: "/comic/genres", description: "Get all comic genres" },
  { method: "GET", path: "/comic/genre/{slug}", description: "Get comics by genre", example: "https://sakananime.vercel.app/comic/genre/action" },
  { method: "GET", path: "/detail/{slug}", description: "Get comic detail by slug", example: "https://akananime.vercel.app/detail/one-piece" },
  { method: "GET", path: "/comic/chapter/{slug}", description: "Get chapter images", example: "https://sakananime.vercel.app/comic/chapter/one-piece-chapter-1" },
  { method: "GET", path: "/comic/search?q={keyword}", description: "Search comics", example: "https://sakananime.vercel.app/comic/search?q=solo" },
];

const novelEndpoints: EndpointInfo[] = [
  { method: "GET", path: "/novel/sakuranovel/home", description: "Get home/featured novels" },
  { method: "GET", path: "/novel/sakuranovel/home?page={page}", description: "Get novels with pagination", example: "/novel/sakuranovel/home?page=2" },
  { method: "GET", path: "/novel/sakuranovel/detail/{slug}", description: "Get novel detail by slug", example: "/novel/sakuranovel/detail/solo-leveling" },
  { method: "GET", path: "/novel/sakuranovel/read/{slug}", description: "Get chapter content", example: "/novel/sakuranovel/read/solo-leveling-chapter-1" },
  { method: "GET", path: "/novel/sakuranovel/genres", description: "Get all novel genres" },
  { method: "GET", path: "/novel/sakuranovel/genre/{slug}", description: "Get novels by genre", example: "/novel/sakuranovel/genre/action" },
  { method: "GET", path: "/novel/sakuranovel/search?q={keyword}", description: "Search novels", example: "/novel/sakuranovel/search?q=reincarnation" },
  { method: "GET", path: "/novel/sakuranovel/popular", description: "Get popular novels" },
  { method: "GET", path: "/novel/sakuranovel/tags", description: "Get all novel tags" },
  { method: "GET", path: "/novel/sakuranovel/tags/{tag}", description: "Get novels by tag", example: "/novel/sakuranovel/tags/isekai" },
];

const mangasusukuEndpoints: EndpointInfo[] = [
  { method: "GET", path: "/comic/mangasusuku/home", description: "Get home/featured manga" },
  { method: "GET", path: "/comic/mangasusuku/latest", description: "Get latest updates" },
  { method: "GET", path: "/comic/mangasusuku/popular", description: "Get popular manga" },
  { method: "GET", path: "/comic/mangasusuku/list", description: "Get all manga list" },
  { method: "GET", path: "/comic/mangasusuku/genres", description: "Get all genres" },
  { method: "GET", path: "/comic/mangasusuku/genre/{id}/{page}", description: "Get manga by genre", example: "/comic/mangasusuku/genre/action/1" },
  { method: "GET", path: "/comic/mangasusuku/detail/{slug}", description: "Get manga detail", example: "/comic/mangasusuku/detail/one-piece" },
  { method: "GET", path: "/comic/mangasusuku/chapter/{slug}", description: "Get chapter images", example: "/comic/mangasusuku/chapter/one-piece-chapter-1" },
];

const EndpointCard = ({ endpoint }: { endpoint: EndpointInfo }) => (
  <div className="border rounded-lg p-4 hover:border-primary/50 transition-colors">
    <div className="flex items-start gap-3">
      <Badge variant="secondary" className="bg-green-500/20 text-green-500 font-mono">
        {endpoint.method}
      </Badge>
      <div className="flex-1 min-w-0">
        <code className="text-sm text-foreground/90 break-all">{endpoint.path}</code>
        <p className="text-sm text-muted-foreground mt-1">{endpoint.description}</p>
        {endpoint.example && (
          <div className="mt-2 p-2 bg-muted/50 rounded text-xs font-mono text-muted-foreground overflow-x-auto">
            {BASE_URL}{endpoint.example}
          </div>
        )}
      </div>
    </div>
  </div>
);

const Api = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Server className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">API Documentation</h1>
          </div>
          <p className="text-muted-foreground">
            Explore our REST API endpoints for anime, comics, novels, and manga content.
          </p>
          <div className="mt-4 p-3 bg-muted rounded-lg inline-flex items-center gap-2">
            <Code className="h-4 w-4" />
            <code className="text-sm">{BASE_URL}</code>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Quick Start
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              All endpoints return JSON responses. No authentication required for public endpoints.
            </p>
            <div className="bg-muted p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm">
{`// Example: Fetch anime home
fetch('${BASE_URL}/anime')
  .then(res => res.json())
  .then(data => console.log(data));`}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="anime" className="w-full">
          <TabsList className="w-full grid grid-cols-4 mb-6">
            <TabsTrigger value="anime">Anime</TabsTrigger>
            <TabsTrigger value="comic">Comic</TabsTrigger>
            <TabsTrigger value="novel">Novel</TabsTrigger>
            <TabsTrigger value="mangasusuku">Mangasusuku</TabsTrigger>
          </TabsList>

          <TabsContent value="anime" className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Anime Endpoints</h2>
            {animeEndpoints.map((endpoint, index) => (
              <EndpointCard key={index} endpoint={endpoint} />
            ))}
          </TabsContent>

          <TabsContent value="comic" className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Comic Endpoints</h2>
            {comicEndpoints.map((endpoint, index) => (
              <EndpointCard key={index} endpoint={endpoint} />
            ))}
          </TabsContent>

          <TabsContent value="novel" className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Novel Endpoints (Sakuranovel)</h2>
            {novelEndpoints.map((endpoint, index) => (
              <EndpointCard key={index} endpoint={endpoint} />
            ))}
          </TabsContent>

          <TabsContent value="mangasusuku" className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Mangasusuku Endpoints</h2>
            {mangasusukuEndpoints.map((endpoint, index) => (
              <EndpointCard key={index} endpoint={endpoint} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Api;
