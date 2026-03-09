import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useDocumentHead } from '../hooks/useDocumentHead';

const GRADES = [
  {
    grade: 'M',
    label: 'Mint',
    description: 'Perfect, unplayed condition. The record has never been removed from its sealed packaging, or has been played once to verify quality. No marks, scuffs, or imperfections whatsoever.',
    color: 'bg-emerald-50 border-emerald-200',
    badgeColor: 'bg-emerald-500',
  },
  {
    grade: 'NM',
    label: 'Near Mint',
    description: 'Nearly perfect. The record may have been played a few times but shows no visible signs of wear. No surface noise beyond what is normal for the format. Sleeve is intact with minimal wear.',
    color: 'bg-green-50 border-green-200',
    badgeColor: 'bg-green-500',
  },
  {
    grade: 'VG+',
    label: 'Very Good Plus',
    description: 'Shows some signs of play but still sounds excellent. Light marks may be visible but do not affect playback significantly. Sleeve may have minor ring wear or light creasing.',
    color: 'bg-blue-50 border-blue-200',
    badgeColor: 'bg-blue-500',
  },
  {
    grade: 'VG',
    label: 'Very Good',
    description: 'Noticeable surface marks and light scratches that may produce some surface noise during quiet passages. The record still plays through without skipping. Sleeve shows general wear.',
    color: 'bg-amber-50 border-amber-200',
    badgeColor: 'bg-amber-500',
  },
  {
    grade: 'G+',
    label: 'Good Plus',
    description: 'Significant wear is evident. Surface noise is present throughout playback, but the record still plays without skipping. Sleeve may have seam splits, writing, or sticker residue.',
    color: 'bg-orange-50 border-orange-200',
    badgeColor: 'bg-orange-500',
  },
  {
    grade: 'G',
    label: 'Good',
    description: 'Heavy wear. The record plays through but with considerable surface noise, distortion, or groove wear. Suitable for casual listening or as a placeholder until a better copy is found.',
    color: 'bg-red-50 border-red-200',
    badgeColor: 'bg-red-400',
  },
];

export const VinylGradingPage = () => {
  useDocumentHead('Vinyl Grading Guide', 'Understand vinyl record grading standards from Mint to Good condition.');

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
            <span className="text-brand-accent-orange font-display font-bold uppercase tracking-widest text-sm">Learn</span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mt-3 tracking-tighter">
              VINYL GRADING
            </h1>
          </div>

          <p className="text-xl text-zinc-600 leading-relaxed">
            Understanding record grades helps you know exactly what you're buying. We use the Goldmine standard — the most widely accepted grading system in the vinyl world.
          </p>

          <div className="space-y-4">
            {GRADES.map((item, i) => (
              <motion.div
                key={item.grade}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-2xl p-6 border ${item.color}`}
              >
                <div className="flex items-start gap-4">
                  <span className={`${item.badgeColor} text-white font-display font-bold text-sm px-3 py-1 rounded-full shrink-0`}>
                    {item.grade}
                  </span>
                  <div>
                    <h3 className="font-display font-bold text-lg text-zinc-900">{item.label}</h3>
                    <p className="text-zinc-600 mt-1">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="prose prose-lg max-w-none text-zinc-600 space-y-6 pt-4">
            <h2 className="text-2xl font-display font-bold text-zinc-900">How We Grade at Marv's</h2>
            <p>
              We grade conservatively. If we're on the fence between two grades, we go with the lower one. We'd rather you be pleasantly surprised than disappointed.
            </p>
            <p>
              Every record is visually inspected under good lighting and play-tested on a quality turntable before listing. We grade the vinyl and the sleeve separately — you'll always know the condition of both.
            </p>

            <h2 className="text-2xl font-display font-bold text-zinc-900 mt-12">What We Sell</h2>
            <p>
              We typically stock records graded <strong>VG+</strong> and above. Occasionally we'll list a VG copy if it's a rare or sought-after title, and we'll always be upfront about the condition.
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
