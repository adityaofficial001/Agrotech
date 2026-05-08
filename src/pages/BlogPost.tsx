import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import TopHeader from '@/components/layout/TopHeader';

import Footer from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft } from 'lucide-react';

const BlogPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t, language } = useLanguage();
    const currentLanguage = language === 'HI' ? 'hi' : 'en';

    const post = t.blog.posts.find((p) => p.id === id);

    if (!post) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <TopHeader />

                <main className="flex-1 container mx-auto px-4 py-12 text-center">
                    <h1 className="text-2xl font-bold mb-4">Post not found</h1>
                    <Button onClick={() => navigate('/blog')}>Back to Blog</Button>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <TopHeader />


            <main className="flex-1">
                <div className="container mx-auto px-4 py-8">
                    <Breadcrumbs items={[
                        { label: t.blog.title, href: '/blog' },
                        { label: post.title }
                    ]} />

                    <div className="max-w-4xl mx-auto mt-8">
                        <Button
                            variant="ghost"
                            className="mb-6 gap-2 -ml-4"
                            onClick={() => navigate('/blog')}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            {language === 'HI' ? 'ब्लॉग पर वापस जाएं' : 'Back to Blog'}
                        </Button>

                        <article className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
                            <div className="aspect-[21/9] bg-agri-green/5 flex items-center justify-center border-b border-border">
                                <span className="text-8xl">🚜</span>
                            </div>

                            <div className="p-8 md:p-12">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                    <Calendar className="w-4 h-4" />
                                    <span>{post.date}</span>
                                </div>

                                <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-8 leading-tight">
                                    {post.title}
                                </h1>

                                <div className="prose prose-lg max-w-none dark:prose-invert">
                                    <p className="text-xl text-muted-foreground italic mb-8 border-l-4 border-primary pl-6 py-2">
                                        {post.desc}
                                    </p>

                                    {post.content.split('\n\n').map((paragraph: string, idx: number) => {
                                        if (paragraph.startsWith('###')) {
                                            return <h3 key={idx} className="text-2xl font-bold mt-8 mb-4">{paragraph.replace('### ', '')}</h3>;
                                        }
                                        if (paragraph.startsWith('-')) {
                                            return (
                                                <ul key={idx} className="list-disc pl-6 mb-4 space-y-2">
                                                    {paragraph.split('\n').map((li, liIdx) => (
                                                        <li key={liIdx}>{li.replace('- ', '')}</li>
                                                    ))}
                                                </ul>
                                            );
                                        }
                                        return <p key={idx} className="mb-6 leading-relaxed">{paragraph}</p>;
                                    })}
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default BlogPost;
