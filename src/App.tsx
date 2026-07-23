import { HashRouter, NavLink, Route, Routes } from 'react-router-dom'
import { AuthGate } from './auth/AuthGate'
import { supabase } from './lib/supabaseClient'
import { GuiaPreparacion } from './features/guia-preparacion/GuiaPreparacion'
import { RegistroComidas } from './features/registro-comidas/RegistroComidas'
import { CalendarioIntroduccion } from './features/calendario-introduccion/CalendarioIntroduccion'
import { ContadorConsumo } from './features/contador-consumo/ContadorConsumo'

const NAV_ITEMS = [
  { to: '/', label: 'Registro', end: true },
  { to: '/calendario', label: 'Calendario' },
  { to: '/guia', label: 'Guía' },
  { to: '/consumo', label: 'Consumo' },
]

function AppShell() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <header className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <span className="text-sm font-semibold">Alimentación complementaria</span>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
          >
            Salir
          </button>
        </div>
        <nav className="mx-auto flex max-w-3xl gap-1 px-4 pb-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-full px-3 py-1.5 text-sm ${
                  isActive
                    ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                    : 'text-neutral-600 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-800'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        <Routes>
          <Route path="/" element={<RegistroComidas />} />
          <Route path="/calendario" element={<CalendarioIntroduccion />} />
          <Route path="/guia" element={<GuiaPreparacion />} />
          <Route path="/consumo" element={<ContadorConsumo />} />
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
