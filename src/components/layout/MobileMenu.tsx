import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Instagram, Facebook, Linkedin, Search } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { label: 'Shop', to: '/shop' },
  { label: 'New Arrivals', to: '/shop?tag=new-arrivals' },
  { label: 'Rare Finds', to: '/shop?tag=rare-finds' },
];

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[60] bg-brand-beige p-8 flex flex-col"
        >
          <div className="flex justify-end">
            <button onClick={onClose} className="p-2">
              <X className="w-8 h-8" />
            </button>
          </div>

          <form onSubmit={handleSearch} className="mt-8 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vinyls..."
              className="w-full px-4 py-3 pl-12 rounded-xl bg-white border border-zinc-200 text-lg focus:outline-none focus:border-brand-accent-orange transition-colors"
            />
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          </form>

          <nav className="flex flex-col gap-8 mt-12">
            {NAV_ITEMS.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={item.to}
                  onClick={onClose}
                  className="text-4xl font-display font-bold hover:text-brand-accent-orange transition-colors"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </nav>
          <div className="mt-auto flex gap-6">
            <Instagram className="w-6 h-6" />
            <Facebook className="w-6 h-6" />
            <Linkedin className="w-6 h-6" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
