import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/data/categories";
import { ShoppingCart, Tractor, Bug, Leaf, Zap, ShieldCheck } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
    product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    const { addToCart, buyNow } = useCart();
    const { t, language } = useLanguage();
    const navigate = useNavigate();

    const handleAddToCart = () => {
        addToCart(product);
        // User remains on page, toast handled by context
    };

    const handleBuyNow = () => {
        buyNow(product);
        navigate('/checkout');
    };

    // Determine category icon for the icon row
    const getCategoryIcon = () => {
        if (product.id.toLowerCase().includes('seed')) return <Leaf className="w-4 h-4 text-green-600" />;
        if (product.id.toLowerCase().includes('insect')) return <Bug className="w-4 h-4 text-destructive" />;
        if (product.id.toLowerCase().includes('fert')) return <Zap className="w-4 h-4 text-blue-600" />;
        return <ShieldCheck className="w-4 h-4 text-primary" />;
    };

    return (
        <div className="group bg-card rounded-xl overflow-hidden shadow-agri-sm hover:shadow-agri-lg transition-all duration-300 flex flex-col h-full border border-border/50">
            {/* Image Area */}
            <div className="relative aspect-square bg-gradient-to-br from-agri-cream to-muted overflow-hidden flex items-center justify-center p-6">
                {!product.inStock && (
                    <Badge variant="destructive" className="absolute right-2 top-2 z-10">
                        {t.products.outOfStock}
                    </Badge>
                )}
                <div className="relative group-hover:scale-110 transition-transform duration-500">
                    <Tractor className="h-28 w-28 text-primary/10" />
                </div>
            </div>

            {/* Content Area - From user snippet */}
            <div className="p-4 flex flex-col flex-1">
                {/* Brand row */}
                <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Tractor className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <span className="text-xs font-semibold text-primary">{t.header.title}</span>
                </div>

                {/* Name */}
                <h3 className="font-display font-semibold text-foreground text-sm mb-3 line-clamp-2 group-hover:text-primary transition-colors min-h-[40px]">
                    {language === 'HI' && product.nameHi ? product.nameHi : product.name}
                </h3>

                {/* Feature Icons row */}
                <div className="flex items-center gap-1.5 mb-3">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center" title="Feature Category">
                        {getCategoryIcon()}
                    </div>
                </div>

                <div className="mt-auto">
                    {/* Price display */}
                    <div className="flex items-baseline gap-1 mb-3">
                        <span className="text-xl font-bold text-primary">₹{product.price}</span>
                        {product.originalPrice && (
                            <>
                                <span className="text-muted-foreground mx-1">–</span>
                                <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
                            </>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            variant="secondary"
                            className="w-full h-9 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold shadow-sm hover:translate-y-[-1px] transition-all"
                            onClick={handleBuyNow}
                            disabled={!product.inStock}
                        >
                            {t.products.buyNow || "Buy Now"}
                        </Button>
                        <Button
                            className="w-full h-9 rounded-lg bg-agri-yellow hover:bg-agri-yellow/90 text-agri-brown font-bold shadow-sm flex items-center gap-1.5 hover:translate-y-[-1px] transition-all"
                            onClick={handleAddToCart}
                            disabled={!product.inStock}
                        >
                            <ShoppingCart className="w-4 h-4" />
                            {t.products.addToCart || "Add"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
