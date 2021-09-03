import { StorageKey } from "@/constants"
import { Requestable, RequestStatus } from "@/types"
import moment from "moment"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { usePersistantObject } from "."
import useRequestStatus from "./useRequestStatus"

interface Cached<T> {
  "@@_lastFetched": number
  "@@_cacheKey": string
  value: T
}

const cacheValueValid = <T>(
  cached: Cached<T> | undefined,
  maxAge: moment.Duration
): boolean => {
  const now = moment()
  const cacheTime = cached?.["@@_lastFetched"]

  if (cacheTime === undefined || now.isAfter(moment(cacheTime).add(maxAge))) {
    return false
  }
  return true
}

interface Successful<T> {
  value: T
  bustCache: () => Promise<void>
}

interface Failed<E = any> {
  error: E | undefined
}

const useCached = <T, E = any>(
  cacheKey: StorageKey,
  makeRequest: () => Promise<T>,
  maxAge: moment.Duration,
  requestReady: boolean
): Requestable<Successful<T>, {}, {}, Failed<E>> => {
  const hasThrown = useRef(false)
  const [cached, setCached] = usePersistantObject<Cached<T>>(cacheKey)
  const { status, setInProgress, setFailed, setSuccessful } = useRequestStatus(
    cacheValueValid(cached, maxAge)
      ? RequestStatus.Successful
      : RequestStatus.InProgress
  )
  const [error, setError] = useState<E>()

  const updateCachedValue = useCallback(async () => {
    if (!requestReady || hasThrown.current === true) {
      return
    }
    try {
      setInProgress()
      const t = await makeRequest()
      const now = moment.now()
      setCached({ "@@_lastFetched": now, "@@_cacheKey": cacheKey, value: t })
      setSuccessful()
    } catch (e) {
      hasThrown.current = true
      setError(e)
      setFailed()
    }
  }, [
    makeRequest,
    setCached,
    cacheKey,
    requestReady,
    setSuccessful,
    setFailed,
    setInProgress,
  ])

  useEffect(() => {
    if (hasThrown.current) {
      return
    }
    if (cached === undefined) {
      updateCachedValue()
    } else {
      const now = moment()
      const cacheTime = cached["@@_lastFetched"]
      if (
        cacheTime === undefined ||
        now.isAfter(moment(cacheTime).add(maxAge))
      ) {
        updateCachedValue()
      } else {
        return
      }
    }
  }, [requestReady, cached, setCached, makeRequest, maxAge, updateCachedValue])

  const bustCache = useCallback(async () => {
    return updateCachedValue()
  }, [updateCachedValue])

  return useMemo(() => {
    switch (status) {
      case RequestStatus.NotStarted:
        return { status }
      case RequestStatus.InProgress:
        return { status }
      case RequestStatus.Failed: {
        return { status, error }
      }
      case RequestStatus.Successful: {
        // If the cache is undefined, but the status is Successful, that means
        // the key was just changed.
        if (cached === undefined) {
          return { status: RequestStatus.InProgress }
        }
        return { status, value: cached.value, bustCache }
      }
    }
  }, [status, cached, bustCache, error])
}

export default useCached
