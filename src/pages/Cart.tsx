
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Cart from '@/components/Cart';
import { Product } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { ChevronUp } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import LoginModal from '@/components/LoginModal';

const CartPage = () => {
  const [cartItems, setCartItems] = useState<(Product & { quantity: number })[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
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
  
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);
  
  const handleUpdateQuantity = (productId: number, quantity: number) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };
  
  const handleRemoveItem = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
    
    toast({
      title: "تمت إزالة المنتج",
      description: "تم إزالة المنتج من السلة بنجاح",
    });
  };
  
  const handleClearCart = () => {
    setCartItems([]);
    
    toast({
      title: "تم إفراغ السلة",
      description: "تم إفراغ سلة التسوق بنجاح",
    });
  };
  
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
        <section className="py-32 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">سلة التسوق</h2>
              <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
              <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
                قم بمراجعة المنتجات في سلة التسوق الخاصة بك قبل إتمام الطلب.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <Cart 
                items={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onClearCart={handleClearCart}
              />
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-gradient-to-r from-primary/5 to-secondary/5 py-10">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-primary mb-4">العطار العربي</h2>
            <p className="text-foreground/70 max-w-xl mx-auto mb-6">
              منتجات غذائية تقليدية فلسطينية أصيلة، مصنوعة بحب واهتمام للحفاظ على أصالة المذاق وجودة المكونات.
            </p>
            
            <p className="text-sm text-foreground/60">
              &copy; {new Date().getFullYear()} العطار العربي. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
      
      {showScrollTop && (
        <button
          className="fixed bottom-6 right-6 h-10 w-10 rounded-full bg-primary text-foreground flex items-center justify-center shadow-lg transition-all hover:-translate-y-1 z-50"
          onClick={scrollToTop}
          aria-label="العودة إلى الأعلى"
        >
          <ChevronUp className="h-6 w-6" />
        </button>
      )}
      
      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
};

export default CartPage;
