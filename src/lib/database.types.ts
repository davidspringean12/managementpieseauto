export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      vin_records: {
        Row: {
          id: string
          created_at?: string
          vin_number: string
          client_name: string
          parts_bought: string[]
          part_serial_numbers: string[]
          part_prices: number[]
          license_plate: string | null
        }
        Insert: {
          vin_number: string
          client_name: string
          parts_bought: string[]
          part_serial_numbers: string[]
          part_prices: number[]
          license_plate?: string | null
        }
        Update: {
          vin_number?: string
          client_name?: string
          parts_bought?: string[]
          part_serial_numbers?: string[]
          part_prices?: number[]
          license_plate?: string | null
        }
      }
    }
  }
}

export type VinRecord = Database['public']['Tables']['vin_records']['Row'];
