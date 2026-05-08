
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useOrders } from '@/hooks/useOrders';
import { useLanguage } from '@/contexts/LanguageContext';
import TopHeader from '@/components/layout/TopHeader';

import Footer from '@/components/layout/Footer';
import { Button } from "@/components/ui/button";
import { format, differenceInHours } from 'date-fns';
import { ChevronLeft, Package, Clock, Truck, CheckCircle2, XCircle, MapPin, CreditCard, ShoppingBag, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AgriButton } from '@/components/ui/AgriButton';
import { FeedbackButtons } from '@/components/feedback/FeedbackButtons';

const OrderDetails = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const { orders, loading, cancelOrder } = useOrders();
    const { t, language } = useLanguage();
    const navigate = useNavigate();
    const [showCancelDialog, setShowCancelDialog] = useState(false);

    // Scroll to top
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const order = orders.find(o => o.id === orderId);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <TopHeader />

                <div className="flex-1 flex flex-col items-center justify-center p-8">
                    <h2 className="text-xl font-bold mb-4">Order Not Found</h2>
                    <Link to="/orders">
                        <Button>{t.orderTracking?.back || 'Back to Orders'}</Button>
                    </Link>
                </div>
                <Footer />
            </div>
        )
    }

    // --- Cancellation Logic ---
    // Rules: 
    // 1. Status must be 'placed' or 'confirmed' (mapped to 'ordered' in basic terms) or 'packed'. 
    //    Actually user said: "Order status is 'Ordered' or 'In Progress'". 
    //    'packed' implies in progress. 'shipped' is too late.
    // 2. Time limit: 2 hours from 'placed_at'.

    const isStatusCancellable = ['placed', 'confirmed', 'packed'].includes(order.status);
    const hoursSincePlaced = differenceInHours(new Date(), new Date(order.placed_at));
    const isTimeValid = hoursSincePlaced < 2;

    const canCancel = isStatusCancellable && isTimeValid;

    const handleCancelConfirm = async () => {
        const success = await cancelOrder(order.id);
        if (success) {
            setShowCancelDialog(false);
            navigate('/orders'); // Redirect to orders list as per requirement "Remove from list" (effectively returning to list where it might be filtered or status updated)
        }
    };

    const statusConfig = {
        placed: { icon: Clock, label: t.orderTracking?.status?.ordered || 'Ordered', color: 'text-yellow-600', bg: 'bg-yellow-100' },
        confirmed: { icon: CheckCircle2, label: 'Confirmed', color: 'text-blue-600', bg: 'bg-blue-100' },
        packed: { icon: Package, label: t.orderTracking?.status?.packed || 'Packed', color: 'text-purple-600', bg: 'bg-purple-100' },
        shipped: { icon: Truck, label: t.orderTracking?.status?.shipped || 'Shipped', color: 'text-orange-600', bg: 'bg-orange-100' },
        delivered: { icon: CheckCircle2, label: t.orderTracking?.status?.delivered || 'Delivered', color: 'text-green-600', bg: 'bg-green-100' },
        cancelled: { icon: XCircle, label: t.orderTracking?.status?.cancelled || 'Cancelled', color: 'text-red-600', bg: 'bg-red-100' },
        out_for_delivery: { icon: Truck, label: 'Out for Delivery', color: 'text-indigo-600', bg: 'bg-indigo-100' }
    };

    // @ts-ignore
    const currentStatus = statusConfig[order.status] || statusConfig.placed;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <TopHeader />


            <main className="flex-1 container mx-auto px-4 py-8">

                {/* Back Button */}
                <Link to="/orders" className="inline-flex items-center text-gray-600 hover:text-green-700 mb-6 transition-colors">
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    {t.orderTracking?.back || 'Back to Orders'}
                </Link>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left Column: Order Info */}
                    <div className="flex-1 space-y-6">

                        {/* Header Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
                            <div className={`absolute top-0 right-0 px-4 py-2 rounded-bl-2xl font-bold flex items-center gap-2 ${currentStatus.bg} ${currentStatus.color}`}>
                                <currentStatus.icon className="w-4 h-4" />
                                {currentStatus.label}
                            </div>
                            <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">
                                {t.orderTracking?.orderId || 'Order'} #{order.order_number}
                            </h1>
                            <p className="text-gray-500 text-sm">
                                {t.orderTracking?.placedOn || 'Placed on'} {format(new Date(order.placed_at), 'dd MMM yyyy, hh:mm a')}
                            </p>
                        </div>

                        {/* Tracking Progress (Simplified) */}
                        {order.status !== 'cancelled' && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-6">Order Timeline</h3>
                                <div className="relative flex justify-between">
                                    {/* Line */}
                                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 -z-10"></div>

                                    {['placed', 'shipped', 'delivered'].map((step, idx) => {
                                        const stepConfig = statusConfig[step as keyof typeof statusConfig];
                                        const isCompleted = ['placed', 'shipped', 'delivered'].indexOf(order.status) >= idx || order.status === 'delivered';
                                        // Simple logic roughly mapping statuses
                                        let active = false;
                                        if (order.status === 'delivered') active = true;
                                        else if (order.status === 'shipped' || order.status === 'out_for_delivery') active = idx <= 1;
                                        else active = idx === 0;

                                        return (
                                            <div key={step} className="flex flex-col items-center bg-white px-2">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${active ? 'bg-green-600 border-green-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                                                    <stepConfig.icon className="w-5 h-5" />
                                                </div>
                                                <span className={`mt-2 text-xs font-bold ${active ? 'text-gray-900' : 'text-gray-400'}`}>{stepConfig.label}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Items */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-gray-400" />
                                {t.orderTracking?.items || 'Items'}
                            </h3>
                            <div className="divide-y divide-gray-100">
                                {order.items.map((item, i) => (
                                    <div key={i} className="py-4 flex gap-4">
                                        <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                                            {item.image ? <img src={item.image} alt={item.name} className="w-16 h-16 object-contain" /> : <Package className="w-8 h-8 text-gray-300" />}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900 line-clamp-2">{item.name}</h4>
                                            <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900">₹{item.price * item.quantity}</p>
                                            <p className="text-xs text-gray-400">₹{item.price} / item</p>
                                            <div className="mt-2">
                                                <FeedbackButtons
                                                    targetId={item.id}
                                                    targetType="product"
                                                    variant="minimal"
                                                    className="justify-end"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="lg:w-96 space-y-6">

                        {/* Summary */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4">{t.cart?.title || 'Order Summary'}</h3>
                            <div className="space-y-3 pb-4 border-b border-gray-100">
                                <div className="flex justify-between text-gray-600">
                                    <span>{t.cart?.subtotal || 'Subtotal'}</span>
                                    <span>₹{order.total_amount}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>{t.cart?.shipping || 'Shipping'}</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                            </div>
                            <div className="pt-4 flex justify-between items-center">
                                <span className="font-bold text-lg">{t.cart?.estimatedTotal || 'Total'}</span>
                                <span className="font-black text-xl text-green-700">₹{order.total_amount}</span>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-gray-400" />
                                Shipping Details
                            </h3>
                            <div className="space-y-1 text-sm text-gray-600">
                                <p className="font-bold text-gray-900">{order.shipping_address.fullName}</p>
                                <p>{order.shipping_address.address}</p>
                                <p>{order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}</p>
                                <div className="mt-3 pt-3 border-t border-gray-50 space-y-2">
                                    <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> {order.shipping_address.phone}</p>
                                    <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /> {order.shipping_address.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
                            <Link to="/">
                                <Button variant="outline" className="w-full py-6 text-base font-bold border-gray-300 hover:bg-gray-50">
                                    {t.orderTracking?.continueShopping || 'Continue Shopping'}
                                </Button>
                            </Link>

                            {canCancel ? (
                                <Button
                                    variant="destructive"
                                    className="w-full py-6 text-base font-bold bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                                    onClick={() => setShowCancelDialog(true)}
                                >
                                    {t.orderTracking?.cancelOrder || 'Cancel Order'}
                                </Button>
                            ) : (
                                order.status !== 'cancelled' && order.status !== 'delivered' && (
                                    <div className="text-center p-3 bg-gray-100 rounded-lg text-xs text-gray-500">
                                        {t.orderTracking?.cancelWindowExpired || 'Cancellation window expired'}
                                    </div>
                                )
                            )}
                        </div>

                    </div>
                </div>

            </main>
            <Footer />

            {/* Cancel Dialogue */}
            <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t.orderTracking?.cancelConfirmTitle || 'Are you sure?'}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t.orderTracking?.cancelConfirmDesc || 'Do you really want to cancel this order? This process cannot be undone.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t.orderTracking?.back || 'Go Back'}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCancelConfirm} className="bg-red-600 hover:bg-red-700">
                            {t.orderTracking?.confirm || 'Yes, Cancel Order'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    );
};

export default OrderDetails;
