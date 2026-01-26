import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Tractor, Package } from 'lucide-react';
import { getAllProducts } from '@/data/products';
import { Product } from '@/components/products/ProductCard';

interface SearchDropdownProps {
  currentLanguage?: 'en' | 'hi';
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({ currentLanguage = 'en' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const translations = {
    en: {
      search: "What are you looking for?",
      noResults: "No products found",
      viewAll: "View all results",
      categories: {
        insecticides: "Insecticides",
        seeds: "Seeds",
        fertilizers: "Fertilizers",
        herbicides: "Herbicides",
      }
    },
    hi: {
      search: "आप क्या खोज रहे हैं?",
      noResults: "कोई उत्पाद नहीं मिला",
      viewAll: "सभी परिणाम देखें",
      categories: {
        insecticides: "कीटनाशक",
        seeds: "बीज",
        fertilizers: "उर्वरक",
        herbicides: "शाकनाशी",
      }
    }
  };

  const t = translations[currentLanguage];

  const allProducts = useMemo(() => {
    const productsByCategory = getAllProducts();
    return [
      ...productsByCategory.insecticides,
      ...productsByCategory.seeds,
      ...productsByCategory.fertilizers,
      ...productsByCategory.herbicides,
    ];
  }, []);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase().trim();
    
    return allProducts.filter(product => {
      const nameMatch = product.name.toLowerCase().includes(query);
      const brandMatch = product.brand.toLowerCase().includes(query);
      const categoryMatch = getCategoryFromId(product.id).toLowerCase().includes(query);
      const cropMatch = product.crops?.some(crop => crop.toLowerCase().includes(query));
      const pestMatch = product.pests?.some(pest => pest.toLowerCase().includes(query));
      
      return nameMatch || brandMatch || categoryMatch || cropMatch || pestMatch;
    }).slice(0, 6); // Limit to 6 results
  }, [searchQuery, allProducts]);

  const getCategoryFromId = (id: string): string => {
    if (id.startsWith('ins-')) return 'insecticides';
    if (id.startsWith('seed-')) return 'seeds';
    if (id.startsWith('fert-')) return 'fertilizers';
    if (id.startsWith('herb-')) return 'herbicides';
    return '';
  };

  const getCategoryLabel = (id: string): string => {
    const category = getCategoryFromId(id);
    return t.categories[category as keyof typeof t.categories] || category;
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Open dropdown when typing
  useEffect(() => {
    if (searchQuery.trim() && isFocused) {
      setIsOpen(true);
    } else if (!searchQuery.trim()) {
      setIsOpen(false);
    }
  }, [searchQuery, isFocused]);

  const handleProductClick = (productId: string) => {
    setIsOpen(false);
    setSearchQuery('');
    navigate(`/product/${productId}`);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className="relative flex-1 max-w-xl order-last md:order-none w-full md:w-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={t.search}
          className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-agri-lg z-50 overflow-hidden animate-fade-in">
          {filteredProducts.length > 0 ? (
            <div className="max-h-[400px] overflow-y-auto">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onMouseDown={(e) => e.preventDefault()} // Prevent blur before click
                  onClick={() => handleProductClick(product.id)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors text-left border-b border-border last:border-b-0"
                >
                  {/* Product Image */}
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Tractor className="w-3 h-3 text-primary shrink-0" />
                      <span className="text-xs text-muted-foreground">{product.brand}</span>
                      <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded-full">
                        {getCategoryLabel(product.id)}
                      </span>
                    </div>
                    <p className="font-medium text-sm text-foreground truncate mt-0.5">
                      {product.name}
                    </p>
                    <p className="text-sm text-primary font-semibold mt-0.5">
                      ₹{product.priceMin.toLocaleString()}
                      {product.priceMax > product.priceMin && ` – ₹${product.priceMax.toLocaleString()}`}
                    </p>
                  </div>

                  {/* Stock Status */}
                  {!product.inStock && (
                    <span className="text-xs px-2 py-1 bg-destructive/10 text-destructive rounded-full shrink-0">
                      Out of Stock
                    </span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <Search className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">{t.noResults}</p>
              <p className="text-sm text-muted-foreground mt-1">
                "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
