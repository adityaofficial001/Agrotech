import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Truck, CheckCircle2, Clock, Box, MapPin, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import TopHeader from '@/components/layout/TopHeader';
import CategoryNav from '@/components/layout/CategoryNav';
import Footer from '@/components/layout/Footer';
import { useOrders, OrderStatus, Order } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { AgriButton } from '@/components/ui/AgriButton';
import { CancelOrderModal } from '@/components/user/CancelOrderModal';
import { format } from 'date-fns';

const statusOrder: OrderStatus[] = ['placed', 'packed', 'shipped', 'delivered'];

const Orders = () => {
  const { t, language, setLanguage } = useLanguage();
  const { orders, loading, cancelOrder } = useOrders();
  const { user } = useAuth();
  const [cancelModalOrder, setCancelModalOrder] = useState<Order | null>(null);

  const translations = t;
  const currentLanguage = language === 'HI' ? 'hi' : 'en';

  // Use global translations for status config
  const getStatusConfig = (status: OrderStatus) => {
    // Map backend status to our 4-step process
    let stepStatus = status;
    if (status === 'confirmed') stepStatus = 'placed';
    if (status === 'out_for_delivery') stepStatus = 'shipped';

    const statusKeyMap: Record<string, keyof typeof t.orderTracking.status> = {
      placed: 'ordered',
      packed: 'packed',
      shipped: 'shipped',
      delivered: 'delivered',
      cancelled: 'cancelled'
    };

    const key = statusKeyMap[stepStatus] || 'ordered';

    const label = t.orderTracking?.status?.[key] || stepStatus;

    // Icon and color config
    const config: Record<string, { icon: React.ElementType, color: string }> = {
      placed: { icon: Clock, color: 'text-yellow-500' },
      packed: { icon: Box, color: 'text-purple-500' },
      shipped: { icon: Truck, color: 'text-orange-500' },
      delivered: { icon: CheckCircle2, color: 'text-green-500' },
      cancelled: { icon: X, color: 'text-destructive' },
    };

    return { ...(config[stepStatus] || config['placed']), label };
  };

  const getStatusIndex = (status: OrderStatus) => {
    if (status === 'confirmed') return 0; // mapped to placed
    if (status === 'out_for_delivery') return 2; // mapped to shipped
    return statusOrder.indexOf(status);
  }

  const handleCancelOrder = async () => {
    if (!cancelModalOrder) return;
    const success = await cancelOrder(cancelModalOrder.id);
    if (success) {
      setCancelModalOrder(null);
    }
  };

  const isCancellable = (status: OrderStatus) => {
    return ['placed', 'confirmed', 'packed'].includes(status);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <TopHeader />
        <CategoryNav />

        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
              <Package className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-display font-bold text-foreground mb-2">
              {t.orderTracking?.loginPrompt || 'Login to view your orders'}
            </h2>
            <Link to="/login">
              <AgriButton className="mt-4">{t.header?.login || 'Login'}</AgriButton>
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopHeader />
      <CategoryNav />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <Package className="w-6 h-6 text-primary" />
            {t.header?.myOrders || 'My Orders'}
          </h1>
          <Link to="/">
            <Button variant="outline" size="sm" className="hidden lg:flex">
              {t.orderTracking?.continueShopping || 'Continue Shopping'}
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-xl h-48 animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-card rounded-2xl p-12 text-center border border-border">
            <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
              <Package className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-display font-bold text-foreground mb-2">
              {t.orderTracking?.noOrders || 'No orders yet'}
            </h2>
            <p className="text-muted-foreground mb-6">{t.wishlist?.continueShopping || 'Start shopping to see your orders here'}</p>
            <Link to="/">
              <AgriButton>{t.orderTracking?.continueShopping || 'Browse Products'}</AgriButton>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const { icon: StatusIcon, color: statusColor, label: statusLabel } = getStatusConfig(order.status);
              const currentStatusIndex = getStatusIndex(order.status);

              return (
                <div key={order.id} className={`bg-card rounded-xl border border-border overflow-hidden transition-all duration-300 ${order.status === 'cancelled' ? 'opacity-60 bg-gray-50' : ''}`}>
                  {/* Order Header */}
                  <div className="p-4 border-b border-border bg-muted/30">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{t.orderTracking?.orderId || 'Order'}</p>
                        <p className="font-semibold text-foreground">{order.order_number}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-right text-sm text-muted-foreground">
                          {format(new Date(order.placed_at), 'dd MMM yyyy')}
                        </p>
                        <p className="font-bold text-primary">{t.orderTracking?.totalAmount || 'Total'}: ₹{order.total_amount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Status Timeline */}
                  <div className="p-4">
                    <div className="flex items-center gap-2">
                      <StatusIcon className={`w-5 h-5 ${order.status === 'cancelled' ? 'text-red-500' : ''}`} />
                      <span className={`font-medium ${order.status === 'cancelled' ? 'text-red-600 font-bold uppercase tracking-wider' : ''}`}>
                        {t.orderTracking?.status?.[order.status as keyof typeof t.orderTracking.status] || statusLabel}
                      </span>
                    </div>
                    {order.estimated_delivery && (
                      <div className="text-sm text-muted-foreground">
                        {t.orderTracking?.estDelivery || 'Estimated Delivery'}: {format(new Date(order.estimated_delivery), 'dd MMM')}
                      </div>
                    )}
                  </div>

                  {/* Simplified 4-Step Progress Bar */}
                  {order.status !== 'cancelled' && (
                    <div className="relative">
                      <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 z-0"></div>
                      <div
                        className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-500"
                        style={{ width: `${(currentStatusIndex / (statusOrder.length - 1)) * 100}%` }}
                      ></div>

                      <div className={`flex justify-between relative z-10 w-full px-[20px]`}>
                        {statusOrder.map((status, index) => {
                          const { icon: StepIcon, label: stepLabel } = getStatusConfig(status);
                          const isActive = index <= currentStatusIndex;
                          return (
                            <div key={status} className="flex flex-col items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${isActive ? 'bg-primary border-primary text-primary-foreground' : 'bg-background border-muted text-muted-foreground'}`}>
                                <StepIcon className="w-4 h-4" />
                              </div>
                              <span className={`text-xs mt-2 font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {stepLabel}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Order Items Preview */}
                  <div className="flex items-center gap-4 pt-6 mt-6 border-t border-border">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div
                          key={idx}
                          className="w-12 h-12 rounded-lg border-2 border-background bg-muted flex items-center justify-center overflow-hidden"
                        >
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-6 h-6 text-muted-foreground" />
                          )}
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-12 h-12 rounded-lg border-2 border-background bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">
                        {order.items.length} {t.orderTracking?.items || 'items'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {isCancellable(order.status) && (
                        <Button
                          variant="ghost"
                          onClick={() => setCancelModalOrder(order)}
                          className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                        >
                          {t.orderTracking?.cancelOrder || 'Cancel Order'}
                        </Button>
                      )}
                      <Link to={`/order/${order.id}`}>
                        <Button variant="ghost" className="gap-1 text-primary hover:text-primary/80">
                          {t.orderTracking?.details || 'Details'} <ChevronRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

              );
            })}
          </div>
        )
        }
      </main >

      <Footer />

      <CancelOrderModal
        isOpen={!!cancelModalOrder}
        onClose={() => setCancelModalOrder(null)}
        onConfirm={handleCancelOrder}
        orderNumber={cancelModalOrder?.order_number || ''}
      />
    </div>
  );
};

export default Orders;
