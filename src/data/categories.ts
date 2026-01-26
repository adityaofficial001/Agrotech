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
    Gift
} from 'lucide-react';
import React from 'react';

export interface ProductVariant {
    id: string;
    size: string;
    sizeHi?: string;
    price: number;
    originalPrice?: number;
    inStock: boolean;
}

export interface Review {
    id: string;
    user: string;
    rating: number; // 1-5
    comment: string;
    date: string;
    image?: string;
}

export interface Product {
    id: string;
    name: string;
    nameHi?: string; // Hindi Name
    brand: string;
    price: number;
    originalPrice?: number;
    quantity: string;
    quantityHi?: string; // Hindi Quantity
    image: string;
    category?: string;
    inStock: boolean;
    // Extended fields for compatibility
    priceMin?: number;
    priceMax?: number;
    crops?: string[];
    pests?: string[];
    // New Filter Fields
    type?: string[]; // e.g. Organic, Bio-based
    applicationMethod?: string[]; // e.g. Foliar Spray, Soil Application
    growthStage?: string[]; // e.g. Vegetative, Flowering
    packSize?: string; // e.g. 250 ml, 1 L
    rating?: number; // 1-5

    // Advanced Product Details
    variants?: ProductVariant[];
    reviews?: Review[];
    description?: string;
    descriptionHi?: string;
    benefits?: string[];
    usageInstructions?: string[];
}

export const CATEGORIES = [
    "Insecticides",
    "Seeds & Saplings",
    "Implements",
    "Herbicides",
    "Fertilizers",
    "Plant Growth Promoters",
    "Bioproducts",
    "Allied Products",
    "Crop Science"
];

export interface NavCategory {
    id: string;
    name: {
        en: string;
        hi: string;
    };
    icon: any; // Using any for simplicity in data file, Lucide type in component
}

export const NAV_CATEGORIES: NavCategory[] = [
    { id: 'insecticides', name: { en: 'Insecticides', hi: 'कीटनाशक' }, icon: Bug },
    { id: 'seeds', name: { en: 'Seeds & Saplings', hi: 'बीज और पौधे' }, icon: Sprout },
    { id: 'implements', name: { en: 'Implements', hi: 'उपकरण' }, icon: Wrench },
    { id: 'herbicides', name: { en: 'Herbicides', hi: 'खरपतवारनाशी' }, icon: Leaf },
    { id: 'fertilizers', name: { en: 'Fertilizers', hi: 'उर्वरक' }, icon: Droplets },
    { id: 'growth', name: { en: 'Plant Growth Promoters', hi: 'पौधा विकास प्रवर्तक' }, icon: TrendingUp },
    { id: 'bioproducts', name: { en: 'Bioproducts', hi: 'जैव उत्पाद' }, icon: Microscope },
    { id: 'allied', name: { en: 'Allied Products', hi: 'संबद्ध उत्पाद' }, icon: ShoppingBag },
    { id: 'cropscience', name: { en: 'Crop Science', hi: 'फसल विज्ञान' }, icon: BookOpen },
    { id: 'offers', name: { en: 'Special Offers', hi: 'विशेष ऑफर' }, icon: Gift },
];

const generateProducts = () => {
    const products: Product[] = [];
    let idCounter = 1;

    // Insecticides
    products.push(
        { id: String(idCounter++), name: "Coragen Insecticide", nameHi: "कोराजेन कीटनाशक", brand: "AgroCare", price: 450, originalPrice: 500, quantity: "60ml", quantityHi: "60 मिली", image: "/placeholder.svg", category: "Insecticides", inStock: true },
        { id: String(idCounter++), name: "Ampligo Chlorantraniliprole", nameHi: "एम्प्लिगो क्लोरेंट्रानिलिप्रोल", brand: "Syngenta", price: 780, originalPrice: 900, quantity: "80ml", quantityHi: "80 मिली", image: "/placeholder.svg", category: "Insecticides", inStock: true },
        { id: String(idCounter++), name: "Virtako Insecticide", nameHi: "विर्टाको कीटनाशक", brand: "Syngenta", price: 1200, quantity: "1kg", quantityHi: "1 किग्रा", image: "/placeholder.svg", category: "Insecticides", inStock: true },
        { id: String(idCounter++), name: "Benevia Insecticide", nameHi: "बेनेविया कीटनाशक", brand: "FMC", price: 1500, quantity: "180ml", quantityHi: "180 मिली", image: "/placeholder.svg", category: "Insecticides", inStock: false }
    );

    // Seeds & Saplings
    products.push(
        { id: String(idCounter++), name: "Hybrid Tomato Seeds", nameHi: "हाइब्रिड टमाटर बीज", brand: "Seminis", price: 850, originalPrice: 1000, quantity: "10g", quantityHi: "10 ग्राम", image: "/placeholder.svg", category: "Seeds & Saplings", inStock: true },
        { id: String(idCounter++), name: "Okra Seeds (Bhindi)", nameHi: "भिंडी बीज", brand: "Advanta", price: 400, quantity: "100g", quantityHi: "100 ग्राम", image: "/placeholder.svg", category: "Seeds & Saplings", inStock: true },
        { id: String(idCounter++), name: "Chilli Seeds Hot Pepper", nameHi: "मिर्ची बीज", brand: "Nunhems", price: 650, quantity: "10g", quantityHi: "10 ग्राम", image: "/placeholder.svg", category: "Seeds & Saplings", inStock: true },
        { id: String(idCounter++), name: "Cotton Logic Seeds", nameHi: "कपास बीज", brand: "Rasi", price: 1200, quantity: "450g", quantityHi: "450 ग्राम", image: "/placeholder.svg", category: "Seeds & Saplings", inStock: true }
    );

    // Implements
    products.push(
        { id: String(idCounter++), name: "Knapsack Hand Sprayer", nameHi: "नैपसैक हैंड स्प्रेयर", brand: "AgroTools", price: 1200, quantity: "16L", quantityHi: "16 लीटर", image: "/placeholder.svg", category: "Implements", inStock: true },
        { id: String(idCounter++), name: "Garden Hedge Shear", nameHi: "गार्डन कटर", brand: "Falcon", price: 450, quantity: "1 Unit", quantityHi: "1 इकाई", image: "/placeholder.svg", category: "Implements", inStock: true },
        { id: String(idCounter++), name: "Sickle with Wooden Handle", nameHi: "लकड़ी के हैंडल वाली दरांती", brand: "Local", price: 150, quantity: "1 Unit", quantityHi: "1 इकाई", image: "/placeholder.svg", category: "Implements", inStock: true },
        { id: String(idCounter++), name: "Brush Cutter", nameHi: "ब्रश कटर", brand: "Honda", price: 18000, quantity: "1 Unit", quantityHi: "1 इकाई", image: "/placeholder.svg", category: "Implements", inStock: false }
    );

    // Herbicides
    products.push(
        { id: String(idCounter++), name: "Roundup Glyphosate", nameHi: "राउंडअप ग्लाइफोसेट", brand: "Bayer", price: 350, quantity: "1L", quantityHi: "1 लीटर", image: "/placeholder.svg", category: "Herbicides", inStock: true },
        { id: String(idCounter++), name: "Sencor Herbicide", nameHi: "सेंकोर शाकनाशी", brand: "Bayer", price: 550, quantity: "100g", quantityHi: "100 ग्राम", image: "/placeholder.svg", category: "Herbicides", inStock: true },
        { id: String(idCounter++), name: "Goal Oxyfluorfen", nameHi: "गोल ऑक्सीफ्लोरफेन", brand: "Indofil", price: 400, quantity: "250ml", quantityHi: "250 मिली", image: "/placeholder.svg", category: "Herbicides", inStock: true },
        { id: String(idCounter++), name: "Targa Super", nameHi: "टार्गा सुपर", brand: "Dhanuka", price: 600, quantity: "500ml", quantityHi: "500 मिली", image: "/placeholder.svg", category: "Herbicides", inStock: true }
    );

    // Fertilizers
    products.push(
        { id: String(idCounter++), name: "Neem Coated Urea", nameHi: "नीम लेपित यूरिया", brand: "IFFCO", price: 300, quantity: "45kg", quantityHi: "45 किग्रा", image: "/placeholder.svg", category: "Fertilizers", inStock: true },
        { id: String(idCounter++), name: "DAP Fertilizer", nameHi: "डीएपी उर्वरक", brand: "IPL", price: 1350, quantity: "50kg", quantityHi: "50 किग्रा", image: "/placeholder.svg", category: "Fertilizers", inStock: true },
        { id: String(idCounter++), name: "19-19-19 NPK Solution", nameHi: "19-19-19 एनपीके", brand: "Mahadhan", price: 120, quantity: "1kg", quantityHi: "1 किग्रा", image: "/placeholder.svg", category: "Fertilizers", inStock: true },
        { id: String(idCounter++), name: "Muriate of Potash", nameHi: "म्यूरेट ऑफ पोटाश", brand: "IPL", price: 900, quantity: "50kg", quantityHi: "50 किग्रा", image: "/placeholder.svg", category: "Fertilizers", inStock: true }
    );

    // Plant Growth Promoters
    products.push(
        { id: String(idCounter++), name: "Isabion Growth Promoter", nameHi: "इसाबियन ग्रोथ प्रमोटर", brand: "Syngenta", price: 550, quantity: "500ml", quantityHi: "500 मिली", image: "/placeholder.svg", category: "Plant Growth Promoters", inStock: true },
        { id: String(idCounter++), name: "Planofix Alpha Naphthyl", nameHi: "प्लानोफिक्स", brand: "Bayer", price: 120, quantity: "100ml", quantityHi: "100 मिली", image: "/placeholder.svg", category: "Plant Growth Promoters", inStock: true },
        { id: String(idCounter++), name: "Lihocin Growth Retardant", nameHi: "लिहोसिन", brand: "BASF", price: 350, quantity: "500ml", quantityHi: "500 मिली", image: "/placeholder.svg", category: "Plant Growth Promoters", inStock: true },
        { id: String(idCounter++), name: "Quantis Biostimulant", nameHi: "क्वांटिस बायोस्टिमुलेंट", brand: "Syngenta", price: 700, quantity: "1L", quantityHi: "1 लीटर", image: "/placeholder.svg", category: "Plant Growth Promoters", inStock: true },
        { id: String(idCounter++), name: "Green Leaf Elite", nameHi: "ग्रीन लीफ एलीट", brand: "AgroMax", price: 380, quantity: "1L", quantityHi: "1 लीटर", image: "/placeholder.svg", category: "Plant Growth Promoters", inStock: true },
        { id: String(idCounter++), name: "Yield Master", nameHi: "यील्ड मास्टर", brand: "AgroMax", price: 650, quantity: "500ml", quantityHi: "500 मिली", image: "/placeholder.svg", category: "Plant Growth Promoters", inStock: true }
    );

    // Bioproducts
    products.push(
        { id: String(idCounter++), name: "Neem Oil 10000ppm", nameHi: "नीम तेल 10000ppm", brand: "Multiplex", price: 250, quantity: "1L", quantityHi: "1 लीटर", image: "/placeholder.svg", category: "Bioproducts", inStock: true },
        { id: String(idCounter++), name: "Trichoderma Viride", nameHi: "ट्राइकोडर्मा विरिडे", brand: "T-Stanes", price: 180, quantity: "1kg", quantityHi: "1 किग्रा", image: "/placeholder.svg", category: "Bioproducts", inStock: true },
        { id: String(idCounter++), name: "Pheromone Traps", nameHi: "फेरोमोन ट्रैप", brand: "Barrix", price: 300, quantity: "5 Pack", quantityHi: "5 पैक", image: "/placeholder.svg", category: "Bioproducts", inStock: true },
        { id: String(idCounter++), name: "VAM Biofertilizer", nameHi: "VAM बायोफर्टिलाइजर", brand: "IPL", price: 200, quantity: "1kg", quantityHi: "1 किग्रा", image: "/placeholder.svg", category: "Bioproducts", inStock: true },
        { id: String(idCounter++), name: "Earthworm Extract", nameHi: "केंचुआ अर्क", brand: "BioLife", price: 450, quantity: "5L", quantityHi: "5 लीटर", image: "/placeholder.svg", category: "Bioproducts", inStock: true },
        { id: String(idCounter++), name: "Bio-NPK Granules", nameHi: "बायो-एनपीके दाने", brand: "BioLife", price: 1200, quantity: "25kg", quantityHi: "25 किग्रा", image: "/placeholder.svg", category: "Bioproducts", inStock: true }
    );

    // Allied Products
    products.push(
        { id: String(idCounter++), name: "Tarpaulin 120 GSM", nameHi: "तिरपाल 120 जीएसएम", brand: "Silpaulin", price: 1500, quantity: "12x12", quantityHi: "12x12", image: "/placeholder.svg", category: "Allied Products", inStock: true },
        { id: String(idCounter++), name: "Mulching Sheet Silver", nameHi: "मल्चिंग शीट सिल्वर", brand: "GrowIt", price: 2200, quantity: "400m", quantityHi: "400 मीटर", image: "/placeholder.svg", category: "Allied Products", inStock: true },
        { id: String(idCounter++), name: "Coco Peat Block", nameHi: "कोको पीट ब्लॉक", brand: "CoirFit", price: 220, quantity: "5kg", quantityHi: "5 किग्रा", image: "/placeholder.svg", category: "Allied Products", inStock: true },
        { id: String(idCounter++), name: "Seedling Tray", nameHi: "सीडलिंग ट्रे", brand: "AgroPlast", price: 35, quantity: "98 Cavity", quantityHi: "98 कैविटी", image: "/placeholder.svg", category: "Allied Products", inStock: true },
        { id: String(idCounter++), name: "UV Shading Net", nameHi: "यूवी शेडिंग नेट", brand: "AgroPlast", price: 2500, quantity: "50m", quantityHi: "50 मीटर", image: "/placeholder.svg", category: "Allied Products", inStock: true },
        { id: String(idCounter++), name: "Drip Pipe 16mm", nameHi: "ड्रिप पाइप 16 मिमी", brand: "AgroPlast", price: 1800, quantity: "100m", quantityHi: "100 मीटर", image: "/placeholder.svg", category: "Allied Products", inStock: true }
    );

    // Crop Science
    products.push(
        { id: String(idCounter++), name: "Sticky Trap Blue", nameHi: "ब्लू स्टिकी ट्रैप", brand: "Tap", price: 150, quantity: "10 Sheets", quantityHi: "10 शीट्स", image: "/placeholder.svg", category: "Crop Science", inStock: true },
        { id: String(idCounter++), name: "Sticky Trap Yellow", nameHi: "येलो स्टिकी ट्रैप", brand: "Tap", price: 150, quantity: "10 Sheets", quantityHi: "10 शीट्स", image: "/placeholder.svg", category: "Crop Science", inStock: true },
        { id: String(idCounter++), name: "Soil pH Testing Kit", nameHi: "मिट्टी पीएच किट", brand: "AgroLab", price: 450, quantity: "1 Kit", quantityHi: "1 किट", image: "/placeholder.svg", category: "Crop Science", inStock: true },
        { id: String(idCounter++), name: "Digital Moisture Meter", nameHi: "डिजिटल नमी मीटर", brand: "AgriLab", price: 1500, quantity: "1 Unit", quantityHi: "1 इकाई", image: "/placeholder.svg", category: "Crop Science", inStock: true },
        { id: String(idCounter++), name: "Pocket Microscope", nameHi: "पॉकेट माइक्रोस्कोप", brand: "LabTech", price: 850, quantity: "1 Unit", quantityHi: "1 इकाई", image: "/placeholder.svg", category: "Crop Science", inStock: true },
        { id: String(idCounter++), name: "NPK Test Strips", nameHi: "एनपीके टेस्ट स्ट्रिप्स", brand: "AgriLab", price: 450, quantity: "50 Pack", quantityHi: "50 पैक", image: "/placeholder.svg", category: "Crop Science", inStock: true }
    );

    return products;
}

export const MOCK_PRODUCTS: Product[] = generateProducts();
