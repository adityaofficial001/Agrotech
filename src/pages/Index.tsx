import React, { useState } from 'react';
import TopHeader from '@/components/layout/TopHeader';
import CategoryNav from '@/components/layout/CategoryNav';
import Footer from '@/components/layout/Footer';
import HeroBanner from '@/components/sections/HeroBanner';
import CategoryBanner from '@/components/sections/CategoryBanner';
import ProductSlider from '@/components/products/ProductSlider';
import { Product } from '@/components/products/ProductCard';
import { 
  insecticideProducts, 
  seedProducts, 
  fertilizerProducts, 
  herbicideProducts 
} from '@/data/products';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'hi'>('en');
  const [activeCategory, setActiveCategory] = useState('insecticides');

  const translations = {
    en: {
      insecticides: 'Insecticides',
      seeds: 'Seeds & Saplings',
      fertilizers: 'Fertilizers',
      herbicides: 'Herbicides',
      allProducts: 'All Products',
      featuredProducts: 'Featured Products',
      addedToCart: 'Added to cart!',
    },
    hi: {
      insecticides: 'कीटनाशक',
      seeds: 'बीज और पौधे',
      fertilizers: 'उर्वरक',
      herbicides: 'खरपतवारनाशी',
      allProducts: 'सभी उत्पाद',
      featuredProducts: 'विशेष उत्पाद',
      addedToCart: 'कार्ट में जोड़ा गया!',
    }
  };

  const t = translations[currentLanguage];

  const handleAddToCart = (product: Product) => {
    toast({
      title: t.addedToCart,
      description: product.name,
    });
  };

  const getCategoryProducts = () => {
    switch (activeCategory) {
      case 'insecticides':
        return { products: insecticideProducts, title: t.insecticides };
      case 'seeds':
        return { products: seedProducts, title: t.seeds };
      case 'fertilizers':
        return { products: fertilizerProducts, title: t.fertilizers };
      case 'herbicides':
        return { products: herbicideProducts, title: t.herbicides };
      default:
        return { products: insecticideProducts, title: t.insecticides };
    }
  };

  const { products, title } = getCategoryProducts();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <TopHeader 
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
      />

      {/* Category Navigation */}
      <CategoryNav 
        currentLanguage={currentLanguage}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Banner */}
        <HeroBanner currentLanguage={currentLanguage} />

        {/* Products Section */}
        <div className="container mx-auto px-4 py-8">
          {/* Category Banner */}
          <CategoryBanner 
            category={activeCategory}
            currentLanguage={currentLanguage}
          />

          {/* Product Slider/Grid */}
          <ProductSlider 
            products={products}
            title={title}
            currentLanguage={currentLanguage}
            onAddToCart={handleAddToCart}
          />

          {/* Featured Products from other categories */}
          {activeCategory === 'insecticides' && (
            <>
              <ProductSlider 
                products={seedProducts.slice(0, 5)}
                title={t.seeds}
                currentLanguage={currentLanguage}
                onAddToCart={handleAddToCart}
              />
              <ProductSlider 
                products={fertilizerProducts.slice(0, 5)}
                title={t.fertilizers}
                currentLanguage={currentLanguage}
                onAddToCart={handleAddToCart}
              />
            </>
          )}

          {activeCategory === 'seeds' && (
            <ProductSlider 
              products={fertilizerProducts.slice(0, 5)}
              title={t.fertilizers}
              currentLanguage={currentLanguage}
              onAddToCart={handleAddToCart}
            />
          )}

          {activeCategory === 'fertilizers' && (
            <ProductSlider 
              products={herbicideProducts.slice(0, 4)}
              title={t.herbicides}
              currentLanguage={currentLanguage}
              onAddToCart={handleAddToCart}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer currentLanguage={currentLanguage} />
    </div>
  );
};

export default Index;
