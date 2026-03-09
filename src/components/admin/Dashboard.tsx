import { useState, useEffect } from 'react';
import { Package, ShoppingCart, DollarSign, Clock, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { formatPHP } from '../../lib/formatCurrency';

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

interface RecentOrder {
  id: string;
  customer_name: string;
  total: number;
  order_status: string;
  payment_status: string;
  created_at: string;
}

interface PaidOrderRow {
  total: number;
}

export const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({ totalProducts: 0, totalOrders: 0, totalRevenue: 0, pendingOrders: 0 });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [productsRes, ordersRes, paidRes, pendingRes, recentRes] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('orders').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('total').eq('payment_status', 'paid'),
        supabase.from('orders').select('id', { count: 'exact', head: true }).eq('order_status', 'pending'),
        supabase.from('orders').select('id, customer_name, total, order_status, payment_status, created_at').order('created_at', { ascending: false }).limit(5),
      ]);

      const hasError = [productsRes, ordersRes, paidRes, pendingRes, recentRes].some(r => r.error);
      if (hasError) {
        console.error('Dashboard fetch error', { productsRes, ordersRes, paidRes, pendingRes, recentRes });
      }

      const paidRows = (paidRes.data || []) as PaidOrderRow[];
      const revenue = paidRows.reduce((sum, o) => sum + Number(o.total || 0), 0);

      setStats({
        totalProducts: productsRes.count || 0,
        totalOrders: ordersRes.count || 0,
        totalRevenue: revenue,
        pendingOrders: pendingRes.count || 0,
      });

      setRecentOrders((recentRes.data || []) as RecentOrder[]);
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  const statCards = [
    { label: 'Active Products', value: stats.totalProducts, icon: Package, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-green-50 text-green-600' },
    { label: 'Revenue (Paid)', value: formatPHP(stats.totalRevenue), icon: DollarSign, color: 'bg-amber-50 text-amber-600' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: Clock, color: 'bg-red-50 text-red-600' },
  ];

  const statusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-700',
      confirmed: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      paid: 'bg-green-100 text-green-700',
      failed: 'bg-red-100 text-red-700',
      refunded: 'bg-zinc-100 text-zinc-700',
    };
    return colors[status] || 'bg-zinc-100 text-zinc-700';
  };

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">{card.label}</p>
                <p className="text-2xl font-display font-bold">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-display font-bold mb-4">Recent Orders</h3>
        {recentOrders.length === 0 ? (
          <p className="text-zinc-400 text-sm py-4">No orders yet.</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b border-zinc-50 last:border-0">
                <div>
                  <p className="font-display font-medium">{order.customer_name}</p>
                  <p className="text-xs text-zinc-400">{new Date(order.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-display font-bold px-2.5 py-1 rounded-full ${statusColor(order.order_status)}`}>
                    {order.order_status}
                  </span>
                  <span className={`text-xs font-display font-bold px-2.5 py-1 rounded-full ${statusColor(order.payment_status)}`}>
                    {order.payment_status}
                  </span>
                  <span className="font-display font-bold text-sm">{formatPHP(Number(order.total))}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
