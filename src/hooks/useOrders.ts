import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export type OrderStatus = 'placed' | 'confirmed' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  order_number: string;
  status: OrderStatus;
  total_amount: number;
  shipping_address: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  placed_at: string;
  confirmed_at: string | null;
  packed_at: string | null;
  shipped_at: string | null;
  out_for_delivery_at: string | null;
  delivered_at: string | null;
  estimated_delivery: string | null;
  tracking_number: string | null;
  updated_at: string;
}

export const useOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    const isMockMode = !!localStorage.getItem('mock_session');

    if (!user && !isMockMode) return;

    setLoading(true);




    // In Mock Mode, we trust the session is valid even if 'user' isn't fully hydrated yet
    // because useAuth handles that async check. 
    // However, createOrder relies on user.

    // Debug logging
    console.log("useOrders: fetchOrders called", { userEmail: user?.email, isMockMode });

    try {
      if (isMockMode) {
        // Retrieve persistent mock orders
        const storedOrdersStr = localStorage.getItem('mock_orders');
        console.log("useOrders: storedOrders from localStorage", storedOrdersStr);
        const storedOrders = JSON.parse(storedOrdersStr || '[]');

        // Demo data (only if no stored orders exist yet? or merge?)
        // Let's merge but avoid duplicates based on ID if possible, 
        // or just keep it simple: Stored + Demo. 
        // Logic: specific user created orders should come first.

        const demoMockData: Order[] = [
          {
            id: '1',
            order_number: 'ORD-2024-001',
            status: 'shipped',
            total_amount: 1280,
            placed_at: '2024-01-15T10:00:00Z',
            confirmed_at: '2024-01-15T10:30:00Z',
            packed_at: '2024-01-16T09:00:00Z',
            shipped_at: '2024-01-17T14:00:00Z',
            out_for_delivery_at: null,
            delivered_at: null,
            estimated_delivery: '2024-01-22T18:00:00Z',
            tracking_number: 'TRK123456789',
            shipping_address: {
              fullName: 'Aditya Singh',
              phone: '9876543210',
              email: 'aditya@example.com',
              address: 'House No 123, Malviya Nagar',
              city: 'Bhopal',
              state: 'Madhya Pradesh',
              pincode: '462001'
            },
            items: [
              { id: 'p1', name: 'Coragen Insecticide', quantity: 1, price: 1280, image: '/placeholder.svg' }
            ],
            updated_at: '2024-01-17T14:00:00Z'
          }
        ];

        // Merge demo data with user created mock orders
        setOrders([...storedOrders.reverse(), ...demoMockData]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Cast the data to match our Order interface
      const typedOrders: Order[] = (data || []).map(order => ({
        ...order,
        status: order.status as OrderStatus,
        shipping_address: order.shipping_address as Order['shipping_address'],
        items: order.items as Order['items'],
      }));

      setOrders(typedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: {
    total_amount: number;
    shipping_address: Order['shipping_address'];
    items: Order['items'];
    estimated_delivery?: string;
  }) => {
    if (!user) {
      toast.error('Please login to place an order');
      return null;
    }

    const isMockMode = !!localStorage.getItem('mock_session');

    if (isMockMode) {
      return new Promise<Order | null>((resolve) => {
        setTimeout(() => {
          const newOrder: Order = {
            id: 'mock-order-' + Math.random().toString(36).substr(2, 9),
            order_number: 'ORD-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 10000),
            status: 'placed',
            total_amount: orderData.total_amount,
            shipping_address: orderData.shipping_address,
            items: orderData.items,
            placed_at: new Date().toISOString(),
            confirmed_at: null,
            packed_at: null,
            shipped_at: null,
            out_for_delivery_at: null,
            delivered_at: null,
            estimated_delivery: orderData.estimated_delivery || null,
            tracking_number: null,
            updated_at: new Date().toISOString()
          };

          const currentMockOrders = JSON.parse(localStorage.getItem('mock_orders') || '[]');
          const updatedMockOrders = [...currentMockOrders, newOrder];
          localStorage.setItem('mock_orders', JSON.stringify(updatedMockOrders));

          console.log("useOrders: createOrder saved to localStorage", {
            newOrder,
            totalOrders: updatedMockOrders.length,
            storedString: localStorage.getItem('mock_orders')
          });

          setOrders(prev => [newOrder, ...prev]);
          resolve(newOrder);
        }, 1000);
      });
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: orderData.total_amount,
          shipping_address: orderData.shipping_address,
          items: orderData.items,
          estimated_delivery: orderData.estimated_delivery,
          order_number: '', // Will be auto-generated by trigger
        })
        .select()
        .single();

      if (error) throw error;

      const typedOrder: Order = {
        ...data,
        status: data.status as OrderStatus,
        shipping_address: data.shipping_address as Order['shipping_address'],
        items: data.items as Order['items'],
      };

      setOrders(prev => [typedOrder, ...prev]);
      return typedOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order');
      return null;
    }
  };

  // Set up realtime subscription for order updates
  useEffect(() => {
    if (!user) return;

    // Fetch orders immediately
    fetchOrders();

    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const updatedOrder = payload.new as Order;
          setOrders(prev =>
            prev.map(order =>
              order.id === updatedOrder.id
                ? {
                  ...updatedOrder,
                  status: updatedOrder.status as OrderStatus,
                  shipping_address: updatedOrder.shipping_address as Order['shipping_address'],
                  items: updatedOrder.items as Order['items'],
                }
                : order
            )
          );
          toast.info(`Order ${updatedOrder.order_number} status updated to ${updatedOrder.status.replace('_', ' ')}`);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const cancelOrder = async (orderId: string) => {
    if (!user) {
      toast.error('Please login to cancel an order');
      return false;
    }

    const isMockMode = !!localStorage.getItem('mock_session');

    if (isMockMode) {
      return new Promise<boolean>((resolve) => {
        setTimeout(() => {
          const currentMockOrders: Order[] = JSON.parse(localStorage.getItem('mock_orders') || '[]');
          const updatedMockOrders = currentMockOrders.map(o =>
            o.id === orderId
              ? { ...o, status: 'cancelled' as OrderStatus, updated_at: new Date().toISOString() }
              : o
          );
          localStorage.setItem('mock_orders', JSON.stringify(updatedMockOrders));

          // Manually update local state
          setOrders(prev => prev.map(o =>
            o.id === orderId
              ? { ...o, status: 'cancelled' as OrderStatus, updated_at: new Date().toISOString() }
              : o
          ));

          toast.success('Order cancelled successfully (Mock)');
          resolve(true);
        }, 500);
      });
    }

    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Manually update local state for immediate UI feedback
      setOrders(prev => prev.map(o =>
        o.id === orderId
          ? { ...o, status: 'cancelled' as OrderStatus, updated_at: new Date().toISOString() }
          : o
      ));

      toast.success('Order cancelled successfully');
      return true;
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Failed to cancel order');
      return false;
    }
  };

  return { orders, loading, fetchOrders, createOrder, cancelOrder };
};
