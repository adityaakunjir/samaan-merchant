-- Create merchants table for shop profiles
CREATE TABLE IF NOT EXISTS merchants (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  shop_name TEXT NOT NULL,
  address TEXT,
  is_open BOOLEAN DEFAULT true,
  eta_minutes INTEGER DEFAULT 30,
  logo_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for merchants
CREATE POLICY "merchants_select_own" ON merchants FOR SELECT USING (auth.uid() = id);
CREATE POLICY "merchants_insert_own" ON merchants FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "merchants_update_own" ON merchants FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "merchants_delete_own" ON merchants FOR DELETE USING (auth.uid() = id);
