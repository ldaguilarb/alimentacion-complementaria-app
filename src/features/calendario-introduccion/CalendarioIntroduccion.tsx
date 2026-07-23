import { useMemo } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useAlimentos } from '../../lib/useAlimentos'
import { useRegistros } from '../../lib/useRegistros'
import {
  ALERGENO_LABEL,
  GRUPO_COLOR,
  GRUPO_LABEL,
  type AlergenoCategoria,
  type Grupo,
} from '../../types/alimento'

const GRUPOS: Grupo[] = ['cereal', 'fruta', 'verdura', 'proteina']
const ALERGENOS: AlergenoCategoria[] = [
  'leche', 'huevo', 'soya', 'trigo_gluten', 'mani', 'frutos_secos', 'pescado', 'mariscos',
]
const META_EXPOSICIONES = 10

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

export function CalendarioIntroduccion() {
  const { alimentos, loading: loadingAlimentos } = useAlimentos()
  const { registros, loading: loadingRegistros, refetch } = useRegistros()

  const introducidos = useMemo(() => new Set(registros.map((r) => r.alimento_id)), [registros])

  const exposicionesPorAlergeno = useMemo(() => {
    const counts: Record<string, number> = {}
    const alimentosPorId = new Map(alimentos.map((a) => [a.id, a]))
    for (const r of registros) {
      const alimento = alimentosPorId.get(r.alimento_id)
      if (alimento?.es_alergenico && alimento.alergeno_categoria) {
        counts[alimento.alergeno_categoria] = (counts[alimento.alergeno_categoria] ?? 0) + 1
      }
    }
    return counts
  }, [alimentos, registros])

  async function introducirHoy(alimentoId: string) {
    await supabase.from('registros_comida').insert({
      fecha: today(), tiempo_comida: 'almuerzo', alimento_id: alimentoId, cantidad: '1 cucharada',
    })
    await refetch()
  }

  if (loadingAlimentos || loadingRegistros) return <Spinner />

  return (
    <div className="space-y-8">
      {/* Next foods to introduce */}
      <section>
        <h2 className="mb-1 text-base font-bold text-stone-800">Próximo alimento a introducir</h2>
        <p className="mb-4 text-sm text-stone-500">Introduce un alimento nuevo cada 3–5 días para identificar reacciones.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {GRUPOS.map((grupo, i) => {
            const color       = GRUPO_COLOR[grupo]
            const delGrupo    = alimentos.filter((a) => a.grupo === grupo)
            const yaIntroducidos = delGrupo.filter((a) => introducidos.has(a.id))
            const siguiente   = delGrupo.find((a) => !introducidos.has(a.id))
            const pct         = delGrupo.length ? (yaIntroducidos.length / delGrupo.length) * 100 : 0
            const completo    = yaIntroducidos.length === delGrupo.length

            return (
              <div
                key={grupo}
                className="fade-up rounded-xl p-4"
                style={{
                  background: completo ? color.light : '#FFFFFF',
                  border: '1px solid #EDE8E0',
                  borderLeft: `3px solid ${color.accent}`,
                  animationDelay: `${i * 55}ms`,
                }}
              >
                <div className="mb-2 flex items-baseline justify-between">
                  <h3 className="font-bold text-stone-800">{GRUPO_LABEL[grupo]}</h3>
                  <span className="text-xs font-semibold text-stone-400">
                    {yaIntroducidos.length}/{delGrupo.length}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-stone-100">
                  <div
                    className="h-full rounded-full fill-bar"
                    style={{ width: `${pct}%`, background: color.accent }}
                  />
                </div>

                {siguiente ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Siguiente</p>
                      <p className="text-sm font-semibold text-stone-700">{siguiente.nombre}</p>
                    </div>
                    <button
                      onClick={() => introducirHoy(siguiente.id)}
                      className="rounded-full px-3 py-1.5 text-xs font-bold text-white transition-opacity hover:opacity-85"
                      style={{ background: color.dark }}
                    >
                      Introducir hoy
                    </button>
                  </div>
                ) : (
                  <p className="text-sm font-semibold" style={{ color: color.accent }}>
                    Todos introducidos
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Allergen exposure tracker */}
      <section>
        <h2 className="mb-1 text-base font-bold text-stone-800">Exposición a alergénicos</h2>
        <p className="mb-4 text-sm text-stone-500">
          Meta: {META_EXPOSICIONES} exposiciones por alergénico (idealmente 2 por semana) para considerarlo tolerado.
        </p>

        <div className="rounded-2xl bg-white p-1" style={{ border: '1px solid #EDE8E0' }}>
          {ALERGENOS.map((a, i) => {
            const count    = exposicionesPorAlergeno[a] ?? 0
            const clamped  = Math.min(count, META_EXPOSICIONES)
            const pct      = (clamped / META_EXPOSICIONES) * 100
            const completo = count >= META_EXPOSICIONES

            return (
              <div
                key={a}
                className="fade-up flex items-center gap-3 rounded-xl px-4 py-3 transition-colors"
                style={{
                  background: completo ? '#E8F5EB' : 'transparent',
                  animationDelay: `${i * 40}ms`,
                }}
              >
                <span className="w-24 shrink-0 text-sm font-semibold text-stone-700 sm:w-28">
                  {ALERGENO_LABEL[a]}
                </span>

                <div className="flex-1">
                  <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                    <div
                      className="h-full rounded-full fill-bar"
                      style={{
                        width: `${pct}%`,
                        background: completo ? '#2D7A3C' : '#3D9A50',
                        animationDelay: `${i * 40 + 200}ms`,
                      }}
                    />
                  </div>
                </div>

                <span
                  className="w-12 shrink-0 text-right text-xs font-bold tabular-nums"
                  style={{ color: completo ? '#2D7A3C' : '#A8A09A' }}
                >
                  {clamped}/{META_EXPOSICIONES}
                  {completo && ' ✓'}
                </span>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
