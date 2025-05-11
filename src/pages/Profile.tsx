
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { ChevronUp } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import UserProfileForm from '@/components/UserProfileForm';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

const ProfilePage = () => {
  const { t } = useTranslation();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  
  // Redirect to home if not logged in
  if (!user) {
    return <Navigate to="/register" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <section className="py-32 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('profile')}</h2>
              <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
              <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
                {t('updateProfileDescription')}
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <UserProfileForm />
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

export default ProfilePage;
