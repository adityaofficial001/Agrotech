
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface WhatsAppFloatProps {
    productName?: string;
    advisoryContext?: string; // e.g. "Rice - Yellowing"
}

const WhatsAppFloat: React.FC<WhatsAppFloatProps> = ({ productName, advisoryContext }) => {
    const { language } = useLanguage();

    const phoneNumber = "919876543210"; // Replace with actual number

    let message = language === 'HI'
        ? "नमस्ते, मुझे कृषि सहायता चाहिए।"
        : "Hello, I need agricultural support.";

    if (productName) {
        message = language === 'HI'
            ? `नमस्ते, मुझे इस उत्पाद के बारे में जानकारी चाहिए: ${productName}`
            : `Hello, I need information about this product: ${productName}`;
    } else if (advisoryContext) {
        message = language === 'HI'
            ? `नमस्ते, मुझे अपनी फसल (${advisoryContext}) के लिए विशेषज्ञ सलाह चाहिए।`
            : `Hello, I need expert advice for my crop issue: ${advisoryContext}`;
    }

    const handleClick = () => {
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <button
            onClick={handleClick}
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center gap-2 group animate-in fade-in slide-in-from-bottom-4"
            aria-label="Ask Expert"
        >
            <MessageCircle className="w-6 h-6" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-bold">
                {language === 'HI' ? 'विशेषज्ञ से पूछें' : 'Ask Expert'}
            </span>
        </button>
    );
};

export default WhatsAppFloat;
