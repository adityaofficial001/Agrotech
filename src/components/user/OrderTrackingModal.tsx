
import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Order } from '@/hooks/useOrders';
import { Package, Truck, CheckCircle, Clock, ShoppingBag, X, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

interface OrderTrackingModalProps {
    order: Order | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

import { useNavigate } from 'react-router-dom';

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ order, open, onOpenChange }) => {
    const { t } = useLanguage();
    const navigate = useNavigate();

    if (!order) return null;

    // Map backend statuses to UI steps
    const getStatusIndex = (status: string) => {
        switch (status) {
            case 'placed':
            case 'confirmed':
                return 0;
            case 'packed':
                return 1;
            case 'shipped':
            case 'out_for_delivery':
                return 2;
            case 'delivered':
                return 3;
            case 'cancelled':
                return -1; // Handle cancelled
            default:
                return 0;
        }
    };

    const statuses = [
        { label: t.orderTracking?.status?.ordered || 'Ordered', icon: Clock, description: t.orderTracking?.description?.ordered || 'Order received and confirmed' },
        { label: t.orderTracking?.status?.packed || 'Packed', icon: Package, description: t.orderTracking?.description?.packed || 'Items are being prepared for shipping' },
        { label: t.orderTracking?.status?.shipped || 'Shipped', icon: Truck, description: t.orderTracking?.description?.shipped || 'Order is on the way to you' },
        { label: t.orderTracking?.status?.delivered || 'Delivered', icon: CheckCircle, description: t.orderTracking?.description?.delivered || 'Order successfully delivered' },
    ];

    const currentStatusIndex = getStatusIndex(order.status);
    const progressPercentage = (Math.max(0, currentStatusIndex) / (statuses.length - 1)) * 100;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // You might want to show a toast here, but simple alert for now or just silent copy
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[750px] overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
                        <div>
                            <DialogTitle className="text-2xl font-display font-bold text-primary">{t.orderTracking?.trackOrder || 'Track Your Order'}</DialogTitle>
                            <DialogDescription className="mt-1 flex items-center gap-2 text-sm bg-muted/50 px-3 py-1 rounded-md w-fit">
                                <span className="text-muted-foreground">{t.orderTracking?.orderId || 'Order ID'}:</span>
                                <span className="font-mono font-bold text-foreground tracking-wider">{order.order_number || order.id.slice(0, 8)}</span>
                                <button
                                    onClick={() => copyToClipboard(order.order_number || order.id)}
                                    className="ml-1 text-primary hover:text-primary-hover p-1 hover:bg-primary/10 rounded"
                                    title="Copy Order ID"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                                </button>
                            </DialogDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="hidden sm:flex gap-2" onClick={() => navigate('/faq')}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>
                                {t.orderTracking?.needHelp || 'Need Help?'}
                            </Button>
                            <div className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm items-center flex gap-1.5 ${order.status === 'delivered' ? 'bg-green-100 text-green-700 border border-green-200' :
                                order.status === 'cancelled' ? 'bg-destructive/10 text-destructive border border-destructive/20' :
                                    'bg-blue-50 text-blue-700 border border-blue-100'
                                }`}>
                                <span className={`w-2 h-2 rounded-full ${order.status === 'delivered' ? 'bg-green-600' : order.status === 'cancelled' ? 'bg-destructive' : 'bg-blue-600 animate-pulse'}`}></span>
                                {t.orderTracking?.status?.[order.status as keyof typeof t.orderTracking.status] || order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="py-6">
                    {/* Horizontal Stepper (Desktop) / Vertical (Mobile) */}
                    {order.status === 'cancelled' ? (
                        <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                                <X className="w-8 h-8 text-destructive" />
                            </div>
                            <h3 className="text-xl font-display font-bold text-destructive mb-2">
                                {t.orderTracking.status.cancelled}
                            </h3>
                            <p className="text-muted-foreground flex items-center gap-2">
                                {t.orderTracking.cancelledAt}: {new Date(order.updated_at || order.placed_at).toLocaleString()}
                            </p>

                            <div className="mt-6 w-full max-w-md bg-white border border-border rounded-xl p-4 flex items-center gap-4">
                                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center shrink-0">
                                    <AlertCircle className="w-5 h-5 text-green-600" />
                                </div>
                                <div className="text-left">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t.orderTracking.refundStatus}</p>
                                    <p className="text-sm font-bold text-green-700">{t.orderTracking.refundInitiated}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="relative">
                            {/* Desktop Progress Bar Background */}
                            <div className="hidden md:block absolute top-[22px] left-0 right-0 h-1 bg-gray-100 rounded-full -z-10" />
                            {/* Desktop Progress Bar Fill */}
                            <div
                                className="hidden md:block absolute top-[22px] left-0 h-1 bg-primary rounded-full transition-all duration-1000 -z-10"
                                style={{ width: `${progressPercentage}%` }}
                            />

                            {/* Steps */}
                            <div className="flex flex-col md:flex-row justify-between relative gap-8 md:gap-2">
                                {/* Mobile Vertical Line */}
                                <div className="md:hidden absolute left-[22px] top-4 bottom-4 w-0.5 bg-gray-100 -z-10" />
                                {/* Mobile Vertical Fill */}
                                <div
                                    className="md:hidden absolute left-[22px] top-4 w-0.5 bg-primary transition-all duration-1000 -z-10"
                                    style={{ height: `${progressPercentage}%` }}
                                />

                                {statuses.map((s, index) => {
                                    const Icon = s.icon;
                                    const isCompleted = index <= currentStatusIndex;
                                    const isCurrent = index === currentStatusIndex;

                                    return (
                                        <div key={s.label} className="flex md:flex-col items-start md:items-center gap-4 md:gap-2 relative flex-1">
                                            {/* Icon Bubble */}
                                            <div className={`
                                                w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center border-4 border-white shadow-sm shrink-0 z-10 transition-all duration-500
                                                ${isCompleted ? 'bg-primary text-white scale-100' : 'bg-gray-50 text-gray-300'}
                                                ${isCurrent ? 'ring-4 ring-primary/20 scale-110' : ''}
                                            `}>
                                                <Icon className="w-5 h-5 md:w-6 md:h-6" />
                                            </div>

                                            {/* Text Content */}
                                            <div className="pt-1 md:text-center md:px-2">
                                                <p className={`font-bold text-sm md:text-base transition-colors ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                                                    {s.label}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-0.5 md:max-w-[140px] md:mx-auto">
                                                    {s.description}
                                                </p>
                                                {isCurrent && index < statuses.length - 1 && (
                                                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 rounded-full text-[10px] font-bold text-primary uppercase tracking-wider animate-pulse md:mx-auto">
                                                        {t.orderTracking?.inProgress || 'In Progress'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Details Card */}
                <div className="mt-6 bg-gray-50/80 rounded-xl border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-white/50">
                        <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-primary" />
                            {t.orderTracking?.orderDetails || 'Order Details'}
                        </h4>
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Items List */}
                        <div className="space-y-3">
                            <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t.orderTracking?.items || 'Items'} ({order.items.length})</h5>
                            <div className="space-y-3 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                                {order.items.map((item, i) => (
                                    <div key={i} className="flex gap-3 items-center p-2 rounded-lg bg-white border border-gray-100 shadow-sm">
                                        <div className="w-10 h-10 rounded bg-gray-100 shrink-0 flex items-center justify-center">
                                            {/* Placeholder for item image if not available */}
                                            {item.image ? <img src={item.image} alt={item.name} className="w-8 h-8 object-contain" /> : <Package className="w-5 h-5 text-gray-400" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">{t.productDetail?.quantity || 'Qty'}: {item.quantity}</p>
                                        </div>
                                        {item.price && <p className="text-sm font-bold text-gray-700">₹{item.price}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Summary Stats */}
                        <div className="space-y-4">
                            <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Summary</h5>
                            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{t.orderTracking?.placedOn || 'Placed On'}</span>
                                    <span className="font-medium text-gray-900">{new Date(order.placed_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{t.orderTracking?.estDelivery || 'Est. Delivery'}</span>
                                    <span className="font-medium text-green-700">{order.estimated_delivery ? new Date(order.estimated_delivery).toLocaleDateString() : '3-5 Days'}</span>
                                </div>
                                <div className="h-px bg-gray-100 my-2" />
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-bold text-gray-900">{t.orderTracking?.totalAmount || 'Total Amount'}</span>
                                    <span className="text-xl font-display font-black text-primary">₹{order.total_amount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <Button
                        size="lg"
                        className="w-full gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all text-base"
                        onClick={() => {
                            navigate(`/order/${order.id}`);
                            onOpenChange(false);
                        }}
                    >
                        {/* @ts-ignore */}
                        {t.orderTracking?.seeOrder || 'See your order'}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
