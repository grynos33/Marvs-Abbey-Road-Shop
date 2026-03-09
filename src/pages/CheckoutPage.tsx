import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { formatPHP } from '../lib/formatCurrency';
import { REGIONS, getShippingFee } from '../lib/shipping';
import { toast } from 'sonner';
import { useDocumentHead } from '../hooks/useDocumentHead';

export const CheckoutPage = () => {
  useDocumentHead('Checkout');
  const { items, totalPrice } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    zip: '',
    region: 'Metro Manila',
  });

  const shippingFee = getShippingFee(formData.region);
  const subtotal = totalPrice();
  const total = subtotal + shippingFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/create-paymongo-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          },
          shipping: {
            address: formData.address,
            city: formData.city,
            province: formData.province,
            zip: formData.zip,
            region: formData.region,
          },
          items: items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const payload = await response.json();
      if (!response.ok || !payload?.checkout_url) {
        const message = payload?.error || 'Failed to create PayMongo checkout session.';
        throw new Error(message);
      }

      toast.success('Redirecting to secure payment...');
      window.location.href = payload.checkout_url as string;
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error(err instanceof Error ? err.message : 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-display font-bold">Your cart is empty</h1>
          <Link to="/shop" className="btn-luxury btn-luxury-outline inline-flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" /> Browse Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 min-h-screen">
      <div className="max-w-5xl mx-auto px-6">
        <Link to="/cart" className="inline-flex items-center gap-2 text-sm font-display font-medium text-zinc-500 hover:text-zinc-900 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>

        <h1 className="text-5xl font-display font-bold tracking-tighter mb-12">CHECKOUT</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Shipping Form */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-display font-bold">Shipping Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-display font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-brand-accent-orange transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-display font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-brand-accent-orange transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-display font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+63"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-brand-accent-orange transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-display font-medium mb-2">Street Address</label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-brand-accent-orange transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-display font-medium mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-brand-accent-orange transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-display font-medium mb-2">Province</label>
                <input
                  type="text"
                  name="province"
                  required
                  value={formData.province}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-brand-accent-orange transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-display font-medium mb-2">ZIP Code</label>
                <input
                  type="text"
                  name="zip"
                  required
                  value={formData.zip}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-brand-accent-orange transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-display font-medium mb-2">Region</label>
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-brand-accent-orange transition-colors bg-white"
                >
                  {REGIONS.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-8 shadow-sm h-fit sticky top-28">
            <h2 className="text-2xl font-display font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-zinc-600">{item.name} x{item.quantity}</span>
                  <span className="font-display font-bold">{formatPHP(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-zinc-100 space-y-3">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span className="font-display font-bold">{formatPHP(subtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Shipping ({formData.region})</span>
                <span className="font-display font-bold">{formatPHP(shippingFee)}</span>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-zinc-100 flex justify-between text-xl font-display font-bold mb-8">
              <span>Total</span>
              <span>{formatPHP(total)}</span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-zinc-900 text-white rounded-full font-display font-bold hover:bg-zinc-800 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> PROCESSING...
                </>
              ) : (
                'PAY NOW'
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
