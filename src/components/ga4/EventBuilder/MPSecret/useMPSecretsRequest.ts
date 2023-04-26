import { StorageKey } from "@/constants"
import useCached from "@/hooks/useCached"
import useRequestStatus from "@/hooks/useRequestStatus"
import { Requestable, RequestStatus } from "@/types"
import { Stream } from "@/types/ga4/StreamPicker"
import moment from "moment"
import { useCallback, useEffect } from "react"
import useCreateMPSecret from "./useCreateMPSecret"
import useGetMPSecrets from "./useGetMPSecrets"

interface MPSecrets {
  secrets: MPSecret[] | undefined
  createMPSecret: (displayName: string) => Promise<MPSecret>
}

export interface MPSecret {
  displayName?: string
  name?: string
  secretValue: string
}

interface Args {
  stream: Stream | undefined
}
const useMPSecretsRequest = ({ stream }: Args): Requestable<MPSecrets> => {
  const { status, setFailed, setSuccessful, setInProgress } = useRequestStatus(
    RequestStatus.NotStarted
  )

  const {
    getMPSecrets: getMPSecretsLocal,
    requestReady: getMPSecretsRequestReady,
  } = useGetMPSecrets(stream)

  const createMPSecretLocal = useCreateMPSecret(stream)

  const getMPSecrets = useCallback(async () => {
    setInProgress()
    return getMPSecretsLocal()
  }, [getMPSecretsLocal, setInProgress])

  const onError = useCallback(
    (e: any) => {
      setFailed()
      // TODO - not sure what to do here yet.
      throw e
    },
    [setFailed]
  )

  const { value: secrets, bustCache } = useCached(
    `${StorageKey.eventBuilderMPSecrets}/${stream?.value.name}` as StorageKey,
    getMPSecrets,
    moment.duration(5, "minutes"),
    getMPSecretsRequestReady,
    onError
  )

  const createMPSecret = useCallback(
    async (displayName: string) => {
      const secret = await createMPSecretLocal(displayName)
      await bustCache()
      return secret
    },
    [createMPSecretLocal, bustCache]
  )

  useEffect(() => {
    if (status !== RequestStatus.Successful && secrets !== undefined) {
      setSuccessful()
    }
  }, [secrets, setSuccessful, status])

  if (stream === undefined) {
    return {
      status: RequestStatus.Successful,
      secrets: undefined,
      createMPSecret,
    }
  }

  if (
    status === RequestStatus.NotStarted ||
    status === RequestStatus.InProgress ||
    status === RequestStatus.Failed
  ) {
    return { status }
  } else {
    if (secrets !== undefined) {
      return { status, secrets, createMPSecret }
    } else {
      throw new Error("Invalid invariant - secrets must be defined here.")
      // return { status: RequestStatus.InProgress }
    }
  }
}

export default useMPSecretsRequest
