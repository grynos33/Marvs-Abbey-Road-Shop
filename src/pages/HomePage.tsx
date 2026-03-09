import { Hero } from '../components/home/Hero';
import { ProductGrid } from '../components/home/ProductGrid';
import { Features } from '../components/home/Features';
import { StorySection } from '../components/home/StorySection';
import { useDocumentHead } from '../hooks/useDocumentHead';

export const HomePage = () => {
  useDocumentHead();

  return (
    <>
      <Hero />
      <ProductGrid />
      <Features />
      <StorySection />
    </>
  );
};
