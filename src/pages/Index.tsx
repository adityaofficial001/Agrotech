
import { Header } from "@/components/Header";
import { Product } from "@/data/categories";
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
  herbicideProducts,
  implementsProducts,
  growthProducts,
  bioproductsProducts,
  alliedProducts,
  cropscienceProducts
} from '@/data/products';
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { NAV_CATEGORIES } from "@/data/categories";

const Index = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Combine products for showcases
  const allProducts: Product[] = [
    ...insecticideProducts,
    ...seedProducts,
    ...fertilizerProducts,
    ...herbicideProducts
  ];


  // Sections Configuration - Aligned with Navbar Order
  const categorySections = [
    { id: 'insecticides', products: insecticideProducts, title: t.categories.insecticides },
    { id: 'seeds', products: seedProducts, title: t.categories.seeds },
    { id: 'implements', products: implementsProducts, title: t.categories.implements },
    { id: 'herbicides', products: herbicideProducts, title: t.categories.herbicides },
    { id: 'fertilizers', products: fertilizerProducts, title: t.categories.fertilizers },
    { id: 'growth', products: growthProducts, title: t.categories.growth },
    { id: 'bioproducts', products: bioproductsProducts, title: t.categories.bio },
    { id: 'allied', products: alliedProducts, title: t.categories.allied },
    { id: 'cropscience', products: cropscienceProducts, title: t.categories.cropScience },
    { id: 'offers', products: allProducts.slice(0, 6), title: language === 'HI' ? 'विशेष ऑफर' : 'Special Offers' },
  ];


  const handleAddToCart = (product: Product) => {
    toast.success(`${product.name} added to cart`);
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <CategoryStrip />

      <main className="flex-grow">
        {/* 1. Hero Banner */}
        <Hero />

        {/* 2. Category Quick Links */}
        <CategoryShowcase />


        {/* 5. Dynamic Category Sections */}
        {categorySections.map((section) => (
          <div key={section.id} id={section.id} className="container mx-auto px-4 mt-8 scroll-mt-44">
            <ProductSlider
              products={section.products.slice(0, 8)}
              title={section.title}
              categoryId={section.id}
            />
          </div>
        ))}

        <div className="mb-12"></div>

      </main>

      <Footer />
    </div>
  );
};

export default Index;
