import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
 import { Navigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Play, 
  Film, 
  FileText,
  Search,
  Plus,
  Settings,
  RefreshCw,
   ArrowLeft,
   Shield,
   Loader2
} from "lucide-react";
import { toast } from "sonner";

interface ContentItem {
  id: string;
  title: string;
  status: "published" | "draft" | "pending";
  views: number;
  lastUpdated: string;
}

const mockManga: ContentItem[] = [
  { id: "1", title: "Solo Leveling", status: "published", views: 15420, lastUpdated: "2024-01-15" },
  { id: "2", title: "One Piece", status: "published", views: 89230, lastUpdated: "2024-01-14" },
  { id: "3", title: "Jujutsu Kaisen", status: "pending", views: 12340, lastUpdated: "2024-01-13" },
];

const mockAnime: ContentItem[] = [
  { id: "1", title: "Attack on Titan", status: "published", views: 45000, lastUpdated: "2024-01-15" },
  { id: "2", title: "Demon Slayer", status: "published", views: 67800, lastUpdated: "2024-01-14" },
  { id: "3", title: "Spy x Family", status: "draft", views: 23400, lastUpdated: "2024-01-12" },
];

const mockDonghua: ContentItem[] = [
  { id: "1", title: "Soul Land", status: "published", views: 34500, lastUpdated: "2024-01-15" },
  { id: "2", title: "Battle Through the Heavens", status: "published", views: 28900, lastUpdated: "2024-01-14" },
  { id: "3", title: "Martial Peak", status: "pending", views: 19200, lastUpdated: "2024-01-11" },
];

const mockNovels: ContentItem[] = [
  { id: "1", title: "Omniscient Reader's Viewpoint", status: "published", views: 22300, lastUpdated: "2024-01-15" },
  { id: "2", title: "The Beginning After The End", status: "published", views: 18700, lastUpdated: "2024-01-13" },
  { id: "3", title: "Second Life Ranker", status: "draft", views: 9800, lastUpdated: "2024-01-10" },
];

const ContentPanel = ({ 
  title, 
  icon: Icon, 
  items, 
  color 
}: { 
  title: string; 
  icon: React.ComponentType<{ className?: string }>; 
  items: ContentItem[];
  color: string;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: ContentItem["status"]) => {
    switch (status) {
      case "published":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Published</Badge>;
      case "draft":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Draft</Badge>;
      case "pending":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Pending</Badge>;
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Icon className={`w-5 h-5 ${color}`} />
            {title}
          </CardTitle>
          <Button size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            Add New
          </Button>
        </div>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${title.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30 hover:bg-background/80 transition-colors"
            >
              <div className="flex-1">
                <h4 className="font-medium text-sm">{item.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.views.toLocaleString()} views • Updated {item.lastUpdated}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(item.status)}
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          {filteredItems.length === 0 && (
            <p className="text-center text-muted-foreground py-4">No items found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const Admin = () => {
   const { user, isAuthenticated, isAdmin, isLoading } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

   // Show loading while checking auth
   if (isLoading) {
     return (
       <div className="min-h-screen flex items-center justify-center">
         <Loader2 className="h-8 w-8 animate-spin text-primary" />
       </div>
     );
   }
 
   // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

   // Show access denied if not admin
   if (!isAdmin) {
     return (
       <div className="min-h-screen flex items-center justify-center p-4">
         <Card className="max-w-md w-full bg-card/50 backdrop-blur border-border/50">
           <CardHeader className="text-center">
             <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
               <Shield className="w-8 h-8 text-destructive" />
             </div>
             <CardTitle className="text-xl">Access Denied</CardTitle>
           </CardHeader>
           <CardContent className="text-center space-y-4">
             <p className="text-muted-foreground">
               You don't have permission to access the admin panel.
               Only administrators can access this page.
             </p>
             <Link to="/account">
               <Button variant="outline" className="w-full">
                 <ArrowLeft className="w-4 h-4 mr-2" />
                 Back to Account
               </Button>
             </Link>
           </CardContent>
         </Card>
       </div>
     );
   }
 
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Data refreshed successfully");
    setIsRefreshing(false);
  };

  const stats = [
    { label: "Total Manga", value: "1,234", icon: BookOpen, color: "text-blue-400" },
    { label: "Total Anime", value: "567", icon: Play, color: "text-purple-400" },
    { label: "Total Donghua", value: "234", icon: Film, color: "text-cyan-400" },
    { label: "Total Novels", value: "890", icon: FileText, color: "text-amber-400" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link to="/account">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
              </Link>
               <Badge className="bg-primary/20 text-primary">
                 <Shield className="w-3 h-3 mr-1" />
                 Admin
               </Badge>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground">Manage content across the platform</p>
          </div>
          <Button onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-background/50">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="manga" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="manga" className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Manga</span>
            </TabsTrigger>
            <TabsTrigger value="anime" className="flex items-center gap-1">
              <Play className="w-4 h-4" />
              <span className="hidden sm:inline">Anime</span>
            </TabsTrigger>
            <TabsTrigger value="donghua" className="flex items-center gap-1">
              <Film className="w-4 h-4" />
              <span className="hidden sm:inline">Donghua</span>
            </TabsTrigger>
            <TabsTrigger value="novel" className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Novel</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manga">
            <ContentPanel 
              title="Manga Panel" 
              icon={BookOpen} 
              items={mockManga}
              color="text-blue-400"
            />
          </TabsContent>

          <TabsContent value="anime">
            <ContentPanel 
              title="Anime Panel" 
              icon={Play} 
              items={mockAnime}
              color="text-purple-400"
            />
          </TabsContent>

          <TabsContent value="donghua">
            <ContentPanel 
              title="Donghua Panel" 
              icon={Film} 
              items={mockDonghua}
              color="text-cyan-400"
            />
          </TabsContent>

          <TabsContent value="novel">
            <ContentPanel 
              title="Light Novel Panel" 
              icon={FileText} 
              items={mockNovels}
              color="text-amber-400"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
