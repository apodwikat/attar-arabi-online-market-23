
import React, { useEffect, useRef } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

const AboutUs = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Animate on scroll
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

  const features = [
    'منتجات طبيعية 100%',
    'صناعة محلية',
    'أسعار منافسة',
    'توصيل سريع لجميع المناطق',
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-20 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-primary/10 blur-3xl"></div>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-secondary/10 blur-3xl"></div>
      
      <div className="container mx-auto px-4">
        <div 
          ref={contentRef}
          className="opacity-0 transition-all duration-700"
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">من نحن</h2>
              <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
              <p className="text-lg text-foreground/80 leading-relaxed mb-6">
                نحن في <span className="font-bold text-primary">العطار العربي</span> نقدم أفضل المنتجات الغذائية التقليدية العربية، بجودة عالية وأسعار منافسة. نحرص على توفير منتجات طبيعية 100% وصناعة محلية أصيلة لنقدم لكم تجربة تسوق مميزة.
              </p>
              <p className="text-lg text-foreground/80 leading-relaxed">
                هدفنا هو الحفاظ على التراث الغذائي العربي الأصيل وتقديمه بطريقة عصرية تناسب احتياجات العملاء. نعمل جاهدين لتوفير خدمة متميزة وسهولة في التواصل والطلب.
              </p>
            </div>
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 p-4 rounded-lg glass-card"
                >
                  <div className="flex-shrink-0 text-primary">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div className="font-medium text-lg">{feature}</div>
                </div>
              ))}
            </div>
            
            {/* CTA Button */}
            <div className="text-center mt-8">
              <a
                href="#products"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-lg transition-colors"
              >
                <span>تصفح منتجاتنا</span>
                <ArrowLeft className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
