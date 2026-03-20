import { createClient } from '@/utils/supabase/client'

// Singleton browser client — used by client components
export const supabase = createClient()

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_name: string
          user_role: 'coordinator' | 'captain' | 'dispatcher' | 'driver'
          created_at: string
        }
        Insert: {
          id: string
          user_name: string
          user_role?: 'coordinator' | 'captain' | 'dispatcher' | 'driver'
        }
        Update: {
          user_name?: string
          user_role?: 'coordinator' | 'captain' | 'dispatcher' | 'driver'
        }
      }
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
