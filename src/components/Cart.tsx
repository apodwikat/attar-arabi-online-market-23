
import React, { useState, useEffect } from 'react';
import { Product } from './ProductCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MessageCircle, Plus, Minus, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

interface CartProps {
  items: (Product & { quantity: number })[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
}

// Delivery areas and their costs
const deliveryAreas = [
  { name: 'الضفة الغربية', cost: 15 },
  { name: 'القدس', cost: 25 },
  { name: 'أماكن الـ48', cost: 60 },
];

const Cart = ({ items, onUpdateQuantity, onRemoveItem, onClearCart }: CartProps) => {
  const [selectedArea, setSelectedArea] = useState(deliveryAreas[0].name);
  const [deliveryCost, setDeliveryCost] = useState(deliveryAreas[0].cost);
  
  // Update delivery cost when area changes
  useEffect(() => {
    const area = deliveryAreas.find(area => area.name === selectedArea);
    if (area) {
      setDeliveryCost(area.cost);
    }
  }, [selectedArea]);
  
  // Calculate subtotal
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Calculate total with delivery
  const total = subtotal + deliveryCost;
  
  // Handle checkout via WhatsApp
  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "السلة فارغة",
        description: "الرجاء إضافة منتجات إلى السلة قبل إتمام الطلب",
        variant: "destructive",
      });
      return;
    }
    
    // Format the order message
    let message = "🛒 *طلب جديد من العطار العربي* 🛒\n\n";
    message += "*المنتجات:*\n";
    
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name} - ${item.quantity} × ₪${item.price} = ₪${item.quantity * item.price}\n`;
    });
    
    message += `\n*المجموع الفرعي:* ₪${subtotal}`;
    message += `\n*رسوم التوصيل (${selectedArea}):* ₪${deliveryCost}`;
    message += `\n*المجموع الكلي:* ₪${total}`;
    
    // Create WhatsApp URL with correct number
    const phoneNumber = "970597167176";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6">سلة التسوق</h2>
      
      {items.length > 0 ? (
        <>
          {/* Cart Items */}
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                {/* Product Image */}
                <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                
                {/* Product Details */}
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-foreground/70">{item.weight}</p>
                  <p className="text-primary font-bold">₪{item.price}</p>
                </div>
                
                {/* Quantity Control */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  
                  <span className="w-8 text-center">{item.quantity}</span>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => onRemoveItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          
          <Separator className="my-6" />
          
          {/* Delivery Area */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">منطقة التوصيل</label>
            <Select
              value={selectedArea}
              onValueChange={setSelectedArea}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر منطقة التوصيل" />
              </SelectTrigger>
              <SelectContent>
                {deliveryAreas.map((area) => (
                  <SelectItem key={area.name} value={area.name}>
                    {area.name} - ₪{area.cost}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Order Summary */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-foreground/70">المجموع الفرعي</span>
              <span>₪{subtotal}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-foreground/70">رسوم التوصيل ({selectedArea})</span>
              <span>₪{deliveryCost}</span>
            </div>
            
            <Separator className="my-2" />
            
            <div className="flex justify-between font-bold text-lg">
              <span>المجموع</span>
              <span className="text-primary">₪{total}</span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="space-y-3">
            <Button
              className="w-full gap-2"
              onClick={handleCheckout}
            >
              <MessageCircle className="h-5 w-5" />
              <span>إتمام الطلب عبر واتساب</span>
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={onClearCart}
            >
              إفراغ السلة
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-10">
          <p className="text-lg text-foreground/70 mb-4">السلة فارغة</p>
          <Button
            variant="link"
            className="text-primary"
            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
          >
            تصفح المنتجات
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;
