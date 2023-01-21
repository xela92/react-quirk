export type Quirk<T> = {
  /**
   * initial value - should be used to set the initial value wanted directly from the model
   */
  initialValue?: T | undefined
  /**
   * overrides the initial value - should be used to set the initial value from where it's used
   */
  overrideInitialValue?: T | undefined
  /**
   * returns the current value - should be used to get the current value from the frontend
   */
  get: () => Promise<T>
  /**
   * takes the new value and returns the updated value (which will be set as the new state) - should be used to update the backend
   * @param newValue
   */
  set: (newValue: T) => Promise<T>
}

export default function quirk<T>({
  getter,
  setter,
  initialValue,
  overrideInitialValue,
}: {
  getter: () => Promise<any>
  setter: (newValue: any) => Promise<any>
  initialValue?: T | undefined
  overrideInitialValue?: T | undefined
}): Quirk<T> {
  return {
    initialValue,
    overrideInitialValue,
    get: getter,
    set: setter,
  }
}
