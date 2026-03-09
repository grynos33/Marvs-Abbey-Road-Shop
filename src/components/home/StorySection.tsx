export const StorySection = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl relative">
              <div className="absolute inset-0 bg-brand-accent-blue/10 mix-blend-multiply z-10 rounded-[3rem]"></div>
              <img
                src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000"
                alt="Vintage Studio Setup"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-brand-accent-orange text-white p-8 rounded-full flex items-center justify-center text-center font-display font-bold leading-tight rotate-12 shadow-xl z-20 hover:rotate-0 transition-transform duration-500 cursor-default">
              PRESERVE<br />THE MAGIC
            </div>
          </div>
          <div className="space-y-8">
            <h2 className="text-5xl md:text-6xl font-display font-bold tracking-tighter">
              MORE THAN JUST <br /> NOSTALGIA.
            </h2>
            <p className="text-xl text-zinc-600 leading-relaxed font-sans">
              We believe that music is meant to be felt, not just heard. Our mission is to keep the warmth of analog sound alive by curating the finest vinyl records for collectors and music lovers across the Philippines.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-4xl font-display font-bold text-brand-accent-orange mb-2">10k+</div>
                <div className="text-sm font-display font-bold uppercase tracking-widest text-zinc-400">Vinyl Records</div>
              </div>
              <div>
                <div className="text-4xl font-display font-bold text-brand-accent-orange mb-2">2020</div>
                <div className="text-sm font-display font-bold uppercase tracking-widest text-zinc-400">Est. Philippines</div>
              </div>
            </div>
            <button className="btn-luxury btn-luxury-filled shadow-brand-accent-orange/20">
              OUR STORY
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
