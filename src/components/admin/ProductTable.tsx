import { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Pencil, Trash2, Loader2, Search, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { formatPHP } from '../../lib/formatCurrency';
import { getStoragePathFromPublicUrl } from '../../lib/storage';
import { ProductForm } from './ProductForm';
import type { Product } from '../../types/database';

export const ProductTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'hidden'>('all');

  const fetchProducts = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('id, name, description, price, image_url, category, tags, color, stock, is_active, is_featured, created_at, updated_at')
      .order('created_at', { ascending: false });
    setProducts((data as Product[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchProducts(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? p.is_active : !p.is_active);
      return matchesSearch && matchesStatus;
    });
  }, [products, search, statusFilter]);

  const handleDelete = async (product: Product) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const imagePath = getStoragePathFromPublicUrl('product-images', product.image_url);
    if (imagePath) {
      await supabase.storage.from('product-images').remove([imagePath]);
    }
    await supabase.from('products').delete().eq('id', product.id);
    fetchProducts();
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await supabase.from('products').update({ is_active: !isActive }).eq('id', id);
    fetchProducts();
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
    fetchProducts();
  };

  if (showForm || editingProduct) {
    return (
      <ProductForm
        product={editingProduct}
        onClose={handleFormClose}
      />
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-display font-bold">Products ({filtered.length})</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-brand-accent-orange text-white rounded-full font-display font-medium text-sm hover:bg-[#A67525] transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:border-brand-accent-orange transition-colors text-sm"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'hidden'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-full text-xs font-display font-bold capitalize transition-all ${
                statusFilter === s ? 'bg-zinc-900 text-white' : 'bg-white border border-zinc-200 hover:border-zinc-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-zinc-400">
          <p className="text-lg font-display font-bold">{search ? 'No matching products' : 'No products yet'}</p>
          <p className="text-sm mt-2">{search ? 'Try a different search term.' : 'Add your first product to get started.'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((product) => (
            <div key={product.id} className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm">
              <img
                src={product.image_url}
                alt={product.name}
                loading="lazy"
                decoding="async"
                className="w-16 h-16 object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
              <div
                className="w-8 h-8 rounded-lg border border-zinc-200 shrink-0"
                style={{ backgroundColor: product.color || '#2C1A1D' }}
                title={product.color || '#2C1A1D'}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold truncate flex items-center gap-1.5">
                  {product.name}
                  {product.is_featured && <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />}
                </h3>
                <div className="flex items-center gap-3 text-sm text-zinc-500">
                  <span>{formatPHP(product.price)}</span>
                  <span>&middot;</span>
                  <span>Stock: {product.stock}</span>
                </div>
              </div>
              <button
                onClick={() => handleToggleActive(product.id, product.is_active)}
                className={`px-3 py-1 rounded-full text-xs font-display font-bold ${
                  product.is_active
                    ? 'bg-green-100 text-green-700'
                    : 'bg-zinc-100 text-zinc-500'
                }`}
              >
                {product.is_active ? 'Active' : 'Hidden'}
              </button>
              <button
                onClick={() => setEditingProduct(product)}
                aria-label={`Edit ${product.name}`}
                className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(product)}
                aria-label={`Delete ${product.name}`}
                className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
