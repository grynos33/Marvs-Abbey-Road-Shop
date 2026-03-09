import { useState, useEffect, useMemo } from 'react';
import { Loader2, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { formatPHP } from '../../lib/formatCurrency';
import type { Order } from '../../types/database';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  paid: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-zinc-100 text-zinc-700',
};

export const OrderTable = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select('id, customer_name, customer_email, customer_phone, shipping_address, shipping_city, shipping_province, shipping_zip, shipping_region, items, subtotal, shipping_fee, total, payment_status, order_status, created_at')
      .order('created_at', { ascending: false });
    setOrders((data as Order[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch = !search ||
        o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        o.customer_email.toLowerCase().includes(search.toLowerCase());
      const matchesOrderStatus = orderStatusFilter === 'all' || o.order_status === orderStatusFilter;
      const matchesPaymentStatus = paymentStatusFilter === 'all' || o.payment_status === paymentStatusFilter;
      return matchesSearch && matchesOrderStatus && matchesPaymentStatus;
    });
  }, [orders, search, orderStatusFilter, paymentStatusFilter]);

  const handleStatusChange = async (orderId: string, status: string) => {
    await supabase.from('orders').update({ order_status: status as Order['order_status'] }).eq('id', orderId);
    fetchOrders();
  };

  const handlePaymentStatusChange = async (orderId: string, status: string) => {
    await supabase.from('orders').update({ payment_status: status as Order['payment_status'] }).eq('id', orderId);
    fetchOrders();
  };

  return (
    <div>
      <h2 className="text-2xl font-display font-bold mb-6">Orders ({filtered.length})</h2>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:border-brand-accent-orange transition-colors text-sm"
          />
        </div>
        <select
          value={orderStatusFilter}
          onChange={(e) => setOrderStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-zinc-200 text-sm bg-white"
        >
          <option value="all">All Order Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          value={paymentStatusFilter}
          onChange={(e) => setPaymentStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-zinc-200 text-sm bg-white"
        >
          <option value="all">All Payment Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-zinc-400">
          <p className="text-lg font-display font-bold">{search || orderStatusFilter !== 'all' || paymentStatusFilter !== 'all' ? 'No matching orders' : 'No orders yet'}</p>
          <p className="text-sm mt-2">{search ? 'Try a different search.' : 'Orders will appear here once customers start buying.'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <button
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-zinc-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-display font-bold text-sm">
                      {order.customer_name}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-display font-bold ${STATUS_COLORS[order.order_status] ?? 'bg-zinc-100 text-zinc-600'}`}>
                      {order.order_status}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-display font-bold ${STATUS_COLORS[order.payment_status] ?? 'bg-zinc-100 text-zinc-600'}`}>
                      {order.payment_status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    {new Date(order.created_at).toLocaleDateString('en-PH', {
                      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                <span className="font-display font-bold">{formatPHP(order.total)}</span>
              </button>

              {expandedOrder === order.id && (
                <div className="px-4 pb-4 border-t border-zinc-100 pt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-zinc-500">Email</p>
                      <p className="font-medium">{order.customer_email}</p>
                    </div>
                    <div>
                      <p className="text-zinc-500">Phone</p>
                      <p className="font-medium">{order.customer_phone}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-zinc-500">Shipping Address</p>
                      <p className="font-medium">
                        {order.shipping_address}, {order.shipping_city}, {order.shipping_province} {order.shipping_zip}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-zinc-500 mb-2">Items</p>
                    <div className="space-y-2">
                      {(order.items as Array<{ name: string; quantity: number; price: number }>).map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span>{item.name} x{item.quantity}</span>
                          <span className="font-display font-bold">{formatPHP(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-display font-medium">Order:</label>
                      <select
                        value={order.order_status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-zinc-200 text-sm bg-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-display font-medium">Payment:</label>
                      <select
                        value={order.payment_status}
                        onChange={(e) => handlePaymentStatusChange(order.id, e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-zinc-200 text-sm bg-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
