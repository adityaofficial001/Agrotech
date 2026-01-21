
import React from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription
} from "@/components/ui/sheet";
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useCart } from '@/contexts/CartContext';
import { allProductsArray } from '@/data/products';
import { ShoppingCart, Trash2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface WishlistDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ open, onOpenChange }) => {
    const { wishlist, toggleWishlist } = useUserPreferences();
    const { addToCart } = useCart();
    const { t } = useLanguage();

    const wishlistProducts = allProductsArray.filter(p => wishlist.includes(p.id));

    const handleMoveToCart = (product: any) => {
        addToCart(product, 1);
        toggleWishlist(product.id);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                <SheetHeader className="mb-6">
                    <div className="flex items-center gap-2">
                        <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                        <SheetTitle>{t.wishlist.title}</SheetTitle>
                    </div>
                    <SheetDescription>
                        {t.wishlist.itemsSaved
                            .replace('{count}', wishlist.length.toString())
                            .replace('{plural}', wishlist.length !== 1 ? 's' : '')}
                    </SheetDescription>
                </SheetHeader>

                {wishlistProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <Heart className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg">{t.wishlist.empty}</p>
                        <Button variant="link" onClick={() => onOpenChange(false)}>{t.wishlist.continueShopping}</Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {wishlistProducts.map((product) => (
                            <div key={product.id} className="flex gap-4 p-4 border rounded-xl hover:shadow-md transition-shadow">
                                <div className="w-24 h-24 bg-gray-50 rounded-lg flex items-center justify-center p-2">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h4 className="font-semibold text-sm line-clamp-1">{product.name}</h4>
                                        <p className="text-xs text-muted-foreground">{product.brand}</p>
                                        <p className="text-primary font-bold mt-1">₹{product.priceMin}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            className="flex-1 gap-2"
                                            onClick={() => handleMoveToCart(product)}
                                        >
                                            <ShoppingCart className="w-3.5 h-3.5" />
                                            {t.products.addToCart}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => toggleWishlist(product.id)}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
};
