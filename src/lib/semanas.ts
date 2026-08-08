// Utilidades de semana. La semana de seguimiento inicia el viernes.
// Las fechas se manejan como strings 'YYYY-MM-DD' y se parsean en UTC
// para evitar que el huso horario del navegador corra el día de la semana.

function parseFecha(fecha: string): Date {
  const [y, m, d] = fecha.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

function formatFecha(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function addDias(fecha: string, dias: number): string {
  const d = parseFecha(fecha)
  d.setUTCDate(d.getUTCDate() + dias)
  return formatFecha(d)
}

export function hoy(): string {
  return new Date().toISOString().slice(0, 10)
}

/** Viernes de la semana que contiene `fecha`. */
export function inicioSemana(fecha: string): string {
  const dow = parseFecha(fecha).getUTCDay() // 0=dom … 5=vie … 6=sáb
  const diff = (dow - 5 + 7) % 7
  return addDias(fecha, -diff)
}

export function addSemanas(inicio: string, n: number): string {
  return addDias(inicio, n * 7)
}

/** Diferencia en semanas completas entre dos inicios de semana (b - a). */
export function diffSemanas(a: string, b: string): number {
  const dias = (parseFecha(b).getTime() - parseFecha(a).getTime()) / 86_400_000
  return Math.round(dias / 7)
}

/** Los 7 días (viernes a jueves) de la semana que inicia en `inicio`. */
export function diasDeSemana(inicio: string): string[] {
  return Array.from({ length: 7 }, (_, i) => addDias(inicio, i))
}

const DIA_CORTO = new Intl.DateTimeFormat('es', { weekday: 'short', timeZone: 'UTC' })
const DIA_NUM = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short', timeZone: 'UTC' })

export function labelDiaCorto(fecha: string): string {
  const s = DIA_CORTO.format(parseFecha(fecha))
  return s.charAt(0).toUpperCase() + s.slice(1).replace('.', '')
}

export function labelDiaNum(fecha: string): string {
  return DIA_NUM.format(parseFecha(fecha))
}

export function labelRangoSemana(inicio: string): string {
  const fin = addDias(inicio, 6)
  return `${labelDiaNum(inicio)} – ${labelDiaNum(fin)}`
}

export function esHoy(fecha: string): boolean {
  return fecha === hoy()
}
