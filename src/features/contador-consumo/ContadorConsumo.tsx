import { useMemo, useState } from 'react'
import { useAlimentos } from '../../lib/useAlimentos'
import { useRegistros } from '../../lib/useRegistros'
import { GRUPO_LABEL } from '../../types/alimento'

type Orden = 'consumo' | 'nombre'

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
      orden === 'consumo' ? b.veces - a.veces || a.alimento.nombre.localeCompare(b.alimento.nombre) : a.alimento.nombre.localeCompare(b.alimento.nombre),
    )
    return filas
  }, [alimentos, registros, orden])

  if (loadingAlimentos || loadingRegistros) {
    return <p className="text-neutral-500">Cargando…</p>
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-1">
        <button
          onClick={() => setOrden('consumo')}
          className={`rounded-full px-3 py-1.5 text-sm ${orden === 'consumo' ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900' : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'}`}
        >
          Más consumidos
        </button>
        <button
          onClick={() => setOrden('nombre')}
          className={`rounded-full px-3 py-1.5 text-sm ${orden === 'nombre' ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900' : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'}`}
        >
          Alfabético
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
        <table className="w-full text-sm">
          <thead className="bg-neutral-100 text-left dark:bg-neutral-800">
            <tr>
              <th className="px-4 py-2 font-medium">Alimento</th>
              <th className="px-4 py-2 font-medium">Grupo</th>
              <th className="px-4 py-2 text-right font-medium">Veces</th>
            </tr>
          </thead>
          <tbody>
            {conteos.map(({ alimento, veces }) => (
              <tr key={alimento.id} className="border-t border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-2">{alimento.nombre}</td>
                <td className="px-4 py-2 text-neutral-500">{GRUPO_LABEL[alimento.grupo]}</td>
                <td className="px-4 py-2 text-right tabular-nums">{veces}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
