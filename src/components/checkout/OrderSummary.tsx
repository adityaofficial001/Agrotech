
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Tag } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface OrderSummaryProps {
    shippingCost: number;
    t?: any;
}

export const OrderSummary = ({ shippingCost, t }: OrderSummaryProps) => {
    const { items, cartTotal, updateQuantity } = useCart();
    const [coupon, setCoupon] = useState("");
    const [discount, setDiscount] = useState(0);

    const applyCoupon = () => {
        if (coupon.toUpperCase() === "FARM10") {
            const discountAmount = Math.round(cartTotal * 0.10);
            setDiscount(discountAmount);
            toast.success("Coupon FARM10 applied! You saved 10%.");
        } else {
            setDiscount(0);
            toast.error("Invalid coupon code");
        }
    };

    const finalTotal = cartTotal + shippingCost - discount;
    const tax = Math.round(cartTotal * 0.05); // 5% tax mockup

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="text-lg font-semibold mb-4">{t?.sections?.orderSummary || "Order Summary"}</h3>

            {/* Items List */}
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                        <div className="h-16 w-16 bg-gray-100 rounded-md p-2 flex-shrink-0">
                            {/* Placeholder image */}
                            <img src="/placeholder.svg" className="w-full h-full object-contain" alt={item.name} />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-medium line-clamp-2">{item.name}</h4>
                            <p className="text-xs text-gray-500 mb-1">{item.quantity}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold">₹{item.price * item.cartQuantity}</span>

                                {/* Qty Controls */}
                                <div className="flex items-center gap-2 bg-gray-50 rounded-md border">
                                    <button
                                        type="button"
                                        onClick={(e) => { e.preventDefault(); updateQuantity(item.id, item.cartQuantity - 1); }}
                                        className="p-1 hover:bg-gray-200 rounded-l-md transition-colors"
                                    >
                                        <Minus className="h-3 w-3 text-gray-600" />
                                    </button>
                                    <span className="text-xs font-medium w-4 text-center">{item.cartQuantity}</span>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.preventDefault(); updateQuantity(item.id, item.cartQuantity + 1); }}
                                        className="p-1 hover:bg-gray-200 rounded-r-md transition-colors"
                                    >
                                        <Plus className="h-3 w-3 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Separator className="my-4" />

            {/* Coupon */}
            <div className="flex gap-2 mb-6">
                <div className="relative flex-1">
                    <Tag className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder={t?.summary?.couponPlaceholder || "Coupon Code"}
                        className="pl-9"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                    />
                </div>
                <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => { e.preventDefault(); applyCoupon(); }}
                >
                    {t?.summary?.apply || "APPLY"}
                </Button>
            </div>

            {/* Calculations */}
            <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex justify-between">
                    <span>{t?.summary?.subtotal || "Subtotal"}</span>
                    <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between">
                    <span>{t?.summary?.shipping || "Shipping"}</span>
                    <span className={shippingCost === 0 ? "text-green-600 font-medium" : ""}>
                        {shippingCost === 0 ? (t?.payment?.delivery?.free || "Free") : `₹${shippingCost}`}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>{t?.summary?.tax || "Tax (5% est.)"}</span>
                    <span>₹{tax}</span>
                </div>
                {discount > 0 && (
                    <div className="flex justify-between text-green-600 font-medium">
                        <span>{t?.summary?.discount || "Discount"} (FARM10)</span>
                        <span>- ₹{discount}</span>
                    </div>
                )}
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between items-center text-xl font-bold text-primary mb-6">
                <span>{t?.summary?.total || "Total"}</span>
                <span>₹{finalTotal + tax}</span>
            </div>

            <Button form="checkout-form" type="submit" className="w-full bg-primary hover:bg-primary-hover text-lg py-6 shadow-lg shadow-primary/20 mb-3">
                {t?.buttons?.placeOrder || "PLACE ORDER NOW"}
            </Button>

            <Button
                type="button"
                variant="ghost"
                className="w-full text-gray-500 hover:text-primary"
                onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}
            >
                {t?.buttons?.back || "Back to Shopping"}
            </Button>

            <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center gap-1">
                <Lock className="h-3 w-3" /> {t?.summary?.secure || "Secure Encrypted Payment"}
            </p>
        </div>
    );
};

import { Lock } from "lucide-react";
