import { Stream } from "@/types/ga4/StreamPicker"
import { useCallback, useMemo } from "react"
import { useSelector } from "react-redux"
import { MPSecret } from "./useMPSecretsRequest"

const useGetMPSecrets = (stream: Stream | undefined) => {
  const gapi = useSelector((a: AppState) => a.gapi)

  const requestReady = useMemo(() => {
    if (gapi === undefined || stream === undefined) {
      return false
    }
    return true
  }, [gapi, stream])

  const getMPSecrets = useCallback(async () => {
    if (gapi === undefined || stream === undefined) {
      throw new Error("Invalid invariant - gapi & stream must be defined here.")
    }
    try {
      const response = await gapi.client.request({
        path: `https://content-analyticsadmin.googleapis.com/v1alpha/${stream.value.name}/measurementProtocolSecrets`,
      })
      console.log({ response })
      return (response.result.measurementProtocolSecrets || []) as MPSecret[]
    } catch (e) {
      console.error(
        "There was an error getting the measurement protocol secrets.",
        e
      )
      throw e
    }
  }, [gapi, stream])

  return { requestReady, getMPSecrets }
}

export default useGetMPSecrets
