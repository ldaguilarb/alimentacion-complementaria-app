import { useState } from 'react'

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function TempRow({ label, temp }: { label: string; temp: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-stone-100 last:border-0">
      <span className="text-sm text-stone-600">{label}</span>
      <span
        className="rounded-full px-2 py-0.5 text-xs font-bold"
        style={{ background: '#E8F5EB', color: '#2D7A3C' }}
      >
        {temp}
      </span>
    </div>
  )
}

export function SeguridadAlimentaria() {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #EDE8E0' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-4 text-left font-bold text-stone-800 transition-colors hover:bg-stone-50"
      >
        <span>Seguridad alimentaria en la preparación</span>
        <span className="text-stone-400">
          <ChevronIcon open={open} />
        </span>
      </button>

      {open && (
        <div className="border-t border-stone-100 px-5 pb-5 pt-4 space-y-5 fade-up">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wide text-stone-400">Higiene</p>
            <p className="text-sm text-stone-600">
              Lavar las manos 20 segundos con agua y jabón antes, durante y después de preparar alimentos. Lavar y desinfectar todos los utensilios y superficies.
            </p>
            <p className="text-sm text-stone-600">
              Frutas y verduras de cáscara delgada o porosa (uvas, manzanas, papas): lavar minuciosamente con agua y jabón. Otras hortalizas: desinfectar.
            </p>
            <p className="text-sm text-stone-600">
              Mantén los alimentos crudos separados de los listos para comer — usa tablas y utensilios distintos.
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-stone-400">Temperaturas internas de cocción</p>
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #EDE8E0' }}>
              <div className="px-4">
                <TempRow label="Filetes de carne y pescados" temp="65 °C" />
                <TempRow label="Carnes molidas" temp="75 °C" />
                <TempRow label="Aves" temp="75 °C" />
              </div>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-stone-400">Refrigeración</p>
            <ul className="space-y-1.5 text-sm text-stone-600">
              <li className="flex gap-2"><span style={{ color: '#2D7A3C' }}>·</span>Refrigerar dentro de las primeras 2 horas de cocinar</li>
              <li className="flex gap-2"><span style={{ color: '#2D7A3C' }}>·</span>Zona de peligro: 4 °C a 60 °C — evitar ese rango</li>
              <li className="flex gap-2"><span style={{ color: '#2D7A3C' }}>·</span>Refrigerador: menos de 4 °C · Congelador: menos de −17 °C</li>
              <li className="flex gap-2"><span style={{ color: '#2D7A3C' }}>·</span>Desechar después de 2 días refrigerado o 2 meses congelado</li>
            </ul>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-stone-400">Conversión de medidas</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                ['1 cucharadita', '4 g / ml'],
                ['1 cucharada', '15 g / ml'],
                ['⅛ taza', '30 g / ml (1 oz)'],
                ['1 taza', '240 g / ml'],
              ].map(([medida, valor]) => (
                <div key={medida} className="rounded-xl px-3 py-2.5 text-center" style={{ background: '#F9F6F0' }}>
                  <p className="text-xs text-stone-500">{medida}</p>
                  <p className="text-sm font-bold text-stone-700">{valor}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
