import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Truck, CheckCircle2, Clock, Box, MapPin } from 'lucide-react';
import TopHeader from '@/components/layout/TopHeader';
import CategoryNav from '@/components/layout/CategoryNav';
import Footer from '@/components/layout/Footer';
import { useOrders, OrderStatus } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { AgriButton } from '@/components/ui/AgriButton';
import { format } from 'date-fns';

const statusConfig: Record<OrderStatus, { icon: React.ElementType; color: string; label: string; labelHi: string }> = {
  placed: { icon: Clock, color: 'text-yellow-500', label: 'Order Placed', labelHi: 'ऑर्डर दिया गया' },
  confirmed: { icon: CheckCircle2, color: 'text-blue-500', label: 'Confirmed', labelHi: 'पुष्टि हुई' },
  packed: { icon: Box, color: 'text-purple-500', label: 'Packed', labelHi: 'पैक किया गया' },
  shipped: { icon: Truck, color: 'text-orange-500', label: 'Shipped', labelHi: 'भेज दिया गया' },
  out_for_delivery: { icon: MapPin, color: 'text-primary', label: 'Out for Delivery', labelHi: 'डिलीवरी के लिए निकला' },
  delivered: { icon: CheckCircle2, color: 'text-green-500', label: 'Delivered', labelHi: 'डिलीवर हो गया' },
  cancelled: { icon: Clock, color: 'text-destructive', label: 'Cancelled', labelHi: 'रद्द किया गया' },
};

const statusOrder: OrderStatus[] = ['placed', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered'];

const Orders = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'hi'>('en');
  const { orders, loading } = useOrders();
  const { user } = useAuth();

  const translations = {
    en: {
      title: 'My Orders',
      empty: 'No orders yet',
      emptyDesc: 'Start shopping to see your orders here',
      browse: 'Browse Products',
      login: 'Login to view your orders',
      loginBtn: 'Login',
      orderNumber: 'Order',
      estimatedDelivery: 'Estimated Delivery',
      trackingNumber: 'Tracking',
      items: 'items',
      total: 'Total',
    },
    hi: {
      title: 'मेरे ऑर्डर',
      empty: 'अभी तक कोई ऑर्डर नहीं',
      emptyDesc: 'यहां अपने ऑर्डर देखने के लिए खरीदारी शुरू करें',
      browse: 'उत्पाद देखें',
      login: 'अपने ऑर्डर देखने के लिए लॉगिन करें',
      loginBtn: 'लॉगिन',
      orderNumber: 'ऑर्डर',
      estimatedDelivery: 'अनुमानित डिलीवरी',
      trackingNumber: 'ट्रैकिंग',
      items: 'आइटम',
      total: 'कुल',
    }
  };

  const t = translations[currentLanguage];

  const getStatusIndex = (status: OrderStatus) => statusOrder.indexOf(status);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <TopHeader currentLanguage={currentLanguage} onLanguageChange={setCurrentLanguage} />
        <CategoryNav currentLanguage={currentLanguage} activeCategory="" onCategoryChange={() => {}} />
        
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
              <Package className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-display font-bold text-foreground mb-2">
              {t.login}
            </h2>
            <Link to="/login">
              <AgriButton className="mt-4">{t.loginBtn}</AgriButton>
            </Link>
          </div>
        </main>

        <Footer currentLanguage={currentLanguage} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopHeader currentLanguage={currentLanguage} onLanguageChange={setCurrentLanguage} />
      <CategoryNav currentLanguage={currentLanguage} activeCategory="" onCategoryChange={() => {}} />

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2 mb-8">
          <Package className="w-6 h-6 text-primary" />
          {t.title}
        </h1>

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
              {t.empty}
            </h2>
            <p className="text-muted-foreground mb-6">{t.emptyDesc}</p>
            <Link to="/">
              <AgriButton>{t.browse}</AgriButton>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const StatusIcon = statusConfig[order.status].icon;
              const statusColor = statusConfig[order.status].color;
              const statusLabel = currentLanguage === 'hi' 
                ? statusConfig[order.status].labelHi 
                : statusConfig[order.status].label;
              const currentStatusIndex = getStatusIndex(order.status);

              return (
                <div key={order.id} className="bg-card rounded-xl border border-border overflow-hidden">
                  {/* Order Header */}
                  <div className="p-4 border-b border-border bg-muted/30">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{t.orderNumber}</p>
                        <p className="font-semibold text-foreground">{order.order_number}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(order.placed_at), 'dd MMM yyyy')}
                        </p>
                        <p className="font-bold text-primary">{t.total}: ₹{order.total_amount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Status Timeline */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`flex items-center gap-2 ${statusColor}`}>
                        <StatusIcon className="w-5 h-5" />
                        <span className="font-medium">{statusLabel}</span>
                      </div>
                      {order.estimated_delivery && (
                        <div className="text-sm text-muted-foreground">
                          {t.estimatedDelivery}: {format(new Date(order.estimated_delivery), 'dd MMM')}
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {order.status !== 'cancelled' && (
                      <div className="flex items-center gap-1 mb-4">
                        {statusOrder.map((status, index) => (
                          <React.Fragment key={status}>
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                index <= currentStatusIndex
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              {index + 1}
                            </div>
                            {index < statusOrder.length - 1 && (
                              <div
                                className={`flex-1 h-1 ${
                                  index < currentStatusIndex ? 'bg-primary' : 'bg-muted'
                                }`}
                              />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    )}

                    {/* Order Items Preview */}
                    <div className="flex items-center gap-4 pt-4 border-t border-border">
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
                          {order.items.length} {t.items}
                        </p>
                        {order.tracking_number && (
                          <p className="text-xs text-muted-foreground">
                            {t.trackingNumber}: {order.tracking_number}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer currentLanguage={currentLanguage} />
    </div>
  );
};

export default Orders;
