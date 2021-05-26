import { Dispatch, Requestable, RequestStatus, successful } from "@/types"
import { PropertySummary, Stream } from "@/types/ga4/StreamPicker"
import { useEffect } from "react"
import useStreams from "./useStreams"

interface Arg {
  stream: Stream | undefined
  property: PropertySummary | undefined
  setStream?: Dispatch<Stream | undefined>
}

interface StreamPicker {
  streams: Stream[]
}

const useStreamPicker = ({
  property,
  stream,
  setStream,
}: Arg): Requestable<StreamPicker> => {
  const streamsRequest = useStreams(property?.property)

  useEffect(() => {
    const done = successful(streamsRequest)
    if (done) {
      const inNewStreams = done.streams.find(a => a.name === stream?.name)
      if (inNewStreams) {
        return
      }
      setStream && setStream(done.streams[0])
    }
  }, [streamsRequest, stream, setStream])

  switch (streamsRequest.status) {
    case RequestStatus.Successful:
      return {
        status: streamsRequest.status,
        streams: successful(streamsRequest)!.streams,
      }
    default:
      return { status: streamsRequest.status }
  }
}

export default useStreamPicker
