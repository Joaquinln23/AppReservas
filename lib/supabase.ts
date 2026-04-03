import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export type Service = {
  id: string
  name: string
  duration: number
  price: number
  description: string
  active: boolean
}

export type Booking = {
  id: string
  client_name: string
  client_email: string
  client_phone: string
  date: string
  time: string
  service_id: string
  notes: string
  status: 'confirmed' | 'cancelled'
  created_at: string
  services?: Service
}
