import React, { useState } from 'react';
import { 
  Bug, 
  Leaf, 
  Wrench, 
  Sprout, 
  Droplets, 
  TrendingUp, 
  Microscope, 
  ShoppingBag, 
  BookOpen, 
  Gift,
  Menu,
  X
} from 'lucide-react';

interface Category {
  id: string;
  name: {
    en: string;
    hi: string;
  };
  icon: React.ElementType;
  href: string;
}

const categories: Category[] = [
  { id: 'insecticides', name: { en: 'Insecticides', hi: 'कीटनाशक' }, icon: Bug, href: '#insecticides' },
  { id: 'seeds', name: { en: 'Seeds & Saplings', hi: 'बीज और पौधे' }, icon: Sprout, href: '#seeds' },
  { id: 'implements', name: { en: 'Implements', hi: 'उपकरण' }, icon: Wrench, href: '#implements' },
  { id: 'herbicides', name: { en: 'Herbicides', hi: 'खरपतवारनाशी' }, icon: Leaf, href: '#herbicides' },
  { id: 'fertilizers', name: { en: 'Fertilizers', hi: 'उर्वरक' }, icon: Droplets, href: '#fertilizers' },
  { id: 'growth', name: { en: 'Plant Growth Promoters', hi: 'पौधा विकास प्रवर्तक' }, icon: TrendingUp, href: '#growth' },
  { id: 'bioproducts', name: { en: 'Bioproducts', hi: 'जैव उत्पाद' }, icon: Microscope, href: '#bioproducts' },
  { id: 'allied', name: { en: 'Allied Products', hi: 'संबद्ध उत्पाद' }, icon: ShoppingBag, href: '#allied' },
  { id: 'cropscience', name: { en: 'Crop Science', hi: 'फसल विज्ञान' }, icon: BookOpen, href: '#cropscience' },
  { id: 'offers', name: { en: 'Services & Offers', hi: 'सेवाएं और ऑफर' }, icon: Gift, href: '#offers' },
];

interface CategoryNavProps {
  currentLanguage?: 'en' | 'hi';
  activeCategory?: string;
  onCategoryChange?: (categoryId: string) => void;
}

const CategoryNav: React.FC<CategoryNavProps> = ({ 
  currentLanguage = 'en',
  activeCategory = 'insecticides',
  onCategoryChange
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="agri-gradient-header sticky top-0 z-40">
      <div className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-center">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            
            return (
              <a
                key={category.id}
                href={category.href}
                onClick={(e) => {
                  e.preventDefault();
                  onCategoryChange?.(category.id);
                }}
                className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-agri-lime/20 text-agri-lime' 
                    : 'text-primary-foreground/90 hover:bg-primary-foreground/10 hover:text-primary-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="whitespace-nowrap">{category.name[currentLanguage]}</span>
              </a>
            );
          })}
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="lg:hidden flex items-center justify-between py-3">
          <span className="text-primary-foreground font-medium">
            {categories.find(c => c.id === activeCategory)?.name[currentLanguage]}
          </span>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-primary-foreground hover:bg-primary-foreground/10 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-4 animate-slide-up">
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;
                
                return (
                  <a
                    key={category.id}
                    href={category.href}
                    onClick={(e) => {
                      e.preventDefault();
                      onCategoryChange?.(category.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-agri-lime/20 text-agri-lime' 
                        : 'text-primary-foreground/90 hover:bg-primary-foreground/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{category.name[currentLanguage]}</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default CategoryNav;
