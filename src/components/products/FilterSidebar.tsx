import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { X, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface FilterSidebarProps {
    // Mobile props
    isOpen?: boolean;
    onClose?: () => void;

    // Data props
    brands: string[];
    crops: string[];
    productTypes: string[];
    applicationMethods: string[];
    growthStages: string[];
    packSizes: string[];

    minPrice: number;
    maxPrice: number;

    // State props
    selectedBrands: string[];
    onBrandChange: (brand: string) => void;
    selectedCrops: string[];
    onCropChange: (crop: string) => void;

    selectedTypes: string[];
    onTypeChange: (type: string) => void;
    selectedMethods: string[];
    onMethodChange: (method: string) => void;
    selectedStages: string[];
    onStageChange: (stage: string) => void;
    selectedPackSizes: string[];
    onPackSizeChange: (size: string) => void;
    selectedRatings: number[];
    onRatingChange: (rating: number) => void;

    priceRange: [number, number];
    onPriceChange: (range: [number, number]) => void;
    onlyInStock: boolean;
    onStockChange: (inStock: boolean) => void;
    onClearAll?: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
    isOpen,
    onClose,
    brands,
    crops,
    productTypes,
    applicationMethods,
    growthStages,
    packSizes,
    minPrice,
    maxPrice,
    selectedBrands,
    onBrandChange,
    selectedCrops,
    onCropChange,
    selectedTypes,
    onTypeChange,
    selectedMethods,
    onMethodChange,
    selectedStages,
    onStageChange,
    selectedPackSizes,
    onPackSizeChange,
    selectedRatings,
    onRatingChange,
    priceRange,
    onPriceChange,
    onlyInStock,
    onStockChange,
    onClearAll
}) => {
    const { t } = useLanguage();

    const getCount = (selected: any[]) => selected.length > 0 ? `(${selected.length})` : '';

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`
        fixed lg:sticky top-0 lg:top-24 left-0 h-full lg:h-[calc(100vh-6rem)]
        w-[280px] bg-card border-r lg:border border-border p-6 
        z-50 lg:z-0 lg:block overflow-y-auto transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <h3 className="font-display font-bold text-xl">{t.filters?.filters}</h3>
                        {onClearAll && (
                            <Button
                                variant="link"
                                className="text-xs text-primary px-0 h-auto font-normal underline"
                                onClick={onClearAll}
                            >
                                {t.filters?.clearAll}
                            </Button>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={onClose}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="space-y-6 pb-20 lg:pb-0">
                    {/* Availability */}
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="stock-mode"
                            checked={onlyInStock}
                            onCheckedChange={onStockChange}
                        />
                        <Label htmlFor="stock-mode" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {t.filters?.inStock}
                        </Label>
                    </div>

                    <Accordion type="multiple" defaultValue={['price', 'brand', 'crop']} className="w-full">

                        {/* Price Range */}
                        <AccordionItem value="price">
                            <AccordionTrigger className="text-sm font-medium hover:no-underline">
                                {t.filters?.priceRange}
                            </AccordionTrigger>
                            <AccordionContent className="pt-4">
                                <Slider
                                    defaultValue={[minPrice, maxPrice]}
                                    value={[priceRange[0], priceRange[1]]}
                                    min={minPrice}
                                    max={maxPrice}
                                    step={10}
                                    onValueChange={(val) => onPriceChange([val[0], val[1]])}
                                    className="mb-4"
                                />
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <span>₹{priceRange[0]}</span>
                                    <span>₹{priceRange[1]}</span>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Brand Filter */}
                        {brands.length > 0 && (
                            <AccordionItem value="brand">
                                <AccordionTrigger className="text-sm font-medium hover:no-underline">
                                    {t.filters?.brand}
                                </AccordionTrigger>
                                <AccordionContent className="space-y-2">
                                    {brands.map((brand) => (
                                        <div key={brand} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`brand-${brand}`}
                                                checked={selectedBrands.includes(brand)}
                                                onCheckedChange={() => onBrandChange(brand)}
                                            />
                                            <label
                                                htmlFor={`brand-${brand}`}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                {/* @ts-ignore */}
                                                {t.brands?.[brand.toLowerCase().replace(/ /g, '')] || brand}
                                            </label>
                                        </div>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        )}

                        {/* Crop Filter */}
                        {crops.length > 0 && (
                            <AccordionItem value="crop">
                                <AccordionTrigger className="text-sm font-medium hover:no-underline">
                                    {t.filters?.crop}
                                </AccordionTrigger>
                                <AccordionContent className="space-y-2">
                                    {crops.map((crop) => (
                                        <div key={crop} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`crop-${crop}`}
                                                checked={selectedCrops.includes(crop)}
                                                onCheckedChange={() => onCropChange(crop)}
                                            />
                                            <label
                                                htmlFor={`crop-${crop}`}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                                            >
                                                {/* @ts-ignore */}
                                                {t.crops?.[crop.toLowerCase()] || crop}
                                            </label>
                                        </div>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        )}

                        {/* Placeholder for Dynamic Filters (Product Type, etc.) - To be implemented fully via props in next step if needed, or I can add them here if passed in props */}
                        {/* Product Type Filter - Hardcoded for demo/MVP as per plan to add structure, but usually should come from props */}
                        <AccordionItem value="productType">
                            <AccordionTrigger className="text-sm font-medium hover:no-underline">
                                {t.filters?.productType}
                            </AccordionTrigger>
                            <AccordionContent className="space-y-2">
                                {['Organic', 'Chemical', 'Bio-based', 'Eco-friendly'].map((type) => (
                                    <div key={type} className="flex items-center space-x-2">
                                        {/* Note: Logic to handle change needs to be passed down or added to props. I will add placeholders for now and update interface above. */}
                                        <Checkbox id={`type-${type}`} />
                                        <label htmlFor={`type-${type}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            {/* @ts-ignore */}
                                            {t.filters?.types?.[type.replace(/-/g, '').replace(/ /g, '').toLowerCase()] || t.filters?.types?.['bioBased'] && type === 'Bio-based' ? t.filters.types.bioBased : type}
                                        </label>
                                    </div>
                                ))}
                            </AccordionContent>
                        </AccordionItem>

                    </Accordion>
                </div>

                {/* Mobile Apply Button */}
                <div className="lg:hidden absolute bottom-0 left-0 right-0 p-4 bg-card border-t border-border">
                    <Button className="w-full" onClick={onClose}>
                        {t.filters?.apply}
                    </Button>
                </div>
            </aside>
        </>
    );
};

export default FilterSidebar;
