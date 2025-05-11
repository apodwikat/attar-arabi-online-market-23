
import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, ArrowLeft, MessageCircle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const DonationSection = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && contentRef.current) {
            contentRef.current.classList.add('animate-slide-up');
            contentRef.current.classList.remove('opacity-0');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  const handleDonation = (packageType: string) => {
    const message = `🤲 *${t('donation')}* 🤲\n\n` +
                   `${t('language') === 'English' ? 
                     `I would like to donate ${packageType}. Please provide me with the details.` : 
                     `أرغب بالتبرع بـ ${packageType} لصالح العائلات المحتاجة. الرجاء تزويدي بالتفاصيل.`}`;
    
    const phoneNumber = "970597167176";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, "_blank");
  };

  return (
    <section
      id="donation"
      ref={sectionRef}
      className="py-20 relative overflow-hidden bg-gradient-to-br from-secondary/5 to-primary/5"
    >
      <div className="absolute top-20 left-20 w-60 h-60 rounded-full bg-secondary/10 blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-60 h-60 rounded-full bg-primary/10 blur-3xl"></div>
      
      <div className="container mx-auto px-4">
        <div 
          ref={contentRef}
          className="opacity-0 transition-all duration-700"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('donationTitle')}</h2>
            <div className="w-24 h-1 bg-secondary mx-auto mb-6"></div>
            <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
              {t('donationDesc')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="glass-card rounded-xl overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="bg-primary/10 p-4 text-center">
                <h3 className="font-bold text-xl">{t('basicPackage')}</h3>
                <p className="text-foreground/70">₪100</p>
              </div>
              
              <div className="p-6">
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    <span>{t('makdousKg')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    <span>{t('labnehVillage')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    <span>{t('freeDelivery')}</span>
                  </li>
                </ul>
                
                <Button
                  className="w-full gap-2"
                  onClick={() => handleDonation(t('basicPackage'))}
                >
                  <Heart className="h-4 w-4" />
                  <span>{t('donateNow')}</span>
                </Button>
              </div>
            </div>
            
            <div className="glass-card rounded-xl overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 border-2 border-secondary">
              <div className="bg-secondary text-white p-4 text-center">
                <h3 className="font-bold text-xl">{t('mediumPackage')}</h3>
                <p className="text-white/90">₪250</p>
              </div>
              
              <div className="p-6">
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-secondary" />
                    <span>{t('naturalHoney')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-secondary" />
                    <span>{t('makdousKg')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-secondary" />
                    <span>{t('villageCheeseKg')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-secondary" />
                    <span>{t('freeDelivery')}</span>
                  </li>
                </ul>
                
                <Button
                  className="w-full gap-2 bg-secondary hover:bg-secondary/90"
                  onClick={() => handleDonation(t('mediumPackage'))}
                >
                  <Heart className="h-4 w-4" />
                  <span>{t('donateNow')}</span>
                </Button>
              </div>
            </div>
            
            <div className="glass-card rounded-xl overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="bg-primary/10 p-4 text-center">
                <h3 className="font-bold text-xl">{t('premiumPackage')}</h3>
                <p className="text-foreground/70">₪500</p>
              </div>
              
              <div className="p-6">
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    <span>{t('naturalHoneyKg')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    <span>2 {t('makdousKg')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    <span>{t('villageCheeseKg')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    <span>{t('labnehVillage')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    <span>{t('freeDelivery')}</span>
                  </li>
                </ul>
                
                <Button
                  className="w-full gap-2"
                  onClick={() => handleDonation(t('premiumPackage'))}
                >
                  <Heart className="h-4 w-4" />
                  <span>{t('donateNow')}</span>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <p className="text-foreground/80 mb-4">
              {t('customDonation')}
            </p>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => handleDonation(t('customDonateBtn'))}
            >
              <span>{t('customDonateBtn')}</span>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonationSection;
