import { useState } from 'react'

export function SeguridadAlimentaria() {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium"
      >
        Seguridad alimentaria en la preparación
        <span className="text-neutral-400">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="space-y-3 border-t border-neutral-200 px-4 py-3 text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
          <p>
            Lavar las manos 20 segundos con agua y jabón antes, durante y después de preparar
            alimentos, y lavar/desinfectar todos los utensilios y superficies.
          </p>
          <p>
            Frutas y verduras de cáscara delgada o porosa (uvas, manzanas, papas): lavar
            minuciosamente con agua y jabón. Hortalizas y otras verduras: desinfectar.
          </p>
          <p>
            Separar alimentos crudos de los listos para comer — tablas, platos y utensilios
            distintos para cada uno.
          </p>
          <div>
            <p className="font-medium text-neutral-700 dark:text-neutral-300">
              Temperaturas de cocción:
            </p>
            <ul className="list-inside list-disc">
              <li>Filetes de carne y pescados: 65°C</li>
              <li>Carnes molidas: 75°C</li>
              <li>Aves: 75°C</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-neutral-700 dark:text-neutral-300">
              Refrigeración:
            </p>
            <ul className="list-inside list-disc">
              <li>Refrigerar dentro de las primeras 2 horas después de cocinar</li>
              <li>Zona de peligro a evitar: 4°C a 60°C</li>
              <li>Refrigerador: menos de 4°C · Congelador: menos de −17°C</li>
              <li>Desechar después de 2 días refrigerado o 2 meses congelado</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-neutral-700 dark:text-neutral-300">
              Conversión de medidas caseras:
            </p>
            <ul className="list-inside list-disc">
              <li>1 cucharadita = 4 g/ml</li>
              <li>1 cucharada = 15 g/ml</li>
              <li>1/8 de taza = 30 g/ml (1 onza)</li>
              <li>1 taza = 240 g/ml</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
