import { StorageKey } from "@/constants"
import { useKeyedHydratedPersistantObject } from "@/hooks/useHydrated"
import { Dispatch, Requestable, successful } from "@/types"
import { PropertySummary, Stream } from "@/types/ga4/StreamPicker"
import { useCallback, useEffect, useState } from "react"
import useAccountProperty, {
  AccountProperty,
  AccountPropertySetters,
} from "./useAccountProperty"
import useStreams from "./useStreams"

export interface AccountPropertyStream extends AccountProperty {
  stream: Stream | undefined
  streamsRequest: Requestable<{ streams: Stream[] }>
}

interface AccountPropertyStreamSetters extends AccountPropertySetters {
  setStreamID: Dispatch<string | undefined>
  updateToFirstStream: () => void
}

const useAccountPropertyStream = (
  prefix: StorageKey,
  queryParamKeys: { Account: string; Property: string; Stream: string },
  // TODO - This is only here because there seems to be a bug with
  // use-query-params replaceIn functionality where it also removes the anchor.
  // Need to do a minimum repro and file a bug to that repo.
  keepParam: boolean = false,
  onSetProperty?: (p: PropertySummary | undefined) => void
): AccountPropertyStream & AccountPropertyStreamSetters => {
  const accountProperty = useAccountProperty(
    prefix,
    queryParamKeys,
    keepParam,
    onSetProperty
  )

  const { property } = accountProperty

  const updateToFirstStream = useCallback(() => {
    // I don't really like this, but I'm not sure how else to get this to
    // update correctly.
    setTimeout(() => {
      setSetToFirst(true)
    }, 100)
  }, [])

  const streamsRequest = useStreams(property)

  const getStreamsByID = useCallback(
    (id: string | undefined) => {
      if (!successful(streamsRequest) || id === undefined) {
        return undefined
      }
      const stream = successful(streamsRequest)?.streams.find(
        s => s.value.name === id
      )
      return stream
    },
    [streamsRequest]
  )

  const [stream, setStreamID] = useKeyedHydratedPersistantObject<Stream>(
    `${prefix}-stream` as StorageKey,
    queryParamKeys.Stream,
    getStreamsByID,
    undefined,
    { keepParam }
  )

  const [setToFirst, setSetToFirst] = useState(false)
  useEffect(() => {
    if (successful(streamsRequest) && setToFirst) {
      setStreamID(successful(streamsRequest)?.streams?.[0].value.name)
      setSetToFirst(false)
    }
  }, [streamsRequest, setToFirst, setStreamID])

  return {
    ...accountProperty,
    stream,
    setStreamID,
    streamsRequest,
    updateToFirstStream,
  }
}

export default useAccountPropertyStream
