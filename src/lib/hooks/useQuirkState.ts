import {useCallback, useEffect, useState} from 'react'
import {Quirk} from '../quirk'

type QuirkStateConfig = {
  debug?: boolean
}
export default function useQuirkState<T>(
  quirk: Quirk<T>,
  config?: QuirkStateConfig,
) {
  const [state, setState] = useState<Quirk<T>['initialValue'] | T>(
    quirk.overrideInitialValue !== undefined
      ? quirk.overrideInitialValue
      : quirk.initialValue,
  )

  const { debug } = config || {}
  const [firstLoad, setFirstLoad] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    return quirk
      .get()
      .then((newValue) => {
        debug && console.log('QUIRK##LOADED', newValue)
        setState(newValue)
        return Promise.resolve(newValue)
      })
      .catch((err) => {
        setError(err)
        return Promise.reject(err)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    debug && console.log('QUIRK##LOAD')
    if (firstLoad) {
      debug && console.log('QUIRK##FIRST_LOAD')
      load()
    }
    setFirstLoad(false)
  }, [load, firstLoad])

  const onChange = useCallback(async (newValue: T): Promise<T> => {
    debug && console.log('QUIRK##ONCHANGE', newValue)
    const updatedValue = await quirk.set(newValue)
    setState(updatedValue)
    return Promise.resolve(updatedValue)
  }, [])

  return [state, onChange, { reload: load, loading, error }] as const
}
