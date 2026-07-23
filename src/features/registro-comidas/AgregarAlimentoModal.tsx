import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import {
  ALERGENO_LABEL,
  GRUPO_COLOR,
  GRUPO_LABEL,
  SUBGRUPO_LABEL,
  type AlergenoCategoria,
  type Grupo,
  type Subgrupo,
} from '../../types/alimento'

const GRUPOS: Grupo[] = ['cereal', 'fruta', 'verdura', 'proteina']

const SUBGRUPOS: Subgrupo[] = [
  'dura',
  'blanda',
  'semillas',
  'hojas_verdes',
  'cereal',
  'cereal_infantil_fortificado',
  'origen_animal',
  'leguminosa',
  'oleaginosa',
  'otro',
]

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

interface Props {
  grupoInicial: Grupo
  onClose: () => void
  onGuardado: () => void
}

const INPUT_CLASS =
  'w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200 transition-all'

const LABEL_CLASS = 'block text-xs font-bold uppercase tracking-wide text-stone-500 mb-1.5'

export function AgregarAlimentoModal({ grupoInicial, onClose, onGuardado }: Props) {
  const [nombre, setNombre] = useState('')
  const [grupo, setGrupo] = useState<Grupo>(grupoInicial)
  const [subgrupo, setSubgrupo] = useState<Subgrupo>('blanda')
  const [prepPersonalizada, setPrepPersonalizada] = useState('')
  const [esAlergenico, setEsAlergenico] = useState(false)
  const [alergenoCategoria, setAlergenoCategoria] = useState<AlergenoCategoria>('leche')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cerrar con Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const color = GRUPO_COLOR[grupo]

  async function guardar() {
    if (!nombre.trim()) {
      setError('El nombre del alimento es requerido.')
      return
    }
    if (subgrupo === 'otro' && !prepPersonalizada.trim()) {
      setError('Describe el tipo de preparación.')
      return
    }
    setSaving(true)
    setError(null)

    const { error: err } = await supabase.from('alimentos').insert({
      nombre: nombre.trim(),
      grupo,
      subgrupo,
      es_alergenico: esAlergenico,
      alergeno_categoria: esAlergenico ? alergenoCategoria : null,
      nombres_alternos: null,
      preparacion_personalizada: subgrupo === 'otro' ? prepPersonalizada.trim() : null,
      is_personalizado: true,
    })

    setSaving(false)
    if (err) {
      setError(err.message)
      return
    }
    onGuardado()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(28, 25, 23, 0.5)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl overflow-hidden"
        style={{ maxHeight: '92dvh' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b border-stone-100"
          style={{ borderTop: `4px solid ${color.accent}` }}
        >
          <h2 className="text-base font-bold text-stone-800">Agregar alimento nuevo</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors text-xl leading-none"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto px-5 py-4 space-y-4" style={{ maxHeight: 'calc(92dvh - 130px)' }}>

          {/* Nombre */}
          <div>
            <label className={LABEL_CLASS}>Nombre del alimento</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Papaya, Quinoa, Cordero…"
              className={INPUT_CLASS}
              autoFocus
            />
          </div>

          {/* Grupo */}
          <div>
            <label className={LABEL_CLASS}>Grupo alimenticio</label>
            <div className="grid grid-cols-2 gap-2">
              {GRUPOS.map((g) => {
                const c = GRUPO_COLOR[g]
                const active = grupo === g
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGrupo(g)}
                    className="rounded-xl px-3 py-2.5 text-sm font-semibold text-left transition-all"
                    style={
                      active
                        ? { background: c.light, color: c.dark, border: `2px solid ${c.accent}` }
                        : { background: '#FAFAF9', color: '#78716C', border: '2px solid #EDE8E0' }
                    }
                  >
                    {GRUPO_LABEL[g]}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tipo de preparación */}
          <div>
            <label className={LABEL_CLASS}>Tipo de preparación</label>
            <select
              value={subgrupo}
              onChange={(e) => setSubgrupo(e.target.value as Subgrupo)}
              className={INPUT_CLASS}
            >
              {SUBGRUPOS.map((s) => (
                <option key={s} value={s}>
                  {SUBGRUPO_LABEL[s]}
                </option>
              ))}
            </select>

            {subgrupo === 'otro' && (
              <div className="mt-2">
                <input
                  type="text"
                  value={prepPersonalizada}
                  onChange={(e) => setPrepPersonalizada(e.target.value)}
                  placeholder="Describe cómo se prepara este alimento…"
                  className={INPUT_CLASS}
                />
              </div>
            )}
          </div>

          {/* Alérgeno */}
          <div>
            <label className={LABEL_CLASS}>Alérgeno</label>
            <button
              type="button"
              onClick={() => setEsAlergenico((v) => !v)}
              className="flex items-center gap-3 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm transition-all"
              style={esAlergenico ? { borderColor: '#D4561A', background: '#FEF0E8' } : {}}
            >
              <span
                className="relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-200"
                style={{ background: esAlergenico ? '#D4561A' : '#D6D3D1' }}
              >
                <span
                  className="inline-block h-5 w-5 rounded-full bg-white shadow transition-transform duration-200"
                  style={{ transform: esAlergenico ? 'translateX(16px)' : 'translateX(0px)' }}
                />
              </span>
              <span
                className="font-semibold"
                style={{ color: esAlergenico ? '#9B3C0F' : '#78716C' }}
              >
                {esAlergenico ? 'Sí, es alérgeno' : 'No es alérgeno'}
              </span>
            </button>

            {esAlergenico && (
              <div className="mt-2">
                <select
                  value={alergenoCategoria}
                  onChange={(e) => setAlergenoCategoria(e.target.value as AlergenoCategoria)}
                  className={INPUT_CLASS}
                >
                  {ALERGENOS.map((a) => (
                    <option key={a} value={a}>
                      {ALERGENO_LABEL[a]}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 border-t border-stone-100 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-stone-200 bg-white py-2.5 text-sm font-semibold text-stone-600 transition-colors hover:bg-stone-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={guardar}
            disabled={saving}
            className="flex-1 rounded-xl py-2.5 text-sm font-bold text-white transition-opacity disabled:opacity-50"
            style={{ background: color.accent }}
          >
            {saving ? 'Guardando…' : 'Guardar alimento'}
          </button>
        </div>
      </div>
    </div>
  )
}
