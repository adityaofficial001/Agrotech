import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const [activeCategory, setActiveCategory] = useState(externalActiveCategory || 'insecticides');
  const scrollTrackerRef = useRef<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Sync internal state with external prop
  useEffect(() => {
    if (externalActiveCategory) {
      setActiveCategory(externalActiveCategory);
    }
  }, [externalActiveCategory]);

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
    setActiveCategory(category.id);

    // If an external handler is provided, let it handle the navigation logic completely
    // This is used by CategoryPage to switch categories without going home
    if (onCategoryChange && location.pathname !== '/' && location.pathname !== '/index.html') {
      onCategoryChange(category.id);
      return;
    }

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
    <nav className="agri-gradient-header sticky top-[108px] md:top-[104px] z-50 shadow-md">
      <div className="container mx-auto px-4">
        {/* Responsive Horizontal Scrollable Navigation */}
        <div className="flex items-center overflow-x-auto no-scrollbar scroll-smooth w-full">
          <div className="flex items-center justify-start min-w-max mx-auto gap-1 lg:gap-2 py-2">
            {NAV_CATEGORIES.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className={`flex items-center gap-2 px-3 py-3 lg:px-4 lg:py-3.5 text-sm font-medium transition-all duration-300 relative group ${isActive
                    ? 'text-agri-lime font-bold'
                    : 'text-primary-foreground/90 hover:text-white hover:bg-white/10 rounded-lg lg:rounded-none'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="whitespace-nowrap">{category.name[currentLanguage]}</span>

                  {/* Active Indicator Underline */}
                  <div className={`hidden lg:block absolute bottom-0 left-0 right-0 h-0.5 bg-agri-lime transition-all duration-300 transform ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'
                    }`} />
                    
                  {/* Mobile Active Indicator Background */}
                  {isActive && <div className="lg:hidden absolute inset-0 bg-white/10 rounded-lg -z-10" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CategoryNav;
