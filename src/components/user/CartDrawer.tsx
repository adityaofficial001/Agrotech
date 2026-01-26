
import React from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter
} from "@/components/ui/sheet";
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

interface CartDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ open, onOpenChange }) => {
    const { items, updateQuantity, removeFromCart, cartTotal, itemsCount } = useCart();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const handleCheckout = () => {
        onOpenChange(false);
        navigate('/checkout');
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[400px] sm:w-[540px] flex flex-col h-full">
                <SheetHeader className="mb-6">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="w-6 h-6 text-primary" />
                        <SheetTitle>{t.cart?.title || 'Your Shopping Cart'}</SheetTitle>
                    </div>
                    <SheetDescription>
                        {t.cart?.itemCount?.replace('{count}', itemsCount.toString()).replace('{plural}', itemsCount !== 1 ? 's' : '') || `You have ${itemsCount} item${itemsCount !== 1 ? 's' : ''} in your cart.`}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                            <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                            <p className="text-lg font-medium">{t.cart?.empty || 'Your cart is empty'}</p>
                            <Button variant="link" onClick={() => onOpenChange(false)} className="mt-2 text-primary">{t.cart?.startShopping || 'Start Shopping'}</Button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4 p-4 border rounded-xl hover:shadow-md transition-shadow bg-white">
                                    <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center p-2 flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between min-w-0">
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="min-w-0">
                                                <h4 className="font-bold text-sm truncate">{item.name}</h4>
                                                <p className="text-xs text-muted-foreground">{item.brand}</p>
                                            </div>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5 -mt-1 -mr-1"
                                                onClick={() => removeFromCart(item.id)}
                                                title={t.cart?.removeItem || 'Remove item'}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        <div className="flex justify-between items-end mt-2">
                                            <p className="text-primary font-black">₹{(item.price * item.cartQuantity).toLocaleString()}</p>

                                            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-7 w-7 rounded-md hover:bg-white"
                                                    onClick={() => updateQuantity(item.id, item.cartQuantity - 1)}
                                                    title={t.cart?.decreaseQty || 'Decrease quantity'}
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </Button>
                                                <span className="text-xs font-bold w-4 text-center">{item.cartQuantity}</span>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-7 w-7 rounded-md hover:bg-white"
                                                    onClick={() => updateQuantity(item.id, item.cartQuantity + 1)}
                                                    title={t.cart?.increaseQty || 'Increase quantity'}
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="pt-6 border-t mt-auto">
                        <div className="flex flex-col gap-4 mb-6">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">{t.cart?.subtotal || 'Subtotal'}</span>
                                <span className="font-semibold text-gray-900">₹{cartTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">{t.cart?.shipping || 'Shipping'}</span>
                                <span className="text-green-600 font-bold uppercase text-[10px] tracking-widest bg-green-50 px-2 py-0.5 rounded border border-green-100">{t.cart?.calculatedAtCheckout || 'Calculated at checkout'}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-900">{t.cart?.estimatedTotal || 'Estimated Total'}</span>
                                <span className="text-2xl font-black text-primary">₹{cartTotal.toLocaleString()}</span>
                            </div>
                        </div>

                        <Button className="w-full h-12 text-base font-bold gap-2 rounded-xl shadow-lg shadow-primary/20" onClick={handleCheckout}>
                            {t.cart?.proceedToCheckout || 'Proceed to Checkout'}
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                        <p className="text-center text-[10px] text-muted-foreground mt-4 uppercase tracking-tighter">
                            {t.cart?.termsAgreement || 'By proceeding, you agree to our terms and conditions.'}
                        </p>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
};
