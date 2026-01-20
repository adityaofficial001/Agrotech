
import { Product } from "@/data/categories";
import { ProductCard } from "./ProductCard";


import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

interface ProductSectionProps {
    title: string;
    products: Product[];
}

export const ProductSection = ({ title, products }: ProductSectionProps) => {
    return (
        <div section-id={title} id={title.replace(/\s+/g, '-').toLowerCase()} className="py-8 animate-fade-in">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-primary whitespace-nowrap">{title}</h2>
                    <div className="h-[2px] w-full bg-primary/10 rounded-full" />
                </div>

                {/* Unified Carousel View for All Screens */}
                <div className="w-full">
                    <Carousel
                        opts={{
                            align: "start",
                            loop: false,
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-2 md:-ml-4">
                            {products.map((product) => (
                                <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                                    <ProductCard product={product} />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <div className="hidden md:block">
                            <CarouselPrevious className="left-[-12px] h-8 w-8" />
                            <CarouselNext className="right-[-12px] h-8 w-8" />
                        </div>
                    </Carousel>
                </div>
            </div>
        </div>
    );
};
