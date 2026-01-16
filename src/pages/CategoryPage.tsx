import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopHeader from '@/components/layout/TopHeader';
import CategoryNav from '@/components/layout/CategoryNav';
import Footer from '@/components/layout/Footer';
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

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'hi'>('en');

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
      allProducts: 'All Products',
      addedToCart: 'Added to cart!',
      noProducts: 'No products available in this category yet.',
      comingSoon: 'Coming Soon',
      comingSoonDesc: 'We are working on adding products to this category. Please check back soon!',
      relatedProducts: 'You might also like',
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
      allProducts: 'सभी उत्पाद',
      addedToCart: 'कार्ट में जोड़ा गया!',
      noProducts: 'इस श्रेणी में अभी कोई उत्पाद उपलब्ध नहीं है।',
      comingSoon: 'जल्द आ रहा है',
      comingSoonDesc: 'हम इस श्रेणी में उत्पाद जोड़ने पर काम कर रहे हैं। कृपया जल्द ही वापस आएं!',
      relatedProducts: 'आपको यह भी पसंद आ सकता है',
    }
  };

  const t = translations[currentLanguage];

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

  const { products, title, relatedProducts, relatedTitle } = getCategoryData();

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
            <ProductSlider 
              products={products}
              title={title}
              currentLanguage={currentLanguage}
              onAddToCart={handleAddToCart}
            />
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
            <div className="mt-12">
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
