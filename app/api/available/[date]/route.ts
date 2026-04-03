import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const ALL_SLOTS = [
  '09:00','09:30','10:00','10:30','11:00','11:30',
  '12:00','12:30','14:00','14:30','15:00','15:30',
  '16:00','16:30','17:00','17:30','18:00',
]

export async function GET(_req: Request, { params }: { params: { date: string } }) {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('bookings').select('time')
    .eq('date', params.date).eq('status', 'confirmed')
  const booked = (data || []).map((b) => b.time)
  return NextResponse.json({ data: ALL_SLOTS.filter((s) => !booked.includes(s)) })
}
