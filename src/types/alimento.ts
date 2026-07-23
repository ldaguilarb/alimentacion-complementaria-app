export type Grupo = 'cereal' | 'fruta' | 'verdura' | 'proteina'

export type Subgrupo =
  | 'dura'
  | 'blanda'
  | 'semillas'
  | 'hojas_verdes'
  | 'cereal'
  | 'cereal_infantil_fortificado'
  | 'origen_animal'
  | 'leguminosa'
  | 'oleaginosa'

export type AlergenoCategoria =
  | 'leche'
  | 'huevo'
  | 'soya'
  | 'trigo_gluten'
  | 'mani'
  | 'frutos_secos'
  | 'pescado'
  | 'mariscos'

export interface Alimento {
  id: string
  nombre: string
  grupo: Grupo
  subgrupo: Subgrupo
  es_alergenico: boolean
  alergeno_categoria: AlergenoCategoria | null
  nombres_alternos: string | null
}

export interface Receta {
  id: string
  alimento_id: string | null
  subgrupo: Subgrupo | null
  ingredientes: string | null
  pasos: string
  notas: string | null
}

export type TiempoComida = 'desayuno' | 'almuerzo' | 'cena'

export interface RegistroComida {
  id: string
  fecha: string
  tiempo_comida: TiempoComida
  alimento_id: string
  cantidad: string | null
  created_at: string
  created_by: string | null
}

export const GRUPO_LABEL: Record<Grupo, string> = {
  cereal: 'Cereal',
  fruta: 'Fruta',
  verdura: 'Verdura',
  proteina: 'Proteína',
}

export const SUBGRUPO_LABEL: Record<Subgrupo, string> = {
  dura: 'Dura (requiere cocción)',
  blanda: 'Blanda (sin cocción)',
  semillas: 'De semillas (pulpa + semillas)',
  hojas_verdes: 'Hojas verdes',
  cereal: 'Cereal (lavar y hervir)',
  cereal_infantil_fortificado: 'Cereal infantil fortificado',
  origen_animal: 'Origen animal',
  leguminosa: 'Leguminosa',
  oleaginosa: 'Oleaginosa',
}

export const ALERGENO_LABEL: Record<AlergenoCategoria, string> = {
  leche: 'Leche',
  huevo: 'Huevo',
  soya: 'Soya',
  trigo_gluten: 'Trigo / gluten',
  mani: 'Maní',
  frutos_secos: 'Frutos secos',
  pescado: 'Pescado',
  mariscos: 'Mariscos',
}

export const TIEMPO_COMIDA_LABEL: Record<TiempoComida, string> = {
  desayuno: 'Desayuno',
  almuerzo: 'Almuerzo',
  cena: 'Cena',
}
