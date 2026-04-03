'use client'

import { useState } from 'react'
import BookingForm from '@/components/BookingForm'
import BookingList from '@/components/BookingList'
import Link from 'next/link'

export default function Home() {
  const [tab, setTab] = useState<'book' | 'list'>('book')
  const [refresh, setRefresh] = useState(false)

  const onSuccess = () => { setRefresh(p => !p); setTab('list') }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>

      {/* ── Hero header ── */}
      <header className="relative pt-10 pb-6 px-5 text-center overflow-hidden">
        {/* Decorative top line */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)' }} />

      {/* Logo mark */}
      <div className="flex items-center justify-center gap-2.5 mb-5 anim-fade-up">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="1" width="6" height="22" rx="3" stroke="var(--gold)" strokeWidth="1.5"/>
            <path d="M9 6h6" stroke="#e74c3c" strokeWidth="2"/>
            <path d="M9 10h6" stroke="white" strokeWidth="2"/>
            <path d="M9 14h6" stroke="#e74c3c" strokeWidth="2"/>
            <path d="M9 18h6" stroke="white" strokeWidth="2"/>
          </svg>
        </div>
        <span className="font-display text-lg font-light tracking-widest" style={{ color: 'var(--gold)', letterSpacing: '0.2em' }}>
          AGENDAPRO
        </span>
      </div>

        <h1 className="font-display anim-fade-up-1" style={{ fontSize: 'clamp(2rem, 7vw, 3.2rem)', fontWeight: 300, color: 'var(--text)', lineHeight: 1.15, letterSpacing: '-0.01em' }}>
          Sistema de Agenda
          <br />
          <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Profesional</em>
        </h1>

        <p className="mt-3 anim-fade-up-2" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 300, letterSpacing: '0.02em' }}>
          Reserva tu cita de forma simple y rápida
        </p>

        {/* Decorative line */}
        <div className="flex items-center justify-center gap-3 mt-5 anim-fade-up-3">
          <div style={{ width: 30, height: 1, background: 'rgba(201,168,76,0.3)' }} />
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--gold)', opacity: 0.6 }} />
          <div style={{ width: 30, height: 1, background: 'rgba(201,168,76,0.3)' }} />
        </div>

        {/* Admin link top right */}
        <Link
          href="/login"
          className="absolute top-4 right-4 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
          style={{ color: 'var(--text-muted)', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          Admin
        </Link>
      </header>

      {/* ── Tabs ── */}
      <div className="max-w-md mx-auto w-full px-5 anim-fade-up-4">
        <div className="tab-bar">
          {[
            { id: 'book', label: 'Nueva reserva' },
            { id: 'list', label: 'Mis citas' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as 'book' | 'list')}
              className={`tab-item ${tab === t.id ? 'active' : ''}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <main className="flex-1 max-w-md mx-auto w-full">
        {tab === 'book'
          ? <BookingForm onSuccess={onSuccess} />
          : <BookingList refresh={refresh} />
        }
      </main>

      {/* ── Footer ── */}
      <footer className="py-5 text-center pb-safe">
        <div className="gold-divider-full mb-4 opacity-10" />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', letterSpacing: '0.1em' }}>
          AGENDAPRO · SISTEMA DE AGENDA · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  )
}
