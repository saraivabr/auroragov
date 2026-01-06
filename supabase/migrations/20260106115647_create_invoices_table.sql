/*
  # Create Invoices Table

  1. New Tables
    - `invoices`
      - `id` (uuid, primary key) - Unique invoice identifier
      - `invoice_number` (text, unique) - Human-readable invoice number
      - `status` (text) - Payment status: 'paid', 'pending', 'unpaid'
      - `payment_method` (text) - Payment method used
      - `amount` (numeric) - Invoice amount
      - `date` (date) - Invoice date
      - `customer_name` (text) - Customer name
      - `customer_email` (text) - Customer email
      - `notes` (text, nullable) - Additional notes
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp

  2. Security
    - Enable RLS on `invoices` table
    - Add policy for authenticated users to read all invoices
    - Add policy for authenticated users to insert invoices
    - Add policy for authenticated users to update invoices
    - Add policy for authenticated users to delete invoices
*/

CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  payment_method text NOT NULL,
  amount numeric(10, 2) NOT NULL DEFAULT 0,
  date date NOT NULL DEFAULT CURRENT_DATE,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('paid', 'pending', 'unpaid'))
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view invoices"
  ON invoices FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert invoices"
  ON invoices FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update invoices"
  ON invoices FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete invoices"
  ON invoices FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(date DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
