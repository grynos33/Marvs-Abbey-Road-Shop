import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowLeft, Disc, Loader2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { PRODUCTS, mapSupabaseProduct } from '../types';
import type { Product } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { useCartStore } from '../stores/cartStore';
import { formatPHP } from '../lib/formatCurrency';
import { useDocumentHead } from '../hooks/useDocumentHead';

export const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const addItem = useCartStore((state) => state.addItem);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useDocumentHead(
    product ? product.name : 'Product',
    product?.description
  );

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setNotFound(false);

      if (!isSupabaseConfigured) {
        const found = PRODUCTS.find(p => p.id === id);
        setProduct(found || null);
        setNotFound(!found);
        setRelatedProducts(PRODUCTS.filter(p => p.id !== id).slice(0, 4));
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .select('id, name, description, price, image_url, category, tags, color, stock, is_active, is_featured')
        .eq('id', id!)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setProduct(mapSupabaseProduct(data as Record<string, unknown>));

      // Fetch related products
      const { data: related } = await supabase
        .from('products')
        .select('id, name, description, price, image_url, category, tags, color, stock, is_active, is_featured')
        .eq('is_active', true)
        .neq('id', id!)
        .limit(4);

      if (related) {
        setRelatedProducts(related.map((row: Record<string, unknown>) => mapSupabaseProduct(row)));
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-display font-bold">Product not found</h1>
          <Link to="/shop" className="btn-luxury btn-luxury-outline inline-flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" /> Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back Link */}
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-display font-medium text-zinc-500 hover:text-zinc-900 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Collection
        </Link>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="aspect-square rounded-[3rem] overflow-hidden bg-zinc-100 shadow-xl">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                decoding="async"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute top-6 left-6">
              <Disc className="w-10 h-10 bg-black/80 text-white rounded-full p-2 border border-white/20 shadow-lg" />
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <span className="text-brand-accent-orange font-display font-bold uppercase tracking-widest text-sm">
                {product.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-display font-bold mt-3 tracking-tighter">
                {product.name}
              </h1>
            </div>

            <p className="text-xl font-display font-bold">{formatPHP(product.price)}</p>

            {/* Stock status display */}
            <div className="mt-2">
              {product.stock <= 0 ? (
                <span className="text-red-500 font-bold bg-red-50 px-3 py-1 rounded-full text-sm">Out of Stock</span>
              ) : product.stock <= 3 ? (
                <span className="text-orange-500 font-bold bg-orange-50 px-3 py-1 rounded-full text-sm">Only {product.stock} left in stock</span>
              ) : (
                <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full text-sm">In Stock</span>
              )}
            </div>

            <p className="text-lg text-zinc-600 leading-relaxed">
              {product.description}
            </p>

            <div className="flex gap-2 flex-wrap">
              {product.tags.map(tag => (
                <span key={tag} className="px-4 py-1.5 bg-zinc-100 text-xs font-display font-bold uppercase rounded-full text-zinc-700">
                  {tag}
                </span>
              ))}
            </div>

            <button
              onClick={() => addItem({ id: product.id, name: product.name, price: product.price, image: product.image, stock: product.stock })}
              disabled={product.stock <= 0}
              className={`btn-luxury flex items-center justify-center gap-3 text-lg shadow-lg ${product.stock <= 0 ? 'opacity-50 cursor-not-allowed bg-zinc-400 text-white border-0' : 'btn-luxury-filled'}`}
            >
              <ShoppingBag className="w-5 h-5" />
              {product.stock <= 0 ? 'OUT OF STOCK' : 'ADD TO CRATE'}
            </button>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24">
            <h2 className="text-3xl font-display font-bold tracking-tighter mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map(p => (
                <Link key={p.id} to={`/product/${p.id}`}>
                  <ProductCard product={p} />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
