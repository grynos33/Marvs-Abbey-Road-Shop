import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Link, useSearchParams } from 'react-router-dom';
import { Loader2, X } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { PRODUCTS, mapSupabaseProduct } from '../types';
import type { Product } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { useDocumentHead } from '../hooks/useDocumentHead';

const slugify = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const CATEGORIES = [
  { label: 'All', slug: '' },
  { label: 'New Arrivals', slug: 'new-arrivals' },
  { label: 'Rare Vinyls', slug: 'rare-vinyls' },
  { label: 'Rare Finds', slug: 'rare-finds' },
  { label: 'Classic Rock', slug: 'classic-rock' },
  { label: 'Jazz', slug: 'jazz' },
  { label: 'OPM', slug: 'opm' },
];

export const ShopPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTag = searchParams.get('tag') || '';
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      if (!isSupabaseConfigured) {
        setProducts(PRODUCTS);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('products')
        .select('id, name, description, price, image_url, category, tags, color, stock, is_active, is_featured')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error || !data) {
        console.error('Failed to fetch products:', error);
        setProducts(PRODUCTS);
      } else {
        setProducts(data.map((row: Record<string, unknown>) => mapSupabaseProduct(row)));
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    let result = products;
    if (activeTag) {
      result = result.filter(p =>
        p.tags.some(t => slugify(t) === activeTag)
      );
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [products, activeTag, searchQuery]);

  const activeLabel = CATEGORIES.find(c => c.slug === activeTag)?.label || activeTag.replace(/-/g, ' ');

  useDocumentHead(
    searchQuery ? `Search: ${searchQuery}` : activeTag ? `${activeLabel} Vinyl Records` : 'Shop Vinyl Records',
    'Browse our curated collection of rare and classic vinyl records.'
  );

  const clearFilter = () => setSearchParams({});
  const setFilter = (slug: string) => {
    if (slug) setSearchParams({ tag: slug });
    else setSearchParams({});
  };

  return (
    <section className="py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <span className="text-brand-accent-orange font-display font-bold uppercase tracking-widest text-sm">Browse</span>
          <h1 className="text-5xl md:text-6xl font-display font-bold mt-4 tracking-tighter">
            {searchQuery ? `RESULTS FOR "${searchQuery.toUpperCase()}"` : activeTag ? activeLabel.toUpperCase() : 'THE COLLECTION'}
          </h1>
        </div>

        {/* Category Chips */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat.slug}
              onClick={() => setFilter(cat.slug)}
              className={`px-4 py-2 rounded-full text-sm font-display font-bold transition-all ${
                (cat.slug === '' ? !activeTag : activeTag === cat.slug)
                  ? 'bg-zinc-900 text-white'
                  : 'bg-white border border-zinc-200 hover:border-zinc-400'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Badge */}
        {searchQuery && (
          <div className="mb-6 flex items-center gap-2">
            <span className="text-sm text-zinc-500">Search:</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 text-zinc-700 rounded-full text-sm font-display font-bold">
              "{searchQuery}"
              <button onClick={() => { const p = new URLSearchParams(searchParams); p.delete('search'); setSearchParams(p); }} className="hover:bg-zinc-200 rounded-full p-0.5">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          </div>
        )}

        {/* Active Filter Badge */}
        {activeTag && (
          <div className="mb-6 flex items-center gap-2">
            <span className="text-sm text-zinc-500">Showing products tagged:</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-accent-orange/10 text-brand-accent-orange rounded-full text-sm font-display font-bold capitalize">
              {activeLabel}
              <button onClick={clearFilter} className="hover:bg-brand-accent-orange/20 rounded-full p-0.5">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link to={`/product/${product.id}`}>
                    <ProductCard product={product} />
                  </Link>
                </motion.div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-24">
                <p className="text-2xl font-display font-bold text-zinc-400">
                  {searchQuery ? `No results for "${searchQuery}"` : activeTag ? `No products tagged "${activeLabel}"` : 'No vinyl records available yet.'}
                </p>
                {activeTag && (
                  <button onClick={clearFilter} className="mt-4 text-brand-accent-orange font-display font-bold hover:underline">
                    View all products
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
