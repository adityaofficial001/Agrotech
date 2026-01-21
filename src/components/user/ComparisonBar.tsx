
import React from 'react';
import { Product } from '@/data/categories';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { X, GitCompare, ChevronRight, Check, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

// Floating Bar Component
export const ComparisonBar: React.FC<{ onOpenModal: () => void }> = ({ onOpenModal }) => {
    const { comparisons, removeFromComparison, clearComparison } = useUserPreferences();

    if (comparisons.length === 0) return null;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
            <div className="bg-white rounded-2xl shadow-2xl border border-primary/10 p-2 flex items-center gap-4 min-w-[300px]">
                <div className="flex -space-x-4 pl-2">
                    {comparisons.map((product) => (
                        <div key={product.id} className="relative group">
                            <div className="w-12 h-12 rounded-xl bg-gray-100 border-2 border-white shadow-md overflow-hidden p-1 flex items-center justify-center">
                                <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                            </div>
                            <button
                                onClick={() => removeFromComparison(product.id)}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                    {Array.from({ length: 3 - comparisons.length }).map((_, i) => (
                        <div key={i} className="w-12 h-12 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200" />
                    ))}
                </div>

                <div className="h-8 w-[1px] bg-gray-100 mx-2" />

                <div className="flex items-center gap-3 pr-2">
                    {comparisons.length > 1 ? (
                        <Button size="sm" className="rounded-xl gap-2 shadow-lg shadow-primary/20 font-bold" onClick={onOpenModal}>
                            Compare Now
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    ) : (
                        <span className="text-xs font-medium text-muted-foreground px-2">Add 1 more to compare</span>
                    )}
                    <button onClick={clearComparison} className="p-2 hover:bg-gray-100 rounded-lg text-muted-foreground transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Full Modal Comparison Component
export const ComparisonModal: React.FC<{ open: boolean, onOpenChange: (open: boolean) => void }> = ({ open, onOpenChange }) => {
    const { comparisons } = useUserPreferences();

    const comparisonRows = [
        { label: 'Brand', key: 'brand' },
        { label: 'Price (Min)', key: 'priceMin' },
        { label: 'Quantity', key: 'quantity' },
        { label: 'Stock Status', key: 'inStock' },
        { label: 'Crops Support', key: 'crops' },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-2xl">
                        <GitCompare className="w-6 h-6 text-primary" />
                        Product Comparison
                    </DialogTitle>
                </DialogHeader>

                <div className="mt-6 grid grid-cols-4 gap-4 border-t pt-6">
                    <div className="font-bold text-gray-500 pt-32">Features</div>

                    {comparisons.map(p => (
                        <div key={p.id} className="text-center">
                            <div className="h-32 flex items-center justify-center p-4 bg-gray-50 rounded-2xl mb-4">
                                <img src={p.image} alt={p.name} className="max-h-full max-w-full object-contain" />
                            </div>
                            <p className="font-bold text-sm line-clamp-2 px-2">{p.name}</p>
                        </div>
                    ))}

                    {comparisonRows.map((row) => (
                        <React.Fragment key={row.label}>
                            <div className="py-4 border-t flex items-center font-black text-[10px] uppercase tracking-widest text-gray-400">
                                {row.label}
                            </div>
                            {comparisons.map((p: any) => (
                                <div key={`${p.id}-${row.label}`} className="py-4 border-t flex items-center justify-center text-sm">
                                    {row.key === 'inStock' ? (
                                        p[row.key] ? <Check className="text-green-500 w-5 h-5" /> : <Minus className="text-red-500 w-5 h-5" />
                                    ) : Array.isArray(p[row.key]) ? (
                                        <div className="flex flex-wrap gap-1 justify-center">
                                            {p[row.key]?.map((item: string) => (
                                                <span key={item} className="px-2 py-0.5 bg-gray-100 rounded-full text-[10px]">{item}</span>
                                            )) || 'N/A'}
                                        </div>
                                    ) : row.key === 'priceMin' ? (
                                        <span className="font-black text-primary">₹{p[row.key]?.toLocaleString()}</span>
                                    ) : (
                                        <span>{p[row.key] || 'N/A'}</span>
                                    )}
                                </div>
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
};
