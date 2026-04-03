import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { sendWhatsAppNotification } from '@/lib/whatsapp'

export async function GET() {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('bookings')
    .select('*, services(name, price, duration)')
    .eq('status', 'confirmed')
    .order('date').order('time')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: Request) {
  const body = await req.json()
  const { client_name, client_email, client_phone, date, time, service_id, notes } = body
  if (!client_name || !client_email || !client_phone || !date || !time || !service_id)
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })

  const supabase = createServerSupabaseClient()

  const { data: existing } = await supabase
    .from('bookings').select('id')
    .eq('date', date).eq('time', time).eq('status', 'confirmed').maybeSingle()
  if (existing) return NextResponse.json({ error: 'Ese horario ya está reservado' }, { status: 409 })

  const { data, error } = await supabase
    .from('bookings')
    .insert([{ client_name, client_email, client_phone, date, time, service_id, notes: notes || '' }])
    .select('*, services(name)').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await sendWhatsAppNotification({
    clientName: client_name, clientPhone: client_phone,
    serviceName: (data.services as { name: string } | null)?.name || 'Servicio',
    date, time, notes,
  })

  return NextResponse.json({ data }, { status: 201 })
}
