'use client'

import { useState, useEffect } from 'react'
import type { Service } from '@/lib/supabase'

type FormData = {
  client_name: string
  client_email: string
  client_phone: string
  date: string
  time: string
  service_id: string
  notes: string
}

const EMPTY: FormData = {
  client_name: '', client_email: '', client_phone: '',
  date: '', time: '', service_id: '', notes: '',
}

export default function BookingForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState<FormData>(EMPTY)
  const [services, setServices] = useState<Service[]>([])
  const [slots, setSlots] = useState<string[]>([])
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    fetch('/api/services').then(r => r.json()).then(d => setServices(d.data || []))
  }, [])

  useEffect(() => {
    if (form.date) {
      fetch(`/api/available/${form.date}`).then(r => r.json()).then(d => setSlots(d.data || []))
    }
  }, [form.date])

  const set = (k: keyof FormData, v: string) => setForm(p => ({ ...p, [k]: v }))
  const today = new Date().toISOString().split('T')[0]
  const selected = services.find(s => s.id === form.service_id)

  const handleSubmit = async () => {
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al crear la reserva')
      setDone(true)
      setTimeout(() => { setDone(false); setForm(EMPTY); setStep(1); onSuccess() }, 4000)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { n: 1, label: 'Datos' },
    { n: 2, label: 'Servicio' },
    { n: 3, label: 'Horario' },
  ]

  if (done) return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center anim-scale-in">
      <div className="check-circle mb-6">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2 className="font-display text-3xl font-light mb-3" style={{ color: 'var(--text)' }}>
        ¡Reserva confirmada!
      </h2>
      <p className="label-sm mb-6">Tu cita ha sido agendada</p>
      <div className="summary-box w-full max-w-xs text-left">
        <p className="text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>{form.client_name}</p>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{selected?.name} · {form.time}</p>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {new Date(form.date + 'T12:00:00').toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>
      <p className="text-xs mt-5" style={{ color: 'var(--text-muted)' }}>
        El profesional recibirá tu reserva automáticamente
      </p>
    </div>
  )

  return (
    <div className="w-full max-w-md mx-auto px-5 py-8">

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-0 mb-10">
        {steps.map((s, i) => (
          <div key={s.n} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`step-dot ${step === s.n ? 'active' : step > s.n ? 'done' : 'pending'}`}>
                {step > s.n
                  ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  : s.n
                }
              </div>
              <span className="label-sm" style={{ color: step >= s.n ? 'var(--gold)' : 'var(--text-muted)', fontSize: '0.6rem' }}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="step-line w-16 mb-4 mx-1" style={{ background: step > s.n ? 'var(--gold)' : 'var(--border)' }} />
            )}
          </div>
        ))}
      </div>

      {/* ── STEP 1: Datos ── */}
      {step === 1 && (
        <div className="anim-fade-up space-y-5">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-light mb-1" style={{ color: 'var(--text)' }}>Tus datos</h2>
            <p className="label-sm">Información de contacto</p>
          </div>

          {[
            { key: 'client_name', label: 'Nombre completo', type: 'text', placeholder: 'Juan Pérez' },
            { key: 'client_email', label: 'Correo electrónico', type: 'email', placeholder: 'juan@email.com' },
            { key: 'client_phone', label: 'Teléfono', type: 'tel', placeholder: '+56 9 1234 5678' },
          ].map(f => (
            <div key={f.key} className="space-y-1.5">
              <label className="label-sm block">{f.label}</label>
              <input
                className="input"
                type={f.type}
                placeholder={f.placeholder}
                value={form[f.key as keyof FormData]}
                onChange={e => set(f.key as keyof FormData, e.target.value)}
              />
            </div>
          ))}

          <button
            className="btn-gold mt-2"
            onClick={() => setStep(2)}
            disabled={!form.client_name || !form.client_email || !form.client_phone}
          >
            Continuar
          </button>
        </div>
      )}

      {/* ── STEP 2: Servicio ── */}
      {step === 2 && (
        <div className="anim-fade-up">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-light mb-1" style={{ color: 'var(--text)' }}>Elige tu servicio</h2>
            <p className="label-sm">Selecciona lo que necesitas</p>
          </div>

          <div className="space-y-2.5 mb-6">
            {services.map(s => (
              <button
                key={s.id}
                onClick={() => set('service_id', s.id)}
                className={`service-card w-full text-left ${form.service_id === s.id ? 'selected' : ''}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm mb-0.5" style={{ color: 'var(--text)' }}>{s.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.duration} min · {s.description}</p>
                  </div>
                  <div className="text-right ml-3 flex-shrink-0">
                    <p className="font-semibold text-sm" style={{ color: 'var(--gold)' }}>
                      ${s.price.toLocaleString('es-CL')}
                    </p>
                    {form.service_id === s.id && (
                      <div className="flex justify-end mt-1">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'var(--gold)' }}>
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#080808" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-2.5">
            <button className="btn-ghost" onClick={() => setStep(1)}>← Volver</button>
            <button className="btn-gold" onClick={() => setStep(3)} disabled={!form.service_id}>Continuar</button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Fecha y hora ── */}
      {step === 3 && (
        <div className="anim-fade-up">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-light mb-1" style={{ color: 'var(--text)' }}>Fecha y hora</h2>
            <p className="label-sm">¿Cuándo te viene bien?</p>
          </div>

          <div className="space-y-4 mb-5">
            <div className="space-y-1.5">
              <label className="label-sm block">Fecha</label>
              <input
                className="input"
                type="date"
                min={today}
                value={form.date}
                style={{ colorScheme: 'dark' }}
                onChange={e => { set('date', e.target.value); set('time', '') }}
              />
            </div>

            {form.date && (
              <div className="space-y-2 anim-fade-up">
                <label className="label-sm block">Horario disponible</label>
                {slots.length === 0 ? (
                  <div className="text-center py-6" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    Sin horarios disponibles para esta fecha
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-1.5">
                    {slots.map(slot => (
                      <button
                        key={slot}
                        onClick={() => set('time', slot)}
                        className={`time-slot ${form.time === slot ? 'selected' : ''}`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="label-sm block">Notas (opcional)</label>
              <textarea
                className="input"
                rows={2}
                placeholder="Preferencias o comentarios..."
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                style={{ resize: 'none' }}
              />
            </div>
          </div>

          {/* Summary */}
          {selected && form.time && (
            <div className="summary-box mb-5 anim-fade-up">
              <p className="label-sm mb-2" style={{ color: 'var(--gold)' }}>Resumen de tu cita</p>
              <div className="space-y-0.5">
                <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{form.client_name}</p>
                <p className="text-sm" style={{ color: 'var(--text-2)' }}>{selected.name}</p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {new Date(form.date + 'T12:00:00').toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })} · {form.time}
                </p>
                <p className="text-sm font-semibold mt-1" style={{ color: 'var(--gold)' }}>
                  ${selected.price.toLocaleString('es-CL')}
                </p>
              </div>
            </div>
          )}

          {error && <div className="alert-error mb-4">{error}</div>}

          <div className="flex gap-2.5">
            <button className="btn-ghost" onClick={() => setStep(2)}>← Volver</button>
            <button className="btn-gold" onClick={handleSubmit} disabled={!form.date || !form.time || loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Confirmando...
                </span>
              ) : 'Confirmar reserva'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
