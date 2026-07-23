import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import type { Alimento } from '../types/alimento'

export function useAlimentos() {
  const [alimentos, setAlimentos] = useState<Alimento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('alimentos')
      .select('*')
      .order('nombre')
    if (error) setError(error.message)
    else setAlimentos(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { alimentos, loading, error, refetch }
}
