import { Link } from 'react-router-dom';
import { Instagram, Facebook, Linkedin, User } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-zinc-900 text-white pt-24 pb-12 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 text-zinc-300">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-24 relative z-10">
          <div className="space-y-8">
            <Link to="/" className="text-3xl font-display font-bold tracking-tighter text-white">
              Marv's Abbey <span className="text-brand-accent-orange">Road</span> Shop
            </Link>
            <p className="leading-relaxed">
              Curating the finest rare vinyl pressings for true music lovers. Dedicated to the analog soul.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-accent-orange hover:border-brand-accent-orange hover:text-white transition-all">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold uppercase tracking-widest text-sm mb-8 text-brand-accent-orange">Shop</h4>
            <ul className="space-y-4">
              {[
                { label: 'New Arrivals', slug: 'new-arrivals' },
                { label: 'Rare Vinyls', slug: 'rare-vinyls' },
                { label: 'Classic Rock', slug: 'classic-rock' },
                { label: 'Jazz', slug: 'jazz' },
                { label: 'OPM', slug: 'opm' },
              ].map(item => (
                <li key={item.slug}>
                  <Link to={`/shop?tag=${item.slug}`} className="hover:text-white transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold uppercase tracking-widest text-sm mb-8 text-brand-accent-orange">Learn</h4>
            <ul className="space-y-4">
              <li><Link to="/our-story" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link to="/vinyl-care" className="hover:text-white transition-colors">Vinyl Care Guide</Link></li>
              <li><Link to="/vinyl-grading" className="hover:text-white transition-colors">About Vinyl Grading</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold uppercase tracking-widest text-sm mb-8 text-brand-accent-orange">Contact</h4>
            <p className="mb-6 leading-relaxed">
              Online Vinyl Shop<br />
              Philippines
            </p>
            <p className="text-sm font-display">Open 24/7 Online</p>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-zinc-500 relative z-10">
          <p>&copy; 2026 Marv's Abbey Road Shop. All rights reserved.</p>
          <div className="flex gap-8">
            <Link to="/admin" aria-label="Admin" title="Admin" className="hover:text-white transition-colors">
              <User className="w-4 h-4" />
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>

      {/* Giant Footer Text */}
      <div className="absolute -bottom-16 left-0 w-full opacity-[0.03] pointer-events-none select-none overflow-hidden">
        <div className="text-[25vw] font-display font-black whitespace-nowrap leading-none text-center tracking-tighter">
          VINYL RECORDS
        </div>
      </div>
    </footer>
  );
};
