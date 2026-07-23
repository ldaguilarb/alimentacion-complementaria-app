import { useMemo, useState } from 'react'
import { useAlimentos } from '../../lib/useAlimentos'
import { useRegistros } from '../../lib/useRegistros'
import { GRUPO_COLOR, GRUPO_LABEL } from '../../types/alimento'

type Orden = 'consumo' | 'nombre'

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

export function ContadorConsumo() {
  const { alimentos, loading: loadingAlimentos } = useAlimentos()
  const { registros, loading: loadingRegistros } = useRegistros()
  const [orden, setOrden] = useState<Orden>('consumo')

  const conteos = useMemo(() => {
    const porAlimento = new Map<string, number>()
    for (const r of registros) {
      porAlimento.set(r.alimento_id, (porAlimento.get(r.alimento_id) ?? 0) + 1)
    }
    const filas = alimentos.map((a) => ({ alimento: a, veces: porAlimento.get(a.id) ?? 0 }))
    filas.sort((a, b) =>
      orden === 'consumo'
        ? b.veces - a.veces || a.alimento.nombre.localeCompare(b.alimento.nombre)
        : a.alimento.nombre.localeCompare(b.alimento.nombre),
    )
    return filas
  }, [alimentos, registros, orden])

  const maxVeces = useMemo(() => Math.max(...conteos.map((c) => c.veces), 1), [conteos])

  if (loadingAlimentos || loadingRegistros) return <Spinner />

  const totalRegistros = conteos.reduce((sum, c) => sum + c.veces, 0)
  const alimentosComidos = conteos.filter((c) => c.veces > 0).length

  return (
    <div className="space-y-5">
      {/* Stats summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white p-4 text-center" style={{ border: '1px solid #EDE8E0' }}>
          <p className="text-2xl font-black text-stone-800">{totalRegistros}</p>
          <p className="text-xs font-semibold text-stone-500 mt-0.5">registros totales</p>
        </div>
        <div
          className="rounded-2xl p-4 text-center"
          style={{ background: '#E8F5EB', border: '1px solid #C6DECA' }}
        >
          <p className="text-2xl font-black" style={{ color: '#2D7A3C' }}>{alimentosComidos}</p>
          <p className="text-xs font-semibold mt-0.5" style={{ color: '#4A9A5C' }}>
            alimentos probados
          </p>
        </div>
      </div>

      {/* Sort controls */}
      <div className="flex gap-1.5">
        {([['consumo', 'Más consumidos'], ['nombre', 'Alfabético']] as const).map(([val, label]) => (
          <button
            key={val}
            onClick={() => setOrden(val)}
            className="rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all"
            style={
              orden === val
                ? { background: '#2D7A3C', color: '#fff' }
                : { background: '#fff', color: '#78716C', border: '1px solid #EDE8E0' }
            }
          >
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="rounded-2xl overflow-hidden bg-white" style={{ border: '1px solid #EDE8E0' }}>
        {conteos.map(({ alimento, veces }, i) => {
          const color  = GRUPO_COLOR[alimento.grupo]
          const barPct = maxVeces > 0 ? (veces / maxVeces) * 100 : 0

          return (
            <div
              key={alimento.id}
              className="fade-up flex items-center gap-3 px-4 py-3"
              style={{
                borderTop: i > 0 ? '1px solid #F5F4F2' : 'none',
                animationDelay: `${Math.min(i * 30, 300)}ms`,
              }}
            >
              {/* Group badge */}
              <span
                className="shrink-0 rounded-full px-2 py-0.5 text-xs font-bold text-white"
                style={{ background: color.accent }}
              >
                {GRUPO_LABEL[alimento.grupo]}
              </span>

              {/* Name + bar */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-stone-700">{alimento.nombre}</p>
                {veces > 0 && (
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-stone-100">
                    <div
                      className="h-full rounded-full fill-bar"
                      style={{
                        width: `${barPct}%`,
                        background: color.accent,
                        animationDelay: `${Math.min(i * 30, 300) + 150}ms`,
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Count */}
              <span
                className="shrink-0 text-sm font-black tabular-nums"
                style={{ color: veces > 0 ? color.dark : '#C4B9B4', minWidth: '2ch', textAlign: 'right' }}
              >
                {veces}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
