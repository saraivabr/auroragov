/*
  # Create Products Inventory Table

  1. New Tables
    - `products`
      - `id` (uuid, primary key) - Unique product identifier
      - `name` (text) - Product name
      - `description` (text) - Product description
      - `price` (numeric) - Product price
      - `stock` (integer) - Current stock level
      - `category` (text) - Product category
      - `sku` (text, unique) - Stock keeping unit
      - `image_url` (text, nullable) - Product image URL
      - `is_active` (boolean) - Product availability status
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp

  2. Security
    - Enable RLS on `products` table
    - Add policy for authenticated users to read all products
    - Add policy for authenticated users to insert products
    - Add policy for authenticated users to update products
    - Add policy for authenticated users to delete products
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric(10, 2) NOT NULL DEFAULT 0,
  stock integer NOT NULL DEFAULT 0,
  category text NOT NULL,
  sku text UNIQUE NOT NULL,
  image_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_price CHECK (price >= 0),
  CONSTRAINT valid_stock CHECK (stock >= 0)
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock);

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
