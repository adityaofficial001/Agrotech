import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import TopHeader from '@/components/layout/TopHeader';
import CategoryNav from '@/components/layout/CategoryNav';
import Footer from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

const Terms = () => {
    const { t, language } = useLanguage();
    const currentLanguage = language === 'HI' ? 'hi' : 'en';

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <TopHeader />
            <CategoryNav activeCategory="" onCategoryChange={() => { }} />

            <main className="flex-1">
                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    <Breadcrumbs items={[{ label: t.terms.title }]} />

                    <div className="bg-card rounded-2xl p-8 md:p-12 border border-border shadow-sm mt-6">
                        <h1 className="text-3xl font-display font-bold text-foreground mb-8">{t.terms.title}</h1>

                        <div className="prose prose-agri max-w-none">
                            {t.terms.sections.map((section, index) => (
                                <div key={index} className="mb-10 last:mb-0">
                                    <h2 className="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
                                        <span className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center text-sm">
                                            {index + 1}
                                        </span>
                                        {section.h}
                                    </h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {section.p}
                                    </p>
                                </div>
                            ))}

                            <div className="mt-12 p-6 bg-muted rounded-xl border border-border">
                                <p className="text-sm text-muted-foreground italic">
                                    {language === 'HI'
                                        ? 'वर्तमान का उपयोग जारी रखकर, आप इन कानूनी शर्तों से सहमत हैं। हम किसी भी समय इन नियमों को संशोधित करने का अधिकार सुरक्षित रखते हैं।'
                                        : 'By continuing to use Vartman, you agree to these legal terms. We reserve the right to modify these rules at any time.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Terms;
