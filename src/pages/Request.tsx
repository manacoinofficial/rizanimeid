import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Send, Link as LinkIcon, User, Mail, MessageSquare } from "lucide-react";

const Request = () => {
  const [nickname, setNickname] = useState("");
  const [link, setLink] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nickname.trim() || !link.trim() || !email.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Basic URL validation
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (!urlRegex.test(link)) {
      toast.error("Please enter a valid URL");
      return;
    }

    setIsSubmitting(true);

    // Simulate submission - in production, this would send to a backend
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Request submitted successfully! We'll review it soon.");
      
      // Reset form
      setNickname("");
      setLink("");
      setEmail("");
      setMessage("");
    } catch (error) {
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Request Content</h1>
            <p className="text-muted-foreground">
              Request anime, manga, novel, or other content to be added to our platform
            </p>
          </div>

          {/* Request Form */}
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5 text-primary" />
                Submit Your Request
              </CardTitle>
              <CardDescription>
                Fill out the form below and we'll review your request
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nickname */}
                <div className="space-y-2">
                  <Label htmlFor="nickname" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Your Nickname *
                  </Label>
                  <Input
                    id="nickname"
                    placeholder="Enter your nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    maxLength={50}
                    required
                  />
                </div>

                {/* Link */}
                <div className="space-y-2">
                  <Label htmlFor="link" className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" />
                    Content Link *
                  </Label>
                  <Input
                    id="link"
                    placeholder="https://example.com/anime/..."
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    type="url"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Provide a link to the content source (MAL, AniList, official site, etc.)
                  </p>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Your Email *
                  </Label>
                  <Input
                    id="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    We'll notify you when your request is processed
                  </p>
                </div>

                {/* Additional Message */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Additional Message (Optional)
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Any additional details about your request..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    maxLength={500}
                  />
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Submitting...</>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Request
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <Card className="bg-card/30 border-border/30">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">📺 Anime & Donghua</h3>
                <p className="text-sm text-muted-foreground">
                  Request new anime series, movies, or Chinese donghua to be added.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/30 border-border/30">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">📚 Manga & Comics</h3>
                <p className="text-sm text-muted-foreground">
                  Request manga, manhwa, manhua, or western comics.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/30 border-border/30">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">📖 Light Novels</h3>
                <p className="text-sm text-muted-foreground">
                  Request light novels, web novels, or other written content.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/30 border-border/30">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">🎬 Drama & TV Shows</h3>
                <p className="text-sm text-muted-foreground">
                  Request J-Drama, K-Drama, or other TV series.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Request;
