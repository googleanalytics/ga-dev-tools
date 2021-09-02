import { useCallback } from "react"

const MaxPages = 100

const usePaginatedCallback = <T, U>(
  requestReady: boolean,
  errorMessage: string,
  paginatedRequest: (
    pageToken: string | undefined
  ) => Promise<gapi.client.Response<U>>,
  getTs: (u: U) => T[] | undefined,
  getPageToken: (u: U) => string | undefined,
  onBeforeRequest?: () => void
): (() => Promise<T[] | undefined>) => {
  return useCallback(async () => {
    if (!requestReady) {
      throw new Error(errorMessage)
    }
    onBeforeRequest && onBeforeRequest()
    let pageToken: string | undefined = undefined
    let ts: T[] = []
    let page = 0
    do {
      const u = await paginatedRequest(pageToken)

      const nextTs = getTs(u.result)

      ts = ts.concat(nextTs || [])

      const nextPageToken = getPageToken(u.result)
      pageToken = nextPageToken
      page++
    } while (pageToken !== undefined && page < MaxPages)
    if (page >= MaxPages) {
      throw new Error("went past max pagination.")
    }
    return ts
  }, [
    requestReady,
    errorMessage,
    paginatedRequest,
    getTs,
    getPageToken,
    onBeforeRequest,
  ])
}

export default usePaginatedCallback
