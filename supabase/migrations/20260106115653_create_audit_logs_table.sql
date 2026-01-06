/*
  # Create Audit Logs Table

  1. New Tables
    - `audit_logs`
      - `id` (uuid, primary key) - Unique log identifier
      - `user_id` (uuid, nullable) - User who performed the action
      - `user_name` (text) - Name of the user
      - `action` (text) - Action performed
      - `entity_type` (text) - Type of entity affected
      - `entity_id` (uuid, nullable) - ID of affected entity
      - `details` (text) - Additional details about the action
      - `metadata` (jsonb, nullable) - Additional metadata
      - `timestamp` (timestamptz) - When the action occurred

  2. Security
    - Enable RLS on `audit_logs` table
    - Add policy for authenticated users to read all audit logs
    - Add policy for authenticated users to insert audit logs
    - No update or delete policies (audit logs are immutable)
*/

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  user_name text NOT NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  details text NOT NULL,
  metadata jsonb,
  timestamp timestamptz DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert audit logs"
  ON audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
