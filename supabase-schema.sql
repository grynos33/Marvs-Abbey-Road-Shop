-- Marvs Abbey Road Shop — Supabase Database Schema
-- Run this in the Supabase SQL Editor to set up your tables

-- Products table (vinyl records only)
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Vinyl' CHECK (category = 'Vinyl'),
  tags TEXT[] DEFAULT '{}',
  color TEXT DEFAULT '#2C1A1D',
  stock INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_province TEXT NOT NULL,
  shipping_zip TEXT NOT NULL,
  shipping_region TEXT NOT NULL,
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_fee DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  payment_method TEXT,
  payment_id TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  order_status TEXT DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter table
CREATE TABLE newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Products: anyone can read active products
CREATE POLICY "Public can view active products"
  ON products FOR SELECT
  USING (is_active = true);

-- Products: only authenticated admin can modify
CREATE POLICY "Admin can manage products"
  ON products FOR ALL
  USING (auth.role() = 'authenticated');

-- Orders: anyone can create orders (for checkout)
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Orders: authenticated admin can read all
CREATE POLICY "Admin can view all orders"
  ON orders FOR SELECT
  USING (auth.role() = 'authenticated');

-- Orders: authenticated admin can update status
CREATE POLICY "Admin can update orders"
  ON orders FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Newsletter: anyone can insert
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

-- Newsletter: admins can read all
CREATE POLICY "Admin can view subscribers"
  ON newsletter_subscribers FOR SELECT
  USING (auth.role() = 'authenticated');

-- Indexes
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_active_created ON products(is_active, created_at DESC);
CREATE INDEX idx_products_featured_updated ON products(is_active, is_featured, updated_at DESC);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);

-- Seed with initial vinyl records (prices in PHP)
INSERT INTO products (name, description, price, image_url, category, tags, color, stock) VALUES
  ('Abbey Road', 'The iconic 1969 pressing of the Beatles classic. Remastered for audiophiles.', 11200, 'https://images.unsplash.com/photo-1614613535308-eb5fbd3c2c17?q=80&w=1000', 'Vinyl', ARRAY['Beatles', 'Classic Rock', '1969'], '#D4AF37', 5),
  ('Kind of Blue', 'First pressing of the greatest jazz album of all time by Miles Davis.', 14000, 'https://images.unsplash.com/photo-1520625484830-17631da7e51c?q=80&w=1000', 'Vinyl', ARRAY['Jazz', 'Miles Davis', 'Classic'], '#2C1A1D', 2),
  ('Dark Side of the Moon', 'Pink Floyd''s masterpiece. Original 1973 pressing in pristine condition.', 18500, 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=1000', 'Vinyl', ARRAY['Pink Floyd', 'Progressive Rock', '1973'], '#1C2841', 3),
  ('Rumours', 'Fleetwood Mac''s iconic 1977 album. Clean pressing, excellent sound quality.', 9800, 'https://images.unsplash.com/photo-1629276301820-0f3f2ebd1f4c?q=80&w=1000', 'Vinyl', ARRAY['Fleetwood Mac', 'Classic Rock', '1977'], '#8E303A', 4);
