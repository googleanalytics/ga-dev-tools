import { useCallback, useMemo } from "react"
import { useSelector } from "react-redux"

const useFlattenedStreams = () => {
  const gapi = useSelector((a: AppState) => a.gapi)

  const adminAPI = useMemo(() => gapi?.client.analyticsadmin, [gapi])

  const requestSummaries = useCallback(async () => {
    if (adminAPI === undefined) {
      throw new Error(
        "invalid invariant. adminAPI cannot be undefined when this method is called."
      )
    }
    let pageToken: string | undefined = undefined
    let accountSummaries = []
    do {
      pageToken = undefined
      const { result } = await adminAPI.accountSummaries.list({
        pageToken,
      })

      accountSummaries = accountSummaries.concat(result.accountSummaries || [])

      if (result.nextPageToken) {
        pageToken = result.nextPageToken
      }
    } while (pageToken !== undefined)
  }, [adminAPI])
}

export default useFlattenedStreams
