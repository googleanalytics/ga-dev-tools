import { useCallback } from "react"
import { useSelector } from "react-redux"
import { AccountPropertyStream } from "../../StreamPicker/useAccountPropertyStream"

const necessaryScopes = ["https://www.googleapis.com/auth/analytics.edit"]

const useCreateMPSecret = (aps: AccountPropertyStream) => {
  const gapi = useSelector((a: AppState) => a.gapi)
  const user = useSelector((a: AppState) => a.user)
  return useCallback(
    async (displayName: string) => {
      if (
        gapi === undefined ||
        aps.stream === undefined ||
        user === undefined
      ) {
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
          path: `https://content-analyticsadmin.googleapis.com/v1alpha/${aps.stream.value.name}/measurementProtocolSecrets`,
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
    [gapi, aps, user]
  )
}

export default useCreateMPSecret
