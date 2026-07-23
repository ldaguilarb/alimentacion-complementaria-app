import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import type { Receta } from '../types/alimento'

export function useRecetas() {
  const [recetas, setRecetas] = useState<Receta[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    supabase
      .from('recetas')
      .select('*')
      .then(({ data }) => {
        if (cancelled) return
        setRecetas(data ?? [])
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { recetas, loading }
}
