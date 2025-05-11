
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, Menu, X, Facebook, Instagram, MessageCircle, Globe, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavItem = {
  name: string;
  href: string;
};

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
  const { t, language, changeLanguage } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Load nav items with translations
  const navItems: NavItem[] = [
    { name: t('aboutUs'), href: '/#about' },
    { name: t('products'), href: '/#products' },
    { name: t('offers'), href: '/#offers' },
    { name: t('donation'), href: '/#donation' },
    { name: t('contact'), href: '/#contact' },
  ];
  
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
  
  const toggleLanguage = () => {
    changeLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
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
            <h1 className="text-2xl font-bold text-primary">{t('appName')}</h1>
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
        
        {/* Social, Language & Cart */}
        <div className="flex items-center gap-3 flex-1 justify-end">
          {/* Language Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => changeLanguage('ar')}>
                العربية
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('en')}>
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
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
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden md:inline">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    {t('profile')}
                  </DropdownMenuItem>
                  {user.isOwner && (
                    <DropdownMenuItem onClick={() => navigate('/owner/dashboard')}>
                      {t('ownerDashboard')}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/register">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="hidden md:flex gap-2 items-center"
                  >
                    <User className="h-4 w-4" />
                    <span>{t('register')}</span>
                  </Button>
                </Link>
                <Link to="/login">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="hidden md:inline-flex"
                  >
                    {t('login')}
                  </Button>
                </Link>
              </>
            )}
            
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
            <h2 className="text-lg font-bold text-primary">{t('appName')}</h2>
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
            
            {/* Language Toggle in Mobile Menu */}
            <Button 
              variant="outline" 
              className="w-full justify-center gap-2"
              onClick={toggleLanguage}
            >
              <Globe className="h-4 w-4" />
              <span>{language === 'ar' ? 'English' : 'العربية'}</span>
            </Button>
            
            {user ? (
              <>
                <Button
                  variant="outline"
                  className="w-full justify-center gap-2"
                  onClick={() => {
                    navigate('/profile');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <User className="h-4 w-4" />
                  <span>{t('profile')}</span>
                </Button>
                
                {user.isOwner && (
                  <Button
                    variant="outline"
                    className="w-full justify-center gap-2"
                    onClick={() => {
                      navigate('/owner/dashboard');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <span>{t('ownerDashboard')}</span>
                  </Button>
                )}
                
                <Button
                  variant="default"
                  className="w-full justify-center gap-2"
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t('logout')}</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button 
                    variant="outline" 
                    className="w-full justify-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    <span>{t('register')}</span>
                  </Button>
                </Link>
                
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button 
                    variant="default" 
                    className="w-full justify-center"
                  >
                    {t('login')}
                  </Button>
                </Link>
              </>
            )}
            
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
