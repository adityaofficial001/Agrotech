import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import TopHeader from '@/components/layout/TopHeader';
import CategoryNav from '@/components/layout/CategoryNav';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { getAllProducts } from '@/data/products';
import { AgriButton } from '@/components/ui/AgriButton';

const Wishlist = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'hi'>('en');
  const { wishlistIds, loading } = useWishlist();
  const { user } = useAuth();

  const allProducts = getAllProducts();
  const allProductsFlat = [
    ...allProducts.insecticides,
    ...allProducts.seeds,
    ...allProducts.fertilizers,
    ...allProducts.herbicides,
  ];

  const wishlistProducts = allProductsFlat.filter(product => 
    wishlistIds.includes(product.id)
  );

  const translations = {
    en: {
      title: 'My Wishlist',
      empty: 'Your wishlist is empty',
      emptyDesc: 'Save products you love by clicking the heart icon',
      browse: 'Browse Products',
      login: 'Login to view your wishlist',
      loginBtn: 'Login',
      items: 'items',
    },
    hi: {
      title: 'मेरी इच्छा सूची',
      empty: 'आपकी इच्छा सूची खाली है',
      emptyDesc: 'दिल के आइकन पर क्लिक करके उत्पादों को सहेजें',
      browse: 'उत्पाद देखें',
      login: 'अपनी इच्छा सूची देखने के लिए लॉगिन करें',
      loginBtn: 'लॉगिन',
      items: 'आइटम',
    }
  };

  const t = translations[currentLanguage];

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <TopHeader currentLanguage={currentLanguage} onLanguageChange={setCurrentLanguage} />
        <CategoryNav currentLanguage={currentLanguage} activeCategory="" onCategoryChange={() => {}} />
        
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-display font-bold text-foreground mb-2">
              {t.login}
            </h2>
            <Link to="/login">
              <AgriButton className="mt-4">{t.loginBtn}</AgriButton>
            </Link>
          </div>
        </main>

        <Footer currentLanguage={currentLanguage} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopHeader currentLanguage={currentLanguage} onLanguageChange={setCurrentLanguage} />
      <CategoryNav currentLanguage={currentLanguage} activeCategory="" onCategoryChange={() => {}} />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary" />
            {t.title}
          </h1>
          {wishlistProducts.length > 0 && (
            <span className="text-muted-foreground">
              {wishlistProducts.length} {t.items}
            </span>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card rounded-xl h-72 animate-pulse" />
            ))}
          </div>
        ) : wishlistProducts.length === 0 ? (
          <div className="bg-card rounded-2xl p-12 text-center border border-border">
            <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-display font-bold text-foreground mb-2">
              {t.empty}
            </h2>
            <p className="text-muted-foreground mb-6">{t.emptyDesc}</p>
            <Link to="/">
              <AgriButton>
                <ShoppingBag className="w-4 h-4 mr-2" />
                {t.browse}
              </AgriButton>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currentLanguage={currentLanguage}
              />
            ))}
          </div>
        )}
      </main>

      <Footer currentLanguage={currentLanguage} />
    </div>
  );
};

export default Wishlist;
