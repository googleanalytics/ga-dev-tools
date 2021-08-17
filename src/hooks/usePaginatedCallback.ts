import { useCallback } from "react"

const usePaginatedCallback = <T, U>(
  requestReady: boolean,
  errorMessage: string,
  paginatedRequest: (pageToken: string | undefined) => gapi.client.Request<U>,
  getTs: (u: U) => T[] | undefined,
  getPageToken: (u: U) => string | undefined,
  onBeforeRequest?: () => void,
  onError?: () => void
): (() => Promise<T[] | undefined>) => {
  return useCallback(async () => {
    try {
      if (!requestReady) {
        throw new Error(errorMessage)
      }
      onBeforeRequest && onBeforeRequest()
      let pageToken: string | undefined = undefined
      let ts: T[] = []
      do {
        pageToken = undefined
        const u = await paginatedRequest(pageToken)

        const nextTs = getTs(u.result)

        ts = ts.concat(nextTs || [])

        const nextPageToken = getPageToken(u.result)

        if (nextPageToken) {
          pageToken = nextPageToken
        }
      } while (pageToken !== undefined)
      return ts
    } catch (e) {
      onError && onError()
    }
  }, [
    requestReady,
    errorMessage,
    paginatedRequest,
    getTs,
    getPageToken,
    onBeforeRequest,
    onError,
  ])
}

export default usePaginatedCallback
