import { StorageKey } from "@/constants"
import { Dispatch } from "@/types"
import { useCallback, useEffect, useMemo } from "react"
import {
  BooleanParam,
  QueryParamConfig,
  StringParam,
  UrlUpdateType,
  useQueryParam,
} from "use-query-params"
import {
  usePersistantObject,
  usePersistentBoolean,
  usePersistentString,
} from "."

// Takes `key` which uses `useHydratedPersistantString` to get the "stringKey"
// for a given value and `getValue` which should be a useCallback hook.
// Hydrates a <T[]> value using "stringKey with getValue. The query param value
// should be an array of strings that are joined with a ','
//
// This method exists in order to use queryParams to store a complex array of
// objects that's dependent on an API call or is otherwise expensive to store
// in the URL directly.
export const useKeyedHydratedPersistantArray = <T>(
  key: StorageKey,
  paramName: string,
  getValue: (keys: string[]) => T[] | undefined
): [T[] | undefined, Dispatch<string[] | undefined>] => {
  const [stringKey, setKeyLocal] = useHydratedPersistantString(key, paramName)

  const t = useMemo(() => {
    if (stringKey === undefined) {
      return undefined
    }
    return getValue(stringKey.split(","))
  }, [stringKey, getValue])

  const setKeys: Dispatch<string[] | undefined> = useCallback(
    keys => {
      setKeyLocal(old => {
        let nu: string[] | undefined = undefined
        if (typeof keys === "function") {
          nu = keys(old?.split(","))
        } else {
          nu = keys
        }
        return nu?.join(",")
      })
    },
    [setKeyLocal]
  )

  return [t, setKeys]
}

// Takes `key` which uses `useHydratedPersistantString` to get the "stringKey"
// for a given value and `getValue` which should be a useCallback hook.
// Hydrates a <T> value using "stringKey with getValue.
//
// This method exists in order to use queryParams to store a complex object
// that's dependent on an API call or is otherwise expensive to store in the
// URL directly.
export const useKeyedHydratedPersistantObject = <T>(
  key: StorageKey,
  paramName: string,
  getValue: (stringKey: string | undefined) => T | undefined,
  onSet?: (t: T | undefined) => void,
  settings?: { keepParam: boolean }
): [T | undefined, Dispatch<string | undefined>] => {
  const [stringKey, setKeyLocal] = useHydratedPersistantString(
    key,
    paramName,
    undefined,
    settings
  )

  const t = useMemo(() => {
    if (stringKey === undefined) {
      return undefined
    }
    return getValue(stringKey)
  }, [stringKey, getValue])

  const setKey: Dispatch<string | undefined> = useCallback(
    key => {
      setKeyLocal(old => {
        let nu: string | undefined = undefined
        if (typeof key === "function") {
          nu = key(old)
        } else {
          nu = key
        }
        const nuT = getValue(nu)
        onSet && onSet(nuT)
        return nu
      })
    },
    [setKeyLocal, getValue, onSet]
  )

  return [t, setKey]
}

export const useHydratedPersistantBoolean = (
  key: StorageKey,
  paramName: string,
  initialValue: boolean
): [boolean, Dispatch<boolean>] => {
  const [value, setValue] = usePersistentBoolean(key, initialValue)
  const [param, setParam] = useQueryParam(paramName, BooleanParam)

  useEffect(() => {
    if (param !== null && param !== undefined) {
      setValue(param)
      setParam(undefined, "replaceIn")
    }
  }, [param, setParam, setValue])

  const hydrated = useMemo(
    () => (param === undefined || param === null ? value : param),
    [param, value]
  )

  return [hydrated, setValue]
}

const useHydratedValue = <T>(
  value: T | undefined,
  setValue: Dispatch<T | undefined>,
  param: T | null | undefined,
  setParam: (
    nuValue: T | null | undefined,
    updateType?: UrlUpdateType | undefined
  ) => void,
  settings?: { keepParam: boolean }
): [t: T | undefined, setT: Dispatch<T | undefined>] => {
  useEffect(() => {
    if (param !== null && param !== undefined) {
      setValue(param)
      if (!settings?.keepParam) {
        setParam(undefined, "replaceIn")
      }
    }
  }, [param, setParam, setValue, settings])

  const hydrated = useMemo(() => {
    return param || value
  }, [param, value])

  return [hydrated, setValue]
}

const useHydratedObject = <T extends {}>(
  value: T | undefined,
  setValue: Dispatch<T | undefined>,
  paramName: string,
  qpConfig: QueryParamConfig<T | undefined | null>
): [t: T | undefined, setT: Dispatch<T | undefined>] => {
  const [param, setParam] = useQueryParam(paramName, qpConfig)

  return useHydratedValue(value, setValue, param, setParam)
}

export const useHydratedPersistantObject = <T extends {}>(
  key: StorageKey,
  paramName: string,
  qpConfig: QueryParamConfig<T | undefined | null>,
  defaultValue?: T
): [t: T | undefined, setT: Dispatch<T | undefined>] => {
  const [value, setValue] = usePersistantObject<T>(key, defaultValue)

  return useHydratedObject(value, setValue, paramName, qpConfig)
}

const useHydratedString = (
  value: string | undefined,
  setValue: Dispatch<string | undefined>,
  paramName: string,
  settings?: { keepParam: boolean }
) => {
  const [param, setParam] = useQueryParam(paramName, StringParam)

  return useHydratedValue(value, setValue, param, setParam, settings)
}

export const useHydratedPersistantString = (
  key: StorageKey,
  paramName: string,
  initialValue?: string,
  settings?: { keepParam: boolean }
) => {
  const [value, setValue] = usePersistentString(key, initialValue)

  return useHydratedString(value, setValue, paramName, settings)
}
