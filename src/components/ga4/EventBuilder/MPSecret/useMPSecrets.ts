import useGapi from "@/hooks/useGapi"
import { Dispatch, Requestable, RequestStatus } from "@/types"
import { Stream } from "@/types/ga4/StreamPicker"
import { useCallback, useEffect, useState } from "react"

interface MPSecrets {
  secrets: MPSecret[]
  newSecret: (displayName: string) => void
  newSecretStatus: RequestStatus
}

export interface MPSecret {
  displayName?: string
  name?: string
  secretValue: string
}

interface Args {
  stream: Stream | undefined
  setSecret: Dispatch<MPSecret | undefined>
}
const useMPSecrets = ({ stream, setSecret }: Args): Requestable<MPSecrets> => {
  const gapi = useGapi()
  const [status, setStatus] = useState(RequestStatus.NotStarted)
  const [newSecretStatus, setNewSecretStatus] = useState(
    RequestStatus.NotStarted
  )

  const [secrets, setSecrets] = useState<MPSecret[]>()

  useEffect(() => {
    const first = secrets?.[0]
    if (first !== undefined) {
      setSecret(first)
    }
  }, [secrets])

  useEffect(() => {
    setStatus(RequestStatus.NotStarted)
    setSecrets(undefined)
  }, [stream])

  useEffect(() => {
    if (gapi === undefined || stream === undefined) {
      return
    }
    if (status === RequestStatus.NotStarted) {
      setStatus(RequestStatus.InProgress)
      gapi.client
        .request({
          path: `https://content-analyticsadmin.googleapis.com/v1alpha/${stream.name}/measurementProtocolSecrets`,
        })
        .then(response => {
          setSecrets(response.result.measurementProtocolSecrets)
          setStatus(RequestStatus.Successful)
        })
        .catch(e => {
          console.error("error", { e })
        })
    }
  }, [status, gapi, stream])

  const newSecret = useCallback(
    (displayName: string) => {
      if (gapi === undefined || stream === undefined) {
        return
      }
      setNewSecretStatus(RequestStatus.InProgress)
      gapi.client
        .request({
          path: `https://content-analyticsadmin.googleapis.com/v1alpha/${stream.name}/measurementProtocolSecrets`,
          method: "POST",
          body: JSON.stringify({
            display_name: displayName,
          }),
        })
        .then(response => {
          setSecret(response.result)
          setStatus(RequestStatus.NotStarted)
          setNewSecretStatus(RequestStatus.Successful)
        })
        .catch(e => {
          console.error("error", { e })
          setNewSecretStatus(RequestStatus.Failed)
        })
    },
    [gapi, stream, setSecret]
  )

  if (status === RequestStatus.Successful) {
    return { status, secrets: secrets || [], newSecret, newSecretStatus }
  }

  return { status }
}

export default useMPSecrets
