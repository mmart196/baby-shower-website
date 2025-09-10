import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ncbwsxrajwvgdscsxosq.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jYndzeHJhand2Z2RzY3N4b3NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyNDIyMDAsImV4cCI6MjA3MTgxODIwMH0.FJSJqErL4HOJdk5vVng0gf8lVfi4khlZ_sQwcfZq1XM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      wishlist_items: {
        Row: {
          id: string
          created_at: string
          name: string
          price: number
          category: 'Safety' | 'Travel' | 'Furniture' | 'Clothing' | 'Feeding' | 'Bedding'
          retailer: string
          link: string
          image: string | null
          claimed: boolean
          claimed_by: string | null
          claimed_at: string | null
          claim_message: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          price: number
          category: 'Safety' | 'Travel' | 'Furniture' | 'Clothing' | 'Feeding' | 'Bedding'
          retailer: string
          link: string
          image?: string | null
          claimed?: boolean
          claimed_by?: string | null
          claimed_at?: string | null
          claim_message?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          price?: number
          category?: 'Safety' | 'Travel' | 'Furniture' | 'Clothing' | 'Feeding' | 'Bedding'
          retailer?: string
          link?: string
          image?: string | null
          claimed?: boolean
          claimed_by?: string | null
          claimed_at?: string | null
          claim_message?: string | null
        }
      }
      rsvps: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string | null
          phone: string | null
          attending: boolean
          guest_count: number
          dietary_restrictions: string | null
          message: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email?: string | null
          phone?: string | null
          attending?: boolean
          guest_count?: number
          dietary_restrictions?: string | null
          message?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string | null
          phone?: string | null
          attending?: boolean
          guest_count?: number
          dietary_restrictions?: string | null
          message?: string | null
        }
      }
    }
  }
}
