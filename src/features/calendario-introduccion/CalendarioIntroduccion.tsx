import { useMemo } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useAlimentos } from '../../lib/useAlimentos'
import { useRegistros } from '../../lib/useRegistros'
import { ALERGENO_LABEL, GRUPO_LABEL, type AlergenoCategoria, type Grupo } from '../../types/alimento'

const GRUPOS: Grupo[] = ['cereal', 'fruta', 'verdura', 'proteina']
const ALERGENOS: AlergenoCategoria[] = [
  'leche',
  'huevo',
  'soya',
  'trigo_gluten',
  'mani',
  'frutos_secos',
  'pescado',
  'mariscos',
]
const META_EXPOSICIONES = 10

function today() {
  return new Date().toISOString().slice(0, 10)
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
      fecha: today(),
      tiempo_comida: 'almuerzo',
      alimento_id: alimentoId,
      cantidad: '1 cucharada',
    })
    await refetch()
  }

  if (loadingAlimentos || loadingRegistros) {
    return <p className="text-neutral-500">Cargando…</p>
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-lg font-semibold">Próximo alimento a introducir</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {GRUPOS.map((grupo) => {
            const delGrupo = alimentos.filter((a) => a.grupo === grupo)
            const yaIntroducidos = delGrupo.filter((a) => introducidos.has(a.id))
            const siguiente = delGrupo.find((a) => !introducidos.has(a.id))
            return (
              <div
                key={grupo}
                className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800"
              >
                <h3 className="font-medium">{GRUPO_LABEL[grupo]}</h3>
                <p className="text-xs text-neutral-500">
                  {yaIntroducidos.length} de {delGrupo.length} introducidos
                </p>
                {siguiente ? (
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm">{siguiente.nombre}</span>
                    <button
                      onClick={() => introducirHoy(siguiente.id)}
                      className="rounded-full bg-neutral-900 px-3 py-1 text-xs text-white dark:bg-neutral-100 dark:text-neutral-900"
                    >
                      Introducir hoy
                    </button>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                    Todos introducidos
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Exposición a alergénicos</h2>
        <p className="mb-3 text-sm text-neutral-500">
          Meta: {META_EXPOSICIONES} exposiciones por alimento alergénico (idealmente 2 por semana)
          para considerarlo introducido/tolerado.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {ALERGENOS.map((a) => {
            const count = exposicionesPorAlergeno[a] ?? 0
            const completo = count >= META_EXPOSICIONES
            return (
              <div
                key={a}
                className="flex items-center justify-between rounded-xl border border-neutral-200 px-4 py-2 dark:border-neutral-800"
              >
                <span className="text-sm">{ALERGENO_LABEL[a]}</span>
                <span
                  className={`text-sm font-medium ${completo ? 'text-green-600 dark:text-green-400' : 'text-neutral-500'}`}
                >
                  {Math.min(count, META_EXPOSICIONES)}/{META_EXPOSICIONES}
                  {completo ? ' ✓' : ''}
                </span>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
