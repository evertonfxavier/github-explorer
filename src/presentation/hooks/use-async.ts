import { useCallback, useEffect, useState } from 'react'

type AsyncState<T> = {
  data?: T
  loading: boolean
  error?: string
}

export function useAsync<T>(asyncFn: () => Promise<T>) {
  const [state, setState] = useState<AsyncState<T>>({ loading: true })

  const fetchData = useCallback(() => {
    return asyncFn()
      .then(data => setState({ data, loading: false }))
      .catch((error: Error) => setState({ loading: false, error: error.message }))
  }, [asyncFn])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const reload = useCallback(() => {
    setState({ loading: true })
    fetchData()
  }, [fetchData])

  return { ...state, reload }
}
