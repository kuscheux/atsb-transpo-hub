import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_url'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      driver_applications: {
        Row: {
          id: string
          created_at: string
          driver_name: string
          phone_number: string
          email: string
          last_5_ssn: string
          hired_to_drive: string
          acknowledged_work_times: boolean
          acknowledged_vehicle_swap: boolean
          acknowledged_timecard: boolean
          status: 'pending' | 'approved' | 'onboarded'
          invite_sent: boolean
          invite_sent_at: string | null
          notes: string | null
        }
        Insert: {
          driver_name: string
          phone_number: string
          email: string
          last_5_ssn: string
          hired_to_drive: string
          acknowledged_work_times: boolean
          acknowledged_vehicle_swap: boolean
          acknowledged_timecard: boolean
          status?: 'pending' | 'approved' | 'onboarded'
          notes?: string | null
        }
      }
      chat_messages: {
        Row: {
          id: string
          created_at: string
          user_name: string
          message: string
          user_role: 'coordinator' | 'captain' | 'dispatcher' | 'driver'
        }
        Insert: {
          user_name: string
          message: string
          user_role: 'coordinator' | 'captain' | 'dispatcher' | 'driver'
        }
      }
      calendar_events: {
        Row: {
          id: string
          created_at: string
          title: string
          event_date: string
          event_type: 'shoot' | 'travel' | 'fitting' | 'meeting' | 'other'
          notes: string | null
        }
        Insert: {
          title: string
          event_date: string
          event_type: 'shoot' | 'travel' | 'fitting' | 'meeting' | 'other'
          notes?: string | null
        }
      }
    }
  }
}
