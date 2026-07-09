import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Image as ImageIcon, RefreshCw, X, Camera, Shuffle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cecanUrl, animeUrl, ANIME_TYPES, CHAT_KEYWORDS, CecanCountry, CECAN_LABEL } from '@/lib/randomImageApi';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  image?: string;
}

const SakanaAI = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const pushRandomMessage = (image: string, caption: string) => {
    setMessages(prev => [...prev, { role: 'assistant', content: caption, image }]);
  };

  const runCecan = (country: CecanCountry) => {
    const url = cecanUrl(country);
    pushRandomMessage(url, `Random ${CECAN_LABEL[country]} ✨`);
  };

  const runRandomAnime = (type: string) => {
    const url = animeUrl(type);
    pushRandomMessage(url, `Random anime · ${type}`);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Gambar terlalu besar', description: 'Maksimal 5MB', variant: 'destructive' });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const sendMessage = async () => {
    if ((!input.trim() && !uploadedImage) || isLoading) return;

    // Keyword shortcut — bypass AI, fetch random image directly.
    const kw = input.trim().toLowerCase();
    if (!uploadedImage && CHAT_KEYWORDS[kw]) {
      const { country, label } = CHAT_KEYWORDS[kw];
      setMessages(prev => [...prev, { role: 'user', content: input }]);
      setInput('');
      pushRandomMessage(cecanUrl(country), `Random ${label} ✨`);
      return;
    }

    const userMessage: Message = { 
      role: 'user', 
      content: input || (uploadedImage ? 'Analyze this image' : ''),
      image: uploadedImage || undefined,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setUploadedImage(null);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('sakana-ai-chat', {
        body: {
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
            image: m.image,
          })),
        },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.content || 'Maaf, tidak ada respon.',
        image: data.image,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({ 
        title: 'Error', 
        description: error.message || 'Gagal mengirim pesan',
        variant: 'destructive' 
      });
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Maaf, terjadi error. Silakan coba lagi.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setUploadedImage(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg animate-pulse">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gradient mb-2">Rizanime AI</h1>
        <p className="text-muted-foreground">
          Chat AI + koleksi random anime & cewek Asia.
        </p>
      </div>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="chat" className="gap-2"><Bot className="h-4 w-4" /> Chat</TabsTrigger>
          <TabsTrigger value="random" className="gap-2"><Shuffle className="h-4 w-4" /> Random Anime</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="mt-0">
      {/* Actions */}
      <div className="flex items-center justify-end mb-4">
        <Button variant="outline" size="sm" onClick={clearChat} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Clear Chat
        </Button>
      </div>

      {/* Chat Area */}
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Chat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <Bot className="h-12 w-12 mb-4 opacity-50" />
                <p className="font-medium">Mulai percakapan dengan Rizanime AI!</p>
                <div className="mt-4 space-y-2 text-sm">
                  <p>🎨 "Generate gambar anime sunset"</p>
                  <p>📸 Upload foto untuk scan/identifikasi</p>
                  <p>💬 Tanya rekomendasi anime/manga</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center shrink-0">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-gradient-primary text-white'
                          : 'bg-secondary text-foreground'
                      }`}
                    >
                      {message.image && message.role === 'user' && (
                        <div className="mb-2">
                          <img
                            src={message.image}
                            alt="Uploaded"
                            className="rounded-lg max-w-full max-h-48 object-cover"
                          />
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      {message.image && message.role === 'assistant' && (
                        <div className="mt-3">
                          <img
                            src={message.image}
                            alt="AI Generated"
                            className="rounded-lg max-w-full"
                          />
                        </div>
                      )}
                    </div>
                    {message.role === 'user' && (
                      <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-secondary rounded-2xl px-4 py-3">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Image Preview */}
      {uploadedImage && (
        <div className="mb-4 relative inline-block">
          <img
            src={uploadedImage}
            alt="Upload preview"
            className="h-20 w-20 object-cover rounded-lg border-2 border-primary"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6"
            onClick={() => setUploadedImage(null)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2 mb-3">
        <Button type="button" size="sm" variant="secondary" onClick={() => runCecan('vietnam')} disabled={isLoading}>Cevie</Button>
        <Button type="button" size="sm" variant="secondary" onClick={() => runCecan('korea')} disabled={isLoading}>Cekor</Button>
        <Button type="button" size="sm" variant="secondary" onClick={() => runCecan('japan')} disabled={isLoading}>Cejap</Button>
        <Button type="button" size="sm" variant="secondary" onClick={() => runRandomAnime('waifu')} disabled={isLoading} className="gap-1">
          <Shuffle className="h-3 w-3" /> Waifu
        </Button>
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="hidden"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          title="Upload gambar"
        >
          <Camera className="h-4 w-4" />
        </Button>
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ketik pesan atau: cevie / cekor / cejap"
          disabled={isLoading}
          className="flex-1"
        />
        <Button
          onClick={sendMessage}
          disabled={(!input.trim() && !uploadedImage) || isLoading}
          className="bg-gradient-primary hover:opacity-90 gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Send
        </Button>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        <Card className="hover-lift">
          <CardContent className="p-4 text-center">
            <Camera className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="font-semibold text-sm">Scan Gambar</h3>
            <p className="text-xs text-muted-foreground">Identifikasi anime/karakter dari foto</p>
          </CardContent>
        </Card>
        <Card className="hover-lift">
          <CardContent className="p-4 text-center">
            <ImageIcon className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="font-semibold text-sm">Generate Gambar</h3>
            <p className="text-xs text-muted-foreground">Buat gambar dengan AI</p>
          </CardContent>
        </Card>
        <Card className="hover-lift">
          <CardContent className="p-4 text-center">
            <Sparkles className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="font-semibold text-sm">Chat Pintar</h3>
            <p className="text-xs text-muted-foreground">Tanya apa saja tentang anime</p>
          </CardContent>
        </Card>
      </div>
        </TabsContent>

        <TabsContent value="random" className="mt-0">
          <RandomAnimePanel onSendToChat={(url, type) => {
            pushRandomMessage(url, `Random anime · ${type}`);
            toast({ title: 'Dikirim ke Chat', description: type });
          }} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

function RandomAnimePanel({ onSendToChat }: { onSendToChat: (url: string, type: string) => void }) {
  const [type, setType] = useState<string>('waifu');
  const [url, setUrl] = useState<string>(() => animeUrl('waifu'));
  const [loading, setLoading] = useState(false);

  const generate = (t: string) => {
    setType(t);
    setLoading(true);
    setUrl(animeUrl(t));
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Shuffle className="h-5 w-5 text-primary" /> Random Anime · <span className="text-primary">{type}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-2 pb-2">
            {ANIME_TYPES.map((t) => (
              <Button
                key={t}
                size="sm"
                variant={t === type ? 'default' : 'outline'}
                onClick={() => generate(t)}
                className="capitalize"
              >
                {t}
              </Button>
            ))}
          </div>
        </ScrollArea>

        <div className="relative rounded-xl overflow-hidden bg-muted min-h-[300px] flex items-center justify-center">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          <img
            src={url}
            alt={`Random ${type}`}
            className="w-full max-h-[520px] object-contain"
            onLoad={() => setLoading(false)}
            onError={() => setLoading(false)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={() => generate(type)} className="gap-2">
            <RefreshCw className="h-4 w-4" /> Generate lagi
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <a href={url} download={`rizanime-${type}.jpg`} target="_blank" rel="noreferrer">
              <Download className="h-4 w-4" /> Download
            </a>
          </Button>
          <Button variant="secondary" onClick={() => onSendToChat(url, type)} className="gap-2">
            <Send className="h-4 w-4" /> Kirim ke Chat
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default SakanaAI;
