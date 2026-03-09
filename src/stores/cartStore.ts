import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: { id: string; name: string; price: number; image: string; stock: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (product) => {
        const existing = get().items.find(i => i.id === product.id);
        if (existing) {
          if (existing.quantity >= product.stock) {
            toast.error(`Only ${product.stock} items available in stock`);
            return;
          }
          set({
            items: get().items.map(i =>
              i.id === product.id ? { ...i, quantity: i.quantity + 1, stock: product.stock } : i
            )
          });
          toast.success("Added another to your crate");
        } else {
          if (product.stock <= 0) {
            toast.error("This item is out of stock");
            return;
          }
          set({ items: [...get().items, { ...product, quantity: 1 }] });
          toast.success("Added to your crate");
        }
        set({ isOpen: true });
      },
      removeItem: (id) => {
        set({ items: get().items.filter(i => i.id !== id) });
        toast.info("Item removed from your crate", { style: { background: 'black', color: 'white', borderColor: 'black' } });
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        const item = get().items.find(i => i.id === id);
        if (item && quantity > item.stock) {
          toast.error(`Only ${item.stock} items available`);
          return;
        }
        set({ items: get().items.map(i => i.id === id ? { ...i, quantity } : i) });
      },
      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: 'marvs-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
