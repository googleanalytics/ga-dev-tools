import { useCallback, useEffect, useMemo } from "react"

import useGapi from "@/hooks/useGapi"
import { Requestable, RequestStatus } from "@/types"
import {
  // AndroidDataStream,
  // IosDataStream,
  PropertySummary,
  Stream,
  // Stream,
  StreamType,
  // WebDataStream,
} from "@/types/ga4/StreamPicker"
import usePaginatedCallback from "@/hooks/usePaginatedCallback"
import useCached from "@/hooks/useCached"
import { StorageKey } from "@/constants"
import moment from "moment"
import useRequestStatus from "@/hooks/useRequestStatus"

type WebStreamsResponse = gapi.client.analyticsadmin.GoogleAnalyticsAdminV1alphaListWebDataStreamsResponse
const getWebStreams = (response: WebStreamsResponse) => response.webDataStreams

const getWebPageToken = (response: WebStreamsResponse) => response.nextPageToken

const useStreams = (
  property: PropertySummary | undefined,
  onComplete?: () => void
): Requestable<{ streams: Stream[] }> => {
  const gapi = useGapi()
  const adminAPI = useMemo(() => gapi?.client.analyticsadmin, [gapi])

  const {
    status: webStreamsStatus,
    setInProgress: setWebStreamInProgress,
    setSuccessful: setWebStreamSuccessful,
    setNotStarted: setWebStreamNotStarted,
    setFailed: setWebStreamFailed,
  } = useRequestStatus()

  useEffect(() => {
    setWebStreamNotStarted()
  }, [property, setWebStreamNotStarted])

  const requestReady = useMemo(
    () => adminAPI !== undefined && property !== undefined,
    [adminAPI, property]
  )
  const paginatedWebStreamsRequest = useCallback(
    (pageToken: string | undefined) => {
      if (adminAPI === undefined || property === undefined) {
        throw new Error(
          "Invalid invariant - property and adminAPI must be defined."
        )
      }
      return adminAPI.properties.webDataStreams.list({
        parent: property?.property!,
        pageToken,
      })
    },
    [adminAPI, property]
  )
  // useEffect(() => {
  //   console.log(
  //     "paginatedWebStreamsRequest changed",
  //     paginatedWebStreamsRequest
  //   )
  // }, [paginatedWebStreamsRequest])
  //
  // What I'm observing.
  //
  // When I change the property, I'm no longer able to choose a stream, because
  // the list of streams doesn't match with the property.
  //
  // The stream dropdown values are correct.
  //
  // The stream values that are wrong are the ones that are used in the getById
  // for the useHydrated call.
  //
  // This is the call happens in the useAccountPropertyStreams.
  const requestWebStreams = usePaginatedCallback(
    requestReady,
    "Invalid invariant - property & adminAPI must be defined.",
    paginatedWebStreamsRequest,
    getWebStreams,
    getWebPageToken,
    setWebStreamInProgress,
    setWebStreamFailed
  )

  const storageKey = useMemo(
    () => `${StorageKey.ga4WebStreams}/${property?.property}` as StorageKey,
    [property?.property]
  )

  const webStreams = useCached(
    storageKey,
    requestWebStreams,
    moment.duration(5, "minutes"),
    requestReady
  )

  useEffect(() => {
    if (webStreams !== undefined) {
      setWebStreamSuccessful()
      onComplete && onComplete()
    }
  }, [setWebStreamSuccessful, webStreams, onComplete])

  if (webStreamsStatus === RequestStatus.Successful) {
    if (webStreams === undefined) {
      throw new Error("Invalid invariant - webStreams must be defined here.")
    }
    return {
      status: RequestStatus.Successful,
      streams: webStreams.map(s => ({
        type: StreamType.WebDataStream,
        value: s,
      })),
    }
  }

  if (webStreamsStatus === RequestStatus.InProgress) {
    return { status: RequestStatus.InProgress }
  }

  if (webStreamsStatus === RequestStatus.Failed) {
    return { status: RequestStatus.Failed }
  }
  return { status: RequestStatus.NotStarted }

  //const requestWebStreams = useCallback(() => {
  //  try {
  //    if (adminAPI === undefined || property === undefined) {
  //      throw new Error(
  //        "Invalid invariant - adminAPI and property must be defined."
  //      )
  //    }
  //    setWebStreamsStatus(RequestStatus.InProgress)
  //    let pageToken: string | undefined = undefined
  //    let streams: WebDataStream[] = []
  //    do {
  //      pageToken = undefined
  //      const {result} = await adminAPI.properties.webDataStreams
  //      .list({
  //        parent: property.property!,
  //        pageToken: webPageToken,
  //      })

  //      streams = streams.concat(
  //        result.webDataStreams || []
  //      )

  //      if (result.nextPageToken) {
  //        pageToken = result.nextPageToken
  //      }
  //    } while (pageToken !== undefined)
  //    setWebStreamsStatus(RequestStatus.Successful)
  //    return streams
  //  } catch (e) {
  //}, [])

  //const requestAndroidStreams = useCallback(() => {
  //  //
  //}, [])

  //const requestIOSStreams = useCallback(() => {
  //  //
  //}, [])

  //const [webStatus, setWebStatus] = useState(RequestStatus.NotStarted)
  //const [web, setWeb] = useState<WebDataStream[]>()
  //const [webPageToken, setWebPageToken] = useState<string>()

  //const [androidStatus, setAndroidStatus] = useState(RequestStatus.NotStarted)
  //const [android, setAndroid] = useState<AndroidDataStream[]>()
  //const [androidPageToken, setAndroidPageToken] = useState<string>()

  //const [iosStatus, setIosStatus] = useState(RequestStatus.NotStarted)
  //const [ios, setIos] = useState<IosDataStream[]>()
  //const [iosPageToken, setIosPageToken] = useState<string>()

  //const streams: Stream[] = useMemo(() => {
  //  return (web || []).concat(android || []).concat(ios || [])
  //}, [web, android, ios])

  //useEffect(() => {
  //  if (property === undefined) {
  //    return
  //  }
  //  if (webStatus === RequestStatus.NotStarted) {
  //    setWebStatus(RequestStatus.InProgress)
  //  }
  //  if (webStatus === RequestStatus.InProgress && gapi !== undefined) {
  //    gapi.client.analyticsadmin.properties.webDataStreams
  //      .list({
  //        parent: property,
  //        pageToken: webPageToken,
  //      })
  //      .then(response => {
  //        const nextToken = response.result.nextPageToken
  //        setWeb((old = []) => old.concat(response.result.webDataStreams || []))
  //        if (nextToken === undefined) {
  //          setWebStatus(RequestStatus.Successful)
  //        } else {
  //          setWebPageToken(nextToken)
  //        }
  //      })
  //      .catch(e => {
  //        console.error({ e })
  //        setWebStatus(RequestStatus.Failed)
  //      })
  //  }
  //}, [gapi, webPageToken, webStatus, property])

  //useEffect(() => {
  //  if (property === undefined) {
  //    return
  //  }
  //  if (androidStatus === RequestStatus.NotStarted) {
  //    setAndroidStatus(RequestStatus.InProgress)
  //  }
  //  if (androidStatus === RequestStatus.InProgress && gapi !== undefined) {
  //    gapi.client.analyticsadmin.properties.androidAppDataStreams
  //      .list({
  //        parent: property,
  //        pageToken: androidPageToken,
  //      })
  //      .then(response => {
  //        const nextToken = response.result.nextPageToken
  //        setAndroid((old = []) =>
  //          old.concat(response.result.androidAppDataStreams || [])
  //        )
  //        if (nextToken === undefined) {
  //          setAndroidStatus(RequestStatus.Successful)
  //        } else {
  //          setAndroidPageToken(nextToken)
  //        }
  //      })
  //      .catch(e => {
  //        console.error({ e })
  //        setWebStatus(RequestStatus.Failed)
  //      })
  //  }
  //}, [gapi, androidPageToken, androidStatus, property])

  //useEffect(() => {
  //  if (property === undefined) {
  //    return
  //  }
  //  if (iosStatus === RequestStatus.NotStarted) {
  //    setIosStatus(RequestStatus.InProgress)
  //  }
  //  if (iosStatus === RequestStatus.InProgress && gapi !== undefined) {
  //    gapi.client.analyticsadmin.properties.iosAppDataStreams
  //      .list({
  //        parent: property,
  //        pageToken: iosPageToken,
  //      })
  //      .then(response => {
  //        const nextToken = response.result.nextPageToken
  //        setIos((old = []) =>
  //          old.concat(response.result.iosAppDataStreams || [])
  //        )
  //        if (nextToken === undefined) {
  //          setIosStatus(RequestStatus.Successful)
  //        } else {
  //          setIosPageToken(nextToken)
  //        }
  //      })
  //      .catch(e => {
  //        console.error({ e })
  //        setWebStatus(RequestStatus.Failed)
  //      })
  //  }
  //}, [gapi, iosPageToken, iosStatus, property])

  // if (
  //   webStatus === RequestStatus.Successful &&
  //   androidStatus === RequestStatus.Successful &&
  //   iosStatus === RequestStatus.Successful
  // ) {
  //   return {
  //     status: webStatus,
  //     web: web || [],
  //     android: android || [],
  //     ios: ios || [],
  //     streams,
  //   }
  // }
  // if (
  //   webStatus === RequestStatus.Failed ||
  //   androidStatus === RequestStatus.Failed ||
  //   iosStatus === RequestStatus.Failed
  // ) {
  //   return { status: RequestStatus.Failed }
  // }
  // if (
  //   webStatus === RequestStatus.NotStarted &&
  //   androidStatus === RequestStatus.NotStarted &&
  //   iosStatus === RequestStatus.NotStarted
  // ) {
  //   return { status: RequestStatus.NotStarted }
  // }
  // return { status: RequestStatus.InProgress }
}

export default useStreams
