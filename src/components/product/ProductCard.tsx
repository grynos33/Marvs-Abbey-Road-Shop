import { motion } from 'motion/react';
import { ShoppingBag } from 'lucide-react';
import type { Product } from '../../types';
import { useCartStore } from '../../stores/cartStore';
import { formatPHP } from '../../lib/formatCurrency';

export const ProductCard = ({ product }: { product: Product }) => {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <motion.div
      whileHover={{ y: -10 }}
      style={product.color ? { backgroundColor: product.color } : undefined}
      className={`group relative rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all duration-500 ${product.color ? 'text-white' : 'bg-white'}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-6 bg-black/10">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={(e) => { e.preventDefault(); addItem({ id: product.id, name: product.name, price: product.price, image: product.image, stock: product.stock }); }}
            className="w-10 h-10 bg-white text-zinc-900 rounded-full flex items-center justify-center shadow-md hover:bg-brand-accent-orange hover:text-white transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
        <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap z-10">
          {product.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-display font-bold uppercase rounded-full shadow-sm text-zinc-800">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h3 className={`text-xl font-display font-bold group-hover:text-brand-accent-orange transition-colors ${product.color ? 'text-white' : ''}`}>{product.name}</h3>
          <span className={`font-display font-bold ${product.color ? 'text-white/90' : ''}`}>{formatPHP(product.price)}</span>
        </div>
        <p className={`text-sm line-clamp-2 ${product.color ? 'text-white/70' : 'text-zinc-500'}`}>{product.description}</p>
      </div>
    </motion.div>
  );
};
