'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Booking } from '@/lib/supabase'

export default function BookingList({ refresh }: { refresh: boolean }) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBookings = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/bookings')
      const data = await res.json()
      setBookings(data.data || [])
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchBookings() }, [refresh, fetchBookings])

  const formatDate = (d: string) =>
    new Date(d + 'T12:00:00').toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  if (loading) return (
    <div className="px-5 py-8 space-y-3">
      {[1, 2, 3].map(i => <div key={i} className="skeleton h-24 w-full" />)}
    </div>
  )

  if (bookings.length === 0) return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </div>
      <p className="font-display text-xl font-light mb-1" style={{ color: 'var(--text)' }}>Sin reservas</p>
      <p className="label-sm">Tus citas aparecerán aquí</p>
    </div>
  )

  return (
    <div className="px-5 py-6 space-y-4">
      {bookings.map((b, i) => (
        <div
          key={b.id}
          className="card p-4"
          style={{ animationDelay: `${i * 0.07}s`, animation: 'fadeUp 0.5s ease both' }}
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="font-medium text-sm" style={{ color: 'var(--text)' }}>{b.client_name}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{b.client_phone}</p>
            </div>
            <span className="badge-confirmed">Confirmada</span>
          </div>
          <div className="gold-divider mb-3" />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="label-sm mb-0.5">Servicio</p>
              <p className="text-xs" style={{ color: 'var(--text-2)' }}>
                {(b.services as { name: string } | undefined)?.name ?? 'Servicio'}
              </p>
            </div>
            <div>
              <p className="label-sm mb-0.5">Fecha</p>
              <p className="text-xs" style={{ color: 'var(--text-2)' }}>{formatDate(b.date)}</p>
            </div>
            <div>
              <p className="label-sm mb-0.5">Hora</p>
              <p className="text-xs font-medium" style={{ color: 'var(--gold)' }}>{b.time}</p>
            </div>
            {b.notes && (
              <div>
                <p className="label-sm mb-0.5">Notas</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{b.notes}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
