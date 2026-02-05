import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import TopHeader from '@/components/layout/TopHeader';
import CategoryNav from '@/components/layout/CategoryNav';
import Footer from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

const PrivacyPolicy = () => {
    const { t, language } = useLanguage();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <TopHeader />
            <CategoryNav activeCategory="" onCategoryChange={() => { }} />

            <main className="flex-1">
                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    <Breadcrumbs items={[{ label: t.privacy.title }]} />

                    <div className="bg-card rounded-2xl p-8 md:p-12 border border-border shadow-sm mt-6">
                        <h1 className="text-3xl font-display font-bold text-foreground mb-8">{t.privacy.title}</h1>

                        <div className="prose prose-agri max-w-none">
                            <p className="text-foreground font-medium text-lg leading-relaxed mb-6">
                                {t.privacy.introduction}
                            </p>

                            <p className="text-muted-foreground leading-relaxed mb-6">
                                {t.privacy.text1}
                            </p>

                            <div className="bg-muted/50 p-6 rounded-xl border border-border mb-10">
                                <p className="text-muted-foreground text-sm">
                                    {t.privacy.note}
                                </p>
                            </div>

                            <div className="mb-12">
                                <h2 className="text-xl font-display font-bold text-foreground mb-4 font-display">
                                    {t.privacy.contactingUs.title}
                                </h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    {t.privacy.contactingUs.text}
                                </p>
                            </div>

                            {t.privacy.sections.map((section, index) => (
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
                                        ? 'अंतिम अपडेट: 20 जनवरी, 2026। इस नीति के बारे में किसी भी प्रश्न के लिए, कृपया contact@vardhman.com पर हमसे संपर्क करें।'
                                        : 'Last updated: January 20, 2026. For any questions regarding this policy, please contact us at contact@vardhman.com.'}
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

export default PrivacyPolicy;
