import { motion } from 'motion/react';
import { Headphones, Disc, Star, Truck } from 'lucide-react';

export const Features = () => {
  const features = [
    { title: 'Audiophile Quality', desc: 'Every record is carefully inspected and graded. We only sell pressings we\'d play on our own turntables.', icon: <Headphones className="w-8 h-8" /> },
    { title: 'Nationwide Shipping', desc: 'Carefully packaged in premium mailers, shipped across the Philippines. Your vinyls arrive in perfect condition.', icon: <Truck className="w-8 h-8" /> },
    { title: 'Curated Collection', desc: 'A meticulously selected catalog of rare jazz, classic rock, OPM, and timeless albums from every genre.', icon: <Star className="w-8 h-8" /> },
    { title: 'Authentic Pressings', desc: 'Every vinyl is verified authentic — from original pressings to high-quality reissues and limited editions.', icon: <Disc className="w-8 h-8" /> }
  ];

  return (
    <section className="py-24 bg-brand-beige relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[2.5rem] bg-white/50 border border-black/5 hover:bg-white transition-colors shadow-sm hover:shadow-md"
            >
              <div className="mb-6 text-brand-accent-orange">{f.icon}</div>
              <h3 className="text-2xl font-display font-bold mb-4">{f.title}</h3>
              <p className="text-zinc-600 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
