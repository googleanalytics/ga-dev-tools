import * as React from "react"

import { navigate } from "gatsby"
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

const uaToast = (tool: string) => `Redirecting to the UA ${tool}.`
const ga4Toast = (tool: string) => `Redirecting to the GA4 ${tool}.`

const getRedirectInfo = (
  path: string,
  version: GAVersion
): { redirectPath: string; toast: string } | undefined => {
  switch (version) {
    case GAVersion.UniversalAnalytics: {
      switch (path) {
        case "/ga4/query-explorer/":
          return {
            redirectPath: "/query-explorer/",
            toast: uaToast("Query Explorer"),
          }
        case "/ga4/event-builder/":
          return {
            redirectPath: "/hit-builder/",
            toast: uaToast("Hit Builder"),
          }
        case "/ga4/dimensions-metrics-explorer/":
          return {
            redirectPath: "/dimensions-metrics-explorer/",
            toast: uaToast("Dimensions & Metrics Explorer"),
          }
        case "/ga4/campaign-url-builder/":
          return {
            redirectPath: "/campaign-url-builder/",
            toast: uaToast("Campaign URL Builder"),
          }
        case "/ga4/campaign-url-builder/ios/":
          return {
            redirectPath: "/campaign-url-builder/ios/",
            toast: uaToast("iOS Campaign URL Builder"),
          }
        case "/ga4/campaign-url-builder/play/":
          return {
            redirectPath: "/campaign-url-builder/play/",
            toast: uaToast("play Campaign URL Builder"),
          }
        case "/ga4/":
          return {
            redirectPath: "/",
            toast: "Redirecting to the UA home page.",
          }
        default:
          return {
            redirectPath: "/",
            toast: "No UA demo. Redirecting to the UA home page.",
          }
      }
    }
    case GAVersion.GoogleAnalytics4: {
      switch (path) {
        case "/hit-builder/":
          return {
            redirectPath: "/ga4/event-builder/",
            toast: ga4Toast("Event Builder"),
          }
        case "/dimensions-metrics-explorer/":
          return {
            redirectPath: "/ga4/dimensions-metrics-explorer/",
            toast: ga4Toast("Dimensions & Metrics Explorer"),
          }
        case "/query-explorer/":
          return {
            redirectPath: "/ga4/query-explorer/",
            toast: ga4Toast("Query Explorer"),
          }
        case "/request-composer/":
          return {
            redirectPath: "/ga4/query-explorer/",
            toast: ga4Toast("Query Explorer"),
          }
        case "/campaign-url-builder/":
          return {
            redirectPath: "/ga4/campaign-url-builder/",
            toast: ga4Toast("Campaign URL Builder"),
          }
        case "/campaign-url-builder/ios/":
          return {
            redirectPath: "/ga4/campaign-url-builder/ios/",
            toast: ga4Toast("iOS Campaign URL Builder"),
          }
        case "/campaign-url-builder/play/":
          return {
            redirectPath: "/ga4/campaign-url-builder/play/",
            toast: ga4Toast("Play Campaign URL Builder"),
          }
        case "/":
          return {
            redirectPath: "/ga4/",
            toast: "Redirecting to the GA4 home page.",
          }
        default:
          return {
            redirectPath: "/ga4/",
            toast: "No GA4 demo. Redirecting to the GA4 home page.",
          }
      }
    }
  }
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

export const useGAVersion = (
  pathname: string
): {
  gaVersion: GAVersion
  setGAVersion: (version: GAVersion) => void
} => {
  const location = useLocation()
  const setToast = useSetToast()
  const gaVersion = React.useMemo(() => {
    if (pathname.includes("/ga4/")) {
      return GAVersion.GoogleAnalytics4
    } else {
      return GAVersion.UniversalAnalytics
    }
  }, [pathname])

  const setGAVersion = React.useCallback(
    (version: GAVersion) => {
      const redirectInfo = getRedirectInfo(location.pathname, version)
      if (redirectInfo === undefined) {
        return
      }
      setToast(redirectInfo.toast)
      navigate(redirectInfo.redirectPath)
    },
    [location.pathname, setToast]
  )

  return { gaVersion, setGAVersion }
}

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
