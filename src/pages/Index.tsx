
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import AboutUs from '@/components/AboutUs';
import ProductsList from '@/components/ProductsList';
import DonationSection from '@/components/DonationSection';
import { Product } from '@/components/ProductCard';
import Cart from '@/components/Cart';
import { Button } from '@/components/ui/button';
import { ChevronUp, Facebook, Instagram, Phone, Mail, MessageCircle, MapPin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const [cartItems, setCartItems] = useState<(Product & { quantity: number })[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Check if should show scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 600);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage', error);
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);
  
  // Add product to cart
  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      // Check if product already exists in cart
      const existingItem = prev.find(item => item.id === product.id);
      
      if (existingItem) {
        // If exists, increment quantity
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // If not, add new item with quantity 1
        return [...prev, { ...product, quantity: 1 }];
      }
    });
    
    toast({
      title: "تمت الإضافة إلى السلة",
      description: `تم إضافة ${product.name} إلى سلة التسوق بنجاح`,
    });
  };
  
  // Update item quantity in cart
  const handleUpdateQuantity = (productId: number, quantity: number) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };
  
  // Remove item from cart
  const handleRemoveItem = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
    
    toast({
      title: "تمت إزالة المنتج",
      description: "تم إزالة المنتج من السلة بنجاح",
    });
  };
  
  // Clear cart
  const handleClearCart = () => {
    setCartItems([]);
    
    toast({
      title: "تم إفراغ السلة",
      description: "تم إفراغ سلة التسوق بنجاح",
    });
  };
  
  // Order single product via WhatsApp
  const handleOrderNow = (product: Product) => {
    // Format order message
    const message = `🛒 *طلب منتج من العطار العربي* 🛒\n\n` +
                   `*المنتج:* ${product.name}\n` +
                   `*السعر:* ₪${product.price}\n` +
                   `*الوزن:* ${product.weight}\n\n` +
                   `أرغب بطلب هذا المنتج. الرجاء تزويدي بالتفاصيل.`;
    
    // WhatsApp number (replace with actual number)
    const phoneNumber = "972123456789";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank");
  };
  
  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemsCount={cartItems.reduce((total, item) => total + item.quantity, 0)} />
      
      <main>
        <Hero />
        <AboutUs />
        <ProductsList 
          onAddToCart={handleAddToCart} 
          onOrderNow={handleOrderNow} 
        />
        
        {/* Cart Section */}
        <section id="cart" className="py-20 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="max-w-xl mx-auto">
              <Cart 
                items={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onClearCart={handleClearCart}
              />
            </div>
          </div>
        </section>
        
        <DonationSection />
        
        {/* Contact Section */}
        <section id="contact" className="py-20 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">اتصل بنا</h2>
              <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
              <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
                نحن هنا للإجابة على جميع استفساراتكم ومساعدتكم في كل ما تحتاجون. لا تترددوا في التواصل معنا عبر أي من وسائل الاتصال التالية.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Contact Info */}
                <div className="glass-card rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-6">معلومات التواصل</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-foreground/70">رقم الهاتف</p>
                        <p className="font-medium">+972 12 345 6789</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm text-foreground/70">البريد الإلكتروني</p>
                        <p className="font-medium">info@attararabi.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-foreground/70">العنوان</p>
                        <p className="font-medium">رام الله، فلسطين</p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <h3 className="text-xl font-bold mb-4">تابعنا على</h3>
                  <div className="flex items-center gap-4">
                    <a
                      href="#"
                      className="h-10 w-10 rounded-full bg-[#1877F2]/10 flex items-center justify-center hover:bg-[#1877F2]/20 transition-colors"
                    >
                      <Facebook className="h-5 w-5 text-[#1877F2]" />
                    </a>
                    <a
                      href="#"
                      className="h-10 w-10 rounded-full bg-[#E4405F]/10 flex items-center justify-center hover:bg-[#E4405F]/20 transition-colors"
                    >
                      <Instagram className="h-5 w-5 text-[#E4405F]" />
                    </a>
                    <a
                      href="#"
                      className="h-10 w-10 rounded-full bg-[#25D366]/10 flex items-center justify-center hover:bg-[#25D366]/20 transition-colors"
                    >
                      <MessageCircle className="h-5 w-5 text-[#25D366]" />
                    </a>
                  </div>
                </div>
                
                {/* Google Map */}
                <div className="glass-card rounded-xl overflow-hidden h-[300px] md:h-auto">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27130.995192042245!2d35.17967444647731!3d31.90298703562946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1502d40a170c30b9%3A0xfeef58b7a4b5a2d9!2sRamallah!5e0!3m2!1sen!2s!4v1711304387994!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="موقع العطار العربي"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-gradient-to-r from-primary/5 to-secondary/5 py-10">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-primary mb-4">العطار العربي</h2>
            <p className="text-foreground/70 max-w-xl mx-auto mb-6">
              منتجات غذائية تقليدية عربية أصيلة، مصنوعة بحب واهتمام للحفاظ على أصالة المذاق وجودة المكونات.
            </p>
            
            <div className="flex justify-center gap-6 mb-6">
              <a href="#" className="text-foreground/70 hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-foreground/70 hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-foreground/70 hover:text-primary">
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
            
            <Separator className="max-w-md mx-auto mb-6" />
            
            <p className="text-sm text-foreground/60">
              &copy; {new Date().getFullYear()} العطار العربي. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
      
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          className="fixed bottom-6 right-6 h-10 w-10 rounded-full bg-primary text-foreground flex items-center justify-center shadow-lg transition-all hover:-translate-y-1 z-50"
          onClick={scrollToTop}
          aria-label="العودة إلى الأعلى"
        >
          <ChevronUp className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default Index;
