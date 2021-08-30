import { useCallback, useEffect, useMemo } from "react"

import { Requestable, RequestStatus } from "@/types"
import { PropertySummary, Stream, StreamType } from "@/types/ga4/StreamPicker"
import usePaginatedCallback from "@/hooks/usePaginatedCallback"
import useCached from "@/hooks/useCached"
import { StorageKey } from "@/constants"
import moment from "moment"
import useRequestStatus from "@/hooks/useRequestStatus"
import { useSelector } from "react-redux"

type WebStreamsResponse = gapi.client.analyticsadmin.GoogleAnalyticsAdminV1alphaListWebDataStreamsResponse
type IOSStreamsResponse = gapi.client.analyticsadmin.GoogleAnalyticsAdminV1alphaListIosAppDataStreamsResponse
type AndroidStreamsResponse = gapi.client.analyticsadmin.GoogleAnalyticsAdminV1alphaListAndroidAppDataStreamsResponse

const getWebStreams = (response: WebStreamsResponse) => response.webDataStreams
const getIOSStreams = (response: IOSStreamsResponse) =>
  response.iosAppDataStreams
const getAndroidStreams = (response: AndroidStreamsResponse) =>
  response.androidAppDataStreams

const getWebPageToken = (response: WebStreamsResponse) => response.nextPageToken
const getIOSPageToken = (response: IOSStreamsResponse) => response.nextPageToken
const getAndroidPageToken = (response: IOSStreamsResponse) =>
  response.nextPageToken

const useStreams = (
  property: PropertySummary | undefined,
  streams: {
    androidStreams?: boolean
    webStreams?: boolean
    iosStreams?: boolean
  },
  onComplete?: () => void
): Requestable<{ streams: Stream[] }> => {
  const gapi = useSelector((a: AppState) => a.gapi)
  const adminAPI = useMemo(() => gapi?.client.analyticsadmin, [gapi])

  const {
    status: webStreamsStatus,
    setInProgress: setWebStreamInProgress,
    setSuccessful: setWebStreamSuccessful,
    setNotStarted: setWebStreamNotStarted,
    setFailed: setWebStreamFailed,
  } = useRequestStatus()

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

  const requestWebStreams = usePaginatedCallback(
    requestReady,
    "Invalid invariant - property & adminAPI must be defined.",
    paginatedWebStreamsRequest,
    getWebStreams,
    getWebPageToken,
    setWebStreamInProgress,
    setWebStreamFailed
  )

  const webStorageKey = useMemo(
    () =>
      `${StorageKey.ga4WebStreams}/${property?.property}/webStreams` as StorageKey,
    [property?.property]
  )

  const { value: webStreams } = useCached(
    webStorageKey,
    requestWebStreams,
    moment.duration(5, "minutes"),
    requestReady && !!streams.webStreams
  )

  useEffect(() => {
    if (webStreams !== undefined) {
      setWebStreamSuccessful()
    }
  }, [setWebStreamSuccessful, webStreams])

  const {
    status: iosStreamsStatus,
    setInProgress: setIOSStreamInProgress,
    setSuccessful: setIOSStreamSuccessful,
    setNotStarted: setIOSStreamNotStarted,
    setFailed: setIOSStreamFailed,
  } = useRequestStatus()

  const paginatedIOSStreamsRequest = useCallback(
    (pageToken: string | undefined) => {
      if (adminAPI === undefined || property === undefined) {
        throw new Error(
          "Invalid invariant - property and adminAPI must be defined."
        )
      }
      return adminAPI.properties.iosAppDataStreams.list({
        parent: property?.property!,
        pageToken,
      })
    },
    [adminAPI, property]
  )

  const requestIOSStreams = usePaginatedCallback(
    requestReady,
    "Invalid invariant - property & adminAPI must be defined.",
    paginatedIOSStreamsRequest,
    getIOSStreams,
    getIOSPageToken,
    setIOSStreamInProgress,
    setIOSStreamFailed
  )

  const iosStorageKey = useMemo(
    () =>
      `${StorageKey.ga4WebStreams}/${property?.property}/iosStreams` as StorageKey,
    [property?.property]
  )

  const { value: iosStreams } = useCached(
    iosStorageKey,
    requestIOSStreams,
    moment.duration(5, "minutes"),
    requestReady && !!streams.iosStreams
  )

  useEffect(() => {
    if (iosStreams !== undefined) {
      setIOSStreamSuccessful()
    }
  }, [setIOSStreamSuccessful, iosStreams])

  const {
    status: androidStreamsStatus,
    setInProgress: setAndroidStreamInProgress,
    setSuccessful: setAndroidStreamSuccessful,
    setNotStarted: setAndroidStreamNotStarted,
    setFailed: setAndroidStreamFailed,
  } = useRequestStatus()

  const paginatedAndroidStreamsRequest = useCallback(
    (pageToken: string | undefined) => {
      if (adminAPI === undefined || property === undefined) {
        throw new Error(
          "Invalid invariant - property and adminAPI must be defined."
        )
      }
      return adminAPI.properties.androidAppDataStreams.list({
        parent: property?.property!,
        pageToken,
      })
    },
    [adminAPI, property]
  )

  const requestAndroidStreams = usePaginatedCallback(
    requestReady,
    "Invalid invariant - property & adminAPI must be defined.",
    paginatedAndroidStreamsRequest,
    getAndroidStreams,
    getAndroidPageToken,
    setAndroidStreamInProgress,
    setAndroidStreamFailed
  )

  const androidStorageKey = useMemo(
    () =>
      `${StorageKey.ga4WebStreams}/${property?.property}/androidStreams` as StorageKey,
    [property?.property]
  )

  const { value: androidStreams } = useCached(
    androidStorageKey,
    requestAndroidStreams,
    moment.duration(5, "minutes"),
    requestReady && !!streams.androidStreams
  )

  useEffect(() => {
    if (androidStreams !== undefined) {
      setAndroidStreamSuccessful()
    }
  }, [setAndroidStreamSuccessful, androidStreams])

  useEffect(() => {
    if (
      (webStreams !== undefined || !streams.webStreams) &&
      (iosStreams !== undefined || !streams.iosStreams) &&
      (androidStreams !== undefined || !streams.androidStreams)
    ) {
      onComplete && onComplete()
    }
  }, [onComplete, webStreams, iosStreams, androidStreams, streams])

  useEffect(() => {
    setWebStreamNotStarted()
    setIOSStreamNotStarted()
    setAndroidStreamNotStarted()
  }, [
    property,
    setWebStreamNotStarted,
    setIOSStreamNotStarted,
    setAndroidStreamNotStarted,
  ])

  if (
    (webStreamsStatus === RequestStatus.Successful || !streams.webStreams) &&
    (iosStreamsStatus === RequestStatus.Successful || !streams.iosStreams) &&
    (androidStreamsStatus === RequestStatus.Successful ||
      !streams.androidStreams)
  ) {
    if (webStreams === undefined && streams.webStreams) {
      throw new Error("Invalid invariant - webStreams must be defined here.")
    }
    if (iosStreams === undefined && streams.iosStreams) {
      throw new Error("Invalid invariant - iosStreams must be defined here.")
    }
    if (androidStreams === undefined && streams.androidStreams) {
      throw new Error(
        "Invalid invariant - androidStreams must be defined here."
      )
    }
    return {
      status: RequestStatus.Successful,
      streams: (streams.webStreams ? webStreams! : [])
        .map(s => ({
          type: StreamType.WebDataStream,
          value: s,
        }))
        .concat(
          (streams.iosStreams ? iosStreams! : []).map(s => ({
            type: StreamType.IOSDataStream,
            value: s,
          }))
        )
        .concat(
          (streams.androidStreams ? androidStreams! : []).map(s => ({
            type: StreamType.AndroidDataStream,
            value: s,
          }))
        ),
    }
  }

  if (
    webStreamsStatus === RequestStatus.InProgress ||
    iosStreamsStatus === RequestStatus.InProgress ||
    androidStreamsStatus === RequestStatus.InProgress
  ) {
    return { status: RequestStatus.InProgress }
  }

  if (
    webStreamsStatus === RequestStatus.Failed ||
    iosStreamsStatus === RequestStatus.Failed ||
    androidStreamsStatus === RequestStatus.Failed
  ) {
    return { status: RequestStatus.Failed }
  }
  return { status: RequestStatus.NotStarted }
}

export default useStreams
