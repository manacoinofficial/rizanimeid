import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Crown, Search, Trash2, Loader2, Users, AlertTriangle } from "lucide-react";

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  is_premium: boolean;
  premium_expires_at: string | null;
  created_at: string;
}

const AdminProfile = () => {
  const { isAuthenticated, isLoading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    } else if (!authLoading && !isAdmin) {
      navigate("/profil/user");
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges",
        variant: "destructive",
      });
    }
  }, [authLoading, isAuthenticated, isAdmin, navigate, toast]);

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!isAdmin) return;
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, user_id, display_name, is_premium, premium_expires_at, created_at")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setProfiles(data || []);
      } catch (error: any) {
        console.error("Error fetching profiles:", error);
        toast({
          title: "Error",
          description: "Failed to load profiles",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isAdmin) {
      fetchProfiles();
    }
  }, [isAdmin, toast]);

  const togglePremium = async (userId: string, currentStatus: boolean) => {
    setUpdatingUserId(userId);
    try {
      const newExpiresAt = !currentStatus 
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
        : null;

      const { error } = await supabase
        .from("profiles")
        .update({
          is_premium: !currentStatus,
          premium_expires_at: newExpiresAt,
        })
        .eq("user_id", userId);

      if (error) throw error;

      setProfiles(prev => prev.map(p => 
        p.user_id === userId 
          ? { ...p, is_premium: !currentStatus, premium_expires_at: newExpiresAt }
          : p
      ));

      toast({
        title: "Success",
        description: `Premium status ${!currentStatus ? "granted" : "revoked"}`,
      });
    } catch (error: any) {
      console.error("Error updating premium:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update premium status",
        variant: "destructive",
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  const deletePremium = async (userId: string) => {
    setUpdatingUserId(userId);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          is_premium: false,
          premium_expires_at: null,
        })
        .eq("user_id", userId);

      if (error) throw error;

      setProfiles(prev => prev.map(p => 
        p.user_id === userId 
          ? { ...p, is_premium: false, premium_expires_at: null }
          : p
      ));

      toast({
        title: "Success",
        description: "Premium status deleted",
      });
    } catch (error: any) {
      console.error("Error deleting premium:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete premium",
        variant: "destructive",
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  const filteredProfiles = profiles.filter(p => 
    p.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.user_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-8 px-4 flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const premiumCount = profiles.filter(p => p.is_premium).length;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="glass-card border-primary/30 bg-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Shield className="h-6 w-6 text-primary" />
                  Admin Panel
                </CardTitle>
                <CardDescription>Manage users and premium subscriptions</CardDescription>
              </div>
              <div className="flex gap-3">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  <Users className="h-4 w-4 mr-2" />
                  {profiles.length} Users
                </Badge>
                <Badge className="text-lg px-4 py-2 bg-primary text-primary-foreground">
                  <Crown className="h-4 w-4 mr-2" />
                  {premiumCount} Premium
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Search */}
        <Card className="glass-card border-primary/20">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or user ID..."
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Premium</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProfiles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProfiles.map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{profile.display_name || "Unknown"}</div>
                            <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                              {profile.user_id}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(profile.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={profile.is_premium}
                              onCheckedChange={() => togglePremium(profile.user_id, profile.is_premium)}
                              disabled={updatingUserId === profile.user_id}
                            />
                            {profile.is_premium && (
                              <Badge className="bg-primary text-primary-foreground">
                                <Crown className="h-3 w-3 mr-1" />
                                Premium
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {profile.premium_expires_at 
                            ? new Date(profile.premium_expires_at).toLocaleDateString()
                            : "-"
                          }
                        </TableCell>
                        <TableCell className="text-right">
                          {profile.is_premium && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deletePremium(profile.user_id)}
                              disabled={updatingUserId === profile.user_id}
                            >
                              {updatingUserId === profile.user_id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Remove
                                </>
                              )}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Back to Profile */}
        <Button 
          variant="outline" 
          onClick={() => navigate("/profil/user")}
          className="w-full"
        >
          Back to Profile
        </Button>
      </div>
    </div>
  );
};

export default AdminProfile;
