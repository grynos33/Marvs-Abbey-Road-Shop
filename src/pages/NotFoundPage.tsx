import { Link } from 'react-router-dom';
import { Disc } from 'lucide-react';
import { useDocumentHead } from '../hooks/useDocumentHead';

export const NotFoundPage = () => {
  useDocumentHead('Page Not Found');

  return (
    <section className="py-24 min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto px-6">
        <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center relative shadow-inner mx-auto">
          <Disc className="w-12 h-12 text-zinc-300" />
        </div>
        <h1 className="text-6xl font-display font-bold tracking-tighter">404</h1>
        <p className="text-xl text-zinc-500">This record seems to be missing from our collection.</p>
        <Link
          to="/"
          className="btn-luxury btn-luxury-filled inline-block"
        >
          BACK HOME
        </Link>
      </div>
    </section>
  );
};
