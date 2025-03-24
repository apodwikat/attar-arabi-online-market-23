
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  weight: string;
  image: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onOrderNow: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart, onOrderNow }: ProductCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Format price to show as ₪120
  const formattedPrice = `₪${product.price}`;

  return (
    <div 
      className={cn(
        "glass-card rounded-xl overflow-hidden transition-all duration-500",
        "hover:shadow-lg hover:-translate-y-1",
        isHovered ? 'scale-[1.02]' : 'scale-100'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className={cn(
            "w-full h-full object-cover transition-transform duration-700",
            !imageLoaded && "image-loading",
            imageLoaded && "image-loaded",
            isHovered && "scale-110"
          )}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Category Badge */}
        <div className="absolute top-3 right-3 bg-primary/90 text-foreground text-xs px-2 py-1 rounded-full">
          {product.category}
        </div>
      </div>
      
      {/* Product Details */}
      <div className="p-4">
        <h3 className="text-lg font-bold mb-1">{product.name}</h3>
        <p className="text-sm text-foreground/70 mb-2 line-clamp-2">{product.description}</p>
        
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-bold text-primary">{formattedPrice}</div>
          <div className="text-sm text-foreground/70">{product.weight}</div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            className="flex-1 gap-2 text-sm"
            onClick={() => onAddToCart(product)}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>أضف للسلة</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex-1 gap-2 text-sm"
            onClick={() => onOrderNow(product)}
          >
            <MessageCircle className="h-4 w-4" />
            <span>اطلب الآن</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
