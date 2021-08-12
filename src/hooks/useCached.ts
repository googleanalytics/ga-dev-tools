import { StorageKey } from "@/constants"
import moment from "moment"
import { useEffect, useMemo } from "react"
import { usePersistantObject } from "."

const useCached = <T>(
  cacheKey: StorageKey,
  makeRequest: () => Promise<T>,
  maxAge: moment.Duration,
  requestReady: boolean
): T | undefined => {
  const [cached, setCached] = usePersistantObject<{
    "@@_lastFetched": number
    value: T
  }>(cacheKey)

  useEffect(() => {
    if (requestReady === false) {
      return
    }
    if (cached === undefined) {
      makeRequest().then(t => {
        const now = moment.now()
        setCached({ "@@_lastFetched": now, value: t })
      })
    } else {
      const now = moment()
      if (now.isAfter(moment(cached["@@_lastFetched"]).add(maxAge))) {
        makeRequest().then(t => {
          const now = moment.now()
          setCached({ "@@_lastFetched": now, value: t })
        })
      } else {
        return
      }
    }
  }, [requestReady, cached, setCached, makeRequest, maxAge])

  return useMemo(() => cached?.value, [cached])
}

export default useCached
