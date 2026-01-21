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
import { X } from 'lucide-react';

interface FilterSidebarProps {
    // Mobile props
    isOpen?: boolean;
    onClose?: () => void;

    // Data props
    brands: string[];
    crops: string[];
    minPrice: number;
    maxPrice: number;

    // State props
    selectedBrands: string[];
    onBrandChange: (brand: string) => void;
    selectedCrops: string[];
    onCropChange: (crop: string) => void;
    priceRange: [number, number];
    onPriceChange: (range: [number, number]) => void;
    onlyInStock: boolean;
    onStockChange: (inStock: boolean) => void;
    onClearAll?: () => void;

    currentLanguage?: 'en' | 'hi';
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
    isOpen,
    onClose,
    brands,
    crops,
    minPrice,
    maxPrice,
    selectedBrands,
    onBrandChange,
    selectedCrops,
    onCropChange,
    priceRange,
    onPriceChange,
    onlyInStock,
    onStockChange,
    onClearAll,
    currentLanguage = 'en'
}) => {
    const translations = {
        en: {
            filters: "Filters",
            clearAll: "Clear All",
            brand: "Brand",
            priceRange: "Price Range",
            crop: "Crop",
            availability: "Availability",
            inStock: "In Stock Only",
            apply: "Apply Filters"
        },
        hi: {
            filters: "फिल्टर",
            clearAll: "सभी हटाएं",
            brand: "ब्रांड",
            priceRange: "मूल्य सीमा",
            crop: "फसल",
            availability: "उपलब्धता",
            inStock: "केवल उपलब्ध स्टॉक",
            apply: "फिल्टर लागू करें"
        }
    };

    const t = translations[currentLanguage];

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
        fixed lg:sticky top-0 lg:top-24 left-0 h-full lg:h-auto 
        w-[280px] bg-card border-r lg:border border-border p-6 
        z-50 lg:z-0 lg:block overflow-y-auto transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <h3 className="font-display font-bold text-xl">{t.filters}</h3>
                        {onClearAll && (
                            <Button
                                variant="link"
                                className="text-xs text-primary px-0 h-auto font-normal underline"
                                onClick={onClearAll}
                            >
                                {t.clearAll}
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

                <div className="space-y-6">
                    {/* Availability */}
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="stock-mode"
                            checked={onlyInStock}
                            onCheckedChange={onStockChange}
                        />
                        <Label htmlFor="stock-mode" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {t.inStock}
                        </Label>
                    </div>

                    <Accordion type="multiple" defaultValue={['price', 'brand', 'crop']} className="w-full">

                        {/* Price Range */}
                        <AccordionItem value="price">
                            <AccordionTrigger className="text-sm font-medium hover:no-underline">
                                {t.priceRange}
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
                                    {t.brand}
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
                                                {brand}
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
                                    {t.crop}
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
                                                {crop}
                                            </label>
                                        </div>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        )}
                    </Accordion>
                </div>
            </aside>
        </>
    );
};

export default FilterSidebar;
