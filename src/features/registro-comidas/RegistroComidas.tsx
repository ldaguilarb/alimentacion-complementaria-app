import { useMemo, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useAlimentos } from '../../lib/useAlimentos'
import { useRegistros } from '../../lib/useRegistros'
import {
  GRUPO_COLOR,
  GRUPO_LABEL,
  TIEMPO_COMIDA_LABEL,
  type Grupo,
  type TiempoComida,
} from '../../types/alimento'

const GRUPOS: Grupo[] = ['cereal', 'fruta', 'verdura', 'proteina']
const TIEMPOS: TiempoComida[] = ['desayuno', 'almuerzo', 'cena']

function today() {
  return new Date().toISOString().slice(0, 10)
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div
        className="h-8 w-8 rounded-full border-2 border-stone-200 animate-spin"
        style={{ borderTopColor: '#2D7A3C' }}
      />
    </div>
  )
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export function RegistroComidas() {
  const { alimentos, loading: loadingAlimentos } = useAlimentos()
  const { registros, loading: loadingRegistros, refetch } = useRegistros()
  const [fecha, setFecha]   = useState(today())
  const [tiempo, setTiempo] = useState<TiempoComida>('almuerzo')
  const [seleccion, setSeleccion] = useState<Record<Grupo, string>>({
    cereal: '', fruta: '', verdura: '', proteina: '',
  })
  const [saving, setSaving] = useState(false)

  const alimentosPorId = useMemo(
    () => new Map(alimentos.map((a) => [a.id, a])),
    [alimentos],
  )

  const registrosDeEstaComida = useMemo(
    () => registros.filter((r) => r.fecha === fecha && r.tiempo_comida === tiempo),
    [registros, fecha, tiempo],
  )

  async function agregar(grupo: Grupo) {
    const alimentoId = seleccion[grupo]
    if (!alimentoId) return
    setSaving(true)
    await supabase.from('registros_comida').insert({
      fecha, tiempo_comida: tiempo, alimento_id: alimentoId, cantidad: '1 cucharada',
    })
    setSeleccion((s) => ({ ...s, [grupo]: '' }))
    await refetch()
    setSaving(false)
  }

  async function quitar(id: string) {
    setSaving(true)
    await supabase.from('registros_comida').delete().eq('id', id)
    await refetch()
    setSaving(false)
  }

  if (loadingAlimentos || loadingRegistros) return <Spinner />

  const gruposCompletos = GRUPOS.filter((g) =>
    registrosDeEstaComida.some((r) => alimentosPorId.get(r.alimento_id)?.grupo === g),
  ).length

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="self-start rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-semibold text-stone-700 outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
        />
        <div className="flex gap-1.5">
          {TIEMPOS.map((t) => (
            <button
              key={t}
              onClick={() => setTiempo(t)}
              className="flex-1 rounded-full px-3.5 py-2 text-sm font-semibold transition-all sm:flex-none sm:py-1.5"
              style={
                tiempo === t
                  ? { background: '#2D7A3C', color: '#fff' }
                  : { background: '#fff', color: '#78716C', border: '1px solid #EDE8E0' }
              }
            >
              {TIEMPO_COMIDA_LABEL[t]}
            </button>
          ))}
        </div>
      </div>

      {/* Progress summary */}
      <div
        className="flex items-center gap-3 rounded-xl px-4 py-3"
        style={{ background: '#E8F5EB', borderLeft: '3px solid #2D7A3C' }}
      >
        <div className="flex gap-1.5">
          {GRUPOS.map((g) => {
            const done = registrosDeEstaComida.some(
              (r) => alimentosPorId.get(r.alimento_id)?.grupo === g,
            )
            return (
              <div
                key={g}
                className="h-2.5 w-2.5 rounded-full transition-all"
                style={{ background: done ? GRUPO_COLOR[g].accent : '#C6DECA' }}
                title={GRUPO_LABEL[g]}
              />
            )
          })}
        </div>
        <p className="text-sm text-stone-600">
          {gruposCompletos === 4
            ? 'Todos los grupos registrados para esta comida.'
            : `${gruposCompletos} de 4 grupos · Porción sugerida: 1 cucharada por grupo.`}
        </p>
      </div>

      {/* Group cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {GRUPOS.map((grupo, i) => {
          const color = GRUPO_COLOR[grupo]
          const items = registrosDeEstaComida.filter(
            (r) => alimentosPorId.get(r.alimento_id)?.grupo === grupo,
          )
          const opciones = alimentos.filter((a) => a.grupo === grupo)
          const logged = items.length > 0

          return (
            <div
              key={grupo}
              className="fade-up rounded-xl p-4 transition-all"
              style={{
                background: logged ? color.light : '#FFFFFF',
                border: '1px solid #EDE8E0',
                borderLeft: `3px solid ${color.accent}`,
                animationDelay: `${i * 55}ms`,
              }}
            >
              {/* Card header */}
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-bold text-stone-800">{GRUPO_LABEL[grupo]}</h3>
                {logged ? (
                  <span
                    className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold text-white"
                    style={{ background: color.accent }}
                  >
                    <CheckIcon />
                    {items.length} listo{items.length > 1 ? 's' : ''}
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-stone-400">pendiente</span>
                )}
              </div>

              {/* Logged items */}
              <ul className="mb-3 space-y-1">
                {items.map((r) => (
                  <li
                    key={r.id}
                    className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-sm"
                    style={{ background: `${color.accent}18` }}
                  >
                    <span className="font-semibold text-stone-700">
                      {alimentosPorId.get(r.alimento_id)?.nombre ?? '—'}
                    </span>
                    <button
                      onClick={() => quitar(r.id)}
                      disabled={saving}
                      className="ml-2 text-base leading-none text-stone-400 transition-colors hover:text-red-500"
                      aria-label="Quitar"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>

              {/* Add row */}
              <div className="flex gap-2">
                <select
                  value={seleccion[grupo]}
                  onChange={(e) => setSeleccion((s) => ({ ...s, [grupo]: e.target.value }))}
                  className="min-w-0 flex-1 rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-sm text-stone-700 outline-none"
                >
                  <option value="">Elegir alimento…</option>
                  {opciones.map((a) => (
                    <option key={a.id} value={a.id}>{a.nombre}</option>
                  ))}
                </select>
                <button
                  onClick={() => agregar(grupo)}
                  disabled={!seleccion[grupo] || saving}
                  className="rounded-lg px-3.5 py-1.5 text-base font-bold text-white transition-opacity disabled:opacity-40"
                  style={{ background: color.dark }}
                  aria-label={`Agregar ${GRUPO_LABEL[grupo]}`}
                >
                  +
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
