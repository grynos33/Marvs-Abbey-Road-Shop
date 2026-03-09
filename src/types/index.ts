export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  image_url?: string;
  category: 'Vinyl';
  tags: string[];
  color: string;
  stock: number;
  is_active?: boolean;
  is_featured?: boolean;
}

/** Map a Supabase product row to the Product interface */
export function mapSupabaseProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    description: row.description as string,
    price: Number(row.price),
    image: (row.image_url as string) || '',
    image_url: row.image_url as string,
    category: 'Vinyl',
    tags: (row.tags as string[]) || [],
    color: (row.color as string) || '#2C1A1D',
    stock: (row.stock as number) || 0,
    is_active: row.is_active as boolean,
    is_featured: row.is_featured as boolean,
  };
}

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Abbey Road',
    description: 'The iconic 1969 pressing of the Beatles classic. Remastered for audiophiles.',
    price: 11200,
    image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3c2c17?q=80&w=1000',
    category: 'Vinyl',
    tags: ['Beatles', 'Classic Rock', '1969'],
    color: '#D4AF37',
    stock: 5
  },
  {
    id: '2',
    name: 'Kind of Blue',
    description: 'First pressing of the greatest jazz album of all time by Miles Davis.',
    price: 14000,
    image: 'https://images.unsplash.com/photo-1520625484830-17631da7e51c?q=80&w=1000',
    category: 'Vinyl',
    tags: ['Jazz', 'Miles Davis', 'Classic'],
    color: '#2C1A1D',
    stock: 2
  },
  {
    id: '3',
    name: 'Dark Side of the Moon',
    description: 'Pink Floyd\'s masterpiece. Original 1973 pressing in pristine condition.',
    price: 18500,
    image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=1000',
    category: 'Vinyl',
    tags: ['Pink Floyd', 'Progressive Rock', '1973'],
    color: '#1C2841',
    stock: 3
  },
  {
    id: '4',
    name: 'Rumours',
    description: 'Fleetwood Mac\'s iconic 1977 album. Clean pressing, excellent sound quality.',
    price: 9800,
    image: 'https://images.unsplash.com/photo-1629276301820-0f3f2ebd1f4c?q=80&w=1000',
    category: 'Vinyl',
    tags: ['Fleetwood Mac', 'Classic Rock', '1977'],
    color: '#8E303A',
    stock: 4
  }
];
