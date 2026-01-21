import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import TopHeader from '@/components/layout/TopHeader';
import CategoryNav from '@/components/layout/CategoryNav';
import Footer from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Blog = () => {
    const { t, language } = useLanguage();
    const currentLanguage = language === 'HI' ? 'hi' : 'en';

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <TopHeader />
            <CategoryNav activeCategory="" onCategoryChange={() => { }} />

            <main className="flex-1">
                <div className="container mx-auto px-4 py-8">
                    <Breadcrumbs items={[{ label: t.blog.title }]} />

                    <div className="text-center mb-12 mt-6">
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">{t.blog.title}</h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t.blog.subtitle}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        {t.blog.posts.map((post: any, index: number) => (
                            <Link key={index} to={`/blog/${post.id}`}>
                                <article className="h-full bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                                    <div className="aspect-[16/9] bg-muted relative overflow-hidden">
                                        <div className="absolute inset-0 bg-agri-green/10 group-hover:bg-agri-green/20 transition-colors" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-6xl">🚜</span>
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                            <Calendar className="w-4 h-4" />
                                            <span>{post.date}</span>
                                        </div>
                                        <h2 className="text-xl font-display font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                            {post.title}
                                        </h2>
                                        <p className="text-muted-foreground mb-6 line-clamp-3">
                                            {post.desc}
                                        </p>
                                        <div className="mt-auto">
                                            <Button variant="ghost" className="p-0 h-auto font-bold flex items-center gap-2 group/btn hover:bg-transparent">
                                                {t.blog.readMore}
                                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                            </Button>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Blog;
