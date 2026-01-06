/*
  # Create Users Management Table

  1. New Tables
    - `app_users`
      - `id` (uuid, primary key) - Unique user identifier
      - `name` (text) - Full name
      - `email` (text, unique) - Email address
      - `role` (text) - User role: 'admin', 'developer', 'designer', 'manager'
      - `status` (text) - Account status: 'active', 'inactive'
      - `last_login` (timestamptz) - Last login timestamp
      - `projects_count` (integer) - Number of assigned projects
      - `avatar_url` (text, nullable) - Avatar image URL
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp

  2. Security
    - Enable RLS on `app_users` table
    - Add policy for authenticated users to read all users
    - Add policy for authenticated users to insert users
    - Add policy for authenticated users to update users
    - Add policy for authenticated users to delete users
*/

CREATE TABLE IF NOT EXISTS app_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'developer',
  status text NOT NULL DEFAULT 'active',
  last_login timestamptz DEFAULT now(),
  projects_count integer NOT NULL DEFAULT 0,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_role CHECK (role IN ('admin', 'developer', 'designer', 'manager')),
  CONSTRAINT valid_status CHECK (status IN ('active', 'inactive')),
  CONSTRAINT valid_projects_count CHECK (projects_count >= 0)
);

ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view app users"
  ON app_users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert app users"
  ON app_users FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update app users"
  ON app_users FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete app users"
  ON app_users FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_app_users_email ON app_users(email);
CREATE INDEX IF NOT EXISTS idx_app_users_role ON app_users(role);
CREATE INDEX IF NOT EXISTS idx_app_users_status ON app_users(status);

CREATE TRIGGER update_app_users_updated_at
  BEFORE UPDATE ON app_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
