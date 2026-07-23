import { HashRouter, NavLink, Route, Routes } from 'react-router-dom'
import { AuthGate } from './auth/AuthGate'
import { supabase } from './lib/supabaseClient'
import { GuiaPreparacion } from './features/guia-preparacion/GuiaPreparacion'
import { RegistroComidas } from './features/registro-comidas/RegistroComidas'
import { CalendarioIntroduccion } from './features/calendario-introduccion/CalendarioIntroduccion'
import { ContadorConsumo } from './features/contador-consumo/ContadorConsumo'

function IconUtensils() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2s2-.9 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z" />
      <path d="M21 15v7" />
    </svg>
  )
}

function IconCalendar() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <path d="m9 16 2 2 4-4" />
    </svg>
  )
}

function IconBook() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  )
}

function IconBarChart() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  )
}

function LeafMark() {
  return (
    <div
      className="flex h-7 w-7 items-center justify-center rounded-lg"
      style={{ background: '#E8F5EB' }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2D7A3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>
    </div>
  )
}

const NAV_ITEMS = [
  { to: '/', label: 'Registro',   end: true,      icon: <IconUtensils /> },
  { to: '/calendario', label: 'Calendario',        icon: <IconCalendar /> },
  { to: '/guia',       label: 'Guía',              icon: <IconBook /> },
  { to: '/consumo',    label: 'Consumo',            icon: <IconBarChart /> },
]

function AppShell() {
  return (
    <div className="min-h-screen" style={{ background: '#F9F6F0' }}>
      <header className="sticky top-0 z-10 bg-white" style={{ boxShadow: '0 1px 0 #EDE8E0' }}>
        <div className="mx-auto max-w-2xl px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2.5">
              <LeafMark />
              <span className="text-[15px] font-bold text-stone-800 leading-none">
                Alimentación complementaria
              </span>
            </div>
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-xs font-semibold text-stone-400 hover:text-stone-700 transition-colors"
            >
              Salir
            </button>
          </div>

          <nav className="flex -mb-px">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2.5 text-sm font-semibold border-b-2 transition-all ${
                    isActive
                      ? 'border-brand-vivid text-stone-900'
                      : 'border-transparent text-stone-400 hover:text-stone-700 hover:border-stone-200'
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <Routes>
          <Route path="/"           element={<RegistroComidas />} />
          <Route path="/calendario" element={<CalendarioIntroduccion />} />
          <Route path="/guia"       element={<GuiaPreparacion />} />
          <Route path="/consumo"    element={<ContadorConsumo />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <HashRouter>
      <AuthGate>
        <AppShell />
      </AuthGate>
    </HashRouter>
  )
}

export default App
