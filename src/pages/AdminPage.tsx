import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LogOut, Package, ShoppingCart, Loader2, LayoutDashboard, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Dashboard } from '../components/admin/Dashboard';
import { ProductTable } from '../components/admin/ProductTable';
import { OrderTable } from '../components/admin/OrderTable';
import { UserTable } from '../components/admin/UserTable';
import { useDocumentHead } from '../hooks/useDocumentHead';
import type { Session } from '@supabase/supabase-js';

type Tab = 'dashboard' | 'products' | 'orders' | 'users';

export const AdminPage = () => {
  useDocumentHead('Admin');
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'manager' | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) fetchRole(data.session.user.id);
      else setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchRole(session.user.id);
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchRole = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();
    console.log('[AdminPage] fetchRole:', { userId, data, error });
    setUserRole((data as { role: 'admin' | 'manager' } | null)?.role || null);
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoginError(error.message);
    }
    setLoginLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUserRole(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (!session) {
    return (
      <section className="py-24 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-auto px-6"
        >
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-display font-medium mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-brand-accent-orange transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-display font-medium mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-brand-accent-orange transition-colors"
              />
            </div>
            {loginError && (
              <p className="text-red-500 text-sm">{loginError}</p>
            )}
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-4 bg-zinc-900 text-white rounded-full font-display font-bold hover:bg-zinc-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loginLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'SIGN IN'}
            </button>
          </form>
        </motion.div>
      </section>
    );
  }

  const isAdmin = userRole === 'admin';

  const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard; adminOnly?: boolean }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'users', label: 'Users', icon: Users, adminOnly: true },
  ];

  const visibleTabs = tabs.filter(t => !t.adminOnly || isAdmin);

  return (
    <section className="py-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-display font-bold tracking-tighter">ADMIN DASHBOARD</h1>
            {userRole && (
              <p className="text-sm text-zinc-500 mt-1">
                Logged in as <span className={`font-display font-bold capitalize ${isAdmin ? 'text-amber-600' : 'text-blue-600'}`}>{userRole}</span>
              </p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-display font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-display font-medium text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-zinc-900 text-white shadow-lg'
                  : 'bg-white border border-zinc-200 hover:border-zinc-400'
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'products' && <ProductTable />}
        {activeTab === 'orders' && <OrderTable />}
        {activeTab === 'users' && isAdmin && <UserTable />}
      </div>
    </section>
  );
};
