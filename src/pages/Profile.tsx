import { useEffect, useRef, useState } from "react";
import { Loader2, Upload, Image as ImageIcon, Film, User as UserIcon, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Navigate } from "react-router-dom";

const MAX_IMAGE = 5 * 1024 * 1024;
const MAX_VIDEO = 25 * 1024 * 1024;

export default function Profile() {
  const { user, isLoading } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [bannerType, setBannerType] = useState<"image" | "video" | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"avatar" | "banner" | null>(null);
  const avatarRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("display_name,bio,avatar_url,banner_url,banner_type")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) {
        setDisplayName(data.display_name ?? "");
        setBio((data as any).bio ?? "");
        setAvatarUrl(data.avatar_url ?? null);
        setBannerUrl((data as any).banner_url ?? null);
        setBannerType(((data as any).banner_type as any) ?? null);
      }
    })();
  }, [user]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-24 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;

  const upload = async (file: File, kind: "avatar" | "banner") => {
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");
    if (kind === "avatar" && !isImage) return toast.error("Avatar harus gambar");
    if (kind === "banner" && !isImage && !isVideo) return toast.error("Banner harus foto atau video");
    const limit = isVideo ? MAX_VIDEO : MAX_IMAGE;
    if (file.size > limit) return toast.error(`Ukuran maksimum ${Math.round(limit / 1024 / 1024)}MB`);

    setUploading(kind);
    const ext = file.name.split(".").pop() || (isVideo ? "mp4" : "jpg");
    const path = `${user.id}/${kind}-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("profile-media")
      .upload(path, file, { upsert: true, contentType: file.type });
    if (upErr) {
      setUploading(null);
      return toast.error(upErr.message);
    }
    const { data: pub } = supabase.storage.from("profile-media").getPublicUrl(path);
    const url = pub.publicUrl;
    if (kind === "avatar") setAvatarUrl(url);
    else {
      setBannerUrl(url);
      setBannerType(isVideo ? "video" : "image");
    }
    setUploading(null);
    toast.success(`${kind === "avatar" ? "Avatar" : "Banner"} terunggah`);
  };

  const save = async () => {
    setSaving(true);
    const payload: any = {
      user_id: user.id,
      display_name: displayName || null,
      bio: bio || null,
      avatar_url: avatarUrl,
      banner_url: bannerUrl,
      banner_type: bannerType,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase
      .from("profiles")
      .upsert(payload, { onConflict: "user_id" });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Profil disimpan");
  };

  const initials = (displayName || user.email || "U").slice(0, 1).toUpperCase();

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <UserIcon className="h-6 w-6 text-primary" /> Profil Saya
      </h1>

      {/* Banner preview */}
      <Card className="overflow-hidden mb-6">
        <div className="relative h-44 sm:h-56 bg-gradient-to-br from-primary/20 via-secondary to-background">
          {bannerUrl && bannerType === "image" && (
            <img src={bannerUrl} alt="banner" className="absolute inset-0 w-full h-full object-cover" />
          )}
          {bannerUrl && bannerType === "video" && (
            <video src={bannerUrl} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <div className="absolute bottom-3 right-3">
            <input
              ref={bannerRef}
              type="file"
              accept="image/*,video/*"
              hidden
              onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], "banner")}
            />
            <Button size="sm" variant="secondary" onClick={() => bannerRef.current?.click()} disabled={uploading === "banner"}>
              {uploading === "banner" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 mr-1" />}
              Ganti Banner
            </Button>
          </div>
          <div className="absolute -bottom-10 left-6">
            <div className="relative">
              <Avatar className="h-20 w-20 ring-4 ring-background">
                {avatarUrl && <AvatarImage src={avatarUrl} />}
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <input
                ref={avatarRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], "avatar")}
              />
              <button
                onClick={() => avatarRef.current?.click()}
                disabled={uploading === "avatar"}
                className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg hover:opacity-90"
                aria-label="Ganti foto"
              >
                {uploading === "avatar" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImageIcon className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </div>
        <CardContent className="pt-14 pb-5">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Film className="h-3 w-3" /> Banner mendukung foto (maks 5MB) atau video (maks 25MB).
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informasi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user.email ?? ""} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Nama Tampilan</Label>
            <Input
              id="name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Nama akun yang muncul di komentar"
              maxLength={60}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={280}
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="Ceritakan tentang dirimu (maks 280 karakter)"
            />
          </div>
          <Button onClick={save} disabled={saving} className="gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Simpan Perubahan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}