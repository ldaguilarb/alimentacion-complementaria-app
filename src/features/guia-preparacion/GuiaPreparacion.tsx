import { useMemo, useState } from 'react'
import { useAlimentos } from '../../lib/useAlimentos'
import { useRecetas } from '../../lib/useRecetas'
import {
  GRUPO_COLOR,
  GRUPO_LABEL,
  SUBGRUPO_LABEL,
  type Grupo,
} from '../../types/alimento'
import { SeguridadAlimentaria } from './SeguridadAlimentaria'

const GRUPOS: (Grupo | 'todos')[] = ['todos', 'cereal', 'fruta', 'verdura', 'proteina']

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

function AlertDot() {
  return (
    <span
      className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-black text-white"
      style={{ background: '#D4561A' }}
      title="Alergénico"
    >
      !
    </span>
  )
}

export function GuiaPreparacion() {
  const { alimentos, loading: loadingAlimentos } = useAlimentos()
  const { recetas, loading: loadingRecetas }     = useRecetas()
  const [filtro, setFiltro]               = useState<Grupo | 'todos'>('todos')
  const [seleccionadoId, setSeleccionadoId] = useState<string | null>(null)

  const alimentosFiltrados = useMemo(
    () => (filtro === 'todos' ? alimentos : alimentos.filter((a) => a.grupo === filtro)),
    [alimentos, filtro],
  )

  const seleccionado = alimentos.find((a) => a.id === seleccionadoId) ?? null

  const receta = useMemo(() => {
    if (!seleccionado) return null
    return (
      recetas.find((r) => r.alimento_id === seleccionado.id) ??
      recetas.find((r) => r.alimento_id === null && r.subgrupo === seleccionado.subgrupo) ??
      null
    )
  }, [recetas, seleccionado])

  if (loadingAlimentos || loadingRecetas) return <Spinner />

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-wrap gap-1.5">
        {GRUPOS.map((g) => {
          const isActive = filtro === g
          const color = g !== 'todos' ? GRUPO_COLOR[g] : null
          return (
            <button
              key={g}
              onClick={() => setFiltro(g)}
              className="rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all"
              style={
                isActive
                  ? {
                      background: color ? color.accent : '#2D7A3C',
                      color: '#fff',
                      border: `1px solid ${color ? color.accent : '#2D7A3C'}`,
                    }
                  : {
                      background: '#fff',
                      color: '#78716C',
                      border: '1px solid #EDE8E0',
                    }
              }
            >
              {g === 'todos' ? 'Todos' : GRUPO_LABEL[g]}
            </button>
          )
        })}
      </div>

      {/* List + detail */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Food list – hidden on mobile when detail is open */}
        <div
          className={`overflow-y-auto rounded-2xl p-2 sm:block sm:max-h-96 ${seleccionado ? 'hidden' : 'block max-h-80'}`}
          style={{ background: '#fff', border: '1px solid #EDE8E0' }}
        >
          {alimentosFiltrados.length === 0 && (
            <p className="px-3 py-4 text-sm text-stone-400">Sin alimentos en este grupo.</p>
          )}
          {alimentosFiltrados.map((a) => {
            const isSelected = seleccionadoId === a.id
            const color = GRUPO_COLOR[a.grupo]
            return (
              <button
                key={a.id}
                onClick={() => setSeleccionadoId(a.id)}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition-all"
                style={
                  isSelected
                    ? { background: '#1C1917', color: '#fff' }
                    : { color: '#44403C' }
                }
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: isSelected ? '#fff' : color.accent }}
                />
                <span className="flex-1 font-semibold">{a.nombre}</span>
                {a.es_alergenico && !isSelected && <AlertDot />}
                {a.es_alergenico && isSelected && (
                  <span className="text-[10px] font-bold text-orange-300">ALERG.</span>
                )}
              </button>
            )
          })}
        </div>

        {/* Detail panel – always visible on desktop; on mobile only when something selected */}
        <div
          className={`rounded-2xl p-5 sm:block ${seleccionado ? 'block' : 'hidden'}`}
          style={{ background: '#fff', border: '1px solid #EDE8E0' }}
        >
          {!seleccionado && (
            <div className="flex h-full flex-col items-center justify-center py-8 text-center">
              <div className="mb-3 text-3xl text-stone-200">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-stone-400">Elige un alimento para ver cómo prepararlo.</p>
            </div>
          )}

          {seleccionado && (() => {
            const color = GRUPO_COLOR[seleccionado.grupo]
            return (
              <div className="space-y-4 fade-up">
                {/* Back button – mobile only */}
                <button
                  onClick={() => setSeleccionadoId(null)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-stone-500 sm:hidden"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                  Volver a la lista
                </button>

                {/* Food header */}
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span
                      className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white"
                      style={{ background: color.accent }}
                    >
                      {GRUPO_LABEL[seleccionado.grupo]}
                    </span>
                    {seleccionado.es_alergenico && (
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                        style={{ background: '#FEF0E8', color: '#D4561A' }}
                      >
                        Alergénico
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-stone-900">{seleccionado.nombre}</h2>
                  <p className="text-sm text-stone-500">{SUBGRUPO_LABEL[seleccionado.subgrupo]}</p>
                  {seleccionado.nombres_alternos && (
                    <p className="mt-0.5 text-xs text-stone-400">
                      También: {seleccionado.nombres_alternos}
                    </p>
                  )}
                </div>

                {/* Recipe */}
                {receta ? (
                  <div className="space-y-3">
                    {receta.ingredientes && (
                      <div>
                        <p className="mb-1 text-xs font-bold uppercase tracking-wide text-stone-400">Ingredientes</p>
                        <p className="text-sm text-stone-700">{receta.ingredientes}</p>
                      </div>
                    )}
                    <div>
                      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-stone-400">Preparación</p>
                      <p className="text-sm text-stone-700">{receta.pasos}</p>
                    </div>
                    {receta.notas && (
                      <div
                        className="rounded-xl px-3.5 py-3 text-sm text-stone-600"
                        style={{ background: color.light, borderLeft: `3px solid ${color.accent}` }}
                      >
                        <span className="font-bold text-stone-700">Nota: </span>
                        {receta.notas}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-stone-400">Sin receta cargada para este subgrupo todavía.</p>
                )}
              </div>
            )
          })()}
        </div>
      </div>

      <SeguridadAlimentaria />
    </div>
  )
}
