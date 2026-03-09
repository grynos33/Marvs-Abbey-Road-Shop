import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useDocumentHead } from '../hooks/useDocumentHead';

export const VinylCarePage = () => {
  useDocumentHead('Vinyl Care Guide', 'Essential tips for cleaning, storing, and maintaining your vinyl record collection.');

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
              VINYL CARE GUIDE
            </h1>
          </div>

          <p className="text-xl text-zinc-600 leading-relaxed">
            Your records are an investment. With proper care, they'll sound incredible for decades. Here's everything you need to know.
          </p>

          <div className="prose prose-lg max-w-none text-zinc-600 space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-display font-bold text-zinc-900 mb-4">Handling Your Records</h2>
              <ul className="space-y-3">
                <li>Always hold records by the edges and the label area. Never touch the grooved surface — oils from your fingers attract dust and cause noise.</li>
                <li>When removing a record from its sleeve, let it slide into your hand gently. Don't pull it out by gripping the edges tightly.</li>
                <li>Always return records to their inner sleeve immediately after playing.</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-display font-bold text-zinc-900 mb-4">Cleaning</h2>
              <ul className="space-y-3">
                <li><strong className="text-zinc-900">Before every play:</strong> Use a carbon fiber brush in the direction of the grooves to remove surface dust. This takes 5 seconds and makes a big difference.</li>
                <li><strong className="text-zinc-900">Deep cleaning:</strong> For dusty or used records, use a dedicated record cleaning solution and a microfiber cloth. Apply the solution, let it sit briefly, then wipe following the grooves in a circular motion.</li>
                <li><strong className="text-zinc-900">Never use:</strong> Household cleaners, alcohol (on shellac), paper towels, or your shirt. These scratch and leave residue.</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-display font-bold text-zinc-900 mb-4">Storage</h2>
              <ul className="space-y-3">
                <li><strong className="text-zinc-900">Store vertically</strong> — like books on a shelf. Never stack records flat; the weight warps them over time.</li>
                <li><strong className="text-zinc-900">Avoid heat and sunlight.</strong> Keep records away from windows, radiators, and anywhere above 25°C. Vinyl warps easily in Philippine heat.</li>
                <li><strong className="text-zinc-900">Use inner sleeves.</strong> Replace old paper sleeves with anti-static poly-lined sleeves. They prevent scratches and reduce static.</li>
                <li><strong className="text-zinc-900">Outer sleeves protect jackets.</strong> Clear polypropylene outer sleeves keep album art in great condition.</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-display font-bold text-zinc-900 mb-4">Turntable Tips</h2>
              <ul className="space-y-3">
                <li>Check your stylus (needle) regularly. A worn stylus damages records permanently. Replace it according to the manufacturer's recommendation.</li>
                <li>Set the correct tracking force for your cartridge. Too heavy grinds grooves; too light causes skipping and mistracking.</li>
                <li>Keep your turntable on a stable, level surface away from speakers to avoid vibration feedback.</li>
              </ul>
            </div>

            <div className="bg-amber-50 rounded-2xl p-8 border border-amber-200">
              <h3 className="text-xl font-display font-bold text-zinc-900 mb-3">Philippine Climate Tip</h3>
              <p>
                Our tropical humidity can be tough on vinyl. If you live in a humid area, consider storing your records in a room with air conditioning or use silica gel packets near your collection to absorb excess moisture. Mold on record sleeves is the enemy — good airflow and controlled humidity keep it away.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
