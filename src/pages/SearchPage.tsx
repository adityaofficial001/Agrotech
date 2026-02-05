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

    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
    const [selectedStages, setSelectedStages] = useState<string[]>([]);
    const [selectedPackSizes, setSelectedPackSizes] = useState<string[]>([]);
    const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
    const [onlyInStock, setOnlyInStock] = useState(false);

    const translations = {
        en: {
            title: `Search Results for "${query}"`,
            noResults: "No products found",
            noResultsDesc: "Try checking your spelling or use different keywords.",
            filterBtn: "Filters",
            backToHome: "Back to Home",
            clearFilters: "Clear Filters"
        },
        hi: {
            title: `"${query}" के लिए परिणाम`,
            noResults: "कोई उत्पाद नहीं मिला",
            noResultsDesc: "अपनी वर्तनी की जाँच करें या अलग कीवर्ड का उपयोग करें।",
            filterBtn: "फिल्टर",
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

            // Type Filter
            if (selectedTypes.length > 0) {
                const productTypes = product.type || [];
                if (!selectedTypes.some(t => productTypes.includes(t))) return false;
            }

            // Method Filter
            if (selectedMethods.length > 0) {
                const productMethods = product.applicationMethod || [];
                if (!selectedMethods.some(m => productMethods.includes(m))) return false;
            }

            // Stage Filter
            if (selectedStages.length > 0) {
                const productStages = product.growthStage || [];
                if (!selectedStages.some(s => productStages.includes(s))) return false;
            }

            // Pack Size Filter
            if (selectedPackSizes.length > 0) {
                if (!product.packSize || !selectedPackSizes.includes(product.packSize)) return false;
            }

            // Rating Filter
            if (selectedRatings.length > 0) {
                const rating = product.rating || 0;
                // Assuming selectedRatings contains minimum star ratings (e.g., [4] means 4 stars & up)
                // or exact matches. Let's assume exact match or >= for now. 
                // Usually sidebar ratings are "4 stars & up". Let's stick to exact logic if it's checkboxes
                // If the UI is checkboxes for 4, 3, 2, 1, usually it implies OR logic for exact buckets 
                // OR "at least". Let's assume standard checkbox OR logic for exact buckets if that's what the UI does.
                // Checking FilterSidebar: implies just checkboxes.
                // However, Product.rating is optional number.
                if (!selectedRatings.some(r => Math.floor(rating) === r)) return false;
            }

            // Price Filter
            if (product.priceMin > priceRange[1] || product.priceMax < priceRange[0]) return false;

            // Stock Filter
            if (onlyInStock && !product.inStock) return false;

            return true;
        });
    }, [searchResults, selectedBrands, selectedCrops, selectedTypes, selectedMethods, selectedStages, selectedPackSizes, selectedRatings, priceRange, onlyInStock]);

    // Derived Filter Data (Facets)
    const { availableBrands, availableCrops, availableTypes, availableMethods, availableStages, availablePackSizes, minPrice, maxPrice } = useMemo(() => {
        if (searchResults.length === 0) return {
            availableBrands: [], availableCrops: [], availableTypes: [], availableMethods: [],
            availableStages: [], availablePackSizes: [], minPrice: 0, maxPrice: 10000
        };

        const brands = Array.from(new Set(searchResults.map(p => p.brand))).sort();

        const cropsSet = new Set<string>();
        searchResults.forEach(p => p.crops?.forEach(c => cropsSet.add(c)));
        const crops = Array.from(cropsSet).sort();

        const typesSet = new Set<string>();
        searchResults.forEach(p => p.type?.forEach(t => typesSet.add(t)));
        const types = Array.from(typesSet).sort();

        const methodsSet = new Set<string>();
        searchResults.forEach(p => p.applicationMethod?.forEach(m => methodsSet.add(m)));
        const methods = Array.from(methodsSet).sort();

        const stagesSet = new Set<string>();
        searchResults.forEach(p => p.growthStage?.forEach(s => stagesSet.add(s)));
        const stages = Array.from(stagesSet).sort();

        const packSizesSet = new Set<string>();
        searchResults.forEach(p => { if (p.packSize) packSizesSet.add(p.packSize) });
        const packSizes = Array.from(packSizesSet).sort();


        const prices = searchResults.flatMap(p => [p.priceMin, p.priceMax]);
        const min = Math.min(...prices);
        const max = Math.max(...prices);

        return {
            availableBrands: brands,
            availableCrops: crops,
            availableTypes: types,
            availableMethods: methods,
            availableStages: stages,
            availablePackSizes: packSizes,
            minPrice: Math.floor(min / 100) * 100,
            maxPrice: Math.ceil(max / 100) * 100,
        };
    }, [searchResults]);

    // Reset filters when query changes
    useEffect(() => {
        setSelectedBrands([]);
        setSelectedCrops([]);
        setSelectedTypes([]);
        setSelectedMethods([]);
        setSelectedStages([]);
        setSelectedPackSizes([]);
        setSelectedRatings([]);
        setOnlyInStock(false);
    }, [query]);

    useEffect(() => {
        if (minPrice !== undefined && maxPrice !== undefined) {
            setPriceRange([minPrice, maxPrice]);
        }
    }, [minPrice, maxPrice]);




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
                        productTypes={availableTypes}
                        applicationMethods={availableMethods}
                        growthStages={availableStages}
                        packSizes={availablePackSizes}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        selectedBrands={selectedBrands}
                        onBrandChange={(b) => setSelectedBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b])}
                        selectedCrops={selectedCrops}
                        onCropChange={(c) => setSelectedCrops(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])}
                        selectedTypes={selectedTypes}
                        onTypeChange={(t) => setSelectedTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])}
                        selectedMethods={selectedMethods}
                        onMethodChange={(m) => setSelectedMethods(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])}
                        selectedStages={selectedStages}
                        onStageChange={(s) => setSelectedStages(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])}
                        selectedPackSizes={selectedPackSizes}
                        onPackSizeChange={(s) => setSelectedPackSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])}
                        selectedRatings={selectedRatings}
                        onRatingChange={(r) => setSelectedRatings(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r])}
                        priceRange={priceRange}
                        onPriceChange={setPriceRange}
                        onlyInStock={onlyInStock}
                        onStockChange={setOnlyInStock}
                        onClearAll={() => {
                            setSelectedBrands([]);
                            setSelectedCrops([]);
                            setSelectedTypes([]);
                            setSelectedMethods([]);
                            setSelectedStages([]);
                            setSelectedPackSizes([]);
                            setSelectedRatings([]);
                            setPriceRange([minPrice, maxPrice]);
                            setOnlyInStock(false);
                        }}
                    />

                    {/* Results Grid */}
                    <div className="flex-1">
                        {filteredProducts.length > 0 ? (
                            <ProductGrid
                                products={filteredProducts}
                                currentLanguage={currentLanguage === 'EN' ? 'en' : 'hi'}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <SearchX className="h-20 w-20 text-gray-300 mb-4" />
                                <h2 className="text-2xl font-bold text-gray-700 mb-2">{t.noResults}</h2>
                                <p className="text-gray-500 mb-6">{t.noResultsDesc}</p>
                                <Button onClick={() => {
                                    setSelectedBrands([]);
                                    setSelectedCrops([]);
                                    setSelectedTypes([]);
                                    setSelectedMethods([]);
                                    setSelectedStages([]);
                                    setSelectedPackSizes([]);
                                    setSelectedRatings([]);
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
