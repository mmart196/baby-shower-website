import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zoeplfxiezmsmamrbsfd.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvZXBsZnhpZXptc21hbXJic2ZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzODU5NDIsImV4cCI6MjA4NTk2MTk0Mn0.ST9F4RjfpNS8gLhM9luByJLZgPpXL8OTrhBv8dqGmM8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
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
