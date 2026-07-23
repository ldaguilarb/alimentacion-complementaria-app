import { useMemo, useState } from 'react'
import { useAlimentos } from '../../lib/useAlimentos'
import { useRecetas } from '../../lib/useRecetas'
import { GRUPO_LABEL, SUBGRUPO_LABEL, type Grupo } from '../../types/alimento'
import { SeguridadAlimentaria } from './SeguridadAlimentaria'

const GRUPOS: (Grupo | 'todos')[] = ['todos', 'cereal', 'fruta', 'verdura', 'proteina']

export function GuiaPreparacion() {
  const { alimentos, loading: loadingAlimentos } = useAlimentos()
  const { recetas, loading: loadingRecetas } = useRecetas()
  const [filtro, setFiltro] = useState<Grupo | 'todos'>('todos')
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

  if (loadingAlimentos || loadingRecetas) {
    return <p className="text-neutral-500">Cargando…</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-1">
        {GRUPOS.map((g) => (
          <button
            key={g}
            onClick={() => setFiltro(g)}
            className={`rounded-full px-3 py-1.5 text-sm ${
              filtro === g
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
            }`}
          >
            {g === 'todos' ? 'Todos' : GRUPO_LABEL[g]}
          </button>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <ul className="max-h-96 space-y-1 overflow-y-auto rounded-xl border border-neutral-200 p-2 dark:border-neutral-800">
          {alimentosFiltrados.map((a) => (
            <li key={a.id}>
              <button
                onClick={() => setSeleccionadoId(a.id)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                  seleccionadoId === a.id
                    ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                    : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {a.nombre}
              </button>
            </li>
          ))}
        </ul>

        <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
          {!seleccionado && (
            <p className="text-sm text-neutral-500">Elegí un alimento de la lista.</p>
          )}
          {seleccionado && (
            <div className="space-y-3">
              <div>
                <h2 className="text-lg font-semibold">{seleccionado.nombre}</h2>
                <p className="text-sm text-neutral-500">
                  {GRUPO_LABEL[seleccionado.grupo]} · {SUBGRUPO_LABEL[seleccionado.subgrupo]}
                </p>
                {seleccionado.nombres_alternos && (
                  <p className="text-xs text-neutral-400">
                    También conocido como: {seleccionado.nombres_alternos}
                  </p>
                )}
              </div>
              {receta ? (
                <div className="space-y-2 text-sm">
                  {receta.ingredientes && (
                    <p>
                      <span className="font-medium">Ingredientes: </span>
                      {receta.ingredientes}
                    </p>
                  )}
                  <p>
                    <span className="font-medium">Preparación: </span>
                    {receta.pasos}
                  </p>
                  {receta.notas && (
                    <p className="text-neutral-500">
                      <span className="font-medium">Nota: </span>
                      {receta.notas}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-neutral-500">
                  Sin receta cargada todavía para este subgrupo.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <SeguridadAlimentaria />
    </div>
  )
}
