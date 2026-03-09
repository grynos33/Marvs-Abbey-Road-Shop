import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle, Loader2, Package, MapPin } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { supabase } from '../lib/supabase';
import type { OrderItem } from '../types/database';
import { formatPHP } from '../lib/formatCurrency';
import { useDocumentHead } from '../hooks/useDocumentHead';

interface OrderSummary {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_province: string;
  shipping_zip: string;
  shipping_region: string;
  items: OrderItem[];
  subtotal: number;
  shipping_fee: number;
  total: number;
}

export const OrderSuccessPage = () => {
  useDocumentHead('Order Confirmed');
  const clearCart = useCartStore((state) => state.clearCart);
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('id, customer_name, customer_email, customer_phone, shipping_address, shipping_city, shipping_province, shipping_zip, shipping_region, items, subtotal, shipping_fee, total')
          .eq('id', orderId)
          .single();

        if (error) throw error;
        setOrder(data);
      } catch (err) {
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <section className="py-24 min-h-screen flex items-center justify-center bg-zinc-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full mx-auto px-6 space-y-8"
      >
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-display font-bold tracking-tighter">Order Confirmed!</h1>
          <p className="text-zinc-600 leading-relaxed max-w-lg mx-auto">
            Thank you for your purchase. We'll send you a confirmation email with your order details and tracking information.
          </p>
          {orderId && <p className="text-sm font-medium text-zinc-500 bg-zinc-200 py-1 px-4 rounded-full inline-block">Order #{orderId.substring(0, 8).toUpperCase()}</p>}
        </div>

        {order ? (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-brand-accent-orange" /> Order Summary
                </h3>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        className="w-16 h-16 rounded-xl object-cover bg-zinc-100"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="font-display font-bold">{item.name}</p>
                        <p className="text-sm text-zinc-500">Qty: {item.quantity}</p>
                        <p className="text-brand-accent-orange font-bold text-sm mt-1">{formatPHP(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-zinc-100 space-y-2">
                  <div className="flex justify-between text-sm text-zinc-600">
                    <span>Subtotal</span>
                    <span>{formatPHP(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-zinc-600">
                    <span>Shipping</span>
                    <span>{formatPHP(order.shipping_fee)}</span>
                  </div>
                  <div className="flex justify-between font-display font-bold text-lg pt-2">
                    <span>Total</span>
                    <span>{formatPHP(order.total)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-brand-accent-orange" /> Shipping Details
                </h3>
                <div className="bg-zinc-50 rounded-2xl p-6 text-sm text-zinc-700 leading-relaxed border border-zinc-100">
                  <p className="font-bold text-zinc-900 mb-2">{order.customer_name}</p>
                  <p>{order.shipping_address}</p>
                  <p>{order.shipping_city}, {order.shipping_province}</p>
                  <p>{order.shipping_zip}</p>
                  <p>{order.shipping_region}</p>
                  <div className="mt-4 pt-4 border-t border-zinc-200">
                    <p>{order.customer_email}</p>
                    <p>{order.customer_phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="text-center pt-8">
          <Link
            to="/shop"
            className="btn-luxury btn-luxury-filled inline-block"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      </motion.div>
    </section>
  );
};
