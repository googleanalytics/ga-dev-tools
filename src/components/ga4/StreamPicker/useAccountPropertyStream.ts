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
}

const useAccountPropertyStream = (
  prefix: StorageKey,
  queryParamKeys: { Account: string; Property: string; Stream: string },
  streams: {
    androidStreams?: boolean
    webStreams?: boolean
    iosStreams?: boolean
  },
  autoFill: boolean = false,
  // TODO - This is only here because there seems to be a bug with
  // use-query-params replaceIn functionality where it also removes the anchor.
  // Need to do a minimum repro and file a bug to that repo.
  keepParam: boolean = false,
  onSetProperty?: (p: PropertySummary | undefined) => void
): AccountPropertyStream & AccountPropertyStreamSetters => {
  const accountProperty = useAccountProperty(
    prefix,
    queryParamKeys,
    autoFill,
    keepParam,
    onSetProperty
  )

  const { property } = accountProperty

  const streamsRequest = useStreams(property, streams)

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

  // This seems like a hacky workaround, but I'm not sure what else the pattern
  // would be here.
  const [needsUpdate, setNeedsUpdate] = useState(false)
  useEffect(() => {
    if (property === undefined) {
      setNeedsUpdate(false)
      setStreamID(undefined)
    } else {
      setNeedsUpdate(true)
    }
  }, [property])

  useEffect(() => {
    if (autoFill) {
      if (successful(streamsRequest) && needsUpdate) {
        console.log("updating stream to first from list", {
          autoFill,
          streamsRequest,
          setStreamID,
        })
        const firstStreamID = successful(streamsRequest)!.streams?.[0]?.value
          ?.name
        setStreamID(firstStreamID)
        setNeedsUpdate(false)
      }
    }
  }, [autoFill, streamsRequest, setStreamID])

  return {
    ...accountProperty,
    stream,
    setStreamID,
    streamsRequest,
  }
}

export default useAccountPropertyStream
