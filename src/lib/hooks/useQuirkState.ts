//@ts-ignore
import {useCallback, useEffect, useState} from 'react'
import {Quirk} from '../quirk'

export type QuirkStateConfig = {
  debug?: boolean,
  onSuccess?: (value: any) => void,
  onError?: (error: Error) => void,
}
export default function useQuirkState<T>(
  quirk: Quirk<T>,
  config?: QuirkStateConfig,
) {
  const [state, setState] = useState<T | undefined>(
    quirk.overrideInitialValue !== undefined
      ? quirk.overrideInitialValue
      : quirk.initialValue,
  )

  const { debug, onSuccess, onError } = config || {}
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
        onSuccess && onSuccess(newValue)
        return Promise.resolve(newValue)
      })
      .catch((err) => {
        setError(err)
        onError && onError(err)
        return Promise.reject(err)
      })
      .finally(() => setLoading(false))
  }, [debug])

  useEffect(() => {
    if (firstLoad) {
      debug && console.log('QUIRK##FIRST_LOAD')
      load()
    } else {
      debug && console.log('QUIRK##ALREADY_LOADED')
    }
    setFirstLoad(false)
  }, [load, firstLoad, debug])

  const onChange = useCallback(async (newValue: SetStateNewValueType<T>, props?: any): Promise<T> => {
    const setStateValue = typeof newValue === 'function' ? newValue(state) : newValue

    const updatedValue = await quirk.set(setStateValue, {...(props || {}), state, ...(config || {})} )
    debug && console.log('QUIRK##ONCHANGE', updatedValue)
    setState(updatedValue)
    return Promise.resolve(updatedValue)
  }, [debug, quirk, state, config])

  return [state as T, onChange, { reload: load, loading, error }] as const
}

type SetStateNewValueType<T> =  T extends Function ? ((previousValue: T) => void): T