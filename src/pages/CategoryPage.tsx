import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopHeader from '@/components/layout/TopHeader';
import CategoryNav from '@/components/layout/CategoryNav';
import Footer from '@/components/layout/Footer';
import CategoryBanner from '@/components/sections/CategoryBanner';
import ProductSlider from '@/components/products/ProductSlider';
import ProductGrid from '@/components/products/ProductGrid';
import FilterSidebar from '@/components/products/FilterSidebar';
import { Product } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import {
  insecticideProducts,
  seedProducts,
  fertilizerProducts,
  herbicideProducts
} from '@/data/products';
import { toast } from '@/hooks/use-toast';

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'hi'>('en');

  // Filter States
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Reset filters when category changes
  useEffect(() => {
    setSelectedBrands([]);
    setSelectedCrops([]);
    setPriceRange([0, 10000]);
    setOnlyInStock(false);
    setIsMobileFilterOpen(false);
  }, [categoryId]);

  const translations = {
    en: {
      insecticides: 'Insecticides',
      seeds: 'Seeds & Saplings',
      fertilizers: 'Fertilizers',
      herbicides: 'Herbicides',
      implements: 'Implements',
      growth: 'Plant Growth Promoters',
      bioproducts: 'Bioproducts',
      allied: 'Allied Products',
      cropscience: 'Crop Science',
      offers: 'Services & Offers',
      addedToCart: 'Added to cart!',
      comingSoon: 'Coming Soon',
      comingSoonDesc: 'We are working on adding products to this category. Please check back soon!',
      relatedProducts: 'You might also like',
      filterBtn: 'Filters',
    },
    hi: {
      insecticides: 'कीटनाशक',
      seeds: 'बीज और पौधे',
      fertilizers: 'उर्वरक',
      herbicides: 'खरपतवारनाशी',
      implements: 'उपकरण',
      growth: 'पौधा विकास प्रवर्तक',
      bioproducts: 'जैव उत्पाद',
      allied: 'संबद्ध उत्पाद',
      cropscience: 'फसल विज्ञान',
      offers: 'सेवाएं और ऑफर',
      addedToCart: 'कार्ट में जोड़ा गया!',
      comingSoon: 'जल्द आ रहा है',
      comingSoonDesc: 'हम इस श्रेणी में उत्पाद जोड़ने पर काम कर रहे हैं। कृपया जल्द ही वापस आएं!',
      relatedProducts: 'आपको यह भी पसंद आ सकता है',
      filterBtn: 'फिल्टर',
    }
  };

  const t = translations[currentLanguage];

  const getProductCountText = (filtered: number, total: number) => {
    if (currentLanguage === 'hi') {
      return `${total} में से ${filtered} उत्पाद दिखा रहे हैं`;
    }
    return `Showing ${filtered} of ${total} products`;
  };

  const handleAddToCart = (product: Product) => {
    toast({
      title: t.addedToCart,
      description: product.name,
    });
  };

  const handleCategoryChange = (newCategoryId: string) => {
    navigate(`/category/${newCategoryId}`);
  };

  const getCategoryData = () => {
    switch (categoryId) {
      case 'insecticides':
        return {
          products: insecticideProducts,
          title: t.insecticides,
          relatedProducts: seedProducts.slice(0, 4),
          relatedTitle: t.seeds
        };
      case 'seeds':
        return {
          products: seedProducts,
          title: t.seeds,
          relatedProducts: fertilizerProducts.slice(0, 4),
          relatedTitle: t.fertilizers
        };
      case 'fertilizers':
        return {
          products: fertilizerProducts,
          title: t.fertilizers,
          relatedProducts: herbicideProducts.slice(0, 4),
          relatedTitle: t.herbicides
        };
      case 'herbicides':
        return {
          products: herbicideProducts,
          title: t.herbicides,
          relatedProducts: insecticideProducts.slice(0, 4),
          relatedTitle: t.insecticides
        };
      case 'implements':
        return {
          products: [],
          title: t.implements,
          relatedProducts: fertilizerProducts.slice(0, 4),
          relatedTitle: t.fertilizers
        };
      case 'growth':
        return {
          products: [],
          title: t.growth,
          relatedProducts: seedProducts.slice(0, 4),
          relatedTitle: t.seeds
        };
      case 'bioproducts':
        return {
          products: [],
          title: t.bioproducts,
          relatedProducts: insecticideProducts.slice(0, 4),
          relatedTitle: t.insecticides
        };
      case 'allied':
        return {
          products: [],
          title: t.allied,
          relatedProducts: herbicideProducts.slice(0, 4),
          relatedTitle: t.herbicides
        };
      case 'cropscience':
        return {
          products: [],
          title: t.cropscience,
          relatedProducts: seedProducts.slice(0, 4),
          relatedTitle: t.seeds
        };
      case 'offers':
        return {
          products: [],
          title: t.offers,
          relatedProducts: insecticideProducts.slice(0, 4),
          relatedTitle: t.insecticides
        };
      default:
        return {
          products: insecticideProducts,
          title: t.insecticides,
          relatedProducts: seedProducts.slice(0, 4),
          relatedTitle: t.seeds
        };
    }
  };

  const { products, title, relatedProducts } = getCategoryData();

  // Derived Filter Data
  const { availableBrands, availableCrops, minPrice, maxPrice } = useMemo(() => {
    if (products.length === 0) return { availableBrands: [], availableCrops: [], minPrice: 0, maxPrice: 10000 };

    const brands = Array.from(new Set(products.map(p => p.brand))).sort();

    const cropsSet = new Set<string>();
    products.forEach(p => {
      p.crops?.forEach(c => cropsSet.add(c));
    });
    const crops = Array.from(cropsSet).sort();

    const prices = products.flatMap(p => [p.priceMin, p.priceMax]);
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    return {
      availableBrands: brands,
      availableCrops: crops,
      minPrice: Math.floor(min / 100) * 100, // Round down to nearest 100
      maxPrice: Math.ceil(max / 100) * 100, // Round up to nearest 100
    };
  }, [products]);

  // Update price range when min/max changes
  useEffect(() => {
    if (minPrice !== undefined && maxPrice !== undefined) {
      setPriceRange([minPrice, maxPrice]);
    }
  }, [minPrice, maxPrice]);


  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Brand Filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }

      // Crop Filter
      if (selectedCrops.length > 0) {
        const productCrops = product.crops || [];
        const hasMatchingCrop = selectedCrops.some(crop => productCrops.includes(crop));
        if (!hasMatchingCrop) return false;
      }

      // Price Filter
      if (product.priceMin > priceRange[1] || product.priceMax < priceRange[0]) {
        return false;
      }

      // Stock Filter
      if (onlyInStock && !product.inStock) {
        return false;
      }

      return true;
    });
  }, [products, selectedBrands, selectedCrops, priceRange, onlyInStock]);

  // Handle Filter Changes
  const handleBrandChange = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handleCropChange = (crop: string) => {
    setSelectedCrops(prev =>
      prev.includes(crop) ? prev.filter(c => c !== crop) : [...prev, crop]
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopHeader
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
      />

      <CategoryNav
        currentLanguage={currentLanguage}
        activeCategory={categoryId || 'insecticides'}
        onCategoryChange={handleCategoryChange}
      />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <CategoryBanner
            category={categoryId || 'insecticides'}
            currentLanguage={currentLanguage}
          />

          {products.length > 0 ? (
            <div className="flex flex-col lg:flex-row gap-8 relative">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-4">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => setIsMobileFilterOpen(true)}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  {t.filterBtn}
                </Button>
              </div>

              {/* Sidebar */}
              <FilterSidebar
                isOpen={isMobileFilterOpen}
                onClose={() => setIsMobileFilterOpen(false)}
                brands={availableBrands}
                crops={availableCrops}
                minPrice={minPrice}
                maxPrice={maxPrice}
                selectedBrands={selectedBrands}
                onBrandChange={handleBrandChange}
                selectedCrops={selectedCrops}
                onCropChange={handleCropChange}
                priceRange={priceRange}
                onPriceChange={setPriceRange}
                onlyInStock={onlyInStock}
                onStockChange={setOnlyInStock}
                currentLanguage={currentLanguage}
              />

              {/* Product Grid */}
              <div className="flex-1">
                <div className="mb-4 text-sm text-muted-foreground">
                  {getProductCountText(filteredProducts.length, products.length)}
                </div>
                <ProductGrid
                  products={filteredProducts}
                  currentLanguage={currentLanguage}
                  onAddToCart={handleAddToCart}
                />
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-2xl p-12 text-center my-8 border border-border">
              <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-4xl">🌱</span>
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-3">
                {t.comingSoon}
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                {t.comingSoonDesc}
              </p>
            </div>
          )}

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-12 border-t border-border pt-12">
              <ProductSlider
                products={relatedProducts}
                title={t.relatedProducts}
                currentLanguage={currentLanguage}
                onAddToCart={handleAddToCart}
              />
            </div>
          )}
        </div>
      </main>

      <Footer currentLanguage={currentLanguage} />
    </div>
  );
};

export default CategoryPage;
