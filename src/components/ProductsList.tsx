
import React, { useState, useEffect, useRef } from 'react';
import ProductCard, { Product } from './ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

// Sample products data
const productsData: Product[] = [
  {
    id: 1,
    name: 'عسل طبيعي صافي',
    description: 'عسل طبيعي 100% من جبال فلسطين، مذاق رائع وفوائد صحية عديدة',
    price: 200,
    weight: '1 كجم',
    image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'العسل'
  },
  {
    id: 2,
    name: 'عسل مع شمع',
    description: 'عسل طبيعي بشمع العسل الأصلي، غني بالفوائد والعناصر الغذائية',
    price: 100,
    weight: '500 جم',
    image: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'العسل'
  },
  {
    id: 3,
    name: 'مكدوس باذنجان',
    description: 'مكدوس باذنجان بزيت الزيتون والجوز، محضر بطريقة تقليدية',
    price: 30,
    weight: '1 كجم',
    image: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'المكدوس'
  },
  {
    id: 4,
    name: 'جبنة بلدية',
    description: 'جبنة بلدية طازجة، صناعة محلية بطريقة تقليدية',
    price: 50,
    weight: '500 جم',
    image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?q=80&w=2533&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'الأجبان والألبان'
  },
  {
    id: 5,
    name: 'عرض خاص: عسل + مكدوس',
    description: 'عرض مميز يشمل 1 كجم عسل طبيعي + 1 كجم مكدوس باذنجان',
    price: 150,
    weight: '2 كجم',
    image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'العروض الخاصة'
  },
  {
    id: 6,
    name: 'لبنة بلدية',
    description: 'لبنة بلدية طازجة، غنية بالبروبيوتيك ومفيدة للصحة',
    price: 45,
    weight: '500 جم',
    image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?q=80&w=2533&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'الأجبان والألبان'
  },
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
