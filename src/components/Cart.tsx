
import React, { useState, useEffect } from 'react';
import { Product } from './ProductCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MessageCircle, Plus, Minus, Trash2, Send, Calendar } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

interface CartProps {
  items: (Product & { quantity: number })[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
}

// Delivery areas and their costs
const deliveryAreas = [
  { name: 'westBank', cost: 15 },
  { name: 'jerusalem', cost: 25 },
  { name: 'abuGhoush', cost: 40 },
  { name: 'lands48', cost: 60 },
];

const Cart = ({ items, onUpdateQuantity, onRemoveItem, onClearCart }: CartProps) => {
  const { t } = useTranslation();
  const [selectedArea, setSelectedArea] = useState(deliveryAreas[0].name);
  const [deliveryCost, setDeliveryCost] = useState(deliveryAreas[0].cost);
  const [notes, setNotes] = useState('');
  const [deliveryOption, setDeliveryOption] = useState('now'); // 'now' or 'date'
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(undefined);
  const location = useLocation();
  const { user } = useAuth();
  
  // Update delivery cost when area changes
  useEffect(() => {
    const area = deliveryAreas.find(area => area.name === selectedArea);
    if (area) {
      setDeliveryCost(area.cost);
    }
  }, [selectedArea]);

  // Get user profile from localStorage
  const getUserProfile = () => {
    try {
      const profileData = localStorage.getItem('userProfile');
      return profileData ? JSON.parse(profileData) : null;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  };
  
  // Calculate subtotal
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Calculate total with delivery
  const total = subtotal + deliveryCost;
  
  // Handle browse products button click - improved
  const handleBrowseProductsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (location.pathname !== '/') {
      window.location.href = '/#products';
    } else {
      const productsSection = document.getElementById('products');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Prepare order message
  const prepareOrderMessage = () => {
    const userProfile = getUserProfile();
    
    if (!user && !userProfile) {
      // Redirect to registration if not logged in
      window.location.href = "/register";
      return null;
    }
    
    // Format the order message
    let message = "🛒 *" + t('appName') + "* 🛒\n\n";
    
    // Order details
    message += "*" + t('fullName') + ":* " + (userProfile?.fullName || user?.name || "N/A") + "\n";
    message += "*" + t('orderMethod') + ":* Website\n";
    message += "*" + t('contactInformation') + ":* " + 
                (userProfile?.socialMediaType || "") + " - " + 
                (userProfile?.socialMedia || "N/A") + "\n";
    message += "*" + t('phoneNumber') + ":* " + (userProfile?.phone || user?.phone || "N/A") + "\n";
    
    if (userProfile?.phone2) {
      message += "*" + t('phoneNumber2') + ":* " + userProfile.phone2 + "\n";
    }
    
    if (notes) {
      message += "*" + t('notes') + ":* " + notes + "\n";
    }
    
    message += "*" + t('deliveryCost') + ":* " + 
              t(selectedArea) + " (₪" + deliveryCost + ")\n";
    message += "*" + t('deliveryLocation') + ":* " + 
              t(selectedArea) + "\n";
    message += "*" + t('address') + ":* " + 
              (userProfile?.address || "N/A") + "\n";
    
    // Delivery option
    message += "*" + t('deliveryBy') + ":* ";
    if (deliveryOption === 'now') {
      message += t('startPackaging') + "\n";
    } else if (deliveryDate) {
      message += t('pickDate') + " - " + format(deliveryDate, 'yyyy-MM-dd') + "\n";
    }
    
    // Products
    message += "\n*" + t('products') + ":*\n";
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name} - ${item.quantity} × ₪${item.price} = ₪${item.quantity * item.price}\n`;
    });
    
    // Totals
    message += `\n*${t('subtotal')}:* ₪${subtotal}`;
    message += `\n*${t('deliveryCost')}:* ₪${deliveryCost}`;
    message += `\n*${t('total')}:* ₪${total}`;
    
    return message;
  };
  
  // Handle checkout via WhatsApp
  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: t('cartEmpty'),
        description: t('addMoreItems'),
        variant: "destructive",
      });
      return;
    }
    
    const message = prepareOrderMessage();
    if (!message) return; // User not logged in
    
    // Create WhatsApp URL with correct number
    const phoneNumber = "970597167176";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank");
  };
  
  // Handle send to sales team (this will prepare the data for API integration)
  const handleSendToSalesTeam = () => {
    if (items.length === 0) {
      toast({
        title: t('cartEmpty'),
        description: t('addMoreItems'),
        variant: "destructive",
      });
      return;
    }
    
    const userProfile = getUserProfile();
    if (!user && !userProfile) {
      // Redirect to registration if not logged in
      window.location.href = "/register";
      return;
    }
    
    // This is where you would prepare data for the API
    // In a real implementation, you'd send this data to your backend
    const orderData = {
      buyerName: userProfile?.fullName || user?.name,
      orderMethod: "Website",
      contactInformation: {
        socialMediaType: userProfile?.socialMediaType,
        socialMedia: userProfile?.socialMedia
      },
      phoneNumber1: userProfile?.phone || user?.phone,
      phoneNumber2: userProfile?.phone2,
      notes: notes,
      deliveryCost: deliveryCost,
      deliveryLocation: selectedArea,
      address: userProfile?.address,
      deliveryBy: deliveryOption === 'now' ? 'now' : format(deliveryDate!, 'yyyy-MM-dd'),
      items: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price
      })),
      subtotal: subtotal,
      total: total,
      discount: 0
    };
    
    // For now, we'll just show the data in the console
    // In the future, this would be sent to your API
    console.log("Order data for API:", orderData);
    
    // Show success message
    toast({
      title: "Order Sent",
      description: "Your order has been sent to our sales team.",
    });
    
    // Optionally, you could clear the cart after sending
    // onClearCart();
    
    // For demo purposes, we'll also open WhatsApp
    handleCheckout();
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6">{t('cartTitle')}</h2>
      
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
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">{t('deliveryLocation')}</label>
            <Select
              value={selectedArea}
              onValueChange={setSelectedArea}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('deliveryLocation')} />
              </SelectTrigger>
              <SelectContent>
                {deliveryAreas.map((area) => (
                  <SelectItem key={area.name} value={area.name}>
                    {t(area.name)} - ₪{area.cost}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Delivery Options */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">{t('deliveryBy')}</label>
            <div className="flex gap-2">
              <Button 
                variant={deliveryOption === 'now' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setDeliveryOption('now')}
              >
                {t('startPackaging')}
              </Button>
              <Button 
                variant={deliveryOption === 'date' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setDeliveryOption('date')}
              >
                {t('pickDate')}
              </Button>
            </div>
          </div>
          
          {/* Date Picker (visible only if delivery option is 'date') */}
          {deliveryOption === 'date' && (
            <div className="mb-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                  >
                    {deliveryDate ? format(deliveryDate, 'yyyy-MM-dd') : t('selectDeliveryDate')}
                    <Calendar className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={deliveryDate}
                    onSelect={setDeliveryDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
          
          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">{t('notes')}</label>
            <Textarea 
              placeholder={t('notes')}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize-none"
            />
          </div>
          
          {/* Order Summary */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-foreground/70">{t('subtotal')}</span>
              <span>₪{subtotal}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-foreground/70">{t('deliveryCost')} ({t(selectedArea)})</span>
              <span>₪{deliveryCost}</span>
            </div>
            
            <Separator className="my-2" />
            
            <div className="flex justify-between font-bold text-lg">
              <span>{t('total')}</span>
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
              <span>{t('checkout')}</span>
            </Button>
            
            <Button
              variant="secondary"
              className="w-full gap-2"
              onClick={handleSendToSalesTeam}
            >
              <Send className="h-5 w-5" />
              <span>{t('sendToSalesTeam')}</span>
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={onClearCart}
            >
              {t('clearCart')}
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-10">
          <p className="text-lg text-foreground/70 mb-4">{t('emptyCart')}</p>
          <Button
            variant="link"
            className="text-primary"
            onClick={handleBrowseProductsClick}
          >
            {t('browseProducts')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;
