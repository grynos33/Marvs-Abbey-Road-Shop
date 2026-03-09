-- Marvs Abbey Road Shop - Supabase Database Schema
-- Run this in Supabase SQL Editor. Safe to re-run in parts.

-- Core tables
CREATE TABLE IF NOT EXISTS products (
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

CREATE TABLE IF NOT EXISTS orders (
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

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Role helper functions for RLS checks
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_staff_user()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role IN ('admin', 'manager')
  );
$$;

-- RLS enablement
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Recreate policies
DROP POLICY IF EXISTS "Public can view active products" ON products;
DROP POLICY IF EXISTS "Staff can manage products" ON products;
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
DROP POLICY IF EXISTS "Staff can view all orders" ON orders;
DROP POLICY IF EXISTS "Staff can update orders" ON orders;
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Staff can view subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "User can view own role" ON user_roles;
DROP POLICY IF EXISTS "Admin can view all roles" ON user_roles;
DROP POLICY IF EXISTS "Admin can insert roles" ON user_roles;
DROP POLICY IF EXISTS "Admin can update roles" ON user_roles;
DROP POLICY IF EXISTS "Admin can delete roles" ON user_roles;

CREATE POLICY "Public can view active products"
  ON products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Staff can manage products"
  ON products FOR ALL
  USING (public.is_staff_user())
  WITH CHECK (public.is_staff_user());

CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Staff can view all orders"
  ON orders FOR SELECT
  USING (public.is_staff_user());

CREATE POLICY "Staff can update orders"
  ON orders FOR UPDATE
  USING (public.is_staff_user())
  WITH CHECK (public.is_staff_user());

CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Staff can view subscribers"
  ON newsletter_subscribers FOR SELECT
  USING (public.is_staff_user());

CREATE POLICY "User can view own role"
  ON user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all roles"
  ON user_roles FOR SELECT
  USING (public.is_admin_user());

CREATE POLICY "Admin can insert roles"
  ON user_roles FOR INSERT
  WITH CHECK (public.is_admin_user());

CREATE POLICY "Admin can update roles"
  ON user_roles FOR UPDATE
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

CREATE POLICY "Admin can delete roles"
  ON user_roles FOR DELETE
  USING (public.is_admin_user());

-- Useful indexes
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_active_created ON products(is_active, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_featured_updated ON products(is_active, is_featured, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- Seed products (idempotent by name)
INSERT INTO products (name, description, price, image_url, category, tags, color, stock)
SELECT *
FROM (
  VALUES
    ('Abbey Road', 'The iconic 1969 pressing of the Beatles classic. Remastered for audiophiles.', 11200, 'https://images.unsplash.com/photo-1614613535308-eb5fbd3c2c17?q=80&w=1000', 'Vinyl', ARRAY['Beatles', 'Classic Rock', '1969'], '#D4AF37', 5),
    ('Kind of Blue', 'First pressing of the greatest jazz album of all time by Miles Davis.', 14000, 'https://images.unsplash.com/photo-1520625484830-17631da7e51c?q=80&w=1000', 'Vinyl', ARRAY['Jazz', 'Miles Davis', 'Classic'], '#2C1A1D', 2),
    ('Dark Side of the Moon', 'Pink Floyd''s masterpiece. Original 1973 pressing in pristine condition.', 18500, 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=1000', 'Vinyl', ARRAY['Pink Floyd', 'Progressive Rock', '1973'], '#1C2841', 3),
    ('Rumours', 'Fleetwood Mac''s iconic 1977 album. Clean pressing, excellent sound quality.', 9800, 'https://images.unsplash.com/photo-1629276301820-0f3f2ebd1f4c?q=80&w=1000', 'Vinyl', ARRAY['Fleetwood Mac', 'Classic Rock', '1977'], '#8E303A', 4)
) AS seed(name, description, price, image_url, category, tags, color, stock)
WHERE NOT EXISTS (
  SELECT 1 FROM products p WHERE p.name = seed.name
);
