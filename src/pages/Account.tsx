 import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLevel, getXpForLevel } from "@/hooks/useLevel";
import { useReadingHistory } from "@/hooks/useReadingHistory";
import { useFavorites } from "@/hooks/useFavorites";
import { Navigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Trophy, 
  BookOpen, 
  Play, 
  Heart, 
  Clock, 
  Star,
  TrendingUp,
  Award,
  Zap,
  Edit,
  Save,
  X,
  Shield,
  MessageSquare,
   Tag,
   Loader2
} from "lucide-react";
import { toast } from "sonner";

const getLevelTitle = (level: number): string => {
  if (level <= 5) return "Novice Reader";
  if (level <= 10) return "Casual Viewer";
  if (level <= 20) return "Dedicated Fan";
  if (level <= 35) return "Otaku Expert";
  if (level <= 50) return "Weeb Master";
  if (level <= 75) return "Culture Connoisseur";
  return "Legendary Otaku";
};

const getLevelColor = (level: number): string => {
  if (level <= 5) return "bg-zinc-500";
  if (level <= 10) return "bg-emerald-500";
  if (level <= 20) return "bg-blue-500";
  if (level <= 35) return "bg-purple-500";
  if (level <= 50) return "bg-amber-500";
  if (level <= 75) return "bg-rose-500";
  return "bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600";
};

const AVAILABLE_GENRES = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy", 
  "Horror", "Isekai", "Mecha", "Mystery", "Romance", 
  "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller"
];

const Account = () => {
   const { user, isAuthenticated, isAdmin, isLoading, logout, userRole } = useAuth();
  const { levelData, getProgress, XP_REWARDS } = useLevel();
  const { history } = useReadingHistory();
  const { favorites } = useFavorites();
  
  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);
   const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>(["Action", "Fantasy", "Isekai"]);
  const [newComment, setNewComment] = useState("");
  
  // Mock comments
  const [comments] = useState([
    { id: 1, content: "Love this platform!", date: "2024-01-15", likes: 5 },
    { id: 2, content: "Great collection of anime!", date: "2024-01-10", likes: 3 },
  ]);

   // Load saved profile data
   useEffect(() => {
     const saved = localStorage.getItem("userProfile");
     if (saved) {
       try {
         const profile = JSON.parse(saved);
         setDisplayName(profile.displayName || "");
         setBio(profile.bio || "");
         setSelectedGenres(profile.selectedGenres || ["Action", "Fantasy", "Isekai"]);
       } catch (e) {
         console.error("Failed to load profile:", e);
       }
     }
   }, []);
 
   // Show loading while checking auth
   if (isLoading) {
     return (
       <div className="min-h-screen flex items-center justify-center">
         <Loader2 className="h-8 w-8 animate-spin text-primary" />
       </div>
     );
   }
 
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const progress = getProgress();
  const levelTitle = getLevelTitle(levelData.level);
  const levelColor = getLevelColor(levelData.level);

  const stats = [
    { label: "Chapters Read", value: levelData.totalChaptersRead, icon: BookOpen, color: "text-blue-400" },
    { label: "Episodes Watched", value: levelData.totalEpisodesWatched, icon: Play, color: "text-purple-400" },
    { label: "Comics Completed", value: levelData.comicsRead, icon: BookOpen, color: "text-emerald-400" },
    { label: "Novels Completed", value: levelData.novelsRead, icon: BookOpen, color: "text-amber-400" },
    { label: "Anime Completed", value: levelData.animeWatched, icon: Play, color: "text-rose-400" },
    { label: "Donghua Completed", value: levelData.donghuaWatched, icon: Play, color: "text-cyan-400" },
  ];

  const handleSaveProfile = () => {
     localStorage.setItem("userProfile", JSON.stringify({
      displayName,
      bio,
      selectedGenres
    }));
    toast.success("Profile updated successfully!");
    setIsEditing(false);
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    toast.success("Comment added!");
    setNewComment("");
  };

   const getUserDisplayName = () => {
     if (displayName) return displayName;
     if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
     if (user?.email) return user.email.split('@')[0];
     return "User";
   };
 
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Account</h1>
            <p className="text-muted-foreground">Track your progress and achievements</p>
          </div>
         {isAdmin && (
           <Link to="/account/admin">
             <Button variant="outline" className="gap-2">
               <Shield className="w-4 h-4" />
               Admin Panel
             </Button>
           </Link>
         )}
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-lg">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="genres">Genres</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <Card className="lg:col-span-1 bg-card/50 backdrop-blur border-border/50">
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center mb-4">
                    <User className="w-12 h-12 text-primary-foreground" />
                  </div>
                  
                  {isEditing ? (
                    <Input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="text-center text-xl font-bold"
                      placeholder="Display Name"
                    />
                  ) : (
                     <CardTitle className="text-xl">{getUserDisplayName()}</CardTitle>
                  )}
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                   
                   {/* Role Badge */}
                   <div className="flex justify-center gap-2 mt-2">
                     <Badge variant={isAdmin ? "default" : "secondary"}>
                       {isAdmin && <Shield className="w-3 h-3 mr-1" />}
                       {userRole || 'user'}
                     </Badge>
                   </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Bio Section */}
                  <div>
                    <Label className="text-sm text-muted-foreground">Bio</Label>
                    {isEditing ? (
                      <Textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us about yourself..."
                        rows={3}
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-sm mt-1">{bio || "No bio yet"}</p>
                    )}
                  </div>

                  <Separator />

                  <div className="text-center">
                    <Badge className={`${levelColor} text-white px-4 py-1 text-sm`}>
                      <Trophy className="w-4 h-4 mr-1" />
                      Level {levelData.level}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-2">{levelTitle}</p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">XP Progress</span>
                      <span className="text-foreground font-medium">
                        {progress.current} / {progress.needed}
                      </span>
                    </div>
                    <Progress value={progress.percentage} className="h-2" />
                    <p className="text-xs text-muted-foreground text-center">
                      {Math.ceil(progress.needed - progress.current)} XP to Level {levelData.level + 1}
                    </p>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total XP</span>
                    <span className="text-foreground font-bold flex items-center gap-1">
                      <Zap className="w-4 h-4 text-amber-400" />
                      {levelData.xp.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex gap-2 mt-4">
                    {isEditing ? (
                      <>
                        <Button variant="default" className="flex-1" onClick={handleSaveProfile}>
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button variant="outline" className="flex-1" onClick={() => setIsEditing(false)}>
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit Profile
                      </Button>
                    )}
                  </div>

                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={logout}
                  >
                    Sign Out
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-card/50 backdrop-blur border-border/50">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-rose-500/10">
                          <Heart className="w-6 h-6 text-rose-400" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-foreground">{favorites.length}</p>
                          <p className="text-sm text-muted-foreground">Favorites</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-card/50 backdrop-blur border-border/50">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-blue-500/10">
                          <Clock className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-foreground">{history.length}</p>
                          <p className="text-sm text-muted-foreground">History Items</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Favorite Genres Preview */}
                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tag className="w-5 h-5 text-primary" />
                      Favorite Genres
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedGenres.map((genre) => (
                        <Badge key={genre} variant="secondary" className="px-3 py-1">
                          {genre}
                        </Badge>
                      ))}
                      {selectedGenres.length === 0 && (
                        <p className="text-muted-foreground text-sm">No genres selected</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Activity Stats */}
              <Card className="bg-card/50 backdrop-blur border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Activity Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat, index) => (
                      <div 
                        key={index}
                        className="bg-background/50 rounded-lg p-4 text-center border border-border/30"
                      >
                        <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* XP Rewards Info */}
              <Card className="bg-card/50 backdrop-blur border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    XP Rewards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="secondary">+{XP_REWARDS.readChapter}</Badge>
                      <span className="text-muted-foreground">per chapter</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="secondary">+{XP_REWARDS.watchEpisode}</Badge>
                      <span className="text-muted-foreground">per episode</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="secondary">+{XP_REWARDS.finishComic}</Badge>
                      <span className="text-muted-foreground">finish comic</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="secondary">+{XP_REWARDS.finishNovel}</Badge>
                      <span className="text-muted-foreground">finish novel</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="secondary">+{XP_REWARDS.finishAnime}</Badge>
                      <span className="text-muted-foreground">finish anime</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="secondary">+{XP_REWARDS.finishDonghua}</Badge>
                      <span className="text-muted-foreground">finish donghua</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Genres Tab */}
          <TabsContent value="genres">
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-primary" />
                  Favorite Genres
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Select your favorite genres to get personalized recommendations
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_GENRES.map((genre) => (
                    <Badge
                      key={genre}
                      variant={selectedGenres.includes(genre) ? "default" : "outline"}
                      className="cursor-pointer px-4 py-2 text-sm"
                      onClick={() => toggleGenre(genre)}
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
                <Button className="mt-6" onClick={() => {
                  localStorage.setItem("favoriteGenres", JSON.stringify(selectedGenres));
                  toast.success("Favorite genres saved!");
                }}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comments Tab */}
          <TabsContent value="comments">
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  My Comments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Comment */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Button onClick={handleAddComment}>Post</Button>
                </div>

                <Separator />

                {/* Comments List */}
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div 
                      key={comment.id}
                      className="p-4 rounded-lg bg-background/50 border border-border/30"
                    >
                      <p className="text-sm">{comment.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">{comment.date}</span>
                        <Badge variant="secondary" className="text-xs">
                          <Heart className="w-3 h-3 mr-1" />
                          {comment.likes}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Account;
