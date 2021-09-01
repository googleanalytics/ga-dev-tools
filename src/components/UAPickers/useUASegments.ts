import { Segment } from "@/types/ua"
import { createContext, useCallback, useMemo } from "react"
import { useSelector } from "react-redux"
import useCached from "@/hooks/useCached"
import { StorageKey } from "@/constants"
import moment from "moment"
import { Requestable, RequestStatus } from "@/types"

export const UASegmentsRequestCtx = createContext<
  ReturnType<typeof useUASegments>
>({ status: RequestStatus.NotStarted })

interface Successful {
  segments: Segment[]
}

export const useUASegments = (): Requestable<Successful> => {
  const gapi = useSelector((state: AppState) => state.gapi)
  const managementAPI = useMemo(() => gapi?.client.analytics.management, [gapi])

  const requestSegments = useCallback(async () => {
    if (managementAPI === undefined) {
      return Promise.resolve(undefined)
    }
    const response = await managementAPI.segments.list({})
    return response.result.items
  }, [managementAPI])

  const requestReady = useMemo(() => {
    return managementAPI !== undefined
  }, [managementAPI])

  const segmentsRequest = useCached(
    StorageKey.uaSegments,
    requestSegments,
    moment.duration(5, "minutes"),
    requestReady
  )

  return useMemo(() => {
    switch (segmentsRequest.status) {
      case RequestStatus.Successful: {
        const segments = segmentsRequest.value || []
        return {
          status: segmentsRequest.status,
          segments,
        }
      }
      default:
        return { status: segmentsRequest.status }
    }
  }, [segmentsRequest])
}
