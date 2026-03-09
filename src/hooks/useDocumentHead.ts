import { useEffect } from 'react';

const BASE_TITLE = "Marv's Abbey Road Shop";

export function useDocumentHead(title?: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE_TITLE}` : `${BASE_TITLE} | Curated Vinyl Records`;

    if (description) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', description);
    }

    return () => {
      document.title = `${BASE_TITLE} | Curated Vinyl Records`;
    };
  }, [title, description]);
}
