
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronUp, Lock, User } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, loginWithCredentials, loginAsOwner } = useAuth();
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Regular user login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Owner login
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [isOwnerLoading, setIsOwnerLoading] = useState(false);
  
  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Check if already logged in
  React.useEffect(() => {
    if (user?.isAuthenticated) {
      navigate('/profile');
    }
  }, [user, navigate]);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  
  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await loginWithCredentials(email, password);
      toast({
        title: t('loginSuccess'),
        description: t('loginSuccessDescription'),
      });
      navigate('/profile');
    } catch (error) {
      console.error(error);
      toast({
        title: t('loginFailed'),
        description: t('loginFailedDescription'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOwnerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsOwnerLoading(true);
    
    try {
      // Hard-coded owner credentials check
      if (ownerEmail === 'adweikat12@gmail.com' && ownerPassword === 'Abood@1234') {
        await loginAsOwner();
        toast({
          title: t('ownerLoginSuccess'),
          description: t('ownerLoginSuccessDescription'),
        });
        navigate('/owner/dashboard');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error(error);
      toast({
        title: t('loginFailed'),
        description: t('loginFailedDescription'),
        variant: "destructive",
      });
    } finally {
      setIsOwnerLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <section className="py-32 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('login')}</h2>
              <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
              <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
                {t('loginDescription')}
              </p>
            </div>
            
            <div className="max-w-md mx-auto">
              <Tabs defaultValue="user" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="user">{t('customerLogin')}</TabsTrigger>
                  <TabsTrigger value="owner">{t('ownerLogin')}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="user" className="mt-6">
                  <div className="glass-card rounded-xl p-6">
                    <form onSubmit={handleUserLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">{t('email')}</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder={t('enterEmail')}
                            className="pl-10"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password">{t('password')}</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="password"
                            type="password"
                            placeholder={t('enterPassword')}
                            className="pl-10"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isLoading}
                      >
                        {isLoading ? t('loggingIn') : t('login')}
                      </Button>
                      
                      <div className="text-center mt-4">
                        <p className="text-sm text-muted-foreground">
                          {t('dontHaveAccount')}{' '}
                          <Button variant="link" className="p-0" onClick={() => navigate('/register')}>
                            {t('register')}
                          </Button>
                        </p>
                      </div>
                    </form>
                  </div>
                </TabsContent>
                
                <TabsContent value="owner" className="mt-6">
                  <div className="glass-card rounded-xl p-6">
                    <form onSubmit={handleOwnerLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="ownerEmail">{t('email')}</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="ownerEmail"
                            type="email"
                            placeholder={t('enterEmail')}
                            className="pl-10"
                            value={ownerEmail}
                            onChange={(e) => setOwnerEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="ownerPassword">{t('password')}</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="ownerPassword"
                            type="password"
                            placeholder={t('enterPassword')}
                            className="pl-10"
                            value={ownerPassword}
                            onChange={(e) => setOwnerPassword(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isOwnerLoading}
                      >
                        {isOwnerLoading ? t('loggingIn') : t('ownerLogin')}
                      </Button>
                    </form>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-gradient-to-r from-primary/5 to-secondary/5 py-10">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-primary mb-4">{t('appName')}</h2>
            <p className="text-foreground/70 max-w-xl mx-auto mb-6">
              {t('footerDescription')}
            </p>
            
            <p className="text-sm text-foreground/60">
              &copy; {new Date().getFullYear()} {t('appName')}. {t('copyright')}.
            </p>
          </div>
        </div>
      </footer>
      
      {showScrollTop && (
        <button
          className="fixed bottom-6 right-6 h-10 w-10 rounded-full bg-primary text-foreground flex items-center justify-center shadow-lg transition-all hover:-translate-y-1 z-50"
          onClick={scrollToTop}
          aria-label={t('scrollToTop')}
        >
          <ChevronUp className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default Login;
