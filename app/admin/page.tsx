'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import type { Booking } from '@/lib/supabase'

const ALL_SLOTS = ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00']

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [cancelling, setCancelling] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'all'>('today')
  const router = useRouter()

  const fetchBookings = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/bookings')
      const data = await res.json()
      setBookings(data.data || [])
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchBookings() }, [fetchBookings])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const cancel = async (id: string) => {
    if (!confirm('¿Cancelar esta reserva?')) return
    setCancelling(id)
    await fetch(`/api/bookings/${id}`, { method: 'DELETE' })
    setCancelling(null)
    fetchBookings()
  }

  const today = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split('T')[0]

  const todayBookings = bookings.filter(b => b.date === today).sort((a,b) => a.time.localeCompare(b.time))
  const upcomingBookings = bookings.filter(b => b.date > today).sort((a,b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
  const allBookings = bookings.sort((a,b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))

  const displayBookings = activeTab === 'today' ? todayBookings : activeTab === 'upcoming' ? upcomingBookings : allBookings

  const formatDate = (d: string) => {
    if (d === today) return 'Hoy'
    if (d === tomorrowStr) return 'Mañana'
    return new Date(d + 'T12:00:00').toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  // Group by date for calendar view
  const grouped = displayBookings.reduce<Record<string, Booking[]>>((acc, b) => {
    if (!acc[b.date]) acc[b.date] = []
    acc[b.date].push(b)
    return acc
  }, {})

  // Revenue estimate
  const totalRevenue = bookings.reduce((sum, b) => {
    const price = (b.services as { price?: number } | undefined)?.price || 0
    return sum + price
  }, 0)

  const dayBookings = bookings.filter(b => b.date === selectedDate).sort((a,b) => a.time.localeCompare(b.time))

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

      {/* ── Header ── */}
      <header className="sticky top-0 z-20 px-5 pt-safe"
        style={{ background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-2xl mx-auto py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round">
                <path d="M3 3l18 18M3 21l9-9M15 3l6 6-7.5 7.5"/>
              </svg>
            </div>
            <div>
              <p className="font-display text-base font-light" style={{ color: 'var(--text)', letterSpacing: '0.05em' }}>AgendaPro</p>
              <p className="label-sm" style={{ fontSize: '0.6rem' }}>Panel administrador</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--text-muted)', border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Salir
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-6 space-y-6">

        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-3 anim-fade-up">
          {[
            { label: 'Hoy', value: todayBookings.length, unit: 'citas' },
            { label: 'Pendientes', value: upcomingBookings.length, unit: 'próximas' },
            { label: 'Ingresos', value: `$${Math.round(totalRevenue/1000)}k`, unit: 'estimado' },
          ].map((s, i) => (
            <div key={i} className="card p-4 text-center">
              <p className="label-sm mb-1">{s.label}</p>
              <p className="font-display font-light" style={{ color: 'var(--gold)', fontSize: '1.8rem', lineHeight: 1 }}>{s.value}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.65rem', marginTop: 4 }}>{s.unit}</p>
            </div>
          ))}
        </div>

        {/* ── Timeline view ── */}
        <div className="anim-fade-up-1">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg font-light" style={{ color: 'var(--text)' }}>Vista del día</h2>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="input"
              style={{ colorScheme: 'dark', width: 'auto', padding: '0.4rem 0.7rem', fontSize: '0.8rem' }}
            />
          </div>

          <div className="card p-4">
            {loading ? (
              <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-14" />)}</div>
            ) : dayBookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="font-display text-lg font-light mb-1" style={{ color: 'var(--text-muted)' }}>
                  Sin citas para {formatDate(selectedDate)}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {ALL_SLOTS.map(hour => {
                  const b = dayBookings.find(bk => bk.time === hour)
                  if (!b) return null
                  return (
                    <div key={hour} className="flex items-start gap-3 py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                      <div className="flex-shrink-0 w-12 pt-0.5">
                        <span className="text-xs font-semibold" style={{ color: 'var(--gold)' }}>{hour}</span>
                      </div>
                      <div className="timeline-dot" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{b.client_name}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {(b.services as { name: string } | undefined)?.name} · {b.client_phone}
                        </p>
                        {b.notes && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>📝 {b.notes}</p>}
                      </div>
                      <button
                        onClick={() => cancel(b.id)}
                        disabled={cancelling === b.id}
                        className="flex-shrink-0 text-xs px-2 py-1 rounded-lg"
                        style={{ background: 'rgba(239,68,68,0.08)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.15)', cursor: 'pointer' }}
                      >
                        {cancelling === b.id ? '...' : '✕'}
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── All bookings ── */}
        <div className="anim-fade-up-2">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="font-display text-lg font-light" style={{ color: 'var(--text)' }}>Todas las citas</h2>
          </div>

          {/* Tab filter */}
          <div className="chips-scroll mb-4">
            {[
              { id: 'today', label: `Hoy (${todayBookings.length})` },
              { id: 'upcoming', label: `Próximas (${upcomingBookings.length})` },
              { id: 'all', label: `Todas (${allBookings.length})` },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as typeof activeTab)}
                className={`chip ${activeTab === t.id ? 'active' : ''}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-20" />)}</div>
          ) : displayBookings.length === 0 ? (
            <div className="card p-8 text-center">
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No hay citas en esta vista</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(grouped).map(([date, items]) => (
                <div key={date}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="chip active text-xs">{formatDate(date)}</span>
                    <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                  </div>
                  <div className="space-y-2">
                    {items.map(b => (
                      <div key={b.id} className="card card-hover p-3.5 flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
                          style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)' }}>
                          <span className="font-display font-semibold" style={{ color: 'var(--gold)', fontSize: '0.95rem', lineHeight: 1 }}>
                            {b.time.split(':')[0]}
                          </span>
                          <span style={{ color: 'var(--gold-dark)', fontSize: '0.55rem' }}>:{b.time.split(':')[1]}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{b.client_name}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {(b.services as { name: string } | undefined)?.name} · {b.client_phone}
                          </p>
                          {b.notes && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>📝 {b.notes}</p>}
                        </div>
                        <button
                          onClick={() => cancel(b.id)}
                          disabled={cancelling === b.id}
                          className="flex-shrink-0 text-xs px-2.5 py-1.5 rounded-lg"
                          style={{ background: 'rgba(239,68,68,0.07)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.12)', cursor: 'pointer' }}
                        >
                          {cancelling === b.id ? '...' : 'Cancelar'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      <footer className="py-5 text-center mt-4 pb-safe">
        <div className="gold-divider-full mb-4 opacity-10" />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', letterSpacing: '0.1em' }}>
          AGENDAPRO · PANEL ADMINISTRATIVO
        </p>
      </footer>
    </div>
  )
}
