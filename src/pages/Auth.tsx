import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Sparkles } from 'lucide-react';

const emailSchema = z.string().trim().email({ message: 'Email tidak valid' }).max(255);
const passwordSchema = z.string().min(6, { message: 'Password minimal 6 karakter' }).max(72);
const nameSchema = z.string().trim().min(1, { message: 'Nama wajib diisi' }).max(80);

export default function Auth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate('/', { replace: true });
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailParse = emailSchema.safeParse(loginEmail);
    const passParse = passwordSchema.safeParse(loginPass);
    if (!emailParse.success) return toast.error(emailParse.error.issues[0].message);
    if (!passParse.success) return toast.error(passParse.error.issues[0].message);

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: emailParse.data,
      password: passParse.data,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success('Login berhasil!');
    navigate('/', { replace: true });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameParse = nameSchema.safeParse(regName);
    const emailParse = emailSchema.safeParse(regEmail);
    const passParse = passwordSchema.safeParse(regPass);
    if (!nameParse.success) return toast.error(nameParse.error.issues[0].message);
    if (!emailParse.success) return toast.error(emailParse.error.issues[0].message);
    if (!passParse.success) return toast.error(passParse.error.issues[0].message);

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: emailParse.data,
      password: passParse.data,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { full_name: nameParse.data },
      },
    });
    setLoading(false);
    if (error) {
      if (error.message.includes('already registered')) {
        return toast.error('Email sudah terdaftar. Silakan login.');
      }
      return toast.error(error.message);
    }
    toast.success('Akun dibuat! Kamu sudah login.');
    navigate('/', { replace: true });
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex h-14 w-14 rounded-2xl bg-gradient-primary items-center justify-center shadow-lg mb-4">
          <Sparkles className="h-7 w-7 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold text-gradient">Selamat datang</h1>
        <p className="text-muted-foreground mt-2">Login atau daftar untuk berkomentar</p>
      </div>

      <Card>
        <Tabs defaultValue="login">
          <CardHeader>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Daftar</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-pass">Password</Label>
                  <Input id="login-pass" type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Login'}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-name">Nama</Label>
                  <Input id="reg-name" value={regName} onChange={(e) => setRegName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input id="reg-email" type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-pass">Password</Label>
                  <Input id="reg-pass" type="password" value={regPass} onChange={(e) => setRegPass(e.target.value)} required />
                  <p className="text-xs text-muted-foreground">Minimal 6 karakter</p>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Daftar'}
                </Button>
              </form>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      <p className="text-center text-sm text-muted-foreground mt-6">
        <Link to="/" className="hover:text-primary">← Kembali ke beranda</Link>
      </p>
    </div>
  );
}