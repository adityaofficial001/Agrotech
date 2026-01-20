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
    const { addToCart } = useCart();
    const { t, language } = useLanguage();
    const navigate = useNavigate();

    const handleAddToCart = () => {
        addToCart(product);
        navigate('/checkout');
    };

    const handleBuyNow = () => {
        addToCart(product);
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
                        <button
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-agri-yellow text-agri-brown font-bold hover:bg-agri-lime shadow-agri-sm hover:shadow-agri-md active:scale-[0.98] h-8 rounded-md px-2 text-[10px] w-full"
                            onClick={handleBuyNow}
                            disabled={!product.inStock}
                        >
                            {t.hero.shopNow || "Buy Now"}
                        </button>
                        <button
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-white font-bold hover:bg-primary/90 shadow-agri-sm hover:shadow-agri-md active:scale-[0.98] h-8 rounded-md px-2 text-[10px] w-full"
                            onClick={handleAddToCart}
                            disabled={!product.inStock}
                        >
                            <ShoppingCart className="w-3 h-3" />
                            <span>{t.products.addToCart || "Add"}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
