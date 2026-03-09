import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, Search, X } from 'lucide-react';
import { AnnouncementBar } from './AnnouncementBar';
import { MobileMenu } from './MobileMenu';
import { useCartStore } from '../../stores/cartStore';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { totalItems, openCart } = useCartStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchRef.current) searchRef.current.focus();
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <AnnouncementBar />
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-brand-beige/80 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl md:text-2xl font-display font-bold tracking-tighter leading-none">
              Marv's Abbey <span className="text-brand-accent-orange">Road</span> Shop
            </Link>
            <nav className="hidden lg:flex items-center gap-6">
              <Link to="/shop" className="font-display text-sm font-medium hover:text-brand-accent-orange transition-colors">
                Shop
              </Link>
              <Link to="/shop?tag=new-arrivals" className="font-display text-sm font-medium hover:text-brand-accent-orange transition-colors">
                New Arrivals
              </Link>
              <Link to="/shop?tag=rare-finds" className="font-display text-sm font-medium hover:text-brand-accent-orange transition-colors">
                Rare Finds
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search vinyls..."
                  className="w-48 px-4 py-2 rounded-full border border-zinc-200 bg-white text-sm focus:outline-none focus:border-brand-accent-orange transition-colors"
                />
                <button
                  type="button"
                  onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                  aria-label="Close search"
                  className="p-2 hover:bg-black/5 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Open search"
                className="p-2 hover:bg-black/5 rounded-full transition-colors hidden md:block"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={openCart}
              aria-label="Open cart"
              className="relative p-2 hover:bg-black/5 rounded-full transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-4 h-4 bg-brand-accent-orange text-white text-[10px] flex items-center justify-center rounded-full">
                {totalItems()}
              </span>
            </button>
            <button
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
              className="lg:hidden p-2 hover:bg-black/5 rounded-full transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};
