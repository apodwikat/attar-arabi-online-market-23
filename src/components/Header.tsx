
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, Menu, X, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useLocation, Link } from 'react-router-dom';

type NavItem = {
  name: string;
  href: string;
};

const navItems: NavItem[] = [
  { name: 'من نحن', href: '/#about' },
  { name: 'منتجاتنا', href: '/#products' },
  { name: 'العروض الخاصة', href: '/#offers' },
  { name: 'التبرع', href: '/#donation' },
  { name: 'اتصل بنا', href: '/#contact' },
];

// Social media links
const socialLinks = {
  facebook: "https://www.facebook.com/alattararabi",
  instagram: "https://www.instagram.com/alatar_alarabi/?igsh=MTh4YnlxMjdzOTc4Mw%3D%3D#",
  whatsapp: "https://wa.me/970597167176"
};

const Header = ({ cartItemsCount = 0 }: { cartItemsCount?: number }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest('#mobile-menu') && !target.closest('#menu-trigger')) {
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Enhanced scroll to section function 
  const scrollToSection = (sectionId: string, e: React.MouseEvent) => {
    e.preventDefault();
    
    // If we're not on the home page, navigate to home first with the hash
    if (location.pathname !== '/') {
      window.location.href = sectionId;
      return;
    }
    
    // Extract the section ID without the # symbol
    const elementId = sectionId.replace('/#', '');
    
    // Get element and scroll to it
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // Close mobile menu if open
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className={cn(
      "fixed top-0 right-0 left-0 z-50 transition-all duration-300",
      isScrolled 
        ? "bg-white/80 backdrop-blur-md shadow-sm py-2" 
        : "bg-transparent py-4"
    )}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-1">
          <Link to="/" className="inline-block">
            <h1 className="text-2xl font-bold text-primary">العطار العربي</h1>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => scrollToSection(item.href, e)}
              className="text-foreground/80 hover:text-primary font-medium transition-all relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </a>
          ))}
        </nav>
        
        {/* Social & Cart */}
        <div className="flex items-center gap-3 flex-1 justify-end">
          {/* Social Icons */}
          <div className="hidden md:flex items-center gap-2">
            <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-primary transition-all" aria-label="فيسبوك">
              <Facebook size={18} />
            </a>
            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-primary transition-all" aria-label="انستغرام">
              <Instagram size={18} />
            </a>
            <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-primary transition-all" aria-label="واتساب">
              <MessageCircle size={18} />
            </a>
          </div>
          
          {/* Account & Cart Buttons */}
          <div className="flex items-center gap-2">
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-white">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden md:flex gap-2 items-center"
              onClick={() => alert("ميزة تسجيل الدخول قيد التطوير")}
            >
              <User className="h-4 w-4" />
              <span>تسجيل الدخول</span>
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="hidden md:inline-flex"
              onClick={() => alert("ميزة إنشاء حساب قيد التطوير")}
            >
              إنشاء حساب
            </Button>
            
            {/* Mobile Menu Trigger */}
            <Button
              id="menu-trigger"
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed right-0 top-0 h-screen w-[250px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-primary">العطار العربي</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="py-2 px-3 rounded-md hover:bg-muted transition-colors"
                onClick={(e) => scrollToSection(item.href, e)}
              >
                {item.name}
              </a>
            ))}
            
            <div className="h-px bg-border my-2"></div>
            
            <Button 
              variant="outline" 
              className="w-full justify-center gap-2"
              onClick={() => {
                alert("ميزة تسجيل الدخول قيد التطوير");
                setIsMobileMenuOpen(false);
              }}
            >
              <User className="h-4 w-4" />
              <span>تسجيل الدخول</span>
            </Button>
            
            <Button 
              variant="default" 
              className="w-full justify-center"
              onClick={() => {
                alert("ميزة إنشاء حساب قيد التطوير");
                setIsMobileMenuOpen(false);
              }}
            >
              إنشاء حساب
            </Button>
            
            <div className="h-px bg-border my-2"></div>
            
            <div className="flex justify-center gap-6 py-2">
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-primary" aria-label="فيسبوك">
                <Facebook size={20} />
              </a>
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-primary" aria-label="انستغرام">
                <Instagram size={20} />
              </a>
              <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-primary" aria-label="واتساب">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
