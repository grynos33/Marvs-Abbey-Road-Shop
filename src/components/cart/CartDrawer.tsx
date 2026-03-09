import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Disc, Plus, Minus, Trash2 } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { formatPHP } from '../../lib/formatCurrency';

export const CartDrawer = () => {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-[80] h-full w-full max-w-md bg-brand-beige shadow-2xl p-8 flex flex-col"
          >
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-display font-bold">YOUR CRATE</h2>
              <button onClick={closeCart} aria-label="Close cart" className="p-2 hover:bg-black/5 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-32 h-32 bg-zinc-100 rounded-full flex items-center justify-center relative shadow-inner">
                  <Disc className="w-16 h-16 text-zinc-300 absolute" />
                  <div className="w-4 h-4 bg-brand-beige rounded-full z-10 border border-zinc-200"></div>
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold">Your crate is empty</h3>
                  <p className="text-zinc-500 mt-2 text-sm max-w-[250px] mx-auto">Looks like you haven't added any vinyl records yet.</p>
                </div>
                <button
                  onClick={closeCart}
                  aria-label="Continue shopping"
                  className="btn-luxury btn-luxury-filled"
                >
                  START DIGGING
                </button>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-white rounded-2xl p-4 shadow-sm">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      decoding="async"
                      className="w-20 h-20 object-cover rounded-xl"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display font-bold text-sm truncate">{item.name}</h4>
                      <p className="text-sm font-display font-bold text-brand-accent-orange mt-1">
                        {formatPHP(item.price)}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label={`Decrease quantity for ${item.name}`}
                          className="w-7 h-7 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-100 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-display font-bold w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label={`Increase quantity for ${item.name}`}
                          className="w-7 h-7 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-100 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name} from cart`}
                          className="ml-auto p-1.5 text-zinc-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-auto pt-8 border-t border-black/5">
              <div className="flex justify-between text-xl font-display font-bold mb-6">
                <span>Subtotal</span>
                <span>{formatPHP(totalPrice())}</span>
              </div>
              {items.length === 0 ? (
                <button
                  disabled
                  className="w-full py-4 bg-zinc-900 text-white rounded-full font-display font-bold opacity-50 cursor-not-allowed"
                >
                  CHECKOUT
                </button>
              ) : (
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="block w-full py-4 bg-zinc-900 text-white rounded-full font-display font-bold text-center hover:bg-zinc-800 shadow-lg hover:shadow-xl transition-all"
                >
                  CHECKOUT
                </Link>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
