import * as React from "react"
import { useLocation, useNavigate } from "@reach/router"
import { StorageKey, GAVersion } from "./constants"
import { useState, useEffect } from "react"

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
    const fromStorage =
      typeof window === "undefined" ? null : window.localStorage.getItem(key)
    if (fromStorage === null) {
      return initialValue
    }
    return JSON.parse(fromStorage).value
  })

  useEffect(() => {
    if (typeof window === "undefined") {
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
    const fromStorage =
      typeof window === "undefined" ? null : window.localStorage.getItem(key)
    if (fromStorage === null) {
      return undefined || initialValue
    }
    if (fromStorage === "undefined" || fromStorage === "") {
      return undefined
    }
    return JSON.parse(fromStorage).value
  })

  useEffect(() => {
    if (typeof window === "undefined") {
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
    let asString = window.localStorage.getItem(key)
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

// TODO - This probably isn't general and should be moved into place where it
// is used.
//
// Convert a callback taking a boolean into a callback taking
// event.target.checked
export const useEventChecked = (setChecked: (checked: boolean) => void) =>
  React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setChecked(event.target.checked),
    [setChecked]
  )

// TODO - This should probably be replaced with something from gatsby.
export const useHash = () => {
  const [hash, setHash] = React.useState(window.location.hash.replace(/^#/, ""))

  React.useEffect(() => {
    const listener = (ev: HashChangeEvent) => {
      setHash(new URL(ev.newURL).hash.replace(/^#/, ""))
    }

    window.addEventListener("hashchange", listener, { passive: true })

    return () => window.removeEventListener("hashchange", listener)
  }, [])

  return hash
}

// TODO - this probably dosn't need to be a hook, but adding now to get cubes to work.
//
// Convert a callback taking a string into a callback taking event.target.value
export const useEventValue = (setValue: (value: string) => void) =>
  React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setValue(event.target.value),
    [setValue]
  )

export const isServerSide = () => {
  return typeof window === "undefined"
}

const getRedirectPath = (
  path: string,
  version: GAVersion
): string | undefined => {
  switch (version) {
    case GAVersion.UniversalAnalytics: {
      switch (path) {
        // If switching to UA, and you're already on a UA demo, do nothing.
        case "/account-explorer":
        case "/campaign-url-builder":
        case "/dimensions-metrics-explorer":
        case "/enhanced-ecommerce":
        case "/hit-builder":
        case "/query-explorer":
        case "/request-composer":
        case "/spreadsheet-add-on":
        case "/tag-assistant":
          return undefined
        case "/ga4/event-builder":
          return "/hit-builder"
        default:
          return undefined
      }
    }
    case GAVersion.GoogleAnalytics4: {
      switch (path) {
        // If switching to GA4, and you're already on a GA4 demo, do nothing.
        case "/ga4/event-builder":
          return undefined
        case "/hit-builder":
          return "/ga4/event-builder"
      }
    }
  }
  return undefined
}

export const IS_SSR = typeof window === "undefined"

// TODO - IT might be worth looking into creating a hook that only allows
// values from an enum.
export const useGAVersion = (
  pathname: string
): {
  gaVersion: GAVersion
  setGAVersion: (version: GAVersion) => void
} => {
  const location = useLocation()
  const navigate = useNavigate()
  const [string_, setString] = usePersistentString(
    StorageKey.gaVersion,
    GAVersion.UniversalAnalytics
  )
  const gaVersion = React.useMemo(() => {
    if (IS_SSR) {
      if (pathname.includes("/ga4/")) {
        return GAVersion.GoogleAnalytics4
      } else {
        return GAVersion.UniversalAnalytics
      }
    }
    switch (string_) {
      case GAVersion.UniversalAnalytics:
        return GAVersion.UniversalAnalytics
      case GAVersion.GoogleAnalytics4:
        return GAVersion.GoogleAnalytics4
      default:
        throw new Error(`Value: ${string_} is not a valid GAVersion.`)
    }
  }, [string_, pathname])

  const setGAVersion = React.useCallback(
    (version: GAVersion) => {
      const redirectPath = getRedirectPath(location.pathname, version)
      setString(version)
      if (redirectPath === undefined) {
        return
      }
      navigate(redirectPath)
    },
    [setString, location.pathname, navigate]
  )

  return { gaVersion, setGAVersion }
}
