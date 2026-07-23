import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import type { Alimento } from '../types/alimento'

export function useAlimentos() {
  const [alimentos, setAlimentos] = useState<Alimento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    supabase
      .from('alimentos')
      .select('*')
      .order('nombre')
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) setError(error.message)
        else setAlimentos(data ?? [])
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { alimentos, loading, error }
}
