import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Disc, Plus, Minus, Trash2 } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { formatPHP } from '../lib/formatCurrency';
import { useDocumentHead } from '../hooks/useDocumentHead';

export const CartPage = () => {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
  useDocumentHead('Your Crate');

  return (
    <section className="py-16 min-h-screen">
      <div className="max-w-5xl mx-auto px-6">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-display font-medium text-zinc-500 hover:text-zinc-900 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>

        <h1 className="text-5xl font-display font-bold tracking-tighter mb-12">YOUR CRATE</h1>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 space-y-6"
          >
            <div className="w-32 h-32 bg-zinc-100 rounded-full flex items-center justify-center relative shadow-inner mx-auto">
              <Disc className="w-16 h-16 text-zinc-300 absolute" />
              <div className="w-4 h-4 bg-brand-beige rounded-full z-10 border border-zinc-200"></div>
            </div>
            <h3 className="text-xl font-display font-bold">Your crate is empty</h3>
            <p className="text-zinc-500 text-sm max-w-[250px] mx-auto">
              Looks like you haven't added any vinyl records yet.
            </p>
            <Link to="/shop" className="btn-luxury btn-luxury-filled inline-block">
              START DIGGING
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex gap-6 bg-white rounded-2xl p-6 shadow-sm"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    decoding="async"
                    className="w-24 h-24 object-cover rounded-xl"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-lg">{item.name}</h3>
                    <p className="text-brand-accent-orange font-display font-bold mt-1">
                      {formatPHP(item.price)}
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-100 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-display font-bold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-100 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto p-2 text-zinc-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-display font-bold text-lg">
                      {formatPHP(item.price * item.quantity)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl p-8 shadow-sm h-fit sticky top-28">
              <h2 className="text-2xl font-display font-bold mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal</span>
                  <span className="font-display font-bold">{formatPHP(totalPrice())}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Shipping</span>
                  <span className="text-sm text-zinc-400">Calculated at checkout</span>
                </div>
              </div>
              <div className="pt-4 border-t border-zinc-100 flex justify-between text-xl font-display font-bold mb-8">
                <span>Total</span>
                <span>{formatPHP(totalPrice())}</span>
              </div>
              <Link
                to="/checkout"
                className="block w-full py-4 bg-zinc-900 text-white rounded-full font-display font-bold text-center hover:bg-zinc-800 shadow-lg hover:shadow-xl transition-all"
              >
                CHECKOUT
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
