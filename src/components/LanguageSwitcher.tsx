
import React from 'react';
import { Globe } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher = ({ className }: LanguageSwitcherProps) => {
  const { language, setLanguage } = useLanguage();
  
  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };
  
  return (
    <div className={cn('flex items-center gap-2 px-2', className)}>
      <span className="text-sm font-medium">AR</span>
      <Switch
        checked={language === 'en'}
        onCheckedChange={toggleLanguage}
        aria-label="Toggle language"
      />
      <span className="text-sm font-medium">EN</span>
      <Globe className="ml-1 h-4 w-4" />
    </div>
  );
};

export default LanguageSwitcher;
