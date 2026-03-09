import { useState } from 'react';
import { ArrowLeft, Loader2, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getStoragePathFromPublicUrl } from '../../lib/storage';
import type { Product } from '../../types/database';

interface ProductFormProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductForm = ({ product, onClose }: ProductFormProps) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: product?.name ?? '',
    description: product?.description ?? '',
    price: product?.price?.toString() ?? '',
    image_url: product?.image_url ?? '',
    category: product?.category ?? 'Vinyl',
    tags: product?.tags?.join(', ') ?? '',
    color: product?.color ?? '#2C1A1D',
    stock: product?.stock?.toString() ?? '0',
    is_active: product?.is_active ?? true,
    is_featured: product?.is_featured ?? false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5MB');
      return;
    }

    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file);

    if (error) {
      alert('Upload failed: ' + error.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    const previousPath = getStoragePathFromPublicUrl('product-images', formData.image_url);
    const nextUrl = urlData.publicUrl;
    const nextPath = getStoragePathFromPublicUrl('product-images', nextUrl);

    if (previousPath && previousPath !== nextPath) {
      await supabase.storage.from('product-images').remove([previousPath]);
    }

    setFormData(prev => ({ ...prev, image_url: nextUrl }));
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      image_url: formData.image_url,
      category: 'Vinyl' as const,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      color: formData.color,
      stock: parseInt(formData.stock),
      is_active: formData.is_active,
      is_featured: formData.is_featured,
    };

    if (product) {
      await supabase.from('products').update(payload).eq('id', product.id);
    } else {
      await supabase.from('products').insert(payload);
    }

    setLoading(false);
    onClose();
  };

  return (
    <div>
      <button
        onClick={onClose}
        className="flex items-center gap-2 text-sm font-display font-medium text-zinc-500 hover:text-zinc-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </button>

      <h2 className="text-2xl font-display font-bold mb-6">
        {product ? 'Edit Product' : 'Add New Product'}
      </h2>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <label className="block text-sm font-display font-medium mb-2">Product Name</label>
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
          <label className="block text-sm font-display font-medium mb-2">Description</label>
          <textarea
            name="description"
            required
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-brand-accent-orange transition-colors resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-display font-medium mb-2">Price (PHP)</label>
            <input
              type="number"
              name="price"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-brand-accent-orange transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-display font-medium mb-2">Stock</label>
            <input
              type="number"
              name="stock"
              required
              min="0"
              value={formData.stock}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-brand-accent-orange transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-display font-medium mb-2">Color (hex)</label>
            <div className="flex gap-2">
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-12 h-12 rounded-xl border border-zinc-200 cursor-pointer"
              />
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="flex-1 px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-brand-accent-orange transition-colors"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-display font-medium mb-2">Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g. Beatles, Classic Rock, 1969"
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-brand-accent-orange transition-colors"
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {['New Arrivals', 'Rare Vinyls', 'Rare Finds', 'Classic Rock', 'Jazz', 'OPM'].map(tag => {
              const currentTags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
              const isActive = currentTags.some(t => t.toLowerCase() === tag.toLowerCase());
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    if (isActive) {
                      setFormData(prev => ({
                        ...prev,
                        tags: currentTags.filter(t => t.toLowerCase() !== tag.toLowerCase()).join(', '),
                      }));
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        tags: [...currentTags, tag].join(', '),
                      }));
                    }
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-display font-bold transition-all ${
                    isActive
                      ? 'bg-brand-accent-orange text-white'
                      : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-display font-medium mb-2">Product Image</label>
          {formData.image_url && (
            <img
              src={formData.image_url}
              alt="Preview"
              loading="lazy"
              decoding="async"
              className="w-32 h-32 object-cover rounded-xl mb-3"
              referrerPolicy="no-referrer"
            />
          )}
          <label className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-zinc-300 cursor-pointer hover:border-brand-accent-orange transition-colors">
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Upload className="w-5 h-5 text-zinc-400" />
            )}
            <span className="text-sm text-zinc-500">
              {uploading ? 'Uploading...' : 'Upload image (max 5MB)'}
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          <input
            type="text"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="Or paste an image URL"
            className="w-full mt-2 px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-brand-accent-orange transition-colors text-sm"
          />
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="w-4 h-4 accent-brand-accent-orange"
            />
            <label className="text-sm font-display font-medium">Active (visible in shop)</label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleChange}
              className="w-4 h-4 accent-amber-500"
            />
            <label className="text-sm font-display font-medium">Featured (show on landing page)</label>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-zinc-900 text-white rounded-full font-display font-bold hover:bg-zinc-800 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {product ? 'UPDATE PRODUCT' : 'ADD PRODUCT'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-3 rounded-full font-display font-bold border border-zinc-200 hover:border-zinc-400 transition-colors"
          >
            CANCEL
          </button>
        </div>
      </form>
    </div>
  );
};
