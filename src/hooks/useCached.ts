import { StorageKey } from "@/constants"
import moment from "moment"
import { useCallback, useEffect, useMemo } from "react"
import { usePersistantObject } from "."

interface Cached<T> {
  "@@_lastFetched": number
  "@@_cacheKey": string
  value: T
}

const useCached = <T>(
  cacheKey: StorageKey,
  makeRequest: () => Promise<T>,
  maxAge: moment.Duration,
  requestReady: boolean,
  onError?: (e: any) => void
): { value: T | undefined; bustCache: () => Promise<void> } => {
  const [cached, setCached] = usePersistantObject<Cached<T>>(cacheKey)

  const updateCachedValue = useCallback(async () => {
    if (requestReady === false) {
      return
    }
    try {
      const t = await makeRequest()
      const now = moment.now()
      setCached({ "@@_lastFetched": now, value: t, "@@_cacheKey": cacheKey })
    } catch (e) {
      onError
        ? onError(e)
        : console.error("An unhandled error has occured, ", e)
    }
  }, [makeRequest, setCached, onError, cacheKey, requestReady])

  useEffect(() => {
    if (cached === undefined) {
      updateCachedValue()
    } else {
      const cacheTime = cached["@@_lastFetched"]
      const now = moment()
      if (
        cacheTime === undefined ||
        now.isAfter(moment(cached["@@_lastFetched"]).add(maxAge))
      ) {
        updateCachedValue()
      } else {
        return
      }
    }
  }, [cached, maxAge, onError, updateCachedValue])

  const bustCache = useCallback(async () => {
    await updateCachedValue()
  }, [updateCachedValue])

  return useMemo(() => {
    const now = moment()
    if (now.isAfter(moment(cached?.["@@_lastFetched"]).add(maxAge))) {
      return { value: undefined, bustCache }
    }
    return {
      value: cached?.value,
      bustCache,
    }
  }, [cached, bustCache, maxAge])
}

export default useCached
