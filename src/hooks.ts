import * as React from "react"
import { useLocation, useNavigate } from "@reach/router"
import { StorageKey, GAVersion } from "./constants"
import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"

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
  const [value, setValue] = useState<string | undefined>(() => {
    if (overwrite !== undefined) {
      return overwrite
    }
    const fromStorage = IS_SSR ? null : window.localStorage.getItem(key)
    if (fromStorage === null) {
      return undefined || initialValue
    }
    if (fromStorage === "undefined" || fromStorage === "") {
      return undefined
    }
    return JSON.parse(fromStorage).value
  })

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

export const usePersistantObject = <T extends {}>(
  key: StorageKey
): [T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>] => {
  const [value, setValue] = useState(() => {
    if (IS_SSR) {
      return undefined
    }
    let asString = IS_SSR ? null : window.localStorage.getItem(key)
    if (asString === null || asString === "undefined") {
      return undefined
    }
    return JSON.parse(asString)
  })

  useEffect(() => {
    if (IS_SSR) {
      return
    }
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [value, key])

  return [value, setValue]
}

const getRedirectPath = (
  path: string,
  version: GAVersion
): string | undefined => {
  switch (version) {
    case GAVersion.UniversalAnalytics: {
      switch (path) {
        case "/ga4/query-explorer/":
          return "/query-explorer/"
        case "/ga4/event-builder/":
          return "/hit-builder/"
        case "/ga4/dimensions-metrics-explorer/":
          return "/dimensions-metrics-explorer/"
        case "/ga4/campaign-url-builder/":
          return "/campaign-url-builder/"
        default:
          return "/"
      }
    }
    case GAVersion.GoogleAnalytics4: {
      switch (path) {
        case "/hit-builder/":
          return "/ga4/event-builder/"
        case "/dimensions-metrics-explorer/":
          return "/ga4/dimensions-metrics-explorer/"
        case "/query-explorer/":
          return "/ga4/query-explorer/"
        case "/request-composer/":
          return "/ga4/query-explorer/"
        case "/campaign-url-builder/":
          return "/ga4/campaign-url-builder/"
        default:
          return "/ga4/"
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
  const navigate = useNavigate()
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
      const redirectPath = getRedirectPath(location.pathname, version)
      if (redirectPath === undefined) {
        return
      }
      setToast(`redirecting to ${redirectPath}`)
      navigate(redirectPath)
    },
    [location.pathname, navigate, setToast]
  )

  return { gaVersion, setGAVersion }
}
