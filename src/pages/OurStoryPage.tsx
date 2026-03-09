import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useDocumentHead } from '../hooks/useDocumentHead';

export const OurStoryPage = () => {
  useDocumentHead('Our Story', 'Learn about the story behind Marv\'s Abbey Road Shop and our passion for vinyl records.');

  return (
    <section className="py-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-display font-medium text-zinc-500 hover:text-zinc-900 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div>
            <span className="text-brand-accent-orange font-display font-bold uppercase tracking-widest text-sm">Our Story</span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mt-3 tracking-tighter">
              MORE THAN NOSTALGIA
            </h1>
          </div>

          <div className="prose prose-lg max-w-none text-zinc-600 space-y-6">
            <p className="text-xl leading-relaxed">
              Marv's Abbey Road Shop was born from a lifelong love affair with vinyl — the warm crackle of a needle finding its groove, the ritual of pulling a record from its sleeve, and the unmatched depth of analog sound.
            </p>

            <p>
              Founded in the Philippines, we started as a small personal collection that grew into something we had to share with the world. What began as weekend crate-digging sessions at local markets and thrift stores evolved into a curated online destination for vinyl enthusiasts across the country.
            </p>

            <p>
              Every record in our catalog is hand-picked and carefully graded. We believe that vinyl isn't just a format — it's an experience. The artwork you can hold, the liner notes you can read, and the sound that fills a room in a way digital never quite captures.
            </p>

            <h2 className="text-2xl font-display font-bold text-zinc-900 mt-12">What We Stand For</h2>

            <ul className="space-y-4">
              <li><strong className="text-zinc-900">Authenticity</strong> — Every pressing is verified. No bootlegs, no counterfeits. If we list it, it's real.</li>
              <li><strong className="text-zinc-900">Fair Pricing</strong> — We price our records honestly. Rare doesn't have to mean unreachable.</li>
              <li><strong className="text-zinc-900">Community</strong> — We're building a community of Filipino vinyl lovers who share our passion for music in its purest form.</li>
              <li><strong className="text-zinc-900">Careful Shipping</strong> — Every record is packed with care, shipped in sturdy mailers to arrive in the same condition it left us.</li>
            </ul>

            <h2 className="text-2xl font-display font-bold text-zinc-900 mt-12">Why Vinyl?</h2>

            <p>
              In a world of infinite streaming playlists, vinyl forces you to slow down. To commit to an album from start to finish. To hear the music the way the artist intended — with warmth, depth, and presence that digital compression strips away.
            </p>

            <p>
              Whether you're a seasoned collector or just starting your journey, we're here to help you find your next favorite record.
            </p>
          </div>

          <div className="pt-8 border-t border-zinc-200">
            <Link to="/shop" className="btn-luxury btn-luxury-filled inline-flex items-center gap-2">
              BROWSE THE COLLECTION
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
