import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { AgriButton } from '@/components/ui/AgriButton';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage?: 'en' | 'hi';
}

const CartSidebar: React.FC<CartSidebarProps> = ({ 
  isOpen, 
  onClose, 
  currentLanguage = 'en' 
}) => {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, cartTotal, itemsCount, clearCart } = useCart();

  const translations = {
    en: {
      title: "Shopping Cart",
      empty: "Your cart is empty",
      emptyDesc: "Add some products to get started",
      continueShopping: "Continue Shopping",
      subtotal: "Subtotal",
      shipping: "Shipping",
      calculated: "Calculated at checkout",
      total: "Total",
      checkout: "Proceed to Checkout",
      clearCart: "Clear Cart",
      items: "items",
    },
    hi: {
      title: "शॉपिंग कार्ट",
      empty: "आपका कार्ट खाली है",
      emptyDesc: "शुरू करने के लिए कुछ उत्पाद जोड़ें",
      continueShopping: "खरीदारी जारी रखें",
      subtotal: "उप-योग",
      shipping: "शिपिंग",
      calculated: "चेकआउट पर गणना की जाएगी",
      total: "कुल",
      checkout: "चेकआउट करें",
      clearCart: "कार्ट खाली करें",
      items: "आइटम",
    }
  };

  const t = translations[currentLanguage];

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="flex items-center gap-2 text-primary">
            <ShoppingCart className="w-5 h-5" />
            {t.title} ({itemsCount} {t.items})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <ShoppingCart className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{t.empty}</h3>
            <p className="text-muted-foreground mb-6">{t.emptyDesc}</p>
            <AgriButton onClick={onClose}>
              {t.continueShopping}
            </AgriButton>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="flex gap-3 p-3 bg-muted/50 rounded-lg"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 rounded-lg bg-card overflow-hidden shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground text-sm truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      {item.quantity}
                    </p>
                    <p className="text-sm font-semibold text-primary">
                      ₹{item.price.toLocaleString()}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <div className="flex items-center gap-1 bg-card rounded-lg border border-border">
                      <button
                        onClick={() => updateQuantity(item.id, item.cartQuantity - 1)}
                        className="p-1.5 hover:bg-muted transition-colors rounded-l-lg"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-sm font-medium min-w-[24px] text-center">
                        {item.cartQuantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.cartQuantity + 1)}
                        className="p-1.5 hover:bg-muted transition-colors rounded-r-lg"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="border-t border-border pt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.subtotal}</span>
                  <span className="font-medium">₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.shipping}</span>
                  <span className="text-muted-foreground">{t.calculated}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 border-t border-border">
                  <span>{t.total}</span>
                  <span className="text-primary">₹{cartTotal.toLocaleString()}</span>
                </div>
              </div>

              <AgriButton 
                onClick={handleCheckout} 
                className="w-full"
                size="lg"
              >
                {t.checkout}
              </AgriButton>
              
              <button
                onClick={clearCart}
                className="w-full text-sm text-muted-foreground hover:text-destructive transition-colors py-2"
              >
                {t.clearCart}
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSidebar;
