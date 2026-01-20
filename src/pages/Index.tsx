
import { Header } from "@/components/Header";
import { CategoryStrip } from "@/components/CategoryStrip";
import { Hero } from "@/components/Hero";
import Footer from "@/components/layout/Footer";
import { CategoryShowcase } from "@/components/CategoryShowcase";
import { useLanguage } from "../contexts/LanguageContext";
import ProductSlider from "@/components/products/ProductSlider";
import {
  insecticideProducts,
  seedProducts,
  fertilizerProducts,
  herbicideProducts
} from '@/data/products';
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Index = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  // Combine products for showcases
  const allProducts = [
    ...insecticideProducts,
    ...seedProducts,
    ...fertilizerProducts,
    ...herbicideProducts
  ];

  // Mock "Featured" (mix of items)
  const featuredProducts = [
    insecticideProducts[0],
    seedProducts[0],
    fertilizerProducts[0],
    herbicideProducts[0],
    insecticideProducts[1],
    seedProducts[1],
  ].filter(Boolean);

  // Mock "Best Sellers" (sorted by price or random)
  const bestSellers = [
    ...stockFilter(seedProducts),
    ...stockFilter(fertilizerProducts),
    ...stockFilter(insecticideProducts)
  ].slice(0, 8);

  function stockFilter(products: any[]) {
    return products.filter(p => p.inStock);
  }

  const handleAddToCart = (product: any) => {
    toast.success(`${product.name} added to cart`);
  };

  const code = language === 'HI' ? 'hi' : 'en';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <CategoryStrip />

      <main className="flex-grow">
        {/* 1. Hero Banner */}
        <Hero />

        {/* 2. Category Quick Links */}
        <CategoryShowcase />

        {/* 3. Featured Products Section */}
        <div className="container mx-auto px-4 mt-8">
          <ProductSlider
            products={featuredProducts}
            title={language === 'HI' ? 'विशेष उत्पाद' : 'Featured Products'}
            currentLanguage={code}
            onAddToCart={handleAddToCart}
          />
        </div>

        {/* 4. Best-Selling Section */}
        <div className="container mx-auto px-4 mt-8 mb-12">
          <ProductSlider
            products={bestSellers}
            title={language === 'HI' ? 'सर्वाधिक बिकने वाले' : 'Best Sellers'}
            currentLanguage={code}
            onAddToCart={handleAddToCart}
          />
        </div>

      </main>

      <Footer currentLanguage={code} />
    </div>
  );
};

export default Index;
