
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Simple parallax effect
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollPosition = window.scrollY;
        heroRef.current.style.transform = `translateY(${scrollPosition * 0.3}px)`;
        heroRef.current.style.opacity = (1 - scrollPosition / 700).toString();
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-background/90 z-10"></div>
      <div
        ref={heroRef}
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?q=80&w=2070')] bg-cover bg-center"
      ></div>
      
      {/* Content */}
      <div className="relative z-20 container h-full flex flex-col justify-center items-center text-center px-4">
        <div className="animate-slide-down">
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            العطار العربي
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto mb-8 leading-relaxed">
            أفضل المنتجات الغذائية التقليدية الفلسطينية الأصيلة
            <br />
            بجودة عالية وأسعار منافسة
          </p>
        </div>
        
        <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex rtl:space-x-reverse animate-slide-up">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-foreground min-w-[150px]"
            onClick={scrollToProducts}
          >
            تسوق الآن
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm min-w-[150px]"
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          >
            تعرف علينا
          </Button>
        </div>
      </div>
      
      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <button 
          onClick={scrollToProducts}
          className="flex flex-col items-center text-white/80 hover:text-white transition-colors"
          aria-label="التمرير لأسفل"
        >
          <span className="text-sm mb-1">اكتشف المزيد</span>
          <ChevronDown className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default Hero;
