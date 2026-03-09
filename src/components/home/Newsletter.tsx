import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }]);

      if (error) {
        if (error.code === '23505') { // Unique violation
          toast.success("You're already on the list! Keep an eye on your inbox.");
        } else {
          throw error;
        }
      } else {
        toast.success("Welcome to the club! We'll be in touch.");
        setEmail('');
      }
    } catch (error) {
      console.error('Newsletter error:', error);
      toast.error('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-24 bg-brand-accent-blue text-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="text-[20vw] font-display font-bold whitespace-nowrap animate-pulse">
          RECORDS VINTAGE GEAR
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h2 className="text-5xl md:text-7xl font-display font-bold mb-8 tracking-tighter">
          JOIN THE CLUB
        </h2>
        <p className="text-xl opacity-90 mb-12 max-w-2xl mx-auto">
          Sign up for early access to our weekly restocks, rare find alerts, and exclusive interviews with legendary sound engineers.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
            placeholder="your@email.com"
            className="flex-1 bg-white/10 border border-white/20 rounded-full px-8 py-4 placeholder:text-white/50 focus:outline-none focus:bg-white/20 focus:border-white/40 transition-all font-sans disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-brand-accent-orange text-white px-8 py-4 rounded-full font-display font-bold hover:bg-[#A67525] transition-colors shadow-lg shadow-brand-accent-orange/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'JOINING...' : 'SUBSCRIBE'}
          </button>
        </form>
        <p className="mt-8 text-xs opacity-60">* No spam, just pure analog goodness.</p>
      </div>
    </section>
  );
};
