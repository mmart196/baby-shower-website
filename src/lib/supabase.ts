import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-id.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key-here'

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
    }
  }
}
