
import React, { useState, useEffect, useRef } from 'react';
import ProductCard, { Product } from './ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

// Products data with the new categories and items
const productsData: Product[] = [
  // فئة: الأجبان و الألبان
  {
    id: 1,
    name: 'واحد كيلو جبنة نعاج',
    description: 'جبنة نعاج طازجة وأصلية، محضرة بطريقة تقليدية',
    price: 25,
    weight: '1 كجم',
    image: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'الأجبان و الألبان'
  },
  {
    id: 2,
    name: 'لبنة مع زيت زيتون',
    description: 'لبنة طازجة مع زيت زيتون فلسطيني أصلي',
    price: 30,
    weight: '850 غرام',
    image: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?q=80&w=2034&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'الأجبان و الألبان'
  },
  {
    id: 3,
    name: 'سمن بلدي',
    description: 'سمن بلدي أصلي، محضر بطريقة تقليدية',
    price: 30,
    weight: 'نصف كيلو',
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'الأجبان و الألبان'
  },
  {
    id: 4,
    name: 'كيلو جميد بلدي',
    description: 'جميد بلدي أصلي، مصنوع من حليب الأغنام',
    price: 50,
    weight: '1 كجم',
    image: 'https://images.unsplash.com/photo-1624979641604-1e7b013e1563?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'الأجبان و الألبان'
  },
  {
    id: 5,
    name: 'سمن بلدي',
    description: 'سمن بلدي أصلي، عبوة صغيرة مناسبة للتجربة',
    price: 25,
    weight: '20 غرام',
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'الأجبان و الألبان'
  },
  {
    id: 6,
    name: 'سمنة البقرة الحلوب',
    description: 'سمنة البقرة الحلوب الأصلية، غنية بالفيتامينات والعناصر المفيدة',
    price: 35,
    weight: 'نصف كيلو',
    image: 'https://images.unsplash.com/photo-1628268909376-e8c9ed996fb0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'الأجبان و الألبان'
  },
  
  // فئة: المكدوس
  {
    id: 7,
    name: 'كيلو مكدوس بالزيت والجوز',
    description: 'مكدوس باذنجان محشو بالجوز والفلفل والثوم، محفوظ بزيت زيتون فلسطيني أصلي',
    price: 25,
    weight: '1 كجم',
    image: 'https://images.unsplash.com/photo-1601117596595-ef03ac66df7f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'المكدوس'
  },
  
  // فئة: العسل
  {
    id: 8,
    name: 'كيلو عسل سدر أصلي',
    description: 'عسل سدر طبيعي 100%، مذاق رائع وفوائد صحية عديدة',
    price: 100,
    weight: '1 كجم',
    image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'العسل'
  },
  
  // فئة: بهارات ومكسرات
  {
    id: 9,
    name: 'كيلو لوز مبشور (رباع أو نصاص)',
    description: 'لوز مبشور طازج، يمكن اختيار الحجم المناسب (رباع أو نصاص)',
    price: 50,
    weight: '1 كجم',
    image: 'https://images.unsplash.com/photo-1614398342600-d4df717638cc?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'بهارات ومكسرات'
  },
  {
    id: 10,
    name: 'شوربة بنكهة الدجاج',
    description: 'شوربة لذيذة بنكهة الدجاج، سهلة التحضير ومناسبة للعائلة',
    price: 100,
    weight: '800 غرام',
    image: 'https://images.unsplash.com/photo-1584949602334-4e99f98286a9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'بهارات ومكسرات'
  },
  {
    id: 11,
    name: 'طحين اللوز',
    description: 'طحين لوز طازج، مناسب للحلويات والأطباق الخاصة',
    price: 25,
    weight: 'نصف كيلو',
    image: 'https://images.unsplash.com/photo-1621955964441-c173e01c135b?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'بهارات ومكسرات'
  },
  
  // فئة: المخللات
  {
    id: 12,
    name: 'مخلل خيار بيبي',
    description: 'مخلل خيار بيبي لذيذ، محضر بطريقة تقليدية',
    price: 15,
    weight: '1 لتر',
    image: 'https://images.unsplash.com/photo-1593488297625-334526856181?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'المخللات'
  },
  {
    id: 13,
    name: 'مخلل فقوس بلدي',
    description: 'مخلل فقوس بلدي أصلي، محضر بطريقة تقليدية',
    price: 15,
    weight: '1 لتر',
    image: 'https://images.unsplash.com/photo-1521473585104-7e5f0512afeb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'المخللات'
  },
  
  // فئة: الشطة
  {
    id: 14,
    name: 'هالبينو بزيت الزيتون',
    description: 'فلفل هالبينو حار محفوظ بزيت الزيتون الفلسطيني الأصلي',
    price: 20,
    weight: '1 كجم',
    image: 'https://images.unsplash.com/photo-1642728665846-a4efd4919099?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'الشطة'
  },
  {
    id: 15,
    name: 'تغميسة العطار (سلطة فلفل)',
    description: 'سلطة فلفل خاصة، وصفة العطار السرية اللذيذة',
    price: 20,
    weight: '1 كجم',
    image: 'https://images.unsplash.com/photo-1670421825030-8f8fd79db279?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'الشطة'
  },
  {
    id: 16,
    name: 'شطة حمرة حارة',
    description: 'شطة حمراء حارة، مناسبة للأطباق المتنوعة',
    price: 15,
    weight: '1 لتر',
    image: 'https://images.unsplash.com/photo-1635270256858-2854398348d9?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'الشطة'
  },
  {
    id: 17,
    name: 'شطة خضرة حارة',
    description: 'شطة خضراء حارة، نكهة مميزة ومذاق رائع',
    price: 15,
    weight: '1 لتر',
    image: 'https://images.unsplash.com/photo-1635619061839-a615e3d9ef76?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'الشطة'
  },
  {
    id: 18,
    name: 'دبس فلفل حار',
    description: 'دبس فلفل حار مركز، يضيف نكهة مميزة للأطباق',
    price: 20,
    weight: 'نصف كيلو',
    image: 'https://images.unsplash.com/photo-1607919947372-fe395f92951e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'الشطة'
  }
];

// Get unique categories from products
const categories = ['الكل', ...new Set(productsData.map(product => product.category))];

interface ProductsListProps {
  onAddToCart: (product: Product) => void;
  onOrderNow: (product: Product) => void;
}

const ProductsList = ({ onAddToCart, onOrderNow }: ProductsListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(productsData);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Filter products based on search query and selected category
  useEffect(() => {
    let filtered = productsData;
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'الكل') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory]);
  
  // Animate on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && sectionRef.current) {
            sectionRef.current.classList.add('animate-fade-in');
            sectionRef.current.classList.remove('opacity-0');
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

  return (
    <section
      id="products"
      className="py-20 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute top-40 left-10 w-60 h-60 rounded-full bg-primary/5 blur-3xl"></div>
      <div className="absolute bottom-40 right-10 w-60 h-60 rounded-full bg-secondary/5 blur-3xl"></div>
      
      <div className="container mx-auto px-4">
        <div 
          ref={sectionRef}
          className="opacity-0 transition-all duration-700"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">منتجاتنا</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
              اكتشف تشكيلتنا الواسعة من المنتجات الغذائية التقليدية العربية، المصنوعة بحب واهتمام للحفاظ على أصالة المذاق وجودة المكونات.
            </p>
          </div>
          
          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto mb-10">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/50 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="ابحث عن منتج..."
                  className="pr-10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                <Filter className="h-4 w-4 text-foreground/70" />
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    className={cn(
                      "whitespace-nowrap",
                      selectedCategory === category 
                        ? "bg-primary text-foreground" 
                        : "text-foreground/70"
                    )}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onOrderNow={onOrderNow}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-lg text-foreground/70">لا توجد منتجات مطابقة للبحث</p>
              <Button 
                variant="link" 
                className="mt-2 text-primary"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('الكل');
                }}
              >
                عرض جميع المنتجات
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductsList;
