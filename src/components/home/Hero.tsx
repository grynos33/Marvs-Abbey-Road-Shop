import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { PRODUCTS, mapSupabaseProduct } from '../../types';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import type { Product } from '../../types';

export const Hero = () => {
  const [activeProduct, setActiveProduct] = useState(0);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const fetchFeatured = async () => {
      const { data } = await supabase
        .from('products')
        .select('id, name, description, price, image_url, category, tags, color, stock, is_active, is_featured')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('updated_at', { ascending: false });
      if (data && data.length > 0) {
        setProducts(data.map((row: Record<string, unknown>) => mapSupabaseProduct(row)));
        setActiveProduct(0);
      }
    };
    fetchFeatured();
  }, []);

  const nextProduct = () => setActiveProduct((prev) => (prev + 1) % products.length);
  const prevProduct = () => setActiveProduct((prev) => (prev - 1 + products.length) % products.length);

  const rainbowColors = ['text-brand-accent-orange', 'text-brand-accent-blue', 'text-brand-accent-pink', 'text-brand-tea'];

  return (
    <section className="relative h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-12">
      {/* Background Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none overflow-hidden">
        <motion.h1
          key={activeProduct}
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="text-[15vw] font-display font-bold tracking-tighter leading-none text-center flex flex-col"
        >
          <div className="flex justify-center flex-wrap max-w-[80vw]">
            {products[activeProduct].name.split(' ')[0].split('').map((char, i) => (
              <span key={i} className={`${rainbowColors[i % rainbowColors.length]} opacity-10`}>
                {char}
              </span>
            ))}
          </div>
          <span className="text-black/5">VINTAGE</span>
        </motion.h1>
      </div>

      {/* Product Display */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProduct}
            initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotate: 90 }}
            transition={{ type: 'spring', damping: 20 }}
            className="relative w-80 h-80 md:w-[450px] md:h-[450px] perspective-1000 z-20"
          >
            <div className="w-full h-full relative animate-float">
              {/* Spinning Disc with overflow-hidden */}
              <div
                className="absolute inset-0 rounded-full shadow-2xl overflow-hidden border-[12px] border-zinc-900 flex items-center justify-center ring-4 ring-zinc-800/50"
                style={{ backgroundColor: products[activeProduct].color }}
              >
                <img
                  src={products[activeProduct].image}
                  alt={products[activeProduct].name}
                  className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50 animate-[spin_20s_linear_infinite]"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />

                {/* Inner Vinyl Grooves */}
                <div className="absolute inset-2 rounded-full border border-white/10 pointer-events-none"></div>
                <div className="absolute inset-6 rounded-full border border-white/5 pointer-events-none"></div>
                <div className="absolute inset-12 rounded-full border border-white/10 pointer-events-none"></div>
                <div className="absolute inset-16 rounded-full border border-white/5 pointer-events-none"></div>

                {/* Center hole and record label */}
                <div className="absolute w-[120px] h-[120px] md:w-[160px] md:h-[160px] rounded-full flex flex-col items-center justify-center shadow-2xl z-10 animate-[spin_20s_linear_infinite]" style={{ backgroundColor: products[activeProduct].color }}>
                  {/* Center spindle hole */}
                  <div className="w-5 h-5 bg-brand-beige rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 shadow-inner border border-black/50"></div>

                  <div className="absolute inset-2 rounded-full border border-black/20"></div>
                  <div className="absolute inset-8 rounded-full border border-black/10"></div>
                </div>
              </div>

              {/* Text overlays */}
              <div className="absolute inset-0 text-white pointer-events-none z-30">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-6 md:translate-y-10 bg-black/85 backdrop-blur-xl p-5 md:p-6 rounded-3xl text-center border border-white/20 shadow-2xl drop-shadow-2xl w-[110%] md:w-[120%] max-w-[500px]">
                  <h2 className="text-xl md:text-3xl font-display font-bold leading-tight drop-shadow-lg">{products[activeProduct].name}</h2>
                  <p className="text-xs md:text-sm opacity-90 mt-2 drop-shadow-md line-clamp-2 px-2">{products[activeProduct].description}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="mt-20 md:mt-24 flex items-center gap-8 relative z-20">
          <button onClick={prevProduct} className="p-4 rounded-full border-2 border-zinc-900 hover:bg-zinc-900 hover:text-white transition-all active:scale-90 bg-white/50 backdrop-blur-sm">
            <ArrowRight className="w-6 h-6 rotate-180" />
          </button>
          <div className="flex gap-2">
            {products.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveProduct(i)}
                className={`w-3 h-3 rounded-full transition-all ${activeProduct === i ? 'bg-zinc-900 w-8' : 'bg-zinc-300'}`}
              />
            ))}
          </div>
          <button onClick={nextProduct} className="p-4 rounded-full border-2 border-zinc-900 hover:bg-zinc-900 hover:text-white transition-all active:scale-90 bg-white/50 backdrop-blur-sm">
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute bottom-10 left-10 hidden xl:block">
        <div className="flex flex-col gap-1">
          {['Rare Pressings', 'Mint Condition', 'Certified Authentic'].map((text, i) => (
            <motion.span
              key={text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="text-xs font-display font-bold uppercase tracking-widest text-zinc-400"
            >
              &bull; {text}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
};
