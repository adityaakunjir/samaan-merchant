-- Create products table for inventory
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  category TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products
CREATE POLICY "products_select_own" ON products FOR SELECT USING (auth.uid() = merchant_id);
CREATE POLICY "products_insert_own" ON products FOR INSERT WITH CHECK (auth.uid() = merchant_id);
CREATE POLICY "products_update_own" ON products FOR UPDATE USING (auth.uid() = merchant_id);
CREATE POLICY "products_delete_own" ON products FOR DELETE USING (auth.uid() = merchant_id);
