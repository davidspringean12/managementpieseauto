/*
  # Create VIN Records Table for Focus Part Auto Shop

  ## Overview
  This migration creates the core table for storing VIN records with associated client and parts information.

  ## New Tables
  
  ### `vin_records`
  - `id` (uuid, primary key) - Unique identifier for each record
  - `vin_number` (text, unique, not null) - Vehicle Identification Number (17 characters)
  - `client_name` (text, not null) - Name of the client who purchased parts
  - `parts_bought` (jsonb, not null) - Array of part names purchased
  - `part_serial_numbers` (jsonb, not null) - Array of serial numbers for the parts
  - `created_at` (timestamptz) - Timestamp when the record was created
  - `updated_at` (timestamptz) - Timestamp when the record was last updated

  ## Security
  - Enable RLS on `vin_records` table
  - Add policy for public read access (SELECT)
  - Add policy for public write access (INSERT, UPDATE, DELETE)
  
  ## Notes
  1. VIN numbers are unique to prevent duplicate entries
  2. JSONB format allows flexible storage of multiple parts and serial numbers
  3. Public access policies are set for ease of use in a small shop environment
  4. Created and updated timestamps track record history
*/

-- Create the vin_records table
CREATE TABLE IF NOT EXISTS vin_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vin_number text UNIQUE NOT NULL,
  client_name text NOT NULL,
  parts_bought jsonb NOT NULL DEFAULT '[]'::jsonb,
  part_serial_numbers jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE vin_records ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public read access"
  ON vin_records
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access"
  ON vin_records
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access"
  ON vin_records
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access"
  ON vin_records
  FOR DELETE
  TO public
  USING (true);

-- Create index on vin_number for faster searches
CREATE INDEX IF NOT EXISTS idx_vin_records_vin_number ON vin_records(vin_number);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_vin_records_updated_at
  BEFORE UPDATE ON vin_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();