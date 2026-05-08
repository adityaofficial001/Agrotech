import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import TopHeader from '@/components/layout/TopHeader';

import Footer from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
    const { t, language } = useLanguage();
    const currentLanguage = language === 'HI' ? 'hi' : 'en';

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <TopHeader />


            <main className="flex-1">
                <div className="container mx-auto px-4 py-8 max-w-3xl">
                    <Breadcrumbs items={[{ label: t.faq.title }]} />

                    <div className="text-center mb-12 mt-6">
                        <h1 className="text-4xl font-display font-bold text-foreground mb-4">{t.faq.title}</h1>
                        <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
                    </div>

                    <Accordion type="single" collapsible className="w-full bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                        {t.faq.questions.map((item, index) => (
                            <AccordionItem key={index} value={`item-${index}`} className="border-b last:border-0 border-border px-6">
                                <AccordionTrigger className="hover:no-underline font-display font-bold text-lg text-left py-6 group">
                                    <span className="group-data-[state=open]:text-primary transition-colors">{item.q}</span>
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                                    {item.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default FAQ;
