import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import type { RegistroComida } from '../types/alimento'

export function useRegistros() {
  const [registros, setRegistros] = useState<RegistroComida[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('registros_comida')
      .select('*')
      .order('fecha', { ascending: true })
    if (error) setError(error.message)
    else setRegistros(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { registros, loading, error, refetch }
}
