/*
  # Add license_plate and part_prices columns to vin_records table

  1. Changes
    - Add `license_plate` column to `vin_records` table
      - Type: text
      - Nullable: true
      - Purpose: Store vehicle license plate number
    
    - Add `part_prices` column to `vin_records` table
      - Type: jsonb
      - Default: empty array
      - Purpose: Store prices for each part as an array parallel to parts_bought
  
  2. Notes
    - Existing records will have license_plate as NULL and part_prices as empty array
    - Both fields are optional
*/

-- Add license_plate column to vin_records table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vin_records' AND column_name = 'license_plate'
  ) THEN
    ALTER TABLE vin_records ADD COLUMN license_plate text;
  END IF;
END $$;

-- Add part_prices column to vin_records table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vin_records' AND column_name = 'part_prices'
  ) THEN
    ALTER TABLE vin_records ADD COLUMN part_prices jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Create index on license_plate for faster searches
CREATE INDEX IF NOT EXISTS idx_vin_records_license_plate ON vin_records(license_plate);