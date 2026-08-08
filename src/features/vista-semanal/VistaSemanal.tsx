import { useMemo, useState } from 'react'
import { useAlimentos } from '../../lib/useAlimentos'
import { useRegistros } from '../../lib/useRegistros'
import {
  addSemanas,
  diasDeSemana,
  diffSemanas,
  esHoy,
  hoy,
  inicioSemana,
  labelDiaCorto,
  labelDiaNum,
  labelRangoSemana,
} from '../../lib/semanas'
import {
  ALERGENO_LABEL,
  GRUPO_COLOR,
  TIEMPO_COMIDA_LABEL,
  type RegistroComida,
  type TiempoComida,
} from '../../types/alimento'

const TIEMPOS: TiempoComida[] = ['desayuno', 'almuerzo', 'cena']
const META_HIGADO = 6
const META_ALERGENO_SEMANAL = 2
const SEMANAS_SEGUIMIENTO_ALERGENO = 5

function normalizar(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function esHigadoDePollo(nombre: string): boolean {
  const n = normalizar(nombre)
  return n.includes('higado') && n.includes('pollo')
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

function IconChevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points={dir === 'left' ? '15 18 9 12 15 6' : '9 18 15 12 9 6'} />
    </svg>
  )
}

export function VistaSemanal() {
  const { alimentos, loading: loadingAlimentos } = useAlimentos()
  const { registros, loading: loadingRegistros } = useRegistros()
  const [inicio, setInicio] = useState(() => inicioSemana(hoy()))

  const alimentosPorId = useMemo(() => new Map(alimentos.map((a) => [a.id, a])), [alimentos])
  const dias = useMemo(() => diasDeSemana(inicio), [inicio])

  const registrosPorDia = useMemo(() => {
    const map = new Map<string, RegistroComida[]>()
    for (const dia of dias) map.set(dia, [])
    for (const r of registros) {
      const lista = map.get(r.fecha)
      if (lista) lista.push(r)
    }
    return map
  }, [dias, registros])

  const registrosDeLaSemana = useMemo(
    () => dias.flatMap((d) => registrosPorDia.get(d) ?? []),
    [dias, registrosPorDia],
  )

  // ── Regla 1: hígado de pollo, mínimo 6 comidas por semana ──
  const idsHigado = useMemo(
    () => new Set(alimentos.filter((a) => esHigadoDePollo(a.nombre)).map((a) => a.id)),
    [alimentos],
  )
  const vecesHigado = useMemo(
    () => registrosDeLaSemana.filter((r) => idsHigado.has(r.alimento_id)).length,
    [registrosDeLaSemana, idsHigado],
  )
  const higadoCompleto = vecesHigado >= META_HIGADO

  // ── Regla 2: alérgenos introducidos, mínimo 2x/semana por 5 semanas ──
  const seguimientoAlergenos = useMemo(() => {
    const alergenicos = alimentos.filter((a) => a.es_alergenico)
    const filas: {
      id: string
      nombre: string
      categoria: string | null
      semanaActual: number
      veces: number
      completo: boolean
    }[] = []

    for (const a of alergenicos) {
      const regsAlimento = registros.filter((r) => r.alimento_id === a.id)
      if (regsAlimento.length === 0) continue
      const primeraFecha = regsAlimento.reduce((min, r) => (r.fecha < min ? r.fecha : min), regsAlimento[0].fecha)
      const semanaIntroduccion = inicioSemana(primeraFecha)
      const semanaActual = diffSemanas(semanaIntroduccion, inicio)
      if (semanaActual < 0 || semanaActual >= SEMANAS_SEGUIMIENTO_ALERGENO) continue

      const veces = regsAlimento.filter((r) => dias.includes(r.fecha)).length
      filas.push({
        id: a.id,
        nombre: a.nombre,
        categoria: a.alergeno_categoria,
        semanaActual: semanaActual + 1,
        veces,
        completo: veces >= META_ALERGENO_SEMANAL,
      })
    }

    filas.sort((x, y) => Number(x.completo) - Number(y.completo) || x.nombre.localeCompare(y.nombre))
    return filas
  }, [alimentos, registros, inicio, dias])

  if (loadingAlimentos || loadingRegistros) return <Spinner />

  const diasConRegistro = dias.filter((d) => (registrosPorDia.get(d) ?? []).length > 0).length

  return (
    <div className="space-y-6">
      {/* Week navigation */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => setInicio((i) => addSemanas(i, -1))}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-stone-500 transition-colors hover:text-stone-800"
          style={{ border: '1px solid #EDE8E0' }}
          aria-label="Semana anterior"
        >
          <IconChevron dir="left" />
        </button>

        <div className="text-center">
          <p className="text-sm font-black text-stone-800">{labelRangoSemana(inicio)}</p>
          {inicio !== inicioSemana(hoy()) && (
            <button
              onClick={() => setInicio(inicioSemana(hoy()))}
              className="text-xs font-semibold transition-colors"
              style={{ color: '#2D7A3C' }}
            >
              Ir a semana actual
            </button>
          )}
        </div>

        <button
          onClick={() => setInicio((i) => addSemanas(i, 1))}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-stone-500 transition-colors hover:text-stone-800"
          style={{ border: '1px solid #EDE8E0' }}
          aria-label="Semana siguiente"
        >
          <IconChevron dir="right" />
        </button>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white p-4 text-center" style={{ border: '1px solid #EDE8E0' }}>
          <p className="text-2xl font-black text-stone-800">{registrosDeLaSemana.length}</p>
          <p className="text-xs font-semibold text-stone-500 mt-0.5">comidas registradas</p>
        </div>
        <div className="rounded-2xl p-4 text-center" style={{ background: '#E8F5EB', border: '1px solid #C6DECA' }}>
          <p className="text-2xl font-black" style={{ color: '#2D7A3C' }}>{diasConRegistro}/7</p>
          <p className="text-xs font-semibold mt-0.5" style={{ color: '#4A9A5C' }}>días con registro</p>
        </div>
      </div>

      {/* Regla: hígado de pollo */}
      <section
        className="rounded-2xl p-4"
        style={{
          background: higadoCompleto ? '#E8F5EB' : '#FFFFFF',
          border: '1px solid #EDE8E0',
          borderLeft: `3px solid ${higadoCompleto ? '#2D7A3C' : '#B8382C'}`,
        }}
      >
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="text-sm font-bold text-stone-800">Hígado de pollo</h2>
          <span className="text-xs font-black tabular-nums" style={{ color: higadoCompleto ? '#2D7A3C' : '#B8382C' }}>
            {vecesHigado}/{META_HIGADO}
            {higadoCompleto && ' ✓'}
          </span>
        </div>
        <div className="mb-2 h-2 overflow-hidden rounded-full bg-stone-100">
          <div
            className="h-full rounded-full fill-bar"
            style={{
              width: `${Math.min((vecesHigado / META_HIGADO) * 100, 100)}%`,
              background: higadoCompleto ? '#2D7A3C' : '#B8382C',
            }}
          />
        </div>
        <p className="text-xs text-stone-500">
          Meta: al menos {META_HIGADO} comidas con hígado de pollo por semana.
        </p>
      </section>

      {/* Regla: alérgenos en seguimiento */}
      {seguimientoAlergenos.length > 0 && (
        <section className="rounded-2xl bg-white p-1" style={{ border: '1px solid #EDE8E0' }}>
          <div className="px-3 pt-3 pb-1">
            <h2 className="text-sm font-bold text-stone-800">Alérgenos en seguimiento</h2>
            <p className="mt-0.5 text-xs text-stone-500">
              Cada alérgeno introducido debe comerse al menos {META_ALERGENO_SEMANAL} veces por semana durante {SEMANAS_SEGUIMIENTO_ALERGENO} semanas.
            </p>
          </div>
          <div className="mt-1">
            {seguimientoAlergenos.map((f) => (
              <div
                key={f.id}
                className="flex items-center gap-3 px-3 py-2.5"
                style={{ borderTop: '1px solid #F5F4F2' }}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-stone-700">{f.nombre}</p>
                  <p className="text-xs text-stone-400">
                    Semana {f.semanaActual}/{SEMANAS_SEGUIMIENTO_ALERGENO}
                    {f.categoria ? ` · ${ALERGENO_LABEL[f.categoria as keyof typeof ALERGENO_LABEL]}` : ''}
                  </p>
                </div>
                <span
                  className="shrink-0 rounded-full px-2.5 py-1 text-xs font-black tabular-nums"
                  style={
                    f.completo
                      ? { background: '#E8F5EB', color: '#2D7A3C' }
                      : { background: '#FAEAE8', color: '#B8382C' }
                  }
                >
                  {f.veces}/{META_ALERGENO_SEMANAL}
                  {f.completo && ' ✓'}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Days of the week */}
      <section className="space-y-3">
        {dias.map((dia, i) => {
          const regsDia = registrosPorDia.get(dia) ?? []
          const hoyMarca = esHoy(dia)

          return (
            <div
              key={dia}
              className="fade-up rounded-xl p-4"
              style={{
                background: hoyMarca ? '#FDF4E3' : '#FFFFFF',
                border: '1px solid #EDE8E0',
                borderLeft: `3px solid ${hoyMarca ? '#C8840A' : '#D6D3D1'}`,
                animationDelay: `${i * 40}ms`,
              }}
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-bold text-stone-800">
                  {labelDiaCorto(dia)} <span className="font-semibold text-stone-400">{labelDiaNum(dia)}</span>
                  {hoyMarca && (
                    <span className="ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: '#C8840A' }}>
                      Hoy
                    </span>
                  )}
                </h3>
                <span className="text-xs font-semibold text-stone-400">
                  {regsDia.length === 0 ? 'sin registros' : `${regsDia.length} comida${regsDia.length > 1 ? 's' : ''}`}
                </span>
              </div>

              {regsDia.length === 0 ? (
                <p className="text-sm text-stone-400">—</p>
              ) : (
                <div className="space-y-1.5">
                  {TIEMPOS.map((t) => {
                    const items = regsDia.filter((r) => r.tiempo_comida === t)
                    if (items.length === 0) return null
                    return (
                      <div key={t} className="flex items-start gap-2 text-sm">
                        <span className="w-16 shrink-0 font-semibold text-stone-400">{TIEMPO_COMIDA_LABEL[t]}</span>
                        <div className="flex flex-wrap gap-1.5">
                          {items.map((r) => {
                            const alimento = alimentosPorId.get(r.alimento_id)
                            const color = alimento ? GRUPO_COLOR[alimento.grupo] : null
                            return (
                              <span
                                key={r.id}
                                className="rounded-full px-2 py-0.5 text-xs font-semibold"
                                style={{
                                  background: color ? color.light : '#F5F4F2',
                                  color: color ? color.dark : '#78716C',
                                }}
                              >
                                {alimento?.nombre ?? '—'}
                              </span>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </section>
    </div>
  )
}
