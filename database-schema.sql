-- 3D Print Business Website Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable Row Level Security for all tables
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create users table (extends auth.users)
-- This stores additional user information beyond what Supabase Auth provides
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  password_hash TEXT, -- Store hashed passwords for custom auth
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
-- Organizes products into logical groups (Toys, Home Decor, etc.)
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- URL-friendly version of name
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
-- Stores all 3D printed products with details
CREATE TABLE public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL, -- Price in dollars (e.g., 25.99)
  category_id UUID REFERENCES public.categories(id),
  material TEXT, -- PLA, ABS, PETG, etc.
  dimensions TEXT, -- "10cm x 5cm x 3cm"
  print_time TEXT, -- "2-3 hours"
  stock_quantity INTEGER DEFAULT 0,
  images TEXT[] DEFAULT '{}', -- Array of Cloudinary image URLs
  featured BOOLEAN DEFAULT FALSE, -- Show on homepage
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
-- Tracks customer orders and payment status
CREATE TABLE public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  total_amount DECIMAL(10,2) NOT NULL, -- Total order value
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  stripe_payment_id TEXT, -- Stripe payment intent ID
  shipping_address JSONB, -- Full shipping address as JSON
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
-- Individual items within an order
CREATE TABLE public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  price_at_purchase DECIMAL(10,2) NOT NULL -- Price when order was placed
);

-- Create reviews table
-- Customer reviews and ratings for products
CREATE TABLE public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5), -- 1-5 star rating
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, user_id) -- One review per user per product
);

-- Create indexes for better query performance
-- These speed up common database operations
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_featured ON public.products(featured);
CREATE INDEX idx_products_price ON public.products(price);
CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created ON public.orders(created_at);
CREATE INDEX idx_order_items_order ON public.order_items(order_id);
CREATE INDEX idx_order_items_product ON public.order_items(product_id);
CREATE INDEX idx_reviews_product ON public.reviews(product_id);
CREATE INDEX idx_reviews_user ON public.reviews(user_id);

-- Row Level Security Policies
-- These ensure users can only access their own data

-- Users can view and update their own profile
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Anyone can view products and categories (public catalog)
CREATE POLICY "Anyone can view products" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT USING (true);

-- Users can only view their own orders
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only view order items for their own orders
CREATE POLICY "Users can view their own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Anyone can view reviews (public)
CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

-- Authenticated users can create reviews
CREATE POLICY "Authenticated users can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update their own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to handle new user creation
-- Automatically creates a user record when someone signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email), -- Use name from metadata or email
    'customer' -- Default role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user record when auth user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
-- Automatically updates the updated_at field when records are modified
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at timestamps
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON public.users 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON public.products 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON public.orders 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample categories
-- These are common categories for 3D printed products
INSERT INTO public.categories (name, slug, description) VALUES
('Toys & Games', 'toys-games', 'Fun 3D printed toys, puzzles, and games for all ages'),
('Home & Garden', 'home-garden', 'Decorative and functional items for your home and garden'),
('Accessories', 'accessories', 'Phone cases, keychains, jewelry, and other accessories'),
('Art & Sculptures', 'art-sculptures', 'Decorative art pieces, figurines, and sculptures'),
('Tools & Parts', 'tools-parts', 'Functional tools, replacement parts, and mechanical components'),
('Kitchen & Dining', 'kitchen-dining', 'Kitchen gadgets, utensils, and dining accessories'),
('Office & Desk', 'office-desk', 'Desk organizers, pen holders, and office accessories'),
('Automotive', 'automotive', 'Car accessories, phone mounts, and automotive parts');

-- Insert sample products
-- These are example products to get you started
INSERT INTO public.products (name, description, price, category_id, material, dimensions, print_time, stock_quantity, images, featured) VALUES
(
  'Custom Phone Stand',
  'Adjustable phone stand perfect for desk work or watching videos. Compatible with all phone sizes.',
  12.99,
  (SELECT id FROM public.categories WHERE slug = 'accessories'),
  'PLA',
  '8cm x 6cm x 4cm',
  '1-2 hours',
  50,
  ARRAY['https://res.cloudinary.com/your-cloud/image/upload/v1/phone-stand-1.jpg'],
  true
),
(
  'Miniature Dragon Figurine',
  'Detailed dragon figurine perfect for collectors or D&D players. Comes unpainted for customization.',
  24.99,
  (SELECT id FROM public.categories WHERE slug = 'art-sculptures'),
  'PLA',
  '10cm x 8cm x 6cm',
  '3-4 hours',
  25,
  ARRAY['https://res.cloudinary.com/your-cloud/image/upload/v1/dragon-figurine-1.jpg'],
  true
),
(
  'Cable Management Tray',
  'Organize your desk cables with this sleek cable management tray. Fits under most desks.',
  18.99,
  (SELECT id FROM public.categories WHERE slug = 'office-desk'),
  'PETG',
  '30cm x 8cm x 3cm',
  '2-3 hours',
  30,
  ARRAY['https://res.cloudinary.com/your-cloud/image/upload/v1/cable-tray-1.jpg'],
  false
),
(
  'Herb Garden Markers',
  'Set of 6 decorative herb garden markers. Perfect for identifying plants in your garden.',
  15.99,
  (SELECT id FROM public.categories WHERE slug = 'home-garden'),
  'PLA',
  '15cm x 2cm x 0.5cm each',
  '1 hour',
  100,
  ARRAY['https://res.cloudinary.com/your-cloud/image/upload/v1/garden-markers-1.jpg'],
  false
),
(
  'Fidget Spinner',
  'High-quality fidget spinner with smooth bearings. Great for stress relief and focus.',
  8.99,
  (SELECT id FROM public.categories WHERE slug = 'toys-games'),
  'PLA',
  '6cm diameter',
  '1 hour',
  75,
  ARRAY['https://res.cloudinary.com/your-cloud/image/upload/v1/fidget-spinner-1.jpg'],
  true
);

-- Create a view for product details with category information
-- This makes it easier to query products with their category data
CREATE VIEW public.product_details AS
SELECT 
  p.*,
  c.name as category_name,
  c.slug as category_slug,
  COALESCE(AVG(r.rating), 0) as average_rating,
  COUNT(r.id) as review_count
FROM public.products p
LEFT JOIN public.categories c ON p.category_id = c.id
LEFT JOIN public.reviews r ON p.id = r.product_id
GROUP BY p.id, c.name, c.slug;

-- Create a view for order summaries
-- Shows orders with customer information and item counts
CREATE VIEW public.order_summaries AS
SELECT 
  o.*,
  u.name as customer_name,
  u.email as customer_email,
  COUNT(oi.id) as item_count,
  SUM(oi.quantity) as total_quantity
FROM public.orders o
LEFT JOIN public.users u ON o.user_id = u.id
LEFT JOIN public.order_items oi ON o.id = oi.order_id
GROUP BY o.id, u.name, u.email;

-- Grant necessary permissions
-- Ensure the application can access the data it needs
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
