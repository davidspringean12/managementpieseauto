/*
  # Add notes column to vin_records table

  1. Changes
    - Add `notes` column to `vin_records` table
      - Type: text
      - Nullable: true
      - Purpose: Store additional notes about the VIN record
  
  2. Notes
    - Existing records will have notes as NULL
    - Field is optional
*/

-- Add notes column to vin_records table
ALTER TABLE vin_records 
ADD COLUMN notes text;

-- Update type definition comment
COMMENT ON TABLE vin_records IS 'Records of VIN numbers with client information, parts, and notes';