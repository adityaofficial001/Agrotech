import React from 'react';
import { Bug, Skull } from 'lucide-react';

/* Import User Uploaded Images */
import bannerSowing from '@/assets/category-banners/banner-sowing.png';
import bannerDrone from '@/assets/category-banners/banner-drone.png';
import bannerSprayer1 from '@/assets/category-banners/banner-sprayer-1.jpg';
import bannerSprayer2 from '@/assets/category-banners/banner-sprayer-2.jpg';
import bannerGrainHands from '@/assets/category-banners/banner-grain-hands.png';

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

  /* Background Images for Carousel - Category Specific */
  /* Mixing User Uploaded Images with Unsplash High Quality Images */
  const categoryImages: Record<string, string[]> = {
    insecticides: [
      bannerSprayer1, // User image
      bannerSprayer2, // User image
      'https://images.unsplash.com/photo-1615811361523-6bd03c7799a4?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1625246333195-58197ebd0031?q=80&w=1000&auto=format&fit=crop',
    ],
    seeds: [
      bannerSowing, // User image
      bannerGrainHands, // User image
      'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505764761634-1d77b57e94aa?q=80&w=1000&auto=format&fit=crop',
    ],
    herbicides: [
      bannerSprayer2, // User image
      bannerSprayer1, // User image
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=1000&auto=format&fit=crop',
    ],
    fertilizers: [
      bannerSprayer1, // User image
      bannerSowing, // User image
      'https://images.unsplash.com/photo-1589923188900-85dae5233296?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1492496913980-501348b61384?q=80&w=1000&auto=format&fit=crop',
    ],
    implements: [
      bannerDrone, // User image
      bannerSprayer1, // User image
      bannerSprayer2, // User image
      'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?q=80&w=1000&auto=format&fit=crop',
    ],
    growth: [
      bannerSowing, // User image
      bannerDrone, // User image
      'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1530968939281-a6efc44eaee0?q=80&w=1000&auto=format&fit=crop',
    ],
    bioproducts: [
      bannerGrainHands, // User image
      bannerSowing, // User image
      'https://images.unsplash.com/photo-1584478479233-a3b04c000f5c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=1000&auto=format&fit=crop',
    ],
    allied: [
      bannerDrone, // User image
      bannerSprayer2, // User image
      'https://images.unsplash.com/photo-1563514227147-6d2ff63448fe?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1622383563227-0440113a090b?q=80&w=1000&auto=format&fit=crop',
    ],
    cropscience: [
      bannerDrone, // User image
      bannerGrainHands, // User image
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581093450065-0840ea4d023f?q=80&w=1000&auto=format&fit=crop',
    ],
    offers: [
      bannerGrainHands, // User image
      bannerDrone, // User image
      'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop',
    ]
  };

  const bannerImages = categoryImages[category] || categoryImages.insecticides; // Default fallback

  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative group rounded-2xl overflow-hidden mb-8 min-h-[250px] flex items-center shadow-2xl">

      {/* Background Carousel with Parallax/3D Effect */}
      <div className="absolute inset-0 z-0 bg-black">
        {bannerImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <img
              src={image}
              alt="Farm Background"
              className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-linear ${index === currentImageIndex ? 'scale-110' : 'scale-100'
                }`}
            />
          </div>
        ))}
        {/* Gradient Overlay for Depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
      </div>

      <div className="relative z-20 px-6 py-8 md:px-10 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6 w-full perspective-1000">
        {/* Text Content with 3D lift */}
        <div className="text-center md:text-left transform transition-transform duration-500 hover:scale-[1.02] hover:translate-z-10">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-3 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] tracking-tight">
            {data.title[currentLanguage]}
          </h2>
          <p className="text-white/90 max-w-lg text-sm md:text-lg font-medium drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
            {data.description[currentLanguage]}
          </p>
        </div>

        {/* Pest Graphic for Insecticides - Floating Effect */}
        {data.showPestGraphic && (
          <div className="flex items-center gap-4 animate-bounce-subtle">
            {/* Dead Bug Illustration */}
            <div className="relative transform hover:scale-110 transition-transform duration-300">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-destructive/20 flex items-center justify-center backdrop-blur-md border border-white/20 shadow-xl">
                <div className="relative">
                  <Bug className="w-10 h-10 md:w-12 md:h-12 text-white rotate-180 drop-shadow-lg" />
                  {/* X eyes */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-1">
                    <span className="text-destructive font-bold text-xs drop-shadow-md">✕</span>
                    <span className="text-destructive font-bold text-xs drop-shadow-md">✕</span>
                  </div>
                </div>
              </div>
              {/* Strike through */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-1 bg-destructive rotate-45 rounded shadow-lg" />
              </div>
            </div>

            {/* Skull Icon */}
            <div className="hidden md:flex w-16 h-16 rounded-full bg-agri-yellow/20 items-center justify-center backdrop-blur-md border border-white/20 shadow-xl transform hover:rotate-12 transition-transform duration-300">
              <Skull className="w-8 h-8 text-agri-yellow drop-shadow-lg" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryBanner;
