export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      vin_records: {
        Row: {
          id: string
          vin_number: string
          client_name: string
          parts_bought: Json
          part_serial_numbers: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vin_number: string
          client_name: string
          parts_bought: Json
          part_serial_numbers: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vin_number?: string
          client_name?: string
          parts_bought?: Json
          part_serial_numbers?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type VinRecord = Database['public']['Tables']['vin_records']['Row'];
