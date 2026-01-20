import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tractor, ShoppingCart, Wheat, Bug, Droplets } from 'lucide-react';
import { AgriButton } from '@/components/ui/AgriButton';

export interface Product {
  id: string;
  name: string;
  brand: string;
  image?: string;
  priceMin: number;
  priceMax: number;
  quantity: string;
  inStock: boolean;
  crops?: string[];
  pests?: string[];
}

interface ProductCardProps {
  product: Product;
  currentLanguage?: 'en' | 'hi';
  onAddToCart?: (product: Product) => void;
}

const cropIcons: Record<string, React.ElementType> = {
  wheat: Wheat,
  rice: Droplets,
  pest: Bug,
};

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  currentLanguage = 'en',
  onAddToCart 
}) => {
  const navigate = useNavigate();
  
  const translations = {
    en: {
      outOfStock: "Out of Stock",
      addToCart: "Add to Cart",
      shopNow: "Shop Now",
    },
    hi: {
      outOfStock: "स्टॉक में नहीं",
      addToCart: "कार्ट में जोड़ें",
      shopNow: "अभी खरीदें",
    }
  };

  const t = translations[currentLanguage];

  const handleShopNow = () => {
    if (product.inStock) {
      navigate(`/product/${product.id}`);
    }
  };

  return (
    <div className="group bg-card rounded-xl overflow-hidden shadow-agri-sm hover:shadow-agri-lg transition-all duration-300 flex flex-col">
      {/* Image Section with Pattern Background */}
      <div className="relative h-48 bg-gradient-to-br from-agri-cream to-muted overflow-hidden">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="farm-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1.5" fill="currentColor" className="text-primary" />
            </pattern>
            <rect width="100" height="100" fill="url(#farm-pattern)" />
          </svg>
        </div>

        {/* Product Image */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name}
              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <Tractor className="w-12 h-12 text-primary" />
            </div>
          )}
        </div>

        {/* Stock Badge */}
        {!product.inStock && (
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full">
              {t.outOfStock}
            </span>
          </div>
        )}

        {/* Quantity Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded">
            {product.quantity}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1">
        {/* Brand */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <Tractor className="w-3 h-3 text-primary-foreground" />
          </div>
          <span className="text-xs font-semibold text-primary">{product.brand}</span>
        </div>

        {/* Product Name */}
        <h3 className="font-display font-semibold text-foreground text-sm mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Crop/Pest Icons */}
        {(product.crops || product.pests) && (
          <div className="flex items-center gap-1.5 mb-3">
            {product.crops?.map((crop, idx) => (
              <div 
                key={`crop-${idx}`}
                className="w-7 h-7 rounded-full bg-agri-green-light/20 flex items-center justify-center"
                title={crop}
              >
                <Wheat className="w-4 h-4 text-agri-green" />
              </div>
            ))}
            {product.pests?.map((pest, idx) => (
              <div 
                key={`pest-${idx}`}
                className="w-7 h-7 rounded-full bg-destructive/10 flex items-center justify-center"
                title={pest}
              >
                <Bug className="w-4 h-4 text-destructive" />
              </div>
            ))}
          </div>
        )}

        {/* Price */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-lg font-bold text-primary">
              ₹{product.priceMin.toLocaleString()}
            </span>
            {product.priceMax !== product.priceMin && (
              <>
                <span className="text-muted-foreground">–</span>
                <span className="text-lg font-bold text-primary">
                  ₹{product.priceMax.toLocaleString()}
                </span>
              </>
            )}
          </div>

          {/* Action Button */}
          <AgriButton 
            variant={product.inStock ? "cart" : "outline"}
            size="sm"
            className="w-full"
            disabled={!product.inStock}
            onClick={handleShopNow}
          >
            <ShoppingCart className="w-4 h-4" />
            {product.inStock ? t.shopNow : t.outOfStock}
          </AgriButton>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
