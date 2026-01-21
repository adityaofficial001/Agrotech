import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { Product } from '@/data/categories';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProductSliderProps {
  products: Product[];
  title: string;
  categoryId?: string;
}

const ProductSlider: React.FC<ProductSliderProps> = ({
  products,
  title,
  categoryId,
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const element = scrollRef.current;
    if (element) {
      element.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
      return () => {
        element.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, [products]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-8 bg-primary rounded-full shrink-0" />
          <h2 className="text-xl md:text-2xl font-display font-bold text-foreground whitespace-nowrap">{title}</h2>
        </div>

        {/* Desktop Navigation Arrows */}
        <div className="flex items-center gap-3">
          {categoryId && (
            <Link to={`/category/${categoryId}`} className="hidden sm:block">
              <Button
                variant="outline"
                size="sm"
                className="rounded-md text-[10px] uppercase tracking-wider h-10 px-4 font-bold border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
              >
                {t.products.showMore}
              </Button>
            </Link>
          )}

          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center transition-all duration-200 ${canScrollLeft
                ? 'text-primary hover:bg-primary hover:text-primary-foreground'
                : 'text-muted-foreground border-muted cursor-not-allowed'
                }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center transition-all duration-200 ${canScrollRight
                ? 'text-primary hover:bg-primary hover:text-primary-foreground'
                : 'text-muted-foreground border-muted cursor-not-allowed'
                }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile "Show More" - Visible only on small screens */}
          {categoryId && (
            <Link to={`/category/${categoryId}`} className="sm:hidden">
              <Button
                variant="outline"
                size="sm"
                className="rounded-md text-[9px] uppercase tracking-tighter h-8 px-2 font-black border-primary text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
              >
                {t.products.showMore}
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Products Grid/Slider */}
      <div className="relative">
        {/* Mobile Scroll Hint Gradient */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none sm:hidden" />
        )}

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x snap-mandatory"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="min-w-[280px] snap-start h-full"
            >
              <ProductCard
                product={product}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSlider;
