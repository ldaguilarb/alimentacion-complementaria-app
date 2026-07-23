import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'

export function AuthGate({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => subscription.subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: '#F9F6F0' }}>
        <div
          className="h-8 w-8 rounded-full border-2 border-stone-200 animate-spin"
          style={{ borderTopColor: '#2D7A3C' }}
        />
      </div>
    )
  }

  if (!session) {
    return <LoginForm />
  }

  return <>{children}</>
}

function LoginForm() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setSubmitting(false)
    if (error) setError(`${error.message} (status ${error.status ?? '?'})`)
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4"
      style={{ background: '#F9F6F0' }}
    >
      {/* Brand mark */}
      <div className="mb-8 flex flex-col items-center text-center fade-up">
        <div
          className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ background: '#E8F5EB', boxShadow: '0 2px 8px rgba(45, 122, 60, 0.15)' }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2D7A3C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-stone-800">Alimentación complementaria</h1>
        <p className="mt-1.5 text-sm text-stone-500">El primer año de sabores de tu bebé</p>
      </div>

      {/* Form card */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl bg-white p-6 space-y-4 fade-up"
        style={{
          boxShadow: '0 4px 24px rgba(26, 23, 20, 0.08), 0 1px 4px rgba(26, 23, 20, 0.04)',
          animationDelay: '80ms',
        }}
      >
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-stone-700">Correo</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-800 placeholder-stone-300 outline-none transition-all focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/10"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-stone-700">Contraseña</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-800 outline-none transition-all focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/10"
          />
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl py-2.5 text-sm font-bold text-white transition-all disabled:opacity-60"
          style={{ background: '#2D7A3C' }}
        >
          {submitting ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
