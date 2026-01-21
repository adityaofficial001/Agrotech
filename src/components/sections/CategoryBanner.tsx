import React from 'react';
import { Bug, Skull } from 'lucide-react';

interface CategoryBannerProps {
  category: string;
  currentLanguage?: 'en' | 'hi';
}

const CategoryBanner: React.FC<CategoryBannerProps> = ({
  category,
  currentLanguage = 'en'
}) => {
  const categoryData: Record<string, {
    title: { en: string; hi: string };
    description: { en: string; hi: string };
    showPestGraphic: boolean;
  }> = {
    insecticides: {
      title: { en: 'Insecticides', hi: 'कीटनाशक' },
      description: {
        en: 'Protect your crops with our premium range of insecticides. Effective solutions for every pest problem.',
        hi: 'हमारे प्रीमियम कीटनाशकों की श्रृंखला से अपनी फसलों की रक्षा करें। हर कीट समस्या का प्रभावी समाधान।'
      },
      showPestGraphic: true,
    },
    seeds: {
      title: { en: 'Seeds & Saplings', hi: 'बीज और पौधे' },
      description: {
        en: 'High-quality seeds and saplings for maximum yield and healthy crops.',
        hi: 'अधिकतम उपज और स्वस्थ फसलों के लिए उच्च गुणवत्ता वाले बीज और पौधे।'
      },
      showPestGraphic: false,
    },
    herbicides: {
      title: { en: 'Herbicides', hi: 'खरपतवारनाशी' },
      description: {
        en: 'Effective weed control solutions to keep your fields clean and productive.',
        hi: 'अपने खेतों को साफ और उत्पादक रखने के लिए प्रभावी खरपतवार नियंत्रण समाधान।'
      },
      showPestGraphic: false,
    },
    fertilizers: {
      title: { en: 'Fertilizers', hi: 'उर्वरक' },
      description: {
        en: 'Nutrient-rich fertilizers for healthy soil and abundant harvests.',
        hi: 'स्वस्थ मिट्टी और भरपूर फसल के लिए पोषक तत्वों से भरपूर उर्वरक।'
      },
      showPestGraphic: false,
    },
    implements: {
      title: { en: 'Agricultural Implements', hi: 'कृषि उपकरण' },
      description: {
        en: 'Modern tools and machinery to make your farming easier and more efficient.',
        hi: 'आपकी खेती को आसान और अधिक कुशल बनाने के लिए आधुनिक उपकरण और मशीनरी।'
      },
      showPestGraphic: false,
    },
    growth: {
      title: { en: 'Plant Growth Promoters', hi: 'पौध विकास प्रमोटर' },
      description: {
        en: 'Boost your crop growth and yield with our advanced plant growth solutions.',
        hi: 'हमारे उन्नत पौध विकास समाधानों के साथ अपनी फसल की वृद्धि और उपज बढ़ाएं।'
      },
      showPestGraphic: false,
    },
    bioproducts: {
      title: { en: 'Bioproducts', hi: 'जैव उत्पाद' },
      description: {
        en: 'Organic and eco-friendly solutions for sustainable and healthy farming.',
        hi: 'स्थायी और स्वस्थ खेती के लिए जैविक और पर्यावरण के अनुकूल समाधान।'
      },
      showPestGraphic: false,
    },
    allied: {
      title: { en: 'Allied Products', hi: 'संबद्ध उत्पाद' },
      description: {
        en: 'Essential agricultural accessories and supplies for your daily farming needs.',
        hi: 'आपकी दैनिक खेती की जरूरतों के लिए आवश्यक कृषि सहायक उपकरण और आपूर्ति।'
      },
      showPestGraphic: false,
    },
    cropscience: {
      title: { en: 'Crop Science', hi: 'फसल विज्ञान' },
      description: {
        en: 'Science-backed solutions for optimal crop health and development.',
        hi: 'इष्टतम फसल स्वास्थ्य और विकास के लिए विज्ञान-समर्थित समाधान।'
      },
      showPestGraphic: false,
    },
    offers: {
      title: { en: 'Special Offers', hi: 'विशेष ऑफर' },
      description: {
        en: 'Grab the best deals on premium agricultural products. Limited time offers!',
        hi: 'प्रीमियम कृषि उत्पादों पर सर्वोत्तम सौदे प्राप्त करें। सीमित समय के ऑफर!'
      },
      showPestGraphic: false,
    },
  };

  const data = categoryData[category] || {
    title: { en: category, hi: category },
    description: { en: '', hi: '' },
    showPestGraphic: false
  };

  return (
    <div className="relative bg-gradient-to-r from-primary via-agri-green to-agri-green-dark rounded-2xl overflow-hidden mb-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="cat-pattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="5" cy="5" r="1" fill="white" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#cat-pattern)" />
        </svg>
      </div>

      <div className="relative px-6 py-8 md:px-10 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Text Content */}
        <div className="text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-3">
            {data.title[currentLanguage]}
          </h2>
          <p className="text-primary-foreground/80 max-w-lg text-sm md:text-base">
            {data.description[currentLanguage]}
          </p>
        </div>

        {/* Pest Graphic for Insecticides */}
        {data.showPestGraphic && (
          <div className="flex items-center gap-4">
            {/* Dead Bug Illustration */}
            <div className="relative">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-destructive/20 flex items-center justify-center">
                <div className="relative">
                  <Bug className="w-10 h-10 md:w-12 md:h-12 text-primary-foreground rotate-180" />
                  {/* X eyes */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-1">
                    <span className="text-destructive font-bold text-xs">✕</span>
                    <span className="text-destructive font-bold text-xs">✕</span>
                  </div>
                </div>
              </div>
              {/* Strike through */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-1 bg-destructive rotate-45 rounded" />
              </div>
            </div>

            {/* Skull Icon */}
            <div className="hidden md:flex w-16 h-16 rounded-full bg-agri-yellow/20 items-center justify-center">
              <Skull className="w-8 h-8 text-agri-yellow" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryBanner;
