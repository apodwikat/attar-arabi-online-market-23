import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, ArrowLeft, MessageCircle } from 'lucide-react';

const DonationSection = () => {
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
    const message = `🤲 *طلب تبرع من العطار العربي* 🤲\n\n` +
                   `أرغب بالتبرع بـ ${packageType} لصالح العائلات المحتاجة. الرجاء تزويدي بالتفاصيل.`;
    
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">التبرع للمحتاجين</h2>
            <div className="w-24 h-1 bg-secondary mx-auto mb-6"></div>
            <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
              يمكنك المساهمة في دعم العائلات المحتاجة من خلال التبرع بمنتجاتنا الغذائية. نقوم بإيصال تبرعاتكم إلى العائلات المستحقة بكل أمانة وشفافية.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="glass-card rounded-xl overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="bg-primary/10 p-4 text-center">
                <h3 className="font-bold text-xl">باقة أساسية</h3>
                <p className="text-foreground/70">₪100</p>
              </div>
              
              <div className="p-6">
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    <span>1 كجم من المكدوس</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    <span>500 جم من اللبنة البلدية</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    <span>توصيل مجاني</span>
                  </li>
                </ul>
                
                <Button
                  className="w-full gap-2"
                  onClick={() => handleDonation("الباقة الأساسية")}
                >
                  <Heart className="h-4 w-4" />
                  <span>تبرع الآن</span>
                </Button>
              </div>
            </div>
            
            <div className="glass-card rounded-xl overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 border-2 border-secondary">
              <div className="bg-secondary text-white p-4 text-center">
                <h3 className="font-bold text-xl">باقة متوسطة</h3>
                <p className="text-white/90">₪250</p>
              </div>
              
              <div className="p-6">
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-secondary" />
                    <span>500 جم من العسل الطبيعي</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-secondary" />
                    <span>1 كجم من المكدوس</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-secondary" />
                    <span>1 كجم من الجبنة البلدية</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-secondary" />
                    <span>توصيل مجاني</span>
                  </li>
                </ul>
                
                <Button
                  className="w-full gap-2 bg-secondary hover:bg-secondary/90"
                  onClick={() => handleDonation("الباقة المتوسطة")}
                >
                  <Heart className="h-4 w-4" />
                  <span>تبرع الآن</span>
                </Button>
              </div>
            </div>
            
            <div className="glass-card rounded-xl overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="bg-primary/10 p-4 text-center">
                <h3 className="font-bold text-xl">باقة مميزة</h3>
                <p className="text-foreground/70">₪500</p>
              </div>
              
              <div className="p-6">
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    <span>1 كجم من العسل الطبيعي</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    <span>2 كجم من المكدوس</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    <span>1 كجم من الجبنة البلدية</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    <span>1 كجم من اللبنة البلدية</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    <span>توصيل مجاني</span>
                  </li>
                </ul>
                
                <Button
                  className="w-full gap-2"
                  onClick={() => handleDonation("الباقة المميزة")}
                >
                  <Heart className="h-4 w-4" />
                  <span>تبرع الآن</span>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <p className="text-foreground/80 mb-4">
              يمكنك أيضاً التبرع بقيمة مخصصة أو منتجات محددة
            </p>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => handleDonation("تبرع مخصص")}
            >
              <span>تبرع بقيمة مخصصة</span>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonationSection;
