import * as React from "react"

import { useLocation } from "@reach/router"
import { useState, useEffect, useCallback } from "react"
import { useDispatch } from "react-redux"

import { StorageKey, GAVersion } from "@/constants"
import { Dispatch } from "@/types"
import copyToClipboard from "copy-to-clipboard"

type UsePersistentBoolean = (
  key: StorageKey,
  initialValue: boolean,
  overwrite?: boolean
) => [boolean, React.Dispatch<React.SetStateAction<boolean>>]
export const usePersistentBoolean: UsePersistentBoolean = (
  key,
  initialValue,
  overwrite
) => {
  const [value, setValue] = useState<boolean>(() => {
    if (overwrite !== undefined) {
      return overwrite
    }
    const fromStorage = IS_SSR ? null : window.localStorage.getItem(key)
    if (fromStorage === null) {
      return initialValue
    }
    return JSON.parse(fromStorage).value
  })

  useEffect(() => {
    if (IS_SSR) {
      return
    }
    window.localStorage.setItem(key, JSON.stringify({ value }))
  }, [value, key])

  return [value, setValue]
}

type UsePersistentString = (
  key: StorageKey,
  initialValue?: string,
  overwrite?: string
) => [
  string | undefined,
  React.Dispatch<React.SetStateAction<string | undefined>>
]

export const usePersistentString: UsePersistentString = (
  key,
  initialValue,
  overwrite
) => {
  if (IS_SSR) {
    // This is okay to disable because this will _only_ be true during server
    // side rendireng
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useState(initialValue)
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [value, setValue] = useState<string | undefined>(() => {
    if (overwrite !== undefined) {
      return overwrite
    }
    const fromStorage = window.localStorage.getItem(key)
    if (fromStorage === null) {
      return initialValue
    }
    if (fromStorage === "undefined" || fromStorage === "") {
      return undefined
    }
    return JSON.parse(fromStorage).value
  })

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (IS_SSR) {
      return
    }
    if (value === undefined) {
      window.localStorage.setItem(key, JSON.stringify(undefined))
    } else {
      window.localStorage.setItem(key, JSON.stringify({ value }))
    }
  }, [value, key])

  return [value, setValue]
}

const getObjectFromLocalStorage = <T>(
  key: StorageKey,
  defaultValue?: T
): T | undefined => {
  if (IS_SSR) {
    return undefined
  }
  let asString = window.localStorage.getItem(key)
  if (asString === null || asString === "undefined") {
    return defaultValue
  }
  return JSON.parse(asString)
}

export const usePersistantObject = <T extends {}>(
  key: StorageKey,
  defaultValue?: T
): [T | undefined, Dispatch<T | undefined>] => {
  if (IS_SSR) {
    // This is okay to disable because this will _only_ be true during server
    // side rendireng
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useState<T | undefined>(defaultValue)
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [localValue, setValueLocal] = useState(() => {
    return getObjectFromLocalStorage(key, defaultValue)
  })

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const setValue: Dispatch<T | undefined> = useCallback(
    v => {
      setValueLocal(old => {
        let nu: T | undefined = undefined
        if (v instanceof Function) {
          nu = v(old)
        } else {
          nu = v
        }
        if (!IS_SSR) {
          window.localStorage.setItem(key, JSON.stringify(nu))
        }
        return nu
      })
    },
    [key]
  )

  // Note - This feels wrong, but I have to depend on localValue changing to
  // catch changes that only happen when setValue is run. Don't remove
  // localValue
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const fromStorage = React.useMemo(() => {
    // We want to depend on localValue so this stays up to date when it's
    // updated, but ultimately we want to use the value from localStorage which
    // we _know_ is going to be up to date when `key` changes.
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    localValue
    return getObjectFromLocalStorage(key, defaultValue)
  }, [key, localValue, defaultValue])

  return [fromStorage, setValue]
}

export const useSetToast = () => {
  const dispatch = useDispatch()
  const setToast = React.useCallback(
    (toast: string) => {
      dispatch({ type: "setToast", toast })
    },
    [dispatch]
  )
  return setToast
}

export const IS_SSR = typeof window === "undefined"

export const useScrollTo = () => {
  const [initialLoad, setInitialLoad] = useState(true)
  const location = useLocation()
  useEffect(() => {
    if (initialLoad && location.hash.startsWith("#")) {
      setInitialLoad(false)
      const element = document.getElementById(location.hash.substr(1))
      if (element) {
        element.scrollIntoView()
      }
    }
  }, [location.hash, initialLoad])
}

export const useAddToArray = <T>(setArray: Dispatch<T[] | undefined>) => {
  return useCallback(
    (nu: T) => {
      setArray((old = []) => old.concat([nu]))
    },
    [setArray]
  )
}

export const useRemoveByIndex = <T>(setArray: Dispatch<T[] | undefined>) => {
  return useCallback(
    (idx: number) => {
      setArray((old = []) => old.filter((_, i) => i !== idx))
    },
    [setArray]
  )
}

export const useUpdateByIndex = <T>(setArray: Dispatch<T[] | undefined>) => {
  return useCallback(
    (idx: number, update: (old: T) => T) => {
      setArray((old = []) =>
        old.map((entry, i) => (i === idx ? update(entry) : entry))
      )
    },
    [setArray]
  )
}

export const useCopy = (toCopy: string, toast?: string): (() => void) => {
  const setToast = useSetToast()

  return React.useCallback(() => {
    copyToClipboard(toCopy)
    toast && setToast(toast)
  }, [toCopy, setToast, toast])
}
