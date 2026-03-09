import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { PRODUCTS, mapSupabaseProduct } from '../../types';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { ProductCard } from '../product/ProductCard';
import type { Product } from '../../types';

export const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      if (!isSupabaseConfigured) {
        setProducts(PRODUCTS);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('products')
        .select('id, name, description, price, image_url, category, tags, color, stock, is_active, is_featured')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('updated_at', { ascending: false });

      if (error || !data) {
        setProducts(PRODUCTS);
      } else {
        setProducts(data.map((row: Record<string, unknown>) => mapSupabaseProduct(row)));
      }
      setLoading(false);
    };
    fetchFeatured();
  }, []);

  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-8 mb-16 text-center md:text-left">
        <div className="max-w-2xl">
          <span className="text-brand-accent-orange font-display font-bold uppercase tracking-widest text-sm">Staff Picks</span>
          <h2 className="text-5xl md:text-6xl font-display font-bold mt-4 tracking-tighter">
            LEGENDARY <br className="hidden md:block" /> Additions
          </h2>
        </div>
        <Link to="/shop" className="btn-luxury btn-luxury-outline flex items-center gap-2">
          VIEW FULL CATALOG <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <ProductCard product={product} />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};
