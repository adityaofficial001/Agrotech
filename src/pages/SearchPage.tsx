import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import TopHeader from '@/components/layout/TopHeader';
import CategoryNav from '@/components/layout/CategoryNav';
import Footer from '@/components/layout/Footer';
import ProductGrid from '@/components/products/ProductGrid';
import FilterSidebar from '@/components/products/FilterSidebar';
import { Product } from '@/data/categories';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, SearchX, ArrowLeft } from 'lucide-react';
import { allProductsArray } from '@/data/products';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const navigate = useNavigate();
    const { language: currentLanguage, setLanguage } = useLanguage();

    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Filter States
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
    const [onlyInStock, setOnlyInStock] = useState(false);

    const translations = {
        en: {
            title: `Search Results for "${query}"`,
            noResults: "No products found",
            noResultsDesc: "Try checking your spelling or use different keywords.",
            filterBtn: "Filters",
            addedToCart: "Added to cart!",
            backToHome: "Back to Home",
            clearFilters: "Clear Filters"
        },
        hi: {
            title: `"${query}" के लिए परिणाम`,
            noResults: "कोई उत्पाद नहीं मिला",
            noResultsDesc: "अपनी वर्तनी की जाँच करें या अलग कीवर्ड का उपयोग करें।",
            filterBtn: "फिल्टर",
            addedToCart: "कार्ट में जोड़ा गया!",
            backToHome: "मुखपृष्ठ पर वापस जाएं",
            clearFilters: "फिल्टर हटाएं"
        }
    };

    const t = translations[currentLanguage === 'EN' ? 'en' : 'hi']; // Fix language casing if needed

    // 1. Initial Search Filtering
    const searchResults = useMemo(() => {
        if (!query) return [];
        const lowerQuery = query.toLowerCase();
        return allProductsArray.filter(p =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.brand.toLowerCase().includes(lowerQuery) ||
            p.category?.toLowerCase().includes(lowerQuery) ||
            p.crops?.some(c => c.toLowerCase().includes(lowerQuery))
        );
    }, [query]);

    // 2. Filter Logic (Sidebar)
    const filteredProducts = useMemo(() => {
        return searchResults.filter(product => {
            // Brand Filter
            if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;

            // Crop Filter
            if (selectedCrops.length > 0) {
                const productCrops = product.crops || [];
                if (!selectedCrops.some(crop => productCrops.includes(crop))) return false;
            }

            // Price Filter
            if (product.priceMin > priceRange[1] || product.priceMax < priceRange[0]) return false;

            // Stock Filter
            if (onlyInStock && !product.inStock) return false;

            return true;
        });
    }, [searchResults, selectedBrands, selectedCrops, priceRange, onlyInStock]);

    // Derived Filter Data (Facets)
    const { availableBrands, availableCrops, minPrice, maxPrice } = useMemo(() => {
        if (searchResults.length === 0) return { availableBrands: [], availableCrops: [], minPrice: 0, maxPrice: 10000 };

        const brands = Array.from(new Set(searchResults.map(p => p.brand))).sort();
        const cropsSet = new Set<string>();
        searchResults.forEach(p => p.crops?.forEach(c => cropsSet.add(c)));
        const crops = Array.from(cropsSet).sort();

        const prices = searchResults.flatMap(p => [p.priceMin, p.priceMax]);
        const min = Math.min(...prices);
        const max = Math.max(...prices);

        return {
            availableBrands: brands,
            availableCrops: crops,
            minPrice: Math.floor(min / 100) * 100,
            maxPrice: Math.ceil(max / 100) * 100,
        };
    }, [searchResults]);

    // Reset filters when query changes
    useEffect(() => {
        setSelectedBrands([]);
        setSelectedCrops([]);
        setOnlyInStock(false);
    }, [query]);

    useEffect(() => {
        if (minPrice !== undefined && maxPrice !== undefined) {
            setPriceRange([minPrice, maxPrice]);
        }
    }, [minPrice, maxPrice]);


    const handleAddToCart = (product: Product) => {
        toast({
            title: t.addedToCart,
            description: product.name,
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <TopHeader />
            <CategoryNav activeCategory="" />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl font-bold">{t.title}</h1>
                    <span className="text-muted-foreground">({filteredProducts.length} results)</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Mobile Filter Toggle */}
                    <div className="lg:hidden mb-4">
                        <Button variant="outline" className="w-full gap-2" onClick={() => setIsMobileFilterOpen(true)}>
                            <SlidersHorizontal className="h-4 w-4" /> {t.filterBtn}
                        </Button>
                    </div>

                    {/* Sidebar */}
                    <FilterSidebar
                        isOpen={isMobileFilterOpen}
                        onClose={() => setIsMobileFilterOpen(false)}
                        brands={availableBrands}
                        crops={availableCrops}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        selectedBrands={selectedBrands}
                        onBrandChange={(b) => setSelectedBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b])}
                        selectedCrops={selectedCrops}
                        onCropChange={(c) => setSelectedCrops(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])}
                        priceRange={priceRange}
                        onPriceChange={setPriceRange}
                        onlyInStock={onlyInStock}
                        onStockChange={setOnlyInStock}
                        onClearAll={() => {
                            setSelectedBrands([]);
                            setSelectedCrops([]);
                            setPriceRange([minPrice, maxPrice]);
                            setOnlyInStock(false);
                        }}
                        currentLanguage={currentLanguage === 'EN' ? 'en' : 'hi'}
                    />

                    {/* Results Grid */}
                    <div className="flex-1">
                        {filteredProducts.length > 0 ? (
                            <ProductGrid
                                products={filteredProducts}
                                currentLanguage={currentLanguage === 'EN' ? 'en' : 'hi'}
                                onAddToCart={handleAddToCart}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <SearchX className="h-20 w-20 text-gray-300 mb-4" />
                                <h2 className="text-2xl font-bold text-gray-700 mb-2">{t.noResults}</h2>
                                <p className="text-gray-500 mb-6">{t.noResultsDesc}</p>
                                <Button onClick={() => {
                                    setSelectedBrands([]);
                                    setSelectedCrops([]);
                                    setOnlyInStock(false);
                                    setPriceRange([minPrice, maxPrice]);
                                }}>
                                    {t.clearFilters}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default SearchPage;
