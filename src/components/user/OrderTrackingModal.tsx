import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Order, useOrders } from '@/hooks/useOrders';
import { Package, Truck, CheckCircle, Clock, ShoppingBag, X, AlertCircle, XCircle, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface OrderTrackingModalProps {
    order: Order | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ order, open, onOpenChange }) => {
    const { t } = useLanguage();
    const { cancelOrder } = useOrders();
    const navigate = useNavigate();

    if (!order) return null;

    // Map backend statuses to UI steps (0-5)
    const getStatusIndex = (status: string) => {
        switch (status) {
            case 'placed': return 0;
            case 'confirmed': return 1;
            case 'packed': return 2;
            case 'shipped': return 3;
            case 'out_for_delivery': return 4;
            case 'delivered': return 5;
            case 'cancelled': return -1;
            default: return 0;
        }
    };

    const statuses = [
        { key: 'ordered', label: t.orderTracking?.steps?.ordered || 'Ordered', icon: ShoppingBag, date: order.placed_at },
        { key: 'confirmed', label: t.orderTracking?.steps?.confirmed || 'Confirmed', icon: CheckCircle, date: order.confirmed_at },
        { key: 'processing', label: t.orderTracking?.steps?.processing || 'Packed', icon: Package, date: order.packed_at },
        { key: 'shipped', label: t.orderTracking?.steps?.shipped || 'Shipped', icon: Truck, date: order.shipped_at },
        { key: 'outForDelivery', label: t.orderTracking?.steps?.outForDelivery || 'Out for Delivery', icon: Truck, date: order.out_for_delivery_at },
        { key: 'delivered', label: t.orderTracking?.steps?.delivered || 'Delivered', icon: CheckCircle, date: order.delivered_at },
    ];

    const currentStatusIndex = getStatusIndex(order.status);
    const progressPercentage = (Math.max(0, currentStatusIndex) / (statuses.length - 1)) * 100;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success(t.products?.quantityUpdated || "Copied to clipboard");
    };

    const handleCancel = async () => {
        const success = await cancelOrder(order.id);
        if (success) {
            onOpenChange(false);
        }
    };

    const isCancelled = order.status === 'cancelled';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
                <div className="bg-gradient-to-br from-primary/5 to-white p-6 pb-0">
                    <DialogHeader className="mb-6">
                        <div className="flex justify-between items-center">
                            <DialogTitle className="text-2xl font-display font-black text-gray-900 tracking-tight">
                                {t.orderTracking?.title || 'Track Order'}
                            </DialogTitle>
                            <div className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                    'bg-primary/10 text-primary'
                                }`}>
                                {t.orderTracking?.status?.[order.status as keyof typeof t.orderTracking.status] || order.status}
                            </div>
                        </div>
                    </DialogHeader>

                    {/* Order Info Bar */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap justify-between items-center gap-4 mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                <ShoppingBag className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{t.orderTracking?.orderId || 'Order ID'}</p>
                                <div className="flex items-center gap-1">
                                    <p className="font-mono font-bold text-gray-900 truncate max-w-[120px]">{order.order_number || order.id.slice(0, 8)}</p>
                                    <button onClick={() => copyToClipboard(order.order_number || order.id)} className="text-muted-foreground hover:text-primary transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="h-8 w-px bg-gray-100 hidden md:block" />
                        <div>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{t.orderTracking?.placedOn || 'Placed On'}</p>
                            <p className="font-bold text-gray-900">{new Date(order.placed_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <div className="h-8 w-px bg-gray-100 hidden md:block" />
                        <div>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{t.orderTracking?.totalAmount || 'Total Amount'}</p>
                            <p className="font-black text-primary text-lg">₹{order.total_amount.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 pt-0 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {/* 6-Step Progress Stepper */}
                    {!isCancelled && (
                        <div className="relative px-2 py-4">
                            {/* Line Background */}
                            <div className="absolute top-[34px] left-8 right-8 h-1 bg-gray-100 rounded-full" />
                            {/* Line Active Fill */}
                            <div
                                className="absolute top-[34px] left-8 h-1 bg-primary rounded-full transition-all duration-700"
                                style={{ width: `calc(${progressPercentage}% - ${currentStatusIndex === 5 ? '0px' : '0px'})` }}
                            />

                            <div className="relative flex justify-between gap-2">
                                {statuses.map((s, index) => {
                                    const isCompleted = index <= currentStatusIndex;
                                    const isCurrent = index === currentStatusIndex;
                                    const Icon = s.icon;

                                    return (
                                        <div key={index} className="flex flex-col items-center gap-3 relative z-10 flex-1">
                                            <div className={`
                                                w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-md transition-all duration-500
                                                ${isCompleted ? 'bg-primary text-white' : 'bg-white text-gray-300'}
                                                ${isCurrent ? 'ring-4 ring-primary/20 scale-110' : ''}
                                            `}>
                                                {isCompleted && !isCurrent && index < 5 ? (
                                                    <CheckCircle className="w-5 h-5" />
                                                ) : (
                                                    <Icon className={`w-5 h-5 ${isCurrent ? 'animate-pulse' : ''}`} />
                                                )}
                                            </div>
                                            <div className="text-center">
                                                <p className={`text-[10px] font-black uppercase tracking-tighter leading-tight max-w-[60px] mx-auto ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                                                    {s.label}
                                                </p>
                                                {s.date && isCompleted && (
                                                    <p className="text-[8px] text-muted-foreground mt-0.5 whitespace-nowrap">
                                                        {new Date(s.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {isCancelled && (
                        <div className="bg-red-50/50 border border-red-100 rounded-3xl p-8 flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 shadow-sm border-4 border-white">
                                <X className="w-10 h-10 text-red-600" />
                            </div>
                            <h3 className="text-2xl font-display font-black text-red-600 mb-2">
                                {t.orderTracking?.status?.cancelled || 'Cancelled'}
                            </h3>
                            <p className="text-muted-foreground font-medium mb-6">
                                {t.orderTracking?.description?.cancelled || 'Order has been cancelled'}
                            </p>

                            <div className="w-full bg-white border border-red-50 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center shrink-0 border border-green-100">
                                    <Clock className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t.orderTracking?.refundStatus || 'Refund Status'}</p>
                                    <p className="text-sm font-bold text-green-700">{t.orderTracking?.refundInitiated || 'Refund Initiated'}</p>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">Will reflect in 5-7 working days</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Status History Timeline */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-black text-gray-900 flex items-center gap-2 px-1">
                            <Clock className="w-4 h-4 text-primary" />
                            {t.orderTracking?.history?.title || 'Status History'}
                        </h4>

                        <div className="relative space-y-0 pb-4">
                            {/* Vertical Line */}
                            <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gray-100" />

                            {statuses.filter(s => s.date).reverse().map((s, idx) => (
                                <div key={idx} className="relative pl-12 pb-6 group last:pb-0">
                                    {/* Dot */}
                                    <div className={`absolute left-[14px] top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm z-10 ${idx === 0 ? 'bg-primary ring-4 ring-primary/20 scale-125' : 'bg-gray-300'
                                        }`} />

                                    <div className={`p-4 rounded-2xl border transition-all duration-300 group-hover:translate-x-1 ${idx === 0 ? 'bg-primary/5 border-primary/20 shadow-sm' : 'bg-white border-gray-100'
                                        }`}>
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <p className={`text-sm font-bold ${idx === 0 ? 'text-primary' : 'text-gray-900'}`}>
                                                    {t.orderTracking?.history?.[s.key as keyof typeof t.orderTracking.history] || s.label}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {idx === 0 ? 'Latest Update' : 'Completed'}
                                                </p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-xs font-bold text-gray-900">
                                                    {new Date(s.date!).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground">
                                                    {new Date(s.date!).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-gray-50 p-6 border-t border-gray-100 mt-8 rounded-3xl">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Items in Order</h4>
                        <div className="space-y-3">
                            {order.items.map((item, i) => (
                                <div key={i} className="flex justify-between items-center text-sm bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                    <span className="text-gray-700 font-medium line-clamp-1">{item.name}</span>
                                    <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded text-xs">x{item.quantity}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-50 flex gap-4 bg-gray-50/50">
                    {!isCancelled && order.status === 'placed' && (
                        <Button
                            variant="outline"
                            className="flex-1 rounded-2xl h-12 font-bold text-red-600 border-red-100 hover:bg-red-50"
                            onClick={handleCancel}
                        >
                            Cancel Order
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        className="flex-1 rounded-2xl h-12 font-bold text-gray-600 hover:bg-white"
                        onClick={() => onOpenChange(false)}
                    >
                        {t.orderTracking?.back || 'Close'}
                    </Button>
                    <Button
                        className="flex-[2] rounded-2xl h-12 font-black shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all text-base"
                        onClick={() => {
                            navigate(`/order/${order.id}`);
                            onOpenChange(false);
                        }}
                    >
                        {/* @ts-ignore */}
                        {t.orderTracking?.seeOrder || 'See your order'}
                        <svg className="ml-2" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
