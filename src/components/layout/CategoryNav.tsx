import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { NAV_CATEGORIES, NavCategory } from '@/data/categories';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface CategoryNavProps {
  currentLanguage?: 'en' | 'hi';
  activeCategory?: string;
  onCategoryChange?: (categoryId: string) => void;
}

const CategoryNav: React.FC<CategoryNavProps> = ({
  currentLanguage: propsCurrentLanguage,
  activeCategory: externalActiveCategory,
  onCategoryChange
}) => {
  const { language } = useLanguage();
  const currentLanguage = propsCurrentLanguage || (language === 'HI' ? 'hi' : 'en');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(externalActiveCategory || 'insecticides');
  const scrollTrackerRef = useRef<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Unified Scroll Spy Logic
  useEffect(() => {
    if (location.pathname !== '/' && location.pathname !== '/index.html') return;

    const observerOptions = {
      root: null,
      rootMargin: '-15% 0px -75% 0px', // Adjust to trigger precisely when header hits
      threshold: 0
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      // If we are currently programmatically scrolling (from a click), don't update from observer
      if (scrollTrackerRef.current) return;

      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveCategory(entry.target.id);
          if (onCategoryChange) onCategoryChange(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    NAV_CATEGORIES.forEach(cat => {
      const el = document.getElementById(cat.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [location.pathname, onCategoryChange]);

  const handleCategoryClick = (category: NavCategory) => {
    setIsMobileMenuOpen(false);
    setActiveCategory(category.id);

    // Smooth scroll if on index page
    if (location.pathname === '/' || location.pathname === '/index.html') {
      const element = document.getElementById(category.id);
      if (element) {
        // Temporarily disable scroll spy during manual scroll
        scrollTrackerRef.current = true;
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Re-enable scroll spy after scroll animation finishes (~800ms)
        setTimeout(() => {
          scrollTrackerRef.current = false;
        }, 800);

        if (onCategoryChange) onCategoryChange(category.id);
        return;
      }
    }

    // Otherwise navigate to home with hash
    navigate(`/#${category.id}`);
  };

  return (
    <nav className="agri-gradient-header sticky top-0 z-40">
      <div className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-center">
          {NAV_CATEGORIES.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium transition-all duration-300 relative group ${isActive
                  ? 'text-agri-lime'
                  : 'text-primary-foreground/80 hover:text-white hover:bg-white/10'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span className="whitespace-nowrap">{category.name[currentLanguage]}</span>

                {/* Active Indicator Underline */}
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-agri-lime transition-all duration-300 transform ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'
                  }`} />
              </button>
            );
          })}
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="lg:hidden flex items-center justify-between py-3">
          <span className="text-primary-foreground font-medium">
            {NAV_CATEGORIES.find(c => c.id === activeCategory)?.name[currentLanguage] || 'Categories'}
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
          <div className="lg:hidden pb-4 animate-slide-up bg-primary/95 mt-[-1px] rounded-b-2xl shadow-xl">
            <div className="grid grid-cols-2 gap-2 p-2">
              {NAV_CATEGORIES.map((category) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;

                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category)}
                    className={`flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                      ? 'bg-agri-lime text-primary font-bold shadow-lg'
                      : 'text-primary-foreground/90 hover:bg-white/10'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{category.name[currentLanguage]}</span>
                  </button>
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
