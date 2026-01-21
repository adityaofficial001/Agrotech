
import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Order } from '@/contexts/UserPreferencesContext';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

interface OrderTrackingModalProps {
    order: Order | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ order, open, onOpenChange }) => {
    if (!order) return null;

    const statuses = [
        { label: 'Ordered', icon: Clock, description: 'Order received and confirmed' },
        { label: 'Packed', icon: Package, description: 'Items are being prepared for shipping' },
        { label: 'Shipped', icon: Truck, description: 'Order is on the way to you' },
        { label: 'Delivered', icon: CheckCircle, description: 'Order successfully delivered' },
    ];

    const currentStatusIndex = statuses.findIndex(s => s.label === order.status);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <DialogTitle className="text-2xl">Track Your Order</DialogTitle>
                            <DialogDescription className="mt-1">
                                Order ID: <span className="font-mono font-bold text-primary">{order.id}</span>
                            </DialogDescription>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                            {order.status}
                        </div>
                    </div>
                </DialogHeader>

                <div className="mt-8 relative">
                    {/* Vertical Timeline Bar */}
                    <div className="absolute left-[21px] top-2 bottom-2 w-0.5 bg-gray-100" />
                    <div
                        className="absolute left-[21px] top-2 w-0.5 bg-primary transition-all duration-1000"
                        style={{ height: `${(currentStatusIndex / (statuses.length - 1)) * 100}%` }}
                    />

                    <div className="flex flex-col gap-8">
                        {statuses.map((s, index) => {
                            const Icon = s.icon;
                            const isCompleted = index <= currentStatusIndex;
                            const isCurrent = index === currentStatusIndex;

                            return (
                                <div key={s.label} className="flex gap-6 relative z-10">
                                    <div className={`w-11 h-11 rounded-full flex items-center justify-center border-4 border-white transition-colors duration-500 shadow-sm ${isCompleted ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
                                        }`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 pt-1">
                                        <p className={`font-bold transition-colors ${isCompleted ? 'text-gray-900' : 'text-gray-400'
                                            }`}>
                                            {s.label}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>
                                        {isCurrent && index < statuses.length - 1 && (
                                            <div className="mt-3 inline-flex items-center gap-2 px-2 py-1 bg-primary/5 rounded border border-primary/20 animate-pulse">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                <span className="text-[10px] uppercase tracking-wider font-black text-primary">In Progress</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Order Details</h4>
                    <div className="space-y-2">
                        {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 line-clamp-1">{item}</span>
                                <span className="font-medium text-gray-900">x1</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-baseline">
                        <span className="text-xs font-bold text-gray-500 tracking-tighter">Total Amount</span>
                        <span className="text-lg font-black text-primary">₹{order.total.toLocaleString()}</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
