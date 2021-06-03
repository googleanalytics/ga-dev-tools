import { StorageKey } from "@/constants"
import { Dispatch } from "@/types"
import { useEffect, useMemo } from "react"
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
  ) => void
): [t: T | undefined, setT: Dispatch<T | undefined>] => {
  useEffect(() => {
    if (param !== null && param !== undefined) {
      setValue(param)
      setParam(undefined, "replaceIn")
    }
  }, [param, setParam, setValue])

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
  paramName: string
) => {
  const [param, setParam] = useQueryParam(paramName, StringParam)

  return useHydratedValue(value, setValue, param, setParam)
}

export const useHydratedPersistantString = (
  key: StorageKey,
  paramName: string,
  initialValue?: string
) => {
  const [value, setValue] = usePersistentString(key, initialValue)

  return useHydratedString(value, setValue, paramName)
}
