import { useMemo, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useAlimentos } from '../../lib/useAlimentos'
import { useRegistros } from '../../lib/useRegistros'
import {
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

export function RegistroComidas() {
  const { alimentos, loading: loadingAlimentos } = useAlimentos()
  const { registros, loading: loadingRegistros, refetch } = useRegistros()
  const [fecha, setFecha] = useState(today())
  const [tiempo, setTiempo] = useState<TiempoComida>('almuerzo')
  const [seleccion, setSeleccion] = useState<Record<Grupo, string>>({
    cereal: '',
    fruta: '',
    verdura: '',
    proteina: '',
  })
  const [saving, setSaving] = useState(false)

  const alimentosPorId = useMemo(() => {
    const map = new Map(alimentos.map((a) => [a.id, a]))
    return map
  }, [alimentos])

  const registrosDeEstaComida = useMemo(
    () => registros.filter((r) => r.fecha === fecha && r.tiempo_comida === tiempo),
    [registros, fecha, tiempo],
  )

  async function agregar(grupo: Grupo) {
    const alimentoId = seleccion[grupo]
    if (!alimentoId) return
    setSaving(true)
    await supabase.from('registros_comida').insert({
      fecha,
      tiempo_comida: tiempo,
      alimento_id: alimentoId,
      cantidad: '1 cucharada',
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

  if (loadingAlimentos || loadingRegistros) {
    return <p className="text-neutral-500">Cargando…</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800"
        />
        <div className="flex gap-1">
          {TIEMPOS.map((t) => (
            <button
              key={t}
              onClick={() => setTiempo(t)}
              className={`rounded-full px-3 py-1.5 text-sm ${
                tiempo === t
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                  : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
              }`}
            >
              {TIEMPO_COMIDA_LABEL[t]}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-neutral-500">
        Porción sugerida (6-8 meses): 1 cucharada de cada grupo.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {GRUPOS.map((grupo) => {
          const items = registrosDeEstaComida.filter(
            (r) => alimentosPorId.get(r.alimento_id)?.grupo === grupo,
          )
          const opciones = alimentos.filter((a) => a.grupo === grupo)
          return (
            <div
              key={grupo}
              className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800"
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-medium">{GRUPO_LABEL[grupo]}</h3>
                <span
                  className={`text-xs ${items.length > 0 ? 'text-green-600 dark:text-green-400' : 'text-neutral-400'}`}
                >
                  {items.length > 0 ? '✓ registrado' : 'falta'}
                </span>
              </div>

              <ul className="mb-3 space-y-1">
                {items.map((r) => (
                  <li
                    key={r.id}
                    className="flex items-center justify-between rounded-lg bg-neutral-100 px-2 py-1 text-sm dark:bg-neutral-800"
                  >
                    <span>{alimentosPorId.get(r.alimento_id)?.nombre ?? '—'}</span>
                    <button
                      onClick={() => quitar(r.id)}
                      disabled={saving}
                      className="text-neutral-400 hover:text-red-600"
                      aria-label="Quitar"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>

              <div className="flex gap-2">
                <select
                  value={seleccion[grupo]}
                  onChange={(e) => setSeleccion((s) => ({ ...s, [grupo]: e.target.value }))}
                  className="min-w-0 flex-1 rounded-lg border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                >
                  <option value="">Elegir alimento…</option>
                  {opciones.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nombre}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => agregar(grupo)}
                  disabled={!seleccion[grupo] || saving}
                  className="rounded-lg bg-neutral-900 px-3 py-1.5 text-sm text-white disabled:opacity-40 dark:bg-neutral-100 dark:text-neutral-900"
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
