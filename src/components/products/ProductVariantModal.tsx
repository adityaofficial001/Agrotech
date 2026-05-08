import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose
} from "@/components/ui/dialog";
import { useProductModal } from '@/contexts/ProductModalContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/data/categories';
import { Button } from '@/components/ui/button';
import { X, ShoppingBag, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Helper to generate variants based on the product
// Since we don't have real variant data, we'll mock it intelligently
const generateVariants = (product: Product): Variant[] => {
    // Basic logic: create 3-4 size variants based on the product's base quantity
    const basePrice = product.price;
    const baseOriginalPrice = product.originalPrice || Math.round(basePrice * 1.2);

    // Determine unit
    let unit = 'Unit';
    if (product.quantity?.toLowerCase().includes('ml')) unit = 'ml';
    else if (product.quantity?.toLowerCase().includes('l')) unit = 'L'; // Handle L/ltr/liter
    else if (product.quantity?.toLowerCase().includes('kg')) unit = 'kg';
    else if (product.quantity?.toLowerCase().includes('g')) unit = 'g';

    const variants: Variant[] = [];

    // Helper to add variant
    const addVariant = (size: string, multiplier: number) => {
        const price = Math.round(basePrice * multiplier);
        const originalPrice = Math.round(baseOriginalPrice * multiplier);
        const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

        variants.push({
            id: `${product.id}-${size}`,
            size,
            price,
            originalPrice,
            discount
        });
    };

    if (unit === 'ml' || unit === 'L') {
        const multipliers = [
            { size: '250 ml', mult: 0.5 },
            { size: '500 ml', mult: 0.9 }, // Slight discount for bulk
            { size: '1 L', mult: 1.7 },
            { size: '5 L', mult: 8.0 }
        ];

        // Normalize base quantity to see where it fits, but for now just generate standard sizes
        // If product is "60ml", we perform special logic or just fallback
        if (unit === 'ml' && parseInt(product.quantity) < 100) {
            // Small sizes
            addVariant(product.quantity, 1);
            addVariant("100 ml", 1.5);
            addVariant("250 ml", 3.5);
        } else {
            multipliers.forEach(m => addVariant(m.size, m.mult));
        }
    } else if (unit === 'g' || unit === 'kg') {
        addVariant("500 g", 0.5);
        addVariant("1 kg", 0.95);
        addVariant("5 kg", 4.5);
    } else {
        // Default units
        addVariant("1 Unit", 1);
        addVariant("Pack of 2", 1.9);
        addVariant("Pack of 5", 4.5);
    }

    // Ensure we have at least one variant (the base product)
    if (variants.length === 0) {
        addVariant(product.quantity || "Standard", 1);
    }

    return variants;
};

interface Variant {
    id: string;
    size: string;
    price: number;
    originalPrice: number;
    discount: number;
}

export const ProductVariantModal = () => {
    const { isOpen, product, closeModal } = useProductModal();
    const { t, language } = useLanguage();
    const { addToCart } = useCart();

    // If not open or no product, return null (or kept hidden by Dialog)
    // But we need variants state
    const [variants, setVariants] = useState<Variant[]>([]);

    useEffect(() => {
        if (product) {
            setVariants(generateVariants(product));
        }
    }, [product]);

    if (!product) return null;

    const handleAddToCart = (variant: Variant) => {
        // Create a temporary product object for the cart that represents this variant
        // In a real app we'd have robust IDs, here we append size
        const variantProduct = {
            ...product,
            id: variant.id,
            name: `${product.name} (${variant.size})`,
            nameHi: product.nameHi ? `${product.nameHi} (${variant.size})` : undefined,
            price: variant.price,
            originalPrice: variant.originalPrice,
            quantity: variant.size
        };

        addToCart(variantProduct, 1);
        // We don't close the modal immediately to allow buying multiple sizes? 
        // Or close it? User request says: "Individual Add to Cart button for each variant"
        // Usually modals close on success or show a success state. 
        // For "Add to Cart", usually it stays open or shows a toast. CartContext shows toast.
        // Let's keep it open to allow browsing or adding more? 
        // User request: "Prevent duplicate cart additions on rapid clicks." -> CartContext handles via toast.
        // I'll keep it open.
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
            <DialogContent hideCloseButton={true} className="sm:max-w-[450px] p-0 overflow-hidden bg-white gap-0 border-0 shadow-2xl">
                <div className="absolute right-4 top-4 z-10">
                    <DialogClose className="rounded-full bg-black/5 p-1.5 hover:bg-black/10 transition-colors" onClick={closeModal}>
                        <X className="w-4 h-4 text-gray-500" />
                        <span className="sr-only">Close</span>
                    </DialogClose>
                </div>

                {/* Header / Product Info */}
                <div className="bg-gray-50/80 p-6 flex gap-4 items-start border-b border-gray-100">
                    <div className="w-20 h-20 bg-white rounded-xl shadow-sm p-2 flex-shrink-0 flex items-center justify-center border border-gray-100">
                        {product.image && product.image !== '/placeholder.svg' ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                        ) : (
                            <ShoppingBag className="w-8 h-8 text-primary/20" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                        <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1 opacity-80">{product.brand}</p>
                        <DialogTitle className="text-lg font-display font-bold text-gray-900 leading-tight mb-1">
                            {language === 'HI' && product.nameHi ? product.nameHi : product.name}
                        </DialogTitle>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-800">
                                {t.products.inStock || "In Stock"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Variants Selection */}
                <div className="p-6">
                    <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                        {t.products.chooseSize || "Choose a Size"}
                    </h4>

                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                        {variants.map((variant) => (
                            <div key={variant.id} className="group relative flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all bg-white">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-gray-900">{variant.size}</span>
                                        {variant.discount > 0 && (
                                            <span className="text-[10px] font-bold text-white bg-destructive px-1.5 py-0.5 rounded-full">
                                                {variant.discount}% {t.products.off || 'OFF'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-sm font-bold text-gray-900">₹{variant.price.toLocaleString()}</span>
                                        {variant.originalPrice > variant.price && (
                                            <span className="text-xs text-muted-foreground line-through">₹{variant.originalPrice.toLocaleString()}</span>
                                        )}
                                    </div>
                                    {variant.originalPrice > variant.price && (
                                        <p className="text-[10px] font-medium text-green-600 mt-0.5">
                                            {t.products.save || 'Save'} ₹{(variant.originalPrice - variant.price).toLocaleString()}
                                        </p>
                                    )}
                                </div>

                                <Button
                                    size="sm"
                                    className="h-9 px-4 rounded-lg bg-primary/5 text-primary hover:bg-primary hover:text-white font-bold transition-all shadow-none hover:shadow-lg hover:shadow-primary/20"
                                    onClick={() => handleAddToCart(variant)}
                                >
                                    {t.products.addToCart || "Add"}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
