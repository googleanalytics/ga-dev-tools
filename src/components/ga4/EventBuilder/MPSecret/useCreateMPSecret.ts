import { Stream } from "@/types/ga4/StreamPicker"
import { useCallback } from "react"
import { useSelector } from "react-redux"

const necessaryScopes = ["https://www.googleapis.com/auth/analytics.edit"]

const useCreateMPSecret = (stream: Stream | undefined) => {
  const gapi = useSelector((a: AppState) => a.gapi)
  const user = useSelector((a: AppState) => a.user)
  return useCallback(
    async (displayName: string) => {
      if (gapi === undefined || stream === undefined || user === undefined) {
        return
      }
      try {
        if (!user.hasGrantedScopes(necessaryScopes.join(","))) {
          await user.grant({
            scope: necessaryScopes.join(","),
          })
        }
        // TODO - Update this once this is available in the client libraries.
        const response = await gapi.client.request({
          path: `https://content-analyticsadmin.googleapis.com/v1alpha/${stream.value.name}/measurementProtocolSecrets`,
          method: "POST",
          body: JSON.stringify({
            display_name: displayName,
          }),
        })
        return response.result
      } catch (e) {
        if (e?.result?.error?.message !== undefined) {
          throw new Error(e.result.error.message)
        } else {
          throw e
        }
      }
    },
    [gapi, stream, user]
  )
}

export default useCreateMPSecret
