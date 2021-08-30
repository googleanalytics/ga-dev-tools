import { StorageKey } from "@/constants"
import useCached from "@/hooks/useCached"
import useRequestStatus from "@/hooks/useRequestStatus"
import { Requestable, RequestStatus } from "@/types"
import moment from "moment"
import { useCallback, useEffect } from "react"
import { AccountPropertyStream } from "../../StreamPicker/useAccountPropertyStream"
import useCreateMPSecret from "./useCreateMPSecret"
import useGetMPSecrets from "./useGetMPSecrets"

interface MPSecrets {
  secrets: MPSecret[]
  createMPSecret: (displayName: string) => Promise<MPSecret>
}

export interface MPSecret {
  displayName?: string
  name?: string
  secretValue: string
}

interface Args {
  aps: AccountPropertyStream
}
const useMPSecretsRequest = ({ aps }: Args): Requestable<MPSecrets> => {
  const { status, setFailed, setSuccessful, setInProgress } = useRequestStatus(
    RequestStatus.NotStarted
  )

  useEffect(() => {
    if (aps.stream === undefined) {
      setFailed()
    }
  }, [setFailed, aps.stream])

  const {
    getMPSecrets: getMPSecretsLocal,
    requestReady: getMPSecretsRequestReady,
  } = useGetMPSecrets(aps)

  const createMPSecretLocal = useCreateMPSecret(aps)

  const getMPSecrets = useCallback(async () => {
    setInProgress()
    const secrets = await getMPSecretsLocal()
    return secrets
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
    `${StorageKey.eventBuilderMPSecrets}/${aps.stream?.value.name}` as StorageKey,
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
      console.log({ aps, secrets })
      // throw new Error("Invalid invariant - secrets must be defined here.")
      return { status: RequestStatus.InProgress }
    }
  }
}

export default useMPSecretsRequest
