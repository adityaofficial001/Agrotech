import React from 'react';
import { ArrowRight, Leaf, Shield, Truck } from 'lucide-react';
import { AgriButton } from '@/components/ui/AgriButton';
import heroImage from '@/assets/hero-farm.jpg';

interface HeroBannerProps {
  currentLanguage?: 'en' | 'hi';
}

const HeroBanner: React.FC<HeroBannerProps> = ({ currentLanguage = 'en' }) => {
  const translations = {
    en: {
      headline: "Premium Agricultural Products",
      subheadline: "For Every Farmer",
      description: "Quality seeds, insecticides, fertilizers and more delivered right to your farm. Trusted by thousands of farmers across India.",
      shopNow: "Shop Now",
      viewProducts: "View All Products",
      feature1: "100% Genuine",
      feature2: "Fast Delivery",
      feature3: "Expert Support",
    },
    hi: {
      headline: "प्रीमियम कृषि उत्पाद",
      subheadline: "हर किसान के लिए",
      description: "गुणवत्तापूर्ण बीज, कीटनाशक, उर्वरक और बहुत कुछ सीधे आपके खेत तक। भारत भर के हजारों किसानों द्वारा विश्वसनीय।",
      shopNow: "अभी खरीदें",
      viewProducts: "सभी उत्पाद देखें",
      feature1: "100% असली",
      feature2: "तेज़ डिलीवरी",
      feature3: "विशेषज्ञ सहायता",
    }
  };

  const t = translations[currentLanguage];

  return (
    <section className="relative overflow-hidden min-h-[600px] lg:min-h-[650px]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Farm landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent" />
      </div>

      {/* Floating Leaves Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <Leaf className="absolute top-20 left-[15%] w-8 h-8 text-agri-lime/40 animate-float-slow -rotate-12" />
        <Leaf className="absolute top-40 right-[25%] w-12 h-12 text-agri-green/30 animate-float-fast rotate-45" />
        <Leaf className="absolute bottom-32 left-[40%] w-10 h-10 text-primary/30 animate-float-medium rotate-90" />
        <Leaf className="absolute top-1/2 right-[10%] w-6 h-6 text-agri-yellow/40 animate-float-slow rotate-180" />
      </div>

      <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
        <div className="max-w-2xl">
          {/* Content */}
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full mb-6 border border-primary/20">
              <Leaf className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Vardhman</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-2 leading-tight">
              {t.headline}
            </h1>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary mb-6">
              {t.subheadline}
            </h2>

            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              {t.description}
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4 mb-10">
              <AgriButton variant="hero" size="xl">
                {t.shopNow}
                <ArrowRight className="w-5 h-5" />
              </AgriButton>
              <AgriButton variant="outline" size="lg">
                {t.viewProducts}
              </AgriButton>
            </div>

            {/* Features */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 bg-card/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-agri-sm">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{t.feature1}</span>
              </div>
              <div className="flex items-center gap-2 bg-card/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-agri-sm">
                <Truck className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{t.feature2}</span>
              </div>
              <div className="flex items-center gap-2 bg-card/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-agri-sm">
                <Leaf className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{t.feature3}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Badge */}
      <div className="absolute bottom-8 right-8 hidden lg:block">
        <div className="bg-agri-yellow text-agri-brown px-6 py-3 rounded-2xl shadow-agri-lg font-semibold text-lg animate-bounce-subtle">
          🌱 Trusted by 10,000+ Farmers
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
